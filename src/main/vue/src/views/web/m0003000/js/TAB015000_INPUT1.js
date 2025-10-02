/*
* 제조 실적 입력 > Lot Run Card 발행 > Lot Card 발행_입력단
*/
const { ValueType } = require('realgrid');

editCallback=function(grid, dataCell){
	var ret = {}
	if(dataCell.dataColumn.editable)
		ret.styleName='edit';

	return ret;
};

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill" },
		edit: { editable: true,commitByCell:true },
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
		rowIndicator: {visible:false},
		sorting: {enabled: false},
		//sortMode: {},
		stateBar: {visible:false},
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'poNo', dataType: ValueType.TEXT },
		{ fieldName: 'poDate', dataType: ValueType.TEXT },
		{ fieldName: '총수량', dataType: ValueType.TEXT },
		{ fieldName: '잔량', dataType: ValueType.TEXT },
		{ fieldName: 'todayInput', dataType: ValueType.NUMBER },
		{ fieldName: 'startLabel', dataType: ValueType.TEXT },
		{ fieldName: 'createQty', dataType: ValueType.NUMBER },
		{ fieldName: 'remainQty', dataType: ValueType.NUMBER },
		{ fieldName: 'cell', dataType: ValueType.NUMBER },
		{ fieldName: 'sheet', dataType: ValueType.NUMBER },
		{ fieldName: 'block', dataType: ValueType.NUMBER },
	],

	columns: [
		{ name: 'poNo', fieldName: 'poNo', width: '120', header: { text: 'PO_NO' }, editable: false,styleCallback:editCallback},
		{ name: 'poDate', fieldName: 'poDate', width: '120', header: { text: 'PO_DATE' }, editable: false },
		{ name: '총수량', fieldName: '총수량', width: '120', header: { text: '총수량' }, numberFormat: '#,##0', editable: false },
		{ name: '잔량', fieldName: '잔량', width: '120', header: { text: '잔량' }, numberFormat: '#,##0', editable: false },
		{ name: 'todayInput', fieldName: 'todayInput', width: '120', header: { text: '당일투입량' }, numberFormat: '#,##0', editable: false,styleCallback:editCallback },
		{ name: 'cell', fieldName: 'cell', width: '120', header: { text: 'Cell' }, numberFormat: '#,##0', editable: false },
		{ name: 'block', fieldName: 'block', width: '120', header: { text: 'Block' }, numberFormat: '#,##0', editable: false },
		{ name: 'sheet', fieldName: 'sheet', width: '120', header: { text: 'Sheet(층)' }, numberFormat: '#,##0', editable: false },
		{ name: 'startLabel', fieldName: 'startLabel', width: '120', header: { text: '시작' }, editable: false },
		{ name: 'createQty', fieldName: 'createQty', width: '120', header: { text: '생성수' }, numberFormat: '#,##0', editable: false },
		{ name: 'remainQty', fieldName: 'remainQty', width: '120', header: { text: '잔여량' }, numberFormat: '#,##0', editable: false },
	],

	layout: [
		{
			name: "PO현황",
			direction: "horizontal",
			items: ["poNo", "poDate","총수량","잔량"],
			header: { text: "PO현황" },
		},	
		"todayInput",		
		{
			name: "Lot Size",
			direction: "horizontal",
			items: ["cell", "block","sheet"],
			header: { text: "작업시작" },
		},
		{
			name: "Lot 생성",
			direction: "horizontal",
			items: ["startLabel", "createQty","remainQty"],
			header: { text: "작업종료" },
		},		
	],
	
}

module.exports = grid;