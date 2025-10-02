/** 포장/출하 > 내포장 > ORIGIN 조회 */
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3">
          <label class="ms-2"><input type="radio" v-bind:value="gubunList[0]" v-model="params.gubun" class="me-1"/>폐기분</label>
          <label class="ms-3 me-3"><input type="radio" v-bind:value="gubunList[1]" v-model="params.gubun" class="me-1"/>생성분</label>
          <label><input type="radio" v-bind:value="gubunList[2]" v-model="params.gubun" class="me-1"/>미생성</label>
        </b-col>

        <b-col cols="3" class="period">
          <div class="form-floating me-1">
            <date-picker label="시작일" v-model="srchInfo.startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="종료일" v-model="srchInfo.endDate" />
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

    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" :disabled="isExcelExportDisabled" @click="excelClick">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="removeGrid" :uid="'removeGrid'" :rows="removeRows" style="height: 100%" />
      </div>
    </div>
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { useM0003009 } from '@web/store/M0003009.js';

export default {
  name: 'DW_TAB044005',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {},
  setup() {
		const srchInfo = useM0003009();
    const userAuthInfo = useUserAuthInfo();
    return { 
			srchInfo,
      userAuthInfo 
    };
  },
  watch: {},
  data() {
    return {
      removeRows: [],
      removeGrid: null,
      params: {
        startDate: '',
        endDate: '',
        gubun: '미생성',
      },
      isExcelExportDisabled: true,
      gubunList: ['폐기분', '생성분', '미생성'],
      isProcessing: false,
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    removeGridView() {
      return this.$refs.removeGrid.getGridView();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    //this.getSelectOptions();
  },
  beforeUnmount() {
  },
  methods: {
    initializeGrid() {
      this.removeGrid = _.cloneDeep(require(`@web/m0003000/js/TAB044005.js`));
    },
    async getSelectOptions() {
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;
    },
    clearClick() {
      this.removeGridView.resetFilters();
      this.removeGridView.clearCurrent();
      
      this.params.gubun = '미생성';

      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.removeGridView.resetFilters();
        this.removeGridView.clearCurrent();

        if (_.isEmpty(this.params.gubun)) {
          const message = `구분을 선택하세요`;
          this.$toast('info', message);
          return;
        }

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          return;
        }

        let params = {
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
          gubun: !_.isEmpty(this.params.gubun) ? this.params.gubun : '',
        };

        let searchParam = [
          {
            menuId: 'M0003009',
            queryId: this.params.gubun === '미생성' ? 'M0003009_Sch5_1' : 'M0003009_Sch5',
            queryParams: params,
            target: this.removeRows,
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
    async excelClick() {
      const grid = this.removeGridView;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `포장/출하_내포장실적_이물제거_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

      const options = {
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: '엑셀 Export중입니다.',
        done: function () {
          alert('엑셀 내보내기가 완료되었습니다!');
        },
      };

      grid.exportGrid(options);
    },
  },
};
</script>
