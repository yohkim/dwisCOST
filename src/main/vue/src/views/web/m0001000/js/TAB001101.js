/*
* 원자재 > 공정전 입고
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
		fixed: { colBarWidth: 1, colCount: 6 },
		footer: { visible: true },
		//footers: {},
		//format: {},
		header: { height: 40, showTooltip: true, tooltipEllipsisOnly: true },
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
		{ fieldName: 'inDate', dataType: ValueType.TEXT },
		{ fieldName: 'inTime', dataType: ValueType.TEXT },
		{ fieldName: 'useCategory', dataType: ValueType.TEXT },
		{ fieldName: 'boxNum', dataType: ValueType.NUMBER },
		{ fieldName: 'glassId', dataType: ValueType.TEXT },
		{ fieldName: 'unit', dataType: ValueType.TEXT },
		{ fieldName: 'inQty', dataType: ValueType.NUMBER },
		{ fieldName: 'orgInQty', dataType: ValueType.NUMBER },
		{ fieldName: 'remainQty', dataType: ValueType.NUMBER },		
		{ fieldName: 'useYn', dataType: ValueType.TEXT },
		{ fieldName: 'workerId', dataType: ValueType.TEXT },
		{ fieldName: 'workerName', dataType: ValueType.TEXT },
		{ fieldName: 'glassThickness', dataType: ValueType.NUMBER },
		{ fieldName: 'glassMaterial', dataType: ValueType.TEXT },
		{ fieldName: 'glassSize', dataType: ValueType.TEXT },
		{ fieldName: 'cutType', dataType: ValueType.TEXT },
		{ fieldName: 'cutDate', dataType: ValueType.TEXT },
		{ fieldName: 'editable'     ,dataType: ValueType.TEXT },
		{ fieldName: 'comments', dataType: ValueType.TEXT },
		{ fieldName: 'outComments', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'inDate', 		fieldName: 'inDate', width: '100', header: { text: '입고일' }, editable: false, autoFilter:true, editor: {mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3"},
		{ name: 'inTime',		fieldName: 'inTime', width: '60', header: { text: '시간' }, editable: false,  },
		{ name: 'useCategory', 	fieldName: 'useCategory', width: '60', header: { text: '투입\n구분', styleName:'multiline-header'  }, editable: false, autoFilter:true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },
		{ name: 'boxNum', 		fieldName: 'boxNum', width: '60', header: { text: 'Box\n번호', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0' },
		{ name: 'glassId', 		fieldName: 'glassId', width: '270', header: { text: 'GLASS ID' }, editable: false, autoFilter:true },
		{ name: 'unit', 		fieldName: 'unit', width: '50', header: { text: '단위' }, editable: false, autoFilter:true, footer: {text:"합계"}  },
		{ name: 'inQty', 		fieldName: 'inQty', width: '60', header: { text: '입고\n수량', styleName:'multiline-header' }, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer1"}},
		{ name: 'remainQty', 	fieldName: 'remainQty', width: '60', header: { text: '잔량' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer2"} },	
		{ name: 'useYn', 		fieldName: 'useYn', width: '60', header: { text: '사용\n여부', styleName:'multiline-header' }, editable: false, autoFilter:true },		
		{ name: 'workerName', 	fieldName: 'workerName', width: '80', header: { text: '담당자' }, editable: false, autoFilter:true },
		{ name: 'glassThickness', fieldName: 'glassThickness', width: '60', header: { text: '두께' }, editable: false, autoFilter:true, numberFormat: '#,##0' },
		{ name: 'glassMaterial', fieldName: 'glassMaterial', width: '60', header: { text: '사양' }, editable: false, autoFilter:true },
		{ name: 'glassSize', 	fieldName: 'glassSize', width: '80', header: { text: '크기' }, editable: false, autoFilter:true },
		{ name: 'cutType', 		fieldName: 'cutType', width: '80', header: { text: '컷팅\n구분', styleName:'multiline-header' }, editable: false, autoFilter:true },
		{ name: 'cutDate', 		fieldName: 'cutDate', width: '100', header: { text: '컷팅\n날짜', styleName:'multiline-header' }, editable: false, autoFilter:true, editor: {mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3" },
		{ name: 'comments', 	fieldName: 'comments', width: '300', header: { text: '공정전 입고' }, styleName:'edit tl', autoFilter:true, renderer: { showTooltip: true } },
		{ name: 'outComments', 	fieldName: 'outComments', width: '300', header: { text: '공정 투입' }, styleName:'tl', editable: false, autoFilter:true, renderer: { showTooltip: true }   },
	],

	layout: [
		'inDate', 		
		'inTime',		
		'useCategory', 	
		'boxNum', 		
		'glassId', 		
		'unit', 		
		'inQty', 		
		'remainQty', 	
		'useYn', 		
		'workerName', 	
		'glassThickness',
		'glassMaterial',
		'glassSize', 	
		'cutType', 		
		'cutDate', 		
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