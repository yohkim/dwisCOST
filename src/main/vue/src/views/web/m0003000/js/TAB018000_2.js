/*
* FRONT INFO2
*/
const { ValueType, SyncGridHeight } = require('realgrid');
const { formatNumber, numberValueOrDefault } = require('@/utils/dataTransform');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

const valueCallback1 = function (ds, index, fieldName, fields, values) {
	let f수량 = numberValueOrDefault(values[fields.indexOf('투입수량')]);
	let t양품수량 = numberValueOrDefault(values[fields.indexOf('양품수량')]);
	return f수량 == 0 ? 0 : formatNumber(((t양품수량*100)/f수량), 2);
}

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
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: 'shift', dataType: ValueType.TEXT },
		{ fieldName: '작업조', dataType: ValueType.TEXT },
		{ fieldName: '설비약명', dataType: ValueType.TEXT },
		{ fieldName: 'chamber', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: '투입수량', dataType: ValueType.INT },
		{ fieldName: '검사수량', dataType: ValueType.INT },
		{ fieldName: '양품수량', dataType: ValueType.INT },
		{ fieldName: '불량수량', dataType: ValueType.INT },
		{ fieldName: '수율', dataType: ValueType.NUMBER,
			valueCallback: valueCallback1
		},
		{ fieldName: 'cell수량', dataType: ValueType.INT },
		{ fieldName: '특기사항', dataType: ValueType.TEXT },
	],
	columns: [
		{ name: "작업자", fieldName: "작업자", header: { text: "작업자" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "shift", fieldName: "shift", header: { text: "Shift" }, editable: false, styleName: "tl",
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					if(_.isNil(cell.value))return ""
					return cell.value.substring(0,1);
				}
			},
		},
		{ name: "작업조", fieldName: "작업조", header: { text: "근무 시간" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "설비약명", fieldName: "설비약명", header: { text: "No" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "chamber", fieldName: "chamber", header: { text: "Line(축)" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "작업시작", fieldName: "작업시작", header: { text: "Date" }, editable: false, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "시작시각", fieldName: "시작시각", header: { text: "Time" }, editable: false, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayTime
		},
		{ name: "작업종료", fieldName: "작업종료", header: { text: "Date" }, editable: false, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "종료시각", fieldName: "종료시각", header: { text: "Time" }, editable: false, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayTime
		},
		{ name: "투입수량", fieldName: "투입수량", header: { text: "투입" }, editable: false, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "양품수량", fieldName: "양품수량", header: { text: "양품" }, editable: false, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "불량수량", fieldName: "불량수량", header: { text: "불량" }, editable: false, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "수율", fieldName: "수율", header: { text: "수율" }, editable: false, numberFormat: "#,##0.##", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "특기사항", fieldName: "특기사항", header: { text: "Lot-CARD 특이사항 및 작업시 주의사항" }, editable: false, width: 350, renderer: { showTooltip: true }, styleName: "tl" },
	],

	layout: ["작업자",
		{
			name: "M/C",
			items: ["설비약명", "chamber"],
			header: { text: "M/C" },
		},
		{
			name: "작업시작",
			items: ["작업시작", "시작시각"],
			header: { text: "작업시작" },
		},
		{
			name: "작업종료",
			items: ["작업종료", "종료시각"],
			header: { text: "작업종료" },
		},
		{
			name: "생산실적",
			items: ["투입수량", "양품수량", "불량수량", "수율"],
			header: { text: "생산실적" },
		},
		"특기사항"		
	],
}

module.exports = grid;