/** * 제조 실적 입력 > Rework */
<template>
  <auth-tabs @tabChange="onTabChange">
    <!-- Tab 0 MBOX 대기 관리 -->
    <template #tab-content-TAB046000>
      <TAB046000 />
    </template>
    <!-- Tab 1 MBOX 관리 -->
    <template #tab-content-TAB046001>
      <TAB046001 />
    </template>
    <!-- Tab 2 MRUN 발행 -->
    <template #tab-content-TAB047000>
      <TAB047000 />
    </template>
    <!-- Tab 3 생산 실적 입력 -->
    <template #tab-content-TAB048000>
      <TAB031000 :upperSysRescId="'M0003008'" :sysRescId="'TAB048000'"/>
    </template>
    <!-- Tab 4 설비 로그 조회 -->
    <template #tab-content-TAB049100>
      <LogViewer ref="logViewer" parentId="M0003008" tabId="TAB049100" />
    </template>
  </auth-tabs>
</template>

<script>
import TAB046000 from "./tab/TAB046000";
import TAB046001 from "./tab/TAB046001";
import TAB047000 from "./tab/TAB047000";
// import TAB048000 from "./tab/TAB048000";
import TAB031000 from "./tab/TAB031000";
import TAB049100 from "./tab/TAB049100";
import { useM0003008 } from "@web/store/M0003008.js";

export default {
  setup() {
    const srchInfo = useM0003008();
    return { srchInfo };
  },
  props: {},
  components: {
    TAB046000,
    TAB046001,
    TAB047000,
    // TAB048000,
    TAB031000,
    TAB049100,
  },
  watch: {},
  data() {
    return {
      currentTab: 0,
    };
  },
  computed: {},
  created() {
    this.initializeGrid();
  },
  mounted() {},
  beforeUnmount() {},
  activated() {
    console.log("Rework onActivated");
  },
  deactivated() {
    console.log("Rework onDeActivated");
  },
  methods: {
    initializeGrid() {
      //VIEW_PLAN_GRID
    },
    onTabChange(pTabIdx, tabIdx, tabItem) {
      if (!_.isEmpty(tabItem) && tabItem.sysResourceId == "TAB049100") {
        this.$refs.logViewer.setParamsFromInput(
          null,
          this.srchInfo.runNo,
          this.srchInfo.process
        );
      } else if (pTabIdx === 4)
        this.$refs.logViewer.setParamsFromInput(
          null,
          this.srchInfo.runNo,
          this.srchInfo.process
        );
    },
  },
};
</script>
