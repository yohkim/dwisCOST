/*
* FRONT INFO3
*/
const { ValueType, SyncGridHeight } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill", syncGridHeight: SyncGridHeight.ALWAYS, },
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
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'blNo', dataType: ValueType.TEXT },
		{ fieldName: '불량입력', dataType: ValueType.TEXT },
		{ fieldName: '불량수량', dataType: ValueType.TEXT },
		{ fieldName: 'cell별불량수량', dataType: ValueType.TEXT },
		{ fieldName: 'pre불량수량', dataType: ValueType.NUMBER },
	],

	columns: [
		{ name: "lotNo", fieldName: "lotNo", header: { text: "LOT NO" }, renderer: { showTooltip: true }, mergeRule: { criteria: "value" }, editable: false, styleName: "tl" },
		{ name: "blNo", fieldName: "blNo", header: { text: "BLOCK NO" }, renderer: { showTooltip: true }, editable: false, styleName: "tl" },
		{ name: "불량입력", fieldName: "불량입력", header: { text: "item" }, editable: false,
			renderer:{
				type:"html",
				callback: function(grid, cell, w, h) {
					const ds = grid.getDataSource();
					const jsonData = ds.getJsonRow(cell.index.itemIndex);
					const str = '<button type="button" class="'+(jsonData['pre불량수량'] > 0 ? 'btn_block' : (jsonData['불량수량'] > 0 ? 'btn_sucess' : 'btn_error'))+'">불량입력</button>';
					return str;
				}
			},
		},
		{ name: "cell별불량수량", fieldName: "cell별불량수량", header: { text: "블록별 CELL 불량 수량" }, renderer: { showTooltip: true }, editable: false, editor: { type: 'number', integerOnly: true }, styleName: "tr" },
	],

	layout: [
		"lotNo","blNo",	"불량입력",
	],
}

module.exports = grid;