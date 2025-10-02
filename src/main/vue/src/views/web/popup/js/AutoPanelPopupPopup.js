/*
* FRONT INFO1
*/
const { ValueType } = require('realgrid');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
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
		{ fieldName: 'panelId', dataType: ValueType.TEXT },
		{ fieldName: '근무조', dataType: ValueType.TEXT },
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: '설비호기', dataType: ValueType.TEXT },
		{ fieldName: '설비약명', dataType: ValueType.TEXT },
		{ fieldName: 'batchNo', dataType: ValueType.TEXT },
		{ fieldName: 'tankNo', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: '등록여부', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: "근무조", fieldName: "근무조", header: { text: "근무조" }, styleName: "tl" },
		{ name: "작업자", fieldName: "작업자", header: { text: "작업자" }, styleName: "tl" },
		{ name: "설비약명", fieldName: "설비약명", header: { text: "설비약명" }, styleName: "tl" },
		{ name: "batchNo", fieldName: "batchNo", header: { text: "Batch No" }, styleName: "tl" },
		{ name: "작업시작", fieldName: "작업시작", header: { text: "Date" }, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "시작시각", fieldName: "시작시각", header: { text: "Time" }, styleName: "tl",
			displayCallback: rgDisplayTime
		},
		{ name: "작업종료", fieldName: "작업종료", header: { text: "Date" }, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "종료시각", fieldName: "종료시각", header: { text: "Time" }, styleName: "tl",
			displayCallback: rgDisplayTime
		},
		{ name: "등록여부", fieldName: "등록여부", header: { text: "등록여부" }, styleName: "tl" },
	],

	layout: ["근무조", "작업자", "설비약명", "batchNo",
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
		"등록여부"
	],
}

module.exports = grid;