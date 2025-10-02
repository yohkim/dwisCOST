/** * 품질검사 > 출하검사 > 검사진행(품질) */
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3">
          <div class="form-floating prc_name">
            <select class="form-select label-80" id="floatingSelect" aria-label="Floating label select example" v-model="srchInfo.menu3Item" @change="onItemChange">
              <option v-for="item in inspectionItems" :key="item.value" :value="item">
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">검사항목</label>
          </div>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-120" id="floating" placeholder="Period" v-model="srchInfo.menu3Item.period" readonly />
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
        <b-button @click="searchClick" :disabled="isDisabledAfterStart">
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
            <label for="floating">검사자</label>
          </div>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-80" id="floating" placeholder="CellId" ref="cellId" v-model="params.cellId" :disabled="isDisabled" name="cellId" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter" />
            <label for="floating">QR code(Cell)</label>
          </div>
        </b-col>
        <b-col cols="2" v-if="isUtmListShow">
          <div class="form-floating">
            <select class="form-select label-80" id="floatingSelect" aria-label="Floating label select example" v-model="params.utm">
              <option v-for="item in utmList" :key="item.value" :value="item">
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">UTM호기</label>
          </div>
        </b-col>
      </div>
    </div>
    <div class="grid_box material_box">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="fileAttach">시험성적서 첨부/조회</b-button>
          <b-button class="main" @click="saveClick" :disabled="isDisabledAfterStart">저장</b-button>
          <div class="hr"></div>
          <b-button-group class="toggle_btn">
            <b-button :class="{ on: isStartEnabled }" :disabled="!isStartEnabled" @click="actionClick('start')">검사시작</b-button>
            <b-button class="sub" :disabled="!isEndEnabled" @click="updateResultValue">검사결과 일괄업데이트</b-button>
            <b-button :class="{ on: isEndEnabled }" :disabled="!isEndEnabled" @click="actionClick('end')">검사종료</b-button>
          </b-button-group>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="grid" :uid="'grid'" :rows="rows" style="height: 100%" />
      </div>
    </div>
    <FileAttachPopup ref="fileAttachPopup1" />
    <SelectUpdateValue ref="selectUpdateValue" @confirm="handleUpdateValueConfirm" />
    <CmDialog1 ref="cmDialog1" />
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import SelectUpdateValue from '@web/popup/SelectUpdateValue.vue';
import { useM0008000 } from '@web/store/M0008000.js';

export default {
  name: 'TAB080008',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: { SelectUpdateValue },
  watch: {
    'srchInfo.menu3Item'(newVal, oldVal) {
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
      oneJudge: ['10', '20', '30', '50', '70', '80', '90', '95'],
      twoJudge: ['40'],
      twoJudgeDiffHeader: ['60'],
      oneCheckList: ['판정1'],
      twoCheckList: ['판정1', '판정2'],
      twoDiffHeaderCheckList: ['전면판정', '배면판정'],
      includeUTM: ['70'],
      menuId: 'M0008003',
      params: {
        user: null,
        cellId: null,
        startDate: '',
        endDate: '',
        utm: null,
      },
      inspectionItems: [],
      utmList: [],
      mainCode: null,
      grid: null,
      rows: [],
      isStartEnabled: false,
      isEndEnabled: false,
      isProcessing: false,
      isStartProcessing: false,
      isDisabled: true,
      isDisabledAfterStart: false,
      isUtmListShow: false,
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
      this.grid = _.cloneDeep(require(`@web/m0008000/js/TAB080008.js`));
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
      this.findRow(); // cellId 찾기
    },
    async getInspectionItems() {
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
          queryId: 'getUtmList',
          callback: (data) => {
            this.$utils.transformData(data, ['value', 'text'], ['code', 'codeName'], this.utmList);
          },
        },
      ];
      await this.$axios.api.searchAll(param);
    },
    onItemChange() {
      this.gridView.commit();
      let saveData = this.$refs.grid.getSaveData();
      if (saveData.update.length > 0) {
        this.$confirm('확인', '저장하지 않은 데이터가 있습니다. 검사항목을 변경하시겠습니까?', (confirmed) => {
          if (confirmed) {
            this.resetGrid();
          } else {
            this.srchInfo.menu3Item = this.preItem;
            return;
          }
        });
      } else {
        this.resetGrid();
      }
    },
    resetGrid() {
      this.preItem = this.srchInfo.menu3Item;
      this.gridView.resetCheckables();
      this.gridView.setCheckableExpression('1', true);
      this.gridView.commit();
      this.dataProvider.clearRows();
      this.isDisabled = false;
      this.isDisabledAfterStart = false;
      this.isStartEnabled = false;
      this.isEndEnabled = false;
      this.isStartProcessing = false;
      this.isDisabledAfterStart = false;

      if (this.includeUTM.includes(this.srchInfo.menu3Item.value)) {
        this.isUtmListShow = true;
        this.params.utm = null;
        if (this.gridView.columnByName('utm호기') != null) this.gridView.columnByName('utm호기').visible = true;
      } else {
        this.isUtmListShow = false;
        if (this.gridView.columnByName('utm호기') != null) this.gridView.columnByName('utm호기').visible = false;
      }

      if (this.twoJudgeDiffHeader.includes(this.srchInfo.menu3Item.value)) {
        if (this.gridView.columnByName('판정2') != null) {
          this.gridView.columnByName('판정2').editable = true;
        }
        if (this.gridView.columnByName('판정1') != null && this.gridView.columnByName('판정1').header != null) {
          this.gridView.columnByName('판정1').header.text = '전면판정';
        }
        if (this.gridView.columnByName('판정2') != null && this.gridView.columnByName('판정2').header != null) {
          this.gridView.columnByName('판정2').header.text = '배면판정';
        }
      } else if (this.twoJudge.includes(this.srchInfo.menu3Item.value)) {
        if (this.gridView.columnByName('판정2') != null) {
          this.gridView.columnByName('판정2').editable = true;
        }
        if (this.gridView.columnByName('판정1') != null && this.gridView.columnByName('판정1').header != null) {
          this.gridView.columnByName('판정1').header.text = '판정1';
        }
        if (this.gridView.columnByName('판정2') != null && this.gridView.columnByName('판정2').header != null) {
          this.gridView.columnByName('판정2').header.text = '판정2';
        }
      } else {
        if (this.gridView.columnByName('판정2') != null) {
          this.gridView.columnByName('판정2').editable = false;
        }
        if (this.gridView.columnByName('판정1') != null && this.gridView.columnByName('판정1').header != null) {
          this.gridView.columnByName('판정1').header.text = '판정1';
        }
        if (this.gridView.columnByName('판정2') != null && this.gridView.columnByName('판정2').header != null) {
          this.gridView.columnByName('판정2').header.text = '판정2';
        }
      }
    },
    findRow() {
      if (_.isEmpty(this.params.cellId)) return;
      let values = [];
      values.push(this.params.cellId);
      let fields = ['packNo', 'runNo', 'cellId'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: this.params.cellId,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.gridView.searchCell(options);
        if (index == null) break;

        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        if (this.gridView.getValue(index.itemIndex, '진행상태') != '검사완료') {
          this.gridView.checkRow(index.itemIndex, true);
          findCount++;
        }
      }

      if (findCount == 0) {
        const message = `검사의뢰, 검사중 또는 재검사의뢰 중인 Cell ID가 아닙니다.`;
        this.$toast('info', message);
      } else {
        // const message = `Cell ID ${findCount}건이 선택되었습니다.`;
        // this.$toast('info', message);
      }

      this.$refs.cellId.focus();
      this.$refs.cellId.select();
    },
    searchClick() {
      if (this.isProcessing) return;
      if (this.gridView != null) this.gridView.clearCurrent();
      this.isStartEnabled = false;
      this.isEndEnabled = false;
      this.isStartProcessing = false;
      this.isDisabledAfterStart = false;
      this.gridView.resetCheckables();
      this.gridView.setCheckableExpression('1', true);

      this.isProcessing = true;

      this.$nextTick(async () => {
        if (_.isEmpty(this.srchInfo.menu3Item.value)) {
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
          item: this.srchInfo.menu3Item != null ? this.srchInfo.menu3Item.value : '',
          startDate: this.params.startDate.toString().replaceAll('-', '') + ' 000000',
          endDate: this.params.endDate.toString().replaceAll('-', '') + ' 235959',
        };

        let searchParam = [
          {
            menuId: this.menuId,
            queryId: 'M0008003_Sch2',
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
    async saveClick() {
      this.gridView.commit();
      if (await this.saveData()) {
        this.searchClick();
      }
    },
    async saveData() {
      let result = false;
      let saveData = this.$refs.grid.getSaveData();
      if (saveData.update.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return result;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: 'M0008003_Update1', data: saveData.update }],
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
    async actionClick(action) {
      if (action == 'start' && !this.isStartProcessing) {
        let rows = this.gridView.getCheckedRows(false);
        if (rows.length == 0) {
          this.$toast('info', '체크된 내용이 없습니다.');
          return;
        }

        if (_.isEmpty(this.params.user)) {
          this.$toast('info', '검사자를 입력 후 다시 검사시작을 클릭하세요.');
          return;
        }

        if (this.isUtmListShow && (_.isEmpty(this.params.utm) || _.isEmpty(this.params.utm.text))) {
          this.$toast('info', 'UTM호기를 선택하고 다시 검사시작을 클릭하세요.');
          return;
        }

        this.isDisabledAfterStart = true;
        this.isStartProcessing = true;
        this.isStartEnabled = false;

        let current = new Date();
        let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
        let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;
        let cDateTime = cDate + ' ' + cTime;
        this.gridView.setCheckableExpression('0', true);

        rows.forEach((dataRow) => {
          if (this.dataProvider.getValue(dataRow, '진행상태') != '검사완료') {
            this.dataProvider.setValue(dataRow, '검사자', this.params.user);
            this.dataProvider.setValue(dataRow, '검사시작', cDateTime);
            this.dataProvider.setValue(dataRow, '진행상태', '검사중');
            if (this.isUtmListShow && !_.isEmpty(this.params.utm) && !_.isEmpty(this.params.utm.text)) {
              this.dataProvider.setValue(dataRow, 'UTM호기', this.params.utm.text);
            }
          }
        });

        this.gridView.commit();
        let saveData = this.$refs.grid.getSaveData();
        if (saveData.update.length <= 0) {
          this.isEndEnabled = true;
          return;
        }

        let param = {
          menuId: this.menuId,
          update: [{ queryId: 'M0008003_Update2', data: saveData.update }],
        };
        await this.$axios.api.saveData(param);

        this.isEndEnabled = true;
      } else if (action === 'end' && this.isStartProcessing) {
        this.gridView.clearCurrent();
        this.gridView.commit();
        let rows = this.gridView.getCheckedRows(false);
        let jsonRows = this.gridView.getJsonRows(0, -1);
        let isEmpty = false;
        rows.forEach((dataRow) => {
          if (this.oneJudge.includes(this.srchInfo.menu3Item.value) && !this.$utils.isRequiredFieldsFilled(jsonRows[dataRow], this.oneCheckList)) {
            isEmpty = true;
          } else if (!this.oneJudge.includes(this.srchInfo.menu3Item.value) && !this.$utils.isRequiredFieldsFilled(jsonRows[dataRow], this.twoCheckList)) {
            isEmpty = true;
          }
        });

        if (isEmpty) {
          if (this.twoJudgeDiffHeader.includes(this.srchInfo.menu3Item.value)) {
            this.$toast('info', this.twoDiffHeaderCheckList.join() + ' 필수 입력입니다.');
          } else if (this.twoJudge.includes(this.srchInfo.menu3Item.value)) {
            this.$toast('info', this.twoCheckList.join() + ' 필수 입력입니다.');
          } else {
            this.$toast('info', this.oneCheckList.join() + ' 필수 입력입니다.');
          }
          return;
        }

        let current = new Date();
        let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
        let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;
        let cDateTime = cDate + ' ' + cTime;
        rows.forEach((dataRow) => {
          if (this.dataProvider.getValue(dataRow, '진행상태') == '검사중') {
            this.dataProvider.setValue(dataRow, '검사종료', cDateTime);
            this.dataProvider.setValue(dataRow, '진행상태', '검사완료');
          }
        });

        this.gridView.commit();
        let saveData = this.$refs.grid.getSaveData();
        if (saveData.update.length <= 0) {
          this.gridView.resetCheckables();
          this.isEndEnabled = false;
          this.isStartProcessing = false;
          this.isDisabledAfterStart = false;
          return;
        }

        let param = {
          menuId: this.menuId,
          update: [{ queryId: 'M0008003_Update3', data: saveData.update }],
        };
        await this.$axios.api.saveData(param);

        this.gridView.resetCheckables();
        this.isEndEnabled = false;
        this.isStartProcessing = false;
        this.isDisabledAfterStart = false;
        this.searchClick();
      }
    },
    updateResultValue() {
      this.gridView.clearCurrent();
      this.gridView.commit();

      let params = {
        popUpSize: 'lg',
        popUpTitle: '검사결과 일괄업데이트 선택',
        tabId: this.tabId,
        gridJs: this.twoJudgeDiffHeader.includes(this.srchInfo.menu3Item.value) ? 'TAB080002DiffHeaderPopup' : 'TAB080002Popup',
      };
      this.$refs.selectUpdateValue.openDialog(params);
    },
    handleUpdateValueConfirm(params) {
      let batchResults = params.jsonRows[0];

      let rows = this.gridView.getCheckedRows(false);
      let count = 0;
      rows.forEach((dataRow) => {
        if (this.dataProvider.getValue(dataRow, '진행상태') != '검사완료') {
          if (this.twoJudge.includes(this.srchInfo.menu3Item.value) || this.twoJudgeDiffHeader.includes(this.srchInfo.menu3Item.value)) {
            if (!_.isEmpty(batchResults['판정1']) || !_.isEmpty(batchResults['판정2']) || !_.isEmpty(batchResults['특이사항'])) {
              count++;
            }
            let col = '판정1';
            if (!_.isEmpty(batchResults[col])) this.dataProvider.setValue(dataRow, col, batchResults[col]);
            col = '판정2';
            if (!_.isEmpty(batchResults[col])) this.dataProvider.setValue(dataRow, col, batchResults[col]);
            col = '특이사항';
            if (!_.isEmpty(batchResults[col])) this.dataProvider.setValue(dataRow, col, batchResults[col]);
          } else {
            if (!_.isEmpty(batchResults['판정1']) || !_.isEmpty(batchResults['특이사항'])) {
              count++;
            }
            let col = '판정1';
            if (!_.isEmpty(batchResults[col])) this.dataProvider.setValue(dataRow, col, batchResults[col]);
            col = '특이사항';
            if (!_.isEmpty(batchResults[col])) this.dataProvider.setValue(dataRow, col, batchResults[col]);
          }
        }
      });

      if (count > 0) {
        this.$toast('info', `검사결과 ${count}건 변경되었습니다.`);
      }
    },
    fileAttach() {
      let rows = this.gridView.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다. 동일한 검사자를 선택하거나 한개만 선택하세요.');
        return;
      }

      let inspectionUser = this.gridView.getValue(rows[0], '검사자');
      if (_.isEmpty(inspectionUser)) {
        this.$toast('info', '동일한 검사자가 있는 행을 선택하세요.');
        return;
      }

      var isSame = true;
      rows.forEach((dataRow) => {
        if (inspectionUser != this.gridView.getValue(dataRow, '검사자')) {
          isSame = false;
        }
      });

      //검사항목, 검사자 - key...
      if (!isSame) {
        this.$toast('info', '동일한 검사자를 선택하거나 한개만 선택하세요.');
        return;
      }
      let curGroupId = 'M0008003' + '_' + this.srchInfo.menu3Item.value + '_' + inspectionUser;
      this.curGroupId = this.$refs.fileAttachPopup1.openDialog({
        dialogTitle: '시험성적서 첨부/조회',
        groupId: curGroupId,
      });
    },

    setRowStyleCallbackGrid(grid, item, fixed) {
      var ret = {};
      if (this.isStartProcessing && !item.checked) {
        ret.editable = false;
      }

      var status = grid.getValue(item.index, '진행상태');
      if (status == '검사완료') {
        ret.editable = false;
      }
      return ret;
    },
    onItemCheckedGrid(grid, itemIndex, checked) {
      let rows = this.gridView.getCheckedRows(false);
      let count = 0;
      rows.forEach((dataRow) => {
        if (this.dataProvider.getValue(dataRow, '진행상태') != '검사완료') {
          count++;
        }
      });

      if (rows.length > 0 && count > 0) {
        this.isStartEnabled = true;
      } else {
        this.isStartEnabled = false;
      }
    },
    onItemAllCheckedGrid(grid, checked) {
      if (this.isStartProcessing) return;

      let rows = this.gridView.getCheckedRows(false);
      let count = 0;
      rows.forEach((dataRow) => {
        if (this.dataProvider.getValue(dataRow, '진행상태') != '검사완료') {
          count++;
        }
      });
      if (rows.length > 0 && checked && count > 0) {
        this.isStartEnabled = true;
      } else {
        this.isStartEnabled = false;
      }
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
