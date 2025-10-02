/*
* FRONT INFO5
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
		header: { height: 25, showTooltip: true, tooltipEllipsisOnly: true },
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
		{ fieldName: '컷팅', dataType: ValueType.INT },
		{ fieldName: '중삭', dataType: ValueType.INT },
		{ fieldName: '정삭', dataType: ValueType.INT },
		{ fieldName: 'toolNo컷팅', dataType: ValueType.TEXT },
		{ fieldName: 'toolNo중삭', dataType: ValueType.TEXT },
		{ fieldName: 'toolNo정삭', dataType: ValueType.TEXT },
		{ fieldName: '불량수량', dataType: ValueType.INT },
		{ fieldName: 'cell별불량수량', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: "lotNo", fieldName: "lotNo", header: { text: "LOT NO" }, renderer: { showTooltip: true }, width: 240, mergeRule: { criteria: "value" }, editable: false, styleName: "tl" },
		{ name: "blNo", fieldName: "blNo", header: { text: "BLOCK NO" }, renderer: { showTooltip: true }, editable: false, styleName: "tl" },
		{ name: "불량입력", fieldName: "불량입력", header: { text: "item" }, editable: false,
			renderer:{
				type:"html",
				callback: function(grid, cell, w, h) {
					const ds = grid.getDataSource();
        			const jsonData = ds.getJsonRow(cell.index.itemIndex);
					const str = '<button type="button" class="'+(jsonData['불량수량'] > 0 ? 'btn_sucess' : 'btn_error')+'">불량입력</button>';
					return str;
				}
		  	},
		},
		{ name: "컷팅", fieldName: "컷팅", header: { text: "커팅" }, mergeRule: { criteria: "values['lotNo']+value" }, renderer: { showTooltip: true }, editable: false, styleName: "tr" },
		{ name: "중삭", fieldName: "중삭", header: { text: "중삭" }, mergeRule: { criteria: "values['lotNo']+value" }, renderer: { showTooltip: true }, editable: false, styleName: "tr" },
		{ name: "정삭", fieldName: "정삭", header: { text: "정삭" }, mergeRule: { criteria: "values['lotNo']+value" }, renderer: { showTooltip: true }, editable: false, styleName: "tr" },
		{ name: "toolNo컷팅", fieldName: "toolNo컷팅", header: { text: "커팅" }, mergeRule: { criteria: "values['lotNo']+value" }, renderer: { showTooltip: true }, width: 150, editable: false, styleName: "tl" },
		{ name: "toolNo중삭", fieldName: "toolNo중삭", header: { text: "중삭" }, mergeRule: { criteria: "values['lotNo']+value" }, renderer: { showTooltip: true }, width: 150, editable: false, styleName: "tl" },
		{ name: "toolNo정삭", fieldName: "toolNo정삭", header: { text: "정삭" }, mergeRule: { criteria: "values['lotNo']+value" }, renderer: { showTooltip: true }, width: 150, editable: false, styleName: "tl" },
		{ name: "cell별불량수량", fieldName: "cell별불량수량", header: { text: "블록별 CELL 불량 수량" }, renderer: { showTooltip: true }, editable: false, editor: { type: 'number', integerOnly: true }, styleName: "tr" },
	],

	layout: [
		"lotNo","blNo",	"불량입력",
		/*{
			name: "Tool 사용현황",
			items: ["컷팅", "중삭", "정삭",
				{
					name: "Tool No",
					items: ["toolNo컷팅", "toolNo중삭", "toolNo정삭"],
					header: { text: "Tool No" },
				},
			],
			header: { text: "Tool 사용현황" },
		}*/
	],
}

module.exports = grid;