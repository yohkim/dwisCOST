<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="'결과 입력'" no-close-on-backdrop :style="{  zIndex: zIndex }" centered>
    <div class="search_box mb-1">
      <div class="row search_area">
        <div class="col-3">
          <div class="form-floating">
            <select class="form-select label-60"  id="floatingSelect"  aria-label="Floating label select example"  v-model="params['result']" >
              <option  v-for="(item, index) in typeList"  :key="index"  :value="item" >
                {{ item }}
              </option>
            </select>
            <label for="floatingSelect" class="select">결과</label>
          </div>
        </div>
        <div class="col-3" v-if="params['result'] == '불량'">
          <div class="form-floating">
            <select class="form-select label-60"  id="floatingSelect"  aria-label="Floating label select example"  v-model="params['불량유형']" >
              <option  v-for="(item, index) in items"  :key="index"  :value="item.value" >
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">불량유형</label>
          </div>
        </div>                
      </div>
    </div>
    <div>
      <RealGrid ref="resultInputPopupGrid" :uid="'resultInputPopupGrid'" :rows="rows" :style="`height: 250px`"/>
    </div>
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
      <b-button class="main" block @click="actionClick" v-show="params.isEditabled">저장</b-button>
    </div>
  </b-modal>  
</template>

<script>

const { RowState } = require('realgrid');

export default {
  name: "ResultInputPopup",
  props: {},
  data() {
    return {
      resultInputPopupGrid: null,
      rows: [],
      isOpen: false,      
      items: [],
      params: {
        isEditabled: false,
        "작업자1": null,
        "result": null,
        "불량유형": null,
        callback: null,
        "차수": 1,
      },
      zIndex: 0,
      enterFlag: true,
      actionType: null,
    };
  },
  computed: {
    typeList(){
      let process = this.params["공정코드"];
      if(process == '068'){
        return ["BIN1","BIN2","불량"];
      }else if(process == '073'){
        return ["양품","불량","추가","제거"];
      }else{
        return ["양품","불량"];
      }
    }
  },
  created() {},
  watch: {
    "params.result"(newVal) {
      this.params["불량유형"] = null;
      if(!this.isOpen) return;
      this.rows=[{}]; 
      setTimeout(() => {
        this.GV().setCurrent({ dataRow: 0, fieldName: "cellId" });              
        this.GV().showEditor();
      }, 100);
		},
  },
  methods: {
    GV() {
      return this.$refs.resultInputPopupGrid?.getGridView();
    },
    DP() {
      return this.$refs.resultInputPopupGrid?.getGridDataProvider();
    },
    openDialog(params) {
      this.$utils.initializeParamsInPlace(this.params);
      this.items = [];
      this.params.callback = null;
      this.params['차수'] = 1;
      Object.assign(this.params, params);
      this.searchCode();
      this.resultInputPopupGrid = _.cloneDeep(require(`./js/ReliabilitySamplePopup.js`));
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.$refs.resultInputPopupGrid.created();
        this.rows=[{}]; 
        this.isOpen = true;

        setTimeout(() => {
          this.GV().setCurrent({ dataRow: 0, fieldName: "cellId" });              
          this.GV().showEditor();
        }, 100);
      });
    },
    closeDialog() {
      this.$refs.resultInputPopupGrid.destroy();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },

    async searchCode(){

			let searchParam = {
				menuId: "M0003003", queryId: "M0003003_Sch20", queryParams: this.params, 
				callback: (data) => {
					this.$utils.transformData(
					data,
					["value", "text"],
					["불량코드", "불량명"],
					this.items
					);
				},
			};
			await this.$axios.api.search(searchParam);
		},

    actionClick(){

      setTimeout(()=>{
        if(this.GV())this.GV().commit();

        if(!this.$utils.validateFields(this.params, ['C:결과:result'])){
          return;
        }

        if(this.params["result"] == '불량' && !this.$utils.validateFields(this.params, ['C:불량유형:불량유형'])){
          return;
        }
			  let 불량코드 = this.params["불량유형"];
        let result = this.params["result"];
			  let scrap = this.items.find(item => item.value === this.params["불량유형"])?.['text'];
        let rows = this.DP().getJsonRows(0, -1)  
        .filter(item => !_.isNil(item.cellId))    
        .map(item => ({
          ...item,
          cellId: item.cellId,
          ...this.params,
          '차수': this.params["차수"],
          'result': result,
          '불량코드':  (["BIN1","BIN2","양품"].includes(result) ? null : 불량코드),
          '불량명': (["BIN1","BIN2","양품"].includes(result) ? null : scrap),
        }));
        if (rows.length == 0) {
          this.$toast('info', '저장할 대상이 없습니다.');
          return;
        }
        let saveFunc = async () => {
  
          let param = {
            menuId:'M0003003',
            update: [
              {queryId: (result == '제거' ? 'M0003003_Delete2' : (result == '추가' ? 'M0003003_Update5' : 'M0003003_Update4')), data:rows},
            ]
          };
  
          if(this.params.callback != null){
            param["update"].push({...this.params.callback});
          }
  
          const resp = await this.$axios.api.saveData(param);
          if (resp.status === 'success') {
            this.$toast('success', '저장되었습니다.');
            this.$emit("save");
            this.closeDialog();
          } else {
            this.$toast('error', resp.message);
          }
        };
  
        this.$confirm("확인", '저장 하시겠습니까?', (confirm)=>{
          if(confirm){
            saveFunc();
          }
        });
      }, 300)
    },

    async actionEvent(grid, type){
      if(this.GV())this.GV().commit();

      let current = grid.getCurrent();
      if (current) {
        let pResult = this.params["result"];
        
        if(_.isNil(pResult)){
          this.$toast("info", "결과 유형을 선택하세요.");
          this.addEmpty(grid, current);
        }else{
          // 현재 셀의 값이 유효한 경우에만 새 행 추가
          let value1 = this.DP().getValue(current.dataRow, current.fieldName);
          let value = this.$utils.korToEng(value1);
          // 바코드 입력이 다른경우...
          if(value1 != value){
            grid.setValue(current.dataRow, "cellId", value);
          }
          this.enterFlag = false;
          let rows = this.DP().getJsonRows(0, -1).filter(item => item.cellId == value).map(item => ({...item}));
          if (!_.isNil(value) && rows.length == 1) {
            if(pResult == "추가"){
              let result1 = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch27", 
                queryParams: {
                  ...this.params,
                  cellId: value,
                  runId: this.params["runNo"]
                }
              });

              if(_.isEmpty(result1)){
                this.$toast("info", "이미 등록된 CELL_NO 이거나 등록할수 없는 CELL_NO 입니다.<br><span style='color:red'>추가는 설비로그에서 한건이라도 진행되어야 합니다.</span>", {
                  dangerouslyHTMLString: true,
                });
                this.addEmpty(grid, current);
              }else{
                this.addRows(grid, current, value, result1);
              }
            }else{
              let result = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch21", 
                queryParams: {
                  ...this.params,
                  cellId: value,
                  runId: this.params["runNo"]
                }
              });
              if(!_.isEmpty(result)){            
                if(!_.isNil(result[0]["신뢰성시료유형"])){
                  this.$toast("info", "신뢰성시료에 등록된 CELL_NO 입니다.");
                  this.addEmpty(grid, current);
                }else{
                  this.addRows(grid, current, value, result); 
                }
              }else{
                this.$toast("info", "유효하지 않은 CELL_NO 입니다.");
                this.addEmpty(grid, current);
              }
            }
          }else if(!_.isNil(value) && rows.length > 1){
            this.$toast("info", "대상이 이미 존재합니다.");
            this.addEmpty(grid, current);
          }
        }
        this.enterFlag = true;
      }

    },

    addEmpty(grid, current){
      this.DP().updateRow(current.dataRow, {
        runId: null,
        cstNo: null,
        cellId: null,
        '차수': null,
      }, true);
      grid.setFocus();
      grid.setCurrent({ dataRow: current.dataRow, fieldName: "cellId" });
      setTimeout(() => {
        this.GV().showEditor();
      }, 100);
    },

    addRows(grid, current, value, result){
      this.DP().updateRow(current.dataRow, {
        runId: result[0].runId,
        cstNo: result[0].cstNo,
        '차수': result[0]["차수"],
        cellId: value
      }, true);
      this.DP().addRow({});
      let newRow = this.DP().getRowCount() - 1;
      grid.setFocus();
      grid.setCurrent({ dataRow: newRow, fieldName: "cellId" });
      setTimeout(() => {
        this.GV().showEditor();
      }, 100); 
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackResultInputPopupGrid(grid, cell){
      let rtn = {};
      if(this.params.isEditabled){
        rtn.editable = true;
        rtn.styleName = "edit";
      }else{
        rtn.editable = false;
        rtn.styleName = "";
      }
      return rtn
    },

    onCellEditedResultInputPopupGrid(grid, itemIndex, row, field) {
      if(this.actionType == 'enter')return;
      this.actionType = "edited";
      this.actionEvent(grid, 'edited');
    },
    

    onKeyDownResultInputPopupGrid(grid, event) {
      this.actionType = 'enter';
      if(event.keyCode == 13 && this.enterFlag){
        this.actionEvent(grid, 'enter');
      }
      this.actionType = null;
    }
  },
};
</script>

<style lang="scss">
</style>