/*
* Area
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

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
		{ fieldName: '공정구분'		,dataType: ValueType.TEXT },
		{ fieldName: 'area'		,dataType: ValueType.TEXT },
		{ fieldName: 'useYn'	,dataType: ValueType.TEXT },
		
	],
	columns: [
		{ name: 'line'     	   ,fieldName: 'line'     ,width: '80', header: { text: 'line' }, editable: false },	
		{ name: '공정구분'     ,fieldName: '공정구분'    ,width: '80', header: { text: 'Area코드' }, editable: false },
		{ name: 'area'     	  ,fieldName: 'area'       ,width: '200', header: { text: 'Area' }, editable: false },
		{ name: 'useYn'       ,fieldName: 'useYn'     ,width: '80', header: { text: '사용여부' }, editable: false },
	],
}

module.exports = grid;