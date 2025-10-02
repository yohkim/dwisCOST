/** * 카세트관리 > 카세트불출처리 > ?? 카세트 */
<template>
  <div>
    <b-tabs v-model="activeTab" class="four_depth_tab">
      <b-tab title="대상 업로드"></b-tab>
      <b-tab title="검사 진행"></b-tab>
      <b-tab title="반입 처리"></b-tab>
    </b-tabs>
    <div class="four_d_box">
      <TAB071001 :pTabId="tabId" v-show="activeTab == 0" />
      <TAB071002 :pTabId="tabId" v-show="activeTab == 1" />
      <TAB071003 :pTabId="tabId" v-show="activeTab == 2" />
    </div>
  </div>
</template>

<script>
import TAB071001 from './TAB071001.vue';
import TAB071002 from './TAB071002.vue';
import TAB071003 from './TAB071003.vue';

export default {
  name: 'TAB071000',
  components: {
    TAB071001,
    TAB071002,
    TAB071003,
  },
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  data() {
    return {
      activeTab: 0,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
