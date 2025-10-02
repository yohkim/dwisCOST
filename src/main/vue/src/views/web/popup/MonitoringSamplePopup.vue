<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="'모니터링 시료'" no-close-on-backdrop :style="{  zIndex: zIndex }" centered>
    <div class="search_box mb-1">
      <div class="row search_area">
        <div class="col-3">
          <div class="form-floating">
            <select class="form-select label-60"  id="floatingSelect"  aria-label="Floating label select example"  v-model="params['신뢰성시료유형']" disabled>
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
      </div>
    </div>
    <div>
      <RealGrid ref="monitoringSamplePopupGrid" :uid="'monitoringSamplePopupGrid'" :rows="rows" :style="`height: 250px`"/>
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
  name: "MonitoringSamplePopup",
  props: {},
  data() {
    return {
      monitoringSamplePopupGrid: null,
      rows: [],
      isOpen: false,
      items: [
        {value: "211", text: "PFL 필름포장 검사"},
        {value: "221", text: "VRS 엣지검사"}
      ],
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
    };
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    GV() {
      return this.$refs.monitoringSamplePopupGrid.getGridView();
    },
    DP() {
      return this.$refs.monitoringSamplePopupGrid.getGridDataProvider();
    },
    openDialog(params) {
      this.$utils.initializeParamsInPlace(this.params);
      this.params.callback = null;
      this.params['차수'] = 1;
      Object.assign(this.params, params);
      this.params['신뢰성시료유형'] = (this.params['공정코드'] == '072' ? '211' : '221');
      this.monitoringSamplePopupGrid = _.cloneDeep(require(`./js/ReliabilitySamplePopup.js`));
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.$refs.monitoringSamplePopupGrid.created();
        this.rows=[{}]; 
        this.isOpen = true;

        setTimeout(() => {
          this.GV().setCurrent({ dataRow: 0, fieldName: "cellId" });              
          this.GV().showEditor();
        }, 100);
      });
    },
    closeDialog() {
      this.$refs.monitoringSamplePopupGrid.destroy();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
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
        let remark = this.items.find(item => item.value === this.params["신뢰성시료유형"]).text;  
        let rows = this.DP().getJsonRows(0, -1)  
        .filter(item => !_.isNil(item.cellId))    
        .map(item => ({
          ...item,
          cellId: item.cellId,
          ...this.params,
          '차수': item["차수"],
          '특이사항': remark
        }));
        if (rows.length == 0) {
          this.$toast('info', '저장할 대상이 없습니다.');
          return;
        }
        let rows1 = [];
        const result = rows.map(row => row.cellId).join(';');
        rows1.push(
          {
            '신뢰성작업확인': this.params["작업자1"],
            '신뢰성시료유형': this.params["신뢰성시료유형"],
            cellIds: result
          }
        );        
        let saveFunc = async () => {
  
          let param = {
            menuId:'M0003002',
            update: [
              {queryId:'M0003002_Update021', data:rows1},
              {queryId:'M0003002_Update022', data:rows},
            ]
          };
  
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
          }else{
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

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackMonitoringSamplePopupGrid(grid, cell){
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

    onCellEditedMonitoringSamplePopupGrid(grid, itemIndex, row, field) {
      if(this.actionType == 'enter')return;
      this.actionType = "edited";
      this.actionEvent(grid, 'edited');
    },
    

    onKeyDownMonitoringSamplePopupGrid(grid, event) {
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