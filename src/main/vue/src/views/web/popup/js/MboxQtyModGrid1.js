
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');
const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.SINGLE,
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
		rowIndicator: { visible: false },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'mboxNo', dataType: ValueType.TEXT },
		{ fieldName: 'qty', dataType: ValueType.NUMBER },
		{ fieldName: 'modQty', dataType: ValueType.NUMBER },
		{ fieldName: 'addQty', dataType: ValueType.NUMBER },
		{ fieldName: 'delQty', dataType: ValueType.NUMBER },
	],

	columns: [
		{ name: 'mboxNo', fieldName: 'mboxNo', width: '100', header: { text: 'M-BOX NO' }},
		{ name: 'qty', fieldName: 'qty', width: '100', header: { text: '수량' }},
		{ name: 'modQty', fieldName: 'modQty', width: '100', header: { text: '변경수량' }},
		{ name: 'addQty', fieldName: 'addQty', width: '100', header: { text: '추가수량' }},
		{ name: 'delQty', fieldName: 'stadelQtyge', width: '100', header: { text: '삭제수량' }},
	],
}
module.exports = grid;