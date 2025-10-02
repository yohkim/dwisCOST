/** * 제조 실적 입력 > Back#2 Cassette QC */
<template>
  <auth-tabs @tabChange="onTabChange">
    <!-- Tab 0 생산 실적 입력 -->
    <template #tab-content-TAB032000>
      <TAB032000 tabId="TAB032000" />
    </template>
    <!-- Tab 2 설비 로그 조회 -->
    <template #tab-content-TAB033000>
      <HistoryView tabId="TAB033000" />
    </template>
    <!-- Tab 2 설비 로그 조회 -->
    <template #tab-content-TAB034000>
      <LogViewer ref="logViewer" parentId="M0003002" tabId="TAB034000" />
    </template>
  </auth-tabs>
</template>

<script>
import TAB032000 from "./tab/TAB032000";
import { useM0003002 } from "@web/store/M0003002.js";

export default {
  name: "DW_M0003002",
  setup() {
    const srchInfo = useM0003002();
    return { srchInfo };
  },
  props: {},
  components: {
    TAB032000,
  },
  watch: {},
  data() {
    return {};
  },
  computed: {},
  created() {
    this.srchInfo.clearInfo();
  },
  mounted() {},
  beforeUnmount() {},
  methods: {
    onTabChange(pTabIdx, tabIdx, tabItem) {
      if (!_.isEmpty(tabItem) && tabItem.sysResourceId == "TAB034000") {
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
