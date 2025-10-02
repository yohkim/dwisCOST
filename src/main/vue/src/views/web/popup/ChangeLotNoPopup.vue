<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="lg" :title="dialogTitle" no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
    <div class="search_box mb-1">
      <b-row class="search_area">
        <b-col cols="4">
          <div class="form-floating">
            <select class="form-select label-80" id="floatingSelect" v-model="oldLotSelectedModel">
              <option v-for="model in modelList" :key="model.value" :value="model">{{ model.text }}</option>
            </select>
            <label for="floatingSelect" class="select">제품유형</label>
          </div>
        </b-col>
        <b-col cols="4">
          <div class="form-floating prc_name">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="curProcess">
              <option v-for="(item, index) in processList" :key="index" :value="item">
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">공정명</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="search"><span class="ico_search"></span>조회</b-button>
      </div>
    </div>
    <div class="grid_box">
      <RealGrid ref="changeLotNoGrid" :uid="'changeLotNoGrid'" :rows="gridRows" style="height: 300px" />
    </div>

    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
      <b-button class="main" block :disabled="isButtonDisabled" @click="confirmClick">선택된 값 적용</b-button>
    </div>
  </b-modal>
</template>

<script>
import { RowState } from 'realgrid';

export default {
  name: 'ChangeLotNoPopup',
  setup() {},
  props: {},
  data() {
    return {
      isOpen: false,
      dialogTitle: '구LotNo 리스트',
      changeLotNoGrid: null,
      gridRows: [],
      isButtonDisabled: true,
      zIndex: 0,
      modelList: [],
      processList: [],
      oldLotSelectedModel: null,
      curProcess: null,
    };
  },
  computed: {
    gridView() {
      return this.$refs.changeLotNoGrid.getGridView();
    },
    dataProvider() {
      return this.$refs.changeLotNoGrid.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  mounted() {},
  methods: {
    initializeGrid() {
      this.changeLotNoGrid = _.cloneDeep(require(`@web/popup/js/ChangeLotNoPopupGrid.js`));
    },
    openDialog(params) {
      this.$nextTick(async () => {
        let param = [
          {
            menuId: 'M0004002',
            queryId: 'getModels',
            callback: (data) => {
              this.$utils.transformData(data, ['value', 'text'], ['코드', '제품유형'], this.modelList);
            },
          },
          {
            menuId: 'M0004002',
            queryId: 'getProcess',
            callback: (data) => {
              this.$utils.transformData(data, ['value', 'text'], ['공정코드', '공정명'], this.processList);
            },
          },
        ];
        await this.$axios.api.searchAll(param);

        this.gridView.clearCurrent();
        this.dataProvider.clearRows();
        this.isOpen = true;
      });
    },
    closeDialog() {
      this.gridView.clearCurrent();
      this.dataProvider.clearRows();
      this.oldLotSelectedModel = null;
      this.curProcess = null;
      this.isButtonDisabled = true;
      this.gridView.cancel();
      this.$zIndexManager.release();
      this.isOpen = false;
    },
    search() {
      let ret = true;
      let errorMsg = '';
      if (_.isEmpty(this.oldLotSelectedModel) || _.isEmpty(this.oldLotSelectedModel.text)) {
        ret = false;
        errorMsg += '제품유형을 선택하세요.\n';
      }

      if (_.isEmpty(this.curProcess) || _.isEmpty(this.curProcess.value)) {
        ret = false;
        errorMsg += '공정명을 선택하세요.\n';
      }

      if (!ret) {
        this.$toast('info', errorMsg);
        return ret;
      }

      this.$nextTick(async () => {
        this.gridView.clearCurrent();
        this.dataProvider.clearRows();

        let params = {
          oldLotModel: this.oldLotSelectedModel.text,
          process: this.curProcess.value,
        };
        let searchParam = {
          menuId: 'M0004002',
          queryId: 'getOldLotNoList',
          queryParams: params,
          target: this.gridRows,
        };

        await this.$axios.api.search(searchParam);
        if (this.dataProvider.getRowCount() == 0) {
          this.$toast('info', '구LotNo 리스트가 존재하지 않습니다.\n제품유형, 공정명 변경 후 조회를 다시 눌러주세요.');
          this.isButtonDisabled = true;
        } else {
          this.isButtonDisabled = false;
        }
      });
    },
    confirmClick() {
      let rows = this.gridView.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return;
      }

      let jsonRows = this.dataProvider.getJsonRows(0, -1);
      const selectedJson = [];
      rows.forEach((dataRow) => {
        selectedJson.push(jsonRows[dataRow]);
      });
      console.log(selectedJson);
      this.$emit('confirm', { selectedJson });
      this.closeDialog();
    },
  },
};
</script>
<style scoped>
.rg-body {
  border: 1px solid #b0bacc;
  border-bottom: 0 !important;
}
.grid-border-none {
  height: 100% !important;
}
</style>
