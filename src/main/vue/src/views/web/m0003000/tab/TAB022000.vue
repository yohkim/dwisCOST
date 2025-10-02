/**
*	제조 실적 입력 > FRONT > DUV
*/
<template>
	<v-container>
		<v-card class="four_depth_tab">
			<auth-tabs :activeTab="0" :tabLevel="4" :pTabId="'TAB022000'">
				<!-- Tab 0 생산 실적 입력 -->
				<template #tab-content-TAB022001>
				<!-- <v-tab>생산 실적 입력</v-tab> -->
					<PerformanceInput/>
				</template>
				<!-- Tab 1 작업 이력 조회 -->
				<template #tab-content-TAB022002>
				<!-- <v-tab>작업 이력 조회</v-tab> -->
					<HistoryView/>
				</template>
				<!-- Tab 2 설비 로그 조회 -->
				<template #tab-content-TAB022003>
				<!-- <v-tab>설비 로그 조회</v-tab> -->
					<LogViewer/>
				</template>
			</auth-tabs>
		</v-card>
	</v-container>
</template>

<script>

export default {
	props: {},  
	components: {},
	watch: {},
	data () {
		return {
			tab: null,
		}
	},
	computed: {},	
	created() {},	
	mounted() {},
	beforeUnmount() {},
	methods: {},
}

</script>