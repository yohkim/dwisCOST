/** 제조 실적 입력 > 포장/출하 > 출하 대기 > Pallet 구성 */
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
        <div class="title">현황</div>
      </div>
      <div class="grid-border-none" style="height: 145px">
        <RealGrid ref="grid1" class="brd_b" :uid="'grid1'" :rows="grid1Rows" style="height: 100%" :fitLayoutWidthEnable="false"/>
      </div>
      <div class="worker_wrap">
        <div class="title">입력 정보</div>
        <div class="row worker_info">
          <b-col cols="3" class="d-flex">
            <div class="form-floating" style="width: calc(100%)">
              <input autocomplete="off" type="text" class="form-control form-control-sm label-60" id="floating" placeholder="User1" v-model="params.user1" />
              <label for="floating">발행자</label>
            </div>
          </b-col>
          <b-col cols="3" class="d-flex">
            <div class="form-floating" style="width: calc(100%)">
              <input autocomplete="off" type="text" class="form-control form-control-sm label-60" id="floating" placeholder="User2" v-model="params.user2" />
              <label for="floating">승인자</label>
            </div>
          </b-col>
        </div>

        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="storageClick">보관 구역 조회</b-button>
          <b-button class="main" @click="startClick">구성 시작</b-button>
          <b-button class="main" @click="saveClick">저장</b-button>
        </div>
      </div>
      <div class="grid-border-none" style="height: calc(100% - 80px - 145px)">
        <RealGrid ref="grid2" :uid="'grid2'" :rows="grid2Rows" style="height: 100%" />
      </div>
    </div>
    <StorageArea ref="storageAreaPopup" @confirm="confirmClick" />
  </div>
</template>

<script>
import { useM0003009 } from '@web/store/M0003009.js';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import StorageArea from '../../popup/StorageArea.vue';

export default {
  name: 'DW_TAB045402',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {
    StorageArea,
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
      grid1Rows: [],
      grid1: null,
      grid2Rows: [],
      grid2: null,
      params: {
        startDate: '',
        endDate: '',
        user1: '',
        user2: '',
      },
      validModel: null,
      isProcessing: false,
      emptyRow: { palletNo: '', packQrno: '', 대포장Qrno: '', 검사결과: '', NG사유: '', si의뢰일자: '', boxno검증: '', model: '', cell수량: '' },
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    grid1View() {
      return this.$refs.grid1.getGridView();
    },
    grid2View() {
      return this.$refs.grid2.getGridView();
    },
    data1Provider() {
      return this.$refs.grid1.getGridDataProvider();
    },
    data2Provider() {
      return this.$refs.grid2.getGridDataProvider();
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
      this.grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB045402_1.js`));
      this.grid2 = _.cloneDeep(require(`@web/m0003000/js/TAB045402_2.js`));
    },
    async getSelectOptions() {
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      this.params.user1 = this.userAuthInfo.loginUserName;
      this.params.user2 = this.userAuthInfo.loginUserName;
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.grid1View.resetFilters();
        this.grid1View.clearCurrent();
        this.data1Provider.clearRows();

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          return;
        }

        let params = {
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch21_Col',
          queryParams: params,
          target: null,
        };

        let result1 = await this.$axios.api.search(searchParam);
        const gridField = _.cloneDeep(require(`@web/m0003000/js/TAB045402_1.js`)); 

        let fn = "total";
        let veList = [];
         result1.forEach((item) => {
          veList.push("values['"+item.model.toLowerCase()+ "']");
         });
        // 행 합계 컬럼 추가
        gridField.fields.push({fieldName: fn,dataType: 'number',valueExpression:veList.join("+")});
        gridField.columns.push({name: fn,fieldName: fn,width: 80,header: {text: "합계"},editable: false,styleName: "tr",numberFormat: '#,##0',
         });

        result1.forEach((item) => {
          gridField.fields.push({
            fieldName: item.model.toLowerCase(),
            valueType: 'number',
            dataType: 'number',
          });

          gridField.columns.push({
            name: item.model.toLowerCase(),
            fieldName: item.model.toLowerCase(),
            width: 80,
            header: {
              text: item.model,
            },
            autoFilter: false,
            numberFormat: '#,###.###',
            styleName: 'tr',
          });
        });

        this.data1Provider.setFields(gridField.fields);
        this.grid1View.setColumns(gridField.columns);

        let searchParam2 = [
          {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch21',
            queryParams: params,
            target: this.grid1Rows,
          },
        ];

        let result = await this.$axios.api.searchAll(searchParam2);
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    confirmClick() {
      this.startClick();
      this.searchClick();
    },
    startClick() {
      this.grid2View.resetFilters();
      this.grid2View.clearCurrent();
      this.data2Provider.clearRows();
      for (let i = 0; i < 20; i++) {
        this.data2Provider.addRow({});
      }
      this.setPackNoFocus(0);
      this.validModel = null;
    },
    async saveClick() {
      let result = false;
      let saveData = this.$refs.grid2.getSaveData();
      if (saveData.insert.length == 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return result;
      }

      const addItems = [];
      const ngItems = [];
      let model = '';
      saveData.insert.forEach((item) => {
        if (!_.isEmpty(item['대포장Qrno']) && !_.isEmpty(item['packQrno']) && (item['boxno검증'] == 'NG' || item['검사결과'] == 'NG')) {
          ngItems.push(item['대포장Qrno']);
        } else if (!_.isEmpty(item['대포장Qrno']) && !_.isEmpty(item['packQrno']) && item['boxno검증'] == 'PASS') {
          addItems.push(item['대포장Qrno']);
          if (_.isEmpty(model)) model = item['model'];
        }
      });

      if (ngItems.length > 0) {
        this.$toast('info', '검사결과와 BoxNo검증 NG인 건이 있습니다. 저장이 진행되지 않습니다.');
        return result;
      }

      if (addItems.length == 0) {
        this.$toast('info', 'BoxNo 검증이 PASS처리된 건이 0건으로 저장이 진행되지 않습니다.');
        return result;
      }

      if (_.isEmpty(this.params.user1) || _.isEmpty(this.params.user2)) {
        this.$toast('info', '발행자 또는 승인자를 입력 후 다시 저장을 누르세요.');
        return result;
      }

      let params = {
        modelNo: model,
      };

      let searchParam = {
        menuId: 'M0003009',
        queryId: 'M0003009_Sch24',
        queryParams: params,
        target: null,
      };

      const palletNoResp = await this.$axios.api.search(searchParam);
      if (palletNoResp != null && palletNoResp.length > 0) {
        let palletNo = palletNoResp[0]['postfix'];
        for (let i = 0; i < this.data2Provider.getRowCount(); i++) {
          if (!_.isEmpty(this.data2Provider.getValue(i, '대포장Qrno')) && !_.isEmpty(this.data2Provider.getValue(i, 'packQrno')) && this.data2Provider.getValue(i, 'boxno검증') == 'PASS') {
            this.data2Provider.setValue(i, 'palletNo', palletNo);
          }
        }

        let params2 = {
          palletNo: palletNo,
          user1: this.params.user1,
          user2: this.params.user2,
          boxNoList: addItems.join(';'),
        };
        let searchParam2 = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExecBox',
          queryParams: params2,
          target: null,
        };
        const resp = await this.$axios.api.search(searchParam2);
        if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
          this.$toast('error', resp[0].errormessage);
        } else {
          // this.$toast('success', `Pallet No. ${palletNo} 추가되었습니다.`);
          this.$confirm('확인', `추가된 Pallet No. ${palletNo} 보관 구역을 설정하시겠습니까? `, (confirmed) => {
            if (confirmed) {
              let params = {
                palletNo: palletNo,
              };
              this.$refs.storageAreaPopup.openDialog(params);
            } else {
              this.confirmClick();
            }
          });
        }
        result = true;
      }

      return result;
    },
    storageClick() {
      this.$refs.storageAreaPopup.openDialog();
    },
    setPackNoFocus(r) {
      this.grid2View.setCurrent({ dataRow: r, fieldName: 'packQrno' });
      setTimeout(() => {
        this.grid2View.showEditor();
      }, 100);
    },
    setBoxNoFocus(r) {
      this.grid2View.setCurrent({ dataRow: r, fieldName: '대포장Qrno' });
      setTimeout(() => {
        this.grid2View.showEditor();
      }, 100);
    },
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    onDataLoadComplatedGrid2(grid) {},
    onCellEditedGrid2(grid, itemIndex, row, field) {
      this.grid2View.commit();
      let newValue = this.$utils.korToEng(grid.getValue(row, field));
      if (field == 2 && _.isEmpty(newValue) && _.isEmpty(grid.getValue(row, 'packQrno'))) {
        grid.setValues(row, this.emptyRow);
        this.setPackNoFocus(row);
      } else {
        grid.setValue(row, field, newValue);
        if (field == 1) {
          this.setBoxNoFocus(row);
        } else {
          this.checkPackNoBoxNo(row, grid.getValue(row, 'packQrno'), grid.getValue(row, '대포장Qrno'), true);
        }
      }
    },
    onRowsPastedGrid2(grid, items) {
      items.forEach((row) => {
        let newValue = this.$utils.korToEng(grid.getValue(row, 'packQrno'));
        grid.setValue(row, 'packQrno', newValue);
        newValue = this.$utils.korToEng(grid.getValue(row, '대포장Qrno'));
        grid.setValue(row, '대포장Qrno', newValue);
        this.checkPackNoBoxNo(row, grid.getValue(row, 'packQrno'), grid.getValue(row, '대포장Qrno'), false);
      });
    },
    setRowStyleCallbackGrid2(grid, item, fixed) {
      var ret = {};
      var status = grid.getValue(item.index, '검사결과');
      var reason = grid.getValue(item.index, 'NG사유');
      var status2 = grid.getValue(item.index, 'boxno검증');
      if (status == 'NG' && reason == '중복PackNo') {
        ret.style = { background: '#FAFAD2' };
      } else if (status == 'NG' || status2 == 'NG') {
        ret = 'red';
      }

      return ret;
    },
    async checkPackNoBoxNo(row, packNo, boxNo, isFocus) {
      let findCount = this.findRowInGrid2(packNo);
      if (findCount > 1) {
        this.$toast('info', '해당 Pack No 중복되었습니다.');
        this.grid2View.setValue(row, '검사결과', 'NG');
        this.grid2View.setValue(row, 'NG사유', '중복PackNo');
        let focusRow = row;
        if (row + 1 < this.data2Provider.getRowCount()) {
          //다음 로우가 있다면
          let ci = this.data2Provider.getValue(row + 1, 'packQrno');
          if (ci === undefined) {
            focusRow = row + 1;
          }
        }
        if (isFocus) this.setPackNoFocus(focusRow);
        return;
      }

      let params = {
        packNo: packNo,
        boxNo: boxNo,
      };

      let searchParam = [
        {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch22',
          queryParams: params,
          target: null,
        },
        {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch23',
          queryParams: params,
          target: null,
        },
      ];

      let rslt = await this.$axios.api.searchAll(searchParam);
      let info = rslt[0];
      let info2 = rslt[1];

      let focusRow = row;
      if (_.isEmpty(info) || info.length == 0) {
        this.$toast('warning', '검증 결과가 없습니다.');
        this.grid2View.setValue(row, '검사결과', 'NG');
        this.grid2View.setValue(row, 'NG사유', 'BoxNo검증정보없음');
      } else {
        this.grid2View.setValue(row, 'boxno검증', info[0]['boxno검증']);
        if (!_.isEmpty(info2) && info2.length > 0) {
          this.grid2View.setValues(row, info2[0]);
          if (_.isEmpty(info2[0].model)) {
            this.$toast('warning', '모델 정보가 없습니다.');
            this.grid2View.setValue(row, '검사결과', 'NG');
            this.grid2View.setValue(row, 'NG사유', '모델정보없음');
          } else {
            if (_.isEmpty(this.validModel) && info[0]['boxno검증'] == 'PASS' && info2[0]['검사결과'] == 'PASS') {
              this.validModel = info2[0].model;
            } else if (!_.isEmpty(this.validModel) && this.validModel != info2[0].model) {
              this.$toast('warning', '기존 입력된 Model과 동일하지 않습니다.');
              this.grid2View.setValue(row, '검사결과', 'NG');
              this.grid2View.setValue(row, 'NG사유', '모델불일치');
            }
          }
        } else {
          this.$toast('warning', '검증 결과가 없습니다.');
          this.grid2View.setValue(row, '검사결과', 'NG');
          this.grid2View.setValue(row, 'NG사유', '검증결과정보없음');
        }
        if (info[0]['boxno검증'] == 'NG') {
          this.$toast('warning', 'Pack / Box 불일치 합니다. Box No 검증 결과 NG입니다.');
          this.grid2View.setValue(row, 'NG사유', 'BoxNo검증NG');
        }
      }

      if (row + 1 < this.data2Provider.getRowCount()) {
        //다음 로우가 있다면
        let ci = this.data2Provider.getValue(row + 1, 'packQrno');
        if (ci === undefined) {
          focusRow = row + 1;
        }
      }
      if (isFocus) this.setPackNoFocus(focusRow);
    },
    findRowInGrid2(packNo) {
      if (_.isEmpty(packNo)) return 0;
      let findCount = 0;
      for (let i = 0; i < this.data2Provider.getRowCount(); i++) {
        if (packNo == this.data2Provider.getValue(i, 'packQrno')) {
          findCount++;
        }
      }

      return findCount;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .rg-editor-container {
  > input {
    z-index: 1000 !important;
  }
}
:deep .worker_wrap {
  margin: 0;
  border: 0;
  background: #ffffff;
  display: flex;
  width: 100%;
  font-size: 14px;
  color: #1c1c1c;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #bebebe;
  align-items: center;
  .form-select-sm,
  .form-control-sm {
    min-height: 34px;
    height: 34px;
    padding: 8px 25px;
  }
  label {
    padding: 0 10px;
    top: -1px;
  }
  .form-select:focus ~ label,
  .form-control:focus ~ label {
    top: 5px;
  }
}
</style>
