/*
* FRONT INFO1
*/
const { ValueType } = require('realgrid');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

const grid = {

	options: {
		checkBar: { visible: false, exclusive: true },
		copy: { enabled: true },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill" },
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
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'runId', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'cstNo', dataType: ValueType.TEXT },
		{ fieldName: 'cellId', dataType: ValueType.TEXT },
		{ fieldName: '시료일자', dataType: ValueType.TEXT },
		{ fieldName: '신뢰성작업확인', dataType: ValueType.TEXT },
		{ fieldName: '신뢰성시료유형', dataType: ValueType.TEXT },
		{ fieldName: '취소', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: "cellId", fieldName: "cellId", header: { text: "Cell ID" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "시료일자", fieldName: "시료일자", header: { text: "시료일자" }, styleName: "tl", 
			displayCallback: rgDisplayDate
		},
		{ name: "신뢰성작업확인", fieldName: "신뢰성작업확인", header: { text: "신뢰성작업확인" }, styleName: "tl" },
		{ name: "신뢰성시료유형", fieldName: "신뢰성시료유형", header: { text: "신뢰성시료유형" }, styleName: "tl" },
		{ name: "취소", fieldName: "취소", header: { text: "취소" },
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					const str = '<button type="button" class="btn_sucess">취소</button>';
					return str;
				}
			},
		},
	],

	layout: ["cellId","시료일자","신뢰성작업확인","신뢰성시료유형","취소"],

}

module.exports = grid;