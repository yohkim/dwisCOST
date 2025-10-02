/* * 제조 실적 관리 > LotNo 변경관리 */
<template>
  <div>
    <div class="search_box" style="align-items: flex-end !important">
      <b-row class="search_area">
        <b-col cols="3" class="period">
          <div class="label_title">처리 일자</div>
          <div class="form-floating me-1">
            <date-picker label="시작일" v-model="startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="종료일" v-model="endDate" />
            <label for="floatingPicker">종료일</label>
          </div>
        </b-col>
        <b-col cols="1" class="align-center" style="width: 15.2% !important">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" v-model="selectedModel">
              <option v-for="model in modelList" :key="model.value" :value="model">
                {{ model.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">제품유형</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchLotChangeList"><span class="ico_search"></span>조회</b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button @click="excelClick" :disabled="isExcelExportDisabled" class="second">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="lotChangeGrid" :uid="'lotChangeGrid'" :rows="rows" style="height: 100%" />
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { RowState } from 'realgrid';

export default {
  name: 'DW_TAB040003',
  props: {},
  components: {},
  data() {
    return {
      startDate: '',
      endDate: '',
      lotChangeGrid: null,
      rows: [],
      selectedModel: null,
      modelList: [], // Example product types
      isExcelExportDisabled: true,
    };
  },
  computed: {
    GV() {
      return this.$refs.lotChangeGrid.getGridView();
    },
    DP() {
      return this.$refs.lotChangeGrid.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    this.$eventBus.on('M0004002MenuMove', this.menuMove);
    this.getSelectOptions();
  },
  beforeUnmount() {
    this.$eventBus.off('M0004002MenuMove');
  },
  methods: {
    menuMove(data) {
      this.$nextTick(() => {
        let date = this.$utils.rgDisplayDate(null, null, data['수주일자']);
        this.startDate = date;
        this.endDate = date;
        this.searchLotChangeList();
      });
    },
    async getSelectOptions() {
      let param = {
        menuId: 'M0004002',
        queryId: 'getModels',
        callback: (data) => {
          this.$utils.transformData(data, ['value', 'text'], ['코드', '제품유형'], this.modelList);
        },
      };
      await this.$axios.api.search(param);

      this.startDate = this.$utils.getTodayDate(); //this.$utils.getCurMonthStartDate();
      this.endDate = this.$utils.getTodayDate(); //this.$utils.getCurMonthEndDate();
    },
    async initializeGrid() {
      this.lotChangeGrid = _.cloneDeep(require(`@web/m0004000/js/TAB040003.js`));
    },
    async searchLotChangeList() {
      if (!this.$utils.validateStartDateEndDate(this.startDate, this.endDate)) {
        return;
      }

      let params = {
        startDate: this.startDate.toString().replaceAll('-', ''),
        endDate: this.endDate.toString().replaceAll('-', ''),
        modelCode: !_.isEmpty(this.selectedModel) && !_.isEmpty(this.selectedModel.text) ? this.selectedModel.text : null,
      };
      let param = {
        menuId: 'M0004002',
        queryId: 'searchLotChangeList',
        queryParams: params,
        target: this.rows,
      };
      let result = await this.$axios.api.search(param);
      if (result != null && result.length == 0) {
        this.isExcelExportDisabled = true;
        return;
      }
      this.isExcelExportDisabled = false;
    },
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = String(today.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    async excelClick() {
      const grid = this.GV;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `LotNo변경관리_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      let that = this;
      const options = {
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: '엑셀 Export중입니다.',
        done: function () {
          that.$toast('info', '엑셀 내보내기가 완료되었습니다.');
        },
      };

      grid.exportGrid(options);
    },
  },
};
</script>
