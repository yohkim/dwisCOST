<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="'상세보기'" no-close-on-backdrop :style="{  zIndex: zIndex }" 
    content-class="custom-modal-content-manufacturingWorkStatusPopup"
    dialog-class="custom-modal-dialog-manufacturingWorkStatusPopup"
    centered>
      <div class="grid_box search_onerow">
        <div class="left_box">
          <div class="btn_wrap ms-auto">
            <b-button class="second" @click="excelClick">엑셀</b-button>
          </div>
        </div>
        <div class="grid-border-none">
          <RealGrid ref="manufacturingWorkStatusDetailPopupGrid" :uid="'manufacturingWorkStatusDetailPopupGrid'" :rows="rows" :style="`height: 430px`" :fitLayoutWidthEnable="false"/>
        </div>
    </div>
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>  
</template>

<script>

const { ValueType } = require('realgrid');

export default {
  name: "ManufacturingWorkStatusDetailPopup",
  props: {},
  data() {
    return {
      manufacturingWorkStatusDetailPopupGrid: null,
      rows: [],
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
    this.manufacturingWorkStatusDetailPopupGrid = _.cloneDeep(require(`./js/ManufacturingWorkStatusDetailPopup.js`));
  },
  watch: {},
  methods: {
    GV() {
      return this.$refs.manufacturingWorkStatusDetailPopupGrid?.getGridView();
    },
    DP() {
      return this.$refs.manufacturingWorkStatusDetailPopupGrid?.getGridDataProvider();
    },
    async reCreated(newVal){

      let result = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch10", 
        queryParams: { ...this.params, line: 'D1UT', "자동여부": (newVal == '023' ? 1 : 0), '공정코드': newVal }
      });

      this.manufacturingWorkStatusDetailPopupGrid.fields = [];
      this.manufacturingWorkStatusDetailPopupGrid.columns = [];

      let gsfc1 = this.$utils.generateSeparatedFieldsAndColumns(result, "불량코드", "불량명", ValueType.NUMBER, "c", { numberFormat: "#,##0", styleName: "tr"});;

      this.manufacturingWorkStatusDetailPopupGrid.fields = [
        ...this.manufacturingWorkStatusDetailPopupGrid.orgFields,
        ...gsfc1.fields,
      ];
  
      this.manufacturingWorkStatusDetailPopupGrid.columns = [
        ...this.manufacturingWorkStatusDetailPopupGrid.orgColumns,
        ...gsfc1.columns,
      ];

      this.manufacturingWorkStatusDetailPopupGrid.layout = [
        ...this.manufacturingWorkStatusDetailPopupGrid.orgLayout,
        ...[{
          name: "불량현황",
          direction: "horizontal",
          items: [],
          header:{ text: "불량현황" }
        }],
        ...["특이사항"]
      ];
      try {
        this.manufacturingWorkStatusDetailPopupGrid.layout[this.manufacturingWorkStatusDetailPopupGrid.layout.length-2].items = result.map((defect) => ("c"+defect["불량코드"]));
      } catch (error) {
        console.error('불량현황 생성중 오류', error);
      }
      this.dynamic.layout = result.map(defect => ({
        value: defect["불량코드"],
        text: `c${defect["불량코드"]}`
      }));

      this.$refs.manufacturingWorkStatusDetailPopupGrid.created();
    },
    openDialog(params) {
      this.$utils.initializeParamsInPlace(this.params);
      Object.assign(this.params, params);
      this.$nextTick(async() => {     
        this.zIndex = this.$zIndexManager.next();
        await this.reCreated(this.params["curProcess"]);

        this.$axios.api.search({ menuId: "R0000000", queryId: "R0000000_Sch11", queryParams: {...this.params, columns: this.dynamic.layout }, target: this.rows}).then(()=>{
          this.isOpen = true;
        });
      });
    },
    closeDialog() {
      this.$refs.manufacturingWorkStatusDetailPopupGrid.destroy();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    excelClick(){
      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const fileName = `재공재고현황_Front_상세${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      this.GV().exportGrid({
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: "엑셀 Export중입니다.",
        exportGrids: [
          { grid: this.GV(), sheetName: '재공_재고현황 Front 상세' },
        ],
        done: () => {
          this.$toast('success', '엑셀 내보내기가 완료되었습니다!');
        },
      });
    },
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