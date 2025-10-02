<template>
  <b-modal  class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="'CELL 대량조회'" no-close-on-backdrop centered>
    <div class="grid_box search_onerow">
      <div class="left_box">             
          <div class="btn_wrap ms-auto">
            <b-button @click="addRow" class="sub"><span ></span>추가</b-button>        
            <b-button @click="deleteRow">삭제</b-button> 
          </div>            
      </div>
      <div class="grid-border-none">
        <RealGrid
          ref="popupGrid"
          :uid="'popupGrid'"
          :rows="rows"
          style="width: 100%; height: 500px"
        />
      </div>
    </div>
    <div class="bttn_wrap">
      <b-button  block @click="closeDialog">닫기</b-button>
      <b-button class="main" block @click="confirm">확인</b-button>
    </div>
  </b-modal>
</template>
<script>
import { RowState } from "realgrid";
export default {
  name: "ProcessingMapping",
  props: {},
  data() {
    return {
      popupGrid: null,
      rows: [],
      isOpen: false,
      params: {
        dialogTitle: "",
        isEditabled: false,
        menuId: "",
        queryId: "",
      },
    };
  },
  computed: {
    gridView() {
      return this.$refs.popupGrid.getGridView();
    },
    gridDataProvider() {
      return this.$refs.popupGrid.getGridDataProvider();
    },
  },
  watch: {
  },
  created() {
    this.popupGrid = _.cloneDeep(require(`../js/TAB054000Input.js`));
  },
  watch: {},
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      
      this.$nextTick(() => {     
        this.rows = params.cellIdArray;
        this.isOpen = true;
        if(this.rows.length==0)
          this.rows.push({});
      });
    },
    closeDialog() {
      this.isOpen = false;
    },
    confirm() {
      let rows = this.gridDataProvider.getFieldValues('cellId',0, -1)
      console.log(rows);
      const cellId = rows
      .filter(item => item !== undefined && item !== null)
      .map(text => text.trim())
      .filter(text => text !== "") 
      .join(";");
      this.$emit("confirm",{cellId});
      this.closeDialog();
    },
    addRow() {
      this.gridView.commit();
      this.gridDataProvider.addRow({});
      let itemIndex = this.gridView.getItemCount() - 1;
      this.gridView.setCurrent({ itemIndex: itemIndex });
    },
    deleteRow() {
      this.gridView.commit();
      const checkedRows = this.gridView.getCheckedRows();
      if (checkedRows.length === 0) {
        this.$toast("info", "삭제할 행을 선택하세요");
      } else {
        let delItems = [];
        checkedRows.forEach((itemIndex) => {
          if (
            this.gridDataProvider.getRowState(itemIndex) === RowState.CREATED
          ) {
            delItems.push(itemIndex);
          } else {
            this.gridDataProvider.setRowState(itemIndex, RowState.DELETED);
          }
        });
        this.gridDataProvider.removeRows(delItems);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .btn{
  margin: 0 5px;
  border: 0;
  &.main{
    background-color: #232f4e;
    color: #2dc1dd;
  }
    &.second{
    background-color: #7487ad;
    color: #fff;
  }
}
</style>