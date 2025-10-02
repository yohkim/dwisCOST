/*
* 부자재-레진 > 공정전 입고
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
			fitStyle: GridFitStyle.EVEN_FILL,
			rowHoverType: RowMaskType.ROW
		},
		edit: { editable: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: { colBarWidth: 1, colCount: 5 },
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
		{ fieldName: 'inDate', dataType: ValueType.TEXT },
		{ fieldName: 'inTime', dataType: ValueType.TEXT },
		{ fieldName: 'materialId', dataType: ValueType.TEXT },
		{ fieldName: 'inQty', dataType: ValueType.NUMBER },
		{ fieldName: 'remainQty', dataType: ValueType.NUMBER },
		{ fieldName: 'unit', dataType: ValueType.TEXT },
		{ fieldName: 'useYn', dataType: ValueType.TEXT },
		{ fieldName: 'workerId', dataType: ValueType.TEXT },
		{ fieldName: 'workerName', dataType: ValueType.TEXT },
		{ fieldName: 'makeDate', dataType: ValueType.TEXT },
		{ fieldName: 'makeElapseDays', dataType: ValueType.NUMBER },
		{ fieldName: 'storeValidDays', dataType: ValueType.NUMBER },
		{ fieldName: 'storeDays', dataType: ValueType.NUMBER },
		{ fieldName: 'storeValidPassYn', dataType: ValueType.TEXT },
		{ fieldName: 'editable'     ,dataType: ValueType.TEXT },
		{ fieldName: 'comments', dataType: ValueType.TEXT },
		{ fieldName: 'outComments', dataType: ValueType.TEXT },
	],

	columns: [		
		{ name: 'inDate', 		fieldName: 'inDate', width: '100', header: { text: '입고일' }, editable: false, autoFilter:true, editor: {mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3"},
		{ name: 'inTime', 		fieldName: 'inTime', width: '60', header: { text: '입고\n시간', styleName:'multiline-header'  }, editable: false, autoFilter:true  },
		{ name: 'materialId', 	fieldName: 'materialId', width: '460', header: { text: '자재 ID' }, editable: false, autoFilter:true },
		{ name: 'subMatTypeCode', fieldName: 'subMatTypeCode', width: '80', header: { text: '자재\n종류', styleName:'multiline-header'  }, editable: false, autoFilter:true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },
		{ name: 'unit', 		fieldName: 'unit', width: '40', header: { text: '단위' }, editable: false, footer: {text:"합계"} },
		{ name: 'inQty', 		fieldName: 'inQty', width: '60', header: { text: '입고\n수량', styleName:'multiline-header'  }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer1"} },
		{ name: 'useYn', 		fieldName: 'useYn', width: '60', header: { text: '사용\n여부', styleName:'multiline-header'  }, editable: false, autoFilter:true, autoFilter:true },
		{ name: 'workerName', 	fieldName: 'workerName', width: '80', header: { text: '담당자' }, editable: false, autoFilter:true },
		{ name: 'makeDate', 	fieldName: 'makeDate', width: '100', header: { text: '제조일자', styleName:'multiline-header'  }, editable: false, autoFilter:true, editor: {mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3"},
		{ name: 'makeElapseDays', fieldName: 'makeElapseDays', width: '80', header: { text: '제조\n경과일' , styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr' },
		{ name: 'storeValidDays', fieldName: 'storeValidDays', width: '80', header: { text: '상온보관\n유효일', styleName:'multiline-header'  }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr' },
		{ name: 'storeDays', 	fieldName: 'storeDays', width: '80', header: { text: '상온보관\n일수', styleName:'multiline-header'  }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr' },
		{ name: 'comments', 	fieldName: 'comments', width: '250', header: { text: '공정전 입고' }, styleName:'edit tl', autoFilter:true, renderer: { showTooltip: true } },
		{ name: 'outComments', 	fieldName: 'outComments', width: '250', header: { text: '공정 투입' }, styleName:'tl', editable: false, autoFilter:true, renderer: { showTooltip: true }   },
	],

	layout: [
		'inDate', 		
		'inTime', 		
		'materialId', 	
		'subMatTypeCode',
		'unit', 		
		'inQty', 		
		'useYn', 		
		'workerName', 	
		'makeDate', 	
		'makeElapseDays',
		'storeValidDays',
		'storeDays', 
		{
			name : "comments",
			direction: "horizontal",
			items: [
				'comments',
				'outComments'
			],
			header: {
				text : "비고"
			}
		},	
	]		
}

module.exports = grid;