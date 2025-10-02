<template>
  <div :style="{zIndex: zIndex}">
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="'제품코드 채번'"
    no-close-on-backdrop
    centered
  >
    <div><!--looping-->
      <b-row>
        <b-col cols="2">
          소스공정
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <input
              autocomplete="off"
              type="text"
              maxlength="2"
              class="form-control"
              id="floating"
              @click="openSourceProcess"
              v-model="params['sourceProcess']"
              readonly
              />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          타겟공정
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <input
              autocomplete="off"
              type="text"
              maxlength="2"
              class="form-control"
              id="floating"
              @click="openTargetProcess"
              v-model="params['targetProcess']"
              readonly
              />
          </div>
        </b-col>
      </b-row>
    </div>
    <div class="bttn_wrap">
      <div>
        <b-button  class="main" @click="confirm">확인</b-button>
      </div>
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>  
    
  </b-modal>
  <ProcessPopup ref="popup" @confirm="popupConfirm" />
</div>
</template>

<script>
import ProcessPopup from '@web/m0002000/tab/TAB013000Popup1_1.vue';

export default {
  name: "ProdDevLogPopup",
  components:{
    ProcessPopup
  },
  props: {},
  data() {
    return {
      isOpen: false,
      params: {
        sourceProcess:null,
        targetProcess:null,
        userName:null,
      },
      zIndex: 0,
    };
  },
  computed: {
  },
  async created() {
  },
  watch: {
    rows: {
      handler() {
      },
      deep: true,
    },
  },
  methods: {
    openDialog(params) {
      this.params = {
        sourceProcess:null,
        targetProcess:null,
      }
      Object.assign(this.params, params);
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.rows=[]; 
        this.isOpen = true;
      });
    },
    closeDialog() {
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    async confirm() {
      this.$confirm('확인', '공정을 복사하시겠습니까?', async (confirmed) => {
        if (confirmed) {
          if(_.isNil(this.params.sourceProcess)||_.isNil(this.params.targetProcess)){
            this.$toast("info","소스공정과 타겟공정을 모두 선택해주세요.");
            return;
          }
          let param = {
            menuId: "M0002003",
            insert: [
              { 
                queryId: "copyProcess",
                data: [{
                  sourceProcess:this.params.sourceProcess,
                  targetProcess:this.params.targetProcess,
                  userName:this.params.userName
                }]
              }
            ],
          };
          
          try {
            let resp = await this.$axios.api.saveData(param);
            this.$toast("info","공정이 복사되었습니다.");
            this.$emit("confirm",this.params);
            this.closeDialog();
          } 
          catch {
            this.$toast("info", "에러발생. 다시 작업해주세요.");
          }
        } else {
          return;
        }
      });
    },
    openSourceProcess(){
      let params = {
						dialogTitle: "소스 공정 선택",
						step: 7,
						height: 300,
						width: 700,
						search: { menuId: "M0002003", queryId: "selectSourceProcess" },
      };	
      this.$refs.popup.openDialog(params);
    },
    openTargetProcess(){
      let params = {
        dialogTitle: "소스 공정 선택",
        step: 7,
        height: 300,
        width: 700,
        search: { menuId: "M0002003", queryId: "selectTargetProcess" },
      };	
      this.$refs.popup.openDialog(params);
    },
    popupConfirm(params){
			let checkRow = params.gridView.getCheckedRows(true);
      if(checkRow.length>0){
        let rowData = params.dataProvider.getJsonRow(checkRow[0]);
        if(params.search.queryId=='selectSourceProcess'){
          this.params.sourceProcess = rowData.process_id;
        }else{
          this.params.targetProcess = rowData.process_id;
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>