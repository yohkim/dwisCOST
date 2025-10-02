/** * 설비 로그 조회 탭 */
<template>
  <div>
    <div class="grid_box search_tworow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" :disabled="isExcelExportDisabled" @click="excelClick">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="tabLogGrid" :uid="'tabLogGrid'" :rows="tabLogRows" style="height: 70vh" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DW_TabLogViewer',
  props: {
    table: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {},
  setup() {},
  watch: {},
  data() {
    return {
      gridSrcMap: {
        '': 'R0000000',
        '073': 'R0003003_3', //Back#2 Cell QC 이물제거 default
        '073_1': 'R0003003_3', //Back#2 Cell QC 이물제거 CellValidInfo
        '073_2': 'R0003003_4', //Back#2 Cell QC 이물제거 CellInspInfo
        '073_3': 'R0003003_5', //Back#2 Cell QC 이물제거 CellTrackInfo
        '073_4': 'R0003003_6', //Back#2 Cell QC 이물제거 PackInfo
        '073_5': 'R0003003_7', //Back#2 Cell QC 이물제거 TrayDetailInfo
        '073_6': 'R0003003_8', //Back#2 Cell QC 이물제거 TrayInfo
        '073_7': 'R0003003_9', //Back#2 Cell QC 이물제거 S-LINE(이물제거벨트파일)
        '073_8': 'R0003003_10', //Back#2 Cell QC 이물제거 S-LINE(이물제거Packing파일)
        '073_9': 'R0003003_11', //Back#2 Cell QC 이물제거 S-LINE(이물제거파일)
      },
      menuIdMap: {
        '073': 'R0003003',
      },
      queryIdMap: {
        '073': 'R0003003_Sch3',
        '073_1': 'R0003003_Sch3', //Back#2 Cell QC 이물제거 CellValidInfo
        '073_2': 'R0003003_Sch4', //Back#2 Cell QC 이물제거 CellInspInfo
        '073_3': 'R0003003_Sch5', //Back#2 Cell QC 이물제거 CellTrackInfo
        '073_4': 'R0003003_Sch6', //Back#2 Cell QC 이물제거 PackInfo
        '073_5': 'R0003003_Sch7', //Back#2 Cell QC 이물제거 TrayDetailInfo
        '073_6': 'R0003003_Sch8', //Back#2 Cell QC 이물제거 TrayInfo
        '073_7': 'R0003003_Sch9', //Back#2 Cell QC 이물제거 S-LINE(이물제거벨트파일)
        '073_8': 'R0003003_Sch10', //Back#2 Cell QC 이물제거 S-LINE(이물제거Packing파일)
        '073_9': 'R0003003_Sch11', //Back#2 Cell QC 이물제거 S-LINE(이물제거파일)
      },
      tableMap: {
        CellValidInfo: '1',
        CellInspInfo: '2',
        CellTrackInfo: '3',
        PackInfo: '4',
        TrayDetailInfo: '5',
        TrayInfo: '6',
        SLineBelt: '7',
        SLinePacking: '8',
        SLine: '9',
      },
      tabLogRows: [],
      tabLogGrid: null,
      isDisabled: true,
      isExcelExportDisabled: true,
      curProcess: '073', //default
      isProcessing: false,
    };
  },
  computed: {
    tabLogGridView() {
      return this.$refs.tabLogGrid.getGridView();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {},
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      if (this.curProcess == '073' && !_.isEmpty(this.table)) {
        let srcKey = this.curProcess + '_' + this.tableMap[this.table];
        this.tabLogGrid = _.cloneDeep(require(`./js/` + this.gridSrcMap[srcKey] + `.js`));
      } else {
        this.tabLogGrid = _.cloneDeep(require(`./js/` + this.gridSrcMap[this.curProcess] + `.js`));
      }
    },
    searchClick(params) {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        let findQueryId;
        if (this.curProcess == '073' && !_.isEmpty(this.table)) {
          let srcKey = this.curProcess + '_' + this.tableMap[this.table];
          findQueryId = this.queryIdMap[srcKey];
        } else {
          findQueryId = this.queryIdMap[this.curProcess];
        }

        let searchParam = [
          {
            menuId: this.menuIdMap[this.curProcess],
            queryId: findQueryId,
            queryParams: params,
            target: this.tabLogRows,
          },
        ];

        let result = await this.$axios.api.searchAll(searchParam);
        if (result[0].length == 0) {
          this.isExcelExportDisabled = true;
          return;
        }
        this.isExcelExportDisabled = false;
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    async excelClick() {
      const grid = this.tabLogGridView;

      let curProcessName = '';

      if (this.curProcess == '073' && !_.isEmpty(this.table)) {
        curProcessName += '이물제거_' + this.table;
      }
      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `LogList_${curProcessName}_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

      const options = {
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: '엑셀 Export중입니다.',
        done: function () {
          alert('엑셀 내보내기가 완료되었습니다!');
        },
      };

      grid.exportGrid(options);
    },

    onDataLoadComplatedTabLogGrid(grid) {},
  },
};
</script>
