import { defineStore } from 'pinia';

export const useM0008000 = defineStore('m0008000', {
  state: () => ({
    menu1Item: { value: '', text: '', period: '' },
    menu2Item: { value: '', text: '', period: '' },
    menu3Item: { value: '', text: '', period: '' },
  }),
  getters: {
    getSearchkInfo: (state) => {
      return {
        menu1Item: state.menu1Item,
        menu2Item: state.menu2Item,
        menu3Item: state.menu3Item,
      };
    },
  },
  actions: {
    setSearchInfo(obj) {
      this.menu1Item = obj.menu1Item;
      this.menu2Item = obj.menu2Item;
      this.menu3Item = obj.menu3Item;
    },
    clearMenu1ItemInfo(){
      this.menu1Item = { value: '', text: '', period: '' };
    },
    clearMenu2ItemInfo(){
      this.menu2Item = { value: '', text: '', period: '' };
    },
    clearMenu3ItemInfo(){
      this.menu3Item = { value: '', text: '', period: '' };
    },
  },
});
