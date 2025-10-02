/*
* BACK#2 Cassette QC INFO1
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
		{ fieldName: 'tCstno', dataType: ValueType.TEXT },
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: 'shift', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: '설비약명', dataType: ValueType.TEXT },
		{ fieldName: '투입수량', dataType: ValueType.INT },
		{ fieldName: '검사수량', dataType: ValueType.INT },
		{ fieldName: '양품수량', dataType: ValueType.INT },
		{ fieldName: '불량수량', dataType: ValueType.INT },
		{ fieldName: '수율', dataType: ValueType.NUMBER,
			valueCallback: valueCallback1
		},
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: '차수', dataType: ValueType.INT },
	],
	columns: [
		{ name: "차수", fieldName: "차수", header: { text: "차수" }, editable: false, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "작업자", fieldName: "작업자", header: { text: "작업자" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "shift", fieldName: "shift", header: { text: "근무조" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
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
		{ name: "설비약명", fieldName: "설비약명", header: { text: "설비약명", visible: false }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "투입수량", fieldName: "투입수량", header: { text: "투입" }, editable: false, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "양품수량", fieldName: "양품수량", header: { text: "양품" }, editable: false, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "불량수량", fieldName: "불량수량", header: { text: "불량" }, editable: false, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "수율", fieldName: "수율", header: { text: "수율" }, editable: false, numberFormat: "#,##0.##", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "특이사항", fieldName: "특이사항", header: { text: "특이사항" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
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
			name: "M/C",
			hideChildHeaders: true,
			items: ["설비약명"],
			header: { text: "M/C" },
		},
		{
			name: "검사실적",
			items: ["투입수량", "양품수량", "불량수량", "수율"],
			header: { text: "검사실적" },
		},
		"특이사항"
	],
}

module.exports = grid;