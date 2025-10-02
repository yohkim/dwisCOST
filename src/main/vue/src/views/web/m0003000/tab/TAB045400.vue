/** * 제조 실적 입력 > 포장/출하 > 출하 대기 */
<template>
  <div>
    <b-tabs v-model="activeTab" class="four_depth_tab">
      <b-tab title="Pallet 목록"></b-tab>
      <b-tab title="Pallet 구성"></b-tab>
    </b-tabs>
    <div class="four_d_box">
      <TAB045401 v-show="activeTab == 0" />
      <TAB045402 v-show="activeTab == 1" />
    </div>
  </div>
</template>

<script>
import TAB045401 from './TAB045401.vue';
import TAB045402 from './TAB045402.vue';

export default {
  name: 'TAB045400',
  components: {
    TAB045401,
    TAB045402,
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
