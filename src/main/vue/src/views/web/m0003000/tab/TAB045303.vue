/** 제조 실적 입력 > 포장/출하 > 출하 검사 > 출하검사 결과입력 */
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
    <div class="worker_wrap">
      <div class="title">입력 정보</div>
      <div class="row worker_info">
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="User" v-model="params.user" />
            <label for="floating">검사자</label>
          </div>
        </b-col>
      </div>
    </div>
    <div class="grid_box material_box">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="main" @click="tempSaveClick">임시저장</b-button>
          <b-button class="main" @click="holdClick">HOLD 처리</b-button>
          <b-button class="second" @click="fileAttach">검사결과 파일 업로드</b-button>
          <b-button class="main" @click="inspectionClick">완료</b-button>
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
  name: 'DW_TAB045303',
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
        user: '',
        si: '인계 완료',
      },
      isProcessing: false,
      isValidateCellsGrid1: false,
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    prodCtg() {
      return this.userAuthInfo.selectedProdCtg;
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
      this.grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB045303.js`));
      //grid1View.onValidateColumn = myHandler;
    },
    async getSelectOptions() {
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      this.params.user = this.userAuthInfo.loginUserName; //검사자
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
            si : '인계 완료'
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

    async tempSaveClick() {
      this.grid1View.commit();
      if (await this.tempSaveData()) {
        this.searchClick();
      }
    },
    async tempSaveData() {
      let result = false;

      let rows = this.grid1View.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return result;
      }
      //this.$toast('warning',rows);
      if (_.isEmpty(this.params.user)) {
        this.$toast('info', '검사자를 입력 후 임시저장을 누르세요.');
        return result;
      }

      let current = new Date();
      let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
      rows.forEach((dataRow) => {
        this.data1Provider.setValue(dataRow, 'si검사자', this.params.user);
        this.data1Provider.setValue(dataRow, 'si검사일', cDate);
      });

      this.grid1View.commit();
      
      //선택한 행 가져오기
      const updated = [];
      updated.push(this.data1Provider.getJsonRow(rows));

      // SI진행단계 속성 추가 또는 업데이트
      updated.forEach(item => {
        item.si진행단계 = '인계 완료';
      });

      let param = {
        menuId: 'M0003009',
        update: [{ queryId: 'M0003009_Update_Inspection', data: updated }],
      };

      const resp = await this.$axios.api.saveData(param);
      let info = resp[0];

      if (resp.status === 'success') {
        this.$toast('success', `검사결과가 임시저장 되었습니다.`);
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },

    async inspectionClick() {
      this.grid1View.commit();
      if (await this.inspectionData()) {
        this.searchClick();
      }
    },
    async inspectionData() {
      let result = false;

      let rows = this.grid1View.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return result;
      }
      //this.$toast('warning',rows);
      if (_.isEmpty(this.params.user)) {
        this.$toast('info', '검사자를 입력 후 다시 완료를 누르세요.');
        return result;
      }

      let current = new Date();
      let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
      rows.forEach((dataRow) => {
        this.data1Provider.setValue(dataRow, 'si검사자', this.params.user);
        this.data1Provider.setValue(dataRow, 'si검사일', cDate);
      });

      this.grid1View.commit();

      //선택한 행 가져오기
      const updated = [];
      updated.push(this.data1Provider.getJsonRow(rows));

      if (updated[0].외관 === null || updated[0].엣지 === null || updated[0].포장이물 === null || updated[0].curl === null || updated[0].접촉각 === null || updated[0].pf저항 === null || updated[0].치수 === null || updated[0].두께 === null || updated[0].강화특성 === null || updated[0].이형력 === null || updated[0].점착력 === null || updated[0].굴곡강도 === null || updated[0].최종결과 === null) {
        this.$toast('warn', '검사결과/최종결과를 모두 입력하세요.'); // 출력됨
        return;
      }

      // SI진행단계 속성 추가 또는 업데이트
      updated.forEach(item => {
        item.si진행단계 = '검사 완료';
      });

      let param = {
        menuId: 'M0003009',
        update: [{ queryId: 'M0003009_Update_Inspection', data: updated }],
      };

      const resp = await this.$axios.api.saveData(param);
      let info = resp[0];

      if (resp.status === 'success') {
        this.$toast('success', `검사결과가 저장되었습니다.`);
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
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
        dialogTitle: '검사결과 파일 업로드',
        groupId: curGroupId,
      });
    },
    async holdClick() {
      let rows = this.grid1View.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return;
      }
      let requestDate = this.grid1View.getValue(rows[0], 'si의뢰일');
      let requestNumber = this.grid1View.getValue(rows[0], '의뢰차수');
      let model = this.grid1View.getValue(rows[0], 'model');
     // this.$toast('info',requestDate+'-'+requestNumber+'-'+model);

      let params = {
        reqDate : requestDate,
        reqNo   : requestNumber,
        model: model,
      };

      let searchParam = {
        menuId: 'M0003009',
        queryId: 'M0003009_GetHoldRunList',
        queryParams: params,
        target: null,
      };

      let result = await this.$axios.api.search(searchParam);
     // this.$toast('warning', JSON.stringify(result, null, 2));  
      if (result.length > 0) {
        const addItems = [];
        result.forEach((item) => {
          if (!_.isEmpty(item.runno)) {
            addItems.push(item.runno);
          }
        });

        if (addItems.length == 0) {
          this.$toast('info', 'HOLD 처리할 Run List가 없습니다.');
          return;
        }

        let params1 = {
           runNoList: addItems.join(','),
         };
        this.$toast('info',params1);
        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_SetHoldRunList',
          queryParams: params1,
          target: null,
        };

        const resp = await this.$axios.api.search(searchParam);
        if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
          this.$toast('error', resp[0].errormessage);
        } else {
          this.$alert('확인', `${addItems.length}건 Run HOLD 처리 되었습니다.`, async (confirmed) => {
            if (confirmed) {
              const menu1 = this.$utils.findMenu(this.menuList, this.prodCtg, '제조 실적 관리');
              const menu2 = this.$utils.findMenu(this.menuList, this.prodCtg, 'HOLD 관리');

              let tabEvent = 'M0004003MenuMove';
              let params2 = {
                startDate: this.srchInfo.startDate,
                endDate: this.srchInfo.endDate,
              };

              this.$eventBus.emit('menuMoveClick', {
                menu: this.$utils.createMenuData(menu1, menu2, menu2 != null ? menu2.childSysResc[0] : menu2),
                callback: () => {
                  this.$eventBus.emit(tabEvent, params2);
                },
              });
            }
          });
        }
      } else {
        this.$toast('info', 'HOLD 처리할 Run List가 없습니다.');
      }
    },
    validateCellsGrid1() {
      this.isValidateCellsGrid1 = true;
      let error = this.grid1View.validateCells(null, false);
      this.isValidateCellsGrid1 = false;
      return error;
    },
    onDataLoadComplatedGrid1(grid) {},
    onValidateColumngrid1(grid, column, inserting, value, itemIndex, dataRow) {
      let error = {};
      if (!this.isValidateCellsGrid1) return error;

      if (column.fieldName === '외관' || column.fieldName === '엣지' || column.fieldName === '포장이물' || column.fieldName === 'curl' || column.fieldName === '접촉각' || column.fieldName === 'pf저항' || column.fieldName === '치수' || column.fieldName === '두께' || column.fieldName === '강화특성' || column.fieldName === '이형력' || column.fieldName === '점착력' || column.fieldName === '굴곡강도' || column.fieldName === '최종결과') {
        if (value === null || _.isEmpty(value)) {
          //error.level = 'warning';
          //error.message = '필수 입력입니다.';
          this.$toast('error', column.fieldName + '컬럼은 필수 입력입니다.');
        }
      }
      return error;
    }, 
  },
};
</script>
