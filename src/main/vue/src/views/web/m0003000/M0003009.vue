/** * 제조 실적 입력 > 포장/출하 */
<template>
  <auth-tabs>
    <!-- Tab 0 생산 실적 입력 -->
    <template #tab-content-TAB043000>
      <TAB043000 tabId="TAB043000" />
    </template>
    <!-- Tab 1 내포장 실적 -->
    <template #tab-content-TAB044000>
      <TAB044000 tabId="TAB044000" />
    </template>
    <!-- Tab 2 출하 검사 대기 -->
    <template #tab-content-074>
      <TAB045100 tabId="TAB045100" />
    </template>
    <!-- Tab 3 출하 검사 의뢰 -->
    <template #tab-content-077>
      <TAB045200 tabId="TAB045200" />
    </template>
    <!-- Tab 4 출하 검사-->
    <template #tab-content-080>
      <TAB045300 tabId="TAB045300" />
    </template>
    <!-- Tab 5 출하 대기 -->
    <template #tab-content-082>
      <TAB045400 tabId="TAB045400" />
    </template>
    <!-- Tab 6 출하 -->
    <template #tab-content-087>
      <TAB045500 tabId="TAB045500" />
    </template>
    <!-- Tab 6 재고 현황 -->
    <template #tab-content-TAB045600>
      <TAB045600 tabId="TAB045600" />
    </template>
  </auth-tabs>
</template>

<script>
import TAB043000 from './tab/TAB043000.vue';
import TAB044000 from './tab/TAB044000.vue';
import TAB045100 from './tab/TAB045100.vue';
import TAB045200 from './tab/TAB045200.vue';
import TAB045300 from './tab/TAB045300.vue';
import TAB045400 from './tab/TAB045400.vue';
import TAB045500 from './tab/TAB045500.vue';
import TAB045600 from './tab/TAB045600.vue';
import { useM0003009 } from "@web/store/M0003009.js";

export default {
  props: {},
  components: {
    TAB043000,
    TAB044000,
    TAB045100,
    TAB045200,
    TAB045300,
    TAB045400,
    TAB045500,
    TAB045600,
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
