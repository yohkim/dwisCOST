<template>
  <v-container>
    <auth-tabs :activeTab="activeTab" @tabChange="onTabChange">
      <!-- Tab 0 카세트 마스터 -->
      <template #tab-content-TAB075001>
        <TAB075001 tabId="TAB075001" />
      </template>
      <!-- Tab 1 카세트 이력 -->
      <template #tab-content-TAB075002>
        <TAB075002 tabId="TAB075002" />
      </template>
      <!-- Tab 0 카세트 점검 이력 -->
      <template #tab-content-TAB075003>
        <TAB075003 tabId="TAB075003" />
      </template>
      <!-- Tab 1 카세트 세척 이력 -->
      <template #tab-content-TAB075004>
        <TAB075004 tabId="TAB075004" />
      </template>
    </auth-tabs>
  </v-container>
</template>

<script>
import TAB075001 from './tab/TAB075001.vue';
import TAB075002 from './tab/TAB075002.vue';
import TAB075003 from './tab/TAB075003.vue';
import TAB075004 from './tab/TAB075004.vue';

export default {
  name: 'DW_M0007004',
  setup() {
  },
  props: {},
  components: {
    TAB075001,
    TAB075002,
    TAB075003,
    TAB075004,
  },
  watch: {},
  data() {
    return {
      activeTab: 0,
      tabs: ['TAB075001', 'TAB075002', 'TAB075003', 'TAB075004'],
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.$eventBus.on('CstMasterTabMoveClick', this.tabMove);
  },
  updated() {
  },
  beforeUnmount() {
    this.$eventBus.off('CstMasterTabMoveClick');
  },
  methods: {
    tabMove({ moveTabId, callback }) {
      this.$nextTick(() => {
        if (this.tabs.some((id) => id === moveTabId)) {
          this.activeTab = this.tabs.findIndex((id) => id === moveTabId);
          if (callback != null) callback();
        }
      });
    },
    onTabChange(pTabIdx, tabIdx) {
      this.activeTab = pTabIdx;
    },
  },
};
</script>
