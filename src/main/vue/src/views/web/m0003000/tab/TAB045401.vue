/** 제조 실적 입력 > 포장/출하 > 출하 대기 > Pallet 목록 */
<template>
  <div>
    <b-row class="row">
      <b-col cols="6">
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
      </b-col>
      <b-col cols="6">
        <div class="worker_wrap">
          <div class="title">입력 정보</div>
          <div class="row worker_info">
            <b-col cols="5">
              <div class="form-floating">
                <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="User" v-model="params.user1" />
                <label for="floating">발행자</label>
              </div>
            </b-col>
            <b-col cols="5">
              <div class="form-floating">
                <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="User" v-model="params.user2" />
                <label for="floating">승인자</label>
              </div>
            </b-col>
          </div>
        </div>
      </b-col>
    </b-row>
    <div class="grid_box material_box">
      <div class="left_box">
        <div class="title">Pallet List</div>
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="printLabel">라벨인쇄</b-button>
          <b-button class="second" @click="previewPrint">미리보기</b-button>
          <b-button class="second" @click="storageClick">보관 구역</b-button>
          <b-button class="main" @click="dismantleClick">해체</b-button>
        </div>
      </div>
      <div class="grid-border-none" style="height: calc(35% - 40px)">
        <RealGrid ref="grid1" class="brd_b" :uid="'grid1'" :rows="grid1Rows" style="height: 100%" />
      </div>
      <b-row class="row" style="height: calc(65%)">
        <b-col cols="6" class="brd_r">
          <div class="left_box">
            <div class="title">Box List</div>
          </div>
          <div class="grid-border-none">
            <RealGrid ref="grid2" :uid="'grid2'" :rows="grid2Rows" style="height: 100%" />
          </div>
        </b-col>
        <b-col cols="6">
          <div class="left_box">
            <div class="title">변경 List</div>
            <div class="btn_wrap ms-auto">
              <label class="ms-2"><input type="radio" v-bind:value="gubunList[0]" v-model="params.gubun" class="me-1" />제외</label>
              <label class="ms-3 me-3"><input type="radio" v-bind:value="gubunList[1]" v-model="params.gubun" class="me-1" />추가</label>
              <b-button class="main me-2" @click="saveClick">저장</b-button>
            </div>
          </div>
          <div class="grid-border-none">
            <RealGrid ref="grid3" :uid="'grid3'" :rows="grid3Rows" style="height: 100%" />
          </div>
        </b-col>
      </b-row>
    </div>
    <StorageArea ref="storageAreaPopup" @confirm="searchClick" />
    <PalletLabel ref="palletLabel" />
  </div>
</template>

<script>
import { useM0003009 } from '@web/store/M0003009.js';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import StorageArea from '../../popup/StorageArea.vue';
import PalletLabel from '@web/popup/PalletLabel.vue';

export default {
  name: 'DW_TAB045401',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {
    StorageArea,
    PalletLabel,
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
      grid1Rows: [],
      grid1: null,
      grid2Rows: [],
      grid2: null,
      grid3Rows: [],
      grid3: null,
      params: {
        startDate: '',
        endDate: '',
        gubun: '제외',
        user1: '',
        user2: '',
      },
      isProcessing: false,
      gubunList: ['제외', '추가'],
      clickedPalletNo: null,
      clickedModel: null,
      emptyRow: { palletNo: '', 대포장Qrno: '', model: '', code: '', 수량: '', 검사결과: '', NG사유: '', si의뢰일자: '', cell수량: '', gubun: '' },
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
      this.grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB045401_1.js`));
      this.grid2 = _.cloneDeep(require(`@web/m0003000/js/TAB045401_2.js`));
      this.grid3 = _.cloneDeep(require(`@web/m0003000/js/TAB045401_3.js`));
    },
    async getSelectOptions() {
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      this.params.user1 = this.userAuthInfo.loginUserName;
      this.params.user2 = this.userAuthInfo.loginUserName;
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
    storageClick() {
      const checkedRows = this.grid1View.getCheckedRows();
      if (checkedRows.length > 1) {
        this.$toast('info', '보관 구역을 선택할 Pallet No 한 개만 선택하세요.');
      } else if (checkedRows.length == 1) {
        let params = {
          palletNo: this.data1Provider.getValue(checkedRows[0], 'palletNo'),
        };
        this.$refs.storageAreaPopup.openDialog(params);
      } else {
        this.$refs.storageAreaPopup.openDialog();
      }
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

        let searchParam = [
          {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch11',
            queryParams: params,
            target: this.grid1Rows,
          },
        ];

        await this.$axios.api.searchAll(searchParam);
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    searchPalletNoClick(palletNo, model) {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.clearGridOther();
        this.clickedPalletNo = palletNo;
        this.clickedModel = model;
        let params = {
          palletNo: palletNo,
        };

        let searchParam = [
          {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch12',
            queryParams: params,
            target: this.grid2Rows,
          },
        ];

        await this.$axios.api.searchAll(searchParam);

        for (let i = 0; i < 20; i++) {
          this.data3Provider.addRow({});
        }
        this.setBoxNoFocus(0);
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    searchAllClick() {
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

        let params2 = {
          palletNo: this.clickedPalletNo,
        };

        let searchParam = [
          {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch11',
            queryParams: params,
            target: this.grid1Rows,
          },
          {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch12',
            queryParams: params2,
            target: this.grid2Rows,
          },
        ];

        await this.$axios.api.searchAll(searchParam);

        for (let i = 0; i < 20; i++) {
          this.data3Provider.addRow({});
        }
        this.setBoxNoFocus(0);
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    async saveClick() {
      this.grid3View.commit();
      if (await this.saveData()) {
        this.searchAllClick();
      }
    },
    async saveData() {
      let result = false;
      let saveData = this.$refs.grid3.getSaveData();
      if (saveData.delete.length <= 0 && saveData.insert.length <= 0 && saveData.update.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return result;
      }

      const removeItems = [];
      const addItems = [];
      const ngItems = [];
      saveData.insert.forEach((item) => {
        if (!_.isEmpty(item['대포장Qrno']) && item['검사결과'] == 'NG') {
          ngItems.push(item['대포장Qrno']);
        } else if (!_.isEmpty(item['대포장Qrno']) && item['검사결과'] != 'NG' && item['gubun'] == '제외') {
          removeItems.push(item['대포장Qrno']);
        } else if (!_.isEmpty(item['대포장Qrno']) && item['검사결과'] != 'NG' && item['gubun'] == '추가') {
          addItems.push(item['대포장Qrno']);
        }
      });

      if (ngItems.length > 0) {
        this.$toast('info', '검사결과가 NG인 건이 있습니다. 저장이 진행되지 않습니다.');
        return result;
      }

      if (removeItems.length <= 0 && addItems.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return result;
      }

      if (addItems.length > 0 && (_.isEmpty(this.params.user1) || _.isEmpty(this.params.user2))) {
        this.$toast('info', '발행자 또는 승인자를 입력 후 다시 저장을 누르세요.');
        return result;
      }

      if (removeItems.length > 0) {
        let params = {
          palletNo: this.clickedPalletNo,
          user1: this.params.user1,
          user2: this.params.user2,
          boxNoList: removeItems.join(';'),
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExecRemove',
          queryParams: params,
          target: null,
        };

        const resp = await this.$axios.api.search(searchParam);
        if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
          this.$toast('error', resp[0].errormessage);
        } else {
          this.$toast('success', `${removeItems.length}건 제거되었습니다.`);
        }
        result = true;
      }

      if (addItems.length > 0) {
        let params = {
          palletNo: this.clickedPalletNo,
          user1: this.params.user1,
          user2: this.params.user2,
          boxNoList: addItems.join(';'),
        };
        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExecAdd',
          queryParams: params,
          target: null,
        };

        const resp = await this.$axios.api.search(searchParam);
        if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
          this.$toast('error', resp[0].errormessage);
        } else {
          this.$toast('success', `${addItems.length}건 추가되었습니다.`);
        }
        result = true;
      }

      return result;
    },
    async dismantleClick() {
      let rows = this.grid1View.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return;
      }

      this.$confirm('확인', '선택된 항목을 해체하시겠습니까?', async (confirmed) => {
        if (confirmed) {
          let jsonRows = this.data1Provider.getJsonRows(0, -1);
          const removeItems = [];
          rows.forEach((dataRow) => {
            removeItems.push(jsonRows[dataRow].palletNo);
          });

          let params = {
            palletNoList: removeItems.join(';'),
          };
          let searchParam = {
            menuId: 'M0003009',
            queryId: 'M0003009_ExecDismantle',
            queryParams: params,
            target: null,
          };

          const resp = await this.$axios.api.search(searchParam);
          if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
            this.$toast('error', resp[0].errormessage);
          } else {
            this.$toast('success', `${removeItems.length}건 해체되었습니다.`);
          }
          this.searchClick();
        }
      });
    },
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    onDataLoadComplatedGrid3(grid) {},
    setRowStyleCallbackGrid3(grid, item, fixed) {
      var ret = {};
      var status = grid.getValue(item.index, '검사결과');
      var reason = grid.getValue(item.index, 'NG사유');
      if (status == 'NG' && reason == '중복BoxNo') {
        ret.style = { background: '#FAFAD2' };
      } else if (status == 'NG') {
        ret = 'red';
      }
      return ret;
    },
    setCellStyleCallbackGrid1(grid, cell) {
      let rtn = {};
      let ds = grid.getDataSource();
      const fieldName = cell.index.fieldName;
      if (fieldName == 'palletNo') {
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
        let ds = grid.getDataSource();
        var value = ds.getValue(clickData.dataRow, clickData.fieldName);
        var model = ds.getValue(clickData.dataRow, 'model');
        try {
          this.searchPalletNoClick(value, model);
        } catch (error) {
          console.error('출하대기 grid1 search', error);
          return false;
        }

        return false;
      }
    },
    onCellEditedGrid3(grid, itemIndex, row, field) {
      this.grid3View.commit();
      let newValue = this.$utils.korToEng(grid.getValue(row, '대포장Qrno'));
      if (_.isEmpty(newValue)) {
        grid.setValues(row, this.emptyRow);
        this.setBoxNoFocus(row);
      } else {
        grid.setValue(row, '대포장Qrno', newValue);
        this.checkBoxNo(row, grid.getValue(row, '대포장Qrno'));
      }
    },
    async checkBoxNo(row, boxNo) {
      let findBoxCount = this.findRowInGrid3(boxNo);
      if (findBoxCount > 1) {
        this.$toast('info', '해당 Box No. 중복되었습니다.');
        this.grid3View.setValue(row, '검사결과', 'NG');
        this.grid3View.setValue(row, 'NG사유', '중복BoxNo');
        let focusRow = row;
        if (row + 1 < this.data3Provider.getRowCount()) {
          let ci = this.data3Provider.getValue(row + 1, '대포장Qrno');
          if (ci === undefined) {
            focusRow = row + 1;
          }
        }
        this.setBoxNoFocus(focusRow);
        return;
      }
      let params = {
        boxNo: boxNo,
      };

      let searchParam = [
        {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch13',
          queryParams: params,
          target: null,
        },
      ];

      let rslt = await this.$axios.api.searchAll(searchParam);
      let info = rslt[0];
      let focusRow = row;

      this.grid3View.setValue(row, 'gubun', this.params.gubun);

      if (_.isEmpty(info) || info.length == 0) {
        this.$toast('warning', 'Box No 정보가 없습니다.');
        this.grid3View.setValue(row, '검사결과', 'NG');
        this.grid3View.setValue(row, 'NG사유', 'Box정보없음');
      } else {
        let findCount = this.findRowInGrid2(info[0].palletNo);
        if (this.params.gubun == '제외') {
          if (findCount > 0) {
            this.grid3View.setValues(row, info[0]);
            if (this.clickedModel != info[0].model) {
              this.$toast('warning', '해당 Box No.의 Model과 왼쪽 Box List의 Model이 동일하지 않습니다.');
              this.grid3View.setValue(row, '검사결과', 'NG');
              this.grid3View.setValue(row, 'NG사유', 'Model불일치');
            }
          } else {
            this.$toast('warning', '해당 Box No.의 Pallet No.가 왼쪽 Box List와 동일하지 않습니다.');
            this.grid3View.setValues(row, info[0]);
            this.grid3View.setValue(row, '검사결과', 'NG');
            this.grid3View.setValue(row, 'NG사유', 'PalletNo불일치');
          }
        } else {
          if (findCount > 0) {
            this.$toast('warning', '해당 Box No.의 Pallet No.가 왼쪽 Box List에 이미 존재합니다.');
            this.grid3View.setValues(row, info[0]);
            this.grid3View.setValue(row, '검사결과', 'NG');
            this.grid3View.setValue(row, 'NG사유', '존재하는Box');
          } else if (_.isEmpty(info[0].palletNo) || info[0].palletNo == '-') {
            this.grid3View.setValues(row, info[0]);
            if (this.clickedModel != info[0].model) {
              this.$toast('warning', '해당 Box No.의 Model과 왼쪽 Box List의 Model이 동일하지 않습니다.');
              this.grid3View.setValue(row, '검사결과', 'NG');
              this.grid3View.setValue(row, 'NG사유', 'Model불일치');
            }
          } else if (!_.isEmpty(info[0].palletNo) && info[0].palletNo != '-') {
            this.$toast('warning', '해당 Box No.는 Pallet No.가 이미 있어 추가할 수 없습니다.');
            this.grid3View.setValues(row, info[0]);
            this.grid3View.setValue(row, '검사결과', 'NG');
            this.grid3View.setValue(row, 'NG사유', 'PalletNo존재');
          } else {
            this.$toast('warning', '해당 Box No.는 추가할 수 없습니다.');
            this.grid3View.setValues(row, info[0]);
            this.grid3View.setValue(row, '검사결과', 'NG');
            this.grid3View.setValue(row, 'NG사유', '원인미상');
          }
        }
      }

      if (row + 1 < this.data3Provider.getRowCount()) {
        //다음 로우가 있다면
        let ci = this.data3Provider.getValue(row + 1, '대포장Qrno');
        if (ci === undefined) {
          focusRow = row + 1;
        }
      }

      this.setBoxNoFocus(focusRow);
    },
    setBoxNoFocus(r) {
      this.grid3View.setCurrent({ dataRow: r, fieldName: '대포장Qrno' });
      setTimeout(() => {
        this.grid3View.showEditor();
      }, 100);
    },
    findRowInGrid2(palletNo) {
      if (_.isEmpty(palletNo)) return 0;

      let fields = ['palletNo'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      let options = {
        fields: fields,
        value: palletNo,
        startIndex: startIndex,
        startFieldIndex: startFieldIndex,
        allFields: true,
        wrap: false,
        caseSensitive: false,
        partialMatch: false,
      };
      let index = this.grid2View.searchCell(options);
      if (index == null) findCount = 0;
      else findCount = 1;

      return findCount;
    },
    findRowInGrid3(boxNo) {
      if (_.isEmpty(boxNo)) return 0;

      let fields = ['대포장Qrno'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: boxNo,
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
    async printLabel() {
      const grid = this.grid1View;
      const checkedRows = grid.getCheckedRows();

      if (checkedRows.length == 0) {
        this.$toast('info', '라벨인쇄할 행을 먼저 선택해주세요.');
        return;
      }
      const ds = grid.getDataSource();
      const row = ds.getJsonRow(checkedRows[0]);

      this.$refs.palletLabel.printLabel(row);
    },
    async previewPrint() {
      const grid = this.grid1View;
      const checkedRows = grid.getCheckedRows();

      if (checkedRows.length == 0) {
        this.$toast('info', '라벨인쇄할 행을 먼저 선택해주세요.');
        return;
      }
      const ds = grid.getDataSource();
      const row = ds.getJsonRow(checkedRows[0]);

      this.$refs.palletLabel.openDialog(row);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .rg-editor-container {
  > input {
    z-index: 1000 !important;
  }
}
::v-deep .grid_box {
  &.material_box {
    height: calc(100% - 64px);
  }
}
::v-deep .worker_wrap {
  margin: 0px;
}
</style>
