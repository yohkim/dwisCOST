<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="'제품코드 채번'"
    no-close-on-backdrop    
    :style="{
      zIndex: zIndex      
    }"
    centered
  >
    <div><!--looping-->
      <b-row>
        <b-col cols="2">
          제품구분
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <select
              class="form-select label-60"
              id="floatingSelect"
              v-model="params.prodGubun"
            >
              <option
                v-for="prodGubun in prodGubunList"
                :key="prodGubun.value"
                :value="prodGubun.value"
              >
                {{ prodGubun.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">제품구분</label>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          제작 Site
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <select
              class="form-select label-60"
              id="floatingSelect"
              v-model="params.site"
            >
              <option
                v-for="site in siteList"
                :key="site.value"
                :value="site.value"
              >
                {{ site.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">제작 Site</label>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          공법
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <select
              class="form-select label-60"
              id="floatingSelect"
              v-model="params.process"
            >
              <option
                v-for="process in processList"
                :key="process.value"
                :value="process.value"
              >
                {{ process.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">공법</label>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          Size
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <select
              class="form-select label-60"
              id="floatingSelect"
              v-model="params.size"
            >
              <option
                v-for="size in sizeList"
                :key="size.value"
                :value="size.value"
              >
                {{ size.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">Size</label>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          연번
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <input
              autocomplete="off"
              type="text"
              maxlength="2"
              class="form-control"
              id="floating"
              @input="checkNumber"
              placeholder="00 ~ 99"
              v-model="params['prodNo']"
              />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          Rev.No
        </b-col>
        <b-col cols="8">
          <div class="form-floating">
            <input
              autocomplete="off"
              type="text"
              maxlength="2"
              class="form-control"
              id="floating"
              @input="checkNumber"
              placeholder="00 ~ 99"
              v-model="params['revNo']"
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
</template>

<script>

export default {
  name: "ProdDevLogPopup",
  props: {},
  data() {
    return {
      rows: [],
      isOpen: false,
      prodGubunList:[
      ],
      siteList:[
      ],
      processList:[
      ],
      sizeList:[],
      params: {
        dataRow:-1,
        prodGubun:'',
        site:'',
        process:'',
        size:'',
        prodNo:'',
        revNo:''
      },
      zIndex: 0,
    };
  },
  computed: {
    prodCode(){
      return `${this.params.prodGubun}${this.params.site}${this.params.process}${this.params.size}${this.params.prodNo}${this.params.revNo}`
    }
  },
  async created() {
    /*
    const sizeList = [];

    for (let i = 1; i <= 35; i++) {
      // i가 1~9이면 숫자 그대로,
      // 10 이상이면 A~Z를 ASCII 코드로 변환
      const value = i < 10
        ? String(i)
        : String.fromCharCode(55 + i); 
        // 10일 때 65('A'), 35일 때 90('Z')가 됩니다.

      sizeList.push({
        text: `${i}"`,  // 예: 1 -> '1"', 10 -> '10"' ...
        value: value    // 예: 1 -> '1', 10 -> 'A', 35 -> 'Z' ...
      });
    }

    this.sizeList = sizeList;*/
    	let searchParam = [
				{ menuId:'M0006010', queryId:'getCodeList1', target:this.prodGubunList },
        { menuId:'M0006010', queryId:'getCodeList2', target:this.siteList },
        { menuId:'M0006010', queryId:'getCodeList3', target:this.processList },
        { menuId:'M0006010', queryId:'getCodeList4', target:this.sizeList }
      ];

			let resp = await this.$axios.api.searchAll(searchParam);
  },
  watch: {
    rows: {
      handler() {
      },
      deep: true,
    },
  },
  methods: {
    checkNumber(el) {
      // 1) 숫자가 아닌 문자는 모두 제거
      el.target.value = el.target.value.replace(/[^0-9]/g, '');

      // 2) 길이가 2자리를 초과하면 잘라냄
      if (el.target.value.length > 2) {
        el.target.value = el.target.value.slice(0, 2);
      }
      // => 이 상태로는 "0", "00", "01", "99" 모두 입력 가능.
    },
    openDialog(params) {
      this.params = {
        dataRow:-1,
        prodGubun:'',
        site:'',
        process:'',
        size:'',
        prodNo:'',
        revNo:''
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
      let params={
        dataRow:this.params.dataRow,
        prodCode:this.prodCode
      }

      let param = {
        menuId: "M0006010",
        queryId: "checkProdCode",
        queryParams: {'제품코드':this.prodCode},
      };
      let resp = await this.$axios.api.search(param);

      console.log(resp);
      if(resp[0].count==0){
        this.$emit("confirm",params);
        this.closeDialog();
      }
      else{
        this.$toast("info", "이미 존재하는 제품코드 입니다.");
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>