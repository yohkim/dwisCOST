
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');
const { rgDisplayDate,rgDisplayTime } = require('@/utils/dateUtils.js'); 
const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
		},
		edit: { editable: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: false },
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: false },
		rowIndicator: { visible: false },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'shift', dataType: ValueType.TEXT },
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: '근무조', dataType: ValueType.TEXT },
		{ fieldName: '설비약명', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: '투입', dataType: ValueType.NUMBER },
		{ fieldName: '양품', dataType: ValueType.NUMBER },
		{ fieldName: '불량', dataType: ValueType.NUMBER },
		{ fieldName: '수율', dataType: ValueType.NUMBER },
		{ fieldName: '특기사항', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'shift', fieldName: 'shift', width: '100', header: { text: 'Shift' },editable:false },	
		{ name: '작업자', fieldName: '작업자', width: '100', header: { text: '작업자' },editable:false},	
		{ name: '근무조', fieldName: '근무조', width: '100', header: { text: '근무조' },editable:false },	
		{ name: '설비약명', fieldName: '설비약명', width: '100', header: { text: '설비명명' },editable:false },	
		{ name: '작업시작', fieldName: '작업시작', width: '100', header: { text: 'Date' },editable:false },	
		{ name: '시작시각', fieldName: '시작시각', width: '100', header: { text: 'Time' },editable:false },	
		{ name: '작업종료', fieldName: '작업종료', width: '100', header: { text: 'Date' },editable:false },	
		{ name: '종료시각', fieldName: '종료시각', width: '100', header: { text: 'Time' },editable:false },	
		{ name: '투입', fieldName: '투입', width: '80', header: { text: '투입' },editable:false,numberFormat: "#,##0" },	
		{ name: '양품', fieldName: '양품', width: '80', header: { text: '양품' },editable:false,numberFormat: "#,##0" },	
		{ name: '불량', fieldName: '불량', width: '80', header: { text: '불량' },editable:false,numberFormat: "#,##0" },	
		{ name: '수율', fieldName: '수율', width: '60', header: { text: '수율' },editable:false, suffix:"%"},	
		{ name: '특기사항', fieldName: '특기사항', width: '250', header: { text: 'RUN-CARD 특이 사항 및 작업 시 주의사항' },editable:true },	
	],
	layout: [
		{
			name: "작업현황",
			direction: "horizontal",
			items: ["shift", "작업자","근무조","설비약명",
				{
					name: "작업시작",
					direction: "horizontal",
					items: ["작업시작", "시작시각"],
					header:{ text: "작업시작" }
				},
				{
					name: "작업종료",
					direction: "horizontal",
					items: ["작업종료", "종료시각"],
					header:{ text: "작업종료" }
				},
			],
			header:{ text: "작업현황" }
		},
		{
			name: "검사실적",
			direction: "horizontal수",
			items: ["투입", "양품","불량","수율"],
			header:{ text: "검사실적" }
		},
		"특기사항"
	]
}
module.exports = grid;