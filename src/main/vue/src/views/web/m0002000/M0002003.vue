/**
*	프로세스 플래닝 > 제품 모델 관리
*/
<template>
	<auth-tabs>
		<!-- Tab 0 제품 공정 마스터 -->
		<template #tab-content-TAB011000>
			<TAB011000 />
		</template>
		<!-- Tab 1 공정 마스터 -->
		<template #tab-content-TAB012000>
			<TAB012000 />
		</template>
		<!-- Tab 2 공정 스텝 마스터 -->
		<template #tab-content-TAB013000>
			<TAB013000 />
		</template>
		<!-- Tab 3 스텝 마스터 -->
		<template #tab-content-TAB014000>
			<TAB014000 />
		</template>
		<!-- Tab 4 공정별 모니터링 -->
		<template #tab-content-TAB020006>
			<TAB020006 />
		</template>	
		<!-- Tab 5 공정별 불량코드 -->
		<template #tab-content-TAB020007>
			<TAB020007 />
		</template>				
	</auth-tabs>
</template>

<script>
import TAB011000 from './tab/TAB011000.vue';
import TAB012000 from './tab/TAB012000.vue';
import TAB013000 from './tab/TAB013000.vue';
import TAB014000 from './tab/TAB014000.vue';
import TAB020006 from './tab/TAB020006.vue';
import TAB020007 from './tab/TAB020007.vue';

export default {
	name:"DW_M0002003",
	props: {},  
	components: {
		TAB011000,
		TAB012000,
		TAB013000,
		TAB014000,
		TAB020006,
		TAB020007
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