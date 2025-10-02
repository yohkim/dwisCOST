/*
* FRONT INFO1
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill", selectionStyle: "singleRow" },
		edit: { editable: false },
		//editor: {},
		filtering: {
			automating: {
				textCategorize: true,
				textCategoryCallback: null
			}
		},
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
		{ fieldName: '사용구분', dataType: ValueType.TEXT },
		{ fieldName: '툴번호', dataType: ValueType.TEXT },
		{ fieldName: '사용횟수', dataType: ValueType.INT },
		{ fieldName: '최대사용횟수', dataType: ValueType.INT },
		{ fieldName: '폐기', dataType: ValueType.TEXT },
		{ fieldName: 'line', dataType: ValueType.TEXT },
		{ fieldName: 'stepCode', dataType: ValueType.TEXT },
		{ fieldName: 'equipNo', dataType: ValueType.TEXT },
	],
	columns: [
		{ name: "사용구분", fieldName: "사용구분", header: { text: "툴번호" } },
		{ name: "툴번호", fieldName: "툴번호", header: { text: "툴번호" } },
		{ name: "사용횟수", fieldName: "사용횟수", header: { text: "사용횟수" } },
		{ name: "최대사용횟수", fieldName: "최대사용횟수", header: { text: "최대사용횟수" } },
		{ name: "폐기", fieldName: "폐기", header: { text: "폐기진행" }, visible: true,
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					return '<button type="button" class="btn_error">폐기</button>';
				}
		  	},
		},
	],

	layout: ["사용구분", "툴번호", "사용횟수", "최대사용횟수", "폐기"],
}

module.exports = grid;