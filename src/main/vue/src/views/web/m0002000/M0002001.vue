/**
*	프로세스 플래닝 > SITE 모델링 관리
*/
<template>
	<auth-tabs >
		<!-- Tab 0 라인/AREA 마스터 -->
		<template #tab-content-TAB007000>
			<TAB007000 />
		</template>
		<!-- Tab 1 설비 마스터 -->
		<template #tab-content-TAB008000>
			<TAB008000 />
		</template>
		<!-- Tab 2 설비현황 -->
		<template #tab-content-TAB020002>
			<TAB020002 />
		</template>
		<!-- Tab 3 설비로그관리 -->
		<template #tab-content-TAB020003>
			<TAB020003 />
		</template>
		<template #tab-content-TAB020008><!--설비관리(PM계획vs실적)-->
			<TAB020008 />
		</template>
	</auth-tabs>
</template>

<script>
import TAB007000 from './tab/TAB007000.vue';
import TAB008000 from './tab/TAB008000.vue';
import TAB020002 from './tab/TAB020002.vue';
import TAB020003 from './tab/TAB020003.vue';
import TAB020008 from './tab/TAB020008.vue';

export default {
	name:"DW_M0002001",
	props: {},  
	components: {
		TAB007000,
		TAB008000,
		TAB020002,
		TAB020003,
		TAB020008,
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