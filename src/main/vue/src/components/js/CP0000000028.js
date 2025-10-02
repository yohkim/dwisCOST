/*
* 설비관리 설비 선택
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
			fitStyle: GridFitStyle.NONE,
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
		{ fieldName: '설비번호'	,dataType: ValueType.TEXT },	
		{ fieldName: '설비약명'	,dataType: ValueType.TEXT },
		{ fieldName: '공정코드'	,dataType: ValueType.TEXT },
		{ fieldName: '공정명'   ,dataType: ValueType.TEXT },		
	],
	columns: [
		{ name: 'line'     	   ,fieldName: 'line'		,width: '100', header: { text: 'line' }, autoFilter: true },		
		{ name: '설비번호'     	,fieldName: '설비번호'	,width: '100', header: { text: '설비번호' }, autoFilter: true },		
		{ name: '설비약명'     	,fieldName: '설비약명'   ,width: '200', header: { text: '설비약명' }, autoFilter: true },
		{ name: '공정코드'     	,fieldName: '공정코드'   ,width: '100', header: { text: '공정코드' }, autoFilter: true },
		{ name: '공정명'        ,fieldName: '공정명'   	,width: '150', header: { text: '공정명' }, autoFilter: true },
	],
}

module.exports = grid;