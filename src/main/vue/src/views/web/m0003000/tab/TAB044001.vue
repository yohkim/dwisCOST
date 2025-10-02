/** 포장/출하 > 내포장 > [MANNUAL] ORIGIN */
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3">
          <label class="ms-2"><input type="radio" v-bind:value="gubunList[0]" v-model="params.gubun" class="me-1"  @change="changeGubun" />폐기분</label>
          <label class="ms-3 me-3"><input type="radio" v-bind:value="gubunList[1]" v-model="params.gubun" class="me-1"  @change="changeGubun"/>생성분</label>
          <label><input type="radio" v-bind:value="gubunList[2]" v-model="params.gubun" class="me-1"  @change="changeGubun"/>미생성</label>
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
          <b-button class="main" @click="quantityChangeClick" v-show="params.gubun == '미생성'">수량수정</b-button>
          <b-button class="second" :disabled="isExcelExportDisabled" @click="excelClick">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="originGrid" :uid="'originGrid'" :rows="originRows" style="height: 100%" />
      </div>
    </div>
    <OriginMgtPopup ref="originMgtPopup" @confirm="searchClick" />
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import OriginMgtPopup from '../../popup/OriginMgtPopup.vue';
import { useM0003009 } from '@web/store/M0003009.js';

export default {
  name: 'DW_TAB044001',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {
    OriginMgtPopup,
  },
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
      originRows: [],
      originGrid: null,
      params: {
        startDate: this.srchInfo.startDate,
        endDate: this.srchInfo.endDate,
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
    originGridView() {
      return this.$refs.originGrid.getGridView();
    },
    dataProvider() {
      return this.$refs.originGrid.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.originGrid = _.cloneDeep(require(`@web/m0003000/js/TAB044001.js`));
    },
    async getSelectOptions() {
      this.params.gubun = '미생성';
      this.originGridView.setCheckBar({ visible: true, exclusive: true });

      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;
    },
    clearClick() {
      this.originGridView.resetFilters();
      this.originGridView.clearCurrent();

      this.params.gubun = '미생성';
      this.originGridView.setCheckBar({ visible: true, exclusive: true });
      
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;
      this.originGridView.setColumnProperty('packNo', 'visible', false);
      this.originGridView.setColumnProperty('boxNo', 'visible', false);

      this.$nextTick(async () => {
        this.originGridView.resetFilters();
        this.originGridView.clearCurrent();

        if (_.isEmpty(this.params.gubun)) {
          const message = `구분을 선택하세요`;
          this.$toast('info', message);
          return;
        }

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.endDate, this.srchInfo.endDate)) {
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
            queryId: 'M0003009_Sch1',
            queryParams: params,
            target: this.originRows,
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
    changeGubun() {
      if(this.params.gubun == '미생성') {
        this.originGridView.setCheckBar({ visible: true, exclusive: true }); 
      } else {
        this.originGridView.setCheckBar({ visible: false, exclusive: true }); 
      }
      this.searchClick();
    },
    async excelClick() {
      const grid = this.originGridView;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `포장/출하_내포장실적_ORIGIN관리_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
    quantityChangeClick() {
      let rows = this.originGridView.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return;
      } else if (rows.length != 1) {
        this.$toast('info', '한개만 선택해주세요');
        return;
      }

      let gubun = this.dataProvider.getValue(rows[0], '구분');
      if(gubun != '미생성') {
        this.$toast('info', '미생성으로 재조회 후 선택해주세요.');
        return;
      }

      let params = {
        runNo: this.dataProvider.getValue(rows, 'runNo'),
        originNo: this.dataProvider.getValue(rows, 'originNo'),
      };

      this.$refs.originMgtPopup.openDialog(params);
    },
  },
};
</script>
