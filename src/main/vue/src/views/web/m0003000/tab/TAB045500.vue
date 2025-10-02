/** * 제조 실적 입력 > 포장/출하 > 출하 */
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
      <div class="grid-border-none" style="height: 155px">
        <RealGrid ref="grid1" class="brd_b" :uid="'grid1'" :rows="grid1Rows" style="height: 100%" :fitLayoutWidthEnable="false"/>
      </div>
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="main" @click="startClick" v-show="shipcancel == false">시작</b-button>
          <b-button class="sub" @click="saveClick" v-show="shipcancel == false">임시저장</b-button>
          <b-button class="main" @click="shipmentClick" v-show="shipcancel == false">출하</b-button>
          <b-button class="main" @click="shipmentCancelClick" v-show="shipcancel == true">출하취소</b-button>
        </div>
      </div>
      <div class="grid-border-none" style="height: calc(100% - 80px - 155px)">
        <RealGrid ref="grid2" :uid="'grid2'" :rows="grid2Rows" style="height: 100%" />
      </div>
    </div>
  </div>
</template>

<script>
import { useM0003009 } from '@web/store/M0003009.js';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { RowState } from 'realgrid';

export default {
  name: 'DW_TAB045500',
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
      rMODEL: null,
      grid1Rows: [],
      grid1: null,
      grid2Rows: [],
      grid2: null,
      params: {
        startDate: '',
        endDate: '',
      },
      isProcessing: false,
      emptyRow: { model: '', code: '', palletNo: '', cell수량: '', 생산계획번호: '', 출하작업시각: '', 상태: '' },
      shipcancel : false
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
  mounted() {
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB045500_1.js`));
      this.grid2 = _.cloneDeep(require(`@web/m0003000/js/TAB045500_2.js`));

       // 그리드 초기화 시 이벤트 핸들러 등록
      this.$nextTick(() => {
        if (this.grid1View) {
          this.grid1View.onCellClicked = this.onCellClickedGrid1;
        }
      });
    },onCellClickedGrid1(grid, clickData){
			// if(clickData.cellType === 'header'){
			// 	return;
			// }
			// console.log("clickData.column:::",clickData.column);

			const current = grid.getCurrent();
			const rowIndex = current.itemIndex;
      const packState = grid.getValue(rowIndex,'상태');
      if( packState !== '출하 완료' ) {
         this.shipcancel = false; 
         this.data2Provider.clearRows();
         return;
      }

			let qp = {};
			qp['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
			qp['endDate'] = this.srchInfo.endDate.replace(/-/g, "");
			qp['selModel'] = clickData.column;
			//this.$toast('warning',JSON.stringify(qp, null, 2));

      let	param = {menuId:'M0003009',queryId:'M0003009_ShipmentList',queryParams:qp, target: this.grid2Rows};
      let result = this.$axios.api.search(param); 
      this.shipcancel = true;
		},
    async getSelectOptions() {
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;
      this.shipcancel = false;

      this.$nextTick(async () => {
        this.grid1View.resetFilters();
        this.grid1View.clearCurrent();
        this.data1Provider.clearRows();
        this.data2Provider.clearRows();

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          return;
        }

        let params = {
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch51_Col',
          queryParams: params,
          target: null,
        };

        let result1 = await this.$axios.api.search(searchParam);
        this.grid1  = _.cloneDeep(require(`@web/m0003000/js/TAB045500_1.js`));
        
        let fn = "total";
        let veList = [];
         result1.forEach((item) => {
          veList.push("values['"+item.model.toLowerCase()+ "']");
         });
        // 행 합계 컬럼 추가
        this.grid1.fields.push({fieldName: fn,dataType: 'number',valueExpression:veList.join("+")});
        this.grid1.columns.push({name: fn,fieldName: fn,width: 80,header: {text: "합계"},editable: false,styleName: "tr",numberFormat: '#,##0',
         });

        result1.forEach((item) => {
          this.grid1.fields.push({
            fieldName: item.model.toLowerCase(),
            valueType: 'number',
            dataType: 'number' , 
          });

          this.grid1.columns.push({
            name: item.model.toLowerCase(),
            fieldName: item.model.toLowerCase(),
            width: 60,
            header: {
              text: item.model,
            },
            autoFilter: false,
            numberFormat: '#,###.###',
            styleName: 'tr',
          });
        });

        this.data1Provider.setFields(this.grid1.fields);
        this.grid1View.setColumns(this.grid1.columns);

        let searchParam2 = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch51',
          queryParams: params,
          target: this.grid1Rows,
        };

        let result2 = await this.$axios.api.search(searchParam2);   
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    startClick() {
      this.grid2View.resetFilters();
      this.grid2View.clearCurrent();
      this.data2Provider.clearRows();
      this.data2Provider.addRow({});
      this.setPalletNoFocus(0);
    },
    setPalletNoFocus(r) {
      this.grid2View.setCurrent({ dataRow: r, fieldName: 'palletNo' });
      setTimeout(() => {
        this.grid2View.showEditor();
      }, 100);
    },
    setErpNoFocus(r) {
      this.grid2View.setCurrent({ dataRow: r, fieldName: '생산계획번호' });
      setTimeout(() => {
        this.grid2View.showEditor();
      }, 100);
    },
    async saveClick() {
      this.grid2View.commit();
      const insert = [];
      let saveData = this.$refs.grid2.getSaveData();
      if (saveData.insert.length <= 0 && saveData.update.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return;
      }

      saveData.insert.forEach((item) => {
        if (!_.isEmpty(item.palletNo) && !_.isEmpty(item['생산계획번호']) && !_.isEmpty(item['상태'])) {
          insert.push(item);
        }
      });

      saveData.update.forEach((item) => {
        if (!_.isEmpty(item.palletNo) && !_.isEmpty(item['생산계획번호']) && !_.isEmpty(item['상태'])) {
          insert.push(item);
        }
      });

      if (insert.length <= 0) {
        this.$toast('info', 'Pallet No., 생산 계획 번호 상태가 모두 입력된 행이 없습니다.');
        return;
      }

      let param = {
        menuId: 'M0003009',
        insert: [{ queryId: 'M0003009_ShipmentTempSave', data: insert }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', `${insert.length}건 저장되었습니다.`);
        let stateRows = this.data2Provider.getAllStateRows();
        stateRows.created.forEach((dataRow) => {
          let item = this.data2Provider.getValues(dataRow);
          if (!_.isEmpty(item[2]) && !_.isEmpty(item[4]) && !_.isEmpty(item[6])) {
            this.data2Provider.setRowState(dataRow, RowState.NONE);
          }
        });
        stateRows.updated.forEach((dataRow) => {
          let item = this.data2Provider.getValues(dataRow);
          if (!_.isEmpty(item[2]) && !_.isEmpty(item[4]) && !_.isEmpty(item[6])) {
            this.data2Provider.setRowState(dataRow, RowState.NONE);
          }
        });

        stateRows = this.data2Provider.getAllStateRows();
      } else {
        this.$toast('error', resp.message);
      }
    },
    async shipmentClick() {
      try {
        let rows = this.grid2View.getCheckedRows(false);
        if (rows.length == 0) {
          this.$toast('info', '체크된 내용이 없습니다.');
          return;
        }

        this.grid2View.commit();
        const createdItems = [];
        rows.forEach((row) => {
          if (RowState.NONE != this.data2Provider.getRowState(row)) {
            createdItems.push(row);
          }
        });

        if (createdItems.length > 0) {
          this.$toast('info', '임시 저장 후 출하 버튼을 클릭하세요.');
          return;
        }

        let jsonRows = this.grid2View.getJsonRows(0, -1);
        const updated = [];
        rows.forEach((dataRow) => {
          let item = this.data2Provider.getValues(dataRow);
          if (!_.isEmpty(item[2]) && !_.isEmpty(item[4]) && !_.isEmpty(item[6])) {
            updated.push(jsonRows[dataRow]);
          }
        });

        if (updated.length === 0) {
          this.$toast('info', 'Pallet No., 생산 계획 번호 상태가 모두 입력된 행이 없습니다.');
          return false;
        }

        let param = {
          menuId: 'M0003009',
          insert: [{ queryId: 'M0003009_Shipment', data: updated }],
        };

        const resp = await this.$axios.api.saveData(param);
        if (!resp || resp.length === 0) {
          throw new Error('서버 응답이 없습니다.');
        }
        if (resp.status === 'success') {
          this.$toast('success', `Pallet No, 생산 계획 번호 상태가 모두 입력된 ${updated.length}건이 출하 되었습니다.`);
        } else {
          this.$toast('error', resp.message);
        }
        this.searchClick();
      } catch (error) {
        console.error('출하 중 오류 발생:', error);
        this.$toast('error', error.message || '출하 중 오류가 발생했습니다.');
        return false;
      }
    },
    async shipmentCancelClick() {
      try {
        let rows = this.grid2View.getCheckedRows(false);
        if (rows.length == 0) {
          this.$toast('info', '체크된 내용이 없습니다.');
          return;
        }

         this.grid2View.commit();
        // const createdItems = [];
        // rows.forEach((row) => {
        //   if (RowState.NONE != this.data2Provider.getRowState(row)) {
        //     createdItems.push(row);
        //   }
        // });

        // if (createdItems.length > 0) {
        //   this.$toast('info', '임시 저장 후 출하취소 버튼을 클릭하세요.');
        //   return;
        // }

        let jsonRows = this.grid2View.getJsonRows(0, -1);
        const updated = [];
        rows.forEach((dataRow) => {
          let item = this.data2Provider.getValues(dataRow);
          if (!_.isEmpty(item[2])  && !_.isEmpty(item[6])) { //&& !_.isEmpty(item[4]) 생산지시번호 임시 삭제 35.04.16 KYH
            updated.push(jsonRows[dataRow]);
          }
        });

        // if (updated.length === 0) {
        //   this.$toast('info', 'Pallet No., 생산 계획 번호 상태가 모두 입력된 행이 없습니다.');
        //   return false;
        // }
        
			  this.$toast('warning',JSON.stringify(updated, null, 2));
        let param = {
          menuId: 'M0003009',
          insert: [{ queryId: 'M0003009_ShipmentCancel', data: updated }],
        };

        const resp = await this.$axios.api.saveData(param);
        if (!resp || resp.length === 0) {
          throw new Error('서버 응답이 없습니다.');
        }
        if (resp.status === 'success') {
          this.$toast('success', `${updated.length}건이 출하취소 되었습니다.`);
        } else {
          this.$toast('error', resp.message);
        }
      } catch (error) {
        console.error('출하취소 중 오류 발생:', error);
        this.$toast('error', error.message || '출하취소 중 오류가 발생했습니다.');
        return false;
      }
      this.searchClick();
    },
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    onDataLoadComplatedGrid2(grid) {},
    onCellEditedGrid2(grid, itemIndex, row, field) {
      this.grid2View.commit();
      let newValue = this.$utils.korToEng(grid.getValue(row, field));
      grid.setValue(row, field, newValue);
      if (field == 2) {
        if (!_.isEmpty(newValue)) {
          this.checkPalletNo(row, grid.getValue(row, 'palletNo'), true);
        } else {
          grid.setValues(row, this.emptyRow);
        }
      } else {
        for (let i = row + 1; i < this.data2Provider.getRowCount(); i++) {
          let ci = grid.getValue(row + 1, 'palletNo');
          if (_.isEmpty(ci)) {
            this.setPalletNoFocus(row + 1);
            break;
          }
        }
      }
    },
    onRowsPastedGrid2(grid, items) {
      items.forEach((row) => {
        let newValue = !_.isEmpty(grid.getValue(row, 'palletNo')) ? this.$utils.korToEng(grid.getValue(row, 'palletNo')) : '';
        let newValue2 = !_.isEmpty(grid.getValue(row, '생산계획번호')) ? this.$utils.korToEng(grid.getValue(row, '생산계획번호')) : '';
        if (!_.isEmpty(newValue)) {
          grid.setValue(row, 'palletNo', newValue);
          this.checkPalletNo(row, grid.getValue(row, 'palletNo'), false);
        } else if (!_.isEmpty(newValue2)) {
          grid.setValue(row, '생산계획번호', newValue2);
        } else {
          grid.setValues(row, this.emptyRow);
        }
      });
      this.data2Provider.addRow({});
    },
    findRowInGrid2(packNo) {
      if (_.isEmpty(packNo)) return 0;

      let fields = ['palletNo'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: packNo,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.grid2View.searchCell(options);
        if (index == null) break;

        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        findCount++;
      }
      return findCount;
    },
    async checkPalletNo(row, palletNo, isFocus) {
      let params = {
        startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
        endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
        palletNo: palletNo,
      };

      let searchParam = {
        menuId: 'M0003009',
        queryId: 'M0003009_GetShipmentPalletInfo',
        queryParams: params,
        target: null,
      };

      let rslt = await this.$axios.api.search(searchParam);
      let info = rslt[0];
      let focusRow = row;
      let isFocusPalletNo = false;
      //this.$toast('warning', JSON.stringify(info, null, 2));
      if (_.isEmpty(info)) {
        this.$toast('warning', 'Pallet No.에 대한 정보가 없습니다.');
        this.grid2View.setValues(row, this.emptyRow);
        isFocusPalletNo = true;
      } else if (info != null && !_.isNil(info.message)) {
        this.$toast('info', info.message);
        this.grid2View.setValues(row, this.emptyRow);
        isFocusPalletNo = true;
      } else if (info != null && !_.isNil(info.errmsg)) {
        this.$toast('error', info.errmsg);
        this.grid2View.setValues(row, this.emptyRow);
        isFocusPalletNo = true;
      } else if (info != null && !_.isNil(info.상태)) {
        this.grid2View.setValues(row, info);
        let grid2FindCnt = this.findRowInGrid2(this.grid2View.getValue(row, 'palletNo'));
        if (grid2FindCnt > 1) {
          this.$toast('info', `해당 Pallet No.는 중복되었습니다.`);
          this.grid2View.setValues(row, this.emptyRow);
          isFocusPalletNo = true;
        } else {
          if (isFocus) this.data2Provider.addRow({});
        }
      } else {
        this.$toast('warning', 'Pack No에 대한 정보가 없습니다.');
        this.grid2View.setValues(row, this.emptyRow);
        isFocusPalletNo = true;
      }

      if (isFocus && isFocusPalletNo) {
        this.setPalletNoFocus(focusRow);
      } else if (isFocus & !isFocusPalletNo) {
        this.setErpNoFocus(focusRow);
      }
    },
  },
};
</script>
