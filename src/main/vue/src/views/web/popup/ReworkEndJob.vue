<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
		<div class="search_box mb-1">
      <b-row class="row search_area">
        <b-col cols="3">
          <div class="form-floating">
              <input type="text" class="form-control label-60 lot_run_num" id="floating" placeholder="" v-model="params.shift" readonly>
              <label for="floating">Shift</label>
          </div>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
              <input type="text" class="form-control label-60 lot_run_num" id="floating" placeholder="" v-model="params.worker" readonly>
              <label for="floating">작업자</label>
          </div>
        </b-col>
      </b-row>
    </div>
      <div class="grid_box">
        <div class="left_box">
          <div class="btn_wrap ms-auto">      
            <input
              type="number"
              class="form-control mx-2 text-center"
              style="width: 60px;height:28px"
              v-model.number="newRowCnt"
              :min="1"
            />
            <b-button class="sub" @click="addRowClick">행추가</b-button>
            <b-button @click="delRowClick" class="ms-2">삭제</b-button>
            <b-button class="main" @click="saveClick">저장</b-button>
          </div>            
        </div>
      <RealGrid ref="grid" :uid="'grid'" class="grid-border-none" :rows="params.mboxRows" style="height: 500px" />
    </div>
    <div class="bttn_wrap">      
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>
import moment from 'moment';

const URI_PREFIX = '/api/m0003000/m0003008';
export default {
  name: "ReworkEndJob",
  setup() {
		return {};
	},
  emits: ["endJobComplete"],
  props: {},
  components: {
		// MboxQtyMod
	},
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "작업종료",
        shift:"", 
        worker:"",
        mc:"",
      },
      zIndex: 0,
      mcList:[],
      grid:null,
      newRowCnt:1,
    };
  },
  computed: {},
  created() {
    this.initializeGrid();		
  },
  mounted() {    
    this.gv().onValidateColumn = this.onValidateColumn;
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
      this.dp().setRows([]);
      // this.searchCdt();            
    },
    closeDialog() {
      this.gv().cancel();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    
    gv(){
			return this.$refs[['grid']].getGridView();	
		},
		dp(){
			return this.$refs['grid'].getGridDataProvider();
		},
    initializeGrid(){
      this.grid = _.cloneDeep(require(`@web/m0003000/js/TAB048000_3.js`));
    },
    async saveClick(){
      let rslt = this.gv().validateCells(null, false);
      if(rslt === null){
        this.$confirmYesOrNo("선택", "저장 하시겠습니까?", (confirmed) => {
          if (confirmed) {
            this.save();
          } 
        });
      }
    },
    async save(){   
      let saveData = this.$refs.grid.getSaveData();
      let insert = saveData.insert;
      let badList = [];
			let cstList = [];

      let cellSum = this.getCellSum();
			let badCntSum = this.dp().getFieldValues('불량합계', 0, -1).reduce((acc, curr) => acc + Number(curr), 0);;
      let endDate = moment().format('YYYYMMDD');
	    let endTime = moment().format('HHmmss');
      insert.forEach((el,index) => {
				Object.keys(this.grid.badColumns).forEach(badNm => {
					let obj = {};
          
          obj['runNo'] = this.params.runNo;					  
          obj['process'] = '022';
					obj['tCstno'] = el['cstNo'];
					obj['fCstno'] = el['cstNo'];
					obj['badNm'] = this.grid.badColumns[badNm];					
					obj['badCnt'] = el[badNm]||0;					
					obj['machineCode'] = this.params['mc'];
					badList.push(obj);
				});
        
        el['runNo'] = this.params.runNo;					
        el['process'] = '022';
        el['seq'] = (index + 1).toString().padStart(2, '0');
        el['lotNo'] = '';
        el['bef공정코드'] = '-';
        el['nxt공정코드'] = '059';
        el['박리작업구분'] = 0;
        el['작업자'] = this.params['worker'];
        el['작업조'] = '';
        el['작업시작'] = this.params['작업시작'].replace(/-/g, "");
        el['시작시각'] = this.params['시작시각'].replace(/[\s:]/g, "");
        el['shift'] = this.params['shift'];
        el['fCstno'] = '';
        el['f수량'] = el['수량'];
        el['f불량수량'] = el['불량합계'];
        el['작업종료'] = endDate;
        el['종료시각'] = endTime;
        el['투입수량'] = el['수량'];
        el['machineCode'] = this.params['mc'];
        el['inCstno'] = 'IN_CSTNO';
        el['tCstno'] = el['cstNo'];
        el['t수량'] = el['수량'];

				el['worker'] = this.worker;
				el['shift'] = this.selectedShift;
				el['workCrew'] = this.selectedWorkCrew;
				el['machineCode'] = this.selectedMc;			

				cstList.push(el);
			});

      let params = {};
      params['runNo'] = this.params.runNo;
      params['process'] = '022';
      params['badList'] = badList;
			params['cstList'] = cstList;
      params['불량수량'] = badCntSum;
	    params['양품수량'] = cellSum;
      params['작업종료'] = endDate.replace(/-/g, "");
      params['종료시각'] = endTime.replace(/[\s:]/g, "");

      let resp = await this.$axios.post(URI_PREFIX+"/endjob",params);	

			if(resp.data === "ok"){
				this.$toast('success','작업종료 처리되었습니다.');
        this.$emit("endJobComplete");
        this.closeDialog();
			}else{
				this.$toast('error','작업종료 실패하였습니다.');
			}

    },
    getCellSum(){
			let sumCstNoList = [];
			let s = 0;
			let rds = this.dp().getJsonRows();
			rds.forEach(el => {
				if(sumCstNoList.indexOf(el['cstNo']) === -1){
					s += el['수량'];
					sumCstNoList.push(el['cstNo']);
				}
			});
			return s;
		},
    addRowClick(){
      this.gv().commit();
      this.dp().setRows([]);
      for(let i = 0; i < this.newRowCnt; i++){
        this.dp().addRow({'startTime':this.params['시작시각']});
      }
    },
    delRowClick(){
      this.gv().commit();
      let sl = this.gv().getSelectedRows();
      if(_.isEmpty(sl)){
        this.$toast("info","선택된 항목이 없습니다.");
        return;
      }
      
      this.dp().removeRows(sl);      
    },
    onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
			let error = {};
			if (column.fieldName === "cstNo") {
				if(value === null || _.isEmpty(value)){					
					error.level = "warning";
					error.message = "CST NO 는 필수 입력입니다.";
					this.$toast("warn",itemIndex + "행 CST NO 는 필수 입력입니다.");
				}
			} 
			return error;
		},
    onCellEditedGrid(grid, itemIndex, row, field) {
      grid.commit();
    }
  },
};
</script>
