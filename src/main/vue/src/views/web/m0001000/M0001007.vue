/**
*	자재관리 > 부자재-필터
*/
<template>
	<auth-tabs >
		<!-- Tab 0 공정전 입고 -->
		<template #tab-content-TAB001107>
			<TAB001107 />
		</template>
		<!-- Tab 1 공정투입 -->
		<template #tab-content-TAB001207>
			<TAB001207 />
		</template>			
		<!-- Tab 2재고실사 -->
		<template #tab-content-TAB001307>
			<TAB001307 />
		</template>
		<!-- Tab 3 재고현황 -->
		<template #tab-content-TAB001407>
			<TAB001407 />
		</template>

	</auth-tabs>
</template>

<script>
import TAB001107 from './tab/TAB001107.vue';
import TAB001207 from './tab/TAB001207.vue';
import TAB001307 from './tab/TAB001307.vue';
import TAB001407 from './tab/TAB001407.vue';
export default {
	name:"DW_M0001007",	
    props: {},  
	components:{
		TAB001107,
		TAB001207,
		TAB001307,
		TAB001407,
	},
}
</script>
