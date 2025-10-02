<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="'불량선택'"
    no-close-on-backdrop    
    :style="{
      zIndex: zIndex      
    }"
    content-class="custom-modal-content-errorSchPopup"
    dialog-class="custom-modal-dialog-errorSchPopup"
    centered
  >
    <div class="mapping_wrap"><!--looping-->
	    <div class="mapping_item" v-for="(item, index) in rows" :key="index">
       <div class="label">{{ item.불량명 }}</div>         
        <b-button class="main" @click="apply(item)">선택</b-button>
      </div>
    </div>
    <div class="bttn_wrap">      
      <b-button block @click="closeDialog">닫기</b-button>
    </div>     
  </b-modal>
</template>

<script>
export default {
  name: "ErrorSchPopup",
  props: {},
  components: {},
  data() {
    return {
      rows: [],
      isOpen: false,
      params: {
      },
      zIndex: 0,
    };
  },
  computed: {
  },
  created() {},
  watch: {},
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.searchClick().then(()=>{
          this.isOpen = true;
        });
      });
    },
    async searchClick() {  
      let result = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch5", queryParams: this.params});
      this.rows = result.filter((item)=> item['사용여부'] == '1')

    },
    closeDialog() {
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },    
    
    apply(item){
      this.$emit("confirm", item);
    }
  },
};
</script>

<style lang="scss" scoped>
:deep.mapping_item {
  flex: 0 0 calc(33.33% - 10px); /* 각 아이템의 크기 고정: 20% */
  max-width: calc(33.33% - 10px); /* 최대 너비도 동일하게 설정 */
  box-sizing: border-box; /* 패딩과 보더 포함 계산 */
  border: 1px dashed #dcdcdc;
  padding: 10px;
  text-align: center;
}
:deep.mapping_wrap{
    display:flex;
    flex-wrap: wrap;
    >div{
      display:flex;
      align-items: center;
      margin: 5px;
      padding:5px;
      border: 1px dashed #dcdcdc;
      width: 270px;
      .label{
        width: 150px;
        display: flex;
        align-items: center;
        &::before{
          content:'●';
          font-size:7px;
          margin-right: 5px;
          color: orangered;
        }
      }
      .input-group{
        width: 120px;
        .btn {
          width: 32px;
          min-width: 32px;
          height: 32px;
          margin: 0!important;
          padding: 0;
        }
      }
    }
}

</style>

<style lang="scss">
.custom-modal-dialog-errorSchPopup {
  max-width: 1000px !important;
  width: 100%;
}
.custom-modal-content-errorSchPopup {
  width: 100%;
}
</style>