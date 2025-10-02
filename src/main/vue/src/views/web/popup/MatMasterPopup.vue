<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :size="params.popUpSize" no-close-on-backdrop centered>
    <template #title>
      {{ params.dialogTitle }}
    </template>
    <div>
      <RealGrid ref="matMasterPopupGrid" :uid="'matMasterPopupGrid'" :rows="rows" :style="`height: ${params.height}px`" />
    </div>
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
      <b-button class="main" block @click="confirm">선택된 값 적용</b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'MatMasterPopup',
  props: {},
  data() {
    return {
      matMasterPopupGrid: null,
      rows: [],
      isOpen: false,
      params: {
        dialogTitle: '',
        height: 300,
        gridJs: '',
        search: {
          menuId: '',
          queryId: '',
          queryParams: null,
        },
        popUpSize: 'lg',
        clickedValue: '',
        useColumn: '',
      },
    };
  },
  computed: {
    GV() {
      return this.$refs.matMasterPopupGrid.getGridView();
    },
    DP() {
      return this.$refs.matMasterPopupGrid.getGridDataProvider();
    },
  },
  methods: {
    async openDialog(params) {
      Object.assign(this.params, params);

      const gridModule = require(`@web/popup/js/${this.params.gridJs}`);
      this.matMasterPopupGrid = _.cloneDeep(gridModule);

      this.$nextTick(() => {
        this.$refs.matMasterPopupGrid.created();
        this.$axios.api.search(Object.assign(this.params.search, { target: this.rows })).then(() => {
          this.isOpen = true;
          this.findRow();
        });
      });
    },
    closeDialog() {
      this.$refs.matMasterPopupGrid.destroy();
      this.isOpen = false;
    },
    confirm() {
      let rows = this.$refs.matMasterPopupGrid.getGridView().getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return;
      } else if (rows.length != 1) {
        this.$toast('info', '한개만 선택해주세요');
        return;
      }
      let checkedValue = this.$refs.matMasterPopupGrid.getGridDataProvider().getValue(rows[0], this.params.useColumn);
      this.$emit('confirm', checkedValue);
      //this.closeDialog();
    },
    findRow() {
      if (_.isEmpty(this.params.clickedValue)) return;

      let fields = [this.params.useColumn];
      let startIndex = 0;
      let startFieldIndex = 0;
      while (true) {
        let options = {
          fields: fields,
          value: this.params.clickedValue,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.$refs.matMasterPopupGrid.getGridView().searchCell(options);
        if (index == null) break;

        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        this.$refs.matMasterPopupGrid.getGridView().checkRow(index.itemIndex, true);
        break;
      }
    },
  },
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
