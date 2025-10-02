/*
* BACK#2 Cell QC INFO1
*/
const { ValueType, SyncGridHeight } = require('realgrid');
const { formatNumber, numberValueOrDefault } = require('@/utils/dataTransform');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

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
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: '투입수량', dataType: ValueType.NUMBER },
		{ fieldName: '검사수량', dataType: ValueType.NUMBER },
		{ fieldName: '중복', dataType: ValueType.NUMBER },
		{ fieldName: '양품수량', dataType: ValueType.NUMBER },
		{ fieldName: '불량수량', dataType: ValueType.NUMBER },
		{ fieldName: '시료수량', dataType: ValueType.NUMBER },
		{ fieldName: 'out', dataType: ValueType.NUMBER },
		{ fieldName: '차수', dataType: ValueType.INT },
	],
	columns: [
		{ name: "차수", fieldName: "차수", header: { text: "차수" }, editable: false, renderer: { showTooltip: true }, styleName: "tr" },
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
		{ name: "투입수량", fieldName: "투입수량", header: { text: "투입수량" }, editable: false, numberFormat: "#,##0", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "검사수량", fieldName: "검사수량", header: { text: "검사수" }, editable: false, numberFormat: "#,##0", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "중복", fieldName: "중복", header: { text: "중복" }, editable: false, numberFormat: "#,##0", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "양품수량", fieldName: "양품수량", header: { text: "양품" }, editable: false, numberFormat: "#,##0", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "불량수량", fieldName: "불량수량", header: { text: "불량" }, editable: false, numberFormat: "#,##0", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "시료수량", fieldName: "시료수량", header: { text: "시료" }, editable: false, numberFormat: "#,##0", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "out", fieldName: "out", header: { text: "OUT" }, editable: false, numberFormat: "#,##0", renderer: { showTooltip: true }, styleName: "tr" },
	],

	layout: ["차수",
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
			name: "검사현황",
			items: ["투입수량", "검사수량", "중복", "양품수량", "불량수량", "시료수량", "out"],
			header: { text: "검사현황" },
		},
	],
}

module.exports = grid;