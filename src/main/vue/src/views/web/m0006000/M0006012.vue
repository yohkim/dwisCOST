/**
 *	기준정보 > 모델관리
 */
<template>
	<auth-tabs>
		<!-- Tab 1 모델기본정보-->
		<template #tab-content-TAB067000>
			<TAB067000/>
		</template>
		<!-- Tab 2 모델별_모니터링 -->
		<template #tab-content-TAB068000>
			<TAB068000/>	
		</template>
		<!-- Tab 3 공정별_모니터링 -->
		<template #tab-content-TAB069000>
			<TAB069000/>	
		</template>
	</auth-tabs>
</template>

<script>
import TAB067000 from './tab/TAB067000.vue';
import TAB068000 from './tab/TAB068000.vue';
import TAB069000 from './tab/TAB069000.vue';
export default {
	name:"DW_M0006012",	
    props: {},  
	components:{
		TAB067000,TAB068000,TAB069000
	},
	watch: {},
	data () {
		return {
		}
	},
	computed: {},	
	created() {		
	},	
	mounted() {
		console.log("menu M0006012");
	},
	beforeUnmount() {
	},
	methods: {
	},

	//keepAlive 활성화시 사용가능
	activated() {
		console.log("onActivated");
		// called on initial mount
		// and every time it is re-inserted from the cache
	},

	deactivated(){
		console.log("onDeactivated");
		// called when removed from the DOM into the cache
		// and also when unmounted
	},
}

</script>