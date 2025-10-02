<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Step" v-model="params.step" ref="stepField" />
            <label for="floating">종류</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Type" v-model="params.type" ref="typeField" />
            <label for="floating">타입</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Model" v-model="params.model" ref="modelField" />
            <label for="floating">모델</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="CstNo" v-model="params.cstNo" ref="cstNoField" name="cstNo" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter" />
            <label for="floating">CST NO</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Status" v-model="params.status" ref="statusField" />
            <label for="floating">상태</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="StatusValue" v-model="params.statusValue" ref="statusValueField" />
            <label for="floating">상태값</label>
          </div>
        </b-col>
        <b-col cols="3" class="period mt-2">
          <div class="form-floating me-1">
            <date-picker label="시작일" v-model="params.startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="종료일" v-model="params.endDate" />
            <label for="floatingPicker">종료일</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchClick">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="grid_box search_tworow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" :disabled="isExcelExportDisabled" @click="excelClick">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="cstGrid" :uid="'cstGrid'" :rows="cstRows" style="height: 100%" />
      </div>
    </div>
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: 'TAB074002',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {},
  watch: {},
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  data() {
    return {
      menuId: 'M0007005',
      searchQueryId: 'M0007005_Sch3',
      params: {
        step: null,
        type: null,
        model: null,
        cstNo: null,
        status: null,
        statusValue: null,
        startDate: '',
        endDate: '',
      },
      cstGrid: null,
      cstRows: [],
      isProcessing: false,
      isExcelExportDisabled: true,
    };
  },
  computed: {
    cstGridDataProvider() {
      return this.$refs.cstGrid.getGridDataProvider();
    },
    cstGridView() {
      return this.$refs.cstGrid.getGridView();
    },
  },
  created() {
    this.initialize();
    this.initializeGrid();
  },
  mounted() {
    this.$eventBus.on('TAB075003MenuMove', this.tabMove);
  },
  beforeUnmount() {
    this.$eventBus.off('TAB075003MenuMove');
  },
  methods: {
    initialize() {
      var current = new Date();
      this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      var oneMonthAgo = new Date();
      oneMonthAgo.setMonth(current.getMonth() - 1);
      this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;
    },
    initializeGrid() {
      this.cstGrid = _.cloneDeep(require(`@web/m0007000/js/TAB075003.js`));
    },
    tabMove(data) {
      this.$nextTick(() => {
        if (!_.isEmpty(data) && this.$utils.isRequiredFieldsFilled(data, ['종류', '타입', '모델', 'cstNo'])) {
          this.params.step = data['종류'];
          this.params.type = data['타입'];
          this.params.model = data['모델'];
          this.params.cstNo = data['cstNo'];
          this.searchClick();
        }
      });
    },
    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },
    handleEnter(event) {
      event.preventDefault(); // 기본 이벤트 방지
      this.searchClick(); // 검색 실행

      this.$refs.cstNoField.focus();
      this.$refs.cstNoField.select();
    },
    searchClick() {
      if (this.isProcessing) return;
      if (this.cstGridView != null) this.cstGridView.clearCurrent();
      this.isProcessing = true;

      this.$nextTick(async () => {
        if (!this.$utils.validateStartDateEndDate(this.params.startDate, this.params.endDate)) {
          return;
        }

        this.cstGridView.commit();
        this.cstGridDataProvider.clearRows();

        let params = {
          step: this.params.step,
          type: this.params.type,
          model: this.params.model,
          cstNo: this.params.cstNo,
          status: this.params.status,
          statusValue: this.params.statusValue,
          startDate: this.params.startDate.toString().replaceAll('-', ''),
          endDate: this.params.endDate.toString().replaceAll('-', ''),
        };

        let searchParam = [
          {
            menuId: this.menuId,
            queryId: this.searchQueryId,
            queryParams: params,
            target: this.cstRows,
          },
        ];
        let result = await this.$axios.api.searchAll(searchParam);
        if (result[0].length == 0) {
          this.isExcelExportDisabled = true;
          return;
        }
        this.isExcelExportDisabled = false;
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    clearClick() {
      this.params.step = null;
      this.params.type = null;
      this.params.model = null;
      this.params.cstNo = null;
      this.params.status = null;
      this.params.statusValue = null;

      var current = new Date();
      this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      var oneMonthAgo = new Date();
      oneMonthAgo.setMonth(current.getMonth() - 1);
      this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      this.cstGridDataProvider.clearRows();
    },
    async excelClick() {
      const grid = this.cstGridView;
      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `CassetteInspectionHistory_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

      const options = {
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: '엑셀 Export중입니다.',
        indicator: 'hidden',
        done: function () {
          alert('엑셀 내보내기가 완료되었습니다!');
        },
      };

      grid.exportGrid(options);
    },
  },
};
</script>
