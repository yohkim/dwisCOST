/** * 제조 실적 입력 > 포장/출하 > 출하 검사 */
<template>
  <div>
    <b-tabs v-model="activeTab" class="four_depth_tab">
      <b-tab v-if="hasQcPermission || hasBizAdmin" title="SAMPLE PACK 요청"></b-tab>
      <b-tab v-if="!(hasQcPermission) || hasBizAdmin" title="SAMPLE PACK 인계"></b-tab>
      <b-tab v-if="hasQcPermission || hasBizAdmin" title="출하검사 결과입력"></b-tab>
      <b-tab title="출하검사 결과조회"></b-tab>
    </b-tabs>
    <div class="four_d_box">
      <TAB045301 v-show="activeTab === (hasBizAdmin ? 0 : hasQcPermission ? 0 : -1 )" />
      <TAB045302 v-show="activeTab === (hasBizAdmin ? 1 : hasQcPermission ? -1 : 0 )"  />
      <TAB045303 v-show="activeTab === (hasBizAdmin ? 2 : hasQcPermission ? 1 : -1)" />
      <TAB045304 v-show="activeTab === (hasBizAdmin ? 3 : hasQcPermission ? 2 : 1)" />
    </div>
  </div>
</template>

<script>
import TAB045301 from './TAB045301.vue';
import TAB045302 from './TAB045302.vue';
import TAB045303 from './TAB045303.vue';
import TAB045304 from './TAB045304.vue';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: 'TAB045300',
  components: {
    TAB045301,
    TAB045302,
    TAB045303,
    TAB045304,
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
      QcRoleList: [],
    };
  },
  computed: {    
    hasQcPermission() {
      const roleList = this.userAuthInfo?.roleList || [];
      return roleList.some(role => this.QcRoleList.map(item => item.value).includes(role));  //['R011', 'R018']
    },  
    hasBizAdmin() {
      const roleList = this.userAuthInfo?.roleList || [];
      return roleList.includes('BIZADMIN');  //['R011', 'R018']
    },
    userAuthInfo() {
      return useUserAuthInfo();
    }
  },
  created() {},
  async mounted() {
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    async getSelectOptions() {
      await this.$utils.getCommonCodeValueText(['103'], [this.QcRoleList]); //샘프요청권한
      console.log('info',this.QcRoleList.map(item => item.value));
    },
  },
};
</script>
