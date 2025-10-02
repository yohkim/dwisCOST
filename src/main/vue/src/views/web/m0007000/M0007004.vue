<template>
  <auth-tabs>
    <!-- Tab 0 반출신청 -->
    <template #tab-content-TAB074001>
      <TAB074001 tabId="TAB074001"/>
    </template>
    <!-- Tab 1 회수처리 -->
    <template #tab-content-TAB074002>
      <TAB074002 tabId="TAB074002" />
    </template>
  </auth-tabs>
</template>

<script>
import TAB074001 from './tab/TAB074001.vue';
import TAB074002 from './tab/TAB074002.vue';

export default {
  name: 'DW_M0007004',
  props: {},
  components: {
    TAB074001,
    TAB074002,
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
