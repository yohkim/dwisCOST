/** * 자재관리 > 자재 마스터 */
<template>
  <auth-tabs>
    <!-- Tab 0 자재 마스터 -->
    <template #tab-content-TAB001701>
      <TAB001701 />
    </template>
  </auth-tabs>
</template>

<script>
import TAB001701 from './tab/TAB001701.vue';
export default {
  name: 'DW_M0001010',
  props: {},
  components: {
    TAB001701,
  },
};
</script>
