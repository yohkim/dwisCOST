import { defineStore } from 'pinia';
// import moment from 'moment';

export const useM0003002 = defineStore('m0003002', {
  state: () => ({
    process:null,  //default
    runNo:'810PB2410-P0002',  //test run no : 810PB2410-P0002
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