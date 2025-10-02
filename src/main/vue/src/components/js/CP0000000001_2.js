/*
* 작업구분 선택
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false,exclusive:true },
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
		{ fieldName: '작업구분라벨'	,dataType: ValueType.TEXT },		
		{ fieldName: '작업구분'	,dataType: ValueType.TEXT },
	],
	columns: [	
		{ name: '작업구분라벨'     ,fieldName: '작업구분라벨'   ,width: '20', header: { text: '작업구분' }, editable: false },		
		{ name: '작업구분'    ,fieldName: '작업구분'  ,width: '10', header: { text: 'CODE' }, editable: false },
	],
}

module.exports = grid;