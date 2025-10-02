import { defineStore } from 'pinia';
import moment from 'moment';

export const useM0003008 = defineStore('m0003008', {
  state: () => ({
    model:"",
    worktype:"01",
    rw:"",
    startDate:moment().startOf('month').format('YYYY-MM-DD'),
    endDate:moment().format('YYYY-MM-DD'),
    no:"",
    process:null,  
    runNo:"",  
  }),
  getters: {
    getSearchkInfo:(state) => {
      return {
        model:state.model,
        worktype:state.worktype,
        rw:state.rw,
        startDate:state.startDate,
        endDate:state.endDate,
        no:state.no,
        process:state.process,
        runNo:state.runNo,
      };
    },
  },
  actions: {
    setSearchInfo(obj){
      this.model = obj.model;
      this.worktype = obj.worktype;
      this.rw = obj.rw;
      this.startDate = obj.startDate;
      this.endDate = obj.endDate;
      this.no = obj.no;
      this.process = obj.process;
      this.runNo = obj.runNo;
    },
  },   
});