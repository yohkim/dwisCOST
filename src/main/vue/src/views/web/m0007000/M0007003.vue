<template>
  <auth-tabs>
    <!-- Tab 0 세정 카세트 -->
    <template #tab-content-TAB073000>
      <TAB073000 tabId="TAB073000"/>
    </template>
    <!-- Tab 1 강화 카세트 -->
    <template #tab-content-TAB073000_1>
      <TAB073000 tabId="TAB073000_1" />
    </template>
  </auth-tabs>
</template>

<script>
import TAB073000 from './tab/TAB073000.vue';

export default {
  name: 'DW_M0007003',
  props: {},
  components: {
    TAB073000,
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
