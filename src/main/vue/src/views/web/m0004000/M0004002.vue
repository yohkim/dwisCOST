/** * 제조 실적 관리 > LotNo 변경 관리 */
<template>
  <auth-tabs>
    <!-- Tab 1 Lot 변경이력 조회-->
    <template #tab-content-TAB040003>
      <TAB040003 />
    </template>
    <!-- Tab 2 Lot 변경 -->
    <template #tab-content-TAB040004>
      <TAB040004 />
    </template>
    <!-- Tab 3 Lot 변경 상세 보기-->
    <template #tab-content-TAB040005>
      <TAB040005 />
    </template>
  </auth-tabs>
</template>

<script>
import TAB040003 from './tab/TAB040003.vue';
import TAB040004 from './tab/TAB040004.vue';
import TAB040005 from './tab/TAB040005.vue';

export default {
  name: 'DW_M0004002',
  props: {},
  components: {
    TAB040003,
    TAB040004,
    TAB040005,
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
