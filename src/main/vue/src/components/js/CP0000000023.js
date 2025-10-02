/*
* 제품 모델델 찾기
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

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
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'line', dataType: ValueType.TEXT },
		{ fieldName: 'model', dataType: ValueType.TEXT },
		{ fieldName: 'inch', dataType: ValueType.TEXT },
		{ fieldName: 'glassThick', dataType: ValueType.TEXT },
		{ fieldName: 'spec', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'line', fieldName: 'line', width: '80', header: { text: '라인' }, autoFilter: true },
		{ name: 'model', fieldName: 'model', width: '100', header: { text: '모델' }, autoFilter: true },
		{ name: 'inch', fieldName: 'inch', width: '100', header: { text: 'Inch' }, autoFilter: true },
		{ name: 'glassThick', fieldName: 'glassThick', width: '100', header: { text: 'Glass 두께' }, autoFilter: true },
		{ name: 'spec', fieldName: 'spec', width: '200', header: { text: '규격' }, autoFilter: true },
	],
}

module.exports = grid;
