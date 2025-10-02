/**
*	자재관리 > 포장재
*/
<template>
	<auth-tabs >
		<!-- Tab 0 공정전 입고 -->
		<template #tab-content-TAB001109>
			<TAB001109 />
		</template>
		<!-- Tab 1 공정투입 -->
		<template #tab-content-TAB001209>
			<TAB001209 />
		</template>			
		<!-- Tab 2재고실사 -->
		<template #tab-content-TAB001309>
			<TAB001309 />
		</template>
		<!-- Tab 3 재고현황 -->
		<template #tab-content-TAB001409>
			<TAB001409 />
		</template>
		<!-- Tab 4 품목관리 -->
		<template #tab-content-TAB001509>
			<TAB001509 />
		</template>		

	</auth-tabs>
</template>

<script>
import TAB001109 from './tab/TAB001109.vue';
import TAB001209 from './tab/TAB001209.vue';
import TAB001309 from './tab/TAB001309.vue';
import TAB001409 from './tab/TAB001409.vue';
import TAB001509 from './tab/TAB001509.vue';
export default {
	name:"DW_M0001009",	
    props: {},  
	components:{
		TAB001109,
		TAB001209,
		TAB001309,
		TAB001409,
		TAB001509,
	},
}
</script>
