/**
*	자재관리 > 부자재-약액
*/
<template>
	<auth-tabs >
		<!-- Tab 0 공정전 입고 -->
		<template #tab-content-TAB001106>
			<TAB001106 />
		</template>
		<!-- Tab 1 공정투입 -->
		<template #tab-content-TAB001206>
			<TAB001206 />
		</template>
		<!-- Tab 2 공정창고 반납 -->
		<template #tab-content-TAB001506>
			<TAB001506 />
		</template>				
		<!-- Tab 3재고실사 -->
		<template #tab-content-TAB001306>
			<TAB001306 />
		</template>
		<!-- Tab 4 재고현황 -->
		<template #tab-content-TAB001406>
			<TAB001406 />
		</template>

	</auth-tabs>
</template>

<script>
import TAB001106 from './tab/TAB001106.vue';
import TAB001206 from './tab/TAB001206.vue';
import TAB001306 from './tab/TAB001306.vue';
import TAB001406 from './tab/TAB001406.vue';
import TAB001506 from './tab/TAB001506.vue';
export default {
	name:"DW_M0001006",	
    props: {},  
	components:{
		TAB001106,
		TAB001206,
		TAB001306,
		TAB001406,
		TAB001506,
	},
}
</script>
