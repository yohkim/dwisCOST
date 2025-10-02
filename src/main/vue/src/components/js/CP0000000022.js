/*
* 설비정보 1개 선택
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

const USE_YN_LABELS = ["Y", "N"];
const USE_YN_VALUE = [true, false];

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
		{ fieldName: 'model' ,dataType: ValueType.TEXT },
		{ fieldName: 'code' ,dataType: ValueType.TEXT },
		{ fieldName: 'description' ,dataType: ValueType.TEXT },
		{ fieldName: 'trayCell' ,dataType: ValueType.TEXT },
		{ fieldName: 'useYn' ,dataType: ValueType.TEXT },
		
	],
	columns: [
		{ name: 'model' ,fieldName: 'model' ,width: '100', header: { text: 'Model' }, autoFilter: true, styleName: "tl" },		
		{ name: 'code' ,fieldName: 'code' ,width: '100', header: { text: 'Code' }, autoFilter: true, styleName: "tl" },		
		{ name: 'description' ,fieldName: 'description' ,width: '100', header: { text: 'Description' }, autoFilter: true, styleName: "tl" },		
		{ name: 'trayCell' ,fieldName: 'trayCell' ,width: '300', header: { text: 'TrayCell' }, autoFilter: true, styleName: "tl" },
		{ name: 'useYn' ,fieldName: 'useYn' ,width: '300', header: { text: '사용여부' }, autoFilter: true, styleName: "tl" },
	],
}

module.exports = grid;