/*
* FRONT INFO1
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
		{ fieldName: '제품Inch', dataType: ValueType.TEXT },
		{ fieldName: '제품버젼', dataType: ValueType.TEXT },
		{ fieldName: '자재품명', dataType: ValueType.TEXT },
		{ fieldName: '제품규격', dataType: ValueType.TEXT },
		{ fieldName: '입고일자', dataType: ValueType.TEXT },
		{ fieldName: 'cell수', dataType: ValueType.TEXT },
		{ fieldName: 'block수', dataType: ValueType.TEXT },
		{ fieldName: 'sheet', dataType: ValueType.TEXT },
		{ fieldName: '작업일자', dataType: ValueType.TEXT },
		{ fieldName: '생성수량', dataType: ValueType.TEXT },
		{ fieldName: '작업지시일자', dataType: ValueType.TEXT },
		{ fieldName: '발행자', dataType: ValueType.TEXT },
		{ fieldName: '승인일자', dataType: ValueType.TEXT },
		{ fieldName: '승인자', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: "거래처명", fieldName: "거래처명", header: { text: "고객사" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "제품모델", fieldName: "제품모델", header: { text: "Model" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "제품Inch", fieldName: "제품Inch", header: { text: "inch" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "제품버젼", fieldName: "제품버젼", header: { text: "Ver" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "자재품명", fieldName: "자재품명", header: { text: "Glass" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "제품규격", fieldName: "제품규격", header: { text: "Cell Size" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "입고일자", fieldName: "입고일자", header: { text: "Date" }, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDate	  	
		},
		{ name: "cell수", fieldName: "cell수", header: { text: "Cell" }, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "block수", fieldName: "block수", header: { text: "Block" }, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "sheet1", fieldName: "sheet", header: { text: "Sheet" }, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "작업일자", fieldName: "작업일자", header: { text: "Date" }, renderer: { showTooltip: true }, styleName: "tl",			
			displayCallback: rgDisplayDate
		},
		{ name: "cell수량", fieldName: "cell수", header: { text: "Cell" }, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "block수1", fieldName: "block수", header: { text: "Block" }, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "sheet2", fieldName: "sheet", header: { text: "Sheet" }, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "생성수량", fieldName: "생성수량", header: { text: "Fab" }, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "작업지시일자", fieldName: "작업지시일자", header: { text: "발행일자" }, renderer: { showTooltip: true }, styleName: "tl",			
			displayCallback: rgDisplayDate
		},
		{ name: "발행자", fieldName: "발행자", header: { text: "발행자" }, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "승인일자", fieldName: "승인일자", header: { text: "승인일자" }, renderer: { showTooltip: true, styleName: "tl" },
			displayCallback: rgDisplayDate
		},
		{ name: "승인자", fieldName: "승인자", header: { text: "승인자" }, renderer: { showTooltip: true }, styleName: "tl" },			
	],

	layout: [
		{
			name: "제품현황",
			items: ["거래처명","제품모델","제품Inch","제품버젼","자재품명","제품규격"],
			header: { text: "제품현황" },      
		},
		{
			name: "In",
			items: [
				"입고일자",
				{
				name: "Q'ty",
				items: ["cell수","block수","sheet1"],
				header: { text: "Q'ty" },      
				}
			],
			header: { text: "In" },      
		},
		{
			name: "Out",
			items: [
				"작업일자",
				{
					name: "Q'ty",
					items: ["cell수량","block수1","sheet2"],
					header: { text: "Q'ty" },      
				}
			],
			header: { text: "Out" },      
		},
		"생성수량",
		{
			name: "Schedule",
			items: [            
				{
				name: "발행",
				items: ["작업지시일자","발행자"],
				header: { text: "발행" },      
				},
				{
					name: "승인",
					items: ["승인일자","승인자"],
					header: { text: "승인" },      
				}
			],
			header: { text: "Schedule" },      
		},
	],
}

module.exports = grid;