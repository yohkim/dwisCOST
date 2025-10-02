<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="title" no-close-on-backdrop :style="{  zIndex: zIndex }" centered
    content-class="custom-modal-content-reliability-sample-popup"
    dialog-class="custom-modal-dialog-reliability-sample-popup"
  >
    <div class="search_box mb-1">
      <div class="row search_area">
        <div class="col-3">
          <div class="form-floating">
            <select class="form-select label-60"  id="floatingSelect"  aria-label="Floating label select example"  v-model="params['신뢰성시료유형']" >
              <option  v-for="(item, index) in items"  :key="index"  :value="item.value" >
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">유형</label>
          </div>
        </div>
        <div class="col-2">
          <div class="form-floating">
            <input
              type="text"
              class="form-control label-80"
              id="floating"
              placeholder="작업자1"
              autocomplete="off"
              v-model="params['작업자1']"
            />
            <label for="floating">작업 확인자</label>
          </div>
        </div>        
        <div class="col-3">
          <div class="form-floating">
            <textarea
              class="form-control label-90"
              placeholder="복사된 CELL NO"
              v-model="pasteText"
              style="resize:none;"
            ></textarea>
            <label for="floatingTextarea">복사 CELL</label>
          </div>
        </div>
        <div class="col-3">
          <div class="form-floating">
            <textarea
              class="form-control label-90"
              placeholder="실패 CELL NO"
              v-model="failText"
              style="resize:none;"
            ></textarea>
            <label for="floatingTextarea">실패 CELL</label>
          </div>
        </div>
      </div>
      <div class="btn_area">
        <b-button class="second me-1" @click="multiProc">          
          일괄입력
        </b-button>
      </div>
    </div>
    <div>
      <RealGrid ref="reliabilitySamplePopupGrid" :uid="'reliabilitySamplePopupGrid'" :rows="rows" :style="`height: 250px`"/>
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
  name: "ReliabilitySamplePopup",
  props: {
    title: { type: String, default: '신뢰성 시료' },
  },
  data() {
    return {
      reliabilitySamplePopupGrid: null,
      rows: [],
      isOpen: false,
      items: [],
      params: {
        isEditabled: false,
        "작업자1": null,
        "신뢰성시료유형": null,
        callback: null,
        "차수": 1,
      },
      zIndex: 0,
      enterFlag: true,
      actionType: null,
      pasteText: null,
      failText: null,
    };
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    GV() {
      return this.$refs.reliabilitySamplePopupGrid.getGridView();
    },
    DP() {
      return this.$refs.reliabilitySamplePopupGrid.getGridDataProvider();
    },
    openDialog(params) {
      this.$utils.initializeParamsInPlace(this.params);
      this.items = [];
      this.params.callback = null;
      this.params['차수'] = 1;
      this.pasteText = null;
      Object.assign(this.params, params);
      this.searchCode();
      this.reliabilitySamplePopupGrid = _.cloneDeep(require(`./js/ReliabilitySamplePopup.js`));
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.$refs.reliabilitySamplePopupGrid.created();
        this.rows=[{}]; 
        this.isOpen = true;

        setTimeout(() => {
          this.GV().setCurrent({ dataRow: 0, fieldName: "cellId" });              
          this.GV().showEditor();
        }, 100);
      });
    },
    closeDialog() {
      this.$refs.reliabilitySamplePopupGrid.destroy();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },

    async searchCode(){

			let searchParam = {
				menuId: "M0003002", queryId: "M0003002_Sch14", queryParams: this.params, 
				callback: (data) => {
					this.$utils.transformData(
					data,
					["value", "text", "불량유형코드", "불량코드"],
					["불량명", "불량명", "불량유형코드", "불량코드"],
					this.items
					);
				},
			};
			await this.$axios.api.search(searchParam);
		},

    actionClick(){

      setTimeout(()=>{
        if(this.GV())this.GV().commit();
  
        if(!this.$utils.validateFields(this.params, ['C:신뢰성시료유형:신뢰성시료유형'])){
          return;
        }
  
        if(!this.$utils.validateFields(this.params, ['T:작업 확인자:작업자1'])){
          return;
        }
        let dateTimeArray = this.$utils.getDateAndTimeArray1();
        let errorCode = this.items.find(item => item.text === this.params["신뢰성시료유형"])?.['불량코드'];
        let rows = this.DP().getJsonRows(0, -1)  
        .filter(item => !_.isNil(item.cellId))    
        .map(item => ({
          ...item,
          cellId: item.cellId,
          ...this.params,
          '시료일자': dateTimeArray[0],
          '신뢰성작업확인': this.params["작업자1"],
          '신뢰성시료유형':  this.params["신뢰성시료유형"],
          '불량코드': errorCode
        }));
        if (rows.length == 0) {
          this.$toast('info', '저장할 대상이 없습니다.');
          return;
        }
        let rows1 = [];
        let chkVal = this.items.find(item => item.text === this.params["신뢰성시료유형"])?.['불량유형코드'];
        if(!_.isNil(chkVal)){
          const result = rows.map(row => row.cellId).join(';');
          rows1.push(
            {
              '신뢰성작업확인': this.params["작업자1"],
              '신뢰성시료유형': chkVal,
              cellIds: result
            }
          );
        }
        let saveFunc = async () => {
  
          let param = {
            menuId:'M0003002',
            update: [
              {queryId:'M0003002_Update019', data:rows},
              {queryId:'M0003002_Update021', data:rows1},
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
          let result = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_Sch12", 
            queryParams: {
              ...this.params,
              cellId: value,
              runId: this.params["runNo"]
            }
          });
          if(!_.isEmpty(result)){
            if(!_.isNil(result[0]["신뢰성시료유형"]) || (!_.isNil(result[0]["result"]) && result[0]["result"] == '불량')){
              if(!_.isNil(result[0]["신뢰성시료유형"])){
                if(type == 'proc'){
                  this.failText += value + '\n';
                }
                this.$toast("info", "신뢰성시료에 등록된 CELL_NO 입니다.");
              }else{
                if(type == 'proc'){
                  this.failText += value + '\n';
                }
                this.$toast("info", "불량으로 등록된 CELL_NO 입니다.");
              }
              this.DP().updateRow(current.dataRow, {
                runId: null,
                cstNo: null,
                cellId: null
              }, true);
              grid.setFocus();
              grid.setCurrent({ dataRow: current.dataRow, fieldName: "cellId" });
              setTimeout(() => {
                this.GV().showEditor();
              }, 100);
            }else{
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
            }
          }else{
            if(type == 'proc'){
             this.failText += value + '\n';
            }
            this.$toast("info", "유효하지 않은 CELL_NO 입니다.");
            this.DP().updateRow(current.dataRow, {
              runId: null,
              cstNo: null,
              cellId: null
            }, true);
            grid.setFocus();
            grid.setCurrent({ dataRow: current.dataRow, fieldName: "cellId" });
            setTimeout(() => {
              this.GV().showEditor();
            }, 100);
          }
        }else if(!_.isNil(value) && rows.length > 1){
          if(type == 'proc'){
            this.failText += value + '\n';
          }
          this.$toast("info", "대상이 이미 존재합니다.");
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
        }
        this.enterFlag = true;
      }

    },

    async multiProc(){

      this.failText = "";
      setTimeout(() => {
        this.GV().setCurrent({ dataRow: 0, fieldName: "cellId" });              
        this.GV().showEditor();
      }, 100);

      if (!this.pasteText || this.pasteText.trim() === '') {
        this.$toast('info', '복사된 CELL ID가 없습니다.');
        return;
      }

      const pastedCells = Array.from(
        new Set(
          this.pasteText
            .split(/\r?\n/)
            .map(cell => cell.trim())
            .filter(cell => cell !== '')
        )
      );

      this.rows=[{}]; 
      await this.$nextTick();

      for (let i = 0; i < pastedCells.length; i++) {
        const item = pastedCells[i];
        const rowCount = this.DP().getRowCount();
        const currentRow = rowCount - 1;

        this.GV().setCurrent({ dataRow: currentRow, fieldName: "cellId" });
        this.GV().setValue(currentRow, "cellId", item);

        await this.actionEvent(this.GV(), 'proc');
        await this.sleep(300);
      }
    },

    async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackReliabilitySamplePopupGrid(grid, cell){
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

    onCellEditedReliabilitySamplePopupGrid(grid, itemIndex, row, field) {
      if(this.actionType == 'enter')return;
      this.actionType = "edited";
      this.actionEvent(grid, 'edited');
    },
    

    onKeyDownReliabilitySamplePopupGrid(grid, event) {
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
.custom-modal-dialog-reliability-sample-popup {
  max-width: 1300px !important;
  width: 100%;
}
.custom-modal-content-reliability-sample-popup {
  width: 100%;
}
</style>