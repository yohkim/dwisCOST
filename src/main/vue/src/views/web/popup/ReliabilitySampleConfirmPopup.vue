<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="title" no-close-on-backdrop :style="{  zIndex: zIndex }" centered>
    <div class="search_box mb-1">
      <div class="row search_area">
        <div class="col-4">
          <div class="form-floating">
            <input
              type="text"
              class="form-control label-80"
              id="floating"
              placeholder="CELL NO"
              name="cellNo"
              data-group="params"
              @input="convertToUpperEnglish"
              @keydown.enter="handleEnter"
              ref="cellNoField"
              autocomplete="off"
              v-model="params.cellNo"
            />
            <label for="floating">CELL NO</label>
          </div>
        </div>
      </div>
    </div>
    <div>
      <RealGrid ref="reliabilitySampleConfirmPopupGrid" :uid="'reliabilitySampleConfirmPopupGrid'" :rows="rows" :style="`height: 250px`"/>
    </div>
        <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
      <b-button class="main" block @click="confirm" v-show="params.btnConfirm">확인</b-button>
    </div>
  </b-modal>  
</template>

<script>

export default {
  name: "ReliabilitySampleConfirmPopup",
  props: {
    title: { type: String, default: '시료확인' },
  },
  data() {
    return {
      reliabilitySampleConfirmPopupGrid: null,
      rows: [],
      isOpen: false,
      items: [],
      params: {
        isEditabled: true,  
        menu: null,      
        cellNo: null,
        "차수": 1,
      },
      zIndex: 0,
    };
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    GV() {
      return this.$refs.reliabilitySampleConfirmPopupGrid.getGridView();
    },
    DP() {
      return this.$refs.reliabilitySampleConfirmPopupGrid.getGridDataProvider();
    },
    openDialog(params) {
      this.$utils.initializeParamsInPlace(this.params);
      this.items = [];
      this.params.cellNo = null;
      Object.assign(this.params, params);
      this.reliabilitySampleConfirmPopupGrid = _.cloneDeep(require(`./js/ReliabilitySampleConfirmPopup.js`));
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.$refs.reliabilitySampleConfirmPopupGrid.created();
        this.searchClick().then(()=>{ 
          this.isOpen = true;
        });
      });
    },
    closeDialog() {
      this.$refs.reliabilitySampleConfirmPopupGrid.destroy();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },

    async searchClick() {
      if(this.params.menu == 'M0003003'){
        await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch16", queryParams: this.params, target: this.rows});
      }else{
        await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_Sch16", queryParams: this.params, target: this.rows});
      }
    },

    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },

    handleEnter(event) {
      event.preventDefault();
      this.GV().checkAll(false);
      var options = {
        fields : ["cellId"],
        value : this.params.cellNo,
        startIndex : 0,
        startFieldIndex : 1,
        wrap : true,
        caseSensitive : true,
        partialMatch : false
      };

      var index = this.GV().searchCell(options);
      if(!_.isNil(index)){
        this.GV().setCurrent(index);
        this.GV().checkItem(index.itemIndex);        
      }

      this.$refs.cellNoField.focus();
      this.$refs.cellNoField.select();
    },


    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    onCellItemClickedReliabilitySampleConfirmPopupGrid(grid, index, clickData) {
      if(clickData.cellType !== "data") return;
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(clickData.fieldName == '취소'){


        let saveFunc = async () => {
          let params = {
            "menuId": 'M0003002',
            "update": [{
              queryId: "M0003002_Update020",
              data: [{
                ...this.params,
                runId: jsonData['runId'],
                cellId: jsonData['cellId'],
              }],
            },
            { queryId:'M0003002_Sample', data:[{
              ...this.params,
              'code': this.params['공정코드']            
            }]}]
          };

          
          const resp = await this.$axios.api.saveData(params);
          if (resp.status === 'success') {
            this.$toast('success', '취소 완료하였습니다.');
            this.$emit("save");
            this.searchClick();
          } else {
            this.$toast('error', resp.message);
          }
        };

        this.$confirm("확인", '취소 하시겠습니까?', (confirm)=>{
          if(confirm){
            saveFunc();
          }
        });
        
      }
      return true;
    },

    onCellClickedReliabilitySampleConfirmPopupGrid(grid, clickData) {
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

<style lang="scss">
</style>