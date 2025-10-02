<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="2" class="period">
          <div class="form-floating me-1">
            <date-picker label="From" v-model="calcDate" @change="dateChange"/>
            <label for="floatingPicker">일자</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchClick"><span class="ico_search"></span>조회</b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button v-if="calcing" class="main">집계중</b-button>
          <b-button v-else class="main" @click="calcClick">집계</b-button>
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
import moment from "moment";

export default {
  props: {},
  components: {
  },
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  watch: {},
  data() {
    return {
      grid: null,
      rows: [],
      calcDate: '',
      eventSource : null,
      calcing:false,
      headerList:[],
    };
  },
  computed: {
  },
  created() {
    this.calcDate = moment().format("YYYY-MM-DD");
    this.initializeGrid();
  },
  mounted() {    
    this.getHeaderList();
  },
  unmounted(){
    if(this.eventSource) {
        this.eventSource.close();
    }
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
      this.grid = _.cloneDeep(require(`./js/DPR.js`));
    },
    
    getHeaderList(){
      let qp = {};
      console.log("this.calcDate:::",this.calcDate);
      qp['calcDate'] = this.calcDate.replace(/-/g, "");
      this.$axios.api.search({menuId: "M0003005", queryId: "selectDprHeaderList",queryParams: qp}).then(resp => {
        // console.log("headerList:::",resp);
        let headerObj = resp[0];
        let headerTxtList = Object.keys(headerObj);

        headerTxtList.forEach(key => {
          this.gv().setColumnProperty(key, "header", {text: headerObj[key]});
        });

        // console.log("check:::",this.gv().layoutByName("shipping"));

        this.gv().layoutByName("shipping").items[2].header.text = headerObj["shippingMonthMonth"];

      }).catch(error => {
        console.error("error", error);
      });
      
    },
    

    async searchClick() {
      this.getHeaderList();
      let qp = {};
      qp['calcDate'] = this.calcDate.replace(/-/g, "");
      this.$axios.api.search({menuId: "M0003005", queryId: "selectDprList", queryParams: qp, target: this.rows}).then(resp =>{
        this.reSetFooter();   
      });
      // console.log("this.grid.options.footers:::",this.grid.options.footers);
      
    },
    reSetFooter(){
      let fItem = {height: 28};
      let fItems = [{height: 28}];  
      let gubuns = [...new Set(this.rows.map(item => item['구분']))];  
      let colFooters = [{expression: "sum",numberFormat: '#,##0'}];
      gubuns.forEach(el => {
        fItems.push(fItem);
        colFooters.push({valueCallback:
          function(grid, column, footerIndex, columnFooter, value){
            let sum = 0;
            let i = 0;
            let iCnt = grid.getItemCount();

            while(i < iCnt) {
              if(grid.getValue(i, '구분') === el){
                sum += Number(grid.getValue(i, column.name));
              }
              i ++;
            }
            return sum;
          },
          numberFormat: '#,##0'});
      });
      
      this.gv().setFooters(fItems);

      // console.log(this.grid.columns);

      this.grid.columns.forEach(col => {
        if(col.hasOwnProperty("needFooter") && col.needFooter === true){
          this.gv().columnByName(col.name).setFooters(colFooters);
        }
      });
    },

    calcClick(){      
      let apiUrl = process.env.VUE_APP_API_URL;
      this.eventSource = new EventSource(apiUrl+'/api/subscribe/dpr/calc');
      this.calcing =  true;
      this.eventSource.onmessage = (event) => {
        if(event.data === "SEND_COMPLETE"){
          this.eventSource.close();  // SSE 연결 종료
          this.$toast("info","집계가 완료되었습니다.");
          this.calcing = false;
          this.searchClick();
        }else{
          this.$toast("info",event.data);
        }
      };

    },
    
    excelClick(){
      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const fileName = `생산일보 ${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      this.gv().exportGrid({
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: "엑셀 Export중입니다.",
        exportGrids: [
          { grid: this.gv(), sheetName: '생산 일보' },
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

