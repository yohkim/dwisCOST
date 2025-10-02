/*
* DUV
*/
const { ValueType, SyncGridHeight } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill", syncGridHeight: SyncGridHeight.ALWAYS, },
		edit: { editable: false },
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
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '불량코드', dataType: ValueType.TEXT },
		{ fieldName: '불량명', dataType: ValueType.TEXT },
		{ fieldName: 'blockSu', dataType: ValueType.INT },
		{ fieldName: '불량수량', dataType: ValueType.INT },
	],

	columns: [
		{ name: "불량명", fieldName: "불량명", header: { text: "불량명" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "blockSu", fieldName: "blockSu", header: { text: "Block" }, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "불량수량", fieldName: "불량수량", header: { text: "Cell" }, renderer: { showTooltip: true }, styleName: "tr" },
	],

	layout: ["불량명", "blockSu", "불량수량"],
}

module.exports = grid;