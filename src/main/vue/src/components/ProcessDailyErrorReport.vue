<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="2">
          <label class="ms-3"><input type="radio" v-bind:value="'일간'" v-model="params.gubun" class="me-1"/>일간</label>
          <label class="ms-3"><input type="radio" v-bind:value="'주간'" v-model="params.gubun" class="me-1"/>주간</label>
          <label class="ms-3"><input type="radio" v-bind:value="'월간'" v-model="params.gubun" class="me-1"/>월간</label>
        </b-col>
        <b-col cols="2">
          <div class="d-flex ms-1" @click="clickDialog('Model')" style="cursor: pointer;">            
            <div class="form-floating">
              <input
                type="text"
                id="floating" 
                class="form-control label-60"
                v-model="params.modelList"
                :disabled="true"
                autocomplete="off"
                style="height:40px; pointer-events: none"
              />
              <label for="floating">모델</label>
            </div>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="d-flex ms-1" @click="clickDialog('Job')" style="cursor: pointer;">
            <div class="form-floating">
              <input
                type="text"
                id="floating" 
                class="form-control label-60"
                v-model="params.jobList"
                :disabled="true"
                autocomplete="off"
                style="height:40px; pointer-events: none"
              />
              <label for="floating">작업구분</label>
            </div>
          </div>
        </b-col>
        <b-col cols="3" class="period">
          <div class="form-floating me-1">
            <date-picker label="From" v-model="params.startDate" />
            <label for="floatingPicker">From</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="To" v-model="params.endDate" />
            <label for="floatingPicker">To</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchClick"><span class="ico_search"></span>조회</b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="createDataClick">데이터 생성</b-button>
          <b-button class="second" @click="excelClick">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="grid" :uid="'grid'" :rows="rows" style="height: 100%" :fitLayoutWidthEnable="false"/>
      </div>
    </div>
    <CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
  </div>
</template>
<script>

import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { ValueType } from 'realgrid';
import moment from "moment";

export default {
  props: {},
  components: {},
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  watch: {},
  data() {
    return {
      grid: null,
      rows: [],
      headerList:[],
      params: {
        startDate: null,
        endDate: null,
        gubun: '일간',
        modelList: null,
        jobList: null,
      },
      schParams: {
        startDate: null,
        endDate: null,
        gubun: '일간',
        modelList: null,
        jobList: null,
      },
      target: "",
      baseInfos: [
        { suffix: '투입수량', label: '투입수량' },
        { suffix: 'TotalNg', label: '합계' },
        { suffix: 'Ng수량', label: 'NG' },
        { suffix: '수율제외수량', label: '수율제외' },
        { suffix: 'Rework진행여부수량', label: 'Rework진행여부' }
      ]
    };
  },
  computed: {
  },
  created() {
    var current = new Date();
    this.params.startDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-01`;
    var lastDayOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    this.params.endDate = `${lastDayOfMonth.getFullYear()}-${(lastDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`;
    this.initializeGrid();
  },
  mounted() {    
    //this.getHeaderList();
  },
  beforeUnmount() {},
  methods: {
    gv() {
      return this.$refs.grid.getGridView();
    },
    dp() {
      return this.$refs.grid.getGridDataProvider();
    },
    
    initializeGrid() {
      this.grid = _.cloneDeep(require(`./js/ProcessDailyErrorReport.js`));
    },
    
    async getHeaderList(){
      let grid = _.cloneDeep(require(`./js/ProcessDailyErrorReport.js`));
      this.gv().setColumn(grid.columns);
      this.dp().setFields(grid.fields);
      this.gv().setColumnLayout(grid.layout);
      let params = {
        startDate: String(this.params.startDate).replace(/-/g, ''),
        endDate: String(this.params.endDate).replace(/-/g, ''),
        model: this.params.modelList,
        job: this.params.jobList
      }
      await this.$axios.api.search({menuId: "R0000000", queryId: (this.params.gubun == '일간' ? "selectHeaderList1" : (this.params.gubun == '주간' ? "selectHeaderList2" : "selectHeaderList3")), queryParams: params}).then(resp => {
        this.headerList = _.cloneDeep(resp);
        
        //total 컬럼 추가
        this.addTotalColumn(resp);
    
        resp.forEach(date => {
          const fields = [];

          this.baseInfos.forEach(base => {
            const fn = `${date['집계일자']}${base.suffix}`;
            // 필드 추가
            this.dp().addField({ fieldName: fn, dataType: ValueType.NUMBER });

            // 컬럼 추가

            let column = {
              name: fn,
              fieldName: fn,
              width: 80,
              header: { text: base.label },
              editable: false,
              styleName: "tr",
              numberFormat: '#,##0',
              footer: null,
            };

            if (base.suffix === '투입수량') {
              column.footer = {
                numberFormat: "#,##0",
                valueCallback: function (grid, column, footerIndex, columnFooter, value) {
                  let sum = 0;
                  const prod = grid.getDataSource();
                  const rows = grid.getFilteredRows();
                  let chk = "";
                  for (let row of rows) {
                    if (chk != prod.getValue(row, '공정명')) {
                      sum += prod.getValue(row, column.fieldName);
                      chk = prod.getValue(row, '공정명');
                    }
                  }
                  return sum;
                }
              };
            } else {
              column.footer = {
                expression: "sum",
                numberFormat: "#,##0"
              };
            }

            this.gv().addColumn(column);
            fields.push(fn);
          });

          // 날짜별 layout group 추가
          this.gv().addLayout({
            name: `${date['집계일자']}group`,
            header: { text: (this.params.gubun == '일간' ? moment(date['집계일자'], 'YYYYMMDD').format('YY-MM-DD') : this.params.gubun == '주간' ? date['집계일자']+"주" : moment(date['집계일자'], 'YYYYMM').format('YY-MM')) },
            items: fields,
          });
        });

      }).catch(error => {
        console.error("error", error);
      });
      
    },
    addTotalColumn(list){

      const fields = [];
      this.baseInfos.forEach(info => {
        let veList = [];

        list.forEach(date => {
          const originField = `${date['집계일자']}${info.suffix}`;
          veList.push("values['"+originField+ "']");
        });
        const fieldName = `${info.suffix}Sum`;

        this.dp().addField({
          fieldName: fieldName,
          dataType: ValueType.NUMBER,
          valueExpression:veList.join("+")
        });

        let column = {
          name: fieldName,
          fieldName: fieldName,
          width: 120,
          header: { text: info.label },
          editable: false,
          styleName: "tr",
          numberFormat: '#,##0',
          footer: null,
        };

        if (info.suffix === '투입수량') {
          column.footer = {
            numberFormat: "#,##0",
            valueCallback: function (grid, column, footerIndex, columnFooter, value) {
              let sum = 0;
              const prod = grid.getDataSource();
              const rows = grid.getFilteredRows();
              let chk = "";
              for (let row of rows) {
                if (chk != prod.getValue(row, '공정명')) {
                  sum += prod.getValue(row, column.fieldName);
                  chk = prod.getValue(row, '공정명');
                }
              }
              return sum;
            }
          };
        } else {
          column.footer = {
            expression: "sum",
            numberFormat: "#,##0"
          };
        }

        this.gv().addColumn(column);
        fields.push(fieldName);

      });
      this.gv().addLayout({
        name: `TotalGroup`,
        header: { text: 'Total' },
        items: fields
      });

    },

    async createDataClick(){
      let params = {
        startDate: String(this.params.startDate).replace(/-/g, ''),
        endDate: String(this.params.endDate).replace(/-/g, ''),        
      }
      this.$confirmYesOrNo('선택', `${this.params.startDate}~${this.params.endDate}의 데이터 생성 하시겠습니까?`, async(confirmed) => {
        if (confirmed) {
          let result = await this.$axios.api.searchAll([
            {menuId: "R0000000", queryId: "R0000000_CreatedFrontData", queryParams: params}, {menuId: "R0000000", queryId: "R0000000_CreatedBackData", queryParams: params}
          ]);
        }
      });
    },

    async searchClick() {
      if(_.isNil(this.params.startDate) || _.isNil(this.params.endDate)){
        this.$toast("info",'From ~ To 선택하십시오.');
        return;
      }
      if (moment(this.params.startDate).isAfter(moment(this.params.endDate))) {
        this.$toast("info","From 날짜가 To 날짜보다 클 수 없습니다.");
        return;
      } 
      const monthDiff = moment.duration(moment(this.params.endDate).diff(moment(this.params.startDate))).asMonths();
      if (monthDiff > 1) {
        this.$toast("info","한 달 이상 범위는 허용되지 않습니다.");
        return;
      }

      this.getHeaderList().then(()=>{
        let params = {
          startDate: String(this.params.startDate).replace(/-/g, ''),
          endDate: String(this.params.endDate).replace(/-/g, ''),
          model: this.params.modelList,
          job: this.params.jobList
        }
        this.$axios.api.search({menuId: "R0000000", queryId: (this.params.gubun == '일간' ? "R0000000_SchDailyErrorStatus" : (this.params.gubun == '주간' ? "R0000000_SchWeeklyErrorStatus" : "R0000000_SchMonthlyErrorStatus")), queryParams: params, target: this.rows}); 
        this.schParams = _.cloneDeep(this.params);

      });
    },
    excelClick(){
      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const fileName = `공정별_${this.schParams.gubun}_불량현황_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      this.gv().exportGrid({
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: "엑셀 Export중입니다.",
        exportGrids: [
          { grid: this.gv(), sheetName: '공정별_일별 불량현황' },
        ],
        done: () => {
          this.$toast('success', '엑셀 내보내기가 완료되었습니다!');
        },
      });
    },

    clickDialog(targetNm){
      this.target = targetNm;
      let params = {
        dialogTitle: this.$utils.findMappedValue(["Model","Job"],["Model 리스트", "작업구분 리스트"], targetNm),					
        height: 300,
        width: 1800,
        gridJs: this.$utils.findMappedValue(["Model","Job"],["CP0000000022.js","CP0000000027.js"], targetNm),
        btnConfirm: true,
        options: { checkBar: { visible: true,exclusive:false } },
        search: { menuId: this.$utils.findMappedValue(["Model","Job"],["M0006013","R0000000"], targetNm), queryId: this.$utils.findMappedValue(["Model","Job"],["M0006013_Sch3","R0000000_SchErrorStatusJob"], targetNm), queryParams: {}}
      };	
      this.$refs.cmDialog1.openDialog(params);
    },

    handleConfirm(grid){
      let rows = grid.dataProvider.getJsonRows(0, -1)
      .filter((_, index) => grid.gridView.isCheckedRow(index))
      .map(item => item[this.target == 'Model' ? 'model' : 'code']);
      if(this.target == 'Model'){
        this.params.modelList = rows.length == 0 ? null : rows.join(",");
      }else{
        this.params.jobList = rows.length == 0 ? null : rows.join(",");
      }
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/

    onCellClickedGrid(grid, clickData) {
      if(clickData.cellType !== "data") return;
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      
      let area = jsonData['area'];
      let chk1 = ["투입수량","TotalNg","Ng수량","수율제외수량","Rework진행여부수량"].some(keyword => clickData.fieldName.includes(keyword));
      let chk2 = (this.schParams.gubun == '일간' ? /^\d{8}/.test(clickData.fieldName) : (this.schParams.gubun == '주간' ? /^\d{4}-\d{2}/.test(clickData.fieldName) : /^\d{6}/.test(clickData.fieldName)));
      //let chk3 = ["Back#1","Back#2"].some(keyword => area.includes(keyword))
      //let queryId = (area == 'Front' ? 'selectProcessDailyErrorReportDtl1List' : (chk3 ? 'selectProcessDailyErrorReportDtl2List' : ''));
      if(chk1&&chk2){
        let s집계일자 = clickData.fieldName.substring(0,8);
        let s공정코드 = jsonData['공정코드'];
        let s불량코드 = jsonData['불량코드'];
        let s불량명 = jsonData['불량명'];
        let sModel = this.schParams.modelList;
        let sJob = this.schParams.jobList;
        let params = {
          dialogTitle: `[${(this.schParams.gubun == '일간' ? s집계일자 : (this.schParams.gubun == '주간' ? (String(this.schParams.endDate).replace(/-/g, '').substring(0,4)+"-"+clickData.fieldName.substring(0,2)) : clickData.fieldName.substring(0,6)))}][${area}][${s불량명}] 불량현황 상세`,
          step: 9,
          height: 300,
          width: 1500,
          dataRow: clickData.dataRow,
          btnConfirm: false,
          gridJs: `ProcessDailyErrorReportPopup.js`,
          search: { 
            menuId: "CMDIALOG", queryId: (this.schParams.gubun == '일간' ? 'selectProcessDailyErrorReportDtlList' : (this.schParams.gubun == '주간' ? 'selectProcessDailyErrorReportDtl1List' : 'selectProcessDailyErrorReportDtl2List')), 
            queryParams: {
              '집계일자': s집계일자, '공정코드': s공정코드, '불량코드': s불량코드, 'model': sModel, 'job': sJob,
              week: clickData.fieldName.substring(0,7),
              yyyymm: clickData.fieldName.substring(0,6)
            } 
          }
        };	
        this.$refs.cmDialog1.openDialog(params);
      }
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .period{
	width: 20%!important;
	}
:deep .rg-fixed-footer{
 border-top: 2px solid  #E56615; 
} 
:deep .rg-footer{
 border-top: 2px solid #E56615; 
 font-weight: bold;
}
</style>

