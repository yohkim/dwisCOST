import { defineStore } from "pinia";

export const useGlobalCountStore = defineStore("globalCount", {
  state: () => ({
    count: 0,
  }),
  getters: {
    getCount: (state) => state.ount, // 리얼그리드 생성 수
  },
  actions: {
    increment() {
      this.count += 1;
    },
  },
});