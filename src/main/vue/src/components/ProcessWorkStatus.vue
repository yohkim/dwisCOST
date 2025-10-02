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
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.curProcess" @change="onProcessChange">
              <option v-for="(item, index) in processList" :key="index" :value="item.sysResourceId">
                {{ item.sysResourceName }} ({{ item.sysResourceId }})
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
    <b-row class="row" style="height:5%">
      <div class="left_box">
        <div class="btn_wrap ms-auto">  
          <b-button class="second" @click="excelBtnClick">엑셀</b-button>                  
        </div> 
      </div>    
    </b-row>
    <b-row class="row" style="height:87%">
      <b-col cols="6">
        <div class="grid_box thee_d_box">
          <div class="left_box">
            <div class="title">작업대기</div>
          </div>
          <div class="grid-border-none">
            <RealGrid ref="processWorkStatusWaitGrid" :uid="'processWorkStatusWaitGrid'" :rows="rows1" style="height:100%" :fitLayoutWidthEnable="false"/>
          </div>
        </div>
      </b-col> 
      <b-col cols="6">
        <div class="grid_box thee_d_box">
          <div class="left_box">
            <div class="title">작업중</div>					
          </div> 
          <div class="grid-border-none">
            <RealGrid ref="processWorkStatusProgGrid" :uid="'processWorkStatusProgGrid'" :rows="rows2" style="height:100%"/>
          </div>
        </div>
      </b-col>       
    </b-row>
    <ManufacturingWorkStatusPopup ref="manufacturingWorkStatusPopup"/>
  </div>
</template>

<script>

import { useUserAuthInfo } from '@store/auth/userAuthInfo';
const { ValueType } = require('realgrid');
import ManufacturingWorkStatusPopup from '@components/ManufacturingWorkStatusPopup.vue';

export default {
  props: {},
  components: {
    ManufacturingWorkStatusPopup
  },
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  watch: {},
  data() {
    return {
      processWorkStatusWaitGrid: null,
      processWorkStatusProgGrid: null,
      rows1: [],
      rows2: [],
      params: {
        startDate: null,
        endDate: null,
        curProcess: null,        
      },      
      processList: [],
      isDisabled: true,
      schCurProcess: null,
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    prodCtg() {
      return this.userAuthInfo.selectedProdCtg;
    },
    isCurProcess(){
      return _.isNil(this.params.curProcess);
    }
  },
  created() {
    this.initializeMenu();
    this.initializeGrid();
  },
  mounted() {
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    waitGV() {
      return this.$refs.processWorkStatusWaitGrid?.getGridView();
    },
    waitDP() {
      return this.$refs.processWorkStatusWaitGrid?.getGridDataProvider();
    },
    progGV() {
      return this.$refs.processWorkStatusProgGrid?.getGridView();
    },
    progDP() {
      return this.$refs.processWorkStatusProgGrid?.getGridDataProvider();
    },
    initializeMenu() {
      this.processList = this.userAuthInfo.getRoleProcessList();      
    },
    initializeGrid() {
      this.processWorkStatusWaitGrid = _.cloneDeep(require(`./js/ProcessWorkStatus.js`));
      this.processWorkStatusProgGrid = _.cloneDeep(require(`./js/ProcessWorkStatus1.js`));
    },
    async getSelectOptions() {
      var current = new Date();
      this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      var oneDayAgo = new Date();
      oneDayAgo.setDate(current.getDate());
      this.params.startDate = `${oneDayAgo.getFullYear()}-${(oneDayAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneDayAgo.getDate().toString().padStart(2, '0')}`;
    },
    onProcessChange() {
      this.params.facility = null;
      this.searchClick();
    },
    clearClick() {
      this.params = this.$utils.createObjectWithNullValues(this.params);
      this.getSelectOptions();
    },
    async searchClick() {
      if (!this.$utils.validateStartDateEndDate(this.params.startDate, this.params.endDate)) {
        return;
      }

      if(!this.$utils.validateFields(this.params, ['C:공정명:curProcess'])){
        return;
      }
      this.schCurProcess = this.params['curProcess'];
      await this.$axios.api.searchAll([
        {menuId: "R0000000",queryId: "R0000000_Sch4",queryParams: {...this.params, curProcess1: Number(this.params['curProcess'])},target: this.rows1},
        {menuId: "R0000000",queryId: "R0000000_Sch5",queryParams: {...this.params, curProcess1: Number(this.params['curProcess'])},target: this.rows2},
      ]);
    },

    clickedProcessWorkStatusGrid(grid, clickData){
      if(clickData.cellType !== "data") return;

      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(clickData.fieldName == '상세정보'){
        this.$refs.manufacturingWorkStatusPopup.openDialog({
          ...this.params,
          ...jsonData
        });
      }else if(clickData.fieldName == '실적입력'){
        try {
          const menu1 = this.$utils.findMenu(this.menuList, this.prodCtg, '제조 실적 입력');
          const menu2 = this.$utils.findMenu(this.menuList, this.prodCtg, (jsonData["공정코드"] == '022' ? 'REWORK' : jsonData["area"].toUpperCase()));
          let idx = menu2.childSysResc.findIndex((item)=>{ 
            if(jsonData["공정코드"] == '022'){
              return item.sysResourceName == '생산 실적 입력';
            }else{
              return item.sysResourceName == '제조 실적 입력';
            }
          });
          this.$eventBus.emit('menuMoveClick', { menu: this.$utils.createMenuData(menu1, menu2, menu2.childSysResc[idx]), 
          callback: () => { 
            this.$eventBus.emit( (jsonData["공정코드"] == '022' ? 'Back1MenuMove' : jsonData["area"].replace('#', '').replace(/\s+/g, '')+'MenuMove'), jsonData);            
          }});            
        } catch (error) {
          console.error('제조 작업 현황 메뉴 이동중', error)
          return false; 
        }        
      }
      return false;
    },

    excelBtnClick(){
      if(this.waitDP().getRowCount() == 0 && this.progDP().getRowCount() == 0){
        this.$toast("info", "조회 대상이 없습니다.");
        return;
      }
      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      let process = this.processList.filter(item => item.sysResourceId == this.schCurProcess);
      const fileName = `${process[0].sysResourceName} (${this.schCurProcess})_공정별작업현황${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      this.waitGV().exportGrid({
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: "엑셀 Export중입니다.",
        exportGrids: [
          { grid: this.waitGV(), sheetName: '작업대기' },
          { grid: this.progGV(), sheetName: '작업중' }
        ],
        done: () => {
          this.$toast('success', '엑셀 내보내기가 완료되었습니다!');
        },
      });
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/

    onCellClickedProcessWorkStatusWaitGrid(grid, clickData) {
      this.clickedProcessWorkStatusGrid(grid, clickData);
    },

    onCellClickedProcessWorkStatusProgGrid(grid, clickData) {
      this.clickedProcessWorkStatusGrid(grid, clickData);
    },
    
  }
}
</script>
<style lang="scss" scoped>
::v-deep .period{
	width: 20%!important;
	}
  ::v-deep .status{
	width: 12.5%!important;
	}
</style>


<style lang="scss">
.rg-renderer{
	button{
    &.btn_sucess{
			border: 1px solid  #2f46c7;
      color:   #2f46c7;
		}
	}
}
</style>
