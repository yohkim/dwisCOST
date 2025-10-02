<template>
  <div class="accordion mt-2" id="sampleInfoStatus">
    <div class="accordion-item mt-2">
      <h2 class="accordion-header" id="headingTwo">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#sampleInfoStatusOne" aria-expanded="true" aria-controls="collapseTwo">{{title}}</button>
      </h2>
      <div id="sampleInfoStatusOne" class="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#collapseTwo">
        <div class="accordion-body">
          <RealGrid ref="sampleInfoGrid" :uid="'sampleInfoGrid'" :rows="rows"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const { ValueType, GridFitStyle } = require('realgrid');

export default {
  name: "SampleInfoStatus",  
  setup() {
    return {};
  },
  props: {
    title: { type: String, default: '시료현황' },
  },  
  data() {
    return {      
      sampleInfoGrid: null,
      rows: [], 
      params: {},
      layout: null,
    };
  },
  computed:{
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
			return this.$refs.sampleInfoGrid.getGridView();
		},
		dp() {
			return this.$refs.sampleInfoGrid.getGridDataProvider();
		},
    initializeGrid() {
      this.sampleInfoGrid = _.cloneDeep(require(`@components/js/SampleInfoStatus.js`));
    },
    clearData(){},
    async loadData(params){
      this.params = {};
      Object.assign(this.params, params);
      
      let result = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_Sch17", queryParams: this.params});
      this.sampleInfoGrid.fields = [];
      this.sampleInfoGrid.columns = [];
      this.sampleInfoGrid.layout = [];
      let gsfc = this.$utils.generateSeparatedFieldsAndColumns(result, "불량코드", "불량명", ValueType.NUMBER, "c", { styleName: "tr", numberFormat: "#,##0" });

      this.sampleInfoGrid.fields = [
          this.sampleInfoGrid.orgFields[0],
          ...gsfc.fields,
      ];

      this.sampleInfoGrid.columns = [
          this.sampleInfoGrid.orgColumns[0],
          ...gsfc.columns,
      ];

      this.sampleInfoGrid.layout = _.cloneDeep(this.sampleInfoGrid.orgLayout);
      this.sampleInfoGrid.layout[1].items = result.map((defect) => ("c"+defect["불량코드"]));
      this.layout = result.map(defect => ({
        value: defect["불량코드"],
        text: `c${defect["불량코드"]}`
      }));

      this.$nextTick(async()=>{
        this.$refs.sampleInfoGrid.created();


        await this.$axios.api.search({ menuId: 'M0003002', queryId: 'M0003002_Sch18', 
          queryParams: {
            ...this.params,
            code: this.params["공정코드"], 
            columns1: this.layout} , target: this.rows 
        });
        if(!_.isNil(this.params.runId1)){
          let params = {
            ...this.params,
            code: this.params["공정코드"],
            runId: this.params["runId1"]
          };
          
          let result = await this.$axios.api.search({ menuId: 'M0003002', queryId: 'M0003002_Sch18', queryParams: {...params, columns1: this.layout} });
          this.rows.push(result[0]);
        }
      
        const gridElement = this.$refs.sampleInfoGrid.$el;
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

        await this.$axios.api.search({ menuId: 'M0003002', queryId: 'M0003002_Sch25', 
          queryParams: {
            ...this.params,
            code: this.params["공정코드"], 
            '차수': version,
            columns1: this.layout} , target: this.rows 
        });
      
        const gridElement = this.$refs.sampleInfoGrid.$el;
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
  },

};
</script>
