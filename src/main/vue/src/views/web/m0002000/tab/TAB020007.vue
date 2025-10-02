/**
*	프로세스 플래닝 >  생산 공정 관리 > 공정별 불량코드 등록
*/
<template>
<div>
  <b-row >
      <b-col cols="4">
         <div class="grid_box">
          <div class="left_box">
            <div class="title">공정목록</div>
            <div class="btn_wrap ms-auto">
              <b-button class="second" @click="searchClick">
                <span class="ico_search"></span>조회</b-button>
            </div>
          </div>
          <div class="grid-border-none">
            <RealGrid
              ref="grid1"
              :uid="'grid1'"
              :step="'1'"
              :rows="grid1Rows"
              style="height: 100%"
            />
        </div>
      </div>
      </b-col>
      <b-col cols="8">
         <div class="grid_box">
            <div class="left_box">
              <div class="title">공정별 불량</div>
              <div class="btn_wrap ms-auto">
                  <b-button class="second" @click="moveRow(0)">▲</b-button>
                  <b-button class="second" @click="moveRow(1)">▼</b-button>
                  <div class="hr"></div>
                  <b-button class="second" @click="excelBtnClick">엑셀</b-button>
                  <b-button class="sub" @click="addBtnClick">추가</b-button>
                  <b-button @click="delBtnClick">삭제</b-button>
                  <b-button class="main" @click="saveBtnClick">저장</b-button>
                </div>            
            </div> 
          <div class="grid-border-none">
             <RealGrid
              ref="grid2"
              :uid="'grid2'"
              :step="'2'"
              :rows="grid2Rows"
              style="height: 100%"
            />
          </div>
        </div>
    </b-col>
  </b-row>
  <CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
</div>
</template>

<script>
import { RowState } from "realgrid";
import grid1Field from "@web/m0002000/js/TAB020007_1.js";
import grid2Field from "@web/m0002000/js/TAB020007_2.js";

export default {
  name: "DW_M0006007",
  props: {},
  components: {},
  watch: {},
  data() {
    return {
      grid1:null,
      grid2:null,
      grid1Rows:[],
      grid2Rows:[],
      selectedProcCode:null,
    };
  },
  computed: {
    gridView1() {
      return this.$refs.grid1.getGridView();
    },
    gridDataProvider1() {
      return this.$refs.grid1.getGridDataProvider();
    },
    gridView2() {
      return this.$refs.grid2.getGridView();
    },
    gridDataProvider2() {
      return this.$refs.grid2.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    await this.searchClick();
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.grid1 = _.cloneDeep(grid1Field);
      this.grid2 = _.cloneDeep(grid2Field);
    },
    async getGrid1Data() {
      this.gridView2.commit();

      let param = {
        menuId: "M0006007",
        queryId: "getGrid1Data",
        target: this.grid1Rows,
      };
      let resp = await this.$axios.api.search(param);
      //console.log(resp);
    },

    async getGrid2Data(processCode) {
      this.gridView2.commit();

      let param = {
        menuId: "M0006007",
        queryId: "getGrid2Data",
        queryParams: {'공정코드':processCode},
        target: this.grid2Rows,
      };
      let resp = await this.$axios.api.search(param);
      //console.log(resp);
      if(resp.length==0){
        this.gridDataProvider2.setRows([]);
      }
    },

    searchClick() {
      this.getGrid1Data();
    },
    // dir 0 : 위 1: 아래
    moveRow(dir){
      let current = this.gridView2.getCurrent();
      let rowCount = this.gridDataProvider2.getRowCount();
      let target = current.dataRow;
      if(dir==0){
        target = current.dataRow-1;
        if(target>=0)
          this.gridDataProvider2.moveRow(current.dataRow,target);
      }else{
        target = current.dataRow+1;
        if(target<rowCount)
          this.gridDataProvider2.moveRow(current.dataRow,target);
      }
      this.gridView2.setCurrent({ dataRow: target, column: current.column });
		},
    //그리드 이벤트 설정
    //셀 클릭시
    async onCellClickedGrid1(grid, clickData) {
      if (clickData.cellType != "data"&&clickData.cellType != "check") return; 
      
      const prod = grid.getDataSource();
      let row = prod.getJsonRow(clickData.dataRow);
      this.selectedProcCode = row['공정코드'];

      await this.getGrid2Data(this.selectedProcCode);
    },
    async excelBtnClick() {
      const grid = this.gridView2;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const fileName = `공정별불량${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

      const options = {
        type: "excel",
        target: "local",
        fileName: fileName,
        progressMessage: "엑셀 Export중입니다.",
        done: function () {
          alert("엑셀 내보내기가 완료되었습니다!");
        },
      };

      grid.exportGrid(options);
    },

    addBtnClick() {
      this.gridView2.commit();
      /*
      this.gridDataProvider2.addRow({'공정코드':this.selectedProcCode,'적용구분':'0','rw적용':'false','사용여부':'true',line:'DFB1','신뢰성인계여부':'0','수율불량제외여부':'0','rework진행여부':'0',});
      let itemIndex = this.gridView2.getItemCount() - 1;
      this.gridView2.setCurrent({ itemIndex: itemIndex});
      */
      let params = {
          dialogTitle: "불량코드 찾기",
          step: 7,
          height: 300,
          width: 700,
          gridJs: `CP0000000018_multi.js`,
          search: { menuId: "CMDIALOG", queryId: "selectErrorCodeList" },
        };
        this.$refs.cmDialog1.openDialog(params);
    },

    delBtnClick() {
      this.gridView2.commit();
      const checkedRows = this.gridView2.getCheckedRows();
      if (checkedRows.length === 0) {
        this.$toast("info", "삭제할 행을 선택하세요");
      } else {
        let delItems = [];
        checkedRows.forEach((itemIndex) => {
          if (
            this.gridDataProvider2.getRowState(itemIndex) === RowState.CREATED
          ) {
            delItems.push(itemIndex);
          } else {
            this.gridDataProvider2.setRowState(itemIndex, RowState.DELETED);
          }
        });
        this.gridDataProvider2.removeRows(delItems);
      }
    },

    async saveBtnClick() {
      this.gridView2.commit();
      await this.saveData2();
    },


    //현재 사용 X
    async saveData() {
      this.$confirm(
        "확인",
        "수정하신 내용을 저장 하시겠습니까?",
        async (confirm) => {
          if (confirm) {
            let saveData = this.$refs.grid2.getSaveData();
              let param = {
                menuId:'M0006007',
                delete: [{queryId:'deleteData', data:saveData.delete}],
                insert: [{queryId:'insertData', data:saveData.insert}],
                update: [{queryId:'updateData', data:saveData.update}],
              };

            try {
              let resp = await this.$axios.api.saveData(param);
              this.$toast("info", "저장완료");
              this.getGrid2Data(this.selectedProcCode);
            } 
            catch {
              this.$toast("info", "에러발생. 다시 작업해주세요.");
            }
          }
        }
      );
    },

    async saveData2() {
      this.$confirm(
        "확인",
        "수정하신 내용을 저장 하시겠습니까?",
        async (confirm) => {
          if (confirm) {
            let rows=this.gridView2.getJsonRows(0,-1);
            let params = {
              "공정코드" : this.selectedProcCode,
              insert:rows
            };
            //console.log(params);
            try {
              let resp = await this.$axios.post("/api/m0006000/m0006007/saveData", params)
              this.$toast("info", resp.data.resultCode);
              this.getGrid2Data(this.selectedProcCode);
            } 
            catch {
              this.$toast("info", "에러발생. 다시 작업해주세요.");
            }
          }
        }
      );
    },

    handleConfirm(params) {
      //console.log(params);
      
      if(params.gridJs=="CP0000000018.js"){
        let checkRow = params.gridView.getCheckedRows(true);
        //console.log(checkRow);
        if (checkRow.length > 0) {
          let row = params.dataProvider.getJsonRow(checkRow[0]);
          let index = params.dataRow;
          if (params.gridJs == "CP0000000018.js") {
            this.gridView2.setValue(index, "불량코드", row["불량코드"]);
            this.gridView2.setValue(index, "불량명", row["불량명"]);
          } 
        }
      }
      else if(params.gridJs=="CP0000000018_multi.js"){
        let checkRow = params.gridView.getCheckedRows(true);
        let itemIndex = this.gridView2.getItemCount()+1;
        for(let i =0;i<checkRow.length;i++){
          let row = params.dataProvider.getJsonRow(checkRow[i]);
          this.gridDataProvider2.addRow({'불량코드':row['불량코드'],'불량명':row['불량명'],'적용순서':itemIndex+i,공정코드:this.selectedProcCode,'적용구분':'0','rw적용':'false','사용여부':'true',line:'DFB1','신뢰성인계여부':'0','수율불량제외여부':'0','rework진행여부':'0',});
        }
        this.gridView2.setCurrent({ itemIndex: this.gridView2.getItemCount()});
      }
      this.gridView2.commit();
    },

    onCellClickedGrid2(grid, clickData) {
      if (clickData.cellType != "data") return;
      const prod = grid.getDataSource();
      //if (prod.getRowState(clickData.dataRow) != "created") return;
      let params = {};
      if (clickData.fieldName == "불량명"||clickData.fieldName == "불량코드") {
        params = {
          dialogTitle: "불량코드 찾기",
          step: 7,
          height: 300,
          width: 700,
          dataRow: clickData.dataRow,
          gridJs: `CP0000000018.js`,
          search: { menuId: "CMDIALOG", queryId: "selectErrorCodeList" },
        };
        this.$refs.cmDialog1.openDialog(params);
      } 
    },
  },
};
</script>
<style lang="scss" scoped>
	::v-deep .row ,.col-4, .col-8{
		height: 100%;
	}
</style>
