<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :size="params.popUpSize" no-close-on-backdrop :style="{  zIndex: zIndex }" centered>
    <template #title>
      {{ params.dialogTitle }}
    </template>
    <div>
      <RealGrid ref="workerPopupGrid" :uid="'workerPopupGrid'" :rows="rows" :style="`height: ${params.height}px`"/>
    </div>
    <div v-show="params.showButton" class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>  
</template>

<script>
export default {
  name: "WorkerPopup",
  props: {},
	data () {
		return {
			workerPopupGrid: null,
			rows: [],
			isOpen: false,
			params: {
        dialogTitle: "",
				height: 300,
				gridJs: "",
        search: {
          menuId: "",
          queryId: "",
          queryParams: null,
        },
        popUpSize: 'lg',
			},
		}
	},
  computed: {
    GV() {
      return this.$refs.workerPopupGrid.getGridView();
    },
    DP() {
      return this.$refs.workerPopupGrid.getGridDataProvider();
    },
  },
  methods: {
		async openDialog(params) {
			Object.assign(this.params, params);

      const gridModule = require(`@web/popup/js/${this.params.gridJs}`);
      this.workerPopupGrid = _.cloneDeep(gridModule); 
			this.zIndex = this.$zIndexManager.next();
      this.$nextTick(()=>{
        this.$refs.workerPopupGrid.created();
        this.$axios.api.search(Object.assign(this.params.search, {target: this.rows})).then(()=>{
          this.isOpen = true;
          setTimeout(() => {
            const gridContainer = this.$refs.workerPopupGrid?.$el;
            if (gridContainer) {
              const rgRenderers = gridContainer.querySelectorAll(".rg-renderer");
              if (!_.isEmpty(rgRenderers)) {
                rgRenderers.forEach(el => {
                  el.style.maxHeight = "none";
                  el.style.fontSize = "36px";
                  el.style.lineHeight = "normal";
                });
              }
            }
          }, 100);
        });
      });
		},
    closeDialog() {
			this.$refs.workerPopupGrid.destroy();
      this.$zIndexManager.release();
      this.isOpen = false;
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/

    onCellClickedWorkerPopupGrid(grid, clickData) {
      if(clickData.cellType !== "data") return;

      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      this.$emit("confirm", jsonData["codeName"]);
      return true;
    },  
  },
  
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>