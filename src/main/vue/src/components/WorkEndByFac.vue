<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3" class="period">
          <div class="form-floating me-1">
            <date-picker label="From" v-model="params.startDate" />
            <label for="floatingPicker">From</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="To" v-model="params.endDate" />
            <label for="floatingPicker">To</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating prc_name">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.curProcess">
              <option v-for="(item, index) in processList" :key="index" :value="item.sysResourceId">
                {{ item.sysResourceName }}
              </option>
            </select>
            <label for="floatingSelect" class="select">공정명</label>
          </div>
        </b-col>        
      </b-row>
      <div class="btn_area refresh">
        <b-button class="refresh" @click="clearClick"/>
        <b-button @click="searchClick">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="excelClick">엑셀</b-button>
        </div>
      </div>
      <b-tabs b-model="tab" class="four_depth_tab" style="height:94.5%">
        <b-tab title="요약">
          <RealGrid ref="grid1" :uid="'grid1'" :rows="rows1" style="height: 100%" />
        </b-tab>
        <b-tab title="모델별">
          <RealGrid ref="grid2" :uid="'grid2'" :rows="rows2" style="height: 100%" />
        </b-tab>
        <b-tab title="LOT_RUN별">
          <RealGrid ref="grid3" :uid="'grid3'" :rows="rows3" style="height: 100%" />
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>
<script>

import moment from "moment";
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  props: {},
  components: {
  },
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  watch: {},
  data() {
    return {
      grid1: null,
      grid2: null,
      grid3: null,
      rows1: [],
      rows2: [],
      rows3: [],
      params: {
        startDate: null,
        endDate: null,
        curProcess: null,        
      },     
      processList: [],
    };
  },
  computed: {
  },
  created() {   
    this.initializeGrid();
    this.initializeMenu(); 
  },
  mounted() {        
    let curDate = moment().format("YYYY-MM-DD");
    this.params.startDate = curDate;
    this.params.endDate = curDate;
  },
  unmounted(){
  },
  beforeUnmount() {},
  methods: {
    gv(name) {
      return this.$refs[name].getGridView();
    },
    initializeGrid() {
      this.grid1 = _.cloneDeep(require(`./js/WorkEndByFac1.js`));
      this.grid2 = _.cloneDeep(require(`./js/WorkEndByFac2.js`));
      this.grid3 = _.cloneDeep(require(`./js/WorkEndByFac3.js`));
    },
    initializeMenu() {
      this.processList = this.userAuthInfo.getRoleProcessList();
    },
    searchClick(){
      let qp = _.cloneDeep(this.params);
      qp['startDate'] = qp['startDate'].replace(/-/g, "");
      qp['endDate'] = qp['endDate'].replace(/-/g, "");
      let params = [
        {menuId:'M0003005',queryId:'selectWorkEndByFac1',queryParams:qp, target: this.rows1},
        {menuId:'M0003005',queryId:'selectWorkEndByFac2',queryParams:qp, target: this.rows2},
        {menuId:'M0003005',queryId:'selectWorkEndByFac3',queryParams:qp, target: this.rows3},
      ];
      this.$axios.api.searchAll(params);
    },
    excelClick(){
      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const fileName = `설비별_작업완료 ${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      this.gv('grid1').exportGrid({
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: "엑셀 Export중입니다.",
        exportGrids: [
          { grid: this.gv('grid1'), sheetName: '요약' },
          { grid: this.gv('grid2'), sheetName: '모델별' },
          { grid: this.gv('grid3'), sheetName: 'LOT_RUN별' },
        ],
        done: () => {
          this.$toast('success', '엑셀 내보내기가 완료되었습니다!');
        },
      });
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .period{
	width: 20%!important;
	}
</style>
