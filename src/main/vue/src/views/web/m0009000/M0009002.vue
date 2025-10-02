/**
*	설비관리 > 설비 비가동 관리
*/
<template>
	<div>
		<b-tabs b-model="tab" class="three_depth_tab">
			<b-tab title="설비 비가동 실적">
				<TAB090201/>
            </b-tab>            
		</b-tabs>
    </div>
</template>

<script>
import TAB090201 from './tab/TAB090201.vue';

export default {
	name:"DW_M0009002",
	props: {},  
	components: {
		TAB090201,        
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