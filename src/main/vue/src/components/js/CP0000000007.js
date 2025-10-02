/*
* 라인별 프로세스 찾기
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
		{ fieldName: 'line'			,dataType: ValueType.TEXT },
		{ fieldName: 'processId'	,dataType: ValueType.TEXT },		
		{ fieldName: 'description'	,dataType: ValueType.TEXT },
		{ fieldName: 'version'		,dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'line'			,fieldName: 'line'		 	,width: '100', header: { text: 'line' } },
		{ name: 'processId'		,fieldName: 'processId'  	,width: '100', header: { text: 'processId' } },			
		{ name: 'description'	,fieldName: 'description'	,width: '300', header: { text: 'description' } },
		{ name: 'version'		,fieldName: 'version'		,width: '100', header: { text: 'version' } },
	],
}

module.exports = grid;