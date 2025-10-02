<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" content-class="custom-modal-content-wipdtlpopup3" dialog-class="custom-modal-dialog-wipdtlpopup3" centered>
    <div class="left_box">
      <div class="btn_wrap ms-auto">
        <b-button class="second" @click="excelClick()">엑셀</b-button>
      </div>
    </div>
    <div>
      <RealGrid ref="grid" :uid="'grid'" :rows="params.list" style="height: 500px" />
    </div>
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
      if(this.params['process'] === '002'){
        this.grid = _.cloneDeep(require(`./js/WIPDtlPopup3-1.js`));
      }else if(this.params['process'] === '022' && this.params['type'] === '작업중'){
        this.grid = _.cloneDeep(require(`./js/WIPDtlPopup3-3.js`));
      }else{
        this.grid = _.cloneDeep(require(`./js/WIPDtlPopup3-2.js`));
      }
      this.$refs.grid.created();
      this.gv().filteringOptions.selector.searchIgnoreCase = true;
    },
    excelClick(){
      let gubun = 'REWORK ';
      if(this.params['process'] === '002'){
        gubun += 'MBOX';
      }else if(this.params['process'] === '003'){
        gubun += 'MRUN';
      }else if(this.params['process'] === '022'){
        gubun += '필름박리';
      }

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const fileName = `${gubun} ${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      this.gv().exportGrid({
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: "엑셀 Export중입니다.",
        exportGrids: [
          { grid: this.gv(), sheetName: (gubun) },
        ],
        done: () => {
          this.$toast('success', '엑셀 내보내기가 완료되었습니다!');
        },
      });
    },
  },
};
</script>
<style lang="scss">
.custom-modal-dialog-wipdtlpopup3 {
  max-width: 1400px !important;
  width: 100%;
  max-height: 80vh;
  height: 630px;
}
.custom-modal-content-wipdtlpopup3 {
  width: 100%;
  height: 630px;
  max-height: 80vh;
}
</style>