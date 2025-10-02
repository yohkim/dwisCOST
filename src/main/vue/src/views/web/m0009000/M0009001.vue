/**
*	설비관리 > 설비 기준정보
*/
<template>
	<auth-tabs >
		<!-- Tab 0 설비별 MST 정보 -->
		<template #tab-content-TAB090101>
			<TAB090101 />
		</template>
		<!-- Tab 1 비가동 항목 관리 -->
 		<template #tab-content-TAB090102>
			<TAB090102 />
		</template>		
		
	</auth-tabs>
</template>

<script>
import TAB090101 from '../m0009000/tab/TAB090101.vue';
import TAB090102 from '../m0009000/tab/TAB090102.vue';

export default {
	name:"DW_M0009001",
	props: {},  
	components: {
		TAB090101,
        TAB090102,
	},
	watch: {},
	data () {
		return {	
		}
	},
	computed: {},	
	created() {
		this.initializeGrid();
	},	
	mounted() {},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
		}
	},
}

</script>