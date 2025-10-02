<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered content-class="custom-modal-content" dialog-class="custom-modal-dialog">
    <div class="worker_wrap">
			<div class="title mr-4">작업자 정보</div>
			<div class="row worker_info">
				<div class="col-3">
					<div class="form-floating">
						<input type="text" class="form-control label-60" id="floating" placeholder="LotNo"
							v-model="worker">
						<label for="floating">작업자</label>
					</div>
				</div>
				<div class="col-2">
					<div class="form-floating">
						<select class="form-select label-60 " id="floatingSelect"
							aria-label="Floating label select example" v-model="selectedShift">
							<option v-for="(o, index) in shifts" :value="o.value" :key="index">{{ o.text }}</option>
						</select>
						<label for="floatingSelect" class="select">Shift</label>
					</div>
				</div>
				<div class="col-2">
					<div class="form-floating prc_name">
						<select class="form-select label-60 " id="floatingSelect"
							aria-label="Floating label select example" v-model="selectedWorkCrew" :disabled="true">
							<option v-for="(o, index) in workCrews" :value="o.value" :key="index">{{ o.text }}</option>
						</select>
						<label for="floatingSelect" class="select">근무 시간</label>
					</div>
				</div>
				<!-- <div class="col-2">
					<div class="form-floating">
						<select class="form-select label-60 " id="floatingSelect"
							aria-label="Floating label select example" v-model="selectedMc">
							<option v-for="(o, index) in mcList" :value="o.value" :key="index">{{ o.text }}</option>
						</select>
						<label for="floatingSelect" class="select">M/C</label>
					</div>
				</div> -->
			</div>
		</div>

      <div class="accordion mt-2" id="accordionReClean">
        <div class="accordion-item mt-2">
          <h2 class="accordion-header" id="prodStausACD">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#prodStatus" aria-expanded="false" aria-controls="prodStatus">제품현황</button>
          </h2>
          <div id="prodStatus" class="accordion-collapse collapse show" aria-labelledby="prodStausACD">
            <div class="accordion-body">
              <ProductStatus ref="productStatus" :no="params.runNo" :process="params.process" :area="'back1'" :runNo="params.runNo"/>
            </div>
          </div>
        </div>
        
        <div class="accordion-item mt-2">
          <h2 class="accordion-header" id="jobStatusACD">
            <button class="accordion-button" type="button" data-bs-toggle="collapse"
              data-bs-target="#jobStatus" aria-expanded="true" aria-controls="jobStatus">
              작업현황
            </button>
          </h2>
          <div id="jobStatus" class="accordion-collapse collapse show" aria-labelledby="jobStatusACD">
            <div class="accordion-body">
              <div class="btn_wrap mb-1">
                <!-- <b-button v-show="srchInfo.process === '023'" class="sub" @click="addRowClick">추가</b-button> -->
                <b-button class="sub" @click="tempSave">임시저장</b-button>
                <b-button-group class="toggle_btn">
                  <b-button :class="jobState === 'none' ? 'on' : ''" @click="startJob">작업시작</b-button>
                  <b-button :class="jobState === 'start' ? 'on' : ''" @click="endJobClick">작업종료</b-button>
                </b-button-group>
              </div>
              <RealGrid ref="jsdGrid" :uid="'jsdGrid'" :rows="jobDtl" style="height: 72px;" class="mb-1" />
              <b-row>
                <!-- <b-col cols="3" v-show="srchInfo.process !== '023'">
                  <lot-and-pre-cst-info ref="lapci" :runNo="srchInfo.runNo" :process="srchInfo.process" :lotOnly="true" />
                </b-col> -->
                <b-col>
                  <RealGrid ref="jsGrid" :uid="'jsGrid'" :rows="jobStatuses" style="height: 300px;" />
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>

    <div class="bttn_wrap">            
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>
import ProductStatus from '@components/ProductStatus.vue';

export default {
  name: "re-clean",
  setup() {
	},
  props: {},
  components: {
	  ProductStatus
	},
  emits: ["confirm"],
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "재세정",
      },      
      zIndex: 0,      

      //////////////////////////
      jobState:'none',
      // process:"059",  //재세정
      selectedShift:"",
      selectedWorkCrew:"",
      // selectedMc:"",
      shifts:[],
      workCrews:[],
      // mcList:[],
      jobDtl:[],
      jobStatuses:[],
    };
  },
  computed: {},
  created() {
    this.getCodes();        
    // this.getMcListByProc();
    this.initializeGrid();		
  },
  mounted() {
    
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
      this.$nextTick(()=>{
        this.$refs.productStatus.loadData();
      });
    },
    closeDialog() {  
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    
    initializeGrid(){
      // this.grid = _.cloneDeep(require(`@web/popup/js/EquipLog.js`));
    },
    getCodes() {
			this.$utils.getCommonContentValueText(['06', '75'], [this.shifts, this.workCrews]);	//shift,작업조
			// console.log("this.shifts:::",this.shifts);
		},
    //2025.1.20 재세정에 대한 설비 없음
    async getMcListByProc() {
			let qp = {};
			qp['process'] = this.process
			let param = { menuId: 'M0003001', queryId: 'selectBack1McList', queryParams: qp, target: this.mcList };
			await this.$axios.api.search(param);
		},
  },
};
</script>
<style>
.custom-modal-dialog {
  max-width: 1450px !important;
  width: 100%;
}
.custom-modal-content {
  width: 100%;
}
</style>