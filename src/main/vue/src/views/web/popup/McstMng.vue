<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle" dialog-class="custom-dialog" no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
		
    <div class="search_box mb-1">
      <b-row class="row search_area">
        <b-col cols="3">
          <div class="form-floating">
              <input type="text" class="form-control label-80" id="floating" placeholder="" v-model="params.manager">
              <label for="floating">담당자</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
              <input type="text" class="form-control label-60 lot_run_num" id="floating" placeholder="" v-model="params.approver">
              <label for="floating">승인자</label>
          </div>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
              <input type="text" class="form-control label-80" id="floating" placeholder="" v-model="params.mboxNo" readonly>
              <label for="floating">M-BOX NO</label>
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
      <RealGrid ref="grid" :uid="'grid'" class="grid-border-none" :rows="mboxCellRows" style="height: 380px" />
    </div>
    <div class="bttn_wrap">      
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
    <!-- <MboxQtyMod ref="mqmPopup" /> -->
  </b-modal>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: "ToolPopup",
  setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo};
	},
  props: {},
  components: {
		// MboxQtyMod
	},
  data() {
    return {
      infoValue: '', // 초기 값 설정
      isOpen: false,
      params: {
        dialogTitle: "M-CST 관리",
        selectedRw:"", 
        mboxNo:"",
        manager:"",
        approver:"",      
      },

      zIndex: 0,
      rwList:[],
      mboxCellRows:[],     
      grid:null,
      newRowCnt:1,
      isNewMode:false,
      maxMboxNo:'',
      addButtonVisible: true, 
      delButtonVisible: true, 
      insButtonVisible: true, 
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
      this.getMboxNo();
      this.getAgbList();
    },

    async getMboxNo(){
      let param = {menuId:'M0003008',queryId:'selecNewMboxNo',queryParams:this.params, target: null};
			let rslt = await this.$axios.api.search(param);	   
     
      this.params.mboxNo = rslt[0];
    },
    async getAgbList(){
      let param = {menuId:'M0003008',queryId:'selectAgbList',queryParams:null, target: null};
			let rslt = await this.$axios.api.search(param);	

      this.gv().columnByField("agb").values = rslt;
      this.gv().columnByField("agb").labels = rslt;
    },

    closeDialog(result) {
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
      this.grid = _.cloneDeep(require(`@web/popup/js/McstMng.js`));
    },
    
    addRowClick(){  
      let row = {};
      row['mboxNo'] = this.params['mboxNo'];
      row['manager'] = this.params['manager'];
      row['approver'] = this.params['approver'];
      row['scrapCode'] = this.params['selectedRw'];

      this.gv().commit();

      let sl = this.gv().getSelectedRows();
      let insertIdx = _.isEmpty(sl)?0:sl.at(-1) + 1;

      for(let i = 0; i < this.newRowCnt; i++){
        this.dp().insertRows(insertIdx,[{}]);
      }
      //this.dp().addRow(row);
    },
    async delRowClick(){
      let crs = this.gv().getCheckedRows();
      console.log("crs:::",crs);
      if(_.isEmpty(crs)){
        this.$toast("info",'선택된 정보가 없습니다.');
        return;
      }
      
      this.$confirmYesOrNo("선택", "삭제 하시겠습니까?", (confirmed) => {
        if (confirmed) {
          this.dp().removeRows(crs);
        } 
      });
    },
    
    async saveClick(){
      this.gv().commit();
      
      let insertRows = this.$refs.grid.getSaveData().insert;
      if(_.isEmpty(insertRows)){
        this.$toast("info","신규 추가된 데이타가 없습니다.");
        return;
      }

      if(!this.$utils.validateFields(this.params, ['T:담당자자:manager','T:승인자:approver'])){
				return;
			}

      let rslt = this.gv().validateCells(null, false);
      
      if(rslt === null){
        this.$confirmYesOrNo("선택", "저장 하시겠습니까?", (confirmed) => {
          if (confirmed) {
            insertRows.forEach(el => {
              el['mboxNo'] = this.params['mboxNo'];
              el['manager'] = this.params['manager'];
              el['approver'] = this.params['approver'];
              el['scrapCode'] = this.params['selectedRw'];
            });
            this.save(insertRows);
          } 
        });
      }

    },
    async save(insertRows){    
      // console.log("insertRows:::",insertRows);
      let param = {
        menuId:'M0003008',
        insert: [{queryId:'insertMcstMrunbox', data:insertRows}],
      };
     
      let resp = await this.$axios.api.saveData(param);
      console.log(resp);
      if('success' === resp.status){
        this.$toast('info',"저장되었습니다.");


        let list = this.dp().getJsonRows(0, -1);
        list.forEach((el,index) => {
          this.dp().setRowState(index,"none");
        });
      }
    },
    
    onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
			let error = {};
			if (column.fieldName === "runNo") {
				if(_.isEmpty(value)){					
					error.level = "warning";
					error.message = "RUN NO 는 필수 입력입니다.";
					this.$toast("warn",itemIndex+1 + "행 RUN NO 는 필수 입력입니다.");
				}
			}else if (column.fieldName === "cstNo") {
				if(_.isEmpty(value)){					
					error.level = "warning";
					error.message = "CST NO 는 필수 입력입니다.";
					this.$toast("warn",itemIndex+1 + "행 CST NO 는 필수 입력입니다.");
				}
			}else if (column.fieldName === "cstNo") {
				if(_.isEmpty(value)){					
					error.level = "warning";
					error.message = "CELL 은 필수 입력입니다.";
					this.$toast("warn",itemIndex+1 + "행 CELL 은 필수 입력입니다.");
				}
			}else if (column.fieldName === "agb") {
				if(_.isEmpty(value)){					
					error.level = "warning";
					error.message = "AGB 는 필수 입력입니다.";
					this.$toast("warn",itemIndex+1 + "행 AGB 는 필수 입력입니다.");
				}
			} 
			return error;
		},
  },
};
</script>
<style>
.custom-dialog {
  max-width: 1500px;
}
</style>