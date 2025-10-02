/**
*	자재관리 > 부자재-필름
*/
<template>
	<auth-tabs >
		<!-- Tab 0 공정전 입고 -->
		<template #tab-content-TAB001104>
			<TAB001104 />
		</template>
		<!-- Tab 1 공정출고 -->
		<template #tab-content-TAB001204>
			<TAB001204 />
		</template>
		<!-- Tab 3 불량발생 -->
		<template #tab-content-TAB001504>
			<TAB001504 />
		</template>		
		<!-- Tab 4재고실사 -->
		<template #tab-content-TAB001304>
			<TAB001304 />
		</template>
		<!-- Tab 5 재고현황 -->
		<template #tab-content-TAB001404>
			<TAB001404 />
		</template>
		<!-- Tab 6 Model별 필름정보 -->
		<template #tab-content-TAB001604>
			<TAB001604 />
		</template>		
	</auth-tabs>
</template>

<script>
import TAB001104 from './tab/TAB001104.vue';
import TAB001204 from './tab/TAB001204.vue';
import TAB001304 from './tab/TAB001304.vue';
import TAB001404 from './tab/TAB001404.vue';
import TAB001504 from './tab/TAB001504.vue';
import TAB001604 from './tab/TAB001604.vue';
export default {
	name:"DW_M0001004",	
    props: {},  
	components:{
		TAB001104,
		TAB001204,
		TAB001304,
		TAB001404,
		TAB001504,
		TAB001604,
	},
}
</script>
