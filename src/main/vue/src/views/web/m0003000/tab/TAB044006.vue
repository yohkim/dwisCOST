/** 포장/출하 > 내포장 - PACK조회*/
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3" class="period">
          <div class="form-floating me-1">
            <!--date-picker label="시작일" v-model="params.startDate" -->
						<date-picker label="시작일" v-model="srchInfo.startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <!--date-picker label="종료일" v-model="params.endDate" -->
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
      <!-- <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" :disabled="isExcelExportDisabled" @click="excelClick">엑셀</b-button>
        </div>
      </div> -->
      <div class="grid-border-none" style="height: calc(13%)">
        <RealGrid ref="packNoGrid" :uid="'packNoGrid'" :rows="packNoRows" style="height: 100%" :fitLayoutWidthEnable="false"/>
      </div>
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" :disabled="isExcelExportDisabled2" @click="excelClick2">엑셀</b-button>
        </div>
      </div>
      <div v-show="searchDiv === 'PACK'" class="grid-border-none" style="height: calc(87% - 40px)">
        <RealGrid ref="packNoGrid2" :uid="'packNoGrid2'" :rows="packNoRows2" style="height: 100%" :fitLayoutWidthEnable="false"/>
      </div>
      <div v-show="searchDiv === 'CELL'" class="grid-border-none" style="height: calc(87% - 40px)">
        <RealGrid ref="cellIdGrid3" :uid="'cellIdGrid3'" :rows="cellIdRows3" style="height: 100%" :fitLayoutWidthEnable="false"/>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { useM0003009 } from '@web/store/M0003009.js';

export default {
  name: 'DW_TAB044006',
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
      packStatusMap: {
        si대기: 'SI 대기',
        siList: 'SI LIST',
        si의뢰: 'SI 의뢰',
        소포장반출: '소포장 반출',
        창고재고: '창고 재고',
        출하완료: '출하 완료',
        폐기: '폐기',
      },
      packNoRows: [],
      packNoGrid: null,
      packNoRows2: [],
      packNoGrid2: null,
      cellIdRows3: [],
      cellIdGrid3: null,
      params: {
        packStatus: null,
        startDate: this.srchInfo.startDate,
        endDate: this.srchInfo.endDate,
      },
      isExcelExportDisabled: true,
      isExcelExportDisabled2: true,
      isProcessing: false,
      searchDiv: 'PACK',
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    packNoGridView() {
      return this.$refs.packNoGrid.getGridView();
    },
    packNoGrid2View() {
      return this.$refs.packNoGrid2.getGridView();
    },
    cellIdGrid3View() {
      return this.$refs.cellIdGrid3.getGridView();
    },
    data1Provider() {
      return this.$refs.packNoGrid.getGridDataProvider();
    },
    data2Provider() {
      return this.$refs.packNoGrid2.getGridDataProvider();
    },
    data3Provider() {
      return this.$refs.cellIdGrid3.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
   // this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
        this.packNoGrid = _.cloneDeep(require(`@web/m0003000/js/TAB044006_1.js`));
        this.packNoGrid2 = _.cloneDeep(require(`@web/m0003000/js/TAB044006_2.js`));
        this.cellIdGrid3 = _.cloneDeep(require(`@web/m0003000/js/TAB044006_3.js`));

      //console.log("Pack Grid 컬럼 구조:", this.packNoGrid2.columns);
    },
    async getSelectOptions() {
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // vaparams.startDater oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this. = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;
    },
    clearClick() {
      this.packNoGridView.resetFilters();
      this.packNoGrid2View.resetFilters();
      this.cellIdGrid3View.resetFilters();
      this.packNoGridView.clearCurrent();
      this.packNoGrid2View.clearCurrent();
      this.cellIdGrid3View.clearCurrent();

      this.params.packStatus = '';
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.packNoGridView.resetFilters();
        this.packNoGrid2View.resetFilters();
        this.cellIdGrid3View.resetFilters();
        this.packNoGridView.clearCurrent();
        this.packNoGrid2View.clearCurrent();
        this.cellIdGrid3View.clearCurrent();

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          return;
        }

        let params = {
          packStatus: null,
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
        };

        let searchParam = [
          {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch6',
            queryParams: params,
            target: this.packNoRows,
          },
        ];
        let result = await this.$axios.api.searchAll(searchParam);
        if (result[0].length == 0) {
          this.isExcelExportDisabled = true;
        } else {
          this.isExcelExportDisabled = false;
        }
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);   
    },
    async searchPackNoClick(filedName) {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.searchDiv = 'PACK';

      try {
        this.packNoGrid2View.resetFilters();
        this.packNoGrid2View.clearCurrent();

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          this.isProcessing = false;
          return;
        }

        let params = {
          packStatus: this.packStatusMap[filedName],
          startDate: this.srchInfo.startDate?.toString().replaceAll('-', '') || '',
          endDate: this.srchInfo.endDate?.toString().replaceAll('-', '') || '',
        };

        let searchParam = [{
          menuId: 'M0003009',
          queryId: 'M0003009_Sch7',
          queryParams: params,
          target: this.packNoRows2,
        }];

      //this.$toast('info',JSON.stringify(searchParam, null, 2));return;
        let result = await this.$axios.api.searchAll(searchParam);
        
        this.isExcelExportDisabled = result[0].length === 0;
        
        let dataProvider = this.$refs.packNoGrid2.getGridDataProvider();

        if (result[0].length > 0) {          
          this.isExcelExportDisabled2 = false;
          // 1. 데이터 설정
          this.data2Provider.setRows(result[0]); // setRows 사용 권장
          // 2. 합계 갱신
          this.$nextTick(() => {// 데이터 로드 확인
          if (dataProvider.getRowCount() === 0) {
            console.error("No data loaded in the grid");
            return;
          }
          var uniquePackCell = {};
          var uniquePackCellCnt = {};
           var uniqueRunId = {};

          // 안전한 행 접근 방법
          // for (var row = 0; row < dataProvider.getRowCount(); row++) {
          //   try {
          //     var packNo = dataProvider.getValue(row, "packNo");
          //     var cell_cnt = dataProvider.getValue(row, "cell수량x") || 0;
          //     if (packNo) {
          //       uniquePackCell[packNo] = cell_cnt;     // 기존 값을 덮어쓰기만 함 (누적하지 않음)
          //     }
          //   } catch (e) {
          //     console.error("Error accessing row", row, e);
          //   }
          // }
          // dataProvider에서 필터링된 행만 처리
var filteredRows = this.packNoGrid2View.getFilteredRows(false); // 필터링된 행 인덱스 배열 가져오기
for (var i = 0; i < filteredRows.length; i++) {
    var row = filteredRows[i]; // 필터링된 행 인덱스
    try {
        var packNo = dataProvider.getValue(row, "packNo");
        var runId = dataProvider.getValue(row, "runId");
        var cell_cnt = dataProvider.getValue(row, "cell수량x") || 0;
        if (packNo) {
            uniquePackCell[packNo] = packNo; // 기존 값을 덮어쓰기만 함 (누적하지 않음)
            uniquePackCellCnt[packNo] = cell_cnt;
            uniqueRunId[runId] = runId;
        }
    } catch (e) {
        console.error("Error accessing filtered row", row, e);
    }
}
          let totalPackCell = Object.values(uniquePackCellCnt).reduce((sum, count) => sum + count, 0).toLocaleString('ko-KR');
            this.packNoGrid2View.setColumnProperty("cell수량", "footer", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f",fontBold: true}});  
            this.packNoGrid2View.setColumnProperty("cell수량x", "footer", { text: totalPackCell, numberFormat: "#,##0", style: {textAlignment: "far"}});
            this.packNoGrid2View.setColumnProperty("runId", "footer", { text: "RUN 수=>"+Object.keys(uniqueRunId).length}); 
            this.packNoGrid2View.setColumnProperty("packNo", "footer", { text: "Pack수=> "+Object.keys(uniquePackCell).length});
            this.packNoGrid2View.setColumnProperty("boxNo", "footer", { text: this.packStatusMap[filedName].replace(/SI/g, '출하검사')+" 합계 => " });
          });
          
          this.packNoGrid2View.refresh(); 
        }
      } catch (error) {
        console.error("검색 오류:", error);
      } finally {
        this.isProcessing = false;
      }
    },
    onFilteringChangedPackNoGrid2() {
       let dataProvider = this.$refs.packNoGrid2.getGridDataProvider();
       var uniquePackCell = {};
       var uniquePackCellCnt = {};
       var uniqueRunId = {};

      var filteredRows = this.packNoGrid2View.getFilteredRows(false); // 필터링된 행 인덱스 배열 가져오기
      for (var i = 0; i < filteredRows.length; i++) {
          var row = filteredRows[i]; // 필터링된 행 인덱스
          try {
              var packNo = dataProvider.getValue(row, "packNo");
              var runId = dataProvider.getValue(row, "runId");
              var cell_cnt = dataProvider.getValue(row, "cell수량x") || 0;
              if (packNo) {
                  uniquePackCell[packNo] = packNo; // 기존 값을 덮어쓰기만 함 (누적하지 않음)
                  uniquePackCellCnt[packNo] = cell_cnt;
              }
              if (runId) {
                  uniqueRunId[runId] = runId;
              }
          } catch (e) {
              console.error("Error accessing filtered row", row, e);
          }
      }  
      let totalPackCell = Object.values(uniquePackCellCnt).reduce((sum, count) => sum + count, 0).toLocaleString('ko-KR');
      this.packNoGrid2View.setColumnProperty("cell수량", "footer", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f",fontBold: true}});  
      this.packNoGrid2View.setColumnProperty("cell수량x", "footer", { text: totalPackCell, numberFormat: "#,##0", style: {textAlignment: "far"}});
      this.packNoGrid2View.setColumnProperty("runId", "footer", { text: "RUN 수=>"+Object.values(uniqueRunId).length}); 
      this.packNoGrid2View.setColumnProperty("packNo", "footer", { text: "Pack수=> "+Object.keys(uniquePackCell).length});
      this.packNoGrid2View.refresh(); 
   },
   async searchCellIdClick(fieldName) {
    if (this.isProcessing) return;
      this.isProcessing = true;
      this.searchDiv = 'CELL';
      this.cellIdGrid3View.resetFilters();
      this.cellIdGrid3View.clearCurrent();

      if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
        this.isProcessing = false;
        return;
      }

      let params = {
        packStatus: this.packStatusMap[fieldName],
        startDate: this.srchInfo.startDate?.toString().replaceAll('-', '') || '',
        endDate: this.srchInfo.endDate?.toString().replaceAll('-', '') || '',
      };

      let searchParam = {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch8',
            queryParams: params,
            target: this.cellIdRows3,
       };
      // 결과 처리 수정
      try {
      let results = await this.$axios.api.search(searchParam);

      await this.$nextTick();
      
      if (results && results.length > 0) {
        const dataProvider = this.data3Provider;
        //this.cellIdGrid3View.setDataProvider(dataProvider);
        // 데이터를 청크 단위로 로드
        //dataProvider.fillJsonData(results, { fillMode: "set" });
        //dataProvider.setRows(results);        
        this.isExcelExportDisabled2 = false;
        this.cellIdGrid3View.setColumnProperty("cellId", "footer", { text: "CELL수=>"+dataProvider.getRowCount().toLocaleString()}); 
        
        this.cellIdGrid3View.refresh();
      } else {
        console.warn('조회된 데이터가 없습니다.');
        this.$toast('warning', '조회된 데이터가 없습니다.');
        this.data3Provider.clearRows();
      }
    } catch (error) {
      console.error("검색 오류:", error);
      this.$toast('error', `검색 오류: ${error.message}`);
    } finally {
      this.isProcessing = false;
    }
  },
    async excelClick() {
      const grid = this.packNoGridView;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `포장/출하_내포장실적_PACK_NO조회1_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
    async excelClick2() {
      let grid = this.packNoGrid2View;
      if(this.searchDiv === 'CELL') 
        grid= this.cellIdGrid3View;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `포장/출하_내포장실적_PACK_NO조회_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

      // 3. 옵션 설정
      const options = {
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: '엑셀 Export 중입니다.',
        indicator: true, // 진행 표시기 사용
        header: '엑셀 내보내기', // 진행 창 제목
        done: () => {
          alert('엑셀 내보내기가 완료되었습니다!');
          // 수동으로 진행 상태 창 닫기
          if (grid._progress && grid._progress.close) {
            grid._progress.close();
          }
        },
        error: (err) => {
          console.error("엑셀 내보내기 오류:", err);
          alert('엑셀 내보내기에 실패했습니다: ' + err.message);
          if (grid._progress && grid._progress.close) {
            grid._progress.close();
          }
        }
      };
      // 4. 내보내기 실행
      grid.exportGrid(options);
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    async onCellClickedPackNoGrid(grid, clickData) {
      try {
          if (clickData.cellType === 'header' || clickData.column === '합계') return;

          const current = grid.getCurrent();
          const rowIndex = current.itemIndex;
          //this.$toast('info',grid.getValue(rowIndex,clickData.column));
          let data_count = grid.getValue(rowIndex,clickData.column);
          if(data_count > 61000) {
            this.$toast('warning',clickData.column + ' cell 갯수가 6만건 이상 입니다\n시작일,종료일 조정해서 6만 이하로 조회 하세요.');
            return;
          }

          try {
            if(rowIndex==0)
              this.searchPackNoClick(clickData.fieldName);
            else
              this.searchCellIdClick(clickData.fieldName);
          } catch (error) {
            console.error('내포장 실적 packNoGrid2 search', error);
            return false;
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    }, 

        setCellStyleCallbackCellIdGrid3(grid, cell){
            let rtn = {};
            
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName; 

           if ( jsonData.diffYn === 'Y' ) {
                rtn.styleName = "diff-row";
           }

          return rtn;

    },
    setHeaderColor(gridView, columnName, backgroundColor, textColor = '#FFFFFF') {
      // 1. 컬럼 존재 여부 확인
      const column = gridView.columnByName(columnName);
      if (!column) {
        console.error(`Column '${columnName}' not found`);
        return;
      }

      // 2. 기존 헤더 설정 유지하면서 스타일만 변경
      const currentHeader = column.header || {};
      
      gridView.setColumnProperty(columnName, "header", {
        ...currentHeader,  // 기존 설정 유지
        styles: {
          ...(currentHeader.styles || {}),  // 기존 스타일 유지
          background: backgroundColor,
          textColor: textColor,
          textAlignment: "center",
          fontBold: true
        }
      });

      // 3. 강력한 새로고침 방법
      setTimeout(() => {
        gridView.refresh();
        gridView.displayOptions.fitStyle = "even";
        gridView.setDisplayOptions(gridView.displayOptions);
      }, 10);
    },
    setGroupHeaderColor(gridView, groupName, backgroundColor, textColor = '#000000') {
    // 기존 그룹 설정 가져오기
    const options = gridView.getGroupingOptions();
    
    // 새 스타일 정의
    const styleName = `groupHeader_${groupName}`;
    gridView.setStyles({
      [styleName]: {
        background: backgroundColor,
        textColor: textColor,
        textAlignment: "center",
        fontBold: true,
        fontSize: "14px"
      }
    });
    },
      // setCellStyleCallbackPackNoGrid(grid, cell) {
    //   let rtn = {};
    //   const fieldName = cell.index.fieldName;
    //   if (fieldName != '구분' && cell.value > 0) {
    //     rtn['renderer'] = {
    //       type: 'link',
    //       urlCallback: function (grid, cell) {},
    //       titleField: 'fieldName',
    //     };
    //   }
    //   return rtn;
    // },

    // onCellItemClickedPackNoGrid(grid, index, clickData) {
    //   if (clickData.type == 'link' && clickData.url) {
    //     try {
    //       //this.$toast('info', JSON.stringify(clickData.fieldName, null, 2));
    //       if(index.dataRow==0)
    //         this.searchPackNoClick(clickData.fieldName);
    //       else
    //         this.searchCellIdClick(clickData.fieldName);
    //     } catch (error) {
    //       console.error('내포장 실적 packNoGrid2 search', error);
    //       return false;
    //     }

    //     this.clearClick(); 
    //     return false;
    //   }
    // },
  },
};
</script>

<style >

.diff-row {  
  background-color: #f3d2b4 !important;
}
</style>
