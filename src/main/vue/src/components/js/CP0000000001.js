/*
* 거래처 찾기
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

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
		{ fieldName: '거래처코드', dataType: ValueType.TEXT },
		{ fieldName: '거래처명', dataType: ValueType.TEXT },
		{ fieldName: '거래처약명', dataType: ValueType.TEXT },
		{ fieldName: '대표자', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '거래처코드', fieldName: '거래처코드', width: '100', header: { text: '거래처코드' }, autoFilter: true },
		{ name: '거래처명', fieldName: '거래처명', width: '150', header: { text: '거래처명' }, autoFilter: true },
		{ name: '거래처약명', fieldName: '거래처약명', width: '100', header: { text: '거래처약명' }, autoFilter: true },
		{ name: '대표자', fieldName: '대표자', width: '100', header: { text: '대표자' }, autoFilter: true },
	],
}

module.exports = grid;
