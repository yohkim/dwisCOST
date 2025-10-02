/**
*	자재관리 > 부자재-Tool
*/
<template>
	<auth-tabs >
		<!-- Tab 0 공정전 입고 -->
		<template #tab-content-TAB001103>
			<TAB001103 />
		</template>
		<!-- Tab 1 공정출고 -->
		<template #tab-content-TAB001203>
			<TAB001203 />
		</template>
		<!-- Tab 2 재고실사 -->
		<template #tab-content-TAB001303>
			<TAB001303 />
		</template>
		<!-- Tab 3 재고현황 -->
		<template #tab-content-TAB001403>
			<TAB001403 />
		</template>
	</auth-tabs>
</template>

<script>
import TAB001103 from './tab/TAB001103.vue';
import TAB001203 from './tab/TAB001203.vue';
import TAB001303 from './tab/TAB001303.vue';
import TAB001403 from './tab/TAB001403.vue';
export default {
	name:"DW_M0001003",	
    props: {},  
	components:{
		TAB001103,
		TAB001203,
		TAB001303,
		TAB001403,
	},
}
</script>
