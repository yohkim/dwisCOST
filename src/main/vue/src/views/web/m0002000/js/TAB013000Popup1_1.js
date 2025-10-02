/*
* 공정(step) 다수 선택
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
		{ fieldName: 'line'		,dataType: ValueType.TEXT },
		{ fieldName: 'process_id'	,dataType: ValueType.TEXT },		
		{ fieldName: '공정설명'	,dataType: ValueType.TEXT },
		
	],
	columns: [
		{ name: 'line'     	   ,fieldName: 'line'     ,width: '50', header: { text: 'line' }, editable: false },		
		{ name: 'process_id'     ,fieldName: 'process_id'   ,width: '150', header: { text: 'PROCESS_ID' }, editable: false },		
		{ name: '공정설명'       ,fieldName: '공정설명'     ,width: '180', header: { text: '공정설명' }, editable: false },
	],
}

module.exports = grid;