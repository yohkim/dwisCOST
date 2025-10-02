/*
* 원자재 > 공정 투입
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

const computeErrorQty = function ( prod, dataRow, fieldName, fieldNames, values ) {
	let val = (values[fieldNames.indexOf("errorNgportQty")]||0)
			+ (values[fieldNames.indexOf("errorWashQty")]||0)
			+ (values[fieldNames.indexOf("errorTkoutQty")]||0)
			+ (values[fieldNames.indexOf("errorEtcQty")]||0);

	return val;
};

const computeGoodQty = function ( prod, dataRow, fieldName, fieldNames, values ) {
	let val = (values[fieldNames.indexOf("outQty")]||0) - 
			( (values[fieldNames.indexOf("errorNgportQty")]||0)
			+ (values[fieldNames.indexOf("errorWashQty")]||0)
			+ (values[fieldNames.indexOf("errorTkoutQty")]||0)
			+ (values[fieldNames.indexOf("errorEtcQty")]||0)) ;

	return val;
};

const computeErrorRate = function ( prod, dataRow, fieldName, fieldNames, values ) {
	let val = 0;
	if ( (values[fieldNames.indexOf("outQty")]||0) !== 0 ) {
		val = ( ( (values[fieldNames.indexOf("errorNgportQty")]||0)
			+ (values[fieldNames.indexOf("errorWashQty")]||0)
			+ (values[fieldNames.indexOf("errorTkoutQty")]||0)
			+ (values[fieldNames.indexOf("errorEtcQty")]||0) )  * 100 
			/ (values[fieldNames.indexOf("outQty")]||0) ).toFixed(2)
	};

	return val;
};

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
		//editorOptions: { crossWhenExitLast : true},
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},		
		fixed: { colBarWidth: 1, colCount: 12},		
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
		{ fieldName: 'outNo', dataType: ValueType.TEXT },
		{ fieldName: 'workDate', dataType: ValueType.TEXT },
		{ fieldName: 'shiftCode', dataType: ValueType.TEXT },
		{ fieldName: 'outSeq', dataType: ValueType.NUMBER },
		{ fieldName: 'outDate', dataType: ValueType.TEXT },
		{ fieldName: 'outTime', dataType: ValueType.TEXT },
		{ fieldName: 'glassId', dataType: ValueType.TEXT },
		{ fieldName: 'inDate', dataType: ValueType.TEXT },
		{ fieldName: 'batchNo', dataType: ValueType.TEXT },
		{ fieldName: 'useCategory', dataType: ValueType.TEXT },
		{ fieldName: 'useCategoryNm', dataType: ValueType.TEXT },
		{ fieldName: 'glassThickness', dataType: ValueType.NUMBER },
		{ fieldName: 'glassMaterial', dataType: ValueType.TEXT },
		{ fieldName: 'workerName', dataType: ValueType.TEXT },
		{ fieldName: 'line', dataType: ValueType.TEXT },
		{ fieldName: 'stepCode', dataType: ValueType.TEXT },
		{ fieldName: 'stepNm', dataType: ValueType.TEXT },
		{ fieldName: 'equipNo', dataType: ValueType.TEXT },
		{ fieldName: 'equipNm', dataType: ValueType.TEXT },
		{ fieldName: 'unit', dataType: ValueType.TEXT },
		{ fieldName: 'remainQty', dataType: ValueType.NUMBER },
		{ fieldName: 'stockQty', dataType: ValueType.NUMBER },
		{ fieldName: 'outQty', dataType: ValueType.NUMBER },
		{ fieldName: 'orgOutQty' ,dataType: ValueType.NUMBER },
		{ fieldName: 'goodQty', dataType: ValueType.NUMBER, valueCallback:computeGoodQty },		
		{ fieldName: 'errorRate', dataType: ValueType.NUMBER, valueCallback:computeErrorRate },
		{ fieldName: 'errorQty', dataType: ValueType.NUMBER, valueCallback:computeErrorQty },
		{ fieldName: 'errorNgportQty', dataType: ValueType.NUMBER },
		{ fieldName: 'errorWashQty', dataType: ValueType.NUMBER },
		{ fieldName: 'errorTkoutQty', dataType: ValueType.NUMBER },
		{ fieldName: 'errorEtcQty', dataType: ValueType.NUMBER },
		{ fieldName: 'comments', dataType: ValueType.TEXT },
		{ fieldName: 'inComments', dataType: ValueType.TEXT },
		{ fieldName: 'editable'     ,dataType: ValueType.TEXT },
		{ fieldName: 'userId', dataType: ValueType.TEXT },
	],

	columns: [		
		{ name: 'workDate', fieldName: 'workDate', width: '100', header: { text: '작업일자' }, editable: false, autoFilter:true, editor: {mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3"},
		{ name: 'shiftCode', fieldName: 'shiftCode', width: '60', header: { text: '근무조' }, editable: false, autoFilter:true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },
		{ name: 'outSeq', fieldName: 'outSeq', width: '60', header: { text: '투입\n순서' }, editable: false, autoFilter:true, numberFormat: '#,##0' },
		{ name: 'outDate', fieldName: 'outDate', width: '100', header: { text: '투입일' }, editable: false, autoFilter:true, editor: {mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3"},
		{ name: 'outTime', fieldName: 'outTime', width: '60', header: { text: '투입\n시간' }, editable: false, autoFilter:true, editor: {mask:{editMask:"00:00"}}, "textFormat": "([0-9]{2})([0-9]{2});$1:$2", },
		{ name: 'glassId', fieldName: 'glassId', width: '270', header: { text: 'GLASS ID' }, editable: false, autoFilter:true },
		{ name: 'batchNo', fieldName: 'batchNo', width: '100', header: { text: 'BATCH NO' }, editable: false, autoFilter:true },
		{ name: 'useCategoryNm', fieldName: 'useCategoryNm', width: '60', header: { text: '투입\n구분', styleName:'multiline-header' }, editable: false, autoFilter:true, auterFilter:true },
		{ name: 'glassThickness', fieldName: 'glassThickness', width: '60', header: { text: '원장\n두께', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', autoFilter:true },
		{ name: 'glassMaterial', fieldName: 'glassMaterial', width: '60', header: { text: '원장\n사양', styleName:'multiline-header' }, editable: false, autoFilter:true, autoFilter:true },
		{ name: 'workerName', fieldName: 'workerName', width: '80', header: { text: '작업자' }, editable: false, autoFilter:true },
		{ name: 'equipNm', fieldName: 'equipNm', width: '100', header: { text: '설비약명' }, editable: false, autoFilter:true  },
		{ name: 'stepNm', fieldName: 'stepNm', width: '50', header: { text: 'Step' }, editable: false, autoFilter:true  },
		{ name: 'unit', fieldName: 'unit', width: '60', header: { text: '단위' }, editable: false, autoFilter:true},
		{ name: 'stockQty', fieldName: 'stockQty', width: '80', header: {text: '투입가능\n재고수량', styleName:'multiline-header' }, autoFilter:true, numberFormat: '#,##0', styleName:'tr', editable: false, footer: {text:"합계"}  },
		{ name: 'outQty', fieldName: 'outQty', width: '60', header: { text: '투입\n수량', styleName:'multiline-header' }, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer1"}},
		{ name: 'goodQty', fieldName: 'goodQty', width: '60', header: { text: '양품\n수량', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer2"} },		
		{ name: 'errorRate', fieldName: 'errorRate', width: '80', header: { text: '불량율(%)' }, editable: false, autoFilter:true, numberFormat: '#,##0.##', styleName:'tr'},
		{ name: 'errorQty', fieldName: 'errorQty', width: '60', header: { text: '불량\n수량', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer3"}},						
		{ name: 'errorNgportQty', fieldName: 'errorNgportQty', width: '60', header: { text: 'NG Port' }, editable:true, autoFilter:true, numberFormat: '#,##0', styleName:'edit tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"} },
		{ name: 'errorWashQty', fieldName: 'errorWashQty', width: '60', header: { text: '세정부' }, editable:true, autoFilter:true,numberFormat: '#,##0', styleName:'edit tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"} },
		{ name: 'errorTkoutQty', fieldName: 'errorTkoutQty', width: '60', header: { text: '반출' }, editable:true, autoFilter:true,numberFormat: '#,##0', styleName:'edit tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"} },
		{ name: 'errorEtcQty', fieldName: 'errorEtcQty', width: '60', header: { text: '기타' }, editable:true, autoFilter:true, numberFormat: '#,##0' , styleName:'edit tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}},
		{ name: 'comments', 	fieldName: 'comments', width: '250', header: { text: '공정 투입' }, styleName:'edit tl', autoFilter:true, renderer: { showTooltip: true } },
		{ name: 'inComments', 	fieldName: 'inComments', width: '250', header: { text: '공정전 입고' }, styleName:'tl', editable: false, autoFilter:true, renderer: { showTooltip: true }   },
	],
	layout: [
		'workDate'		,
		'shiftCode'		,
		'outSeq'     	,
		'outDate'		,
		'outTime'		,
		'glassId'		,
		'batchNo'		,
		'useCategoryNm'	,
		'glassThickness',
		'glassMaterial'	,
		'workerName'  	,
		'equipNm' 		,
		'stepNm' 		,
		'unit' 			,
		'stockQty' 	,
		'outQty' 		,
		'goodQty' 		,		
		'errorRate' 	,
		'errorQty' 		,
		{
			name : "errorKindQty",
			direction: "horizontal",
			items: [
				'errorNgportQty'    ,
				'errorWashQty'		,
				'errorTkoutQty'    	,
				'errorEtcQty'    	,
			],
			header: {
				text : "불량유형별 수량"
			}
		},	
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