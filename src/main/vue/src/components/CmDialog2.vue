<template>
    <b-modal class="dw_mes" v-model="isOpen" hide-footer :size="params.popUpSize" no-close-on-backdrop centered
    :style="{  zIndex: zIndex }" 
    @shown="onModalShown"
  >
    <template #title>
      {{ params.dialogTitle }}
    </template>
      <div class="search_box">
        <b-row class="search_area">
            <b-col cols="8">
              <div class="form-floating">
                <input type="text" class="form-control label-60" id="searchKeyword" ref="searchKeyword" placeholder="검색어" v-model="searchKeyword" autocomplete="off" >
                <label for="searchKeyword">{{searchTitle}}</label>
              </div>              
            </b-col>	
          <!-- <div class="btn_area">
              <b-button @click="searchClick"><span class="ico_search"></span>조회</b-button>              
          </div> -->
        </b-row>
      </div>
      <div>
        <RealGrid ref="cmDialog2Grid" :uid="'cmDialog2Grid'" :rows="searchRows" :style="`height: ${params.height}px`"/>
      </div>
      <div class="bttn_wrap">
        <b-button  block @click="closeDialog">닫기</b-button>
        <b-button class="main" block @click="confirm" v-show="params.btnConfirm">확인</b-button> 
      </div>   
  </b-modal>  
</template>

<script>
export default {
  name: "CmDialog2",
  props: {},
  emits: ["confirm"],
  watch:{
    searchKeyword: {
      handler(newVal) {
        this.filterData(newVal);
      },
      immediate: true
    }
  },
	data () {
		return {
			cmDialog2Grid: null,
			rows: [],
      searchRows:[],
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
        searchTitle: "검색어",
        btnConfirm: true,
        popUpSize: 'lg',
        showButton: true,
        confirmOnEnter:true          
			},
      searchKeyword:'',    
		}
	},
  computed: {},
  methods: {
		async openDialog(params) {

			Object.assign(this.params, params);
			this.cmDialog2Grid = _.cloneDeep(require(`@components/js/${this.params.gridJs}`));
      this.$refs.cmDialog2Grid.created();
      this.searchKeyword = '';
      const resp = await this.$axios.api.search(Object.assign(this.params.search, {target: this.rows}));
      this.searchRows = _.cloneDeep(this.rows);

      if ( this.params.gridJs === "CP0000000023.js") {
          this.searchTitle = "모델"
      }
      else if ( this.params.gridJs === "CP0000000028.js") {
          this.searchTitle = "설비약명"
      }

      this.isOpen = true;      
		},
    closeDialog() {
			this.$refs.cmDialog2Grid.destroy();
      this.isOpen = false;
    },
    confirm() {
      this.params.gridView=this.$refs.cmDialog2Grid.getGridView();
      this.params.dataProvider=this.$refs.cmDialog2Grid.getGridDataProvider();
      this.$emit("confirm",this.params);
      this.closeDialog();
    },

    onModalShown() {
      this.$refs.searchKeyword?.focus();
    },

    filterData(searchData) {

      if ( this.params.gridJs === "CP0000000023.js") {
          this.searchRows = this.rows.filter(row => row.model.toLowerCase().includes(searchData.toLowerCase()))
      }
      else  if ( this.params.gridJs === "CP0000000028.js") {
          this.searchRows = this.rows.filter(row => row.설비약명.toLowerCase().includes(searchData.toLowerCase()))
      }

    },

    // async searchClick() {

    //   let params = {
    //     ...this.params.search,
    //     queryParams: {
    //         ...this.params.search.queryParams,
    //         searchKeyword: this.searchKeyword
    //     }
    //   };
    //   await this.$axios.api.search(params);
    // },  

    onCellClickedCmDialog2Grid(grid, clickData) {

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

    onCellDblClickedCmDialog2Grid(grid, clickData) {

        if (clickData.cellType !== "data") return;

        if ( grid.getOptions().checkBar.exclusive ) {
           this.confirm();
        }
    },    
    
    onKeyDownCmDialog2Grid (grid, event) {
      
      if (this.params.confirmOnEnter && event.key === "Enter"  ) {
        this.$nextTick(()=>this.confirm())
      }
    },
    onDataLoadComplatedCmDialog2Grid(grid){
		}    
    
  },

};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>