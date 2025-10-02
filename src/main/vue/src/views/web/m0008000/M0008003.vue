/** * 품질검사 > 출하검사 */
<template>
  <auth-tabs>
    <!-- Tab 1 검사의뢰(제조)-->
    <template #tab-content-TAB080007>
      <TAB080007 />
    </template>
    <!-- Tab 2 검사진행(품질)-->
    <template #tab-content-TAB080008>
      <TAB080008 />
    </template>
    <!-- Tab 3 검사결과확정(제조,품질)-->
    <template #tab-content-TAB080009>
      <TAB080009 />
    </template>
  </auth-tabs>
</template>

<script>
import TAB080007 from './tab/TAB080007.vue';
import TAB080008 from './tab/TAB080008.vue';
import TAB080009 from './tab/TAB080009.vue';
import { useM0008000 } from '@web/store/M0008000.js';

export default {
  name: 'DW_M0008003',
  setup() {
    const srchInfo = useM0008000();
    return { srchInfo };
  },
  props: {},
  components: {
    TAB080007,
    TAB080008,
    TAB080009,
  },
  watch: {},
  data() {
    return {};
  },
  computed: {},
  created() {
    this.srchInfo.clearMenu3ItemInfo();
  },
  mounted() {},
  beforeUnmount() {},
  methods: {},
};
</script>
