/*
* 제조 실적 입력 > Back#1 > 생산실적입력 Grid > 후환적
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, SyncGridHeight} = require('realgrid');
const { rgDisplayTime2 } = require('@/utils/dateUtils.js'); 
const badSum = function (prod, dataRow, fieldName, fieldNames, values) {
	let s = (values[fieldNames.indexOf("원자재깨짐")]||0)
		+ (values[fieldNames.indexOf("작업자깨짐")]||0)
		+ (values[fieldNames.indexOf("설비깨짐(설비오류)")]||0)
		+ (values[fieldNames.indexOf("장입불량")]||0)
		+ (values[fieldNames.indexOf("꺾임")]||0)
		+ (values[fieldNames.indexOf("측정시료")]||0)
		+ (values[fieldNames.indexOf("샘플")]||0)
		+ (values[fieldNames.indexOf("기타")]||0)
		+ (values[fieldNames.indexOf("회수")]||0);
	return s;
};

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
			selectionStyle: SelectionStyle.BLOCK,
			selectionMode: SelectionMode.EXTENDED,
			fitStyle: GridFitStyle.EVEN_FILL,
			syncGridHeight:SyncGridHeight.ALWAYS,
		},
		edit: { editable: true,commitByCell:true},
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: true },
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: false, enableAppend:false },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'f수량', dataType: ValueType.NUMBER },	//field 참조 위치변경 하면 안됨
		{ fieldName: '공장코드', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'seq', dataType: ValueType.TEXT},
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: 'fCstno', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: 'tCstno', dataType: ValueType.TEXT },
		{ fieldName: 'lotCellCount', dataType: ValueType.NUMBER},
		{ fieldName: 't수량', dataType: ValueType.NUMBER},
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: 'bef공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'nxt공정코드', dataType: ValueType.TEXT },
		{ fieldName: '박리작업구분', dataType: ValueType.TEXT },
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: 'f불량수량', dataType: ValueType.NUMBER },
		{ fieldName: '투입수량', dataType: ValueType.NUMBER },
		{ fieldName: 'machineCode', dataType: ValueType.TEXT },
		{ fieldName: '배출구', dataType: ValueType.TEXT },
		{ fieldName: 'lotCnt', dataType: ValueType.NUMBER },
		{ fieldName: 'inCstno', dataType: ValueType.TEXT },

		{ fieldName: '불량합계', dataType: ValueType.NUMBER},
		{ fieldName: '불량입력', dataType: ValueType.TEXT },

		{ fieldName: '작업조', dataType: ValueType.TEXT },
		{ fieldName: 'shift', dataType: ValueType.TEXT },
		{ fieldName: 'worker', dataType: ValueType.TEXT },
		{ fieldName: '설비명', dataType: ValueType.TEXT },
		// { fieldName: '불량합계', dataType: ValueType.NUMBER,valueCallback:badSum},
		// { fieldName: '원자재깨짐', dataType: ValueType.NUMBER },
		// { fieldName: '작업자깨짐', dataType: ValueType.NUMBER },
		// { fieldName: '설비깨짐(설비오류)', dataType: ValueType.NUMBER },
		// { fieldName: '장입불량', dataType: ValueType.NUMBER },
		// { fieldName: '꺾임', dataType: ValueType.NUMBER },
		// { fieldName: '측정시료', dataType: ValueType.NUMBER },
		// { fieldName: '샘플', dataType: ValueType.NUMBER },
		// { fieldName: '기타', dataType: ValueType.NUMBER },
		// { fieldName: '회수', dataType: ValueType.NUMBER },
	],
	// badColumns:{
	// 	"원자재깨짐":'원자재깨짐',
	// 	"작업자깨짐":'작업자깨짐',
	// 	"설비깨짐(설비오류)":'설비깨짐(설비오류)',
	// 	"장입불량":'장입불량',
	// 	"꺾임":'꺾임',
	// 	"측정시료":'측정시료',
	// 	"샘플":'샘플',
	// 	"기타":'기타',
	// 	"회수":'회수',
	// },
	columns: [
		{ name: 'fCstno', fieldName: 'fCstno', width: '80', header: { text: 'CST NO' },editable:false,footer: {text: "합계"}},
		{ name: 'f수량', fieldName: 'f수량', width: '80', header: { text: '수량' },styleName:"edit tr",numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"}},
		{ name: '시작시각', fieldName: '시작시각', width: '100', header: { text: '시작시간' },editable:false, displayCallback:rgDisplayTime2 },
		{ name: '종료시각', fieldName: '종료시각', width: '100', header: { text: '종료시간' },editable:false, displayCallback:rgDisplayTime2 },
		{ name: 'tCstno', fieldName: 'tCstno', width: '80', header: { text: 'CST NO' },editable:false},
		{ name: 't수량', fieldName: 't수량', width: '80', header: { text: '양품수량' },styleName:"tr",editable:false, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"}},
		{ name: '불량합계', fieldName: '불량합계', width: '80', header: { text: '불량합계' },styleName:"tr",editable:false, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"}},
		// { name: '원자재깨짐', fieldName: '원자재깨짐', width: '80', header: { text: '원자재깨짐' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"} },
		// { name: '작업자깨짐', fieldName: '작업자깨짐', width: '80', header: { text: '작업자깨짐' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"} },
		// { name: '설비깨짐(설비오류)', fieldName: '설비깨짐(설비오류)', width: '130', header: { text: '설비깨짐(설비오류)' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"} },
		// { name: '장입불량', fieldName: '장입불량', width: '80', header: { text: '장입불량' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"} },
		// { name: '꺾임', fieldName: '꺾임', width: '80', header: { text: '꺾임' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"} },
		// { name: '측정시료', fieldName: '측정시료', width: '80', header: { text: '측정시료' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"} },
		// { name: '샘플', fieldName: '샘플', width: '80', header: { text: '샘플' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"} },
		// { name: '기타', fieldName: '기타', width: '80', header: { text: '기타' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"} },
		// { name: '회수', fieldName: '회수', width: '80', header: { text: '회수' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"} },
		{ name: '작업조', fieldName: '작업조', width: '80', header: { text: '작업조' },editable:false},
		{ name: 'shift', fieldName: 'shift', width: '80', header: { text: 'SHIFT' },editable:false,suffix:"조"},
		{ name: '작업자', fieldName: '작업자', width: '80', header: { text: '작업자' },editable:false},
		{ name: '설비명', fieldName: '설비명', width: '80', header: { text: '설비명' },editable:false},

		{ name: "불량입력", fieldName: "불량입력", header: { text: " " }, renderer: { showTooltip: true },editable:false,
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					const ds = grid.getDataSource();
					const jsonData = ds.getJsonRow(cell.index.itemIndex);
					const str = '<button type="button" class="'+(jsonData['불량합계'] > 0 ? 'btn_sucess' : 'btn_error')+'">불량입력</button>';
					return str;
				}
		  	},
		},
		{ name: '특이사항', fieldName: '특이사항', width: '150', header: { text: '특이사항' },styleName:"edit tl" },
	],
	layout: [
		"설비명","작업조","shift","작업자",
		{
			name: "입고현황",
			direction: "horizontal",
			items: ["fCstno", "f수량"],
			header:{ text: "입고현황" }
		},
		{
			name: "출고현황",
			direction: "horizontal",
			items: ["시작시각", "종료시각", "tCstno", "t수량"],
			header:{ text: "출고현황" }
		},
		"불량합계","불량입력","특이사항"
		// {
		// 	name: "불량현황",
		// 	direction: "horizontal",
		// 	items: ["불량합계", "원자재깨짐","작업자깨짐","설비깨짐(설비오류)","장입불량","꺾임","측정시료","샘플","기타","회수"],
		// 	header:{ text: "불량현황" }
		// },
	]
}
module.exports = grid;