/** * 제조 실적 입력 > Back#2 Cell QC */
<template>
  <auth-tabs @tabChange="onTabChange">
    <!-- Tab 0 생산 실적 입력 -->
    <template #tab-content-TAB039000>
      <TAB039000 tabId="TAB039000" />
    </template>
    <!-- Tab 1 작업 이력 조회 -->
    <template #tab-content-TAB040000>
      <TAB040000 tabId="TAB040000" />
    </template>
    <!-- Tab 2 설비 로그 조회 -->
    <template #tab-content-TAB041000>
      <LogViewer ref="logViewer" parentId="M0003003" tabId="TAB041000" />
    </template>
  </auth-tabs>
</template>

<script>
import TAB039000 from "./tab/TAB039000";
import TAB040000 from "./tab/TAB040000";
import { useM0003003 } from "@web/store/M0003003.js";

export default {
  setup() {
    const srchInfo = useM0003003();
    return { srchInfo };
  },
  props: {},
  components: {
    TAB039000,
    TAB040000,
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
      if (!_.isEmpty(tabItem) && tabItem.sysResourceId == "TAB041000") {
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
