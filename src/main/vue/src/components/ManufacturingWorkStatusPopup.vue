<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="'상세보기'" no-close-on-backdrop :style="{  zIndex: zIndex }" 
    content-class="custom-modal-content-manufacturingWorkStatusPopup"
    dialog-class="custom-modal-dialog-manufacturingWorkStatusPopup"
    centered>
    <div>
      <b-tabs b-model="tab" class="three_depth_tab">
        <b-tab title="Front">
          <div class="left_box">
            <div class="btn_wrap ms-auto">
              <b-button class="second" @click="excelClick(1)">엑셀</b-button>
            </div>
          </div>
          <div>
            <RealGrid ref="manufacturingWorkStatusPopupGrid1" :uid="'manufacturingWorkStatusPopupGrid1'" :rows="rows1" :style="`height: 430px`" :fitLayoutWidthEnable="false"/>
          </div>
        </b-tab>
        <b-tab title="Back">
          <div class="left_box">
            <div class="btn_wrap ms-auto">
              <b-button class="second" @click="excelClick(2)">엑셀</b-button>
            </div>
          </div>
          <div>
            <RealGrid ref="manufacturingWorkStatusPopupGrid2" :uid="'manufacturingWorkStatusPopupGrid2'" :rows="rows2" :style="`height: 430px`" :fitLayoutWidthEnable="false"/>
          </div>
        </b-tab>
      </b-tabs>
    </div>
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>  
</template>

<script>

const { ValueType } = require('realgrid');

export default {
  name: "ManufacturingWorkStatusPopup",
  props: {},
  data() {
    return {
      manufacturingWorkStatusPopupGrid1: null,
      manufacturingWorkStatusPopupGrid2: null,
      rows1: [],
      rows2: [],
      isOpen: false,
      params: {},
      zIndex: 0,
      dynamic: {
        layout: null,
      },
    };
  },
  computed: {},
  created() {
    this.manufacturingWorkStatusPopupGrid1 = _.cloneDeep(require(`./js/ManufacturingWorkStatusPopup1.js`));
    this.manufacturingWorkStatusPopupGrid1.options.filtering.automating.textCategoryCallback = this.textCategoryCallback1;
    this.manufacturingWorkStatusPopupGrid2 = _.cloneDeep(require(`./js/ManufacturingWorkStatusPopup2.js`));
    this.manufacturingWorkStatusPopupGrid2.options.filtering.automating.textCategoryCallback = this.textCategoryCallback2;
  },
  watch: {},
  methods: {
    GV1() {
      return this.$refs.manufacturingWorkStatusPopupGrid1?.getGridView();
    },
    DP1() {
      return this.$refs.manufacturingWorkStatusPopupGrid1?.getGridDataProvider();
    },
    GV2() {
      return this.$refs.manufacturingWorkStatusPopupGrid2?.getGridView();
    },
    DP2() {
      return this.$refs.manufacturingWorkStatusPopupGrid2?.getGridDataProvider();
    },
    textCategoryCallback1(column, values){
      return this.$utils.textCategoryCallback(column, this.GV1());
    },
    textCategoryCallback2(column, values){
      return this.$utils.textCategoryCallback(column, this.GV2());
    },
    openDialog(params) {
      this.$utils.initializeParamsInPlace(this.params);
      Object.assign(this.params, params);
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.$refs.manufacturingWorkStatusPopupGrid1.created();
        this.$refs.manufacturingWorkStatusPopupGrid2.created();

        let searchParam = [
          { menuId: "R0000000", queryId: "R0000000_Sch7", queryParams: {...this.params, type: 'front'}, target: this.rows1},
          { menuId: "R0000000", queryId: "R0000000_Sch7", queryParams: {...this.params, type: 'back'}, target: this.rows2}
        ];

        this.$axios.api.searchAll(searchParam).then(()=>{
          this.isOpen = true;
        });
      });
    },
    closeDialog() {
      this.$refs.manufacturingWorkStatusPopupGrid1.destroy();
      this.$refs.manufacturingWorkStatusPopupGrid2.destroy();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    excelClick(gubun){
      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const fileName = `${gubun == 1 ? '재공재고현황_Front_상세' : '재공재고현황_Back_상세'} ${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      (gubun == 1 ? this.GV1() : this.GV2()).exportGrid({
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: "엑셀 Export중입니다.",
        exportGrids: [
          { grid: (gubun == 1 ? this.GV1() : this.GV2()), sheetName: (gubun == 1 ? '재공/재고현황 Front 상세' : '재공/재고현황 Back 상세') },
        ],
        done: () => {
          this.$toast('success', '엑셀 내보내기가 완료되었습니다!');
        },
      });
    },
/*
    onTabActivated(pTabIdx){
      if(this.GV1())this.GV1().fitLayoutWidth(null);
      if(this.GV2())this.GV2().fitLayoutWidth(null);
    },*/
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
  },
};
</script>

<style lang="scss">
.custom-modal-dialog-manufacturingWorkStatusPopup {
  max-width: 1400px !important;
  width: 100%;
  max-height: 80vh;
  height: 630px;
}
.custom-modal-content-manufacturingWorkStatusPopup {
  width: 100%;
  height: 630px;
  max-height: 80vh;
}
</style>