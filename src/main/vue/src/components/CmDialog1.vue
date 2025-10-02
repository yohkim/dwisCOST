<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :size="params.popUpSize" no-close-on-backdrop centered
    :style="{  zIndex: zIndex }" 
  >
    <template #title>
      {{ params.dialogTitle }}
    </template>
    <div>
      <RealGrid ref="cmDialog1Grid" :uid="'cmDialog1Grid'" :rows="rows" :style="`height: ${params.height}px`"/>
    </div>
    <div v-show="params.showButton" class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
      <b-button class="main" block @click="confirm" v-show="params.btnConfirm">확인</b-button>
    </div>
  </b-modal>  
</template>

<script>
export default {
  name: "CmDialog1",
  props: {},
  emits: ["confirm"],
	data () {
		return {
			cmDialog1Grid: null,
			rows: [],
			isOpen: false,
      zIndex: 0,
			params: {
        dialogTitle: "",
				step: 0,
				height: 300,
				width: 500,
				gridJs: "CP0000000001",
        search: {
          menuId: "",
          queryId: "",
          queryParams: null,
        },
        btnConfirm: true,
        popUpSize: 'lg',
        showButton: true,
        confirmOnEnter:true,
        options: {},
			},
      allowMultiSelection: ['008', '009']
		}
	},
  computed: {
    cmDialog1GridGV() {
      return this.$refs.cmDialog1Grid.getGridView();
    },
    cmDialog1GridDP() {
      return this.$refs.cmDialog1Grid.getGridDataProvider();
    },
  },
  methods: {
		async openDialog(params) {
      this.params.options = {};
			Object.assign(this.params, params);

      const gridModule = require(`@components/js/${this.params.gridJs}`);
      this.cmDialog1Grid = _.cloneDeep(gridModule); 
      if(Object.keys(this.params.options).length > 0){
        this.cmDialog1Grid.options = Object.assign(this.cmDialog1Grid.options, this.params.options);
      }
      this.$nextTick(()=>{
        this.$refs.cmDialog1Grid.created();
        this.zIndex = this.$zIndexManager.next();
        this.$axios.api.search(Object.assign(this.params.search, {target: this.rows})).then(()=>{
          this.isOpen = true;
        });
      });
		},
    closeDialog() {
			this.$refs.cmDialog1Grid.destroy();
      this.$zIndexManager.release();
      this.isOpen = false;
    },
    confirm() {
      this.params.gridView=this.$refs.cmDialog1Grid.getGridView();
      this.params.dataProvider=this.$refs.cmDialog1Grid.getGridDataProvider();
      this.$emit("confirm",this.params);
      this.closeDialog();
    },

    onItemCheckedCmDialog1Grid(grid, itemIndex, checked) {
      // 원장투입 008(RL#A),009(RL#B) 설비만 동시 선택 가능
      if ( this.params.gridJs === "CP0000000017.js") {
        if ( checked ) {
          let checkedRows = grid.getCheckedRows();
          if (checkedRows.length > 1) {
            let ds = grid.getDataSource();
            let selectedEquipNo = checkedRows.map((idx) => ds.getJsonRow(idx).설비번호);

            let hasOtherSelection = selectedEquipNo.some(
              (equipNo) => !this.allowMultiSelection.includes(equipNo)
            );

            if (hasOtherSelection && checkedRows.length > 1) {
              let rows = grid.getCheckedRows();
              checkedRows.map((idx) => ( idx !== itemIndex )? grid.checkItem(idx, false) : '');
              return ;
            }			
          }
        }
      }
    },

    onCellClickedCmDialog1Grid(grid, clickData) {

        if (clickData.cellType !== "data") return;

        let itemIndex = clickData.itemIndex;

        if ( grid.getOptions().checkBar.exclusive ) {
            let checkedRow = grid.getCheckedRows();
            if (checkedRow.length > 0) {
                grid.checkItem(checkedRow[0], false);
            }
            grid.checkItem(itemIndex, true);
        }
        else {
          let isChecked = grid.isCheckedRow(itemIndex);
          grid.checkItem(itemIndex, !isChecked);
        }
    },

    onCellDblClickedCmDialog1Grid(grid, clickData) {

        if (clickData.cellType !== "data") return;      

        if ( grid.getOptions().checkBar.exclusive ) {
           this.confirm();
        }
    },

    onKeyDownCmDialog1Grid (grid, event) {
      //if (this.params.confirmOnEnter && event.key === "Enter" && grid.getOptions().checkBar.exclusive ) {
      if (this.params.confirmOnEnter && event.key === "Enter"  ) {
        this.$nextTick(()=>this.confirm())
      }
    }
  },
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>

<style lang="scss" scoped>
:deep .rg-fixed-footer{
 border-top: 2px solid  #E56615; 
} 
:deep .rg-footer{
 border-top: 2px solid #E56615; 
 font-weight: bold;
}
</style>