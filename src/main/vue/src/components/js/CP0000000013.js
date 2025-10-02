/*
* 공정(step) 다수 선택
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const USE_YN_LABELS = ["Y", "N"];
const USE_YN_VALUE = [true, false];

const grid = {
	
	options: {
		checkBar: { visible: false,exclusive:false },
		//copy: { enabled: true, singleMode: true },
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
		{ fieldName: '공정코드'	,dataType: ValueType.TEXT },		
		{ fieldName: '공정명'	,dataType: ValueType.TEXT },
	],
	columns: [	
		{ name: '공정코드'     ,fieldName: '공정코드'   ,width: '100', header: { text: '코드' }, editable: false, autoFilter:true },		
		{ name: '공정명'       ,fieldName: '공정명'     ,width: '180', header: { text: '공정명' }, editable: false, autoFilter:true },
	],
}

module.exports = grid;