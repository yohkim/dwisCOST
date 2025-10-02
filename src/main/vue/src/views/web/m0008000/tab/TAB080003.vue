/** * 품질검사 > 공정모니터링 > 검사결과확정(제조,품질) */
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3">
          <div class="form-floating prc_name">
            <select class="form-select label-80" id="floatingSelect" aria-label="Floating label select example" v-model="srchInfo.menu1Item" @change="onItemChange">
              <option v-for="item in inspectionItems" :key="item.value" :value="item">
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">검사항목</label>
          </div>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-120" id="floating" placeholder="Period" v-model="srchInfo.menu1Item.period" readonly />
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
            <label for="floating">확인자</label>
          </div>
        </b-col>
      </div>
    </div>
    <div class="grid_box material_box">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="fileAttach">시험성적서 조회</b-button>
          <b-button class="main" @click="saveClick">저장</b-button>
          <div class="hr"></div>
          <b-button class="main" :disabled="isButtonDisabled" @click="inspectionClick('retry')">재검사의뢰</b-button>
          <b-button class="main ms-2" :disabled="isButtonDisabled" @click="inspectionClick('confirm')">검사결과확정</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="grid" :uid="'grid'" :rows="rows" style="height: 100%" />
      </div>
    </div>
    <FileAttachPopup ref="fileAttachPopup1" />
    <CmDialog1 ref="cmDialog1" />
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { useM0008000 } from '@web/store/M0008000.js';

export default {
  name: 'TAB080003',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {},
  watch: {
    'srchInfo.menu1Item'(newVal, oldVal) {
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
      oneJudge: ['10', '20', '40', '50', '70', '80', '90'],
      twoJudge: ['30'],
      twoJudgeDiffHeader: ['60'],
      oneCheckList: ['판정1'],
      twoCheckList: ['판정1', '판정2'],
      twoDiffHeaderCheckList: ['전면판정', '배면판정'],
      includeUTM: ['70'],
      menuId: 'M0008001',
      inspectionQueryMap: {
        retry: 'M0008001_U_Inspection2',
        confirm: 'M0008001_U_Inspection3',
      },
      params: {
        user: null,
        cellId: null,
        startDate: '',
        endDate: '',
      },
      inspectionItems: [],
      mainCode: null,
      grid: null,
      rows: [],
      isProcessing: false,
      isButtonDisabled: true,
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
      this.grid = _.cloneDeep(require(`@web/m0008000/js/TAB080003.js`));
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
            this.srchInfo.menu1Item = this.preItem;
            return;
          }
        });
      } else {
        this.resetGrid();
      }
    },
    resetGrid() {
      this.preItem = this.srchInfo.menu1Item;
      this.gridView.commit();
      this.dataProvider.clearRows();

      if (this.includeUTM.includes(this.srchInfo.menu1Item.value)) {
        if (this.gridView.columnByName('utm호기') != null) this.gridView.columnByName('utm호기').visible = true;
      } else {
        if (this.gridView.columnByName('utm호기') != null) this.gridView.columnByName('utm호기').visible = false;
      }

      if (this.twoJudgeDiffHeader.includes(this.srchInfo.menu1Item.value)) {
        if (this.gridView.columnByName('판정2') != null) {
          this.gridView.columnByName('판정2').editable = true;
        }
        if (this.gridView.columnByName('판정1') != null && this.gridView.columnByName('판정1').header != null) {
          this.gridView.columnByName('판정1').header.text = '전면판정';
        }
        if (this.gridView.columnByName('판정2') != null && this.gridView.columnByName('판정2').header != null) {
          this.gridView.columnByName('판정2').header.text = '배면판정';
        }
      } else if (this.twoJudge.includes(this.srchInfo.menu1Item.value)) {
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
    searchClick() {
      if (this.isProcessing) return;
      if (this.gridView != null) this.gridView.clearCurrent();

      this.isProcessing = true;

      this.$nextTick(async () => {
        if (_.isEmpty(this.srchInfo.menu1Item.value)) {
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
          item: this.srchInfo.menu1Item != null ? this.srchInfo.menu1Item.value : '',
          startDate: this.params.startDate.toString().replaceAll('-', '') + ' 000000',
          endDate: this.params.endDate.toString().replaceAll('-', '') + ' 235959',
        };

        let searchParam = [
          {
            menuId: this.menuId,
            queryId: 'M0008001_Sch3',
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
      let isEmpty = false;
      saveData.update.forEach((item) => {
        if (this.oneJudge.includes(this.srchInfo.menu1Item.value) && !this.$utils.isRequiredFieldsFilled(item, this.oneCheckList)) {
          isEmpty = true;
        } else if (!this.oneJudge.includes(this.srchInfo.menu1Item.value) && !this.$utils.isRequiredFieldsFilled(item, this.twoCheckList)) {
          isEmpty = true;
        }
      });
      if (isEmpty) {
        if (this.twoJudgeDiffHeader.includes(this.srchInfo.menu1Item.value)) {
          this.$toast('info', this.twoDiffHeaderCheckList.join() + ' 필수 입력입니다. 저장에 실패했습니다.');
        } else if (this.twoJudge.includes(this.srchInfo.menu1Item.value)) {
          this.$toast('info', this.twoCheckList.join() + ' 필수 입력입니다. 저장에 실패했습니다.');
        } else {
          this.$toast('info', this.oneCheckList.join() + ' 필수 입력입니다. 저장에 실패했습니다.');
        }
        return result;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: 'M0008001_Update1', data: saveData.update }],
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
    async inspectionClick(type) {
      let saveData = this.$refs.grid.getSaveData();
      if (saveData.update.length > 0) {
        this.$toast('info', '변경된 내용이 있습니다. 저장 후 선택하세요.');
        return;
      }
      this.gridView.commit();
      if (await this.inspectionData(type)) {
        this.searchClick();
      }
    },
    async inspectionData(type) {
      let result = false;

      let rows = this.gridView.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return;
      }

      let current = new Date();
      let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
      let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;
      let cDateTime = cDate + ' ' + cTime;
      rows.forEach((dataRow) => {
        if ('검사완료' == this.dataProvider.getValue(dataRow, '진행상태')) {
          this.dataProvider.setValue(dataRow, '검사결과확인', this.params.user);
          this.dataProvider.setValue(dataRow, '검사결과확인일시', cDateTime);
        }
      });

      let saveData = this.$refs.grid.getSaveData();
      if (saveData.update.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return result;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: this.inspectionQueryMap[type], data: saveData.update }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        if (type == 'retry') this.$toast('success', `재검사의뢰 상태로 ${saveData.update.length}건 변경되었습니다.`);
        else this.$toast('success', `검사확정 상태로 ${saveData.update.length}건 변경되었습니다.`);
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
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
      let curGroupId = 'M0008001' + '_' + this.srchInfo.menu1Item.value + '_' + inspectionUser;
      this.curGroupId = this.$refs.fileAttachPopup1.openDialog({
        dialogTitle: '시험성적서 첨부/조회',
        groupId: curGroupId,
        isModifyEnabled: false,
      });
    },

    setRowStyleCallbackGrid(grid, item, fixed) {
      var ret = {};
      var status = grid.getValue(item.index, '진행상태');
      if (status == '검사확정') {
        ret.editable = false;
      }
      return ret;
    },

    onItemCheckedGrid(grid, itemIndex, checked) {
      if (checked) {
        if (_.isEmpty(this.params.user)) {
          grid.checkItem(itemIndex, !checked);
          this.$toast('info', '확인자를 입력 후 다시 선택하세요.');
          return;
        }
      }

      let rows = this.gridView.getCheckedRows(false);
      let count = 0;
      rows.forEach((dataRow) => {
        if (this.dataProvider.getValue(dataRow, '진행상태') != '검사확정') {
          count++;
        }
      });

      if (rows.length > 0 && count > 0) {
        this.isButtonDisabled = false;
      } else {
        this.isButtonDisabled = true;
      }
    },

    onItemAllCheckedGrid(grid, checked) {
      let rows = this.gridView.getCheckedRows(false);
      let count = 0;
      rows.forEach((dataRow) => {
        if (this.dataProvider.getValue(dataRow, '진행상태') != '검사확정') {
          count++;
        }
      });
      if (rows.length > 0 && checked && count > 0) {
        this.isButtonDisabled = false;
      } else {
        this.isButtonDisabled = true;
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
