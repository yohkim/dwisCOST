/*
* 불량코드 찾기
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: true,exclusive:false },
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
		{ fieldName: '불량코드', dataType: ValueType.TEXT },
		{ fieldName: '불량명', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '불량코드', fieldName: '불량코드', width: '100', header: { text: '불량코드' }, autoFilter: true },
		{ name: '불량명', fieldName: '불량명', width: '200', header: { text: '불량명' }, autoFilter: true },
	],
}

module.exports = grid;