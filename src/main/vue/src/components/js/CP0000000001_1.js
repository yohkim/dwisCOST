/*
* 제품유형 선택
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false,exclusive:true },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
		},
		edit: { editable: false },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: false },
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '제품유형라벨'	,dataType: ValueType.TEXT },		
		{ fieldName: '제품유형'	,dataType: ValueType.TEXT },
	],
	columns: [	
		{ name: '제품유형라벨' ,fieldName: '제품유형라벨' ,width: '20', header: { text: '제품유형' }, editable: false ,autoFilter:true},		
		{ name: '제품유형'    ,fieldName: '제품유형'  	,width: '10', header: { text: 'CODE' }, editable: false ,autoFilter:true },
	],
}
module.exports = grid;

<style scoped>
/* 필요한 스타일 추가 */
width: 100
</style>