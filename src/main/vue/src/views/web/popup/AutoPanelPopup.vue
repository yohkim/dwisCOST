<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="'자동적층'" no-close-on-backdrop :style="{  zIndex: zIndex }" centered>
    <div class="search_box mb-1">
      <div class="row search_area">
        <div class="col-4">
          <div class="form-floating">
            <input type="text" class="form-control label-80" id="floating"
              v-model="params2.panelId"               
              name="panelId"
              data-group="params2"
              @input="convertToUpperEnglishPanelId"
              @keydown.enter="handleEnterPanelId"
              autocomplete="off"
              style="backgroundColor:#fffff0;"
            >
            <label for="floating">PANEL_ID</label>
          </div>
        </div>            
      </div>
    </div>
    <div>
      <RealGrid ref="autoPanelPopupPopupGrid" :uid="'autoPanelPopupPopupGrid'" :rows="rows" :style="`height: 250px`"/>
    </div>
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">취소</b-button>
      <b-button class="main" block @click="actionClick">진행</b-button>
    </div>
  </b-modal>  
</template>

<script>

const { RowState } = require('realgrid');

export default {
  name: "AutoPanelPopupPopup",
  props: {},
  data() {
    return {
      autoPanelPopupPopupGrid: null,
      rows: [],
      isOpen: false,
      params: {
        
      },
      params2: {
        'panelId': null,
      },
      zIndex: 0,
    };
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    GV() {
      return this.$refs.autoPanelPopupPopupGrid.getGridView();
    },
    DP() {
      return this.$refs.autoPanelPopupPopupGrid.getGridDataProvider();
    },
    openDialog(params) {
      this.$utils.initializeParamsInPlace(this.params);
      this.$utils.initializeParamsInPlace(this.params2);
      Object.assign(this.params, params);
      this.autoPanelPopupPopupGrid = _.cloneDeep(require(`./js/AutoPanelPopupPopup.js`));
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.$refs.autoPanelPopupPopupGrid.created();
        this.isOpen = true;
      });
    },
    closeDialog() {
      this.$refs.autoPanelPopupPopupGrid.destroy();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },

    actionClick(){

      if(this.rows.length == 0){
        this.$toast('info', '진행할 대상이 없습니다.');
        return;
      }
      if(this.rows[0]['등록여부'] == "등록됨"){
        this.$toast('info', '이미 등록된 PANEL ID 입니다.');
        return;
      }
      
      let saveFunc = async () => {

        let param = {
          menuId:'M0003005',
          update: [
            {queryId:'M0003005_AUTOPANEL', data:[{
              ...this.params,
              ...this.rows[0],
              '근무조': _.isNil(this.rows[0]["근무조"]) ? null : (this.rows[0]["근무조"].length == 1 ? this.rows[0]["근무조"]+""+"조" : this.rows[0]["근무조"]),
              }]
            },
          ]
        };

        const resp = await this.$axios.api.saveData(param);
        if (resp.status === 'success') {
          this.$toast('success', '자동적층 진행되었습니다.');
          this.$emit("save");
          this.closeDialog();
        } else {
          this.$toast('error', resp.message);
        }
      };

      this.$confirm("확인", '자동적층 진행 하시겠습니까?', (confirm)=>{
        if(confirm){
          saveFunc();
        }
      });
    },

    async handleEnterPanelId(event) {
      event.preventDefault(); // 기본 이벤트 방지
      this.convertToUpperEnglishPanelId(event);

      let result = await this.$axios.api.search({ menuId: "M0003005", queryId: "M0003005_Sch17", 
        queryParams: {
          'panelId': this.params2['panelId'],
          '공정코드': this.params["공정코드"]
        } 
      });
      if(!_.isEmpty(result)){
        /*Object.assign(this.params, {
          pCode: result[0]["batchNo"],
          '작업자': result[0]["작업자"],
          '공정비고': result[0]["tankNo"],
          'panelId': this.params2['panelId'],
          'shift': _.isNil(result[0]["근무조"]) ? null : (result[0]["근무조"].length == 1 ? result[0]["근무조"]+""+"조" : result[0]["근무조"]),
          machineCode: result[0]["설비호기"],
        });*/
        this.rows = _.cloneDeep(result);
        
      }else{
        this.$toast('success', 'PANEL_ID 정보가 없습니다.');
      }
    },

    convertToUpperEnglishPanelId(event) {      
      this.$nextTick(()=>{
        const group = event.target.dataset.group; // params 또는 params1 판별
        const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
        if (group && this[group]) {
          this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
        }
      });
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
  },
};
</script>

<style lang="scss">
</style>