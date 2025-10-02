`/*
* 기준정보 > 제품수주서 입력
*/
<template>
  <div>
    <div border class="search_box">
      <b-row class="search_area">
        <!-- 제품유형 제목과 드랍다운 -->
        <b-col cols="1" class="align-center">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" v-model="selectedModel">
              <option v-for="model in modelList" :key="model.value" :value="model" >{{ model.text }}</option>
            </select>
            <label for="floatingSelect" class="select">제품유형</label>
          </div>
        </b-col>
        <!-- 작업구분 제목과 드랍다운 -->
        <b-col cols="2">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" v-model="selectedWorkType">
              <option v-for="type in workTypeList" :key="type.value" :value="type">{{ type.text }}</option>
            </select>
            <label for="floatingSelect" class="select">작업구분</label>
          </div>
        </b-col>
        <b-col cols="3" class="period">
          <div class="label_title">수주 일자</div>
          <div class="form-floating me-1">
            <date-picker label="시작일" v-model="startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="종료일" v-model="endDate" />
            <label for="floatingPicker">종료일</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input type="text" class="form-control label-60" id="floating" placeholder="PO NO" v-model="poNo" autocomplete="off"/>
            <label for="floating">PO NO</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchOrders"><span class="ico_search"></span>조회</b-button>
      </div> 
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">             
          <div class="btn_wrap ms-auto">
            <b-button @click="exportToExcel" class="second">엑셀</b-button>  
            <b-button @click="addOrder" class="sub"><span ></span>추가</b-button>        
            <b-button @click="deleteOrder">삭제</b-button> 
            <b-button @click="saveOrder" class="main"><span ></span>저장</b-button>   
          </div>            
      </div>
      <div class="grid-border-none">
        <RealGrid
          ref="purchaseOrderGrid"
          :uid="'purchaseOrderGrid'"
          :rows="rows"
          style="width: 100%; height: 100%"
        />
      </div>
    </div>
    <CmDialog1 ref="cmDialog1M00006001" @confirm="handleConfirm" />
  </div>
</template>
<script>
const URI_PREFIX = "/api/m0006000/m0006001";
import moment from "moment";
export default {
  name: "DW_M0006001",
  props: {},
  components: {},
  data() {
    return {
      orders: [],
      modelList: [],
      selectedModel: null,
      workTypeList: [],
      selectedWorkType: null,
      startDate: "",
      endDate: "",
      purchaseOrderGrid: null,
      rows: [],
      searchFlag: false,
      addRowFlag: false,
      searchParams: null,
      editableColumns: ["수주수량", "수율", "납기일", "비고"],
      poNo: null
    };
  },
  computed: {
    GV() {
      return this.$refs.purchaseOrderGrid.getGridView();
    },
    DP() {
      return this.$refs.purchaseOrderGrid.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    this.$eventBus.on("M0006001MenuMove", this.menuMove);
    this.getSelectOptions();
  },
  beforeUnmount() {
    this.$eventBus.off("M0006001MenuMove");
  },
  methods: {
    initPoNo(){
      this.poNo = null;
    },
    menuMove(data) {
      this.$nextTick(()=>{
        this["selectedModel"] = { value: data["제품유형"], text: data["제품유형라벨"] };
        this["selectedWorkType"] = { value: data["작업구분"], text: data["작업구분라벨"] };
        let date = this.$utils.rgDisplayDate(null, null, data["수주일자"]);
        this.startDate = date;
        this.endDate = date;
        this.poNo = data["poNo"];
        this.searchOrders();
      });
    },
    async getSelectOptions() {
      let param = [
        {
          menuId: "M0006001",
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
          menuId: "M0006001",
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
      this.purchaseOrderGrid = _.cloneDeep(
        require(`@web/m0006000/js/M0006001_1.js`)
      );
    },
    async searchOrders() {
      //if(this.selectedModel==null||this.selectedWorkType==null){
      //  this.$toast("error", "먼저 제품유형과 작업구분을 선택해주세요.");
      //  return;
      //}
      let params = {
        modelCode: this.selectedModel == null ? this.selectedModel : this.selectedModel.value,
        workCode: this.selectedWorkType==null ? this.selectedWorkType : this.selectedWorkType.value,
        startDate: this.startDate,
        endDate: this.endDate,
        poNo : this.poNo
      };
      this.searchParams = {
        model: this.selectedModel,
        workType: this.selectedWorkType,
        startDate: this.startDate.replace('-',''),
        endDate: this.endDate.replace('-',''),
      };
      let param = {
        menuId: "M0006001",
        queryId: "getPurchaseOrders",
        queryParams: params,
        target: this.rows,
      };
      await this.$axios.api.search(param);
      this.searchFlag = true;
      this.addRowFlag = false;
    },
    async addOrder() {
      if (!this.searchFlag) {
        this.$toast("error", "먼저 조회를 해주세요.");
        return;
      }
     /* if (
        this.selectedModel == undefined ||
        this.selectedWorkType == undefined
      ) {
        this.$toast("error", "먼저 제품유형과 작업구분을 선택해주세요.");
        return;
      }*/
     if (this.addRowFlag) return; 
      let orderDate = this.getTodayDate();
      let deliveryDate = this.getLastDayOfCurrentMonth();
      let yymmdd = this.endDate.replace('-','').replace('-','').substring(2,8); //this.getYymmdd();

      const modelLabel = this.selectedModel == undefined ? null : this.searchParams.model.text;
      const workTypeLabel = this.selectedWorkType == undefined ? null :this.searchParams.workType.text;
      const workTypeChar = this.selectedWorkType == undefined ? null : workTypeLabel.substring(1, 2);
      let params = {
        yymmdd,
        workTypeChar,
        model: modelLabel,
      };
      let resp = {};
      let param = {
        menuId: "M0006001",
        queryId: "getPoNo",
        queryParams: params,
        target: resp,
      };
      await this.$axios.api.search(param);

	    this.DP.addRow({
		    수주일자:orderDate,
		    제품유형라벨: modelLabel,
        제품유형: this.selectedModel == undefined ? null : this.selectedModel.value,
        작업구분라벨: workTypeLabel,
        작업구분: this.selectedWorkType == undefined ? null : this.selectedWorkType.value,
        poNo: resp.poNo,
        투입수량: 0,
        잔량: 0,
        수주단위: 76, //default값 삽입
        수주구분: 1, //default값 삽입
        납기일 : deliveryDate
      });
      this.addRowFlag = true;
    },
    async saveOrder() {
      //우선 새로 추가한 행만 저장
      const createdRowIndex = this.DP.getStateRows("created");
      if (createdRowIndex.length > 0) {
        this.$confirm( "확인","추가하신 행을 저장하시겠습니까?", async (confirm)=>{
          if(confirm){
            let rowList = [];
            createdRowIndex.forEach((element) => {
              let row = this.DP.getJsonRow(element);
              row['납기일'] = moment(row['납기일']).format('YYYY-MM-DD');
              row['수주일자'] = moment(row['수주일자']).format('YYYY-MM-DD');
              rowList.push(row);
            });
			const requiredFields = ['제품유형라벨', '작업구분라벨', '거래처명', '납기일'];
			if (rowList.some(row => requiredFields.some(field => !row[field]))) {
			    this.$toast("warning", "모든 필수 필드를 채워주세요.");
			    return;
			}
            let param = {
              menuId: "M0006001",
              insert: [{ queryId: "insertPurchaseOrder", data: rowList }],
            };
            console.log(param);
            try {
              let resp = await this.$axios.api.saveData(param);
              console.log(resp);
              this.$toast("info", "저장완료");
            } catch {
              this.$toast("info", "에러발생. 재조회후 다시 작업해주세요.");
            }

            await this.searchOrders();
          }
         }
        ); 
      }
      else{
        this.$toast("info", "저장할 데이터가 없습니다.");
      }
    },
    async deleteOrder() {
      //삭제 버튼 클릭시 즉시 DB에서 삭제됨
      let checkRow = this.GV.getCheckedRows(true);

      if (checkRow.length > 0) {
         this.$confirm("확인","선택한 행을 삭제 하시겠습니까?",  async (confirm)=>{
            if(confirm){
              let poNoList = [];
            checkRow.forEach((element) => {
              let poNo = this.DP.getValue(element, "poNo");
              poNoList.push({ poNo });
            });
            let checkResp = {};
            let checkParam = {
              menuId: "M0006001",
              queryId: "checkPoNoDeletable",
              queryParams: poNoList[0],
              target: checkResp,
            };
            await this.$axios.api.search(checkParam);

            if (checkResp.result == 0) {
              this.$toast(
                "info",
                "해당 PO_NO로 발행된 Lot이 있어 삭제가 불가능합니다."
              );
              return;
            }

            let param = {
              menuId: "M0006001",
              insert: [{ queryId: "deletePurchaseOrder", data: poNoList }],
            };

            let resp = await this.$axios.api.saveData(param);
            console.log(resp);
            this.$toast("info", "삭제완료");
            await this.searchOrders();
            }else{
              console.log('취소')
            }
        });
      }
      else{
        this.$toast("info", "삭제할 데이터가 없습니다.");
      }
    },
    exportToExcel() {
      const grid = this.GV;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `제품수주서_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

			const options = {
				type: "excel",
				target: "local",
				fileName: fileName,
				progressMessage: "엑셀 Export중입니다.",
				done: function() {
					alert("엑셀 내보내기가 완료되었습니다!");
				}
			};

			grid.exportGrid(options);
    },
	handleConfirm(params) {
	    console.log(params);
	    let checkRow = params.gridView.getCheckedRows(true);
	    console.log(checkRow);

	    if (checkRow.length === 0) {
	        console.warn("체크된 행이 없습니다.");
	        return;
	    }

	    let row = params.dataProvider.getJsonRow(checkRow[0]);
	    let index = params.dataRow;

	    // 유효성 검사
	    if (!row) {
	        console.error("유효하지 않은 행 데이터입니다.");
	        return;
	    }

	    const fieldMappings = {
		    "CP0000000001_1.js": {
		            "제품유형라벨": row["제품유형라벨"],
		            "제품유형": row["제품유형"]
		        },
	        "CP0000000001_2.js": {
	            "작업구분라벨": row["작업구분라벨"],
	            "작업구분": row["작업구분"]
	        },
	        "CP0000000001.js": {
	            "거래처명": row["거래처명"],
	            "거래처코드": row["거래처코드"]
	        },
	        "CP0000000002.js": {
	            "제품명": `${row['제품모델']} ${row['제품inch']} ${row['glass두께']} ${row['제품버젼']} ${row.sheet} ${row.block} ${row.runSize} [${row['제품규격']}]`,
	            "제품코드": row["제품코드"]
	        }
	    };

	    const mappings = fieldMappings[params.gridJs];
	    if (mappings) {
	        for (const [field, value] of Object.entries(mappings)) {
	            this.GV.setValue(index, field, value);
	        }
	    } else {
	        console.warn("지원되지 않는 gridJs:", params.gridJs);
	    }
	},
	async onCellClickedPurchaseOrderGrid(grid, clickData) {
	    if (clickData.cellType != "data") return;

	    const prod = grid.getDataSource();
	    const rowState = prod.getRowState(clickData.dataRow);
	    
	    if (rowState != "created") return;

	    const openDialog = (title, popUpSize, height, width, gridJs, queryId, queryParams = {}) => {
	        const params = {
	            dialogTitle: title,
              popUpSize: popUpSize, //sm,lg,xl
	            height: height,
	            width: width,
	            dataRow: clickData.dataRow,
	            gridJs: gridJs,
	            search: { menuId: "CMDIALOG", queryId: queryId, queryParams: queryParams },
	        };
	        this.$refs.cmDialog1M00006001.openDialog(params);
	    };
		
		// getValue 메서드 사용하여 셀의 값 가져오기
		const cellValue = grid.getValue(clickData.itemIndex,clickData.fieldName);
				
	    switch (clickData.fieldName) {
	        case "제품유형라벨":
		    if(this.selectedModel == null && (cellValue == null || cellValue == undefined ))
	            openDialog("모델 찾기", 'sm', 500, 200, "CP0000000001_1.js", "selectDwModelMast");
	            break;
	        case "작업구분라벨":
		    if(this.selectedWorkType==null && (cellValue == null || cellValue == undefined ))
	            openDialog("작업구분 찾기", 'sm', 200, 100, "CP0000000001_2.js", "selectWorkType");
	            break;
	        case "거래처명":
	            openDialog("거래처 찾기", 'lg', 200, 300, "CP0000000001.js", "selectDwVendorMast");
	            break;
	        case "제품명":
	            const modelLabel = this.GV.getValue(clickData.dataRow, '제품유형라벨');
              const workLabel = this.GV.getValue(clickData.dataRow, '작업구분라벨');
              if(_.isNil(modelLabel)){
                this.$toast("info", "먼저 제품유형을 선택해주세요.");
                return;
              }

              if(_.isNil(workLabel)){
                this.$toast("info", "먼저 작업구분을 선택해주세요.");
                return;
              }
	            openDialog("제품 찾기",'xl', 200, 1000, "CP0000000002.js", "selectDwProductMast", { model: modelLabel });

              let params = {
                  yymmdd: this.endDate.replace('-','').replace('-','').substring(2,8),
                  workTypeChar: workLabel.substring(1,2),
                  model: modelLabel, // modelLabel
              };
              let resp = {};
              let param = {
                  menuId: "M0006001",
                  queryId: "getPoNo",
                  queryParams: params,
                  target: resp, 
              };
              await this.$axios.api.search(param);
                    this.DP.setValue(clickData.dataRow, 'poNo', resp.poNo); // poNo 값을 설정
	            break;
	        default:
	            console.warn("지원되지 않는 필드:", clickData.fieldName);
	    }
	},
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = String(today.getDate()).padStart(2, "0");
      
      return `${year}-${month}-${day}`;
    },
    getLastDayOfCurrentMonth() {
        const date = new Date();
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return `${lastDay.getFullYear()}-${(lastDay.getMonth()+1).toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`;
    },
    getYymmdd() {
      const today = new Date();
      const year = today.getFullYear().toString().substring(2, 4);
      const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = String(today.getDate()).padStart(2, "0");

      return `${year}${month}${day}`;
    },
    setCellStyleCallbackPurchaseOrderGrid: function (grid, model) {
      let ret = {};
      if (this.editableColumns.includes(model.dataColumn.fieldName)) {
        const prod = grid.getDataSource();
        const dataRow = model.index.dataRow;
        const state = prod.getRowState(dataRow);
        //신규 추가중인 행만 편집가능
        if (state == "created") {
          ret.editable = true;
        } else {
          ret.editable = false;
        }
      } else {
        ret.editable = false;
      }

      return ret;
    },
  },
};
</script>
