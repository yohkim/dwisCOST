/** * 제조 실적 입력 > FRONT */
<template>
  <auth-tabs @tabChange="onTabChange">
    <!-- Tab 0 생산 실적 입력 -->
    <template #tab-content-TAB018000>
      <TAB018000 tabId="TAB018000" ref="tab018000" v-if="!itgFlag" @itgCallback="itgCallback"/>
      <TAB018000I tabId="TAB018000" ref="tab018000I" v-if="itgFlag" @itgCallback="itgCallback"/>
    </template>
    <!-- Tab 1 작업 이력 조회 -->
    <template #tab-content-TAB019000>
      <HistoryView tabId="TAB019000" />
    </template>
    <!-- Tab 2 설비 로그 조회 -->
    <template #tab-content-TAB020000>
      <LogViewer ref="logViewer" parentId="M0003005" tabId="TAB020000" />
    </template>
  </auth-tabs>
</template>

<script>
import TAB018000 from "./tab/TAB018000";
import TAB018000I from "./tab/TAB018000I";
import { useM0003005 } from "@web/store/M0003005.js";

export default {
  name: "DW_M0003005",
  setup() {
    const srchInfo = useM0003005();
    return { srchInfo };
  },
  props: {},
  components: {
    TAB018000,
    TAB018000I,
  },
  watch: {},
  data() {
    return {
      itgFlag: false,
    };
  },
  computed: {},
  created() {
    this.srchInfo.clearInfo();
  },
  mounted() {},
  beforeUnmount() {},
  methods: {
    onTabChange(pTabIdx, tabIdx, tabItem) {
      if (!_.isEmpty(tabItem) && tabItem.sysResourceId == "TAB020000") {
        this.$refs.logViewer.setParamsFromInput(
          this.srchInfo.lotNo,
          null,
          this.srchInfo.process
        );
      } else if (pTabIdx === 2)
        this.$refs.logViewer.setParamsFromInput(
          this.srchInfo.lotNo,
          null,
          this.srchInfo.process
        );
    },
    itgCallback(itg){
      console.log("itg", itg);
      console.log("itgFlag", this.itgFlag);
      let params = {};
      if(this.itgFlag){
        console.log("this.$refs.tab018000I.params", this.$refs.tab018000I.params);
        params = Object.assign(this.$refs.tab018000I.params);
      }else{
        console.log("this.$refs.tab018000.params", this.$refs.tab018000.params);
        params = Object.assign(this.$refs.tab018000.params);
      }
      this.itgFlag = !this.itgFlag;
      this.$nextTick(()=>{
        if(this.itgFlag){
          this.$refs.tab018000I.params = params;
        }else{
          this.$refs.tab018000.params = params;
        }
      });
    }
  },
};
</script>
