/** * 품질검사 > Job Change > 검사의뢰(제조) */
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3">
          <div class="form-floating prc_name">
            <select class="form-select label-80" id="floatingSelect" aria-label="Floating label select example" v-model="srchInfo.menu2Item" @change="onItemChange">
              <option v-for="item in inspectionItems" :key="item.value" :value="item">
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">검사항목</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-120" id="floating" placeholder="Period" v-model="srchInfo.menu2Item.period" readonly />
            <label for="floating">검사(측정) 주기</label>
          </div>
        </b-col>
        <b-col cols="3" class="period">
          <div class="form-floating me-1">
            <date-picker label="시작일" v-model="params.startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="종료일" v-model="params.endDate" />
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
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="User" v-model="params.user" />
            <label for="floating">의뢰자</label>
          </div>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-80" id="floating" placeholder="CellId" ref="cellId" v-model="params.cellId" :disabled="isDisabled" name="cellId" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter" />
            <label for="floating">QR code(Cell)</label>
          </div>
        </b-col>
        <b-col cols="3" v-if="isSubItemShow">
          <label v-for="(item, index) in inspectionSubItems" :key="index" v-bind:class="{ 'ms-2': index == 0, 'ms-3 me-3': index != 0 }"><input type="radio" :id="item.key" v-model="params.subItemValue" :value="item.value" class="me-1" />{{ item.text }}</label>
        </b-col>
      </div>
    </div>
    <div class="grid_box material_box">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button @click="deleteClick">삭제</b-button>
          <b-button class="main" @click="saveClick">저장</b-button>
          <b-button class="main" @click="inspectionClick">검사의뢰</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="grid" :uid="'grid'" :rows="rows" style="height: 100%" />
      </div>
    </div>
    <CmDialog1 ref="cmDialog1" />
  </div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { useM0008000 } from '@web/store/M0008000.js';

export default {
  name: 'TAB080004',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {},
  watch: {
    'srchInfo.menu2Item'(newVal, oldVal) {
      this.onItemChange();
    },
  },
  setup() {
    const userAuthInfo = useUserAuthInfo();
    const srchInfo = useM0008000();
    return { userAuthInfo, srchInfo };
  },
  data() {
    return {
      oneJudge: ['10', '20', '30', '40', '70', '80'],
      twoJudge: ['50'],
      twoJudgeDiffHeader: [],
      includeUTM: ['10'],
      menuId: 'M0008002',
      params: {
        user: null,
        cellId: null,
        startDate: '',
        endDate: '',
        subItemValue: null,
      },
      inspectionItems: [],
      inspectionSubItems: [],
      isSubItemShow: false,
      mainCode: null,
      grid: null,
      rows: [],
      isProcessing: false,
      isAddProcessing: false,
      isDisabled: true,
      preItem: null,
    };
  },
  computed: {
    gridView() {
      return this.$refs.grid.getGridView();
    },
    dataProvider() {
      return this.$refs.grid.getGridDataProvider();
    },
  },
  created() {
    this.initialize();
    this.initializeGrid();
  },
  async mounted() {
    this.getInspectionItems();
    this.$refs.grid.getGridView().setCheckableExpression("values['진행상태'] = '검사대기'", true);
  },
  beforeUnmount() {},
  methods: {
    initialize() {
      var current = new Date();
      this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      var oneMonthAgo = new Date();
      oneMonthAgo.setMonth(current.getMonth() - 1);
      this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      this.params.user = this.userAuthInfo.loginUserName;
    },
    initializeGrid() {
      this.grid = _.cloneDeep(require(`@web/m0008000/js/TAB080004.js`));
    },
    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },
    handleEnter(event) {
      event.preventDefault(); // 기본 이벤트 방지
      this.getAddList();
    },
    async getInspectionItems() {
      let queryParams = {
        item: '70',
      };

      let param = [
        {
          menuId: this.menuId,
          queryId: 'getInspectionItems',
          callback: (data) => {
            if (data.length > 0) {
              this.mainCode = data[0]['대분류코드'];
            }
            this.$utils.transformData(data, ['value', 'text', 'period'], ['중분류코드', '중분류명', '주기'], this.inspectionItems);
          },
        },
        {
          menuId: this.menuId,
          queryId: 'getInspectionSubItems',
          queryParams: queryParams,
          callback: (data) => {
            this.$utils.transformData(data, ['value', 'text'], ['소분류코드', '소분류명'], this.inspectionSubItems);
          },
        },
      ];
      await this.$axios.api.searchAll(param);
    },
    onItemChange() {
      this.gridView.commit();
      let saveData = this.$refs.grid.getSaveData();
      if (saveData.update.length > 0 || saveData.insert.length > 0) {
        this.$confirm('확인', '저장하지 않은 데이터가 있습니다. 검사항목을 변경하시겠습니까?', (confirmed) => {
          if (confirmed) {
            this.resetGrid();
          } else {
            this.srchInfo.menu2Item = this.preItem;
            return;
          }
        });
      } else {
        this.resetGrid();
      }
    },
    resetGrid() {
      this.preItem = this.srchInfo.menu2Item;
      this.gridView.commit();
      this.dataProvider.clearRows();
      this.isDisabled = false;
      if (this.srchInfo.menu2Item.value == '70') {
        this.isSubItemShow = true;
        if (this.inspectionSubItems != null && this.inspectionSubItems.length > 0) {
          this.params.subItemValue = this.inspectionSubItems[0].value;
        }
      } else {
        this.isSubItemShow = false;
      }

      if (this.includeUTM.includes(this.srchInfo.menu2Item.value)) {
        if (this.gridView.columnByName("utm호기") != null)
          this.gridView.columnByName("utm호기").visible = true;
      } else {
        if (this.gridView.columnByName("utm호기") != null)
          this.gridView.columnByName("utm호기").visible = false;
      }

      if (this.twoJudgeDiffHeader.includes(this.srchInfo.menu2Item.value)) {
        if (this.gridView.columnByName('판정1') != null && this.gridView.columnByName('판정1').header != null) {
          this.gridView.columnByName('판정1').header.text = '전면판정';
        } else if (this.gridView.columnByName('판정2') != null && this.gridView.columnByName('판정2').header != null) {
          this.gridView.columnByName('판정2').header.text = '배면판정';
        }
      } else {
        if (this.gridView.columnByName('판정1') != null && this.gridView.columnByName('판정1').header != null) {
          this.gridView.columnByName('판정1').header.text = '판정1';
        } else if (this.gridView.columnByName('판정2') != null && this.gridView.columnByName('판정2').header != null) {
          this.gridView.columnByName('판정2').header.text = '판정2';
        }
      }
    },
    getAddList() {
      if (this.isAddProcessing) return;
      this.isAddProcessing = true;

      this.$nextTick(async () => {
        if (_.isEmpty(this.srchInfo.menu2Item.value)) {
          const message = `검사항목을 선택하세요`;
          this.$toast('info', message);
          return;
        }

        if (_.isEmpty(this.params.cellId)) {
          const message = `QR code(Cell)을 입력하세요`;
          this.$toast('info', message);
          return;
        }

        if (_.isEmpty(this.params.user)) {
          const message = `의뢰자를 입력하세요`;
          this.$toast('info', message);
          return;
        }

        if (this.srchInfo.menu2Item.value == '70' && _.isEmpty(this.params.subItemValue)) {
          const message = `PF 이형력(전면) 또는 PF 이형력(배면)을 선택하세요.`;
          this.$toast('info', message);
          return;
        }

        let params = {
          mainCode: !_.isEmpty(this.mainCode) ? this.mainCode : '',
          item: !_.isEmpty(this.srchInfo.menu2Item) ? this.srchInfo.menu2Item.value : '',
          user: !_.isEmpty(this.params.user) ? this.params.user : '',
          cellId: !_.isEmpty(this.params.cellId) ? this.params.cellId : '',
          subItem: !_.isEmpty(this.params.subItemValue) ? this.params.subItemValue : '',
        };

        let searchParam = [
          {
            menuId: this.menuId,
            queryId: this.srchInfo.menu2Item.value != '70' ? 'M0008002_Get1' : 'M0008002_Get2',
            queryParams: params,
            callback: (data) => {
              data.map((item) => this.addGridRow(item));
              this.isAddProcessing = false;
              this.$refs.cellId.focus();
              this.$refs.cellId.select();
            },
          },
        ];

        await this.$axios.api.searchAll(searchParam);
      });
      setTimeout(() => {
        this.isAddProcessing = false;
      }, 1000);
    },
    addGridRow(item) {
      if (_.isEmpty(item['runNo'])) {
        const message = `Cell ID에 해당하는 Run No.정보가 없습니다.`;
        this.$toast('info', message);
        return;
      }

      this.gridView.commit();
      this.dataProvider.addRow({
        의뢰일자: item['의뢰일자'],
        convertDate: item['의뢰일자'].substring(0, 8),
        차수: Number(item['차수']),
        대분류코드: item['대분류코드'],
        중분류코드: item['중분류코드'],
        검사측정항목코드: item['검사측정항목코드'],
        검사측정항목: item['검사측정항목'],
        의뢰자: item['의뢰자'],
        model: item['model'],
        runNo: item['runNo'],
        cellId: item['cellId'],
        진행상태: item['진행상태'],
      });

      let itemIndex = this.gridView.getItemCount() - 1;
      this.gridView.setCurrent({ itemIndex: itemIndex });
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        if (_.isEmpty(this.srchInfo.menu2Item.value)) {
          const message = `검사항목을 선택하세요`;
          this.$toast('info', message);
          return;
        }
        if (!this.$utils.validateStartDateEndDate(this.params.startDate, this.params.endDate)) {
          return;
        }

        this.gridView.commit();
        this.dataProvider.clearRows();

        let params = {
          mainCode: this.mainCode != null ? this.mainCode : '',
          item: this.srchInfo.menu2Item != null ? this.srchInfo.menu2Item.value : '',
          startDate: this.params.startDate.toString().replaceAll('-', '') + ' 000000',
          endDate: this.params.endDate.toString().replaceAll('-', '') + ' 235959',
        };

        let searchParam = [
          {
            menuId: this.menuId,
            queryId: 'M0008002_Sch1',
            queryParams: params,
            target: this.rows,
          },
        ];

        await this.$axios.api.searchAll(searchParam);
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    deleteClick() {
      this.gridView.commit();
      const checkedRows = this.gridView.getCheckedRows();
      if (checkedRows.length === 0) {
        this.$toast('info', '삭제할 행을 선택하세요.');
      } else {
        let delItems = [];
        checkedRows.forEach((itemIndex) => {
          if (this.dataProvider.getRowState(itemIndex) === RowState.CREATED) {
            delItems.push(itemIndex);
          } else {
            this.dataProvider.setRowState(itemIndex, RowState.DELETED);
          }
        });
        this.dataProvider.removeRows(delItems);
      }
    },
    async saveClick() {
      this.gridView.commit();
      if (await this.saveData()) {
        this.searchClick();
      }
    },
    async saveData() {
      let result = false;
      let saveData = this.$refs.grid.getSaveData();
      if (saveData.delete.length <= 0 && saveData.insert.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return result;
      }

      let param = {
        menuId: this.menuId,
        delete: [{ queryId: 'M0008002_Delete1', data: saveData.delete }],
        insert: [{ queryId: 'M0008002_Insert1', data: saveData.insert }],
        //update: [{ queryId: 'M0008002_Update1', data: saveData.update }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', '저장되었습니다.');
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    async inspectionClick() {
      let saveData = this.$refs.grid.getSaveData();
      if (saveData.delete.length > 0 || saveData.insert.length > 0) {
        this.$toast('info', '변경된 내용이 있습니다. 저장 후 선택하세요.');
        return;
      }
      this.gridView.commit();
      if (await this.inspectionData()) {
        this.searchClick();
      }
    },
    async inspectionData() {
      let result = false;

      let rows = this.gridView.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return result;
      }

      let jsonRows = this.dataProvider.getJsonRows(0, -1);
      const updated = [];
      rows.forEach((dataRow) => {
        if ('검사대기' == this.dataProvider.getValue(dataRow, '진행상태')) {
          updated.push(jsonRows[dataRow]);
        }
      });

      if (updated.length == 0) {
        this.$toast('info', '모두 검사대기 상태 아닙니다.');
        return result;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: 'M0008002_U_Inspection1', data: updated }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', `검사의뢰 상태로 ${updated.length}건 변경되었습니다.`);
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    setRowStyleCallbackGrid(grid, item, fixed) {
      var ret = {};
      var status = grid.getValue(item.index, '진행상태');
      if (status == '검사의뢰') {
        ret.editable = false;
      }

      return ret;
    },
    setCellStyleCallbackGrid(grid, cell) {
      let rtn = {};
      const fieldName = cell.index.fieldName;
      if (fieldName == 'cellId' || fieldName == 'runNo') {
        rtn['renderer'] = {
          type: 'link',
          urlCallback: function (grid, cell) {},
          titleField: 'fieldName',
        };
      }
      return rtn;
    },
    onCellItemClickedGrid(grid, index, clickData) {
      if (clickData.type == 'link' && clickData.url) {
        let ds = grid.getDataSource();
        let runNo = ds.getValue(clickData.dataRow, 'runNo');
        let cellId = ds.getValue(clickData.dataRow, 'cellId');

        try {
          let searchParams = {
            runNo: runNo,
            cellId: cellId,
          };

          let params = {
            dialogTitle: '작업이력조회',
            height: 450,
            width: 1600,
            popUpSize: 'xl',
            btnConfirm: false,
            gridJs: `M0008001_CellTrack.js`,
            search: { menuId: this.menuId, queryId: 'getCellTrackingInfo', queryParams: searchParams },
          };
          this.$refs.cmDialog1.openDialog(params);
        } catch (error) {
          console.error('공정모니터링 link click error', error);
          return false;
        }
        return false;
      }
    },
  },
};
</script>
