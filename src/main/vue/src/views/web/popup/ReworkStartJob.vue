<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="lg" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
		<div class="search_box mb-1">
      <b-row class="row search_area">
        <b-col cols="3">
          <code-select :code="'06'" :label="'Shift'" v-model="params.shift" :isCodeText="true"/>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
              <input type="text" class="form-control label-60 lot_run_num" id="floating" placeholder="" v-model="params.worker">
              <label for="floating">작업자</label>
          </div>
        </b-col>
        <b-col cols="3">
          <code-select :codeList="mcList" :label="'설미명'" v-model="params.mc"/>
        </b-col>
      </b-row>
    </div>
      <div class="grid_box">
        <div class="left_box">
          <div class="btn_wrap ms-auto">      
            <b-button class="main" @click="saveClick">저장</b-button>
          </div>            
        </div>
      <RealGrid ref="grid" :uid="'grid'" class="grid-border-none" :rows="params.mboxRows" style="height: 500px" />
    </div>
    <div class="bttn_wrap">      
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>
import moment from 'moment';

export default {
  name: "ReworkStartJob",
  setup() {
		return {};
	},
  emits: ["startJobComplete"],
  props: {},
  components: {
		// MboxQtyMod
	},
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "작업시작",
        shift:"", 
        worker:"",
        mc:"",
      },
      zIndex: 0,
      mcList:[],
      grid:null,
    };
  },
  computed: {},
  created() {
    this.initializeGrid();		
  },
  mounted() {    
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
      this.dp().setRows([]);
      this.getMcList();
      // this.searchCdt();            
    },
    closeDialog() {
      this.gv().cancel();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    getMcList(){
      let param = {menuId:'M0003008',queryId:'selectReworkMcList',queryParams:this.params, target: this.mcList};
			this.$axios.api.search(param);	   
    },
    gv(){
			return this.$refs[['grid']].getGridView();	
		},
		dp(){
			return this.$refs['grid'].getGridDataProvider();
		},
    initializeGrid(){
      this.grid = _.cloneDeep(require(`@web/m0003000/js/TAB048000_2.js`));      
    },
    async saveClick(){
      if(!this.$utils.validateFields(this.params, ['S:Shift:shift','T:작업자:worker','S:M/C:mc'])){
				return;
			}
      
      this.$confirmYesOrNo("선택", "작업시작 하시겠습니까?", (confirmed) => {
        if (confirmed) {
          this.save();
        } 
      });
      
    },
    async save(){   
      this.params['투입수량'] = this.params.mboxRows.at(-1)['수량'];      
      this.params['작업시작'] = moment().format('YYYYMMDD');
	    this.params['시작시각'] = moment().format('HHmmss');

      let param= {menuId:'M0003008',queryId:'reworkStartJob',queryParams:this.params, target: null};
      let rslt = await this.$axios.api.search(param);	
      this.$toast('success','작업 시작되었습니다.');
      this.$emit("startJobComplete");
      
      this.closeDialog();
    },
  },
};
</script>
