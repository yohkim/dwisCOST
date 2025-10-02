<template>
  <auth-tabs>
    <!-- Tab 1 검사의뢰(제조)-->
    <template #tab-content-TAB080001>
      <TAB080001 />
    </template>
    <!-- Tab 2 검사진행(품질)-->
    <template #tab-content-TAB080002>
      <TAB080002 />
    </template>
    <!-- Tab 3 검사결과확정(제조,품질)-->
    <template #tab-content-TAB080003>
      <TAB080003 />
    </template>
  </auth-tabs>
</template>

<script>
import TAB080001 from './tab/TAB080001.vue';
import TAB080002 from './tab/TAB080002.vue';
import TAB080003 from './tab/TAB080003.vue';
import { useM0008000 } from '@web/store/M0008000.js';

export default {
  name: 'DW_M0008001',
  setup() {
    const srchInfo = useM0008000();
    return { srchInfo };
  },
  props: {},
  components: {
    TAB080001,
    TAB080002,
    TAB080003,
  },
  watch: {},
  data() {
    return {};
  },
  computed: {},
  created() {
    this.srchInfo.clearMenu1ItemInfo();
  },
  mounted() {},
  beforeUnmount() {},
  methods: {},
};
</script>
