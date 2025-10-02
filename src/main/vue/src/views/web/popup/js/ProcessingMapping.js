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
		rowIndicator: { visible: false },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'lotrunId', dataType: ValueType.TEXT },
		{ fieldName: 'blNo', dataType: ValueType.TEXT },
		{ fieldName: 'machineCode', dataType: ValueType.TEXT },
		{ fieldName: '불량구분', dataType: ValueType.TEXT },
		{ fieldName: '불량위치', dataType: ValueType.TEXT },
		{ fieldName: '불량코드', dataType: ValueType.TEXT },
		{ fieldName: '검사시각', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: "불량위치", fieldName: "불량위치", header: { text: "위치" }, editable: false },
	],

	layout: ["불량위치"],
}

module.exports = grid;