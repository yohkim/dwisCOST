/*
* FRONT INFO1
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill" },
		edit: { editable: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		//footer: {height:40},
		footers: {visible:false},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {visible:false},
		//headerSummary: {height:40},
		//hideDeletedRows: {},
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'runId', dataType: ValueType.TEXT },
		{ fieldName: 'cstNo', dataType: ValueType.TEXT },
		{ fieldName: 'cellId', dataType: ValueType.TEXT },
		{ fieldName: '차수', dataType: ValueType.INT },
	],

	columns: [
		{ name: "cellId", fieldName: "cellId", header: { text: "CELL_NO" }, editor: { textCase: 'upper' }, editable: false },
	],

}

module.exports = grid;