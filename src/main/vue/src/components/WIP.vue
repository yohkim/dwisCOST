<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="2" class="period">
          <div class="form-floating me-1">
            <date-picker label="From" v-model="calcDate" @change="dateChange"/>
            <label for="floatingPicker">일자</label>
          </div>
          <code-select :codeList="calcDateTimeList" :label="'시간'" v-model="calcDateTime" :oneRequired="true" />
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
    <WIPDtlPopup ref="dtlPopup"/>
    <WIPDtlPopup2 ref="dtlPopup2"/>
    <WIPDtlPopup3 ref="dtlPopup3"/>
  </div>
</template>
<script>

import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { ValueType } from 'realgrid';
import moment from "moment";
import WIPDtlPopup from '@components/WIPDtlPopup.vue';
import WIPDtlPopup2 from '@components/WIPDtlPopup2.vue';
import WIPDtlPopup3 from '@components/WIPDtlPopup3.vue';

export default {
  props: {},
  components: {
    WIPDtlPopup,WIPDtlPopup2,WIPDtlPopup3
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
      calcDateTime: '',
      calcDateTimeList:[],
      eventSource : null,
      calcing:false,
      headerList:[],
      filterMap:{
        "model":[],
        "작업구분":[],
      },  //2025.6.24 추가
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
    this.dateChange();
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
      this.grid = _.cloneDeep(require(`./js/WIP.js`));
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
          // 헤더 텍스트 설정
          let hn = JSON.parse(`"${el['공정명']}"`); 
          this.addColumn(fn, hn);
          
          if(el['공정명'] === el['header']){
            this.addLayoutOneRow(fn);
          }else{
            grNm = el['header'] + i;
            ht = el['header'];
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

      this.gv().header.heights = [27, 40];
      this.gv().refresh();
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
      this.gv().addColumn({name: fn,fieldName: fn,width: 80,header: {text: "Total"},editable: false,styleName: "tr",numberFormat: '#,##0',autoFilter: true,
        footer: [
          {expression: "sum",numberFormat: '#,##0'},
          {valueCallback: this.footerSumWait,numberFormat: '#,##0'},
          {valueCallback: this.footerSumIng,numberFormat: '#,##0'},
          {valueCallback: this.footerSumHold,numberFormat: '#,##0'},
        ]
      });
      this.gv().addLayout(fn);
    },
    addColumn(fn,hn){
      this.dp().addField({fieldName: fn,dataType: ValueType.NUMBER});
      // this.gv().addColumn({name: fn,fieldName: fn,width: 120,header: {text: hn},editable: false,styleName: "tr",numberFormat: '#,##0', footer: {expression: "sum"}});
      this.gv().addColumn({name: fn,fieldName: fn,width: 80,header: {text: hn, styleName: 'multiline-header' },editable: false,styleName: "tr",numberFormat: '#,##0',
        footer: [
          {expression: "sum",numberFormat: '#,##0'},
          {valueCallback: this.footerSumWait,numberFormat: '#,##0'},
          {valueCallback: this.footerSumIng,numberFormat: '#,##0'},
          {valueCallback: this.footerSumHold,numberFormat: '#,##0'},
        ]
      });
    },
    footerSumWait(grid, column, footerIndex, columnFooter, value){
      let sum = 0;
      let i = 0;
      var iCnt = grid.getItemCount();
    
      while(i < iCnt) {
        if(grid.getValue(i, 'type') === '작업대기'){
          sum += Number(grid.getValue(i, column.name));
        }
        i ++;
      }
      return sum;
    },
    footerSumIng(grid, column, footerIndex, columnFooter, value){
      let sum = 0;
      let i = 0;
      var iCnt = grid.getItemCount();
    
      while(i < iCnt) {
        if(grid.getValue(i, 'type') === '작업중'){
          sum += Number(grid.getValue(i, column.name));
        }
        i ++;
      }
      return sum;
    },
    footerSumHold(grid, column, footerIndex, columnFooter, value){
      let sum = 0;
      let i = 0;
      var iCnt = grid.getItemCount();
    
      while(i < iCnt) {
        if(grid.getValue(i, 'type') === 'HOLD'){
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
      this.gv().addLayout({name: grNm, header: { text: ht }, items:fns});
    },

    async searchClick() {
      if(_.isEmpty(this.calcDateTime)){
        this.$toast("info",'시간을 선택하십시오.');
        return;
      }
      let qp = {};
      qp['calcDateTime'] = this.calcDateTime;
      this.$axios.api.search({menuId: "M0003005", queryId: "selectWipDataList", queryParams: qp, target: this.rows});

      this.filterMap = {"model":[],"작업구분":[]};  // 초기화
    },
    calcClick(){      
      let apiUrl = process.env.VUE_APP_API_URL;
      this.eventSource = new EventSource(apiUrl+'/api/subscribe/wip/calc');
      this.calcing =  true;
      this.eventSource.onmessage = (event) => {
        if(event.data === "SEND_COMPLETE"){
          this.eventSource.close();  // SSE 연결 종료
          this.$toast("info","집계가 완료되었습니다.");
          this.calcing = false;
          this.dateChange().then(resp=>{
            this.searchClick();
          });
        }else{
          this.$toast("info",event.data);
        }
      };

    },
    async dateChange(){     
      let qp = {};
      qp['calcDate'] = this.calcDate.replace(/-/g, "");
      this.$axios.api.search({menuId: "M0003005", queryId: "selectWipDateTimeList", queryParams: qp, target: this.calcDateTimeList}).then(resp =>{
        if(!_.isEmpty(this.calcDateTimeList)){
          this.calcDateTime = this.calcDateTimeList[0]['value'];
        }else{
          this.calcDateTime = '';
        }
      });
    },
    excelClick(){
      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const fileName = `재공재고현황 ${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      this.gv().exportGrid({
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: "엑셀 Export중입니다.",
        exportGrids: [
          { grid: this.gv(), sheetName: '재공/재고현황' },
        ],
        done: () => {
          this.$toast('success', '엑셀 내보내기가 완료되었습니다!');
        },
      });
    },
    onFilteringChangedGrid(grid, column, filter){
      if(filter !== null && column !== null){
        // console.log('Filter changed!');
        // console.log("filter:",filter);
        // console.log("column:",column);

        if(['model','작업구분'].indexOf(column.fieldName) > -1 ){
          let fn = filter.name;
          
          if(column.fieldName === "작업구분"){  //작업구분은 한자리 값만
            fn = fn.slice(-1);
          }

          if(this.filterMap[column.fieldName].indexOf(fn) > -1){  //이미 있으면 제거란 뜻~
            let tempArray = this.filterMap[column.fieldName].filter(item => item !== fn);
            this.filterMap[column.fieldName] = tempArray;
          }else{
            this.filterMap[column.fieldName].push(fn);
          }
          
        }
        // console.log("this.filterMap:::",this.filterMap);
      }else if(column !== null){  //초기화 클릭
        this.filterMap[column.fieldName] = [];
      }
    },
    onCellClickedGrid(grid, clickData) {
      // console.log("clickData:::",clickData); 
      if(["data","footer"].indexOf(clickData.cellType) < 0){
        return;
      }    
      
      let process = clickData.column.split("seq")[0];
      let type = grid.getValue(clickData.itemIndex,"type");
      let value = grid.getValue(clickData.itemIndex,clickData.field);
			let matId = clickData.cellType === "footer"?null:grid.getValue(clickData.itemIndex,"matId");
      let jobType =  clickData.cellType === "footer"?null:grid.getValue(clickData.itemIndex,"작업구분");
      let orgJobType =  clickData.cellType === "footer"?null:grid.getValue(clickData.itemIndex,"org작업구분");

      if(clickData.cellType === "footer"){
        if(clickData.index === 0){
          return;
        }else if(clickData.index === 1){
          type = "작업대기";
        }else if(clickData.index === 2){
          type = "작업중"; 
        }else{
          return;
        }

         value = grid.getColumn(clickData.fieldIndex - 2).footer.value;
      }
      
      if(['작업중','작업대기'].indexOf(type) > -1 && value > 0){
        let params = {};
        params["process"] = process;        
        params["type"] = type;
        params["value"] = value;
        params["matId"] = matId;

        let header = "";
        let qi = "";
        
        for(let i = 0; i < this.headerList.length; i++){
          if(this.headerList[i]['공정코드'] === process){
            header = this.headerList[i]['header'].toUpperCase();
            break;
          }
        }
        // console.log("header:::",header);
        if(header === ''){
          return;
        }
        
        if(header.indexOf("FRONT") > -1){
          if(type === '작업중'){
            qi = 'selectWipDtlFrontI';
          }else if(type === '작업대기'){
            qi = 'selectWipDtlFrontW';
          }
        }else if(header.indexOf("BACK") > -1){
          if(type === '작업중'){
            qi = 'selectWipDtlBackI';
          }else if(type === '작업대기'){
            qi = 'selectWipDtlBackW';
          }
        }else if(header === 'LOT CARD 발행'){
          if(type === '작업중'){
            return;
          }else if(type === '작업대기'){
            qi = 'selectWipDtlLotCardW';
          }
        }else if(header === 'RUN CARD 발행'){
          if(type === '작업중'){
            return;
          }else if(type === '작업대기'){
            qi = 'selectWipDtlRunCardW';
          }
        }else if(header === "포장/출하"){
          // console.log("header:::",header);
          // console.log("type:::",type);
          // console.log("공정코드:::",process);
          // console.log("matId:::",matId);
          if("074" === process && type === "작업대기"){
            qi = 'selectPackShip074';
          }else if("077" === process && type === "작업대기"){
            qi = 'selectPackShip077Wait';
          }else if("077" === process && type === "작업중"){
            qi = 'selectPackShip077';
          }else if("080" === process && type === "작업대기"){
            qi = 'selectPackShip080';
          }else if("081" === process && type === "작업대기"){
            qi = 'selectPackShip081';
          }else if("082" === process && type === "작업대기"){
            qi = 'selectPackShip082';
          }else{
            this.$toast('info', '해당 공정은 상세보기 할 수 없습니다.');
            return;  
          }
        }else if(header === 'REWORK' && type === "작업대기"){
          if(process === '002'){  //MBOX
            qi = 'selectPackShip002';
          }else if(process === '003'){  //MRUN
            qi = 'selectPackShip003';
          }else if(process === '022'){  //rework필름박리
            qi = 'selectPackShip022';
          }else{
            this.$toast('info', '해당 공정은 상세보기 할 수 없습니다.');
            return;
          } 
        }else if(header === 'REWORK' && type === "작업중"){
           if(process === '022'){  //rework필름박리             
             qi = 'selectPackShipIng022';
           }else{
            this.$toast('info', '해당 공정은 상세보기 할 수 없습니다.');
            return;
           } 
        }else{
          this.$toast('info', '해당 공정은 상세보기 할 수 없습니다.');
          return;
        }
        let processNm = "["+grid.getColumn(clickData.fieldIndex - 2).header.text + "] 공정";
        
        params["dialogTitle"] = processNm + " ["+type+"]";
        // params['calcDate'] = this.calcDate.replace(/-/g, "");
        params['calcDateTime'] = this.calcDateTime;
        params['jobType'] = jobType;
        params['orgJobType'] = orgJobType === '-'?null:orgJobType;
        params['modelList'] = this.filterMap['model'];
        params['workList'] = this.filterMap['작업구분'];
        params['typeList'] = this.filterMap['type'];
        this.$axios.api.search({menuId: "M0003005", queryId: qi,queryParams: params}).then(resp => {
          params['list'] = resp;
          if(header === "포장/출하"){
            this.$refs.dtlPopup2.openDialog(params);
          }else if(header === "REWORK"){
            this.$refs.dtlPopup3.openDialog(params);
          }else{
            this.$refs.dtlPopup.openDialog(params);
          }
        }).catch(error => {
          console.error("error", error);
        });

        
      }
      
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

