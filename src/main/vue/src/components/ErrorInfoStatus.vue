<template>
  <div class="etc mt-1"> 
    <div class="title">{{ runId1View ? 'L축 불량현황' : title }}</div>
    <RealGrid ref="errorInfoGrid" :uid="'errorInfoGrid'" :rows="rows" :fitLayoutWidthEnable="false"/>
    <div class="title" v-if="runId1View">R축 불량현황</div>
    <RealGrid ref="errorInfoGrid1" :uid="'errorInfoGrid1'" :rows="rows1" v-if="runId1View" :fitLayoutWidthEnable="false"/>
  </div>
  <!--<div class="accordion mt-2" id="errorInfoStatus">
    <div class="accordion-item mt-2">
      <h2 class="accordion-header" id="headingTwo">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#errorInfoStatusOne" aria-expanded="true" aria-controls="collapseTwo">불량현황</button>
      </h2>
      <div id="errorInfoStatusOne" class="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#collapseTwo">
        <div class="accordion-body">
        </div>
      </div>
    </div>
  </div>-->
</template>

<script>

const { ValueType, GridFitStyle } = require('realgrid');

export default {
  name: "ErrorInfoStatus",  
  setup() {
    return {};
  },
  props: {
    title: { type: String, default: '불량현황' },
    inQty1: { type: Number, default: 0 },
    inQty2: { type: Number, default: 0 }
  },  
  data() {
    return {      
      errorInfoGrid: null,
      errorInfoGrid1: null,
      rows: [], 
      rows1: [],
      params: {},
      layout: null,
    };
  },
  computed:{
    runId1View(){
      return !_.isNil(this.params.runId1);
    }
  },
  watch: {    
    
  },
  created() {
		this.initializeGrid();
	},
  mounted(){ 
    
  },  
  methods: {
    gv() {
			return this.$refs.errorInfoGrid.getGridView();
		},
		dp() {
			return this.$refs.errorInfoGrid.getGridDataProvider();
		},
    gv1() {
			return this.$refs.errorInfoGrid1.getGridView();
		},
		dp1() {
			return this.$refs.errorInfoGrid1.getGridDataProvider();
		},
    initializeGrid() {
      this.errorInfoGrid = _.cloneDeep(require(`@components/js/ErrorInfoStatus.js`));
      this.errorInfoGrid1 = _.cloneDeep(require(`@components/js/ErrorInfoStatus.js`));
    },
    clearData(){},
    async loadData(params){
      this.params = {};
      Object.assign(this.params, params);
      this.params["curProcess"] = this.params["공정코드"];
      
      let result = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch10", queryParams: this.params});
      this.errorInfoGrid.fields = [];
      this.errorInfoGrid.columns = [];
      this.errorInfoGrid.layout = [];
      this.errorInfoGrid1.fields = [];
      this.errorInfoGrid1.columns = [];
      this.errorInfoGrid1.layout = [];
      let gsfc1 = this.$utils.generateSeparatedFieldsAndColumns(result, "불량코드", "불량명", ValueType.NUMBER, "c", { numberFormat: "#,##0", styleName: "tr", 
        footer: { valueCallback: this.footerValueCallback1 }
      });
      let gsfc2 = this.$utils.generateSeparatedFieldsAndColumns(result, "불량코드", "불량명", ValueType.NUMBER, "c", { numberFormat: "#,##0", styleName: "tr", 
        footer: { valueCallback: this.footerValueCallback2 }
      });
      this.errorInfoGrid.orgColumns[0].footer = {valueCallback : this.footerValueCallback1};
      this.errorInfoGrid1.orgColumns[0].footer = {valueCallback : this.footerValueCallback2};

      this.errorInfoGrid.fields = [
          this.errorInfoGrid.orgFields[0],
          ...gsfc1.fields,
      ];
      this.errorInfoGrid1.fields = [
          this.errorInfoGrid1.orgFields[0],
          ...gsfc2.fields,
      ];

      this.errorInfoGrid.columns = [
          this.errorInfoGrid.orgColumns[0],
          ...gsfc1.columns,
      ];
      this.errorInfoGrid1.columns = [
          this.errorInfoGrid1.orgColumns[0],
          ...gsfc2.columns,
      ];

      this.errorInfoGrid.layout = _.cloneDeep(this.errorInfoGrid.orgLayout);
      this.errorInfoGrid.layout[1].items = result.map((defect) => ("c"+defect["불량코드"]));
      this.errorInfoGrid1.layout = _.cloneDeep(this.errorInfoGrid.orgLayout);
      this.errorInfoGrid1.layout[1].items = result.map((defect) => ("c"+defect["불량코드"]));
      this.layout = result.map(defect => ({
        value: defect["불량코드"],
        text: `c${defect["불량코드"]}`
      }));

      this.$nextTick(async()=>{
        this.$refs.errorInfoGrid.created();


        await this.$axios.api.search({ menuId: 'M0003005', queryId: 'M0003005_Sch14', queryParams: {...this.params, columns1: this.layout} , target: this.rows });
        if(!_.isNil(this.params.runId1)){
          this.$refs.errorInfoGrid1.created();
          let params = {
            ...this.params,
            runId: this.params["runId1"]
          };
          
          await this.$axios.api.search({ menuId: 'M0003005', queryId: 'M0003005_Sch14', queryParams: {...params, columns1: this.layout}, target: this.rows1 });
        }
      
        const gridElement = this.$refs.errorInfoGrid.$el;
        if (gridElement) {          
          const scrollbar = gridElement.querySelector(".rg-hscrollbar");
          if (scrollbar) {
            this.gv().setOptions({ display: {fitStyle: GridFitStyle.NONE} });
          } else {
            this.gv().setOptions({ display: {fitStyle: GridFitStyle.EVEN_FILL} });
          }
        }
        if(this.gv())this.gv().refresh(true);      
      });

    },

    async loadVersionData(version = 1){
      
      this.$nextTick(async()=>{

        await this.$axios.api.search({ menuId: 'M0003005', queryId: 'M0003005_Sch20', queryParams: {...this.params, columns1: this.layout, '차수': version} , target: this.rows });
        
        const gridElement = this.$refs.errorInfoGrid.$el;
        if (gridElement) {          
          const scrollbar = gridElement.querySelector(".rg-hscrollbar");
          if (scrollbar) {
            this.gv().setOptions({ display: {fitStyle: GridFitStyle.NONE} });
          } else {
            this.gv().setOptions({ display: {fitStyle: GridFitStyle.EVEN_FILL} });
          }
        }
        if(this.gv())this.gv().refresh(true);      
      });

    },

    footerValueCallback1(grid, column, footerIndex, columnFooter, value){
      let t투입수량 = this.$utils.numberValueOrDefault(this.inQty1);
	    let t불량수량 = this.$utils.numberValueOrDefault(grid.getValue(0, column.name));
      return t투입수량 == 0 ? 0 : this.$utils.formatNumber(((t불량수량*100)/t투입수량), 2);
    },
    footerValueCallback2(grid, column, footerIndex, columnFooter, value){
      let t투입수량 = this.$utils.numberValueOrDefault(this.inQty2);
	    let t불량수량 = this.$utils.numberValueOrDefault(grid.getValue(0, column.name));
      return t투입수량 == 0 ? 0 : this.$utils.formatNumber(((t불량수량*100)/t투입수량), 2);
    }
  },

};
</script>
