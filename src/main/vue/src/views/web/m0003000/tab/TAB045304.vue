/** 제조 실적 입력 > 포장/출하 > 출하 검사 > 출하검사 결과조회 */
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
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
          <b-button class="second" @click="fileAttach">검사결과 파일 조회</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="grid1" :uid="'grid1'" :rows="grid1Rows" style="height: 100%" />
      </div>
    </div>
    <FileAttachPopup ref="fileAttachPopup1" />
  </div>
</template>

<script>
import { useM0003009 } from '@web/store/M0003009.js';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: 'DW_TAB045304',
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
      grid1Rows: [],
      grid1: null,
      params: {
        startDate: '',
        endDate: '',
        si: '검사 완료',
      },
      isProcessing: false,
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    grid1View() {
      return this.$refs.grid1.getGridView();
    },
    data1Provider() {
      return this.$refs.grid1.getGridDataProvider();
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
      this.grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB045304.js`));
    },
    async getSelectOptions() {
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;
    },
    clearGrid() {
      this.grid1View.resetFilters();
      this.grid1View.clearCurrent();
      this.data1Provider.clearRows();
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.clearGrid();

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          return;
        }

        let params = {
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
          si : '검사 완료'
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch45',
          queryParams: params,
          target: this.grid1Rows,
        };

        let result1 = await this.$axios.api.search(searchParam);
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    fileAttach() {
      let rows = this.grid1View.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return;
      } else if (rows.length > 1) {
        this.$toast('info', '한개만 선택하세요.');
        return;
      }

      let requestDate = this.grid1View.getValue(rows[0], 'si의뢰일');
      let inspectionDate = this.grid1View.getValue(rows[0], 'si검사일');
      let model = this.grid1View.getValue(rows[0], 'model');
      let requestNumber = this.grid1View.getValue(rows[0], '의뢰차수');

      if (_.isEmpty(requestDate) || _.isEmpty(inspectionDate) || _.isEmpty(model) || _.isEmpty(requestNumber)) {
        this.$toast('info', '의뢰일/검사일/모델/차수가 모두 있는 행을 선택하세요.');
        return;
      }

      let curGroupId = 'M0003009' + '_' + requestDate + inspectionDate + model + requestNumber;
      this.curGroupId = this.$refs.fileAttachPopup1.openDialog({
        dialogTitle: '검사결과 파일 조회',
        groupId: curGroupId,
        isModifyEnabled: false,
      });
    },
    onDataLoadComplatedGrid1(grid) {},
  },
};
</script>
