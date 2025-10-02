/**
 *	제조 실적 관리 > Hold 관리
 */
<template>
	<auth-tabs>
		<!-- Tab 1 Hold 설정-->
		<template #tab-content-TAB040001>
			<TAB040001/>
		</template>
		<!-- Tab 2 Hold 해제 -->
		<template #tab-content-TAB040002>
			<TAB040002/>
		</template>
	</auth-tabs>
</template>

<script>
import TAB040001 from './tab/TAB040001.vue';
import TAB040002 from './tab/TAB040002.vue';
export default {
	name:"DW_M0004003",	
    props: {},  
	components:{
		TAB040001,
		TAB040002
	},
	watch: {},
	data () {
		return {
		}
	},
	computed: {},	
	created() {		
	},	
	mounted() {
	},
	beforeUnmount() {
	},
	methods: {
	},

	//keepAlive 활성화시 사용가능
	activated() {
		// called on initial mount
		// and every time it is re-inserted from the cache
	},

	deactivated(){
		// called when removed from the DOM into the cache
		// and also when unmounted
	},
}

</script>