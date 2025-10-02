/**
*	자재관리 > 부자재-Tray
*/
<template>
	<auth-tabs >
		<!-- Tab 0 공정전 입고 -->
		<template #tab-content-TAB001105>
			<TAB001105 />
		</template>
		<!-- Tab 1 공정출고 -->
		<template #tab-content-TAB001205>
			<TAB001205 />
		</template>
		<!-- Tab 3재고실사 -->
		<template #tab-content-TAB001305>
			<TAB001305 />
		</template>
		<!-- Tab 4 재고현황 -->
		<template #tab-content-TAB001405>
			<TAB001405 />
		</template>
		<!-- Tab 5 Tray코드별 모델정보 -->
		<template #tab-content-TAB001505>
			<TAB001505 />
		</template>		
	</auth-tabs>
</template>

<script>
import TAB001105 from './tab/TAB001105.vue';
import TAB001205 from './tab/TAB001205.vue';
import TAB001305 from './tab/TAB001305.vue';
import TAB001405 from './tab/TAB001405.vue';
import TAB001505 from './tab/TAB001505.vue';
export default {
	name:"DW_M0001005",	
    props: {},  
	components:{
		TAB001105,
		TAB001205,
		TAB001305,
		TAB001405,
		TAB001505,
	},
}
</script>
