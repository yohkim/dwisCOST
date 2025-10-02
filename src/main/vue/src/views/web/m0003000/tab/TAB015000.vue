/**
*	제조 실적 입력 > Lot Run Card 발행 > Lot Card 발행
*/
<template>
  <div>
    <div border class="search_box">
      <b-row class="search_area">
        <b-col cols="1">
          <div class="form-floating">
            <select
              class="form-select label-60"
              id="floatingSelect"
              v-model="selectedModel"
            >
              <option
                v-for="model in modelList"
                :key="model.value"
                :value="model"
              >
                {{ model.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">제품유형</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <select
              class="form-select label-80"
              id="floatingSelect"
              v-model="selectedWorkType"
            >
              <option
                v-for="type in workTypeList"
                :key="type.value"
                :value="type"
              >
                {{ type.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">작업구분</label>
          </div>
        </b-col>
        <b-col cols="1">
          <div class="form-floating lot_run_num" >
            <input
              type="text"
              class="form-control label-60"
              autocomplete="off"
              id="floating"
              v-model="lotNo"
              disabled
              placeholder="LotNo"
            />
            <label for="floating">LotNo</label>
          </div>
        </b-col>
        <b-col cols="3" class="period">
        <div class=" form-floating me-1"> 
          <date-picker label="시작일" v-model="startDate" />
          <label for="floatingPicker">시작일</label>
        </div>
        ~
        <div class=" form-floating ms-1 "> 
          <date-picker label="종료일" v-model="endDate" />
            <label for="floatingPicker">종료일</label>
        </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchLotInfo">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <!-- 조회모드 -->
      <div class="add_lot">
        <!--추가시 display:block-->
        <div class="left_box">
          <div class="title">{{ modeTitle }}</div>
          <div class="ms-auto">
            <b-button @click="addLotInfo" class="sub"> 추가</b-button>
            <b-button @click="createLotInfo" v-show="inputFlag" class="main">생성</b-button>
            <b-button @click="saveLotInfo" class="main"> 저장</b-button>
          </div>
        </div>
        <div class="title">Lot구성&amp;정보</div>
        <RealGrid
          ref="lotInfoInput1Grid"
          :uid="'lotInfoInput1Grid'"
          :rows="inputRows"
          style="width: 100%; height: 73px"
          class="top-border"
        />
        <div class="title">제품,원자재 및 기타정보</div>
        <RealGrid
          ref="lotInfoInput2Grid"
          :uid="'lotInfoInput2Grid'"
          :rows="inputRows"
          style="width: 100%; height: 94px"
          class="top-border"
        />
        </div>
        <div class="lot_detail">
          <div class="d-flex align-item-end mb-1">
            <b-button @click="showPreview" v-show="!inputFlag" class="second">미리보기</b-button>
            <b-button @click="downloadLotCardPDF" v-show="!inputFlag" class="second">PDF 받기</b-button>
            <b-button @click="printLotCardByServer" v-show="!inputFlag" class="main">인쇄</b-button>
            <b-button @click="deleteLotInfo" class="sub">삭제</b-button>
          </div>
          <RealGrid
            ref="lotInfoGrid"
            :uid="'lotInfoGrid'"
            :rows="rows"
            style="width:100%;height: calc(100% - 32px);"
            class="top-border"
          />
        </div>

    </div>
    <CmDialog1 ref="cmDialog1TAB015000" @confirm="handleConfirm" />
    <LotCardPopup ref="lotCardPopup" />
  </div>
</template>

<script>
const URI_PREFIX = "/api/m0003000/m0003007";
import LotCardPopup from "@web/popup/LotCardPopup.vue";
import LotCard from "@web/popup/LotCard.vue";
import html2pdf from "html2pdf.js";
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
export default {
  name: "DW_TAB015000",
  props: {},
  components: { LotCardPopup },
  setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
  },	
  data() {
    return {
      modelList: [], // Example product types
      selectedModel: {value:'A1', text:'0010'}, //'HD', // Currently selected product type
      workTypeList: [], // Example work types
      selectedWorkType: {value:null, text:null}, // Currently selected work type
      startDate: "", // Start date for 수주일자
      endDate: "", // End date for 수주일자
      lotInfoGrid: null,
      lotInfoInput1Grid: null,
      lotInfoInput2Grid: null,
      rows: [],
      inputRows:[],
      searchFlag: false, //조회 했는지 체크
      inputFlag: false, //데이터 추가모드 체크
      inputCreateFlag: false, //데이터 추가모드에서 데이터 생성버튼 눌렀는지 체크
      searchParams: null,
      //input 관련
      lotInfo: {
        poNo:'',
        poDate:'',
        '총수량':null,
        '잔량':null,
        '거래처코드':'',
        '제품코드':'',
        cell:null,
        block:null,
        sheet:null,
        todayInput:null,
        startLabel:'',
        createQty:null,
        '거래처명':'',
        '제품inch':'',
        '제품규격':'',
        '제품모델':'',
        '제품버젼':'',
        '자재코드':'',
        '자재품명':'',
        '자재재질':'',
        '자재두께':'',
        '자재규격':'',
        '자재단위':'',
        '자재거래처명':'',
        '입고일자':null,
        //'입고시각':'00:00:01',
        //'작업일자':null,
        //'작업시각':'00:00:01',
        '발행자':null,
        //'승인자':null,
        '특이사항':null,
      },
    };
  },
  computed: {
    lotInfoGV() {
      return this.$refs.lotInfoGrid.getGridView();
    },
    lotInfoDP() {
      return this.$refs.lotInfoGrid.getGridDataProvider();
    },
    lotNo() {
      if (_.isNil(this.selectedModel)) return "-";
      return `${this.selectedModel.text}F`;
    },
    lotCreateReamin() {
      return (
        this.lotInfo.todayInput - this.lotInfo.cell * this.lotInfo.createQty
      );
    },
    modeTitle(){
      if(this.inputFlag)
        return "Lot 추가"
      else
        return "Lot 조회"
    }
  },
	watch: {
		'selectedModel': {
			handler(newValue, oldValue) {
				this.$nextTick(() => {
					if (newValue) {
						this.selectedModel=newValue;
					}
				});
			},
			immediate: false, // 컴포넌트가 생성될 때 초기 실행 (필요에 따라 삭제 가능)
			deep: true, // 중첩된 객체의 변화를 감지하려면 추가
		},
	  'selectedWorkType': {
			handler(newValue, oldValue) {
				this.$nextTick(() => {
					if (newValue) {
						this.selectedWorkType=newValue;
					}
				});
			},
			immediate: false, // 컴포넌트가 생성될 때 초기 실행 (필요에 따라 삭제 가능)
			deep: true, // 중첩된 객체의 변화를 감지하려면 추가
		},
	},
  created() {
    this.initializeGrid();
  },
  async mounted() {
    this.getSelectOptions();
    this.inputRows=[this.lotInfo];
    this.lotInfo["입고일자"] = this.getCurrentDateTime(0);
    //this.lotInfo["작업일자"] = this.getCurrentDateTime(3);
    this.lotInfo["발행자"] = this.userAuthInfo.userInfo.userName;
    this.setModeChange();
  },
  beforeUnmount() {},
  methods: {
    async getLotStartLabel() {
      if (_.isNil(this.selectedWorkType.text)) {
        this.$toast("info", "작업구분을 선택해주세요.");
        return;
      }
      const workTypeChar = this.selectedWorkType.text.substring(1, 2);
      const selModel = this.selectedModel.text;

      let params = {
        workTypeChar,
        selModel,
      };
      let resp = {};
      let param = {
        menuId: "M0003007",
        queryId: "getLotStartLabel",
        queryParams: params,
        target: resp,
      };

      await this.$axios.api.search(param);
      if (resp != undefined) {
        this.lotInfo.startLabel = resp.lotStartLabel;
        this.setCreateQty();
      } else {
        this.$toast("info", "Lot 시작번호를 찾을 수 없습니다.");
      }
    },
    setCreateQty() {
      if (this.lotInfo.cell == 0) this.lotInfo.createQty = 0;
      else
        this.lotInfo.createQty = Math.floor(
          this.lotInfo.todayInput / this.lotInfo.cell
        );
      this.lotInfo.remainQty=this.lotInfo.todayInput-(this.lotInfo.cell*this.lotInfo.createQty);
    },
    async getSelectOptions() {
	  if (_.isNil(this.selectedModel) || _.isNil(this.selectedWorkType)) {
	    this.$toast("error", "조회조건을 모두 입력해주세요.");
	    return;
	  }	
      let param = [
        {
          menuId: "M0003007",
          queryId: "getModels",
          callback: (data) => {
            this.$utils.transformData(
              data,
              ["value", "text"],
              ["코드", "제품유형"],
              this.modelList
            );
          },
        },
        {
          menuId: "M0003007",
          queryId: "getWorkTypes",
          callback: (data) => {
            this.$utils.transformData(
              data,
              ["value", "text"],
              ["코드", "작업구분"],
              this.workTypeList
            );
          },
        },
      ];
      await this.$axios.api.searchAll(param);
      this.startDate = this.$utils.getCurMonthStartDate();
      this.endDate = this.$utils.getCurMonthEndDate();
    },
    async initializeGrid() {
      this.lotInfoGrid = _.cloneDeep(
        require(`@web/m0003000/js/TAB015000_1.js`)
      );
      this.lotInfoInput1Grid = _.cloneDeep(
        require(`@web/m0003000/js/TAB015000_INPUT1.js`)
      );
      this.lotInfoInput2Grid = _.cloneDeep(
        require(`@web/m0003000/js/TAB015000_INPUT2.js`)
      );
    },
    async searchPoNoInfo() {
      let params = {};
      params = {
        dialogTitle: "제품 찾기",
		popUpSize : 'xl',
        step: 7,
        height: 500,
        width: 1000,
        gridJs: `CP0000000003.js`,
        search: {
          menuId: "CMDIALOG",
          queryId: "selectDwPoNoInfoMast",
          queryParams: { model: this.selectedModel.value },
        },
        showButton: false,
        confirmOnEnter: true,
      };
      this.$refs.cmDialog1TAB015000.openDialog(params);
    },
    async searchWorkerInfo(target) {
      let params = {};
      params = {
        dialogTitle: "작업자 찾기",
		popUpSize : 'sm',
        step: 7,
        height: 580,
        width: 700,
        target,
        gridJs: `CP0000000004.js`,
        search: { menuId: "CMDIALOG", queryId: "selectDwWorkerInfoMast" },
        showButton: false,
        confirmOnEnter: true,
      };
      this.$refs.cmDialog1TAB015000.openDialog(params);
    },
    async searchMatInfo() {
      let params = {};
      params = {
        dialogTitle: "자재 찾기",
        step: 7,
        height: 300,
        width: 700,
        gridJs: `CP0000000005.js`,
        search: { menuId: "CMDIALOG", queryId: "selectDwMatInfoMast" },
        showButton: false,
        confirmOnEnter: true,
      };
      this.$refs.cmDialog1TAB015000.openDialog(params);
    },
    async addLotInfo() {
      if (_.isNil(this.selectedModel) || _.isNil(this.selectedWorkType)) {
        this.$toast("info", "먼저 제품유형과 작업구분을 선택해주세요.");
        return;
      }

      this.inputFlag = true;
      this.inputCreateFlag = false;
      this.setModeChange();
      this.setAllValuesToNull(this.lotInfo);
      //투입시간 설정
      this.lotInfo["입고일자"] = this.getCurrentDateTime(0);
      //this.lotInfo["입고시각"] = this.getCurrentTime();
      //this.lotInfo["작업일자"] = this.getCurrentDateTime(3);
      //this.lotInfo["작업시각"] = this.getCurrentTime();
      this.lotInfo["발행자"] = this.userAuthInfo.userInfo.userName;
    },
    getLotCardParams() {
      let checkRow = this.lotInfoGV.getCheckedRows(true);
      if (checkRow.length > 0) {
        let paramsList = [];
        for(let i = 0; i < checkRow.length; i++){
          let row = this.lotInfoDP.getJsonRow(checkRow[i]);
          let params = {
            model: row["제품모델"],
            inch: row["제품inch"],
            revision: row["제품버젼"],
            fabInDate: row["입고일자"],
            //fabOutDate: row["작업일자"],
            schedulePublisher: row["발행자"],
            //scheduleApprover: row["승인자"],
            lotNumber: `${row["제품모델"]}F`,
            workTypeLabel: `${row["지시일자"].substring(4, 6)}월 ${row["작업구분"]}`,
            rawGlassMaterial: row["자재재질"],
            glassType: row["자재품명"],
            rawGlassSize: row["자재규격"],
            fullLotNumber: `${row.lot}-${row.no}`,
            layers: row["sheet"],
            cells: row["cell"],
            inputCount: row["sheet"], //일단 적층수랑 같아보여서
            printCount: row["출력횟수"],
            remarks:row["특이사항"]
          };
          paramsList.push(params);
        }
        
        return paramsList;
      } else {
        return undefined;
      }
    },
    async searchLotInfo() {
      if(_.isNil(this.selectedModel)||_.isNil(this.selectedWorkType)){
        this.$toast("error", "조회조건을 모두 입력해주세요.");
        return;
      }
      let params = {
        modelCode: this.selectedModel.value,
        workCode: this.selectedWorkType.value,
        startDate: this.startDate,
        endDate: this.endDate,
      };

      this.searchParams = params;
      let param = {
        menuId: "M0003007",
        queryId: "getLotInfo",
        queryParams: params,
        target: this.rows,
      };
      await this.$axios.api.search(param);
      this.searchFlag = true;
      this.inputFlag = false;
      this.setModeChange();
      this.setAllValuesToNull(this.lotInfo);
    },
    async createLotInfo() {
      this.$confirm(
        "확인",
        "생성 후 저장버튼 클릭시 LOT이 생성 됩니다.",
        async (confirm) => {
          this.$refs.lotInfoInput2Grid.getGridView().commit();
          if (confirm) {
            let params = {
              poNo: this.lotInfo.poNo,
              modelLabel: this.selectedModel.text,
              workTypeLabel: this.selectedWorkType.text,
              cell: this.lotInfo.cell,
              sheet: this.lotInfo.sheet,
              block: this.lotInfo.block,
              publisher: this.lotInfo["발행자"],
              //approver: this.lotInfo["승인자"],
              startLabel: this.lotInfo.startLabel,
              createQty: this.lotInfo.createQty,
              remarks: this.lotInfo["특이사항"],
            };
            console.log(params);
            if (this.isObjectEmptyExcept(params)) {
              this.$toast("error", "Lot 추가 정보를 모두 입력해주세요.");
              return;
            }
            
            this.searchParams = params;
            let param = {
              menuId: "M0003007",
              queryId: "getCreatedLotInfo",
              queryParams: params,
              target: this.rows,
            };
            await this.$axios.api.search(param);
            this.inputCreateFlag = true;
          }
        }
      );
    },
    async saveLotInfo() {
      //추가 모드 일 시에
      if (this.inputFlag == true) {
        if (!this.inputCreateFlag) {
          this.$toast("error", "먼저 생성버튼을 눌러주세요");
          return;
        }
        this.$confirm(
          "확인",
          "생성하신 Lot No를 저장 하시겠습니까?",
          async (confirm) => {
            this.lotInfoGV.commit();
            if (confirm) {
              let insertValue = {
                modelLabel: this.selectedModel.text,
                poNo: this.lotInfo.poNo,
                modelCode: this.selectedModel.value,
                workTypeCode: this.selectedWorkType.value,
                customerCode: this.lotInfo["거래처코드"],
                inch: this.lotInfo["제품inch"],
                sheet: this.lotInfo.sheet,
                block: this.lotInfo.block,
                cell: this.lotInfo.cell,
                todayInput: this.lotInfo.todayInput * 1,
                startLabel: this.lotInfo.startLabel,
                createQty: this.lotInfo.createQty * 1,
                prodCode: this.lotInfo["제품코드"],
                matCode: this.lotInfo["자재코드"],
                publisher: this.lotInfo["발행자"],
                //approver: this.lotInfo["승인자"],
                approvalDate: this.lotInfo["입고일자"].substring(0,10).replaceAll("-", ""),
                fabInDate: this.lotInfo["입고일자"].substring(0,10).replaceAll("-", ""),
                fabInTime: this.lotInfo["입고일자"].substring(11,19).replaceAll(":", ""),
                //fabOutDate: this.lotInfo["작업일자"].substring(0,10).replaceAll("-", ""),
                //fabOutTime: this.lotInfo["작업일자"].substring(11,19).replaceAll(":", ""),
                remarks: this.lotInfo["특이사항"],
              };
              console.log(insertValue);
              if (this.isObjectEmptyExcept(insertValue)) {
                this.$toast("error", "Lot 추가 정보를 모두 입력해주세요.");
                this.inputCreateFlag = false;
                return;
              }
              let param = {
                menuId: "M0003007",
                queryId: "saveLotInfo",
                queryParams: insertValue,
              };
              try {
                let resp = await this.$axios.api.search(param);
                if (!_.isNil(resp[0].errormessage)){
                  throw new Error('save fail');
                }
                //특이사항 별도로 업데이트
                let updateRows = this.lotInfoDP.getStateRows("updated");
                if(updateRows.length>0){
                  let updateValue = [];

                  updateRows.forEach((elem) => {
                    let values = this.lotInfoDP.getJsonRow(elem);
                    updateValue.push({
                      lotNo: `${values.lot}-${values.no}`,
                      remarks: values["특이사항"],
                    });
                  });

                  let param2 = {
                    menuId: "M0003007",
                    insert: [{ queryId: "saveRemarks", data: updateValue }],
                  };

                  let resp2 = await this.$axios.api.saveData(param2);
                }
                
                if (!_.isNil(resp[0].message))
                  this.$toast("info", resp[0].message);
                this.searchLotInfo();
              } catch {
                this.$toast("error", "에러발생. 다시 작업해주세요.");
              } finally {
                this.inputCreateFlag = false;
              }
            }
          }
        );
      } else {
        this.$confirm(
          "확인",
          "수정하신 내용을 저장 하시겠습니까?",
          async (confirm) => {
            this.lotInfoGV.commit();
            if (confirm) {
              let rows = this.lotInfoDP.getStateRows("updated");
              console.log(rows);
              let updateValue = [];

              rows.forEach((elem) => {
                let values = this.lotInfoDP.getJsonRow(elem);
                updateValue.push({
                  lotNo: `${values.lot}-${values.no}`,
                  remarks: values["특이사항"],
                });
              });

              let param = {
                menuId: "M0003007",
                insert: [{ queryId: "saveRemarks", data: updateValue }],
              };

              try {
                let resp = await this.$axios.api.saveData(param);
                console.log(resp);
                this.$toast("info", "저장완료");
                this.searchLotInfo();
              } catch {
                this.$toast("info", "에러발생. 다시 작업해주세요.");
              }
            }
          }
        );
      }
    },
    async deleteLotInfo() {
      this.$confirm(
        "확인",
        "선택하신 Lot을 삭제하시겠습니까?",
        async (confirm) => {
          this.lotInfoGV.commit();
          if(confirm) {
            let checkRow = this.lotInfoGV.getCheckedRows(true);
            if(checkRow.length==0){
              this.$toast("info", "선택하신 Lot이 없습니다.");
              return;
            }   
            if(!this.inputFlag){
              let paramsList = [];
              for(let i = 0; i < checkRow.length; i++){
                let row = this.lotInfoDP.getJsonRow(checkRow[i]);
                let params = {
                  menuId:'M0003007',
                  queryId:'deleteLotInfo',
                  queryParams:{lotNumber: `${row.lot}-${row.no}`},
                };
                paramsList.push(params);
              }
              let resp = await this.$axios.api.searchAll(paramsList);
              //const count = errorData.length
              if(resp.length > 0){
                console.log(resp)
                if(resp.length==1)
                  this.$toast('warning', resp[0][0].message);
                else{
                  this.$toast('warning', `${paramsList[0].queryParams.lotNumber} 외 ${paramsList.length-1}건을 삭제했습니다.`);
                }
              }
              //this.$toast('warning', JSON.stringify(resp, null, 2));
              await this.searchLotInfo();
            }else{
              this.lotInfoDP.removeRows(checkRow);
            }
          }
        }
      );
    },
    //입력,추가 전환시 작동하는 함수
    setModeChange() {
      if (this.inputFlag) {
        this.lotInfoGV.columnByName("특이사항").editable = true;
        this.$refs.lotInfoInput1Grid.getGridView().columnByName("todayInput").editable = true;
        this.$refs.lotInfoInput1Grid.getGridView().columnByName("poNo").editable = true;
        this.lotInfoDP.setRows([]);
        this.$refs.lotInfoInput2Grid.getGridView().columnByName("입고일자").editable = true;
        //this.$refs.lotInfoInput2Grid.getGridView().columnByName("작업일자").editable = true;
        this.$refs.lotInfoInput2Grid.getGridView().columnByName("특이사항").editable = true;
        this.$refs.lotInfoInput2Grid.getGridView().columnByName("자재품명").editable = true;
        this.$refs.lotInfoInput2Grid.getGridView().columnByName("발행자").editable = false;
        //this.$refs.lotInfoInput2Grid.getGridView().columnByName("승인자").editable = false;
      } else {
        this.lotInfoGV.columnByName("특이사항").editable = true;
        this.$refs.lotInfoInput1Grid.getGridView().columnByName("todayInput").editable = false;
        this.$refs.lotInfoInput1Grid.getGridView().columnByName("poNo").editable = false;
        this.$refs.lotInfoInput2Grid.getGridView().columnByName("입고일자").editable = false;
        //this.$refs.lotInfoInput2Grid.getGridView().columnByName("작업일자").editable = false;
        this.$refs.lotInfoInput2Grid.getGridView().columnByName("특이사항").editable = false;
        this.$refs.lotInfoInput2Grid.getGridView().columnByName("자재품명").editable = false;
        this.$refs.lotInfoInput2Grid.getGridView().columnByName("발행자").editable = false;
        //this.$refs.lotInfoInput2Grid.getGridView().columnByName("승인자").editable = false;
      }
    },
    async showPreview() {
      if (!this.searchFlag) {
        this.$toast("info", "선택한 Lot이 없습니다.");
        return;
      }
      let lotCardInfo = this.getLotCardParams();
      if (lotCardInfo == undefined) {
        this.$toast("info", "선택한 Lot이 없습니다.");
        return;
      }
      let params = {};
      params = {
        dialogTitle: "제품 찾기",
        step: 7,
        height: 1080,
        width: 1000,
        lotCardInfo:lotCardInfo[0],
      };
      this.$refs.lotCardPopup.openDialog(params);
    },
    //브라우저단에서 모두 처리
    //개수 많아지면 터짐
    async printLotCardByBrowser() {
      if (!this.searchFlag) {
        this.$toast("info", "선택한 Lot이 없습니다.");
        return;
      }
      let lotCardInfos = this.getLotCardParams();
      if (lotCardInfos == undefined) {
        this.$toast("info", "선택한 Lot이 없습니다.");
        return;
      }
      let combinedHTML = ''
      for (let i = 0; i < lotCardInfos.length; i++) {
        const lotCardInfo = lotCardInfos[i]

        // 1) Vue 컴포넌트 SSR → HTML 문자열
        const app = createSSRApp(LotCard, { LOT: lotCardInfo })
        const html = await renderToString(app)

        // 2) 합칠 때 페이지 구분용 태그 추가 (맨 앞은 안 넣어도 되고, 맨 뒤는 넣어도 무방)
        if (i > 0) {
          // "페이지 브레이크" 요소를 넣어 다음 페이지로 넘기도록 CSS 처리
          combinedHTML += '<div style="page-break-before: always;"></div>'
        }

        // 3) 실제 LOTCard HTML 삽입
        combinedHTML += html
      }

      const options = {
        margin: 10,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: {
          mode: ['css', 'legacy'], // or 'avoid-all', etc.
          after: '.page-break',     // '.page-break' 뒤에서 강제 분리
          // before: '.some-selector', // 특정 요소 앞에서 강제 분리
          // avoid: '.some-selector'   // 특정 요소가 걸쳐지지 않도록 회피
        }
      };
      const printContainer = document.createElement('div');
      printContainer.innerHTML = combinedHTML

      html2pdf()
        .set(options)
        .from(printContainer)
        .toPdf()
        .get("pdf")
        .then(function (pdf) {
          const blob = pdf.output("bloburl");
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = blob;
          document.body.appendChild(iframe);

          iframe.onload = () => {
            iframe.contentWindow.print();
            iframe.contentWindow.onafterprint = () => {
              document.body.removeChild(iframe);
              document.body.removeChild(printContainer)
            };
          };
        });
      //document.body.removeChild(printContainer)
    },
    //서버에서 PDF로 변환한뒤 PDF 다운로드
    async downloadLotCardPDF() {
      if (!this.searchFlag) {
        this.$toast("info", "선택한 Lot이 없습니다.");
        return;
      }
      let lotCardInfos = this.getLotCardParams();
      if (lotCardInfos == undefined) {
        this.$toast("info", "선택한 Lot이 없습니다.");
        return;
      }
      let combinedHTML = ''
      for (let i = 0; i < lotCardInfos.length; i++) {
        const lotCardInfo = lotCardInfos[i]

        // 1) Vue 컴포넌트 SSR → HTML 문자열
        const app = createSSRApp(LotCard, { LOT: lotCardInfo })
        const html = await renderToString(app)

        // 2) 합칠 때 페이지 구분용 태그 추가 (맨 앞은 안 넣어도 되고, 맨 뒤는 넣어도 무방)
        if (i > 0) {
          // "페이지 브레이크" 요소를 넣어 다음 페이지로 넘기도록 CSS 처리
          combinedHTML += '<div style="page-break-before: always;"></div>'
        }

        // 3) 실제 LOTCard HTML 삽입
        combinedHTML += html
      }

      //combinedHTML = combinedHTML.replace(/ data-v-[a-f0-9]+(?:="[^"]*")?/gi, '');

      try {
        const res = await this.$axios.post(
          "/api/pdf/convert-pdf",
          { html: combinedHTML },
          { responseType: "blob" }
        )

        if (res.status !== 200) {
          throw new Error("서버 응답이 실패했습니다. status=" + res.status)
        }

        const pdfBlob = new Blob([res.data], { type: "application/pdf" })
        const downloadUrl = URL.createObjectURL(pdfBlob)

        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = "LOTCard.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(downloadUrl)

      } catch (err) {
        console.error(err)
        alert("PDF 변환 중 오류가 발생했습니다.")
      }
    },
    //서버에서 PDF로 변환한뒤 바로 프린트
    async printLotCardByServer() {
      if (!this.searchFlag) {
        this.$toast("info", "선택한 Lot이 없습니다.");
        return;
      }

      let lotCardInfos = this.getLotCardParams();
      if (lotCardInfos == undefined) {
        this.$toast("info", "선택한 Lot이 없습니다.");
        return;
      }

      let combinedHTML = '';
      for (let i = 0; i < lotCardInfos.length; i++) {
        const lotCardInfo = lotCardInfos[i];

        // 1) Vue 컴포넌트 SSR → HTML 문자열
        const app = createSSRApp(LotCard, { LOT: lotCardInfo });
        const html = await renderToString(app);

        if (i > 0) {
          combinedHTML += '<div style="page-break-before: always;"></div>';
        }

        combinedHTML += html;
      }

      try {
        const res = await this.$axios.post(
          "/api/pdf/convert-pdf",
          { html: combinedHTML },
          { responseType: "blob" }
        );

        if (res.status !== 200) {
          throw new Error("서버 응답이 실패했습니다. status=" + res.status);
        }

        // PDF Blob 생성
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // ✅ iframe 방식 제거하고, 새창 오픈
        const newWindow = window.open(pdfUrl, '_blank');

        if (newWindow) {
          setTimeout(async () => {
            newWindow.focus();
            newWindow.print();

            // 인쇄 이력 저장
            let lotList = lotCardInfos.map(elem => ({ lotNo: elem.fullLotNumber }));
            let param = {
              menuId: 'M0003007',
              update: [{ queryId: 'updatePrintCount', data: lotList }]
            };
            await this.$axios.api.saveData(param);

            // 필요시 blob URL 해제
            // URL.revokeObjectURL(pdfUrl);

          }, 1000); // 약간 로딩 대기
        } else {
          alert("팝업 차단 설정을 해제해주세요.");
        }

      } catch (err) {
        console.error(err);
        alert("PDF 변환 중 오류가 발생했습니다.");
      }
    },
    // async printLotCardByServer() {
    //   if (!this.searchFlag) {
    //     this.$toast("info", "선택한 Lot이 없습니다.");
    //     return;
    //   }
    //   let lotCardInfos = this.getLotCardParams();
    //   if (lotCardInfos == undefined) {
    //     this.$toast("info", "선택한 Lot이 없습니다.");
    //     return;
    //   }
    //   let combinedHTML = ''
    //   for (let i = 0; i < lotCardInfos.length; i++) {
    //     const lotCardInfo = lotCardInfos[i]

    //     // 1) Vue 컴포넌트 SSR → HTML 문자열
    //     const app = createSSRApp(LotCard, { LOT: lotCardInfo })
    //     const html = await renderToString(app)

    //     // 2) 합칠 때 페이지 구분용 태그 추가 (맨 앞은 안 넣어도 되고, 맨 뒤는 넣어도 무방)
    //     if (i > 0) {
    //       // "페이지 브레이크" 요소를 넣어 다음 페이지로 넘기도록 CSS 처리
    //       combinedHTML += '<div style="page-break-before: always;"></div>'
    //     }

    //     // 3) 실제 LOTCard HTML 삽입
    //     combinedHTML += html
    //   }

    //   //combinedHTML = combinedHTML.replace(/ data-v-[a-f0-9]+(?:="[^"]*")?/gi, '');

    //   try {
    //     const res = await this.$axios.post(
    //       "/api/pdf/convert-pdf",
    //       { html: combinedHTML },
    //       { responseType: "blob" }
    //     )

    //     if (res.status !== 200) {
    //       throw new Error("서버 응답이 실패했습니다. status=" + res.status)
    //     }
    //     // 1) PDF Blob 생성
    //     const pdfBlob = new Blob([res.data], { type: "application/pdf" })
    //     // 2) Blob URL 만들기
    //     const pdfUrl  = URL.createObjectURL(pdfBlob)

    //     // 3) iframe 생성
    //     const iframe = document.createElement('iframe')
    //     iframe.style.display = 'none'
    //     iframe.sandbox = 'allow-scripts allow-same-origin'; // 샌드박스 정책 완화
    //     iframe.src = pdfUrl
    //     document.body.appendChild(iframe)

    //     // 4) iframe 로드 후 인쇄
    //     iframe.onload = async () => {
    //       // 인쇄 대화상자 호출 (사용자 승인 필요)
    //       iframe.contentWindow.focus()
    //       iframe.contentWindow.print()
          
    //       let lotList = lotCardInfos.map(elem=>({lotNo:elem.fullLotNumber}));
    //       let param = {
    //         menuId:'M0003007',
    //         update:[{queryId:'updatePrintCount',data:lotList}]
    //       }
        
    //       const resp = await this.$axios.api.saveData(param);
    //       // 인쇄 후 iframe 제거
    //       // document.body.removeChild(iframe)
    //       // URL.revokeObjectURL(pdfUrl)
    //     }

    //   } catch (err) {
    //     console.error(err)
    //     alert("PDF 변환 중 오류가 발생했습니다.")
    //   }
    // },

    exportToExcel() {
      // Logic to export the order list to Excel
      console.log("Exporting to Excel...");
    },
    async handleConfirm(params) {
      //console.log(params);
      let checkRow = params.gridView.getCheckedRows(true);
      //console.log(checkRow);
      if (checkRow.length > 0) {
        let row = params.dataProvider.getJsonRow(checkRow[0]);
        //console.log(row);
        //let index = params.dataRow;
        if (params.gridJs == "CP0000000003.js") {
          let param = [
            {
              menuId: "M0003007",
              queryId: "getPoStatus",
              callback: (data) => {
                console.log(data);
                if (data.length > 0) {
                  Object.assign(this.lotInfo, data[0]);
                } else {
                  this.$toast("info", "PO 현황을 불러올 수 없습니다.");
                }
              },
              queryParams: { poNo: row.poNo },
            },
            {
              menuId: "M0003007",
              queryId: "getLotSize",
              callback: (data) => {
                console.log(data);
                if (data.length > 0) {
                  Object.assign(this.lotInfo, data[0]);
                } else {
                  this.$toast("info", "Lot Size를 불러올 수 없습니다.");
                }
              },
              queryParams: { poNo: row.poNo },
            },
            {
              menuId: "M0003007",
              queryId: "getProdStatus",
              callback: (data) => {
                console.log(data);
                if (data.length > 0) {
                  //Object.assign(this.lotInfo, data[0]);
                  this.lotInfo["거래처명"]=data[0]["name"];
                  this.lotInfo["제품inch"]=data[0]["inch"];
                  this.lotInfo["제품모델"]=data[0]["모델"];
                  this.lotInfo["제품버젼"]=data[0]["제품버젼"];
                  this.lotInfo["제품규격"]=data[0]["규격"];
                } else {
                  this.$toast("info", "제품 현황을 불러올 수 없습니다.");
                }
              },
              queryParams: { poNo: row.poNo },
            },
          ];

          let resp = await this.$axios.api.searchAll(param);
          console.log(resp);
        } else if (params.gridJs == "CP0000000004.js") {
          this.lotInfo[params.target] = row["작업자명"];
        } else if (params.gridJs == "CP0000000005.js") {
          this.lotInfo["자재품명"]=row["자재품명"];
          this.lotInfo["자재재질"]=row["자재재질"];
          this.lotInfo["자재두께"]=row["자재두께"];
          this.lotInfo["자재규격"]=row["자재규격"];
          this.lotInfo["자재코드"]=row["자재코드"];
          this.lotInfo["자재단위"]=row["자재단위"];
          this.lotInfo["자재거래처명"]=row["거래처명"];
        }
      }
    },
    //그리드 이벤트 설정
    //셀 클릭시
    onCellClickedLotInfoGrid(grid, clickData) {
      if (this.inputFlag) return;
      if (clickData.cellType === "head" && clickData.subType === "indicator") {
        let itemCount = grid.getItemCount();
        let col = grid.getDisplayColumns();
        let sel = {
          style: "block",
          startItem: 0,
          startColumn: col[0].name,
          endItem: itemCount,
          endColumn: col[col.length - 1].name,
        };
        grid.setSelection(sel);
      }else if(clickData.cellType == "data"){
        const prod = grid.getDataSource();
        let row = prod.getJsonRow(clickData.dataRow);
        Object.assign(this.lotInfo, row);
      }  
    },
    onItemClickedLotInfoGrid(grid, itemIndex, column) {
      // Indicator 헤더 클릭 확인 (column이 null이고 itemIndex가 -1인 경우)
      this.$toast('info','1111111111');
       this.$toast('info', 'column:' + column + ', itemIndex:' + itemIndex);
      if (column === null && itemIndex === -1) {
          // 전체 행 선택
          this.lotInfoGV.selectAll();
          
          // 또는 전체 셀 직접 선택
          // var columns = gridView.getColumnNames();
          // gridView.selectCells({
          //     start: {itemIndex: 0, column: columns[0]},
          //     end: {itemIndex: gridView.getRowCount() - 1, column: columns[columns.length - 1]}
          // });
      }
    },
    onCellClickedLotInfoInput1Grid(grid, clickData) {
      if (!this.inputFlag) return;
      if (clickData.cellType != "data") return;
      if(clickData.fieldName == "poNo"){
        this.searchPoNoInfo();
      }
    },
    onCellClickedLotInfoInput2Grid(grid, clickData) {
      if (!this.inputFlag) return;
      if (clickData.cellType != "data") return;
      if(clickData.fieldName == "자재품명"){
        this.searchMatInfo();
      }
      else if(clickData.fieldName == "발행자"){
        this.searchWorkerInfo("발행자");
      }
      /*else if(clickData.fieldName == "승인자"){
        this.searchWorkerInfo("승인자");
      }*/
    },
    //셀 편집 후
    onEditCommitLotInfoInput1Grid(grid, index, oldValue, newValue) {
      this.lotInfo[index.column]=newValue;
      if(index.column=="todayInput"){
        grid.commit(true);
        this.getLotStartLabel();
      }
    },
    onEditCommitLotInfoInput2Grid(grid, index, oldValue, newValue) {
        this.lotInfo[index.column]=newValue;
    },
    setAllValuesToNull(obj) {
      Object.keys(obj).forEach((key) => {
        obj[key] = null;
      });
    },
    isObjectEmptyExcept(obj, ignoreKey = "remarks") {
      return Object.entries(obj).some(([key, value]) => {
        if (key === ignoreKey) return false; // 무시할 키는 체크하지 않음
        return value === null || value === undefined || value === ""; // 값이 비어있는지 확인
      });
    },
    getCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    },
    getCurrentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;
    },
    getCurrentDateTime(days) {
      const now = new Date();
      const yyyy = now.getFullYear();
      const MM = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
      const dd = String(now.getDate()+days).padStart(2, '0');
      const HH = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');

      return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
    },
    onTodayInput(event) {
      this.lotInfo.todayInput = this.positiveNumberInput(event);
    },
    // 엔터키 입력 시 입력 필드를 벗어나게 함
    onEnter(event) {
      event.target.blur(); // 포커스를 해제하여 blur 이벤트 발생
    },
    positiveNumberInput(event) {
      return event.target.value.replace(/[^0-9]/g, "");
    },
  },
};
</script>

<style scoped>
.page-break {
  page-break-before: always; /* 페이지 나누기 */
  break-before: page;        /* 최신 브라우저용 속성 */
  width: 100%;
  height: 0;
}
</style>
