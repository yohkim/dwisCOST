/*
* 공정(step) 1개 선택
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

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
		{ fieldName: '공정코드'	,dataType: ValueType.TEXT },		
		{ fieldName: '공정명'	,dataType: ValueType.TEXT },
		{ fieldName: '공정약어'	,dataType: ValueType.TEXT },
		{ fieldName: 'area'		,dataType: ValueType.TEXT },
		{ fieldName: 'areaCode'	,dataType: ValueType.TEXT },
		{ fieldName: 'remark'	,dataType: ValueType.TEXT },
		
	],
	columns: [
		{ name: 'line'     	   ,fieldName: 'line'     ,width: '70', header: { text: 'line' }, editable: false },		
		{ name: '공정코드'     ,fieldName: '공정코드'   ,width: '100', header: { text: 'Step코드' }, editable: false },		
		{ name: '공정명'       ,fieldName: '공정명'     ,width: '180', header: { text: 'Step명' }, editable: false },
		{ name: '공정약어'     ,fieldName: '공정약어'   ,width: '150', header: { text: 'Step약어' }, editable: false },
		{ name: 'area'     	  ,fieldName: 'area'       ,width: '150', header: { text: 'Area' }, editable: false },
		{ name: 'areaCode'     ,fieldName: 'areaCode'    ,width: '100', header: { text: 'Area코드' }, editable: false },
		{ name: 'remark'      ,fieldName: 'remark'     ,width: '200', header: { text: 'Remark' }, editable: false },
	],
}

module.exports = grid;