<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3" class="period">
          <div class="form-floating me-1">
            <date-picker label="From" v-model="params.startDate" />
            <label for="floatingPicker">From</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="To" v-model="params.endDate" />
            <label for="floatingPicker">To</label>
          </div>
        </b-col>
        <b-col cols="2">
          <label class="ms-2"><input type="radio" v-bind:value="'재작업 제외'" v-model="params.gubun" class="me-1"/>재작업 제외</label>
          <label class="ms-3 me-3"><input type="radio" v-bind:value="'재작업 포함'" v-model="params.gubun" class="me-1"/>재작업 포함</label>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchClick"><span class="ico_search"></span>조회</b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="excelClick">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="grid" :uid="'grid'" :rows="rows" style="height: 100%" :fitLayoutWidthEnable="false"/>
      </div>
    </div>
  </div>
</template>
<script>

import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { ValueType } from 'realgrid';
import moment from "moment";

export default {
  props: {},
  components: {},
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  watch: {},
  data() {
    return {
      grid: null,
      rows: [],
      headerList:[],
      params: {
        startDate: null,
        endDate: null,
        gubun: '재작업 제외',
      },
    };
  },
  computed: {
  },
  created() {
    var current = new Date();
    this.params.startDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-01`;
    var lastDayOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    this.params.endDate = `${lastDayOfMonth.getFullYear()}-${(lastDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`;
    this.initializeGrid();
  },
  mounted() {    
    this.getHeaderList();
  },
  beforeUnmount() {},
  methods: {
    gv() {
      return this.$refs.grid.getGridView();
    },
    dp() {
      return this.$refs.grid.getGridDataProvider();
    },
    
    initializeGrid() {
      this.grid = _.cloneDeep(require(`./js/DailyProdReport.js`));
    },
    
    getHeaderList(){
      this.$axios.api.search({menuId: "M0003005", queryId: "selectWipHeaderList"}).then(resp => {
        let items = [];        
        let grNm = '';
        let ht = '';
        this.headerList = _.cloneDeep(resp);
        
        //total 컬럼 추가
        this.addTotalColumn(resp);
        
        for(let i=0; i< resp.length; i++){
          let el = resp[i];
          let fn = el['공정코드'] +"seq"+el['seq'];
          this.addColumn(fn,el['공정명']);
          
          if(el['공정명'] === el['header']){
            this.addLayoutOneRow(fn);
          }else{
            grNm = el['header'] + i;
            ht = el['header'];
            //console.log("fn", fn);
            items.push(fn);

            if(i === resp.length - 1 || el['header'] !== resp[i+1]['header']){
              this.addLayoutTwoRow(grNm,ht,items);
              items = []; //초기화
              grNm = '';
              ht = '';
            }
          }
        }

      }).catch(error => {
        console.error("error", error);
      });
      
    },
    addTotalColumn(list){
      let veList = [];
      let fn = "total";
      for(let i=0; i< list.length; i++){
        let el = list[i];
        let f = el['공정코드'] +"seq"+el['seq'];
        veList.push("values['"+f+ "']");
      }

      this.dp().addField({fieldName: fn,dataType: ValueType.NUMBER,valueExpression:veList.join("+")});
      this.gv().addColumn({name: fn,fieldName: fn,width: 80,header: {text: "Total"},autoFilter: true,editable: false,styleName: "tr",numberFormat: '#,##0',
        footer: [
          {valueCallback: this.footerSum1,numberFormat: '#,##0'},
          {valueCallback: this.footerSum2,numberFormat: '#,##0'},
          {valueCallback: this.footerSum3,numberFormat: '#,##0'},
          {valueCallback: this.footerSum4,numberFormat: '#,##0'},
          {valueCallback: this.footerSum5,numberFormat: '#,##0'},
          {valueCallback: this.footerSum6,numberFormat: '#,##0'},
        ]
      });
      this.gv().addLayout(fn);
    },
    addColumn(fn,hn){
      this.dp().addField({fieldName: fn,dataType: ValueType.NUMBER});
      // this.gv().addColumn({name: fn,fieldName: fn,width: 120,header: {text: hn},editable: false,styleName: "tr",numberFormat: '#,##0', footer: {expression: "sum"}});
      this.gv().addColumn({name: fn,fieldName: fn,width: 80,header: {text: hn, styleName: 'multiline-header1'},editable: false,styleName: "tr",numberFormat: '#,##0',
        footer: [
          {valueCallback: this.footerSum1,numberFormat: '#,##0'},
          {valueCallback: this.footerSum2,numberFormat: '#,##0'},
          {valueCallback: this.footerSum3,numberFormat: '#,##0'},
          {valueCallback: this.footerSum4,numberFormat: '#,##0'},
          {valueCallback: this.footerSum5,numberFormat: '#,##0'},
          {valueCallback: this.footerSum6,numberFormat: '#,##0'},
        ]
      });
    },
    footerSum1(grid, column, footerIndex, columnFooter, value){
      let sum = 0;
      let i = 0;
      var iCnt = grid.getItemCount();
    
      while(i < iCnt) {
        if(grid.getValue(i, 'type') === 'IN'){
          sum += Number(grid.getValue(i, column.name));
        }
        i ++;
      }
      return sum;
    },
    footerSum2(grid, column, footerIndex, columnFooter, value){
      let sum = 0;
      let i = 0;
      var iCnt = grid.getItemCount();
    
      while(i < iCnt) {
        if(grid.getValue(i, 'type') === 'OUT'){
          sum += Number(grid.getValue(i, column.name));
        }
        i ++;
      }
      return sum;
    },
    footerSum3(grid, column, footerIndex, columnFooter, value){
      let sum = 0;
      let i = 0;
      var iCnt = grid.getItemCount();
    
      while(i < iCnt) {
        if(grid.getValue(i, 'type') === 'LOSS'){
          sum += Number(grid.getValue(i, column.name));
        }
        i ++;
      }
      return sum;
    },

    footerSum4(grid, column, footerIndex, columnFooter, value){
      let sum = 0;
      let i = 0;
      var iCnt = grid.getItemCount();
    
      while(i < iCnt) {
        if(grid.getValue(i, 'type') === 'NG'){
          sum += Number(grid.getValue(i, column.name));
        }
        i ++;
      }
      return sum;
    },

    footerSum5(grid, column, footerIndex, columnFooter, value){
      let sum = 0;
      let i = 0;
      var iCnt = grid.getItemCount();
    
      while(i < iCnt) {
        if(grid.getValue(i, 'type') === '수율제외'){
          sum += Number(grid.getValue(i, column.name));
        }
        i ++;
      }
      return sum;
    },

    footerSum6(grid, column, footerIndex, columnFooter, value){
      let sum = 0;
      let i = 0;
      var iCnt = grid.getItemCount();
    
      while(i < iCnt) {
        if(grid.getValue(i, 'type') === '재공재고'){
          sum += Number(grid.getValue(i, column.name));
        }
        i ++;
      }
      return sum;
    },

    addLayoutOneRow(fn){
      //레이아웃 추가
      this.gv().addLayout(fn);
    },
    addLayoutTwoRow(grNm,ht,fns){
      //그룹 레이아웃 추가
      const sfns = fns.map((col, index) => ({
        column: col,
        groupShowMode: index === 0 ? "always" : "expand"
      }));

      this.gv().addLayout({
        name: grNm,
        expandable: true,
        expanded: true,
        header:{ text: ht }, items:sfns
      });
    },

    async searchClick() {
      if(_.isNil(this.params.startDate) || _.isNil(this.params.endDate)){
        this.$toast("info",'From ~ To 선택하십시오.');
        return;
      }
      if (moment(this.params.startDate).isAfter(moment(this.params.endDate))) {
        this.$toast("info","From 날짜가 To 날짜보다 클 수 없습니다.");
        return;
      } 
    
      let params = {
        startDate: String(this.params.startDate).replace(/-/g, ''),
        endDate: String(this.params.endDate).replace(/-/g, '')
      }
      this.$axios.api.search({menuId: "R0000000", queryId: (this.params.gubun == '재작업 제외' ? "R0000000_Sch9" : "R0000000_Sch8"), queryParams: params, target: this.rows})
    },
    excelClick(){
      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const fileName = `생산일보_${this.params.gubun}${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      this.gv().exportGrid({
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: "엑셀 Export중입니다.",
        exportGrids: [
          { grid: this.gv(), sheetName: '생산일보' },
        ],
        done: () => {
          this.$toast('success', '엑셀 내보내기가 완료되었습니다!');
        },
      });
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .period{
	width: 20%!important;
	}
:deep .rg-fixed-footer{
 border-top: 2px solid  #E56615; 
} 
:deep .rg-footer{
 border-top: 2px solid #E56615; 
 font-weight: bold;
}
</style>

