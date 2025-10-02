/**
*	자재관리 > 부자재-레진
*/
<template>
	<auth-tabs >
		<!-- Tab 0 공정입고 -->
		<template #tab-content-TAB001102>
			<TAB001102 />
		</template>
		<!-- Tab 1 공정출고 -->
		<template #tab-content-TAB001202>
			<TAB001202 />
		</template>
		<!-- Tab 2 재고실사 -->
		<template #tab-content-TAB001302>
			<TAB001302 />
		</template>
		<!-- Tab 3 재고현황 -->
		<template #tab-content-TAB001402>
			<TAB001402 />
		</template>
	</auth-tabs>
</template>

<script>
import TAB001102 from './tab/TAB001102.vue';
import TAB001202 from './tab/TAB001202.vue';
import TAB001302 from './tab/TAB001302.vue';
import TAB001402 from './tab/TAB001402.vue';
export default {
	name:"DW_M0001002",	
    props: {},  
	components:{
		TAB001102,
		TAB001202,
		TAB001302,
		TAB001402,
	},
}
</script>
