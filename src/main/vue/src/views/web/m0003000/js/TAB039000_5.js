/*
* BACK#2 Cell QC INFO2
*/
const { ValueType, SyncGridHeight } = require('realgrid');
const { rgDisplayDate, rgDisplayDateTime2 } = require('@/utils/dateUtils');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "NONE" },
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
		{ fieldName: '작업일자', dataType: ValueType.TEXT },
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: '근무조', dataType: ValueType.TEXT },
		{ fieldName: 'cellId', dataType: ValueType.TEXT },
		{ fieldName: 'startTime', dataType: ValueType.TEXT },
		{ fieldName: 'endTime', dataType: ValueType.TEXT },				
		{ fieldName: '특이사항', dataType: ValueType.TEXT },				
	],

	columns: [
		{ name: "작업일자", fieldName: "startTime", header: { text: "작업일자" }, width: 100, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "근무조", fieldName: "근무조", header: { text: "근무조" }, width: 80, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "작업자", fieldName: "작업자", header: { text: "검사자" }, width: 100, renderer: { showTooltip: true }, styleName: "tl", autoFilter:true },
		{ name: "cellId", fieldName: "cellId", header: { text: "Cell No." }, width: 250, renderer: { showTooltip: true }, styleName: "tl", autoFilter:true },
		{ name: "startTime", fieldName: "startTime", header: { text: "시작시각" }, width: 100, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDateTime2
		},
		{ name: "endTime", fieldName: "endTime", header: { text: "종료시각" }, width: 100, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDateTime2
		},
		{ name: "특이사항", fieldName: "특이사항", header: { text: "특이사항" }, width: 250, renderer: { showTooltip: true }, styleName: "tl" },
	],

	layout: [
		{
			name: "양품정보",
			expandable: true,
			expanded: false,
			direction: "horizontal",
			items: [
				{column: "작업일자", groupShowMode:"expand"},
				{column: "근무조", groupShowMode:"expand"},
				{column: "작업자", groupShowMode:"expand"},
				{column: "cellId", groupShowMode:"always"},
				{column: "특이사항", groupShowMode:"expand"},
				{column: "startTime", groupShowMode:"expand"},
				{column: "endTime", groupShowMode:"expand"},
			],
		},
	],
}

module.exports = grid;