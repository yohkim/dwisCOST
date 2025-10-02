<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
    <div>
      <RealGrid ref="changeCstNo1Grid" :uid="'changeCstNo1Grid'" :rows="list" style="height: 570px" />
    </div>
    <div class="bttn_wrap">      
      <b-button class="main" block @click="confirmClick">확인</b-button>
      <b-button  block @click="closeDialog">닫기</b-button>
      <ChangeCstInputPopup ref="ccInputPopup" @confirm="confirmChgCst"/>
    </div>
  </b-modal>
</template>

<script>

import ChangeCstInputPopup from "@web/popup/ChangeCstInputPopup";
import { RowState } from 'realgrid';

export default {
  name: "ChangeCstNo1",
  setup() {
	},
  components: {
    ChangeCstInputPopup
  },
  emits: ["save"],
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "카세트 변경",
        peelingDiv:'1',
        isEditabled: false,
      },
      list:[],
      zIndex: 0,      
      changeCstNo1Grid:null,
    };
  },
  computed: {},
  created() {    
    this.initializeGrid();		
  },
  mounted() {
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.zIndex = this.$zIndexManager.next();
      this.isOpen = true;
      this.setList();
    },
    closeDialog() {  
      this.gv().cancel();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    gv(){
			return this.$refs['changeCstNo1Grid'].getGridView();	
		},
		dp(){
			return this.$refs['changeCstNo1Grid'].getGridDataProvider();
		},
    async setList(){      
      let result = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_Sch4", queryParams: this.params});

      this.list = result.map((item)=>{
        return {
          ...item
          ,fCstno1: item.fCstno
          ,tCstno1: item.tCstno
        }
      })
    },
    initializeGrid(){
      this.changeCstNo1Grid = _.cloneDeep(require(`@web/popup/js/ChangeCstNo1.js`));
    },
    confirmClick(){
      this.gv().commit();
      
      const rows = this.dp().getJsonRows(0, -1).filter((item, index) => this.dp().getRowState(index) == RowState.UPDATED).map(item => ({
        ...item
      }));

      if(rows.length == 0){
        this.$toast("info", "변경된 카세트가 없습니다.");
        return;
      }

      this.$confirmYesOrNo("선택", "카세트 변경 하시겠습니까?", (confirmed) => {
        if(confirmed){
          this.confirm();
        }
      });
    },
    async confirm(){
      const rows = this.dp().getJsonRows(0, -1).filter((item, index) => this.dp().getRowState(index) == RowState.UPDATED).map(item => ({
        ...item
      }));

      const rows1 = this.dp().getJsonRows(0, -1).filter((item, index) => 
        this.dp().getRowState(index) == RowState.UPDATED && item.tCstno != item.inCstno
      ).map(item => ({
        ...item
      }));

      let params = {
        "menuId": 'M0003002',
        "update": [{ queryId: "M0003002_Update13", data: rows }],
      };

      if(rows1.length > 0){
        params["update"].push({ queryId: "M0003002_Update14", data: rows1 });
      }

      const resp = await this.$axios.api.saveData(params);      
      this.$emit('save',this.params);
      this.closeDialog();
    },

    confirmChgCst(obj){
      let current = this.gv().getCurrent();
      this.dp().setValue(current.dataRow, current.fieldName, obj.cstNo);
    },

    onCellClickedChangeCstNo1Grid(grid, clickData) {
      if(clickData.cellType != "data")return;
      if(!["inCstno"].includes(clickData.fieldName))return;
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      let cstNoList = this.dp().getJsonRows(0, -1).map((item)=>{
        return item[clickData.fieldName]
      });
      this.$refs.ccInputPopup.openDialog({
        cstNoList,
        runNo: jsonData['runNo'],
        cstNo: jsonData[clickData.fieldName],
        isEditabled: this.params.isEditabled
      });
    }, 

    setCellStyleCallbackChangeCstNo1Grid(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      let ds = grid.getDataSource();
      let jsonData = ds.getJsonRow(cell.index.dataRow);
      if(["inCstno"].includes(fieldName)){
        if(fieldName == 'inCstno' && jsonData['inCstno'] != jsonData['tCstno']){
          rtn.styleName = "error";
        }else{
          rtn.styleName = "edit";
        }        
      }
      return rtn
    },
  },
};
</script>
