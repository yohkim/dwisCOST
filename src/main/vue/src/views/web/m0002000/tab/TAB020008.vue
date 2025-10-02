/**
*	프로세스 플래닝 > SITE 모델링 관리 > 설비관리(PM계획vs실적)
*/
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="1" class="period">
          <div class="form-floating me-1">
            <date-picker label="From" v-model="params.yyyymm" mode="month"/>
            <label for="floatingPicker">From</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input type="text" class="form-control label-80" id="floating" placeholder="" v-model="params.eqSumNm" autocomplete="off"/>
            <label for="floating">설비약명</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchClick"><span class="ico_search"></span>조회</b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="grid-border-none">
        <RealGrid
          ref="rgGrid"
          :uid="'rgGrid'"
          :step="'1'"
          :rows="gridRows"
          style="height: 100%"
        />
      </div>
    </div>
  </div>
</template>

<script>
import gridField from "@web/m0002000/js/TAB020008.js";
import moment from "moment";
import { ValueType } from 'realgrid';

export default {
  props: {},
  components: {},
  watch: {},
  data() {
    return {
      rgGrid: null,
      gridRows: [],
      params:{
        yyyymm:'',        
        eqSumNm:'',
      },
      divColorMap:{
        '예정일':'due',
        '계획일':'plan',
        '실행일':'exec',
      }
    };
  },
  computed: {
  },
  created() {
    this.initializeGrid();    
  },
  mounted() {
    this.params.yyyymm = moment().startOf("month").format("YYYY-MM");
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.rgGrid = _.cloneDeep(gridField);
    },
    gv() {
      return this.$refs.rgGrid.getGridView();
    },
    dp() {
      return this.$refs.rgGrid.getGridDataProvider();
    },
    searchClick() {
      const days = [];  //필요 할 수 있지 않을가?
      let firstDate = moment(moment(this.params.yyyymm, "YYYY-MM").startOf("month").format("YYYY-MM-DD"));
      const lastDate = moment(moment(this.params.yyyymm, "YYYY-MM").endOf("month").format("YYYY-MM-DD"));
      const monthDiff = moment.duration(lastDate.diff(firstDate)).asMonths();
      let idx = 1;
      
      // if (moment(currentDate).isAfter(moment(lastDate))) {
      //   this.$toast("info","From 날짜가 To 날짜보다 클 수 없습니다.");
      //   return;
      // } 
      // if (monthDiff > 1) {
      //   this.$toast("info","한 달 이상 범위는 허용되지 않습니다.");
      //   return;
      // }     

      this.$refs.rgGrid.destroy();
      this.initializeGrid();
      this.$refs.rgGrid.created();

      while (firstDate.isSameOrBefore(lastDate)) {
        days.push(firstDate.format("YYYYMMDD"));
        this.addDaysColumn("day"+idx,firstDate.format("YY/MM/DD"));
        idx++;
        firstDate.add(1, "day");
      }

      this.search(days);
      this.gv().onShowTooltip = this.onShowTooltip;
    },
    search(days){
      let qp = _.cloneDeep(this.params);
      qp['yyyymm'] = qp['yyyymm'].replace(/-/g, "");
      qp['days'] = days;
      this.$axios.api.search({menuId: "M0002001", queryId: "selectEquipPmVsAct", queryParams: qp, target: this.gridRows});      
    },

    addDaysColumn(fn,hn){
      this.dp().addField({fieldName: fn,valueType: ValueType.TEXT});
      this.gv().addColumn({name: fn,fieldName: fn,width: 60,header: {text: hn},displayCallback: this.dayDisplay,editable: false});
    },
    dayDisplay(grid, index, dateStr){
      return '';
    },
    setCellStyleCallbackRgGrid(grid, cell) {
      let rtn = {};
      const fieldName = cell.index.fieldName;
      
      if(fieldName.indexOf('day') > -1 && cell.index.value === 'Y'){
        let div = grid.getValue(cell.index.dataRow,'구분');
        rtn.styleName = this.divColorMap[div];   
        return rtn;
      }
      return null;
    },
    onShowTooltip(grid, index, value){
      let column = index.column;
      let itemIndex = index.itemIndex;
      let tooltip = value;
      if(column.indexOf("day") > -1) {
        tooltip = "<div style='background-color: white; border: 1px solid black; padding: 5px; font-size: 16px;'>" +
            "설비명: " + grid.getValue(itemIndex, "설비명") + "<br>" +
            "구분: " + grid.getValue(itemIndex, "구분") + "<br>" +
            "Date: " + grid.columnByName(column).header.text +
          "</div>";
          return tooltip;
      }else{
        return null;
      }
    },
    onCellClickedRgGrid(grid, clickData){
      let column = clickData.column;
      let itemIndex = clickData.itemIndex;

      if(clickData.cellType !== 'data'){
        return;
      }

      if(clickData.column.indexOf('day') < 0){
        return;
      }

      if(grid.getValue(itemIndex, "구분") === '예정일'){
        this.$toast('info','예정일은 수정 할 수 없습니다.');
        return;
      }
      
      let obj = {};
      let originalDate = grid.columnByName(column).header.text;
      let parts = originalDate.split("/"); 
      let date = "20" + parts.join("");
      let saveDiv = grid.getValue(itemIndex, column);
      
      obj["공장코드"] = grid.getValue(itemIndex, "공장코드");
      obj["seqNo"] = grid.getValue(itemIndex, "seqNo");
      obj["공정"] = grid.getValue(itemIndex, "공정");
      obj["설비명"] = grid.getValue(itemIndex, "설비명");
      obj["pm기준"] = grid.getValue(itemIndex, "pm기준");
      obj["누적실적"] = grid.getValue(itemIndex, "누적실적");
      obj["pm최근실행일"] = grid.getValue(itemIndex, "pm최근실행일");
      obj["div"] = grid.getValue(itemIndex, "구분");
      obj['date'] = saveDiv === null?date:null;
      
      this.$confirmYesOrNo("선택", obj["div"] + " : " + originalDate + " 저장 하시겠습니까?", (confirmed) => {
        if (confirmed) {
          this.updateEquipPmVsAct(originalDate,obj);
        }
      });
      
    },
    updateEquipPmVsAct(originalDate,obj){
      this.$axios.api.search({menuId: "M0002001", queryId: "updateEquipPmVsAct", queryParams: obj}).then(response => {
        this.$toast("info",obj["div"] + " : " + originalDate + " 처리되었습니다.");
        this.searchClick();
      }).catch(error => {
        console.error("error", error);
      });
    },

    onCellEditedRgGrid(grid, itemIndex, row, field){
      if(field === 5){  //누적실적
        let obj = {};
        obj["공장코드"] = grid.getValue(itemIndex, "공장코드");
        obj["seqNo"] = grid.getValue(itemIndex, "seqNo");
        obj["공정"] = grid.getValue(itemIndex, "공정");
        obj["설비명"] = grid.getValue(itemIndex, "설비명");
        obj["누적실적"] = grid.getValue(itemIndex,"누적실적");

        this.$axios.api.search({menuId: "M0002001", queryId: "updateEquipCumulPerf", queryParams: obj}).then(response => {
          this.$toast("info","처리되었습니다.");          
        }).catch(error => {
          console.error("error", error);
        });
      }
      
    },
  },
};
</script>
<style lang="scss">
.due{
  background: #FACCCB !important;
}
.plan{
	background: #399ED8 !important;
}
.exec{
	background: #5DA624 !important;
}
</style>np