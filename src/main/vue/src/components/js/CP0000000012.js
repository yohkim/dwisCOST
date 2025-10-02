/*
* model
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
		{ fieldName: 'model',  			dataType: ValueType.TEXT },
		{ fieldName: 'description', 	dataType: ValueType.TEXT },
		{ fieldName: 'trayCell', 		dataType: ValueType.TEXT },
		{ fieldName: 'useYn', 			dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'model'			,fieldName: 'model' 	   	,width: '80', header: { text: 'Model' }, editable:false},		
		{ name: 'description'  ,fieldName: 'description'	,width: '300', header: { text: 'Description' }, editable:false},
		{ name: 'trayCell'   	,fieldName: 'trayCell'		,width: '80', header: { text: 'TrayCell' }, editable:false },	
		{ name: 'useYn' 		,fieldName: 'useYn' 		,width: '80', header: { text: '사용여부' },  editable:false } ,
	],
}

module.exports = grid;