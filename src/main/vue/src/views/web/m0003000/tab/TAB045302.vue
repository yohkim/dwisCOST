/** 제조 실적 입력 > 포장/출하 > 출하 검사 > SAMPLE PACK 인계 */
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
      </b-row>

      <div class="btn_area">
        <b-button @click="searchClick">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="worker_wrap">
      <div class="title">입력 정보</div>
      <div class="row worker_info">
        <b-col cols="2">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.user">
              <option v-for="type in chargerList" :key="type.value" :value="type">
                {{ type.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">인계자</label>
          </div>
        </b-col>
      </div>
    </div>
    <div class="grid_box material_box">
      <div class="left_box">
        <div class="title">SAMPLE PACK 요청현황</div>
      </div>
      <div class="grid-border-none" style="height: calc(30% - 55px)">
        <RealGrid ref="grid1" class="brd_b" :uid="'grid1'" :rows="grid1Rows" style="height: 100%" :fitLayoutWidthEnable="false"/>
      </div>
      <b-row class="row" style="height: calc(70%)">
        <b-col cols="8" class="brd_r">
          <div class="left_box">
            <div class="title">요청 SAMPLE PACK</div>
          </div>
          <div class="grid-border-none">
            <RealGrid ref="grid2" :uid="'grid2'" :rows="grid2Rows" style="height: 100%" />
          </div>
        </b-col>
        <b-col cols="4">
          <div class="left_box">
            <div class="title">SAMPLE PACK 인계 확인</div>
            <div class="btn_wrap ms-auto">
              <b-button class="main me-2" @click="saveClick">인계 완료</b-button>
            </div>
          </div>
          <div class="grid-border-none">
            <RealGrid ref="grid3" :uid="'grid3'" :rows="grid3Rows" style="height: 100%" />
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { useM0003009 } from '@web/store/M0003009.js';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: 'DW_TAB045302',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {},
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
      grid1Rows: [],
      grid1: null,
      grid2Rows: [],
      grid2: null,
      grid3Rows: [],
      grid3: null,
      params: {
        startDate: '',
        endDate: '',
        user: '',
      },
      chargerList: [],
      isProcessing: false,
      clickedModelNo: null,
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
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
    data1Provider() {
      return this.$refs.grid1.getGridDataProvider();
    },
    data2Provider() {
      return this.$refs.grid2.getGridDataProvider();
    },
    data3Provider() {
      return this.$refs.grid3.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB045200_1.js`));
      this.grid2 = _.cloneDeep(require(`@web/m0003000/js/TAB045302_1.js`));
      this.grid3 = _.cloneDeep(require(`@web/m0003000/js/TAB045302_2.js`));
    },
    async getSelectOptions() {
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      await this.$utils.getCommonCodeValueText(['58'], [this.chargerList]); //의뢰자
    },
    clearGrid() {
      this.clearGrid1();
      this.clearGridOther();
    },
    clearGrid1() {
      this.grid1View.resetFilters();
      this.grid1View.clearCurrent();
      this.data1Provider.clearRows();
    },
    clearGridOther() {
      this.grid2View.resetFilters();
      this.grid2View.clearCurrent();
      this.data2Provider.clearRows();

      this.grid3View.resetFilters();
      this.grid3View.clearCurrent();
      this.grid3View.commit();
      this.data3Provider.clearRows();
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.clearGrid();

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          return;
        }

        let params = {
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch43_Col',
          queryParams: params,
          target: null,
        };

        let result1 = await this.$axios.api.search(searchParam);
        const gridField = _.cloneDeep(require(`@web/m0003000/js/TAB045200_1.js`));

        let fn = "total";
        let veList = [];
         result1.forEach((item) => {
          veList.push("values['"+item.model.toLowerCase()+ "']");
         });
        // 행 합계 컬럼 추가
        gridField.fields.push({fieldName: fn,dataType: 'number',valueExpression:veList.join("+")});
        gridField.columns.push({name: fn,fieldName: fn,width: 80,header: {text: "합계"},editable: false,styleName: "tr",numberFormat: '#,##0',
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
            autoFilter: true,
            numberFormat: '#,###.###',
            styleName: 'tr',
          });
        });

        this.data1Provider.setFields(gridField.fields);
        this.grid1View.setColumns(gridField.columns);

        let searchParam2 = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch43',
          queryParams: params,
          target: this.grid1Rows,
        };

        let result2 = await this.$axios.api.search(searchParam2);
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    searchFieldClick(modelNo) {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.clearGridOther();
        this.clickedModelNo = modelNo;
        let params = {
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
          modelNo: modelNo,
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch44',
          queryParams: params,
          target: this.grid2Rows,
        };

        let rslt = await this.$axios.api.search(searchParam);
        if (_.isEmpty(rslt[0])) {
          this.$toast('warning', '요청된 샘플PACK이 없습니다');
        } else {
          this.data3Provider.addRow({});
          this.setPackNoFocus(0);
        } 
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    async saveClick() {
      let result = false;
      let saveData = this.$refs.grid3.getSaveData();
      if (saveData.insert.length == 0) {
        this.$toast('info', '인계 완료할 Pack No.가 없습니다.');
        return result;
      }

      const addItems = [];
      saveData.insert.forEach((item) => {
        if (!_.isEmpty(item['packQrno']) && !_.isEmpty(item['일치여부']) && item['일치여부'] == '일치') {
          addItems.push(item['packQrno']);
        }
      });

      if (addItems.length == 0) {
        this.$toast('info', 'Pack No. 일치여부 일치 0건으로 인계 완료 진행되지 않습니다.');
        return result;
      }

      if (_.isEmpty(this.params.user) || _.isEmpty(this.params.user.text)) {
        this.$toast('info', '인계자를 입력 후 다시 인계 완료를 누르세요.');
        return result;
      }

      let params = {
        user: !_.isEmpty(this.params.user) ? this.params.user.text : '',
        packNoList: addItems.join(','),
      };

      let searchParam = {
        menuId: 'M0003009',
        queryId: 'M0003009_ExecDonePack',
        queryParams: params,
        target: null,
      };

      let resp = await this.$axios.api.search(searchParam);
      //console.log('API Response:', resp.data);
      //this.$toast('info',resp.length);
      if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
        this.$toast('error', resp[0].errormessage);
      } else if (resp != null && resp.length > 0 && !_.isNil(resp[0].message)) {
        this.$toast('info', resp[0].message);
        this.searchFieldClick(this.clickedModelNo);
      } else {
        this.$toast('success', `Pack No ${addItems.length}건이 인계 완료 되었습니다.`);
        this.searchFieldClick(this.clickedModelNo);
      }
    },
    setPackNoFocus(r) {
      this.grid3View.setCurrent({ dataRow: r, fieldName: 'packQrno' });
      setTimeout(() => {
        this.grid3View.showEditor();
      }, 100);
    },
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackGrid1(grid, cell) {
      let rtn = {};
      let ds = grid.getDataSource();
      const fieldName = cell.index.fieldName;
      if (fieldName != '상태' && fieldName != '구분' && cell.value > 0) {
        rtn['renderer'] = {
          type: 'link',
          urlCallback: function (grid, cell) {},
          titleField: 'fieldName',
        };
      }
      return rtn;
    },
    onCellItemClickedGrid1(grid, index, clickData) {
      if (clickData.type == 'link' && clickData.url) {
        try {
          this.searchFieldClick(clickData.fieldName);
        } catch (error) {
          console.error('출하검사tab2 grid1 search', error);
          return false;
        }

        return false;
      }
    },
    onCellEditedGrid3(grid, itemIndex, row, field) {
      this.grid3View.commit();
      let newValue = this.$utils.korToEng(grid.getValue(row, 'packQrno'));
      grid.setValue(row, 'packQrno', newValue);
      this.checkPackNo(row, grid.getValue(row, 'packQrno'));
    },
    async checkPackNo(row, packNo) {
      let findCount = this.findRowInGrid3(packNo);
      if (findCount > 1) {
        this.$toast('info', '해당 Pack No. 중복되었습니다.');
        this.grid3View.setValue(row, 'packQrno', '');
        this.setPackNoFocus(row);
      } else {
        findCount = this.findRowInGrid2(packNo);
        console.log(findCount);
        let focusRow = row;
        if (findCount !== 0) {
          this.grid3View.setValue(row, '일치여부', '일치');
          let runCount = this.findRunInGrid3(this.grid2View.getValue(findCount.itemIndex,'runId'));
          console.log(runCount);
          this.grid3View.setValue(row, 'runId', this.grid2View.getValue(findCount.itemIndex,'runId'));  //2025.7.14 조다슬 요청
          // if (runCount === 0) { 2025.7.14 조다슬 요청
          //   this.grid3View.setValue(row, 'runId', this.grid2View.getValue(findCount.itemIndex,'runId'));
          // }  
          // else {
          //   this.$toast('warning', 'Run NO당 1개 PACK NO만\n 샘플인계 해야 합니다');            
          //   this.grid3View.setValue(row, 'packQrno', '');            
          //   this.grid3View.setValue(row, '일치여부', '');            
          //   this.grid3View.setValue(row, 'RunId', '');
          //   this.setPackNoFocus(row);
          //   return;
          // }
          if (row + 1 < this.data3Provider.getRowCount()) {
            //다음 로우가 있다면
            focusRow = row + 1;
          } else {
            this.data3Provider.addRow({});
            focusRow = row + 1;
          }
        } else {
          this.$toast('warning', '해당 Pack No.가 왼쪽 요청 SAMPLE PACK List에 존재하지 않습니다.');
          this.grid3View.setValue(row, '일치여부', '불일치');
        }
        this.setPackNoFocus(focusRow);
      }
    },
    findRowInGrid2(packNo) {
      if (_.isEmpty(packNo)) return 0;

      let fields = ['packNo'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      let options = {
        fields: fields,
        value: packNo,
        startIndex: startIndex,
        startFieldIndex: startFieldIndex,
        allFields: true,
        wrap: false,
        caseSensitive: false,
        partialMatch: false,
      };
      let index = this.grid2View.searchCell(options);
      if (index == null) findCount = 0;
      else findCount = index;

      return findCount;
    },
    findRowInGrid3(packNo) {
      if (_.isEmpty(packNo)) return 0;
      let fields = ['packQrno'];

      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: packNo,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.grid3View.searchCell(options);
        if (index == null) break;
        
        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        findCount++;
      }
      return findCount;
    },
    findRunInGrid3(runId) {
      if (_.isEmpty(runId)) return 0;

      let fields = ['RunId'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: runId,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.grid3View.searchCell(options);
        if (index == null) break;
        
        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        findCount++;
      }
      return findCount;
    },
  },
};
</script>
