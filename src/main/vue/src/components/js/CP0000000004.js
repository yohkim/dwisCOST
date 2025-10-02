/*
* 작업자 찾기
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const grid = {
	
	options: {
		checkBar: { visible: false,exclusive:true },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true,fitStyle: GridFitStyle.EVEN_FILL, },
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
		{ fieldName: '작업자코드', dataType: ValueType.TEXT },
		{ fieldName: '작업자명', dataType: ValueType.TEXT },
		{ fieldName: '직책명', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '작업자코드', fieldName: '작업자코드', width: '120', header: { text: '작업자코드' }, autoFilter:true },
		{ name: '작업자명', fieldName: '작업자명', width: '120', header: { text: '작업자명' }, autoFilter:true },
		//{ name: '직책명', fieldName: '직책명', width: '0', header: { text: '직책명' }, autoFilter:true },
	],

}

module.exports = grid;
