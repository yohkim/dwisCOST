/*
* 자재관리 > 원자재 > 원장정보 등록
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

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
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
			rowHoverType: RowMaskType.ROW
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
		paste: { enabled: true ,
			checkReadOnly : true,
		},
		rowIndicator: { visible: true },
		sorting: { enabled: true },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'dateCode', dataType: ValueType.TEXT },
		{ fieldName: 'chgDate', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'dateCode', fieldName: 'dateCode', width: '200', header: { text: 'CODE' }, editable: false, autoFilter:true, sortable: false },
		{ name: 'chgDate', fieldName: 'chgDate', width: '200', header: { text: '날짜' }, editable: false, autoFilter:true, sortable: false },
	],
}

module.exports = grid;