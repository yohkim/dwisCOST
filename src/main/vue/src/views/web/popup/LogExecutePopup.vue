<template>
  <b-modal v-model="isOpen" hide-footer size="xl" :title="'LOG'" @hide="closeDialog"
    no-close-on-backdrop    
    :style="{
      zIndex: zIndex
    }"
    centered>
    <div>
      <b-form-input
        id="pollInterval"
        v-model.number="userPollInterval"
        type="number"
        placeholder="Enter interval in seconds"
        @input="enforceMinimumInterval"
      ></b-form-input>      
      <b-progress height="20px" :value="progress" :max="max" :variant="variant" :striped="striped" :animated="animate" class="mb-2" show-value></b-progress>
      <b-button class="main" @click="startPolling">LOG 실행</b-button>
      <b-button class="second" @click="cancelOperation(false)">LOG 취소</b-button>      
      <div class="execution-time">
        실행 시간: {{ executionTime }}
      </div>
      <RealGrid
          ref="logExecutePopupGrid"
          :uid="'logExecutePopupGrid'"
          :rows="rows"
          style="height: 500px;margin:auto"
        />
    </div>
  <div class="bttn_wrap">
    <b-button  block @click="closeDialog">닫기</b-button>
  </div>
  </b-modal>
</template>

<script>

const { RowState } = require('realgrid');

export default {
  name: "ProcessingMapping",
  props: {},
  data() {
    return {
      logExecutePopupGrid: null,
      rows: [],
      isOpen: false,
      variant: "info",
      striped: false,
      animated: false,
      logText: "",
      progress: 0,
      max: 100,
      params: {
        dialogTitle: "",
        isEditabled: false,
        menuId: "",
        queryId: "",
      },
      zIndex: 0,
      userPollInterval: 5,
      polling: null,
      startTime: null,
      executionTime: "0초",
      executionTimer: null,
    };
  },
  computed: {
    validatedPollInterval() {
      return this.userPollInterval * 1000;
    },
  },
  watch: {
    userPollInterval(newInterval, oldInterval) {
      if (newInterval !== oldInterval) {
        this.startPolling();
      }
    },
  },
  created() {},
  watch: {},
  methods: {
    getLogExecutePopupGridGV() {
      return this.$refs.logExecutePopupGrid.getGridView();
    },
    getLogExecutePopupGridDP() {
      return this.$refs.logExecutePopupGrid.getGridDataProvider();
    },
    openDialog(params) {
      this.rows = [];
      Object.assign(this.params, params);
      this.logExecutePopupGrid = _.cloneDeep(require(`./js/LogExecutePopup.js`));
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.$refs.logExecutePopupGrid.created();
        this.rows = [];
        this.progress = 0;
        //this.startPolling();
        this.isOpen = true;
      });
    },
    closeDialog() {
      this.cancelOperation(true);
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    confirm() {
      this.closeDialog();
    },
    enforceMinimumInterval() {
      this.$nextTick(()=>{
        if (this.userPollInterval < 5) {
          this.userPollInterval = 5;
        }
      })
    },
    async checkProgress() {
      try {
        const data = await this.$axios.api.search({menuId: this.params.menuId, queryId: this.params.queryId, queryParams: this.params});
        this.progress = 0;
        if(!_.isEmpty(data)){
          this.progress = Math.floor((data[0]['전체검사수량']*100)/data[0]['전체투입수량']);
        }
        this.rows = data;
        if (this.progress >= 100) {
          this.striped = false;
          this.animated = false;
          this.clearPolling();
          setTimeout(() => {
            this.$emit("completed");
          }, 2000);
        }else{
          this.striped = true;
          this.animated = true;
        }
      } catch (error) {
        console.error(error);
        this.clearPolling();
      }
    },
    startPolling() {
      this.striped = false;
      this.animated = false;
      this.startTime = new Date();
      this.executionTime = "0초";
      this.clearExecutionTimer();
      this.clearPolling();
      this.executionTimer = setInterval(this.updateExecutionTime, 1000);
      this.polling = setInterval(this.checkProgress, this.validatedPollInterval);
    },
    updateExecutionTime() {
      if (this.startTime) {
        const now = new Date();
        const diff = Math.floor((now - this.startTime) / 1000); // 초 단위 차이 계산
        this.executionTime = `${diff}초`;
      }
    },
    clearExecutionTimer() {
      if (this.executionTimer) {
        clearInterval(this.executionTimer);
        this.executionTimer = null;
      }
    },
    clearPolling() {      
      if (this.polling) {
        clearInterval(this.polling);
        this.polling = null;
      }
    },
    cancelOperation(flag) {
      this.striped = false;
      this.animated = false;
      if(flag){
        this.startTime = new Date();
        this.executionTime = "0초";
      }
      this.clearExecutionTimer();
      this.clearPolling();
      this.$emit("cancelled");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .btn{
  margin: 0 5px;
  border: 0;
  &.main{
    background-color: #232f4e;
    color: #2dc1dd;
  }
    &.second{
    background-color: #7487ad;
    color: #fff;
  }
}
</style>