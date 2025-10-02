/*
* 제조 실적 입력 > Back#1 > 생산실적입력 Grid > 박리
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, SummaryMode} = require('realgrid');
const { rgDisplayTime2 } = require('@/utils/dateUtils.js'); 

const badSum = function (prod, dataRow, fieldName, fieldNames, values) {
	let s = (values[fieldNames.indexOf("원자재깨짐")]||0)
		+ (values[fieldNames.indexOf("작업자깨짐")]||0)
		+ (values[fieldNames.indexOf("측정시료")]||0)
		+ (values[fieldNames.indexOf("샘플")]||0)
		+ (values[fieldNames.indexOf("기타")]||0)
		+ (values[fieldNames.indexOf("회수")]||0);
	return s;
};
// const outCellSum = function (prod, dataRow, fieldName, fieldNames, values) {
// 	let cstNo = values[fieldNames.indexOf("tCstno")];
// 	let rds = prod.getJsonRows();
// 	let cstBadSum = 0;
// 	rds.forEach(el => {
// 		if(el['tCstno'] === cstNo){
// 			cstBadSum += (el["불량합계"]||0)  ;
// 		}
// 		console.log("el:::",el);
// 	});

// 	console.log(cstNo +":::"+cstBadSum);
	
// 	return (values[fieldNames.indexOf("f수량")]||0) - cstBadSum ;
// };

const footerInCellSum = function (grid, column, footerIndex, columnFooter, value) {
	let sumCstNoList = [];
	let s = 0;
	let rds = grid.getDataSource().getJsonRows();
	rds.forEach(el => {
		if(sumCstNoList.indexOf(el['fCstno']) === -1){
			s += el['f수량'];
			sumCstNoList.push(el['fCstno']);
		}
	});
	return s;
};

const footerOutCellSum = function (grid, column, footerIndex, columnFooter, value) {
	let sumCstNoList = [];
	let s = 0;
	let rds = grid.getDataSource().getJsonRows();
	rds.forEach(el => {
		if(sumCstNoList.indexOf(el['tCstno']) === -1){
			s += el['t수량'];
			sumCstNoList.push(el['tCstno']);
		}
	});
	return s;
};

const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.SINGLE_ROW,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
			summaryMode: SummaryMode.AGGREGATE,
		},
		edit: { editable: true },
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
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '공장코드', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'seq', dataType: ValueType.TEXT},
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: 'cell', dataType: ValueType.TEXT },
		{ fieldName: 'fCstno', dataType: ValueType.TEXT },
		{ fieldName: 'f수량', dataType: ValueType.NUMBER },
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

		{ fieldName: '불량합계', dataType: ValueType.NUMBER,valueCallback:badSum},
		{ fieldName: '원자재깨짐', dataType: ValueType.NUMBER },
		{ fieldName: '작업자깨짐', dataType: ValueType.NUMBER },
		{ fieldName: '측정시료', dataType: ValueType.NUMBER },
		{ fieldName: '샘플', dataType: ValueType.NUMBER },
		{ fieldName: '기타', dataType: ValueType.NUMBER },
		{ fieldName: '회수', dataType: ValueType.NUMBER },
	],
	badColumns:{
		"원자재깨짐":'원자재깨짐',
		"작업자깨짐":'작업자깨짐',
		"측정시료":'측정시료',
		"샘플":'샘플',
		"기타":'기타',
		"회수":'회수'
	},
	columns: [
		{ name: 'lotNo', fieldName: 'lotNo', width: '150', header: { text: 'LOT NO' }, editable:false,footer: {text: "합계"}},
		{ name: 'cell', fieldName: 'cell', width: '60', header: { text: 'CELL' } },
		{ name: 'fCstno', fieldName: 'fCstno', width: '80', header: { text: 'CST NO' }, editable:false},
		{ name: 'f수량', fieldName: 'f수량', width: '80', header: { text: '수량' }, numberFormat: "#,##0",footer: {valueCallback:footerInCellSum}},
		{ name: '시작시각', fieldName: '시작시각', width: '100', header: { text: '시작시각' }, editable:false, displayCallback:rgDisplayTime2 },
		{ name: '종료시각', fieldName: '종료시각', width: '100', header: { text: '종료시각' }, editable:false, displayCallback:rgDisplayTime2 },
		{ name: 'tCstno', fieldName: 'tCstno', width: '80', header: { text: 'CST NO' }, editable:false },
		// { name: 'lotCellCount', fieldName: 'lotCellCount', width: '80', header: { text: '설비수량' }, editable:false, numberFormat: "#,##0", footer: {expression: "sum"}},
		{ name: 't수량', fieldName: 't수량', width: '80', header: { text: '양품수량' }, editable:false, numberFormat: "#,##0", footer: {valueCallback:footerOutCellSum}},
		{ name: '특이사항', fieldName: '특이사항', width: '150', header: { text: '특이사항' } },
		{ name: '불량합계', fieldName: '불량합계', width: '80', header: { text: '불량합계' }, numberFormat: "#,##0", nanText: "0", editable:false, footer: {expression: "sum"}},
		
		{ name: '원자재깨짐', fieldName: '원자재깨짐', width: '80', header: { text: '원자재깨짐' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"}},
		{ name: '작업자깨짐', fieldName: '작업자깨짐', width: '80', header: { text: '작업자깨짐' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"}},
		{ name: '측정시료', fieldName: '측정시료', width: '80', header: { text: '측정시료' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"}},
		{ name: '샘플', fieldName: '샘플', width: '80', header: { text: '샘플' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"}},
		{ name: '기타', fieldName: '기타', width: '80', header: { text: '기타' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"}},
		{ name: '회수', fieldName: '회수', width: '80', header: { text: '회수' }, numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"}},
	],
	layout: [
		"lotNo","cell",
		{
			name: "입고현황",
			direction: "horizontal",
			items: ["fCstno", "f수량"],
			header:{ text: "입고현황" }
		},
		{
			name: "출고현황",
			direction: "horizontal",
			items: ["시작시각", "종료시각", "tCstno","t수량"],
			header:{ text: "출고현황" }
		},
		"특이사항",
		{
			name: "불량현황",
			direction: "horizontal",
			items: ["불량합계", "원자재깨짐", "작업자깨짐", "측정시료", "샘플", "기타","회수"],
			header:{ text: "불량현황" }
		},
	]
}
module.exports = grid;