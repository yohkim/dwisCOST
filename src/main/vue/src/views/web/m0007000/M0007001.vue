<template>
  <auth-tabs>
    <!-- Tab 0 세정 카세트 -->
    <template #tab-content-TAB071000>
      <TAB071000 tabId="TAB071000"/>
    </template>
    <!-- Tab 1 강화 카세트 -->
    <template #tab-content-TAB071000_1>
      <TAB071000 tabId="TAB071000_1" />
    </template>
  </auth-tabs>
</template>

<script>
import TAB071000 from './tab/TAB071000.vue';

export default {
  name: 'DW_M0007001',
  props: {},
  components: {
    TAB071000,
  },
  watch: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  beforeUnmount() {},
  methods: {},
};
</script>
