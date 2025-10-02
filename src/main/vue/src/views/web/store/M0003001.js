import { defineStore } from 'pinia';
// import moment from 'moment';

export const useM0003001 = defineStore('m0003001', {
  state: () => ({
    process:null,  //default
    runNo:null,  //test run no : 7073B2411-P0165
  }),
  getters: {
    getSearchkInfo:(state) => {
      return {
        process:state.process,
        runNo:state.runNo,
      };
    },
  },
  actions: {
    setSearchInfo(obj){
      this.process = obj.process;
      this.runNo = obj.runNo;
    },
    clearInfo(){
      this.process = null;
      this.runNo = null;
    }
  },   
});