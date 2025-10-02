<template>
  <div class="form-floating">
    <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select" v-model="selectedIdx" @change="cChange">
      <option v-for="(c, index) in cList" :value="index" :key="index">{{ c.text }}</option>      
    </select>
    <label for="floatingSelect" class="select">{{label}}</label>
    <button v-if="selectedIdx !== '' && !oneRequired" @click="xClick"  class="form-select-clear"/>
  </div>
</template>

<script>
export default {
  emits: ["update:modelValue"], // v-model 사용을 위한 이벤트 정의
  name: "code-select",
  props: {
    code: { type: String, default:''},
    label: { type: String, default:''},
    callbacktype: { type:String, default:"String",validator(value) {
      return ['String', 'Object'].includes(value);
    }},
    modelValue: {type: String,default: ''},
    codeList: {type: Array,default: []},
    oneRequired: {type:Boolean,default: false},
    isCodeText: {type:Boolean,default: false},
  },
  data() {
    return {      
      cList:[],
      selectedIdx:'',
      selectedObj:{},        
      mList:[],
    };
  },
  computed:{
    selectedText(){
      if(this.selectedIdx === ''){
        return '';
      }
      return this.cList[Number(this.selectedIdx)]['text'];
    }
  },
  watch: {    
    codeList: {
      handler(newVal, oldVal) {
        console.log('codeList has changed:', { oldVal, newVal });
        this.initCodeInfo();
      },      
      deep: true
    },
    modelValue(newVal) {
      let len = this.cList.length;
      for(let i = 0; i < len; i++){
        if(this.cList[i].value === newVal){
          this.selectedIdx = i;
          break;
        }
      }
    },
  },
  created(){
  },
  mounted(){  
    this.initCodeInfo();
  },  
  methods: {
    async initCodeInfo(){
      if(!_.isEmpty(this.codeList)){
        this.cList = this.codeList;
      }else{
        if(!_.isEmpty(this.code)){
          if(this.isCodeText){
            await this.$utils.getCommonContentValueText([this.code],[this.cList]);
          }else{
            console.log("check:::",this.code);
            await this.$utils.getCommonCodeValueText([this.code],[this.cList]);
          }
          

        }
      }
      
      if(!_.isEmpty(this.modelValue)){
        this.cList.forEach((el,index) => {
          if(el.value === this.modelValue){
            this.selectedIdx = index;                
          }
        });
      }
    },
    xClick(){
      this.selectedIdx = '';
      this.$emit('update:modelValue', '');
    },
    cChange(){
      let rtn = this.callbacktype === 'String'?this.cList[this.selectedIdx]['value']:this.cList[this.selectedIdx];
      this.$emit('onCodeChange', rtn);
      this.$emit('update:modelValue', this.cList[this.selectedIdx]['value']);
    }
  },

};
</script>
<style lang="scss" scoped>
::v-deep.form-floating{
  .form-select{
      padding: 10px 50px;
      text-overflow: ellipsis;
      white-space: nowrap;
        }
  .form-select-clear{
    border: 0;
    background:transparent url('@assets/images/ico_selec_clear.png')no-repeat;
    position: absolute;
    right: 30px;
    width: 15px;
    height: 15px;
    }

}
</style>