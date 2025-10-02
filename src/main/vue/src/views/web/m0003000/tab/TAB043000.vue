/**
*	제조 실적 입력 > 포장/출하 > SI 의뢰 실적
*/
<template>
	<auth-tabs :tabLevel="4" :pTabId="'TAB043000'" class="four_depth_tab">
		<template #tab-content-074>
			출하 검사 대기
		</template>
		<template #tab-content-077>
			출하 검사 의뢰
		</template>
		<template #tab-content-080>
			출하 검사
		</template>
		<template #tab-content-082>
			출하 대기
		</template>
		<template #tab-content-087>
			출하
		</template>
  </auth-tabs>
</template>

<script>

export default {
	props: {},  
	components: {},
	watch: {},
	data () {
		return {
			//VIEW_PLAN_DATA	
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
			//VIEW_PLAN_GRID
		}
	},
}

</script>