/**
*	제조 실적 입력 > Lot Run Card 발행
*/
<template>
  <v-container>
      <auth-tabs :activeTab="activeTab">
        <!-- Tab 0 Lot Card 발행 -->
        <template #tab-content-TAB015000>
          <TAB015000 />
        </template>
        <!-- Tab 1 Run Card #1 발행 -->
        <template #tab-content-TAB016000>
          <TAB016000 />
        </template>
        <!-- Tab 2 Run Card #2 발행 
        <template #tab-content-TAB017000>
          <TAB017000 />
        </template>
        -->
      </auth-tabs>
  </v-container>
</template>

<script>
import TAB015000 from "./tab/TAB015000.vue";
import TAB016000 from "./tab/TAB016000.vue";
//import TAB017000 from "./tab/TAB017000.vue";

export default {
  name: "DW_M0003007",
  props: {},
  components: {
    TAB015000,
    TAB016000,
    //TAB017000,
  },
  watch: {},
  data() {
    return {
      activeTab: 0,
      tabs: [
        "TAB015000",
        "TAB016000",
        //"TAB017000"
      ],
    };
  },
  computed: {},
  created() {
    this.$eventBus.on("change-tab-M0003007", this.updateTab);
  },
  mounted() {},
  beforeUnmount() {
    this.$eventBus.off("change-tab-M0003007", this.updateTab);
  },
  methods: {
    updateTab(tabId) {
      console.log(tabId);
      if (this.tabs.some((id) => id === tabId)) {
        this.activeTab = this.tabs.findIndex((id) => id === tabId);
      }
    },
  },
};
</script>