<template>
  <b-modal v-model="isOpen" hide-footer size="lg" :title="params.dialogTitle"  no-close-on-backdrop
    :style="{
      zIndex: zIndex
    }"
    centered
  >
    <RealGrid
      ref="toolPopupGrid"
      :uid="'toolPopupGrid'"
      :rows="rows1"
      style="height: 250px"
    />    
    <div class="bttn_wrap">
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "ToolPopup",
  props: {},
  emits: ["confirm"],
  data() {
    return {
      toolPopupGrid: null,
      rows1: [],
      isOpen: false,
      params: {
        dialogTitle: "Tool No",
        isEditabled: false,
      },
      zIndex: 0
    };
  },
  computed: {},
  created() {
    this.toolPopupGrid = _.cloneDeep(require(`./js/ToolPopup.js`));
  },
  methods: {
    getGridGV() {
      return this.$refs.toolPopupGrid.getGridView();
    },
    getGridDP() {
      return this.$refs.toolPopupGrid.getGridDataProvider();
    },
    openDialog(params) {
      Object.assign(this.params, params);
      
      this.$nextTick(async() => {     
        this.zIndex = this.$zIndexManager.next();
        this.toolPopupGrid.columns.forEach(element => {
          if(element.name == '폐기'){
            element.visible = this.params.isEditabled;
          }
        });
        this.$refs.toolPopupGrid.created();
			  this.searchClick().then(()=>{
          this.isOpen = true;
        });
      });
    },
    async searchClick(){
      await this.$axios.api.search({ menuId: "M0003005", queryId: "M0003005_Sch12", queryParams: this.params, target: this.rows1 });
    },
    closeDialog() {
      this.$refs.toolPopupGrid.destroy();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    
    onCellItemClickedToolPopupGrid(grid, index, clickData) {
      if(clickData.cellType !== "data") return;
      console.log("index",index);
      console.log("clickData",clickData);
      let ds = grid.getDataSource();
      let jsonData = ds.getJsonRow(index.dataRow);

      if(clickData.fieldName == '폐기'){
        this.$confirm("확인", "폐기를 진행하시겠습니까?", async(confirm)=>{
          if(confirm){
            let params = {
              "menuId": 'M0003005',
              "update": [{ queryId: 'M0003005_Update1', data: [{...jsonData}]}]
            };            
            const resp = await this.$axios.api.saveData(params);
            this.searchClick();
          }
        });
        
      }
      return true;
    },
  },
};
</script>
