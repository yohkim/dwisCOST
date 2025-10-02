<template>
  <auth-tabs>
    <!-- Tab 0 세정 카세트 -->
    <template #tab-content-TAB072000>
      <TAB072000 tabId="TAB072000"/>
    </template>
    <!-- Tab 1 강화 카세트 -->
    <template #tab-content-TAB072000_1>
      <TAB072000 tabId="TAB072000_1" />
    </template>
  </auth-tabs>
</template>

<script>
import TAB072000 from './tab/TAB072000.vue';

export default {
  name: 'DW_M0007002',
  props: {},
  components: {
    TAB072000,
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
