/**
 *	작업 이력 조회
 */
<template>
	<v-container>
		<v-sheet border class="search_box">
			<v-row class="search_area">
				<v-col cols="2">
					<v-select label="제품유형" density="compact" :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"/>
				</v-col>
				<v-col cols="2">
					<v-select label="작업구분" density="compact" :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"/>
				</v-col>
				<v-col cols="2">
					<v-select label="설비호기" density="compact" :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"/>
				</v-col>
				<v-col cols="2">
					<v-text-field hide-details="auto" label="Lot No"></v-text-field>
				</v-col>
				<v-col cols="2">
					<date-picker label="시작일" v-model="startDate" />
				</v-col>
				<v-col cols="2">
					<date-picker label="종료일" v-model="endDate" />
				</v-col>
			</v-row>
			<div class="btn_area">
				<v-btn>
					<v-icon  icon="mdi-magnify" start size="large"></v-icon>
						조회
				</v-btn>
			</div>
		</v-sheet>
		<div class="grid_box four_d_box">
			<div class="left_box">
				<div class="title">title</div>
			</div>
			<!--<RealGrid class="grid-border-none" ref="grid" :uid="'grid'" :step="1" :rows="rows"/>-->
		</div>
	</v-container>
</template>

<script>

export default {
	name:"DW_HistoryView",
    props: {},
	components:{},
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
			//this.grid = _.cloneDeep(require(`@web/m0006000/js/TAB064000.js`));
		},
	},
}

</script>