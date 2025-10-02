/**
*	기준정보 > 공정별 불량코드 등록
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
</div>
</template>

<script>
import { RowState } from "realgrid";
import grid1Field from "@web/m0006000/js/M0006007_1.js";
import grid2Field from "@web/m0006000/js/M0006007_2.js";

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
  mounted() {},
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
      console.log(resp);
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
      console.log(resp);
    },

    searchClick() {
      this.getGrid1Data();
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
      this.gridDataProvider2.addRow({'공정코드':this.selectedProcCode,'적용구분':'0','rw적용':'false','사용여부':'false'});
      let itemIndex = this.gridView2.getItemCount() - 1;
      this.gridView2.setCurrent({ itemIndex: itemIndex});
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
      await this.saveData();
    },

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
  },
};
</script>
<style lang="scss" scoped>
	::v-deep .row ,.col-4, .col-8{
		height: 100%;
	}
</style>
