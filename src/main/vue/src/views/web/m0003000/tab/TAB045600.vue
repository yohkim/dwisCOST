/** * 제조 실적 입력 > 포장/출하 > 재고현황 */
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3" class="period">
          <div class="form-floating me-1">
            <date-picker label="시작일" v-model="srchInfo.startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="종료일" v-model="srchInfo.endDate" />
            <label for="floatingPicker">종료일</label>
          </div>
        </b-col>

        <b-col cols="1" class="ms-3" style="width: 15.2% !important">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" v-model="params.model" :disabled="isDisabled">
              <option v-for="model in modelList" :key="model.value" :value="model">
                {{ model.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">제품유형</label>
          </div>
        </b-col>

        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="BoxNo" v-model="params.boxNo" :disabled="isDisabled" ref="boxNoField" name="boxNo" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter($event, 'boxNo')" />
            <label for="floating">BoxNo</label>
          </div>
        </b-col>

        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="PalletNo" v-model="params.palletNo" :disabled="isDisabled" ref="palletNoField" name="palletNo" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter($event, 'palletNo')" />
            <label for="floating">PalletNo</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchClick">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="title">현황</div>
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="storageClick">보관 구역</b-button>
        </div>
      </div>
      <div class="grid-border-none">
          <RealGrid ref="grids" :uid="'grids'" :rows="gridsRows" style="height: 185px" :fitLayoutWidthEnable="false"/>
        <div v-show="searchDiv === 'SI대기'" style="border-top:1px solid #bcc0c8;height: calc(100% - 185px)">
          <RealGrid ref="grid1" :uid="'grid1'" :rows="grid1Rows" style="height: 100%" />
        </div>
        <div v-show="searchDiv === 'SI의뢰'" style="border-top:1px solid #bcc0c8;height: calc(100% - 185px)">
          <RealGrid ref="grid2" :uid="'grid2'" :rows="grid2Rows" style="height: 100%" />
        </div>
        <div v-show="searchDiv === '소포장반출'" style="border-top:1px solid #bcc0c8;height: calc(100% - 185px)">
          <RealGrid ref="grid3" :uid="'grid3'" :rows="grid3Rows" style="height: 100%" />
        </div>
        <div v-show="searchDiv === '출하대기'" class="grid-border-none" style="border-top:1px solid #bcc0c8;height: calc(100% - 185px)">
          <RealGrid ref="grid4" :uid="'grid4'" :rows="grid4Rows" style="height: 100%" />
        </div>
      </div>
    </div>  
    <StorageArea ref="storageAreaPopup" @confirm="searchClick" />
  </div>
</template>

<script>
import { useM0003009 } from '@web/store/M0003009.js';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import StorageArea from '../../popup/StorageArea.vue';
import { ValueType } from 'realgrid';

export default {
  name: 'DW_TAB045600',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {
    StorageArea,
  },
  setup() {
		const srchInfo = useM0003009();
    const userAuthInfo = useUserAuthInfo();
    return { 
			srchInfo,
      userAuthInfo 
    };
  },
  watch: {},
  data() {
    return {
      rMODEL: null,
      gridsRows: [],
      grids: null,
      grid1Rows: [],
      grid2Rows: [],
      grid3Rows: [],
      grid4Rows: [],
      grid2: null,
      params: {
        startDate: '',
        endDate: '',
        model: '',
        boxNo: '',
        palletNo: '',
      },
      modelList: [],
      isProcessing: false,
      searchDiv: 'SI의뢰',
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    gridsView() {
      return this.$refs.grids.getGridView();
    },
    grid1View() {
      return this.$refs.grid1.getGridView();
    },
    grid2View() {
      return this.$refs.grid2.getGridView();
    },
    grid3View() {
      return this.$refs.grid3.getGridView();
    },
    grid4View() {
      return this.$refs.grid4.getGridView();
    },
    dataSProvider() {
      return this.$refs.grids.getGridDataProvider();
    },
    data1Provider() {
      return this.$refs.grid1.getGridDataProvider();
    },
    data2Provider() {
      return this.$refs.grid2.getGridDataProvider();
    },
    data3Provider() {
      return this.$refs.grid3.getGridDataProvider();
    },
    data4Provider() {
      return this.$refs.grid4.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  mounted() {
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.grids = _.cloneDeep(require(`@web/m0003000/js/TAB045600_S.js`));
      this.grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB045600_1.js`));
      this.grid2 = _.cloneDeep(require(`@web/m0003000/js/TAB045301_1.js`));
      this.grid3 = _.cloneDeep(require(`@web/m0003000/js/TAB045600_3.js`));
      this.grid4 = _.cloneDeep(require(`@web/m0003000/js/TAB045600_4.js`));
    },
    async getSelectOptions() {
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      let param = [
        {
          menuId: 'M0003007',
          queryId: 'getModels',
          callback: (data) => {
            this.$utils.transformData(data, ['value', 'text'], ['코드', '제품유형'], this.modelList);
          },
        },
      ];
      await this.$axios.api.searchAll(param);
    },
    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },
    handleEnter(event, inputName) {
      //event.preventDefault(); // 기본 이벤트 방지
      this.searchClick(); // 검색 실행
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;
      this.shipcancel = false;

      this.$nextTick(async () => {
        this.gridsView.resetFilters();
        this.gridsView.clearCurrent();
        this.dataSProvider.clearRows();
        this.data1Provider.clearRows();
        this.data2Provider.clearRows();
        this.data3Provider.clearRows();
        this.data4Provider.clearRows();

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          return;
        }

        let params = {
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch61_Col',
          queryParams: params,
          target: null,
        };

        let result1 = await this.$axios.api.search(searchParam);
        const gridField = _.cloneDeep(require(`@web/m0003000/js/TAB045600_S.js`));
        
        let fn = "total";
        let veList = [];
         result1.forEach((item) => {
          veList.push("values['"+item.model.toLowerCase()+ "']");
         });
        // 행 합계 컬럼 추가
        gridField.fields.push({fieldName: fn,dataType: ValueType.NUMBER,valueExpression:veList.join("+")});
        gridField.columns.push({name: fn,fieldName: fn,width: 80,header: {text: "합계"},editable: false,styleName: "tr",numberFormat: '#,##0',
        // footer: [
        //   {expression: "sum",numberFormat: '#,##0'},
        //    ]
         });

        result1.forEach((item) => {
          gridField.fields.push({
            fieldName: item.model.toLowerCase(),
            valueType: 'number',
            dataType: 'number' , 
          });

          gridField.columns.push({
            name: item.model.toLowerCase(),
            fieldName: item.model.toLowerCase(),
            width: 80,
            header: {
              text: item.model,
            },
            autoFilter: false,
            numberFormat: '#,###.###',
            styleName: 'tr',
          });
        });

        this.dataSProvider.setFields(gridField.fields);
        this.gridsView.setColumns(gridField.columns);

        let searchParam2 = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch6S',
          queryParams: params,
          target: this.gridsRows,
        };

        let result2 = await this.$axios.api.search(searchParam2);
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);  
      //gridView.setColumnProperty("pack수량", "footer", { text: totalSum.toLocaleString()});
      // 특정 컬럼에 합계 표시
       this.gridsView.setColumnProperty("합계", "footer", {
            //expression: "sum",  // 합계 계산
            text: '100',
            numberFormat: "#,##0",  // 숫자 포맷
            styles: {
                foreground: "#FF0000",
                fontBold: true,
                textAlignment: "far"  // 오른쪽 정렬
            }
        });
    },
    storageClick() {
      this.$refs.storageAreaPopup.openDialog();
    },
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    
    async onCellClickedGrids(grid, clickData) {
      try {
        if (clickData.cellType === 'header') return;

        const current = grid.getCurrent();
        const rowIndex = current.itemIndex;
        const shipState = grid.getValue(rowIndex,'상태');
        //this.$toast('info',shipState); return;
        
        const qp = {
          startDate: this.srchInfo.startDate.replace(/-/g, ""),
          endDate: this.srchInfo.endDate.replace(/-/g, ""),
          modelNo: clickData.column
        };

        const mi = 'M0003009';
        let qiDtl = "";
        this.isLoading = true;
      
      if (shipState === '출하검사 대기') {
        // SI Request case
          this.searchDiv = 'SI대기';
          qiDtl = 'M0003009_Sch61';          
          const paramDtl = { menuId: mi, queryId: qiDtl, queryParams: qp, target: this.grid1Rows };
          await this.$axios.api.search(paramDtl);  
          
        // 데이터 바인딩 완료 대기
          await this.$nextTick();
          const gridView = this.grid1View;
        // 2. 컬럼 속성 설정
          gridView.beginUpdate();
          try {
        // 그룹 푸터 설정
            gridView.setColumnProperty("수량", "groupFooter", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f", fontBold: true}});            
        // 전체 푸터 설정
            gridView.setColumnProperty("수량", "footer", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f",fontBold: true}});
          } finally {
            gridView.endUpdate();
          }
          gridView.groupBy(["발행일자"]);

        // 전체 합계 계산
          let totalSum = 0;
          const rowCount = this.data1Provider.getRowCount();

          if (rowCount === 0)   return;
          
          for (let i = 0; i < rowCount; i++)
              totalSum += this.data1Provider.getValue(i, "수량") || 0;
        
        // 전체 합계를 표시하는 별도의 푸터 추가
          gridView.setFooters({visible: true,elements: {column: "수량", value: totalSum, numberFormat: "#,##0",} });
          gridView.setColumnProperty("대포장Qrno", "footer", { text: "출하검사 대기 합계 =>" });
       } else  if (shipState === '출하검사 의뢰') {
        // SI Request case
          this.searchDiv = 'SI의뢰';
          qiDtl = 'M0003009_Sch42';          
          const paramDtl = { menuId: mi, queryId: qiDtl, queryParams: qp, target: this.grid2Rows };
          await this.$axios.api.search(paramDtl);  
          
        // 데이터 바인딩 완료 대기
          await this.$nextTick();
          const gridView = this.grid2View;
        // 2. 컬럼 속성 설정
          gridView.beginUpdate();
          try {
        // 그룹 푸터 설정
            gridView.setColumnProperty("수량", "groupFooter", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f", fontBold: true}});            
        // 전체 푸터 설정
            gridView.setColumnProperty("수량", "footer", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f",fontBold: true}});
          } finally {
            gridView.endUpdate();
          }
          gridView.groupBy(["si의뢰일자"]);

        // 전체 합계 계산
          let totalSum = 0;
          let prevPackNo = '';
          const rowCount = this.data2Provider.getRowCount();

          if (rowCount === 0) return;
          
          for (let i = 0; i < rowCount; i++) {
              const currentPackNo = this.data2Provider.getValue(i, "packNo");
              if (prevPackNo !== currentPackNo) {
                  //this.$toast('info',prevPackNo+':'+currentPackNo+' '+this.data2Provider.getValue(i, "pack수량"));
                  totalSum += Number(this.data2Provider.getValue(i, "pack수량")) || 0;
                  prevPackNo = currentPackNo;
              }
          }  

        // 전체 합계를 표시하는 별도의 푸터 추가
        //gridView.setFooters({visible: true,elements: {column: "pack수량", value: Number(totalSum) || 0, numberFormat: "#,##0",} });
          gridView.setColumnProperty("pack수량", "footer", { text: totalSum.toLocaleString()});
          gridView.setColumnProperty("packNo", "footer", { text: "출하검사 의뢰 합계 =>" });
       } else if (shipState === '출하 대기(소포장 반출)') {
          this.searchDiv = '소포장반출';
          qiDtl = 'M0003009_Sch63';          
          const paramDtl = { menuId: mi, queryId: qiDtl, queryParams: qp, target: this.grid3Rows };
          await this.$axios.api.search(paramDtl); 
          
        // 데이터 바인딩 완료 대기
          await this.$nextTick();
          const gridView = this.grid3View;
        // 2. 컬럼 속성 설정
          gridView.beginUpdate();
          try {
        // 그룹 푸터 설정
            gridView.setColumnProperty("cell수량", "groupFooter", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f", fontBold: true}});            
        // 전체 푸터 설정
            gridView.setColumnProperty("cell수량", "footer", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f",fontBold: true}});
          } finally {
            gridView.endUpdate();
          }
          gridView.groupBy(["si의뢰일자"]);

        // 전체 합계 계산
          let totalSum = 0;
          const rowCount = this.data3Provider.getRowCount();

          if (rowCount === 0)   return;
          
          for (let i = 0; i < rowCount; i++) 
              totalSum += this.data3Provider.getValue(i, "cell수량") || 0;
        
        // 전체 합계를 표시하는 별도의 푸터 추가
          gridView.setFooters({visible: true,elements: {column: "cell수량", value: totalSum, numberFormat: "#,##0",} });
          gridView.setColumnProperty("boxNo", "footer", { text: "소포장 반출 합계 =>" });

        } else if (shipState === '출하 대기(창고 재고)') {
        // Shipping Waiting case
          this.searchDiv = '출하대기';
          qiDtl = 'M0003009_Sch62';
          const paramDtl = { menuId: mi, queryId: qiDtl, queryParams: qp, target: this.grid4Rows };
          await this.$axios.api.search(paramDtl);

        // 데이터 바인딩 완료 대기
          await this.$nextTick();
          const gridView = this.grid4View;
        // 2. 컬럼 속성 설정
          gridView.beginUpdate();
          try {
        // 그룹 푸터 설정
            gridView.setColumnProperty("cell수량", "groupFooter", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f", fontBold: true}});            
        // 전체 푸터 설정
            gridView.setColumnProperty("cell수량", "footer", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f",fontBold: true}});
          } finally {
            gridView.endUpdate();
          }
        // 4. 그룹핑 적용
          gridView.groupBy(["palletNo"]);
        // 전체 합계 계산
          let totalSum = 0;
          const rowCount = this.data4Provider.getRowCount();

          if (rowCount === 0)   return;
          for (let i = 0; i < rowCount; i++) {
              totalSum += this.data4Provider.getValue(i, "cell수량") || 0;
          }
        // 전체 합계를 표시하는 별도의 푸터 추가
          gridView.setFooters({visible: true,elements: {column: "cell수량", value: totalSum, numberFormat: "#,##0",} });
          gridView.setColumnProperty("boxNo", "footer", { text: "Pallet 전체 합계 =>" });
        }  
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
		bareCellMngClick(){
			let params = {};
			params['selectedModel'] = this.srchInfo.model;
			params['runNo'] = this.srchInfo.no;
			params['process'] = this.process;
			params['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
			params['endDate'] = this.srchInfo.endDate.replace(/-/g, "");
			params['selectedWorktype'] = this.getWorkType();

			this.$refs.bcmPopup.openDialog(params);
		},
  },
};
</script>
