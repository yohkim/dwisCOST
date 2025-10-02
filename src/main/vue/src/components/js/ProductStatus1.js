/*
* 제조 실적 입력 > 제품현황
*/
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
		edit: { editable: false },
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
		{ fieldName: '투입구분', dataType: ValueType.TEXT },
		{ fieldName: '사양', dataType: ValueType.TEXT },
		{ fieldName: '두께', dataType: ValueType.TEXT },
		{ fieldName: 'model', dataType: ValueType.TEXT },
		{ fieldName: 'inch', dataType: ValueType.TEXT },
		{ fieldName: '공정명', dataType: ValueType.TEXT },
		{ fieldName: 'mc', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: '양품수량', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '투입구분', fieldName: '투입구분', width: '150', header: { text: '투입구분' }, mergeRule:{criteria: "value"}},
		{ name: '사양', fieldName: '사양', width: '80', header: { text: '사양' }, mergeRule:{criteria: "value"} },
		{ name: '두께', fieldName: '두께', width: '80', header: { text: '두께' }, mergeRule:{criteria: "value"} },
		{ name: 'model', fieldName: 'model', width: '80', header: { text: 'Model' }, mergeRule:{criteria: "value"} },
		{ name: 'inch', fieldName: 'inch', width: '80', header: { text: 'Inch' }, mergeRule:{criteria: "value"} },
		{ name: '공정명', fieldName: '공정명', width: '80', header: { text: '공정' } },
		{ name: 'mc', fieldName: 'mc', width: '80', header: { text: 'M/C' } },
		{ name: '작업종료', fieldName: '작업종료', width: '80', header: { text: 'Date' },displayCallback:rgDisplayDate },
		{ name: '종료시각', fieldName: '종료시각', width: '80', header: { text: 'Time' },displayCallback:rgDisplayTime },
		{ name: '양품수량', fieldName: '양품수량', width: '80', header: { text: 'Cell' } },
		{ name: '특이사항', fieldName: '특이사항', width: '200', header: { text: '특이사항' } },
		{ name: 'lotNo', fieldName: 'lotNo', width: '200', header: { text: 'Lot No' },visible:false },
	],
	layout: [
		{
			name: "원장정보",
			direction: "horizontal",
			items: ["투입구분", "사양","두께"],
			header:{ text: "원장정보" }
		},
		"model","inch",
		{
			name: "이전공정",
			direction: "horizontal",
			items: ["lotNo","공정명", "mc","작업종료","종료시각","양품수량","특이사항"],
			header:{ text: "이전공정" }
		},
	]
}
module.exports = grid;