<template>  
  <div>
    <b-row>
      <!-- <b-col>      
        <RealGrid ref="lotGrid" :uid="'lotGrid'" :rows="lotRows" style="height: 300px;" />
      </b-col> -->
      <b-col v-if="lotOnly == false">      
        <RealGrid ref="ppGrid" :uid="'ppGrid'" :rows="ppRows" :fitLayoutWidthEnable="false"/>
      </b-col>
    </b-row>
    <ProcessingMapping1 ref="processingMapping1" @save="saveCallback1"/>
    <ErrorInput ref="errorInput" @save="saveCallback1"/>
  </div>
</template>
<script>
import ProcessingMapping1 from "@web/popup/ProcessingMapping1";
import ErrorInput from "@web/popup/ErrorInput";
export default {
  name: "lot-and-pre-cst-info",
  
  props: {
    runNo: { type: String, default: null },
    process: { type: String, default: null },
    lotOnly:{ type: Boolean, default: false },
    maxCnt: { type: Number, default: 30 },
    isEditabled: { type: Boolean, default: false },
    callSaveData: Function
  },
  components: {
    ProcessingMapping1,
    ErrorInput,
  },
  data() {
    return {      
      // lotRows:[],
      ppRows:[],
      // lotGrid:null,
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
    isEditabled(newVal) {
      this.$nextTick(() => {
        if (this.rgGV('ppGrid')) {
          this.rgGV('ppGrid').refresh(true);
        }
      });
    }
  //   process(newVal, oldVal) {
  //     this.loadData();
  //   },
  },
  methods: {
    initializeGrid(){
      // this.lotGrid = _.cloneDeep(require(`@components/js/lot.js`));
      if(!this.lotOnly){
        this.ppGrid = _.cloneDeep(require(`@components/js/preProcess.js`));
      }
    },
    rgGV(nm){
			return this.$refs[nm].getGridView();
		},
    rgDP(nm){
			return this.$refs[nm].getGridDataProvider();
		},
    async loadData(){
      let qp = {};
      qp['runNo'] = this.runNo;
      qp['process'] = this.process;
      if(['055','056'].includes(this.process)){
        this.rgGV('ppGrid').setColumnLayout(this.ppGrid.layout);
      }else if(['061','067'].includes(this.process)){
        this.rgGV('ppGrid').setColumnLayout(this.ppGrid.layout2);
      }else{
        this.rgGV('ppGrid').setColumnLayout(this.ppGrid.layout1);
      }
      if(!this.lotOnly){
        // let param1 = {menuId:'M0003001',queryId:'selectLotCell',queryParams:qp, target: this.lotRows};
        let param2 = {menuId:'M0003001',queryId:'selectInCstCell',queryParams:qp, target: this.ppRows};
        await this.$axios.api.searchAll([param2]);	
      }else{
        // let param = {menuId:'M0003001',queryId:'selectLotCell',queryParams:qp, target: this.lotRows};
        // await this.$axios.api.search(param);	
      }
    },
    async loadVersionData(version = 1){
      let qp = {};
      qp['runNo'] = this.runNo;
      qp['process'] = this.process;
      qp['차수'] = version;
      
      if(['055','056','061','067'].includes(this.process)){
        this.rgGV('ppGrid').setColumnLayout(this.ppGrid.layout);
      }else{
        this.rgGV('ppGrid').setColumnLayout(this.ppGrid.layout1);
      }
      if(!this.lotOnly){
        // let param1 = {menuId:'M0003001',queryId:'selectLotCell',queryParams:qp, target: this.lotRows};
        let param2 = {menuId:'M0003001',queryId:'selectVerInCstCell',queryParams:qp, target: this.ppRows};
        await this.$axios.api.searchAll([param2]);	
      }else{
        // let param = {menuId:'M0003001',queryId:'selectLotCell',queryParams:qp, target: this.lotRows};
        // await this.$axios.api.search(param);	
      }
    },
    clearData(){
      // this.rgDP('lotGrid').setRows([]);
			if(this.lotOnly == false){
        this.rgDP('ppGrid').setRows([]);
      }
    },

    saveCallback1(){
      this.$emit("save");
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackPpGrid(grid, cell){
      let rtn = {};
      let ds = grid.getDataSource();
      const fieldName = cell.index.fieldName;
      let jsonData = ds.getJsonRow(cell.index.itemIndex);
      if(fieldName == 'cstCell'){
        if(["055","056","061","067"].includes(jsonData["공정코드"]) && this.isEditabled){
          rtn.editable = true;
          rtn.styleName = "tr edit";
        }else{
          rtn.editable = false;
          rtn.styleName = "tr";
        }        
      }
      return rtn
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

    onCellItemClickedPpGrid(grid, index, clickData) {
      if(clickData.cellType !== "data") return;
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(clickData.fieldName == '불량입력'){
        let saveData = this.callSaveData();
        if(saveData.update.length > 0){
          this.$toast("info", "변경된 내용이있습니다. 임시저장후 진행하세요.");        
          return;
        }
        if(["055","056","061","067"].includes(jsonData["공정코드"])){          
          this.$refs.errorInput.openDialog(
            {
              ...jsonData,
              type: 'cstno1',
              line: 'D1UT',
              "자동여부": 0,
              errorCnt: jsonData["cstCell"],
              dialogTitle: ""+ jsonData["cstNo"]+" / 불량입력",
              cstNo: jsonData["cstNo"],
              fCstNo: jsonData["cstNo"],
              runId: jsonData["runNo"],
              '차수': jsonData["차수"],
              '투입수량': jsonData["cstCell"],
              isEditabled: this.isEditabled,
              keyPadFlag: true,
              isMapping: (["055"].includes(jsonData["공정코드"]) ? true : false),
              callback: { queryId:'M0003002Error', data:[{
                ...jsonData,
                '차수': jsonData["차수"],
                'code': jsonData['공정코드'],
                line: 'D1UT',
                "자동여부": 0,
                fCstNo: jsonData["cstNo"],
              }]}
            }
          );
        }
      }
      return true;
    },

    onCellClickedPpGrid(grid, clickData) {
      if (clickData.cellType === "head" && clickData.subType === "indicator") {
        let itemCount = grid.getItemCount();
        let col = grid.getDisplayColumns();
        let sel = {
          style: "block",
          startItem: 0,
          startColumn: col[0].name,
          endItem: itemCount,
          endColumn: col[col.length - 1].name,
        };
        grid.setSelection(sel);
      }
    },
  },
};
</script>