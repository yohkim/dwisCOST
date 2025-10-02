<template>
	<div>
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
	name: "DwHome",
	setup() {
		const userAuthInfo = useUserAuthInfo();
		const orgSysRescList = userAuthInfo.getSysResourceMap.childSysResc || [];
		return { userAuthInfo,orgSysRescList };
	},
	data () {
		return {
			selectedProdCtg:null,
		}
	},
	computed:{
		prodCtgList(){
			return this.userAuthInfo.getProdCtgList;
		},
		sysRescList() {
			const result = [];
			let dv = 3;
			if(this.menuType === 'all'){
				dv = 3;
			}else if(this.menuType === 'four'){
				dv = 2;
			}else if(this.menuType === 'three'){
				dv = 3;
			}else{
				return this.orgSysRescList;
			}

			for (let i = 0; i < this.orgSysRescList.length; i += dv) {
				result.push(this.orgSysRescList.slice(i, i + dv));
			}

			return result;
		},
		menuType(){
			let rtn = "";
			if(this.orgSysRescList.length > 4){
				rtn = "all";
			}else if(this.orgSysRescList.length === 4){
				rtn = "four";
			}else if(this.orgSysRescList.length === 3){
				rtn = "three";
			}else{	//3개 이하
				rtn = "etc";
			}
			console.log("menuType::",rtn);
			return rtn;
		}
	},
	mounted(){
		this.selectdProdCtg = this.userAuthInfo.curProdCtg;
	},
	methods: {
		async menuClick(menuObj){
			console.log("menuObj.url:::",menuObj.url);
			if(menuObj.url){
				await new Promise(resolve => {
					this.$utils.updateLocalStorage(localStorage, 'localTabs' + this.userAuthInfo.token, [_.cloneDeep(menuObj)]);
					resolve();
				});
				
				let queryObj = this.$utils.parseQueryParams(menuObj.url);
				//공정(또는 4레벨 관련 ID,코드가 필요한 경우)
				if('sysResourceId' in menuObj){
					queryObj['sysResourceId'] = menuObj['sysResourceId'] ;
				}
				this.$router.push({ path: menuObj.url,query:queryObj });
			}
		},
		createMenuData(menu, subMenu = null, childMenu = null, child = null) {
			let rtnObj = this.$utils.createMenuData(menu, subMenu, childMenu);
			if(child){
				rtnObj['sysResourceId'] = child.sysResourceId;
			}
			return this.$utils.createMenuData(menu, subMenu, childMenu);
		},
		onProdCtgChange(v){
			this.userAuthInfo.changeProdCtg(v);
		}
	}
}
</script>
<style scoped>
::-webkit-scrollbar {
  width: 8px;
  border-radius: 10px;
}
::-webkit-scrollbar-track {
  background-color: #384462;
   border-radius: 8px;
}
::-webkit-scrollbar-thumb { 
  background-color: skyblue;
  border-radius: 8px;
}
::-webkit-scrollbar-button {
  display: none;
}
</style>