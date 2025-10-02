<template>  
  <div>
    <b-row>
      <b-col v-if="process === '023'">      
        <RealGrid ref="lotGrid" :uid="'lotGrid'" :rows="lotRows" :fitLayoutWidthEnable="false"/>
      </b-col>
      <b-col v-if="['027','033','035','037','040','043','047','050'].indexOf(process) > -1">      
        <RealGrid ref="ppGrid" :uid="'ppGrid'" :rows="ppRows" :fitLayoutWidthEnable="false"/>
      </b-col>
      <b-col v-if="process === '022'">      
        <RealGrid ref="mboxGrid" :uid="'mboxGrid'" :rows="mboxRows" :fitLayoutWidthEnable="false"/>
      </b-col>
    </b-row>
    <ErrorInput ref="errorInput" @save="badSaveCallback"/>
  </div>
</template>
<script>
import ErrorInput from "@web/popup/ErrorInput";
export default {
  name: "back1-lot-and-pre-cst-info",
  
  props: {
    runNo: { type: String, default: null },
    process: { type: String, default: null },
    lotOnly:{ type: Boolean, default: false },
    maxCnt: { type: Number, default: 30 },
    isEditabled: { type: Boolean, default: true },
    callSaveData: Function
  },
  components: {
    ErrorInput,
  },
  data() {
    return {      
      lotRows:[],
      ppRows:[],
      mboxRows:[],
      lotGrid:null,
      ppGrid:null,
    };
  },
  computed:{
  },
  created() {
		this.initializeGrid();		
	},	
  mounted(){ 
    
  },  
  watch: {
  },
  methods: {
    initializeGrid(){
      this.ppGrid = _.cloneDeep(require(`@components/js/Back1Cst.js`));
      this.lotGrid = _.cloneDeep(require(`@components/js/Back1LotCst.js`));
      this.mboxGrid = _.cloneDeep(require(`@web/m0003000/js/TAB048000_2.js`));
    },
    rgGV(nm){
			return this.$refs[nm].getGridView();
		},
    rgDP(nm){
      if(this.$refs[nm] === undefined || this.$refs[nm] === null){
        return null;
      }
			return this.$refs[nm].getGridDataProvider();
		},
    
    async loadData(){
      let qp = {};
      let param = {};
      qp['runNo'] = this.runNo;
      qp['process'] = this.process;
      if(['027','033','035','037','040','043','047','050'].indexOf(this.process) > -1){
        param = {menuId:'M0003001',queryId:'selectInCstCell',queryParams:qp, target: this.ppRows};
        // await this.$axios.api.search([param]);	
      }else if(this.process === '023'){
        param = {menuId:'M0003001',queryId:'selectLotCell',queryParams:qp, target: this.lotRows};
        // await this.$axios.api.search(param);	
      }else if(this.process === '022'){
        param = {menuId:'M0003001',queryId:'selectInCstCellInMbox',queryParams:qp, target: this.mboxRows};
      }

      await this.$axios.api.search(param);	
    },
    
    clearData(){
      if(this.rgDP('ppGrid') !== null){
        this.rgDP('ppGrid').setRows([]);
      }

      if(this.rgDP('lotGrid') !== null){
        this.rgDP('lotGrid').setRows([]);
      }

      if(this.rgDP('mboxGrid') !== null){
        this.rgDP('mboxGrid').setRows([]);
      }
      
    },

    saveCallback1(){
      this.$emit("save");
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackLotGrid(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      if(fieldName == 'cstCell'){
        if(this.isEditabled){
          rtn.editable = true;
          rtn.styleName = "tr edit";
        }else{
          rtn.editable = false;
          rtn.styleName = "tr";
        }        
      }
      return rtn
    },
    setCellStyleCallbackPpGrid(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      if(fieldName == 'cstCell'){
        if(this.isEditabled){
          rtn.editable = true;
          rtn.styleName = "tr edit";
        }else{
          rtn.editable = false;
          rtn.styleName = "tr";
        }        
      }
      return rtn
    },
    setCellStyleCallbackMboxGrid(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      if(fieldName == 'cstCell'){
        if(this.isEditabled){
          rtn.editable = true;
          rtn.styleName = "tr edit";
        }else{
          rtn.editable = false;
          rtn.styleName = "tr";
        }        
      }
      return rtn
    },

    onCellEditedLotGrid(grid, itemIndex, row, field) {      
      grid.commit();
      let ds = grid.getDataSource();
      let fieldName = ds.getOrgFieldName(field);
      let jsonData = ds.getJsonRow(itemIndex);
      
      if(fieldName == 'cstCell'){        
        if(jsonData["cstCell"] > this.maxCnt){
          this.$toast("info", "최대 적재수량"+this.maxCnt+"개보다 크게 입력할수 없습니다.");
          grid.setValue(itemIndex, "cstCell", this.maxCnt);
        }
        this.$emit("updateCstCell", ds.getJsonRow(itemIndex));
      }
    },

    onCellEditedPpGrid(grid, itemIndex, row, field) {      
      grid.commit();
      let ds = grid.getDataSource();
      let fieldName = ds.getOrgFieldName(field);
      let jsonData = ds.getJsonRow(itemIndex);
      
      if(fieldName == 'cstCell'){        
        if(jsonData["cstCell"] > this.maxCnt){
          this.$toast("info", "최대 적재수량"+this.maxCnt+"개보다 크게 입력할수 없습니다.");
          grid.setValue(itemIndex, "cstCell", this.maxCnt);
        }
        this.$emit("updateCstCell", ds.getJsonRow(itemIndex));
      }
    },

    onCellEditedMboxGrid(grid, itemIndex, row, field) {      
      grid.commit();
      let ds = grid.getDataSource();
      let fieldName = ds.getOrgFieldName(field);
      let jsonData = ds.getJsonRow(itemIndex);
      
      if(fieldName == 'cstCell'){        
        grid.setValue(itemIndex, "cstCell", jsonData["cstCell"]);
        this.$emit("updateCstCell", ds.getJsonRow(itemIndex));
      }
    },

    onCellItemClickedLotGrid(grid, index, clickData) {
      if(clickData.cellType !== "data") return;
      
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      
      if(clickData.fieldName === '불량입력'){
        let saveData = this.callSaveData();
        if(saveData.update.length > 0){
          this.$toast("info", "변경된 내용이있습니다. 임시저장후 진행하세요.");        
          return;
        }

        this.badClick(jsonData);
      }
      return true;
    },
    onCellItemClickedPpGrid(grid, index, clickData) {
      if(clickData.cellType !== "data") return;
      
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      
      if(clickData.fieldName === '불량입력'){
        let saveData = this.callSaveData();
        if(saveData.update.length > 0){
          this.$toast("info", "변경된 내용이있습니다. 임시저장후 진행하세요.");        
          return;
        }
        this.badClick(jsonData);
      }
      return true;
    },
    
    onCellItemClickedMboxGrid(grid, index, clickData) {
      if(clickData.cellType !== "data") return;
      
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      
      if(clickData.fieldName === '불량입력'){
        let saveData = this.callSaveData();
        if(saveData.update.length > 0){
          this.$toast("info", "변경된 내용이있습니다. 임시저장후 진행하세요.");        
          return;
        }
        this.badClick(jsonData);
      }
      return true;
    },


    badClick(values){
      let p = {};
      p['type'] = ["022","023"].indexOf(this.process) > -1 ? 'etcno':'cstno';
      
      if(this.process === "023"){
        p['etcNo'] = values['lotNo'];
        p['lotNo'] = values['lotNo'];
        p['fCstNo'] = values['cstNo'];
        p['tCstNo'] = values['tCstno'];
        p['pkey'] = values['pkey'];
      }else if(this.process === "022"){ //rework
        p['etcNo'] = values['lotNo'];
        p['fCstNo'] = values['cstNo'];
        p['tCstNo'] = values['tCstno'];
        p['pkey'] = values['pkey'];
      }else{
        p['etcNo'] = '';
        p['fCstNo'] = values['cstNo'];
        p['tCstNo'] = values['tCstno'];
        p['pkey'] = values['pkey'];
      }
      p['runId'] = this.runNo;
      p['자동여부'] = this.process === "023"?"1":"0";
      p['공정코드'] = this.process;
      p['line'] = "D1UT";
      p['dialogTitle'] = this.runNo + " / " + values['cstNo'];
      p['isEditabled'] = this.isEditabled;
      p['errorCnt'] = values['cstCell']; 
      p['callback'] = { queryId:'M0003001Error', data:[{
        ...values,
        '차수': values["차수"],
        'code': values['공정코드'],
        line: 'D1UT',
        "자동여부": p['자동여부'],
        fCstNo: values["cstNo"],
        tCstNo: values["tCstno"],
        'etcNo':p['etcNo']
      }]};
      
      this.$refs.errorInput.openDialog(p);
    },
    badSaveCallback(params,badSum){
      let gridNm =  this.getGridNm();
			let list = this.rgDP(gridNm).getJsonRows();
			list.forEach(el => {
				if(el['pkey'] === params['pkey']){
          el['f불량수량'] = badSum;					
          el['불량수량'] = badSum;					
				}
			});
			this.rgDP(gridNm).setRows(list);
			this.$emit("save",params,badSum);
		},
    getBadSum(){
      let gridNm =  this.getGridNm();
      let list = this.rgDP(gridNm).getJsonRows();  
      let badSum = 0;
      list.forEach(el => {
        badSum += new Number(el['f불량수량'])||0;					          
			});
      return badSum;
    },

    getGridNm(){
      let gridNm = ""; 
      if(this.process === "023"){
        gridNm = "lotGrid";
      }else if(this.process === "022"){
        gridNm = "mboxGrid";
      }else{
        gridNm = "ppGrid";
      }
      return gridNm;
    },
    getNotEqualBadSum(){
      let gridNm =  this.getGridNm();
			let list = this.rgDP(gridNm).getJsonRows();
      let notEqualBadSumList = [];
      list.forEach(el => {
        let a = el['f불량수량']||0;
        let b = el['불량수량']||0;
        if(a !== b){
          console.log(a ,b);
          notEqualBadSumList.push(el['cstNo']);
        }
			});

      return notEqualBadSumList;
    }
  },
};
</script>