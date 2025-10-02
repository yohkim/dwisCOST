/** * 제조 실적 입력 > 포장/출하 > 내포장 실적 */
<template>
  <div>
    <b-tabs v-model="activeTab" class="four_depth_tab">
      <b-tab title="[MANUAL] ORIGIN"></b-tab>
      <b-tab title="[MANUAL] PACK"></b-tab>
      <b-tab title="[AUTO] ORIGIN"></b-tab>
      <b-tab title="[AUTO] PACK"></b-tab>
      <b-tab title="ORIGIN 조회"></b-tab>
      <b-tab title="PACK 조회"></b-tab>
    </b-tabs>
    <div class="four_d_box">
      <TAB044001 v-show="activeTab == 0" />
      <TAB044002 v-show="activeTab == 1" />
      <TAB044003 v-show="activeTab == 2" />
      <TAB044004 v-show="activeTab == 3" />
      <TAB044005 v-show="activeTab == 4" />
      <TAB044006 v-show="activeTab == 5" />
    </div>
  </div>
</template>

<script>
import TAB044001 from './TAB044001.vue';
import TAB044002 from './TAB044002.vue';
import TAB044003 from './TAB044003.vue';
import TAB044004 from './TAB044004.vue';
import TAB044005 from './TAB044005.vue';
import TAB044006 from './TAB044006.vue';

export default {
  name: 'TAB044000',
  components: {
    TAB044001,
    TAB044002,
    TAB044003,
    TAB044004,
    TAB044005,
    TAB044006,
  },
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  watch: {},
  data() {
    return {
      activeTab: 0,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  beforeUnmount() {},
  methods: {},
};
</script>
