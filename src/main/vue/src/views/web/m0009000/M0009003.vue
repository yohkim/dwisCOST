/**
*	설비관리 > 설비효율 report
*/
<template>
	<div>
		<b-tabs b-model="tab" class="three_depth_tab">
			<b-tab title="설비효율">
				<TAB090301/>
            </b-tab>            
		</b-tabs>
    </div>
</template>

<script>
import TAB090301 from './tab/TAB090301.vue';

export default {
	name:"DW_M0009003",
	props: {},  
	components: {
		TAB090301,        
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