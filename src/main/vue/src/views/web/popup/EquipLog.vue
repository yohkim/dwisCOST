<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
    <div label-for="radio-options">
      <b-form-radio-group id="radio-options" v-model="params.peelingDiv" name="radioGroup" :options="peelingDivList" @change="peelingDivChange"></b-form-radio-group>
		</div>
    <div>
      <b-row>
        <b-col v-if="params['process'] !== '023'" cols="3">
          <RealGrid ref="grid2" :uid="'grid2'" :rows="preProcessCstList" style="height: 570px" :fitLayoutWidthEnable="false"/>
        </b-col>
        <b-col>
          <RealGrid ref="grid" :uid="'grid'" :rows="list" style="height: 570px" :fitLayoutWidthEnable="false"/>
        </b-col>
      </b-row>
    </div>
    <div class="bttn_wrap">      
      <b-button class="main" block @click="confirmClick">확인</b-button>
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>


export default {
  name: "EquipLogPopupo",
  setup() {
	},
  emits: ["confirm"],
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "자동박리 Log",
        peelingDiv:'1',
      },
      list:[],
      preProcessCstList:[],
      zIndex: 0,      
      grid:null,
      grid2:null,
      peelingDivList: [
				{ text: '수동', value: '0' },
				{ text: '자동', value: '1' },
			],
      editCstFn:'fCstno', //박리:fCstno,전,후 환적: tCstno
    };
  },
  computed: {},
  created() {    
    // this.initializeGrid();		
  },
  mounted() {
    
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
      this.initializeGrid();
      this.setList();
      this.setAddCstFocus();
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
      this.$refs.grid.destroy();

      if(this.params['process'] === '023'){ //박리
        this.editCstFn = 'fCstno';
        this.grid = _.cloneDeep(require(`@web/popup/js/EquipLog.js`));
      }else{  //전,후 환적
        this.editCstFn = 'tCstno';
        this.grid = _.cloneDeep(require(`@web/popup/js/EquipLog2.js`));
        this.grid2 = _.cloneDeep(require(`@web/popup/js/EquipLog3.js`));
        this.$refs.grid2.created();
        this.getPreProcessCstInfo();
      }
      
      this.$refs.grid.created();

      this.gv().onValidateColumn = this.onValidateColumn;
      this.gv().columnByName(this.editCstFn).styleCallback = this.cellStyleCallback;
    },
    setList(){
      this.list = _.cloneDeep(this.params['result']['list']); //우선 자동으로
      this.params.peelingDiv = "1";
      if(_.isEmpty(this.list)){ //수동
        this.list = this.params['result']['list2'];
        this.params.peelingDiv = "0";
      }
      
    },
    getPreProcessCstInfo(){
      let qp = {};
			qp['runNo'] = this.params.runNo;
			qp['processList'] = this.params['process'] === '037'?['033','035']:['040']; //이전 공정코드 리스트
			let param = { menuId: 'M0003001', queryId: 'selectPreProcessCstInfo', queryParams: qp, target: this.mcList };
			this.$axios.api.search(param);
    },
    peelingDivChange(v){
      if(v === '1'){  //자동박리 선택
        this.list = _.cloneDeep(this.params['result']['list']);        
      }else{  //수동박리 선택
        this.list = _.cloneDeep(this.params['result']['list2']);
      }

      this.setAddCstFocus();
    },
    cellStyleCallback(grid, model){
      if(this.params.peelingDiv === '0'){
        // let checkFn = this.editCstFn === 'fCstno'?'tCstno':'fCstno';
        let checkFn = 'tCstno';
        let v = grid.getValue(model.index.dataRow,checkFn);      
        let rtn = {};
        rtn['editable'] = v === null;
        if(v === null){
          rtn['styleName'] = 'edit';
        }
        return rtn;
      }else if(this.params.peelingDiv === '1' && this.params.process !== '023'){
        let notLogYn = grid.getValue(model.index.dataRow,'notLogYn');
        let rtn = {};
        if(notLogYn === 'Y'){
          rtn['editable'] = true;
          rtn['styleName'] = 'edit';
        }
        return rtn;
      }
		},
    async setAddCstFocus(){
      if(_.isEmpty(this.list)){
        return;
      }

      let firstAddCstRow = -1;
      for(let i = 0; i < this.list.length; i++){
        if(_.isEmpty(this.list[i][this.editCstFn])){
          firstAddCstRow = i;
          break;
        }
      }
      setTimeout(() => {
        this.setCstFocus(firstAddCstRow);
      }, 500);      
      
    },
    setCstFocus(r){
      if(r < 0){
        return;
      }
      this.gv().setCurrent({ dataRow: r, fieldName : this.editCstFn });
      setTimeout(() => {
        this.gv().showEditor();
      }, 100);      
    },

    nextCstFocus(nrow){
      if(nrow < this.list.length){
        // console.log("fCstno value:::",this.gv().getValue(nrow,"fCstno"));
        if(_.isEmpty(this.gv().getValue(nrow,this.editCstFn))){
          this.gv().setCurrent({ dataRow: nrow, fieldName : this.editCstFn });
          setTimeout(() => {
            this.gv().showEditor();
          }, 100);   
        }else{  //값이 있는거 패스
          this.nextCstFocus(nrow + 1);
        }
      }
    },

    async checkCstNo(cstKey, cstNo, row) {
      // console.log("this.params.peelingDiv:::", this.params.peelingDiv);
      if (this.params.peelingDiv === "0") { // 수동
        let qp = {
          runNo: this.params['runNo'],
          cstNo: cstNo,
        };
        let param = { menuId: 'M0003001', queryId: 'checkCstValidation', queryParams: qp };

        try {
          let rslt = await this.$axios.api.search(param); // <-- await 사용
          if (_.isEmpty(rslt)) {
            this.$toast("warn", "확인불가 CST로 진행 할 수 없습니다.");
            return false;
          } else {
            if (rslt[0]['message'] !== 'OK') {
              this.$toast("warn", rslt[0]['message']);
              return false;
            } else {
              let list = this.dp().getJsonRows(0, -1);
              let lotNo = list[row]['lotNo'];
              for (let i = 0; i < list.length; i++) {
                // console.log("row:::", row, i, cstNo, list[i][this.editCstFn]);
                if (i !== row && list[i][this.editCstFn] === cstNo && list[i]['lotNo'] === lotNo) {  // 이미 찍은 lot-카세트
                  return false;
                }
              }
              return true;
            }
          }
        } catch (error) {
          console.error(error);
          this.$toast("error", "서버 통신 오류");
          return false;
        }
      } else {  // 자동
        let list = this.dp().getJsonRows(0, -1);
        let rtn = true;
        for (let i = 0; i < list.length; i++) {
          if (i !== row && list[i][this.editCstFn] === cstNo) {  // 이미 찍은 카세트
            rtn = false;
            break;
          }
        }
        return rtn;
      }
    },

    
    onCellEditedGrid(grid, itemIndex, row, field){    
      grid.commit();  
      //공백제거 추가
      let iv = grid.getValue(row, field);
      iv = iv.replace(/ /g,"");
      grid.setValue(row,field,iv);

      let cstKey = ""+grid.getValue(row,'cstKey');
      if([7,13].indexOf(field) > -1){  //cst_no
        let v = this.$utils.korToEng(grid.getValue(row,this.editCstFn));
        this.checkCstNo(cstKey,v,row).then((b) => {
          // console.log("b::",b,cstKey);
          if(b){
            for(let i = 0; i < this.list.length; i++){
              // console.log("cstkey:::",this.list[i]['cstKey']);
              if(""+this.list[i]['cstKey'] === cstKey){ //fCstno 는 입력 부분이므로 tCstno 없는 로우 값 같은 값으로 변경
                // console.log("check v:::",v,this.editCstFn);
                grid.setValue(i,this.editCstFn,v);
              }
            }
            this.nextCstFocus(row + 1);            
            this.$toast("info",v + " 처리되었습니다.");
          }else{
            grid.setValue(row,this.editCstFn,null);
            this.setCstFocus(row);
          }
        });
      }else if(field === 16){  //자동 - 입고수량
        let v = grid.getValue(row,'t수량');
        let lotNo = grid.getValue(row,'lotNo');
        let cstNo = grid.getValue(row,'fCstno');
        if(v > 30){
          this.$toast("info","30 이상 입력 할 수 없습니다.");
          grid.setValue(row,'t수량',0);          
          return;
        }
        let sumV = 0;
        for(let i = 0; i < this.list.length; i++){
          if(this.list[i]['fCstno'] === cstNo){ 
            sumV += grid.getValue(i,'t수량');
          }
        }
        if(sumV > 30){
          this.$toast("info",cstNo + " 합을 30 이상 입력 할 수 없습니다.");
          grid.setValue(row,'t수량',0);          
          grid.rollback();
          return;
        }
        
        //start - 2025.6.10 CELL 수량도 같이 수정되게 추가가 
        let sumLotNo = 0;
        for(let i = 0; i < this.list.length; i++){
          if(this.list[i]['lotNo'] === lotNo){ 
            sumLotNo += grid.getValue(i,'t수량');
          }
        }

        for(let i = 0; i < this.list.length; i++){
          if(this.list[i]['lotNo'] === lotNo){ 
            grid.setValue(i,'calCell',sumLotNo);
          }
        }
        //end

      }else if(field === 9){  //수동 - 입고수량
        let v = grid.getValue(row,'f수량');
        if(v > 30){
          this.$toast("info","30 이상 입력 할 수 없습니다.")
          grid.rollback();
          return;
        }

        for(let i = 0; i < this.list.length; i++){
          if(this.list[i]['cstKey'] === cstKey){
            grid.setValue(i,'f수량',v);
          }
        }
      }
    },
    onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
			console.log("this.editCstFn:::",this.editCstFn);
      let error = {};
			if (column.fieldName === this.editCstFn) {
				if(value === null || _.isEmpty(value)){					
					error.level = "warning";
					error.message = "CST NO 는 필수 입력입니다.";
					this.$toast("warn",itemIndex + "행 CST NO 는 필수 입력입니다.");
				}
			} 
			return error;
		}, 
    confirmClick(){
      this.gv().commit();
      let rslt = this.gv().validateCells(null, false);
      if(rslt === null){
        this.$confirmYesOrNo("선택", "입력 하시겠습니까?", (confirmed) => {
          if(confirmed){
            this.confirm();
          }
        });
      }
    },
    confirm(){
      this.gv().commit();
      let list = this.dp().getJsonRows(0, -1);
      console.log("this.params.peelingDiv:::",this.params.peelingDiv);
      if(this.params['process'] === '023'){ //박리
        list.forEach(el => {
          el['tCstno'] = el['fCstno'];
          el['f수량'] = el['t수량'];
          el['cellEqQty'] = el['설비cell수량'];

          //수동은 pkey 생성 필요
          if(this.params.peelingDiv === '0'){
            el['pkey'] = el['lotNo'] +'|'+ el['fCstno'] + '|' + el['tCstno'];
            el['tOrg수량'] = el['t수량'];
          }
        });
      }else{  //전,후 환적
        list.forEach(el => {
          // el['fCstno'] = el['tCstno'];
          el['cellEqQty'] = el['t수량'];
          el['t수량'] = el['f수량'];
          el['tOrg수량량'] = el['f수량'];

          //수동은 pkey 생성 필요
          if(this.params.peelingDiv === '0'){
            el['pkey'] =  el['fCstno'] + '|' + el['tCstno'];
            el['tOrg수량'] = el['t수량'];
          }
        });
      }
      
      //T카세트기준 정렬
      // list.sort((a, b) => a.tCstno.localeCompare(b.tCstno));
      // console.log("list:::",list);
      
      this.params.result['list'] = list;
      this.$emit('confirm',this.params);
      this.closeDialog();
    },
  },
};
</script>
