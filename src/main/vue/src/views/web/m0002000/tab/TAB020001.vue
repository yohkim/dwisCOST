/**
*	기준정보 > 제품개발이력 관리
*/
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="2"> </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchClick"
          ><span class="ico_search"></span>조회</b-button
        >
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="excelBtnClick">엑셀</b-button>
          <b-button class="sub" @click="addBtnClick">추가</b-button>
          <b-button @click="delBtnClick">삭제</b-button>
          <b-button class="main" @click="saveBtnClick">저장</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid
          ref="cdGrid"
          :uid="'cdGrid'"
          :step="'1'"
          :rows="gridRows"
          style="height: 100%"
        />
      </div>
      <Popup ref="codePopup" @confirm="handleConfirm"/>
    </div>

  </div>
</template>

<script>
import { RowState } from "realgrid";
import gridField from "@web/m0002000/js/TAB020001.js";
import Popup from "./TAB020001Popup.vue"
export default {
  props: {},
  components: {Popup},
  watch: {},
  data() {
    return {
      cdGrid: null,
      gridRows: [],
    };
  },
  computed: {
    cdGridView() {
      return this.$refs.cdGrid.getGridView();
    },
    cdGridDataProvider() {
      return this.$refs.cdGrid.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  mounted() {
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.cdGrid = _.cloneDeep(gridField);
    },

    cellStyleCallEdit(grid, model) {
      let rtn = {};
      rtn["editable"] = model.item.rowState === RowState.CREATED;
      return rtn;
    },

    async getDataList() {
      this.cdGridView.commit();

      let params = {
        gubun: this.selectedGubun,
      };

      let param = {
        menuId: "M0006010",
        queryId: "getGridData",
        queryParams: params,
        target: this.gridRows,
      };
      let resp = await this.$axios.api.search(param);
      console.log(resp);
    },

    searchClick() {
      this.getDataList();
    },

    async excelBtnClick() {
      const grid = this.cdGridView;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const fileName = `제품개발이력관리${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
      this.cdGridView.commit();
      this.cdGridDataProvider.addRow({});
      let itemIndex = this.cdGridView.getItemCount() - 1;
      this.cdGridView.setCurrent({ itemIndex: itemIndex });
    },

    delBtnClick() {
      this.cdGridView.commit();
      const checkedRows = this.cdGridView.getCheckedRows();
      if (checkedRows.length === 0) {
        this.$toast("info", "삭제할 행을 선택하세요");
      } else {
        let delItems = [];
        checkedRows.forEach((itemIndex) => {
          if (
            this.cdGridDataProvider.getRowState(itemIndex) === RowState.CREATED
          ) {
            delItems.push(itemIndex);
          } else {
            this.cdGridDataProvider.setRowState(itemIndex, RowState.DELETED);
          }
        });
        this.cdGridDataProvider.removeRows(delItems);
      }
    },

    async saveBtnClick() {
      this.cdGridView.commit();
      await this.saveData();
    },

    async saveData() {
      this.$confirm(
        "확인",
        "수정하신 내용을 저장 하시겠습니까?",
        async (confirm) => {
          if (confirm) {
            let saveData = this.$refs.cdGrid.getSaveData();
              let param = {
                menuId:'M0006010',
                delete: [{queryId:'deleteData', data:saveData.delete}],
                insert: [{queryId:'insertData', data:saveData.insert}],
                update: [{queryId:'updateData', data:saveData.update}],
              };

            try {
              let resp = await this.$axios.api.saveData(param);
              this.$toast("info", "저장완료");
              this.searchClick();
            } 
            catch {
              this.$toast("info", "에러발생. 다시 작업해주세요.");
            }
          }
        }
      );
    },
    onCellClickedCdGrid(grid, clickData) {
      if(clickData.cellType != "data") return;
      if(clickData.fieldName == "제품코드"){
        let prodCode = grid.getValue(clickData.itemIndex,clickData.fieldName);
        let params={
          dataRow:clickData.dataRow
        };
        if(!_.isNil(prodCode)&&prodCode.length==8){
          params.prodGubun=prodCode.substring(0,1);
          params.site=prodCode.substring(1,2);
          params.process=prodCode.substring(2,3);
          params.size=prodCode.substring(3,4);
          params.prodNo=prodCode.substring(4,6);
          params.revNo=prodCode.substring(6,8);
        }
        this.$refs.codePopup.openDialog(params);
      }
    },
    handleConfirm(params){
      this.cdGridDataProvider.setValue(params.dataRow,"제품코드",params.prodCode);
    }
  },
};
</script>