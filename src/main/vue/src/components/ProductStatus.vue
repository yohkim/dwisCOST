<template>
  <RealGrid ref="psGrid" :uid="'psGrid'" :rows="prodStatus" :style="getRgStyle" />
</template>

<script>


export default {
  name: "prod-status",  
  setup() {
    return {};
  },
  props: {
    area: { type: String, default: null, 
      validator(value) {
        // 허용된 값만 유효
        const allowedValues = ['front', 'back1', 'back2','rework'];
        const isValid = allowedValues.includes(value);
        if (!isValid) {
          console.error(`Invalid prop: custom validator check failed for prop "area". Received "${value}" but expected one of ${allowedValues.join(', ')}.`);
        }
        return isValid;
      },
    },
    no: { type: String, default: null },
    no1: { type: String, default: null },
    process: { type: String, default: null },
    runNo: { type: String, default: null },
  },  
  data() {
    return {      
      psGrid: null,
      prodStatus: [], 
      queryId:'',  
    };
  },
  computed:{
    getRgStyle(){
      let h = 50; //default
      if(this.area === 'front' || this.process === '023'){
        h+= 25;
      }
      this.prodStatus.forEach(el => {
        h+= 22;
      });
      return {
        height: `${h}px`,
      };
    }
  },
  watch: {    
    'prodStatus.length'(newLength, oldLength) {
      // console.log("newLength:::",newLength);
      if(this.area !== 'rework'){
        this.gv().columnByName("lotNo").visible =  newLength > 1;
      }
    },
    'process'(newValue){
      this.$refs.psGrid.destroy();
      this.initializeGrid();
      this.$refs.psGrid.created();
    }
  },
  created() {
		this.initializeGrid();
	},
  mounted(){ 
    
  },  
  methods: {
    gv() {
			return this.$refs.psGrid.getGridView();
		},
		dp() {
			return this.$refs.psGrid.getGridDataProvider();
		},
    initializeGrid() {
      if((this.area === 'back1' || (this.area === 'back2' && ["055","056","054","058","059","061","067"].includes(this.process))) && this.process !== '023'){
        this.psGrid = _.cloneDeep(require(`@components/js/ProductStatus1.js`));
        this.queryId = 'selectProdStatusInfoBack1';
      }else if(this.area === 'back2' && ["072","068","069","070","073"].includes(this.process)){
        this.psGrid = _.cloneDeep(require(`@components/js/ProductStatus1.js`));
        this.queryId = 'selectProdStatusInfoBack2';
      }else if(this.area === 'front' || this.process === '023'){
        this.psGrid = _.cloneDeep(require(`@components/js/ProductStatus2.js`));
        this.queryId = 'selectProdStatusInfoFront';
      }else if(this.area === 'rework' && this.process === '022'){
        console.log("rework start");
        this.psGrid = _.cloneDeep(require(`@components/js/ProductStatus3.js`));
        this.queryId = 'selectProdStatusInfoRework';
      }
		},
    clearData(){
      this.prodStatus = [{}];
    },
    async loadData(){
      
      let noList = [];
      if(!_.isEmpty(this.no)){
        noList.push(this.no);
      }
      if(!_.isEmpty(this.no1)){
        noList.push(this.no1);
      }
      
      if(this.process === '023'){ //박리
			  let param = { menuId: 'M0003001', queryId: "selectLotNoByRunNo", queryParams: {"no":this.no}, target: null };
        noList = await this.$axios.api.search(param);
      }

      this.getProdStatus(noList);
    },
    async getProdStatus(noList){
      if(_.isEmpty(noList)){
        console.warn("noList is empty");
        return;
      }
      let qp = {};
      qp['noList'] = noList;
      qp['process'] = this.process;
      qp['runNo'] = this.runNo;
			let param = { menuId: 'M0003001', queryId: this.queryId, queryParams: qp, target: this.prodStatus };
			await this.$axios.api.search(param);
      
      if(this.gv())this.gv().refresh(true);
    },
    getCstCell(){
      let cell = 0;
      let fn = "";
      if((this.area === 'back1' || (this.area === 'back2' && ["055","056","054","058","059","061","067"].includes(this.process))) && this.process !== '023'){
        fn = "양품수량";
      }else if(this.area === 'back2' && ["072","068","069","070","073"].includes(this.process)){
        fn = "양품수량";
      }else if(this.area === 'front' || this.process === '023'){
        fn = "cell수량";
      }else if(this.area === 'rework' && this.process === '022'){
        fn = "시료수량";
      }

      let list = this.dp().getJsonRows();
      list.forEach(el => {
        cell += new Number(el[fn])||0;
      });
      return cell; 
    }
  },

};
</script>
