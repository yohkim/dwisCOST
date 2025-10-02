<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }"
   @close="closeDialog"
   content-class="custom-modal-content-wipdtlpopup2"
   dialog-class="custom-modal-dialog-wipdtlpopup2"
   centered>
    <RealGrid ref="grid" :uid="'grid'" :rows="params.list" style="height: 100%" />
  </b-modal>  
</template>

<script>

import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: "WipDtlPopup2",
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  components: {
  },
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "",
        type:null
      },      
      zIndex: 0,      
      grid:null,
      gridRows:[],
    };
  },
  computed: {
    
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
			return this.$refs['grid'].getGridView();	
		},
		dp(){
			return this.$refs['grid'].getGridDataProvider();
		},
    initializeGrid(){
      this.$refs.grid.destroy();
      this.grid = _.cloneDeep(require(`./js/WIPDtlPopup2.js`));
      this.$refs.grid.created();
      this.gv().filteringOptions.selector.searchIgnoreCase = true;
    },
  },
};
</script>
<style lang="scss">
.custom-modal-dialog-wipdtlpopup2 {
  max-width: 1400px !important;
  width: 100%;
  max-height: 80vh;
  height: 630px;
}
.custom-modal-content-wipdtlpopup2 {
  width: 100%;
  height: 630px;
  max-height: 80vh;
}
</style>