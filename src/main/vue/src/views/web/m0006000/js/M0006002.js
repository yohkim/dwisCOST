/*
* 기준정보 > 사용자-메뉴 권한 > 사용자 관리
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: true },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
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
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: true },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'majCode', dataType: ValueType.TEXT },
		{ fieldName: 'code', dataType: ValueType.TEXT },
		{ fieldName: 'codeName', dataType: ValueType.TEXT },
		{ fieldName: 'useYn', dataType: ValueType.BOOLEAN },
	],

	columns: [
		{ name: 'majCode', fieldName: 'majCode', width: '200', header: { text: '대분류' }, editable: false, sortable: false },
		{ name: 'code', fieldName: 'code', width: '200', header: { text: '코드' }, editable: false, sortable: true, editor: {maxLength: 10} },
		{ name: 'codeName', fieldName: 'codeName', width: '500', header: { text: '코드명' }, editable: false, editor: {maxLength: 50} },
		{
			name: 'useYn', fieldName: 'useYn', width: '120', header: { text: '사용여부' }, editable: false, sortable: false, styleName:'edit',
			renderer: {
				type: "check",
				editable: true,
				trueValues: "1",
				falseValues: "0",
			},
		},
	],
}

module.exports = grid;