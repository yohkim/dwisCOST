<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle" modal-class="mboxWaitCellMng" no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
		<div class="search_box mb-1">
      <b-row class="search_area">
        <b-col cols="3">
          <code-select :codeList="processList" :label="'공정'" v-model="params.bareprocess"  @change="stepChange"/>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
              <input type="text" class="form-control label-60 lot_run_num" id="floating" placeholder="" v-model="params.manager">
              <label for="floating">담당자</label>
          </div>
        </b-col>
        <b-col cols="3">
          <code-select :codeList="rwList" :label="'사유'" v-model="params.cause"  @change="rwChange"/>
        </b-col>
      </b-row>
    </div>
    <div class="grid_box">
    <div class="left_box">
      <div class="btn_wrap ms-auto">
        <!--b-col cols="1"-->
                    <div style="width:300px"><span style="font-size: 11px; color: blue;">* 신규추가시 CELL_ID가 수량 갯수로 자동 생성됩니다. </span></div>
         <!--/b-col -->       
        <div class="form-floating">
            <input type="text" class="form-control-sm label-60" id="floating" placeholder="" v-model="params.runNo" @keydown.enter="runNoEnter">
            <label for="floating" class="sm">RunNo</label>
        </div>
        <div class="form-floating ms-2" >
            <input type="number" style="width: 100px;" class="form-control-sm label-60" id="floating" placeholder="" v-model="params.qty">
            <label for="floating"  class="sm">수량</label>
        </div>
        <div class="hr"></div>
        <!-- <input
          type="number"
          class="form-control me-2 text-center"
          style="width: 60px;height:28px"
          v-model.number="newRowCnt"
          :min="1"
        /> -->
        <b-button class="sub" @click="addRowClick">신규추가</b-button>
        <b-button @click="delRowClick" class="ms-2" v-show="delBareCell==true">삭제</b-button>
        <b-button v-if="saveButtonVisible" class="main" @click="saveClick">저장</b-button>
      </div>            
    </div>
      <RealGrid ref="grid" class="grid-border-none" :rows="bareCellRows" style="height: 380px" />
    </div>
    <div class="bttn_wrap">      
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>
// import { RowState } from 'realgrid';
// import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: "MboxWaitCellMngPopup",
  setup() {
		// const userAuthInfo = useUserAuthInfo();
		// return { userAuthInfo};
	},
  props: {},  
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "Bare Cell 관리",
        cause:"", 
        manager:"",
        bareprocess:"",
        runNo:"",
        qty:0,
      },
      zIndex: 0,
      rwList:[],
      bareCellRows:[],     
      grid:null,
      // newRowCnt:1,
      processList:[],
	  saveButtonVisible : false,
    delBareCell : true,
    };
  },
  computed: {},
  created() {
    this.getCodes();
    this.initializeGrid();		
  },
  mounted() {
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
      this.dp().setRows([]);
      this.search();            
    },
    closeDialog() {  
      this.gv().cancel();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    gv(){
			return this.$refs['grid'].getGridView();	
		},
		dp(){
			return this.$refs['grid'].getGridDataProvider();
		},
    async getCodes(){
			await this.$utils.getCommonCodeValueText(['73'],[this.rwList]);	//사유
			
      let param = {menuId:'M0003008',queryId:'selectBareCellProcess',queryParams:null, target: this.processList};
			this.$axios.api.search(param);

      let param1 = {menuId:'M0003008',queryId:'selectBareCellRw',queryParams:null, target: this.rwList};
			this.$axios.api.search(param1);	
		},
    initializeGrid(){
      this.grid = _.cloneDeep(require(`@web/popup/js/BareCellMng.js`));
    },
	  rwChange(){
	  	//this.$toast('info',this.params.cause);
		this.saveButtonVisible = false;   //저장버튼 안보이게 하기
	    this.search();
	  },
	  stepChange(){
	  	//this.$toast('info',this.params.bareprocess);
	    this.search();
	  },
	  search(){      
	    //this.$toast('info',"Search Start ("+this.params.bareprocess+")");
	  	//this.gv().cancel();
       this.gv().commit();
	    let param = {menuId:'M0003008',queryId:'selectFQCWaitCellList',queryParams:this.params, target: this.bareCellRows};
      this.$axios.api.search(param);
      this.saveButtonVisible = false;   //저장버튼 안보이게 하기  
      this.gv().getOptions().checkBar.visible  = true;  //선택 보이게 하기
	  },
    runNoEnter(){
       this.gv().commit();
      if(!this.$utils.validateFields(this.params, ['S:공정:bareprocess','T:담당자:manager','S:사유:cause','T:RunNo:runNo','T:수량:qty'])){
				return;
			}
      let param = {menuId:'M0003008',queryId:'runCheckBareCell',queryParams:this.params};
      this.$axios.api.search(param).then(rslt =>{
      if(rslt[0]['가능수량'] === undefined){
        this.$toast("info",rslt[0]['message']);
        this.dp().clearRows();
        this.saveButtonVisible = false;   //저장버튼 안보이게 하기
        this.search();
      }else{
        this.params.qty = rslt[0]['가능수량'];
        //this.getBareCellList();
      }
        
      });
    },
    addRowClick(){    
      this.gv().commit();
      if(!this.$utils.validateFields(this.params, ['S:공정:bareprocess','T:담당자:manager','S:사유:cause','T:RunNo:runNo','T:수량:qty'])){
				return;
			}
      if(this.params.qty === 0){
        this.$toast("info",'수량이 0 입니다');
        return;
      }
	  this.saveButtonVisible = true;   //저장버튼 보이게 하기
    this.delBareCell = false;
    this.gv().getOptions().checkBar.visible  = true; 
    //this.getBareCellList();
    let param = {menuId:'M0003008',queryId:'runCheckBareCell',queryParams:this.params};
			this.$axios.api.search(param).then(rslt =>{
        if(rslt[0]['가능수량'] === undefined){
          this.$toast("info",rslt[0]['message']);
		      this.saveButtonVisible = false;   //저장버튼 안보이게 하기
          this.dp().clearRows();
          this.params.qty =0;
          this.gv().commit();
        }else if(this.params.qty > rslt[0]['가능수량']){
          this.$toast("info",'추가 가능한 수량(' + rslt[0]['가능수량']+') 보다 추가행수가 큽니다');
          //this.params.qty = rslt[0]['가능수량'];
        }else {          
          this.getBareCellList();
        }
        
      });
    },
    getBareCellList(){
      let param = {menuId:'M0003008',queryId:'selectBareCellList',queryParams:this.params};
      this.$axios.api.search(param).then(rslt =>{
        this.dp().setRows(rslt);
      });
    },

    delRowClick(){
      /*let sr = this.gv().getSelectedItems(true);
      if(_.isEmpty(sr)){
        this.$toast("info",'선택된 정보가 없습니다.');
        return;
      }
      this.dp().removeRow(sr[0]);*/
      //db 삭제여부 확인 필요
	if(!this.saveButtonVisible){
		this.gv().commit();
	  	let checkRow = this.gv().getCheckedRows(true);
	  	if(checkRow.length==0){
	    	this.$toast("info", "선택하신 Bare Cell이 없습니다.");
	    	return;
	 	 } 
	    let cell_list = [];
	    for(let i = 0; i < checkRow.length; i++){
	      let row = this.dp().getJsonRow(checkRow[i]);
	      cell_list.push( `${row.bareCell}`);
	    }
        this.$confirm(
          "확인","선택하신 Bare Cell을 삭제하시겠습니까?",async (confirm) => {
             if(confirm){
                let param = {menuId:'M0003008',queryId:'deleteBareCellList',queryParams:{cellList: cell_list.join(',')}}
                //await this.$axios.api.search(param);
                try {
                      let resp = await this.$axios.api.search(param);
                      if (!_.isNil(resp[0].message))
                        this.$toast("info", resp[0].message);
                      else if (!_.isNil(resp[0].errormessage))
                        this.$toast("error", resp[0].errormessage);
                    } catch {
                      this.$toast("error", "에러발생. 다시 작업해주세요.");
                    } finally {
                      this.search();
                    }
             }      
           });
        }else {
			let sr = this.gv().getSelectedItems(true);
		  	if(_.isEmpty(sr)){
			    this.$toast("info",'선택된 정보가 없습니다.');
			    return;
		 	 }
		  	this.dp().removeRow(sr[0]);
		}
        //this.dp().removeRows(checkRow);
              /*await this.$axios.api.searchAll(paramsList);
              await this.searchLotInfo();
            }else{
              this.lotInfoDP.removeRows(checkRow);
            }*/
          },
    async saveClick(){
      console.log(this.params);
      this.gv().commit();
      let rslt = this.gv().validateCells(null, false);
      this.delBareCell = true;

      if(rslt === null){
        this.$confirmYesOrNo("선택", "저장 하시겠습니까?", (confirmed) => {
          if (confirmed) {
            this.save();
            this.gv().commit();    
            this.search();
            this.params.qty = 0; 
          } 
        });
      }
    },
	async save(){
		let cellIds = this.dp().getDistinctValues('bareCell').join(',');
    //let note = this.dp().getDistinctValues('특이사항').join(',');
	    this.params['cellIds'] = cellIds;
     // this.params['comment'] = '';  // note; 2025-0527
	    let param = {menuId:'M0003008',queryId:'execSaveBareCell',queryParams:this.params, target: null}; //this.bareCellRows
		try {
		  let resp = await this.$axios.api.search(param);
        
        if (!_.isNil(resp[0]?.errormessage)) {
          throw new Error(resp[0].errormessage);
        }

        // 2. 특이사항이 있는 행들만 저장
        const rowCount = this.dp().getRowCount();
        const rowsWithRemark = [];

        for (let i = 0; i < rowCount; i++) {
          const remarkValue = this.dp().getValue(i, "특이사항");
          if (remarkValue?.trim()) {
            rowsWithRemark.push({
              cellId: this.dp().getValue(i, "bareCell"),
              remarks: remarkValue
            });
          }
        }
        if (rowsWithRemark.length > 0) {
          let param2 = {
            menuId: "M0003008",
            insert: [{ queryId: "saveRemarks", data: rowsWithRemark }]
          };
          //this.$toast('info',JSON.stringify(param2,null,2)); return;
          let resp2 = await this.$axios.api.saveData(param2);
          
          if (!_.isNil(resp2[0]?.errormessage)) {
            throw new Error(resp2[0].errormessage);
          }
        }

        if (resp[0]?.message) {
          this.$toast("info", resp[0].message);
        }
		  // if (!_.isNil(resp[0].message))
		  //   this.$toast("info", resp[0].message);
		  // else if (!_.isNil(resp[0].errormessage))
		  //   this.$toast("error", resp[0].errormessage);
		} catch {
		  this.$toast("error", "에러발생. 다시 작업해주세요.");
		} finally {
		  //this.searchRunInfo();
		}
	  },
	},
};
</script>
<style>
.mboxWaitCellMng {
  top: 120px !important; 
}
</style>
