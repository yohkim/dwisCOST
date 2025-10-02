<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="'일괄진행'" no-close-on-backdrop :style="{  zIndex: zIndex }" 
    content-class="custom-modal-content-multi-proc"
    dialog-class="custom-modal-dialog-multi-proc"
    centered>
    <div class="search_box">
      <b-row class="row search_area">
        <b-col cols="2">
          <div class="form-floating prc_name">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example"
              v-model="params['공정코드']" :disabled="true"
            >
              <option 
                v-for="(item, index) in params.processList" 
                :key="index" 
                :value="item.sysResourceId"
              >
                {{ item.sysResourceName }}
              </option>
            </select>
            <label for="floatingSelect" class="select">공정명</label>
          </div>
        </b-col>
        <div class="col-2" v-if="isChk">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example"
              v-model="params.machineCode" autocomplete="off"
            >
              <option 
                v-for="(item, index) in params.machineCodes" 
                :key="index" 
                :value="item.value"
              >
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">M/C</label>
          </div>
        </div>
        <b-col cols="2">
          <div class="form-floating lot_run_num">
            <input type="text" class="form-control label-60" id="floating" placeholder="LotNo"
              v-model="params1.lotNo"
              @input="convertToUpperEnglish"
              @keydown.enter="handleEnter"
              @change="handleChange"
              name="lotNo"
              data-group="params1"              
              ref="lotNoField"
              autocomplete="off"
            >
            <label for="floating">Lot No</label>
          </div>              
        </b-col>
        <div class="col-2" v-if="isChk && isMachineCode1">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example"
              v-model="params.machineCode1" autocomplete="off" :disabled="true"
            >
              <option 
                v-for="(item, index) in params.machineCodes" 
                :key="index" 
                :value="item.value"
              >
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">M/C</label>
          </div>
        </div>
        <b-col cols="2" v-if="isChk && isMachineCode1">
          <div class="form-floating lot_run_num">
            <input type="text" class="form-control label-60" id="floating" placeholder="LotNo"
              v-model="params1.lotNo1"
              @input="convertToUpperEnglish"
              @keydown.enter="handleEnter1"
              @change="handleChange1"
              name="lotNo1"
              data-group="params1"              
              ref="lotNoField1"
              autocomplete="off"
              :disabled="!isLotNo"
            >
            <label for="floating">Lot No</label>
          </div>              
        </b-col>
        <b-col cols="2" v-if="isLotNoChk">
          <b-form-checkbox    
            v-model="lotNoChk"
          >
            동일 작업
          </b-form-checkbox>
        </b-col>
      </b-row>
    </div>    
    <div class="worker_wrap">
      <div class="title mr-4">작업자 정보</div>
      <div class="row worker_info">
        <div class="col-4">
          <div class="form-floating">
              <input type="text" class="form-control label-60" id="floating"
                v-model="params['작업자']"
                autocomplete="off"
              >
              <label for="floating">작업자</label>
          </div>              
        </div>
        <div class="col-4">
            <div class="form-floating">
              <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example"
                v-model="params.shift" autocomplete="off"
              >
                <option 
                  v-for="(item, index) in params.shifts" 
                  :key="index" 
                  :value="item.value"
                >
                  {{ item.text }}
                </option>
              </select>
              <label for="floatingSelect" class="select">근무조</label>
            </div>
          </div>          
          <div class="col-4" v-if="!isChk">
            <div class="form-floating prc_name">
              <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example"
                v-model="params.machineCode" autocomplete="off"
              >
                <option 
                  v-for="(item, index) in params.machineCodes" 
                  :key="index" 
                  :value="item.value"
                >
                  {{ item.text }}
                </option>
              </select>
              <label for="floatingSelect" class="select">M/C</label>
            </div>
          </div>
      </div>
      <div class="row worker_info ms-2">
          <div class="col-5">
            <DateTimeSpinner ref="dateTime1" @input="dateTimeInput1" label="작업시작"/>  
          </div>
          <div class="col-5">
            <DateTimeSpinner ref="dateTime2" @input="dateTimeInput2" label="작업종료"/>  
          </div>
      </div>
    </div>
    <div class="btn_wrap mt-1 mb-1">
      <b-button-group class="toggle_btn">
        <b-button :class="{'on' : isStartDisabled }" @click="actionClick('start')">작업시작</b-button>
        <b-button :class="{'on' : isEndDisabled }" @click="actionClick('end')">작업종료</b-button>
      </b-button-group>
      <div class="hr"></div>
      <b-button :class="{'main' : isTempDisabled }" @click="actionClick('temp')">임시저장</b-button>
    </div>      
    <div>
      <RealGrid ref="multiProcPopupGrid" :uid="'multiProcPopupGrid'" :rows="rows" :style="`height: 310px`" :fitLayoutWidthEnable="false"/>
    </div>
    <BlockMapping ref="blockMapping" @save="saveCallback1"/>
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>      
    </div>
  </b-modal>  
</template>

<script>

import BlockMapping from "@web/popup/BlockMapping";
import moment from 'moment';

export default {
  name: "multiProcPopup",
  components:{
    BlockMapping
  },
  props: {},
  data() {
    return {
      multiProcPopupGrid: null,
      rows: [],
      isOpen: false,
      items: [],
      lotNoList: [],
      params: {
        lotNo: null,
        isEditabled: true,  
        menu: null,      
        '작업자': null,
        shift: null,
        '작업조': null,
        machineCode: null,
        machineCode1: null,
        '설비명': null,
        '설비명1': null,
        '설비약명': null,
        '설비약명1': null,
        chamber: null,
        chamber1: null,
        processList: [],
        shiftTypes: [],
        shifts: [],
        machineCodes: [],
        itgFlag: false,
      },
      params1: {
        lotNo: null,
        lotNo1: null,
      },
      zIndex: 0,
      preventChangeEvent: false,
      preventChangeEvent1: false,
      lotNoChk: false,
      isValidateCellsMultiProcPopupGrid: false,
      isStartDisabled: false,
      isEndDisabled: false,
      isTempDisabled: false,
      startDay: null,
      startTime: null,
      endDay: null,
      endTime: null,
    };
  },
  computed: {
    isLotNoChk(){
      if(this.params['공정코드'] == '017'){
        return true;
      }/*else
      if(this.params['공정코드'] == '020' && this.params["설비약명"] == 'DUV#1'){
        return true;
      }*/
			return false;
		},
    isChk(){
      if(this.params['공정코드'] == '020'){
        return true;
      }
			return false;
		},
    isMachineCode1(){
      if(this.params['공정코드'] == '020' && this.params["설비약명"] == 'DUV#3'){
        return true;
      }
			return false;
		},
    isLotNo(){
      if(!_.isNil(this.params1['lotNo'])){
        return true;
      }
			return false;
		},
  },
  created() {},
  watch: {
    "params1.lotNo"(newVal, oldVal) {
      this.preventChangeEvent = true;
    },
    "params1.lotNo1"(newVal, oldVal) {
      this.preventChangeEvent1 = true;
    },
    "params.machineCode"(newVal) {
      const index = this.params.machineCodes.findIndex((item) => item.value === newVal);
      if(index > -1){
        if(this.params['공정코드'] == '020'){
          let value = this.params.machineCodes[index]['text'].split(' ')[0];
          let chamber = this.params.machineCodes[index]['chamber'];
          if(value == "DUV#3" && chamber == 'R'){
            const index1 = this.params.machineCodes.findIndex((item) => item['text'].split(' ')[0] == value && item.chamber === 'L');
            this.$nextTick(()=>{
              this.params.machineCode = this.params.machineCodes[index1]['value'];
            });
          }else if(value == "DUV#3" && chamber == 'L'){
            const index2 = this.params.machineCodes.findIndex((item) => item['text'].split(' ')[0] == value && item.chamber === 'R');
            this.params.machineCode1 = this.params.machineCodes[index2]['value'];
          }
        }
        this.params["chamber"] = this.params.machineCodes[index]['chamber'];
        this.params["설비약명"] = this.params.machineCodes[index]['text'].split(' ')[0];
        this.params["설비명"] = this.params.machineCodes[index]['설비명'];
      }

      if(this.params['공정코드'] == '020'){
        if(this.isOpen){
          /*if(this.params["설비약명"] !== 'DUV#1'){*/
            this.lotNoChk = false;
            this.rows = [];
            this.lotNoList = [];
          //}
          this.params1.lotNo = null;
          this.params1.lotNo1 = null;
        }
      }
		},
    "params.machineCode1"(newVal) {
      const index = this.params.machineCodes.findIndex((item) => item.value === newVal);
      if(index > -1){
        this.params["chamber1"] = this.params.machineCodes[index]['chamber'];
        this.params["설비약명1"] = this.params.machineCodes[index]['text'].split(' ')[0];
        this.params["설비명1"] = this.params.machineCodes[index]['설비명'];
      }
		},
    "lotNoChk"(newVal) {
      if(newVal){
        this.searchClick();
      }      
    }
  },
  methods: {
    GV() {
      return this.$refs.multiProcPopupGrid?.getGridView();
    },
    DP() {
      return this.$refs.multiProcPopupGrid?.getGridDataProvider();
    },
    openDialog(params) {
      this.$utils.initializeParamsInPlace(this.params);
      this.$utils.initializeParamsInPlace(this.params1);
      this.items = [];
      this.lotNoList = [];
      this.lotNoChk = false;
      this.startDay = null,
      this.startTime = null,
      this.endDay = null,
      this.endTime = null,
      this.$refs.dateTime1.clearClick();
      this.$refs.dateTime2.clearClick();
      Object.assign(this.params, params);
      this.params1.lotNo = params.lotNo;

      this.$nextTick(() => {     
        if(this.params['공정코드'] == '017'){
          this.multiProcPopupGrid = _.cloneDeep(require(`./js/MultiProcPopup1.js`));
        }else if(this.params['공정코드'] == '020'){
          this.multiProcPopupGrid = _.cloneDeep(require(`./js/MultiProcPopup2.js`));
        }
        this.zIndex = this.$zIndexManager.next();
        this.$refs.multiProcPopupGrid.created(); 
        this.rows = [];
        if(!_.isNil(this.params1.lotNo)){
          this.searchClick();
        }
        this.isOpen = true;     
      });
    },
    closeDialog() {
      this.$refs.multiProcPopupGrid.destroy();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.$emit("closeDialog");
      this.isOpen = false;
    },

    async searchClick() {

      /*let itgChk = this.params1['lotNo'].startsWith('I');
      if(itgChk){
        this.$toast("info", "ITG Lot No를 입력할수 없습니다.");  
        return;
      }*/

      if(this.lotNoChk){
        let result = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch11", queryParams: {...this.params, ...this.params1}});
        if(!_.isEmpty(result) || result.length > 1){
          let lotNoList = result.map(item => item.lotNo);
          let result1 = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch4", queryParams: {...this.params, ...{lotNoList: lotNoList}}});
          this.rows = [];
          this.lotNoList = [];

          result1.forEach(item => {
            this.rows.push(item);
            this.lotNoList.push(item.lotNo);
          });
          return;
        }else{
          this.$toast("info", "동일 작업한 Lot No가 없습니다.");  
          return;
        }
      }

      if(this.params['공정코드'] == '020' && this.params["설비약명"] == 'DUV#3'){
        let result = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch18", queryParams: {...this.params, ...this.params1}});
        if(!_.isEmpty(result) || result.length > 1){
          let lotNoList = result.map(item => item.lotNo);
          if(lotNoList.length > 2){
            this.$toast("info", "동일 설비에서 작업중인 Lot No가 2개이상 있습니다. 확인하세요.");  
            return;
          }
          this.params1.lotNo = result[0]?.lotNo; 
          this.params1.lotNo1 = result[1]?.lotNo; 
          let result1 = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch4", queryParams: {...this.params, ...{lotNoList: lotNoList}}});
          this.rows = [];
          this.lotNoList = [];

          result1.forEach(item => {
            this.rows.push(item);
            this.lotNoList.push(item.lotNo);
          });
          return;
        }
      }
      
      let result = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch1", queryParams: {...this.params, ...this.params1}});
      if(!_.isEmpty(result)){
        if(!this.$utils.isValidProperty(result[0], "전작업종료")){
          this.$toast('info', "Lot No["+result[0]["lotNo"]+"] "+'전공정('+result[0]["전공정"]+') 작업완료 되지 않았습니다.');
          return;
        }
        let chkLotNo = this.rows.some((i) => i.lotNo === result[0].lotNo);
        if(!chkLotNo){

          if(this.params['공정코드'] == '020'){
            if(this.params["설비약명"] !== 'DUV#3'){
              this.rows = [];
              this.lotNoList = [];
            }
            if(this.params["설비약명"] == 'DUV#3' && this.rows.length >= 2){
              this.$toast("info", "Lot No가 이미 2개가존재합니다.<br><span style='color:red'>다른 Lot No로 진행하려면 팝업을 닫고 다시 진행하세요.</span>", {
                dangerouslyHTMLString: true,
              });
              return;
            }
          }
          this.rows.push(result[0]);
          this.lotNoList.push(result[0].lotNo);
        }else{
          this.$toast("info", "동일한 Lot No 있습니다.");  
        }
      }else{
        this.$toast("info", "발행 안된 LOT CARD 입니다.");
        return;
      }
    },

    async searchClick1() {

      if(this.params1.lotNo == this.params1.lotNo1){
        this.$toast("info", "동일한 LOT CARD 입니다.");        
        return;
      }

      let result = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch1", queryParams: {...this.params, ...{lotNo: this.params1["lotNo1"]}}});
      if(!_.isEmpty(result)){
        if(!this.$utils.isValidProperty(result[0], "전작업종료")){
          this.$toast('info', "Lot No["+result[0]["lotNo"]+"] "+'전공정('+result[0]["전공정"]+') 작업완료 되지 않았습니다.');
          return;
        }
        let chkLotNo = this.rows.some((i) => i.lotNo === result[0].lotNo);
        if(!chkLotNo){
          if(this.params["설비약명"] == 'DUV#3' && this.rows.length >= 2){
            this.$toast("info", "Lot No가 이미 2개가존재합니다.<br><span style='color:red'>다른 Lot No로 진행하려면 팝업을 닫고 다시 진행하세요.</span>", {
              dangerouslyHTMLString: true,
            });
            return;
          }
          this.rows.push(result[0]);
          this.lotNoList.push(result[0].lotNo);
        }else{
          this.$toast("info", "동일한 Lot No 있습니다.");  
        }
      }else{
        this.$toast("info", "발행 안된 LOT CARD 입니다.");
        return;
      }
    },

    async actionClick(action) {
      this.GV().commit();
      let rows = this.DP().getJsonRows(0, -1);
      if(_.isEmpty(rows)){
        this.$toast("info", "일괄진행 대상이 없습니다.");
        return;
      }else if(!this.$utils.validateFields({
        "작업자": this.params["작업자"],
        "shift": this.params["shift"],
        "machineCode": this.params["machineCode"]
        }, ['T:작업자:작업자', 'C:근무조:shift', 'C:M/C:machineCode'])){
        return;
      }else{
        if(action == 'start'){
          let startRows = rows.filter((row) => _.isNil(row["작업시작"]));
          if(_.isEmpty(startRows)){
            this.$toast("info", "작업시작을 진행할 대상이 없습니다.");
            return;
          }
          this.saveData(startRows, action);
        }else if(action == 'end'){
          let endRows = rows.filter((row) => !_.isNil(row["작업시작"]) && _.isNil(row["작업종료"]));
          if(_.isEmpty(endRows)){
            this.$toast("info", "작업종료를 진행할 대상이 없습니다.");
            return;
          }
          this.saveData(endRows, action);
        }else if(action == 'temp'){
          let tempRows = rows.filter((row) => !_.isNil(row["작업시작"]) && _.isNil(row["next작업시작"]));
          if(_.isEmpty(tempRows)){
            this.$toast("info", "임시저장을 진행할 대상이 없습니다.");
            return;
          }
          this.saveData(tempRows, action);
        }
      }
    },

    saveCallback1(){
      this.saveDataSearch();
    },

    async saveData(rows, action){

      if(action === 'end' && this.params["공정코드"] == '020' && !_.isEmpty(this.validateCellsMultiProcPopupGrid())){
        this.$toast('info', '필수 입력 항목입니다.');
        return;
      }
      
      if(this.params["공정코드"] == '020' && this.params["설비약명"] == 'DUV#3'){
        if(this.rows[0]["lotNo"] != this.params1.lotNo || this.rows[1]["lotNo"] != this.params1.lotNo1){
          this.$toast('info', "동일하지 않은 Lot No입니다.<br><span style='color:red'>다른 Lot No로 진행하려면 팝업을 닫고 다시 진행하세요.</span>", {
            dangerouslyHTMLString: true,
          });
          return;
        }
      }

      let dateTimeArray = this.$utils.getDateAndTimeArray1();
      if(action === 'end'){
        rows.map((row, index) => {
          const startTime = row["작업시작"] +""+ row["시작시각"];
          const endTime   = (this.endDay ? this.endDay : dateTimeArray[0])+""+(this.endTime ? this.endTime : dateTimeArray[1]);

          if (Number(startTime) > Number(endTime)) {
            throw new Error(`작업종료가 작업시작 이전일수 없습니다.`);
          }
        });
      }
      let saveFunc = async () => {
        let updatedRows = rows.map((row, index) => {
          const sequence = String(index + 1).padStart(2, '0');
          const startTime = (this.startTime ? this.startTime : dateTimeArray[1]).slice(0, -2);
          const customStartTime = startTime + sequence;
          return {
            ...row,
            ...this.params,
            lotNo: row['lotNo'],
            '공정비고': row['공정비고'],
            '특이사항': row['특이사항'],
            '시작온도': row['시작온도'],
            '종료온도': row['종료온도'],
            '전면광량': row['전면광량'],
            '후면광량': row['후면광량'],
            ...(this.params["공정코드"] == '020' && this.params["설비약명"] == 'DUV#3' ? {
              machineCode: (index == 0 ? this.params["machineCode"] : this.params["machineCode1"])
            } : {}),
            ...(action === 'temp'
              ? {}
              : action === 'start'
              ? { '작업시작': (this.startDay ? this.startDay : dateTimeArray[0]), '시작시각': customStartTime }
              : { '작업종료': (this.endDay ? this.endDay : dateTimeArray[0]), '종료시각': (this.endTime ? this.endTime : dateTimeArray[1]) }
            ),
          };
        });
        let params = {
          "menuId": 'M0003005',
          "update": [
            ((this.params['공정코드'] == '010' || this.params['공정코드'] == '020') ? { queryId: 'M0003005_TempMst', 
              data: updatedRows.map(row => ({
                ...row,
                code: this.params['공정코드']
              }))
            } : {}),
            ((
              action === 'temp' ? { queryId: 'M0003005_TempVlr', data: updatedRows } 
              : (
                action === 'start' ? { queryId: 'M0003005_Start', data: updatedRows.map(row => ({
                  ...row,
                  code: this.params['공정코드']
                })) } 
                : { queryId: 'M0003005_End', data: updatedRows.map(row => ({
                  ...row,
                  code: this.params['공정코드']
                })) }
              )
            )),
            (
              (action === 'start' || action === 'end') ? { queryId: 'M0003005_TempVlr', data: updatedRows } : {}
            )
          ],
        };
        const resp = await this.$axios.api.saveData(params);
        if (resp.status === 'success') {
          this.$toast('success', (action === 'temp' ? '임시저장 되었습니다.' : (action === 'start' ? '작업시작 되었습니다.' : '작업종료 되었습니다.')));
          this.saveDataSearch();
        } else {
          this.$toast('error', resp.message);
        }
      }

      this.$confirm("확인", (action === 'temp' ? '임시저장 하시겠습니까?' : (action === 'start' ? '작업시작 하시겠습니까?' : '작업종료 하시겠습니까?')), (confirm)=>{
				if(confirm){
					saveFunc();
				}
      });
    },

    saveDataSearch(){
      this.$nextTick(async()=>{
        let result = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch7", queryParams: {...this.params, items: this.lotNoList }});
        this.rows = _.cloneDeep(result);
      });
    },

    convertToUpperEnglish(event) {
      const group = event.target.dataset.group;
      const fieldName = event.target.name;
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value);
      }
    },

    handleEnter(event) {
      event.preventDefault();
      this.$refs.lotNoField.focus();
      this.$refs.lotNoField.select();
      this.searchClick();
    },

    handleChange() {
      if (this.preventChangeEvent) {
        this.preventChangeEvent = false;
        return;
      }
      this.searchClick();
    },

    handleEnter1(event) {
      event.preventDefault();
      this.$refs.lotNoField1.focus();
      this.$refs.lotNoField1.select();
      this.searchClick1();
    },

    handleChange1() {
      if (this.preventChangeEvent1) {
        this.preventChangeEvent1 = false;
        return;
      }
      this.searchClick1();
    },

    validateCellsMultiProcPopupGrid(){
      this.isValidateCellsMultiProcPopupGrid = true;
      let error = this.GV().validateCells(null, false);
      this.isValidateCellsMultiProcPopupGrid = false;
      return error;
    },

    dateTimeInput1(fullDateTime) {
      if (moment(fullDateTime, 'YYYYMMDD HHmmss', true).isValid()) {
        this.startDay = fullDateTime.split(" ")[0];
        this.startTime = fullDateTime.split(" ")[1];
      }else{
        this.startDay = null;
        this.startTime = null;
      }
    },

    dateTimeInput2(fullDateTime) {
      if (moment(fullDateTime, 'YYYYMMDD HHmmss', true).isValid()) {
        this.endDay = fullDateTime.split(" ")[0];
        this.endTime = fullDateTime.split(" ")[1];
      }else{
        this.endDay = null;
        this.endTime = null;
      }
    },

    
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackMultiProcPopupGrid(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      const ds = grid.getDataSource();
      const jsonData = ds.getJsonRow(cell.index.itemIndex);
      if(fieldName == '특이사항' || fieldName == '공정비고' 
        || fieldName == '시작온도' || fieldName == '종료온도' || fieldName == '전면광량' || fieldName == '후면광량'){
        if(_.isNil(jsonData["next작업시작"])){
          rtn.editable = true;
          rtn.styleName = "tl edit";
        }else{
          rtn.editable = false;
          rtn.styleName = "tl";
        }        
      }
      return rtn
    },

    onCellClickedMultiProcPopupGrid(grid, clickData) {
      if(clickData.cellType !== "data") return;

      const ds = grid.getDataSource();
      const current = grid.getCurrent();
      const jsonData = ds.getJsonRow(current.itemIndex);
      if(clickData.fieldName == '불량입력'){
        this.$refs.blockMapping.openDialog({
          ...jsonData,
          isEditabled: !_.isNil(jsonData["작업시작"]) && _.isNil(jsonData["next작업시작"]),
          itgFlag: false,
        });
      }
    },

    onValidateColumnMultiProcPopupGrid(grid, column, inserting, value, itemIndex, dataRow) {
      let error = {};
      if(!this.isValidateCellsMultiProcPopupGrid) return error;

      if(this.$utils.containsValue(["시작온도","종료온도","전면광량","후면광량"], column.fieldName)){
        if(_.isNil(value)){
          error.level = "error";
          error.message = "필수 입력입니다.";
        }        
      }
      return error;
    },

    /*onDataLoadComplatedMultiProcPopupGrid(grid){
		}*/

    onRowCountChangedMultiProcPopupGrid(provider, newCount) {
      let rows = this.DP().getJsonRows(0, -1);
      let startRows = rows.filter((row) => _.isNil(row["작업시작"]));
      if(_.isEmpty(startRows)){
        this.isStartDisabled = false;
      }else{
        this.isStartDisabled = true;
      }
      let endRows = rows.filter((row) => !_.isNil(row["작업시작"]) && _.isNil(row["작업종료"]));
      if(_.isEmpty(endRows)){
        this.isEndDisabled = false;
      }else{
        this.isEndDisabled = true;
      }

      let tempRows = rows.filter((row) => !_.isNil(row["작업시작"]) && _.isNil(row["next작업시작"]));
      if(_.isEmpty(tempRows)){
        this.isTempDisabled = false;
      }else{
        this.isTempDisabled = true;
      }
		},
  },
};
</script>

<style lang="scss">
.custom-modal-dialog-multi-proc {
  max-width: 1550px !important;  
  width: 100%;
  max-height: 80vh;
  height: 600px;
}
.custom-modal-content-multi-proc {
  width: 100%;
  height: 600px;
  max-height: 80vh;
}

</style>
<style scoped>
:deep.worker_info {
    display: flex;
    align-items: center;
    width: calc(50% - 50px);
}
</style>