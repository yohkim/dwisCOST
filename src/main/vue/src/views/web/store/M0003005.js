import { defineStore } from 'pinia';
// import moment from 'moment';

export const useM0003005 = defineStore('m0003005', {
  state: () => ({
    process:null,  //default
    lotNo:'7073F2411-P0469',  //test lot no : 7073F2411-P0469
  }),
  getters: {
    getSearchkInfo:(state) => {
      return {
        process:state.process,
        lotNo:state.lotNo,
      };
    },
  },
  actions: {
    setSearchInfo(obj){
      this.process = obj.process;
      this.lotNo = obj.lotNo;
    },
    clearInfo(){
      this.process = null;
      this.lotNo = null;
    }
  },   
});