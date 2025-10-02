/*
* 부자재-레진 > 공정 투입
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: true },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.BLOCK,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.NONE,
			rowHoverType: RowMaskType.ROW
		},
		edit: { editable: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		fixed: { colBarWidth: 1, colCount: 7 },
		footer: { visible: true },
		//footers: {},
		//format: {},
		header: { height: 40 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { 
			enabled: true ,
			checkReadOnly : true,

		},
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'matTypeCode', dataType: ValueType.TEXT },
		{ fieldName: 'subMatTypeCode', dataType: ValueType.TEXT },
		{ fieldName: 'workDate', dataType: ValueType.TEXT },
		{ fieldName: 'shiftCode', dataType: ValueType.TEXT },
		{ fieldName: 'outSeq', dataType: ValueType.NUMBER },
		{ fieldName: 'outDate', dataType: ValueType.TEXT },
		{ fieldName: 'outTime', dataType: ValueType.TEXT },
		{ fieldName: 'materialId', dataType: ValueType.TEXT },
		{ fieldName: 'line', dataType: ValueType.TEXT },
		{ fieldName: 'stepCode', dataType: ValueType.TEXT },
		{ fieldName: 'stepNm', dataType: ValueType.TEXT },
		{ fieldName: 'equipNo', dataType: ValueType.TEXT },
		{ fieldName: 'equipNm', dataType: ValueType.TEXT },
		{ fieldName: 'tank', dataType: ValueType.TEXT },
		{ fieldName: 'unit', dataType: ValueType.TEXT },
		{ fieldName: 'outQty', dataType: ValueType.NUMBER },
		{ fieldName: 'workerName', dataType: ValueType.TEXT },
		{ fieldName: 'storeTime', dataType: ValueType.TEXT },
		{ fieldName: 'storeDays', dataType: ValueType.NUMBER },
		{ fieldName: 'storeValidDays', dataType: ValueType.NUMBER },
		{ fieldName: 'comments', dataType: ValueType.TEXT },
		{ fieldName: 'inComments', dataType: ValueType.TEXT },
		{ fieldName: 'editable', dataType: ValueType.TEXT },
		{ fieldName: 'userId', dataType: ValueType.TEXT },
	],

	columns: [		
		{ name: 'workDate', 	fieldName: 'workDate', width: '100', header: { text: '작업일자' }, editable: false, autoFilter:true, editor: {mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3"},
		{ name: 'shiftCode', 	fieldName: 'shiftCode', width: '60', header: { text: '근무조' }, editable: false, autoFilter:true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },
		{ name: 'outSeq', 		fieldName: 'outSeq', width: '60', header: { text: '투입\n순서', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0' },
		{ name: 'outDate', 		fieldName: 'outDate', width: '100', header: { text: '투입일' }, editable: false, autoFilter:true, editor: {mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3"},
		{ name: 'outTime', 		fieldName: 'outTime', width: '60', header: { text: '투입\n시간', styleName:'multiline-header' }, editable: false, autoFilter:true, editor: {mask:{editMask:"00:00"}}, "textFormat": "([0-9]{2})([0-9]{2});$1:$2", },
		{ name: 'materialId', 	fieldName: 'materialId', width: '500', header: { text: '자재 ID' }, editable: false, autoFilter:true, renderer:{showTooltip:true} },
		{ name: 'subMatTypeCode', fieldName: 'subMatTypeCode', width: '80', header: { text: '자재\n종류', styleName: 'multiline-header' }, editable: false, autoFilter:true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },		
		{ name: 'equipNm', 		fieldName: 'equipNm', width: '100', header: { text: '설비약명' }, editable: false, autoFilter:true },
		{ name: 'stepNm', 		fieldName: 'stepNm', width: '60', header: { text: 'Step' }, editable: false, autoFilter:true, },
		{ name: 'tank', 		fieldName: 'tank', width: '60', header: { text: 'Tank\nMarco', styleName: 'multiline-header' }, editable: true, autoFilter:true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true} },
		{ name: 'unit', 		fieldName: 'unit', width: '40', header: { text: '단위' }, editable: false, autoFilter:true, footer: {text:"합계"} },		
		{ name: 'outQty', 		fieldName: 'outQty', width: '60', header: { text: '투입\n수량', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer1"} },
		{ name: 'workerName', 	fieldName: 'workerName', width: '80', header: { text: '작업자' }, editable: false, autoFilter:true },
		{ name: 'storeTime', 	fieldName: 'storeTime', width: '80', header: { text: '상온보관\n시간', styleName:'multiline-header' }, editable: false, autoFilter:true },
		{ name: 'storeDays', 	fieldName: 'storeDays', width: '80', header: { text: '상온보관\n일수', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr' },
		{ name: 'storeValidDays', fieldName: 'storeValidDays', width: '80', header: { text: '상온보관\n유효일', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr' },
		{ name: 'comments', 	fieldName: 'comments', width: '250', header: { text: '공정 투입' }, styleName:'edit tl', autoFilter:true, renderer: { showTooltip: true } },
		{ name: 'inComments', 	fieldName: 'inComments', width: '250', header: { text: '공정전 입고' }, styleName:'tl', editable: false, autoFilter:true, renderer: { showTooltip: true }   },
	],

	layout: [
		'workDate', 	
		'shiftCode', 	
		'outSeq', 		
		'outDate', 		
		'outTime', 		
		'materialId', 	
		'subMatTypeCode',
		'equipNm', 		
		'stepNm', 		
		'tank', 		
		'unit', 		
		'outQty', 		
		'workerName', 	
		'storeTime', 	
		'storeDays', 	
		'storeValidDays',
		{
			name : "comments",
			direction: "horizontal",
			items: [
				'comments',
				'inComments'
			],
			header: {
				text : "비고"
			}
		},	
	]
	
}
module.exports = grid;
