/*
* 불량코드 찾기
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: true,exclusive:true },
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
		{ fieldName: 'hold코드', dataType: ValueType.TEXT },
		{ fieldName: 'hold명', dataType: ValueType.TEXT },
		{ fieldName: '기준', dataType: ValueType.TEXT },
		{ fieldName: 'hold범위', dataType: ValueType.TEXT },
		{ fieldName: '모니터링주기', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'hold코드', fieldName: 'hold코드', width: '100', header: { text: 'hold코드' }, autoFilter: true },
		{ name: 'hold명', fieldName: 'hold명', width: '200', header: { text: 'hold명' }, autoFilter: true, styleName: 'tl' },
		{ name: '기준', fieldName: '기준', width: '200', header: { text: '기준' }, autoFilter: true, styleName: 'tl' },
		{ name: 'hold범위', fieldName: 'hold범위', width: '200', header: { text: 'hold범위' }, autoFilter: true, styleName: 'tl' },
		{ name: '모니터링주기', fieldName: '모니터링주기', width: '200', header: { text: '모니터링주기' }, autoFilter: true, styleName: 'tl' },
	],
}

module.exports = grid;