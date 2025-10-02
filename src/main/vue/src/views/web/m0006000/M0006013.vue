/**
 *	기준정보 > QR정보 등록록
 */
<template>
	<div>
		<b-tabs b-model="tab" class="three_depth_tab">
			<b-tab title="작업완료 QR">
				<TAB070000/>
            </b-tab>            
		</b-tabs>
    </div>
</template>

<script>

import TAB070000 from './tab/TAB070000.vue';

export default {
	props: {},  
	components: {
		TAB070000
    },
	watch: {},
	data () {
		return {	
		}
	},
	computed: {},	
	created() {},	
	mounted() {},
	beforeUnmount() {},
	methods: {},
}

</script>