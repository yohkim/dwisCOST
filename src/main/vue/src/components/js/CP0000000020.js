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
		{ fieldName: 'area' ,dataType: ValueType.TEXT },
		{ fieldName: '공정코드' ,dataType: ValueType.TEXT },
		{ fieldName: '공정명' ,dataType: ValueType.TEXT },
		
	],
	columns: [
		{ name: 'area' ,fieldName: 'area' ,width: '100', header: { text: 'AREA' }, autoFilter: true, styleName: "tl" },		
		{ name: '공정코드' ,fieldName: '공정코드' ,width: '100', header: { text: '공정코드' }, autoFilter: true, styleName: "tl" },		
		{ name: '공정명' ,fieldName: '공정명' ,width: '300', header: { text: '공정명' }, autoFilter: true, styleName: "tl" },
	],
}

module.exports = grid;