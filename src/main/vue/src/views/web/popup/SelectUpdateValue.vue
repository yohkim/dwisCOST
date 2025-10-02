<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :size="params.popUpSize" :title="params.popUpTitle" no-close-on-backdrop centered>
    <div class="grid_box search_onerow">
      <div class="grid-border-none">
        <RealGrid ref="popupGrid" :uid="'popupGrid'" :rows="rows" style="width: 100%; height: 55px" />
      </div>
    </div>
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
      <b-button class="main" block @click="confirm">선택된 값 적용</b-button>
    </div>
  </b-modal>
</template>
<script>
import { RowState } from 'realgrid';
export default {
  name: 'SelectUpdateValue',
  props: {},
  data() {
    return {
      popupGrid: null,
      rows: [],
      isOpen: false,
      params: {
        dialogTitle: '',
        popUpSize:'lg',
        popUpTitle:'일괄업데이트 선택',
        tabId: 'TAB071002',
        gridJs: 'TAB071002Popup',
      },
    };
  },
  computed: {
  },
  watch: {},
  created() {},
  watch: {},
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);

      this.popupGrid = _.cloneDeep(require(`@web/popup/js/${this.params.gridJs}`));
      this.$refs.popupGrid.created();
      this.isOpen = true;
      this.rows = [];
      this.rows.push({});
    },
    closeDialog() {
      this.$refs.popupGrid.getGridView().commit();
      this.$refs.popupGrid.destroy();
      this.isOpen = false;
    },
    confirm() {
      this.$refs.popupGrid.getGridView().commit();
      let jsonRows = this.$refs.popupGrid.getGridDataProvider().getJsonRows(0, -1);
      this.$emit('confirm', { jsonRows });
      this.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .btn {
  margin: 0 5px;
  border: 0;
  &.main {
    background-color: #232f4e;
    color: #2dc1dd;
  }
  &.second {
    background-color: #7487ad;
    color: #fff;
  }
}
</style>
