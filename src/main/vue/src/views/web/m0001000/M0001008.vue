/**
*	자재관리 > 부자재-더미글라스
*/
<template>
	<auth-tabs >
		<!-- Tab 0 공정전 입고 -->
		<template #tab-content-TAB001108>
			<TAB001108 />
		</template>
		<!-- Tab 1 공정투입 -->
		<template #tab-content-TAB001208>
			<TAB001208 />
		</template>			
		<!-- Tab 2재고실사 -->
		<template #tab-content-TAB001308>
			<TAB001308 />
		</template>
		<!-- Tab 3 재고현황 -->
		<template #tab-content-TAB001408>
			<TAB001408 />
		</template>

	</auth-tabs>
</template>

<script>
import TAB001108 from './tab/TAB001108.vue';
import TAB001208 from './tab/TAB001208.vue';
import TAB001308 from './tab/TAB001308.vue';
import TAB001408 from './tab/TAB001408.vue';
export default {
	name:"DW_M0001008",	
    props: {},  
	components:{
		TAB001108,
		TAB001208,
		TAB001308,
		TAB001408,
	},
}
</script>
