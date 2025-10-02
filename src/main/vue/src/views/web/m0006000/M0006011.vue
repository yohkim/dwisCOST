/**
 *	기준정보 > 설비관리
 */
<template>
	<auth-tabs>
		<!-- Tab 1 설비현황-->
		<template #tab-content-TAB065000>
			<TAB065000/>
		</template>
		<!-- Tab 2 설비로그관리 -->
		<template #tab-content-TAB066000>
			<TAB066000/>	
		</template>
	</auth-tabs>
</template>

<script>
import TAB065000 from './tab/TAB065000.vue';
import TAB066000 from './tab/TAB066000.vue';
export default {
	name:"DW_M0006011",	
    props: {},  
	components:{
		TAB065000,TAB066000
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
		console.log("menu M0006011");
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