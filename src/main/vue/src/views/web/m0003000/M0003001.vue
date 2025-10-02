/** * 제조 실적 입력 > Back#1 */
<template>
  <auth-tabs @tabChange="onTabChange">
    <!-- Tab 0 생산 실적 입력 -->
    <template #tab-content-TAB031000>
      <TAB031000 :upperSysRescId="'M0003001'" :sysRescId="'TAB031000'"/>
    </template>
    <!-- Tab 1 작업 이력 조회 -->
    <template #tab-content-TAB023000>
      <HistoryView tabId="TAB023000" />
    </template>
    <!-- Tab 2 설비 로그 조회 -->
    <template #tab-content-TAB024000>
      <LogViewer ref="logViewer" parentId="M0003001" tabId="TAB024000" />
    </template>
  </auth-tabs>
</template>

<script>
import TAB031000 from "./tab/TAB031000";
import TAB023000 from "./tab/TAB023000";
import { useM0003001 } from "@web/store/M0003001.js";
export default {
  setup() {
    const srchInfo = useM0003001();

    return { srchInfo };
  },
  props: {},
  components: {
    TAB031000,
    TAB023000,
  },
  watch: {},
  data() {
    return {
      //VIEW_PLAN_DATA
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.srchInfo.clearInfo();
  },
  beforeUnmount() {},
  methods: {
    onTabChange(pTabIdx, tabIdx, tabItem) {
      if (!_.isEmpty(tabItem) && tabItem.sysResourceId == "TAB024000") {
        this.$refs.logViewer.setParamsFromInput(
          null,
          this.srchInfo.runNo,
          this.srchInfo.process
        );
      } else if (pTabIdx === 2)
        this.$refs.logViewer.setParamsFromInput(
          null,
          this.srchInfo.runNo,
          this.srchInfo.process
        );
    },
  },
};
</script>
