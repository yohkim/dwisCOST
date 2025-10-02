/**
*	자재관리 > 원자재
*/
<template>
	<auth-tabs >
		<!-- Tab 0 공정입고 -->
		<template #tab-content-TAB001101>
			<TAB001101 />
		</template>
		<!-- Tab 1 공정출고 -->
		<template #tab-content-TAB001201>
			<TAB001201 />
		</template>
		<!-- Tab 2 재고실사 -->
		<template #tab-content-TAB001301>
			<TAB001301 />
		</template>
		<!-- Tab 3 재고현황 -->
		<template #tab-content-TAB001401>
			<TAB001401 />
		</template>
		<!-- Tab 4 원장정보 -->
		<template #tab-content-TAB001501>
			<TAB001501 />
		</template>
	</auth-tabs>
</template>

<script>
import TAB001101 from './tab/TAB001101.vue';
import TAB001201 from './tab/TAB001201.vue';
import TAB001301 from './tab/TAB001301.vue';
import TAB001401 from './tab/TAB001401.vue';
import TAB001501 from './tab/TAB001501.vue';
export default {
	name:"DW_M0001001",	
    props: {},  
	components:{
		TAB001101,
		TAB001201,
		TAB001301,
		TAB001401,
		TAB001501,
	},
}
</script>
