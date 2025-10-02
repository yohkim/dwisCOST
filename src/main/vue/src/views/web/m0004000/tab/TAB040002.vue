/*
* 제조 실적 관리 > Hold 관리 > Hold 해제
*/
<template>
  <div>
    <div border class="search_box">
      <b-row class="search_area">
        <b-col cols="3" class="period">
          <div class="label_title">처리 일자</div>
          <div class="form-floating me-1">
            <date-picker label="시작일" v-model="startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="종료일" v-model="endDate" />
            <label for="floatingPicker">종료일</label>
          </div>
        </b-col>

        <b-col cols="1" class="align-center">
          <div class="form-floating">
             <input type="text" ref="inpBarcode" class="form-control label-60" id="floating" placeholder="RUN_NO" autocomplete="off" v-model="runNo"
                @input="this.$utils.convertToUpperEng($event, 'runNo', this)" 
                @keyup.enter="processBarcode">
                <label for="floating">RUN_NO</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchGrid"
          ><span class="ico_search"></span>조회</b-button
        >
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button @click="saveRows" class="sub"><span></span>HOLD해제</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid
          ref="holdGrid"
          :uid="'holdGrid'"
          :rows="rows"
          style="height: 100%"
        />
      </div>
    </div>
    <CmDialog1 ref="cmDialog1M00004003" @confirm="handleConfirm" />
  </div>
</template>
<script>
const URI_PREFIX = "/api/m0004000/m0004003";
import moment from "moment";
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";

export default {
  name: "DW_TAB040001",
  props: {},
  components: {},
  setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
  },
  data() {
    return {
      orders: [],
      modelList: [],
      selectedModel: null,
      workTypeList: [],
      selectedWorkType: null,
      startDate: "",
      endDate: "",
      remarks: null,
      holdGrid: null,
      rows: [],
      editableColumns: ["hold해제조치내역"],
      runNo:''
    };
  },
  computed: {
    GV() {
      return this.$refs.holdGrid.getGridView();
    },
    DP() {
      return this.$refs.holdGrid.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    this.$eventBus.on("M0004003MenuMove", this.menuMove);
    this.getSelectOptions();
    this.GV.setFixedOptions({colCount: 3});
  },
  beforeUnmount() {
    this.$eventBus.off("M0004003MenuMove");
  },
  methods: {
    initPoNo() {
      this.poNo = null;
    },
    menuMove(data) {
      this.$nextTick(() => {
        //this["selectedModel"] = { value: data["제품유형"], text: data["제품유형라벨"] };
        //this["selectedWorkType"] = { value: data["작업구분"], text: data["작업구분라벨"] };
        let date = this.$utils.rgDisplayDate(null, null, data["수주일자"]);
        this.startDate = date;
        this.endDate = date;
        //this.poNo = data["poNo"];
        this.searchGrid();
      });
    },
    async getSelectOptions() {
      let param = [
        {
          menuId: "M0004003",
          queryId: "getModels",
          callback: (data) => {
            this.$utils.transformData(
              data,
              ["value", "text"],
              ["코드", "제품유형"],
              this.modelList
            );
          },
        },
        {
          menuId: "M0004003",
          queryId: "getWorkTypes",
          callback: (data) => {
            this.$utils.transformData(
              data,
              ["value", "text"],
              ["코드", "작업구분"],
              this.workTypeList
            );
          },
        },
      ];
      //await this.$axios.api.searchAll(param);

      this.startDate = this.$utils.getTodayDate(); //this.$utils.getCurMonthStartDate();
      this.endDate = this.$utils.getTodayDate(); //this.$utils.getCurMonthEndDate();
    },
    async initializeGrid() {
      this.holdGrid = _.cloneDeep(require(`@web/m0004000/js/TAB040001.js`));
    },
    async searchGrid() {
      const searchOption = {
        runNo:this.runNo,
        startDate: this.startDate.replaceAll('-',''),
        endDate: this.endDate.replaceAll('-',''),
      };
      const param = {
        menuId: "M0004003",
        queryId: "searchHoldStatus",
        queryParams: searchOption,
        target: this.rows,
      };
      await this.$axios.api.search(param);
    },
    
    async saveRows() {
      //우선 새로 추가한 행만 저장=>확인한 행만 저장
      const checkedRowsIndex = this.GV.getCheckedRows();
      if (checkedRowsIndex.length > 0) {
        this.$confirm(
          "확인",
          "Hold해제 처리하시겠습니까?",
          async (confirm) => {
            if (confirm) {
              let rowList = [];
              checkedRowsIndex.forEach((element) => {
                let row = this.DP.getJsonRow(element);
                  row["hold해제처리자"]=this.userAuthInfo.userInfo.userName;
                  rowList.push(row);
              });
              const requiredFields = [
                "runNo",
                "hold일시",
                "hold해제처리자",
                "hold해제조치내역",     
              ];
              if (
                rowList.some((row) =>
                  requiredFields.some((field) => !row[field])
                )
              ) {
                this.$toast("warning", "입력값을 확인해주세요.");
                return;
              }

              try {
                let params = [];
                rowList.forEach(elem =>{
                  params.push({
                    menuId:'M0004003',
                    queryId:'cancelHoldStatus',
                    queryParams:elem
                  })
                });
                console.log(rowList);
                let resp = await this.$axios.api.searchAll(params);	
                console.log(resp);
                this.$toast("info", "저장완료");
              } catch {
                this.$toast("info", "에러발생. 재조회후 다시 작업해주세요.");
              }

              await this.searchGrid();
            }
          }
        );
      } else {
        this.$toast("info", "저장할 데이터가 없습니다.");
      }
    },
    handleConfirm(params) {
      console.log(params);
      let checkRow = params.gridView.getCheckedRows(true);
      console.log(checkRow);

      if (checkRow.length === 0) {
        console.warn("체크된 행이 없습니다.");
        return;
      }

      let row = params.dataProvider.getJsonRow(checkRow[0]);
      let index = params.dataRow;

      // 유효성 검사
      if (!row) {
        console.error("유효하지 않은 행 데이터입니다.");
        return;
      }
      console.log(row);
      if (params.gridJs == "HoldInfo.js") {
        const current = this.GV.getCurrent();
        this.DP.setValue(current.dataRow,'hold코드',row['hold코드']);
        this.DP.setValue(current.dataRow,'hold명',row['hold명']);
        this.DP.setValue(current.dataRow,'hold기준',row['기준']);
        this.DP.setValue(current.dataRow,'hold범위',row['hold범위']);
        this.DP.setValue(current.dataRow,'모니터링주기',row['모니터링주기']);
      }
    },

    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = String(today.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    },
    getYyyymmdd() {
      const today = new Date();
      const year = today.getFullYear().toString();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = String(today.getDate()).padStart(2, "0");

      return `${year}${month}${day}`;
    },
    processBarcode(){
    },

    async onKeyDownHoldGrid(grid, event) {
      const current = this.GV.getCurrent();
      if(current.column=="runNo"&&event.key == 'Enter'){
        this.GV.commit();
        console.log(current);
        const runNo = this.DP.getValue(current.dataRow,'runNo');
        if(runNo.length==15){
          const searchOption = {
            runNo
          };
          const param = {
            menuId: "M0004003",
            queryId: "getRunNoStatus",
            queryParams: searchOption,
          };
          const resp = await this.$axios.api.search(param);
          console.log(resp)
          if(resp.length>0){
            const runStat= resp[0];
            this.DP.setValue(current.dataRow,'hold여부',runStat['hold여부']);
            this.DP.setValue(current.dataRow,'min공정명',runStat['min공정명']);
            this.DP.setValue(current.dataRow,'min설비명',runStat['min설비명']);
            this.DP.setValue(current.dataRow,'max공정명',runStat['max공정명']);
            this.DP.setValue(current.dataRow,'max설비명',runStat['max설비명']);
            this.GV.commit();
          }
        }
      }
    },
    async onCellClickedHoldGrid(grid, clickData) {
      if (clickData.cellType != "data") return;

      const prod = grid.getDataSource();
      const rowState = prod.getRowState(clickData.dataRow);

      if (rowState != "created") return;
      console.log(clickData);
      if(clickData.column=='hold명'){
        const params = {
          dialogTitle: "HOLD 기준정보",
          popUpSize: "lg", //sm,lg,xl
          height: 500,
          gridJs: "HoldInfo.js",
          search: {
            menuId: "M0004003",
            queryId: "getHoldInfo",
            queryParams: {},
          },
        };
        this.$refs.cmDialog1M00004003.openDialog(params);
      }
      
    },
    setCellStyleCallbackHoldGrid: function (grid, model) {
      let ret = {};
      if (this.editableColumns.includes(model.dataColumn.fieldName)) {
        const prod = grid.getDataSource();
        const dataRow = model.index.dataRow;
        const state = prod.getRowState(dataRow);
        ret.editable = true;
        ret.styleName = 'edit'
      } else {
        ret.editable = false;
      }

      return ret;
    },
  },
};
</script>
