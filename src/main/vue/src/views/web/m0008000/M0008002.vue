/** * 품질검사 > Job Change */
<template>
  <auth-tabs>
    <!-- Tab 1 검사의뢰(제조)-->
    <template #tab-content-TAB080004>
      <TAB080004 />
    </template>
    <!-- Tab 2 검사진행(품질)-->
    <template #tab-content-TAB080005>
      <TAB080005 />
    </template>
    <!-- Tab 3 검사결과확정(제조,품질)-->
    <template #tab-content-TAB080006>
      <TAB080006 />
    </template>
  </auth-tabs>
</template>

<script>
import TAB080004 from './tab/TAB080004.vue';
import TAB080005 from './tab/TAB080005.vue';
import TAB080006 from './tab/TAB080006.vue';
import { useM0008000 } from '@web/store/M0008000.js';

export default {
  name: 'DW_M0008002',
  setup() {
    const srchInfo = useM0008000();
    return { srchInfo };
  },
  props: {},
  components: {
    TAB080004,
    TAB080005,
    TAB080006,
  },
  watch: {},
  data() {
    return {};
  },
  computed: {},
  created() {
    this.srchInfo.clearMenu2ItemInfo();
  },
  mounted() {},
  beforeUnmount() {},
  methods: {},
};
</script>
