/**
*	프로세스 플래닝 > 제품 모델 관리
*/
<template>
	<auth-tabs>
		<!-- Tab 0 모델마스터 -->
		<template #tab-content-TAB009000>
			<TAB009000 />
		</template>
		<!-- Tab 1 제품마스터 -->
		<template #tab-content-TAB010000>
			<TAB010000 />
		</template>
		<!-- Tab 1 제품개발이력관리-->
		<template #tab-content-TAB020001>
			<TAB020001 />
		</template>
		<!-- Tab 2 모델기본정보-->
		<template #tab-content-TAB020004>
			<TAB020004 />
		</template>
		<!-- Tab 3 모델별 모니터링-->
		<template #tab-content-TAB020005>
			<TAB020005 />
		</template>
	</auth-tabs>
</template>

<script>
import TAB009000 from './tab/TAB009000.vue';
import TAB010000 from './tab/TAB010000.vue';
import TAB020001 from './tab/TAB020001.vue';
import TAB020004 from './tab/TAB020004.vue';
import TAB020005 from './tab/TAB020005.vue';
export default {
	name:"DW_M0002002",
	props: {},  
	components: {
		TAB009000,
		TAB010000,
		TAB020001,
		TAB020004,
		TAB020005
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
	mounted() {
	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {			
		},
	},
}

</script>