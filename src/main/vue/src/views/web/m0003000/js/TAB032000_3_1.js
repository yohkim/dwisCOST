/*
* BACK#2 Cassette QC INFO3
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, SummaryMode, SyncGridHeight} = require('realgrid');
const { formatNumber, numberValueOrDefault } = require('@/utils/dataTransform');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

const footer수율 = function (grid, column, footerIndex, columnFooter, value) {
	let f수량 = numberValueOrDefault(grid.getSummary('f수량', 'sum'));
	let t양품수량 = numberValueOrDefault(grid.getSummary('t양품수량', 'sum'));
	return f수량 == 0 ? 0 : formatNumber(((t양품수량*100)/f수량), 2);
}

const valueCallback1 = function (ds, index, fieldName, fields, values) {
	let f수량 = numberValueOrDefault(values[fields.indexOf('f수량')]);
	let t양품수량 = numberValueOrDefault(values[fields.indexOf('t양품수량')]);
	return f수량 == 0 ? 0 : formatNumber(((t양품수량*100)/f수량), 2);
}


const grid = {

	options: {
		checkBar: { visible: true },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { 
			columnMovable: false, 
			editItemMerging: true, 
			fitStyle: GridFitStyle.EVEN_FILL, 
			summaryMode: SummaryMode.AGGREGATE,
			syncGridHeight: SyncGridHeight.ALWAYS,
		},
		edit: { editable: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		//footer: {height:40},
		footers: { visible: true },
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
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: 'fCstno', dataType: ValueType.TEXT },
		{ fieldName: 'inCstno', dataType: ValueType.TEXT },
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: '작업조', dataType: ValueType.TEXT },
		{ fieldName: 'shift', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: 'f수량', dataType: ValueType.NUMBER },
		{ fieldName: 'f양품수량', dataType: ValueType.NUMBER },
		{ fieldName: 'f불량수량', dataType: ValueType.NUMBER },
		{ fieldName: 't양품수량', dataType: ValueType.NUMBER },
		{ fieldName: 't불량수량', dataType: ValueType.NUMBER },
		{ fieldName: '수율', dataType: ValueType.NUMBER,
			valueCallback: valueCallback1
		},
		{ fieldName: '불량입력', dataType: ValueType.TEXT },
		{ fieldName: 't수량', dataType: ValueType.INT },
		{ fieldName: 'tOrg수량', dataType: ValueType.NUMBER },
		{ fieldName: 'tCnt', dataType: ValueType.NUMBER },
		{ fieldName: 'tCstno', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: '차수', dataType: ValueType.INT },
		{ fieldName: 'nxt공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'pkey', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: "fCstno", fieldName: "fCstno", header: { text: "입고카세트" }, renderer: { showTooltip: true }, editable: false, styleName: "tl", width: 120 },
		{ name: "inCstno", fieldName: "inCstno", header: { text: "IN카세트" }, renderer: { showTooltip: true }, editable: false, styleName: "tl", width: 120 },
		{ name: "tCstno", fieldName: "tCstno", header: { text: "출고카세트" }, renderer: { showTooltip: true }, editable: false, styleName: "tl", width: 120 },				
		{ name: "t수량", fieldName: "t수량", header: { text: "CST 수량" }, numberFormat: "#,##0", renderer: { showTooltip: true }, footer: {expression: "sum"}, editable: false, styleName: "tr" },
		{ name: "작업자", fieldName: "작업자", header: { text: "작업자" }, renderer: { showTooltip: true }, editable: false, styleName: "tl" },
		{ name: "shift", fieldName: "shift", header: { text: "근무조" }, renderer: { showTooltip: true }, editable: false, styleName: "tl" },
		{ name: "작업조", fieldName: "작업조", header: { text: "근무시간" }, renderer: { showTooltip: true }, editable: false, styleName: "tl" },
		{ name: "작업시작", fieldName: "작업시작", header: { text: "Date" }, renderer: { showTooltip: true }, editable: false, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "시작시각", fieldName: "시작시각", header: { text: "Time" }, renderer: { showTooltip: true }, editable: false, styleName: "tl",
			displayCallback: rgDisplayTime
		},
		{ name: "작업종료", fieldName: "작업종료", header: { text: "Date" }, renderer: { showTooltip: true }, editable: false, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "종료시각", fieldName: "종료시각", header: { text: "Time" }, renderer: { showTooltip: true }, editable: false, styleName: "tl",
			displayCallback: rgDisplayTime
		},
		{ name: "f수량", fieldName: "f수량", header: { text: "투입" }, numberFormat: "#,##0", renderer: { showTooltip: true }, footer: {expression: "sum"}, editable: false, styleName: "tr" },			
		{ name: "t양품수량", fieldName: "t양품수량", header: { text: "양품" }, numberFormat: "#,##0", renderer: { showTooltip: true }, footer: {expression: "sum"}, editable: false, styleName: "tr"
	
		},			
		{ name: "t불량수량", fieldName: "t불량수량", header: { text: "불량" }, numberFormat: "#,##0", renderer: { showTooltip: true }, footer: {expression: "sum"}, editable: false, styleName: "tr" },
		{ name: "수율", fieldName: "수율", header: { text: "수율" }, numberFormat: "#,##0.##", renderer: { showTooltip: true }, footer: {valueCallback:footer수율}, editable: false, styleName: "tr" },
		{ name: "불량입력", fieldName: "불량입력", header: { text: "item" }, editable: false,
			renderer:{				
				type:"html",
				callback: function(grid, cell, w, h) {
					const ds = grid.getDataSource();
					const jsonData = ds.getJsonRow(cell.index.itemIndex);
					const str = '<button type="button" class="'+(jsonData['t불량수량'] > 0 ? 'btn_sucess' : 'btn_error')+'">불량입력</button>';
					return str;
				}
			},
		},
		{ name: "특이사항", fieldName: "특이사항", width: "150", header: { text: "특이사항" }, renderer: { showTooltip: true }, editable: false, styleName: "tl" },
	],

	layout: ["fCstno","inCstno","tCstno","t수량",
		{
			name: "출고현황",
			direction: "horizontal",
			items: ["작업자", "shift", "작업조",
				{
					name: "작업시작",
					items: ["작업시작","시작시각"],
					header: { text: "작업시작" },      
				},
				{
					name: "작업종료",
					items: ["작업종료","종료시각"],
					header: { text: "작업종료" },      
				},
			],
			header:{ text: "출고현황" }
		},
		{
			name: "검사실적",
			items: ["f수량","t양품수량","t불량수량","수율"],
			header: { text: "검사실적" },      
		},
		"불량입력","특이사항",
	],
}

module.exports = grid;