
<template>
  <div class="wrap" :class="{ dwmain: isMain }">
    <template v-if="!isLoggedIn">
        <MenuTabs></MenuTabs>
          <div class="container-fluid dw_mes">
            <div class="contain">
              <router-view v-slot="{ Component }">
                <keep-alive>
                  <component :is="Component" />
                </keep-alive>
              </router-view>            
            </div>
        </div>
      </template>
      <template v-else>
        <div class="container-fluid g-0 dw_gate">
            <router-view></router-view>
        </div>
      </template>
      <div class="footer" v-if="!isLoggedIn">
          <div>ⓒ 2024 DOWOOINSYS</div>
          <div class="logo"></div>
      </div>
      <div v-show="isLoading" class="loading-overlay">
        <div class="spinner-border text-info" role="status"/>
      </div>  
  </div>
</template>

<script>
import { computed } from "vue";
import { useRoute } from 'vue-router';

document.title = process.env.VUE_APP_TITLE;

export default {
  name: 'App',

  setup() {
    const route = useRoute();
    const isLoggedIn = computed(() => ["DwwLogin"].indexOf(route.name) > -1);
    const isMain = computed(() => ["DwHome",'DwMain'].indexOf(route.name) > -1);
    return {
      isLoggedIn,isMain
    };
  },

  components: {
  },

  data: () => ({
    isLoading: false, // 로딩 상태 변수
  }),
  created() {
    window.addEventListener("loading-start", () => {
      this.isLoading = true;
    });
    window.addEventListener("loading-end", () => {
      this.isLoading = false;
    });
  },
  computed: {
    // isKeepAlive() {
    //   console.log('this.$route.meta.keepAlive', this.$route.meta.keepAlive);
    //   return this.$route.meta.keepAlive;
    // },
  },
}
</script>
<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all; 
  z-index: 99998;
}
.spinner-border {
  z-index: 99999;
  color: white;
}
</style>