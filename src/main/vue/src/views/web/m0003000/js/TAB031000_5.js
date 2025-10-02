/*
* 제조 실적 입력 > Back#1 > 생산실적입력 Grid > 제품현황
*/
// import {displayDate} from '@/utils/dateUtils.js';

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
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: 'shift', dataType: ValueType.TEXT },
		{ fieldName: '작업조', dataType: ValueType.TEXT },
		{ fieldName: 'machineCode', dataType: ValueType.TEXT },
		{ fieldName: '설비약명', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: '투입수량', dataType: ValueType.NUMBER },
		{ fieldName: '양품수량', dataType: ValueType.NUMBER },
		{ fieldName: '불량수량', dataType: ValueType.NUMBER },
		{ fieldName: '수율', dataType: ValueType.NUMBER },
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: '차수', dataType: ValueType.NUMBER },
		{ fieldName: '공장코드', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },

	],

	columns: [
		{ name: '작업자', fieldName: '작업자', width: '100', header: { text: '작업자' },editable:false},	
		{ name: 'shift', fieldName: 'shift', width: '100', header: { text: 'Shift' },editable:false },	
		// { name: '작업조', fieldName: '작업조', width: '100', header: { text: '근무시간' },editable:false },	
		{ name: '설비약명', fieldName: '설비약명', width: '100', header: { text: 'M/C' },editable:false },	
		{ name: '작업시작', fieldName: '작업시작', width: '80', header: { text: 'Date' },editable:false,displayCallback:rgDisplayDate},	
		{ name: '시작시각', fieldName: '시작시각', width: '80', header: { text: 'Time' },editable:false,displayCallback:rgDisplayTime},	
		{ name: '작업종료', fieldName: '작업종료', width: '80', header: { text: 'Date' },editable:false,displayCallback:rgDisplayDate},	
		{ name: '종료시각', fieldName: '종료시각', width: '80', header: { text: 'Time' },editable:false,displayCallback:rgDisplayTime},	
		{ name: '투입수량', fieldName: '투입수량', width: '80', header: { text: '투입수량' },editable:false,numberFormat: "#,##0" },	
		{ name: '양품수량', fieldName: '양품수량', width: '80', header: { text: '양품수량' },editable:false,numberFormat: "#,##0" },	
		{ name: '불량수량', fieldName: '불량수량', width: '80', header: { text: '불량수량' },editable:false,numberFormat: "#,##0" },	
		{ name: '수율', fieldName: '수율', width: '60', header: { text: '수율' },editable:false, suffix:"%"},	
		{ name: '특이사항', fieldName: '특이사항', width: '250', header: { text: 'RUN-CARD 특이 사항 및 작업 시 주의사항' },editable:false},	
	],
	layout: [
		"작업자","shift","설비약명",
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
		{
			name: "검사현황",
			direction: "horizontal",
			items: ["투입수량", "양품수량","불량수량","수율"],
			header:{ text: "검사현황" }
		},
		"특이사항"
	]
}
module.exports = grid;