/*
* 자재관리 > 원자재 > 원장정보 등록
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: true },
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
		edit: { editable: true },
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
		paste: { enabled: true },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'glassCode', dataType: ValueType.TEXT },
		{ fieldName: 'glassMaterial', dataType: ValueType.TEXT },
		{ fieldName: 'glassSize', dataType: ValueType.TEXT },
		{ fieldName: 'glassThickness', dataType: ValueType.NUMBER },
	],

	columns: [
		{ name: 'glassCode', fieldName: 'glassCode', width: '400', header: { text: 'PRODUCT CODE' }, editable: false, autoFilter:true, editor: {maxLength: 15}},
		{ name: 'glassMaterial', fieldName: 'glassMaterial', width: '200', header: { text: '원장 재질' }, editable: true, autoFilter:true, editor: {maxLength: 4}, styleName:'edit', },
		{ name: 'glassSize', fieldName: 'glassSize', width: '250', header: { text: '원장 크기' }, editable: true, autoFilter:true, editor: {maxLength: 13}, styleName:'edit' },
		{ name: 'glassThickness', fieldName: 'glassThickness', width: '200', header: { text: '두께' }, editable: true, autoFilter:true, numberFormat: '#,##0', editor: {maxLength: 4}, styleName:'edit' },
	],
}

module.exports = grid;