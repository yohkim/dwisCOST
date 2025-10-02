/**
 *	기준정보 > 설비관리
 */
<template>
	<auth-tabs>
		<!-- Tab 1 UTG 작업 이력 조회-->
		<template #tab-content-TAB051000>
		</template>
		<!-- Tab 2 제품 진행 현황 조회 -->
		<template #tab-content-TAB052000>
		</template>
		<!-- Tab 3 CELL 작업 이력 조회(개별) -->
		<template #tab-content-TAB053000>
		</template>
		<!-- Tab 4 CELL 작업 이력 조회(대량) -->
		<template #tab-content-TAB054000>
			<TAB054000/>
		</template>
		<!-- Tab 5 PACK 작업 이력 조회 -->
		<template #tab-content-TAB055000>
		</template>
	</auth-tabs>
</template>

<script>
import TAB054000 from './tab/TAB054000.vue';
export default {
	name:"DW_M0005003",	
    props: {},  
	components:{
		TAB054000
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
		console.log("menu M0005000");
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