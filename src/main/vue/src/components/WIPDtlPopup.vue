<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
    <RealGrid ref="grid" :uid="'grid'" :rows="params.list" style="height: 500px" />
  </b-modal>
  <ManufacturingWorkStatusPopup ref="manufacturingWorkStatusPopup"/>
</template>

<script>

import ManufacturingWorkStatusPopup from '@components/ManufacturingWorkStatusPopup.vue';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: "WipDtlPopup",
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  components: {
    ManufacturingWorkStatusPopup
  },
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "작업중/작업대기",
        type:null
      },      
      zIndex: 0,      
      grid:null,
      gridRows:[],
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    prodCtg() {
      return this.userAuthInfo.selectedProdCtg;
    },
  },
  created() {    
  },
  mounted() {
    
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
      this.initializeGrid();		
    },
    closeDialog() {  
      // this.gv().cancel();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    gv(){
			return this.$refs[['grid']].getGridView();	
		},
		dp(){
			return this.$refs['grid'].getGridDataProvider();
		},
    initializeGrid(){
      this.$refs.grid.destroy();
      if(this.params['type'] === '작업대기'){
        this.grid = _.cloneDeep(require(`./js/WIPDtlHoldPopup.js`));
      }else{  //작업중
        this.grid = _.cloneDeep(require(`./js/WIPDtlPopup.js`));
      }
      this.$refs.grid.created();

      this.gv().filteringOptions.selector.searchIgnoreCase = true;
    },
    onCellClickedGrid(grid, clickData) {
      this.clickedProcessWorkStatusGrid(grid, clickData);
    },
    clickedProcessWorkStatusGrid(grid, clickData){
      if(clickData.cellType !== "data") return;

      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      let params = {};
      params['lotRunNo'] = jsonData['objNo'];      
      if(clickData.fieldName == '상세정보'){
        this.$refs.manufacturingWorkStatusPopup.openDialog(params);
      }else if(clickData.fieldName == '실적입력'){
        try {
          let area = jsonData["area"].toUpperCase();
          let idx = 0;
          let fnPrefix = jsonData["area"].replace('#', '').replace(/\s+/g, '');
          if(this.params['process'] === '021' && this.params['type'] === '작업대기'){
            area = "LOT RUN CARD 발행";
            idx = 1;
            fnPrefix = "lotRunCard";
          }
          const menu1 = this.$utils.findMenu(this.menuList, this.prodCtg, '제조 실적 입력');
          const menu2 = this.$utils.findMenu(this.menuList, this.prodCtg, area);
          
          this.$eventBus.emit('menuMoveClick', { menu: this.$utils.createMenuData(menu1, menu2, menu2.childSysResc[idx]), 
          callback: () => {                        
            setTimeout(() => {
              this.$eventBus.emit( fnPrefix + 'MenuMove', jsonData);
            }, 500);
            setTimeout(() => {
              this.$eventBus.emit( fnPrefix + 'Search');
            }, 600);            
            this.closeDialog();
          }});            
        } catch (error) {
          console.error('제조 작업 현황 메뉴 이동중', error)
          return false; 
        }        
      }
      return false;
    },
  },
};
</script>
