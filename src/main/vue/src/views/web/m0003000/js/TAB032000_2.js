/*
* BACK#2 Cassette QC INFO2
*/
const { ValueType, SyncGridHeight } = require('realgrid');
const { rgDisplayDate } = require('@/utils/dateUtils');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill", syncGridHeight: SyncGridHeight.ALWAYS, },
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
		rowIndicator: { visible: false },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '거래처명', dataType: ValueType.TEXT },
		{ fieldName: '제품모델', dataType: ValueType.TEXT },
		{ fieldName: '제품inch', dataType: ValueType.TEXT },
		{ fieldName: '제품버젼', dataType: ValueType.TEXT },
		{ fieldName: '제품규격', dataType: ValueType.TEXT },
		{ fieldName: '입고일자', dataType: ValueType.TEXT },
		{ fieldName: '작업일자', dataType: ValueType.TEXT },
		{ fieldName: '특기사항', dataType: ValueType.TEXT },
		{ fieldName: '승인자', dataType: ValueType.TEXT },
		{ fieldName: '승인일자', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: "거래처명", fieldName: "거래처명", header: { text: "고객사" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "제품모델", fieldName: "제품모델", header: { text: "Model" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "제품inch", fieldName: "제품inch", header: { text: "inch" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "제품버젼", fieldName: "제품버젼", header: { text: "Ver" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "제품규격", fieldName: "제품규격", header: { text: "Cell Size" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "입고일자", fieldName: "입고일자", header: { text: "In Date" }, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "작업일자", fieldName: "작업일자", header: { text: "Out Date" }, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "특기사항", fieldName: "특기사항", width: "250", header: { text: "RUN-CARD 특이사항 및 작업시 주의사항" }, renderer: { showTooltip: true }, styleName: "tl" },			
		{ name: "승인자", fieldName: "승인자", header: { text: "승인자" }, renderer: { showTooltip: true }, styleName: "tl" },			
		{ name: "승인일자", fieldName: "승인일자", header: { text: "승인일자" }, renderer: { showTooltip: true, styleName: "tl" },
			displayCallback: rgDisplayDate
		},
	],

	layout: [
		{
			name: "제품현황",
			items: ["거래처명","제품모델","제품inch","제품버젼","제품규격"],
			header: { text: "제품현황" },      
		},
		{
			name: "Fab#2 Schedule",
			items: ["입고일자", "작업일자"],				
			header: { text: "Fab#2 Schedule" },      
		},		
		"특기사항",
		{
			name: "관리자",
			items: ["승인자","승인일자"],
			header: { text: "관리자" },      
		},
	],
}

module.exports = grid;