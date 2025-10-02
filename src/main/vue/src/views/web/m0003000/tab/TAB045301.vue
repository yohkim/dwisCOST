/** 제조 실적 입력 > 포장/출하 > 출하 검사 > SAMPLE PACK 요청 */
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
          &nbsp;&nbsp;&nbsp;&nbsp;
					<!--div label-for="radio-options" style="width: 300px;">
						<b-form-radio-group id="radio-options" v-model="searchDiv" name="radioGroup"
							:options="searchDivList" buttons    button-variant="outline-primary"
							></b-form-radio-group>
					</div-->
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
        <div class="title">출하검사 의뢰현황</div>
      </div>
      <div class="grid-border-none" style="height: 95px">
        <RealGrid ref="grid1" class="brd_b" :uid="'grid1'" :rows="grid1Rows" style="height: 100%" :fitLayoutWidthEnable="false" />
      </div>
      <div class="worker_wrap">
        <div class="title">입력 정보</div>
        <div class="row worker_info">
          <b-col cols="3" class="d-flex">
            <div class="form-floating" style="width: calc(100% - 60px)">
              <input autocomplete="off" type="text" class="form-control form-control-sm label-60" id="floating" placeholder="User" v-model="params.user" />
              <label for="floating">의뢰자</label>
            </div>
          </b-col>
          <b-col cols="2">
                  <div style="width:400px"><span style="font-size: 14px; color: blue;">* 샘플 요청(Run) 1개에 포장(Pack) 1개씩 제조에서 인계 됩니다 </span></div>
          </b-col> 
        </div>
        <div class="btn_wrap ms-auto">
          <b-button class="main" @click="requestClick">출하 검사 PACK요청</b-button>
        </div>
      </div>
      <div class="grid-border-none" style="height: calc(100% - 175px)">
        <RealGrid ref="grid2" :uid="'grid2'" :rows="grid2Rows" style="height: 100%" />
      </div>
    </div>
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { useM0003009 } from '@web/store/M0003009.js';

export default {
  name: 'DW_TAB045301',
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
      grid2Rows: [],
      grid2: null,
      params: {
        startDate: '',
        endDate: '',
        user: '',
      },
      isProcessing: false,
			// searchDiv: "req",
			// searchDivList: [
			// 	{ text: '샘플요청', value: 'req' },
			// 	{ text: '샘플취소', value: 'can' },
			// ],
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
      this.grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB045200_1.js`));
      this.grid2 = _.cloneDeep(require(`@web/m0003000/js/TAB045301_1.js`));
    },
    async getSelectOptions() {
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      this.params.user = this.userAuthInfo.loginUserName;
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
          queryId: 'M0003009_Sch41_Col',
          queryParams: params,
          target: null,
        };

        let result1 = await this.$axios.api.search(searchParam);      
        //this.$toast('warning',JSON.stringify(result1, null, 2));
        const gridField = _.cloneDeep(require(`@web/m0003000/js/TAB045200_1.js`));        
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
            dataType: 'number' , 
          });

          gridField.columns.push({
            name: item.model.toLowerCase(),
            fieldName: item.model.toLowerCase(),
            width: 80,
            header: {
              text: item.model,
            },
            autoFilter: true,
            numberFormat: '#,###.###',
            styleName: 'tr',
          });
        });

        this.data1Provider.setFields(gridField.fields);
        this.grid1View.setColumns(gridField.columns);

        let searchParam2 = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch41',
          queryParams: params,
          target: this.grid1Rows,
        };

        let result2 = await this.$axios.api.search(searchParam2);
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    searchFieldClick(fieldName) {      
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.grid2View.resetFilters();
        this.grid2View.clearCurrent();
        this.data2Provider.clearRows();

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          this.isProcessing = false;
          return;
        }

        let params = {
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
          modelNo: fieldName,
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch42',
          queryParams: params,
          target: this.grid2Rows,
        };

        try {
          // Assuming this.$axios.api.search returns a promise
          await this.$axios.api.search(searchParam);
          
          // Now process the rows after data is loaded
          const rowCount = this.data2Provider.getRowCount();
          const rowsWithSample = [];
          let count = 0;
          for (let i = 0; i < rowCount; i++) {
            const sampleCheck = this.data2Provider.getValue(i, "sel");
            if (sampleCheck) {
              const newItem = {
                req_Date: this.data2Provider.getValue(i, "si의뢰일자"),
                req_Seq: this.data2Provider.getValue(i, "si의뢰차수"),
                run_Id: this.data2Provider.getValue(i, "runId")
              };
              
              const isDuplicate = rowsWithSample.some(item => 
                item.req_Date === newItem.req_Date &&
                item.req_Seq === newItem.req_Seq &&
                item.run_Id === newItem.run_Id
              );
              
              if (!isDuplicate) {
                rowsWithSample.push(newItem);
                count++;
              }
            }
          }
          
          this.grid2View.setColumnProperty("sel", "footer", { text: `${count}개`});
          this.grid2View.setFooters({
            visible: true,
            elements: {column: "sel", value: count, numberFormat: "#,##0"}
          });   
          this.grid2View.refresh();
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          this.isProcessing = false;
        }
      });
    },
    async requestClick() {
      // let rows = this.grid2View.getCheckedRows(false);
      // if (rows.length == 0) {
      //   this.$toast('info', '체크된 내용이 없습니다.');
      //   return;
      // }

      // const addItems = [];
      // rows.forEach((dataRow) => {
      //   addItems.push(this.data2Provider.getValue(dataRow, 'packQrno'));
      // });
      // if (addItems.length == 0) {
      //   this.$toast('info', '출하 검사 PACK요청할 Pack No가 없습니다.');
      //   return result;
      // }

      // if (_.isEmpty(this.params.user)) {
      //   this.$toast('info', '의뢰자를 입력 후 다시 출하 검사 PACK요청을 누르세요.');
      //   return result;
      // }

      // let params = {
      //   user: this.params.user,
      //   packNoList: addItems.join(','),
      // };

      // let searchParam = {
      //   menuId: 'M0003009',
      //   queryId: 'M0003009_ExeRequestPack',
      //   queryParams: params,
      //   target: null,
      // };

            // 2. 특이사항이 있는 행들만 저장
        //const sampleModifiedRows = this.getRowsModifiedInColumn();
        //var rowState = this.grid2View().getRowState(2);
        // var allRows = [];
        // for (var i = 0; i < this.data2Provider.getRowCount(); i++) {
        //     if (this.data2Provider.getRowState(i) === "updated") {
        //         allRows.push(this.data2Provider.getJsonRow(i));
        //     }
        // }
        // console.log("변경된 행:", allRows); return;  

        const rowCount = this.data2Provider.getRowCount();
        const rowsWithSample = [];

        for (let i = 0; i < rowCount; i++) {
          //const sampleCheck = this.data2Provider.getValue(i, "sel");
          if (this.data2Provider.getRowState(i) === "updated") {
            const newItem = {
              req_Date: this.data2Provider.getValue(i, "si의뢰일자"),
              req_Seq: this.data2Provider.getValue(i, "si의뢰차수"),
              pack_No: this.data2Provider.getValue(i, "packNo"),
              sample : this.data2Provider.getValue(i, "sel"),
              user: this.params.user
            };
            
            // 배열에 이미 존재하는지 확인
            const isDuplicate = rowsWithSample.some(item => 
              item.req_Date === newItem.req_Date &&
              item.req_Seq === newItem.req_Seq &&
              item.pack_No === newItem.pack_No
            );
            
            if (!isDuplicate) {
              rowsWithSample.push(newItem);
            }
          }
        }
       if (rowsWithSample.length == 0) {
         this.$toast('info', '변경내용이 없습니다.');
         return;
       }
       if (_.isEmpty(this.params.user)) {
         this.$toast('info', '의뢰자를 입력 후 다시 출하 검사 PACK요청을 누르세요.');
         return;
       }
      //this.$toast('info',JSON.stringify(rowsWithSample,null,2)); return;

      let param = {
          menuId: "M0003009",
          insert: [{ queryId: "M0003009_ExeRequestRun", data: rowsWithSample }]
        };

      let resp = await this.$axios.api.saveData(param);
       console.log('API 응답 전체:',resp);
       //this.$toast('info',JSON.stringify(resp,null,2));
      //const resp = await this.$axios.api.search(searchParam);
      if (!_.isNil(resp.errormessage)) {
        this.$toast('error', resp.errormessage);
      } 
      // else if (!_.isNil(resp.message)) {
      //   this.$toast('info', resp.message);
      //   this.grid2View.checkAll(false);
      // } 
      else {
        this.$toast('success', `Run No ${rowsWithSample.length}건이\n샘플요청 변경 되었습니다.`);
        this.grid2View.checkAll(false);
      }
    },
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackGrid1(grid, cell) {
      let rtn = {};
      let ds = grid.getDataSource();
      const fieldName = cell.index.fieldName;
      if (fieldName != '상태' && fieldName != '구분' && cell.value > 0) {
        rtn['renderer'] = {
          type: 'link',
          urlCallback: function (grid, cell) {},
          titleField: 'fieldName',
        };
      }
      return rtn;
    },
    onCellItemClickedGrid1(grid, index, clickData) {
      if (clickData.type == 'link' && clickData.url) {
        try {
          this.searchFieldClick(clickData.fieldName);
        } catch (error) {
          console.error('출하검사tab1 grid1 search', error);
          return false;
        }

        return false;
      }
    },
    onFilteringChangedGrid2(grid) {
       const filteredRows = grid.getFilteredRows(); //this.data2Provider.getRowCount();
       //console.log("필터링 상태가 변경되었습니다."+'('+filteredRows+')');
       const rowsWithSample = [];
       let count = 0;
       for (let i = 0; i < filteredRows.length; i++) {
          const sampleCheck = this.data2Provider.getValue(filteredRows[i], "sel");
          if (sampleCheck) {
            const newItem = {
              req_Date: this.data2Provider.getValue(filteredRows[i], "si의뢰일자"),
              req_Seq: this.data2Provider.getValue(filteredRows[i], "si의뢰차수"),
              run_Id: this.data2Provider.getValue(filteredRows[i], "runId")
            };
            
            // 배열에 이미 존재하는지 확인
            const isDuplicate = rowsWithSample.some(item => 
              item.req_Date === newItem.req_Date &&
              item.req_Seq === newItem.req_Seq &&
              item.run_Id === newItem.run_Id
            );
            
            if (!isDuplicate) {
              rowsWithSample.push(newItem);
              count++;
            }
          }
        }
        grid.setColumnProperty("sel", "footer", { text: `${count}개`});
        grid.setFooters({visible: true,elements: {column: "sel", value: count, numberFormat: "#,##0",} });      
    },
   async onCellClickedGrid2(grid, clickData) {
      try {
        if (clickData.cellType === 'header'|| !(clickData.column === 'sel' || clickData.column === '1샘플필터')) return;
        // for (let i = rowRange.firstRow; i <= rowRange.lastRow; i++) {
        //         grid.setValue(rowRange.firstRow, 'sel', grid.getValue(i, 'sel')? 'f' : 't');  // 선택 상태 토글 ('t' <-> 'f')
        // }
        // 데이터 공급자를 사용해 일괄 업데이트

        const current = this.grid2View.getCurrent();
        const rowIndex = current.itemIndex;
        const value = grid.getValue(rowIndex, '검사단계');
        if (value === "검사 완료" && value != null) {
            this.$toast('warning','이미 출하검사 완료 되었습니다');
            return;
        }
        const value1 = grid.getValue(rowIndex, '샘플인계run');
        if (value1 === "1" && value1 != null) {
            this.$toast('warning','PACK 인계완료된 RUN은 샘플요청 취소 할 수 앖습니다');
            return;
        }

        const rowRange = this.findMergeRange(grid,rowIndex, 'runId');
        //this.$toast('info',JSON.stringify(rowRange,null,2));

        try {
          grid.beginUpdate();          
          // 행 범위 내에서 값 업데이트
          for (let i = rowRange.firstRow; i <= rowRange.lastRow; i++) {
             grid.setValue(i, 'sel', grid.getValue(i, 'sel')? 'f' : 't');
          }
          
        } finally {
          grid.endUpdate();
          grid.refresh();
        }

       const rowCount = this.data2Provider.getRowCount(); //grid.getFilteredRows();
       const rowsWithSample = [];
       let count = 0;
       for (let i = 0; i < rowCount; i++) {
          const sampleCheck = this.data2Provider.getValue(i, "sel");
          if (sampleCheck) {
            const newItem = {
              req_Date: this.data2Provider.getValue(i, "si의뢰일자"),
              req_Seq: this.data2Provider.getValue(i, "si의뢰차수"),
              run_Id: this.data2Provider.getValue(i, "runId")
            };
            
            // 배열에 이미 존재하는지 확인
            const isDuplicate = rowsWithSample.some(item => 
              item.req_Date === newItem.req_Date &&
              item.req_Seq === newItem.req_Seq &&
              item.run_Id === newItem.run_Id
            );
            
            if (!isDuplicate) {
              rowsWithSample.push(newItem);
              count++;
            }
          }
        }
        grid.setColumnProperty("sel", "footer", { text: `${count}개`});
        grid.setFooters({visible: true,elements: {column: "sel", value: count, numberFormat: "#,##0",} });
         
      } catch (error) {
        console.log(error);
      } finally {
        //this.isLoading = false;
      }
   },
    // findMergeRange(gridView, rowIndex, columnName) {
    //     const currentValue = gridView.getValue(rowIndex, columnName);
    //     let firstRow = rowIndex;
    //     let lastRow = rowIndex;
        
    //     // 필터링된 행의 인덱스 배열 가져오기
    //     const filteredRows = gridView.getFilteredRows();
    //     this.$toast('info',JSON.stringify(filteredRows,null,2));
        
    //     // 현재 행의 필터링된 인덱스 찾기
    //     const filteredIndex = rowIndex; //filteredRows.indexOf(rowIndex);

    //     this.$toast('info',"filteredIndex:"+filteredIndex+'|'+currentValue);
        
    //     let findValue='';
    //     // 첫 번째 행 찾기 (필터링된 행 범위 내에서)
    //     for (let i = filteredIndex - 1; i >= 0; i--) {
    //         findValue = gridView.getValue(filteredRows[i], columnName); this.$toast('info',findValue);
    //         if (findValue === currentValue) {
    //             firstRow = filteredRows[i];
    //         } else {
    //             break;
    //         }
    //     }
        
    //     // 마지막 행 찾기 (필터링된 행 범위 내에서)
    //     for (let i = filteredIndex + 1; i < filteredRows.length; i++) {
    //         if (gridView.getValue(filteredRows[i], columnName) === currentValue) {
    //             lastRow = filteredRows[i];
    //         } else {
    //             break;
    //         }
    //     }
        
    //     return {firstRow, lastRow};
    // },  
   findMergeRange(gridView, rowIndex, columnName) {
      const filteredRows = gridView.getFilteredRows();
      const currentValue = gridView.getValue(rowIndex, columnName);
      let firstRow = rowIndex;
      let lastRow = rowIndex;
      
      // 첫 번째 행 찾기
      while (firstRow > 0 && gridView.getValue(firstRow - 1, columnName) === currentValue) {
          firstRow--;
      }
      
      // 마지막 행 찾기  this.data2Provider.getRowCount()
      while (lastRow < filteredRows.length - 1 && 
            gridView.getValue(lastRow + 1, columnName) === currentValue) {
          lastRow++;
      }
      
      return {firstRow,lastRow};
    },
    getRowsModifiedInColumn() {
      return this.grid2View.getUpdatedRows()
        .filter(row => row.state === 'updated')
        .filter(row => {
          const original = gridView.getOriginalValue(row.dataRow, 'sel');
          const current = gridView.getValue(row.dataRow, 'sel');
          return original !== current;
        });
    },
  } 
};
</script>
<style lang="scss" scoped>
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
