<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="'Back#2 RUN Card 발행'"
    no-close-on-backdrop    
    :style="{
      zIndex: zIndex      
    }"
    centered
  >
    <div><!--looping-->
      <b-row>
        <b-col cols="2">
          고객명
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <input
              autocomplete="off"
              type="text"
              class="form-control"
              id="floating"
              v-model="params['고객명']"
              disabled
              />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          모델명
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <input
              autocomplete="off"
              type="text"
              class="form-control"
              id="floating"
              v-model="params['모델명']"
              disabled
              />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          Glass
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <input
              autocomplete="off"
              type="text"
              class="form-control"
              id="floating"
              v-model="params['glass재질']"
              disabled
              />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          Cells
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <input
              autocomplete="off"
              type="text"
              class="form-control"
              id="floating"
              v-model="params['cell수']"
              disabled
              />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          발행일
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <input
              autocomplete="off"
              type="text"
              class="form-control"
              id="floating"
              v-model="params['발행일']"
              disabled
              />
          </div>
        </b-col>
      </b-row>
    </div>
    <div class="bttn_wrap">
      <div>
        <b-button  class="main" @click="confirm">인쇄</b-button>
      </div>
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>  
  </b-modal>
</template>

<script>

export default {
  name: "RunCard2Popup",
  props: {},
  data() {
    return {
      rows: [],
      isOpen: false,
      params: {
        '고객명':'삼성디스플레이',
        '모델명':"8.12",
        'glass재질':"AS90",
        'cell수':540,
        '발행일':"2025-01-08",
      },
      zIndex: 0,
    };
  },
  computed: {},
  created() {},
  watch: {
    rows: {
      handler() {
      },
      deep: true,
    },
  },
  methods: {
    openDialog(params) {
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
    confirm() {
      this.$emit("confirm",this.params);
      this.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>