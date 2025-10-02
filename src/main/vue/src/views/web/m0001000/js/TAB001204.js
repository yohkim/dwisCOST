/*
* 부자재-필름 > 공정투입
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

const computeErrorQty = function ( prod, dataRow, fieldName, fieldNames, values ) {
	let val = (values[fieldNames.indexOf("errorPmQty")]||0)
			+ (values[fieldNames.indexOf("errorDropQty")]||0)
			+ (values[fieldNames.indexOf("errorNgboxQty")]||0)
			+ (values[fieldNames.indexOf("errorEquipQty")]||0)
			+ (values[fieldNames.indexOf("errorAppearanceQty")]||0);

	return val;
};

const computeGoodQty = function ( prod, dataRow, fieldName, fieldNames, values ) {
	let val = (values[fieldNames.indexOf("outQty")]||0) - 
			( (values[fieldNames.indexOf("errorPmQty")]||0)
			+ (values[fieldNames.indexOf("errorDropQty")]||0)
			+ (values[fieldNames.indexOf("errorNgboxQty")]||0)
			+ (values[fieldNames.indexOf("errorEquipQty")]||0)
			+ (values[fieldNames.indexOf("errorAppearanceQty")]||0)) ;

	return val;
};

const computeErrorRate = function ( prod, dataRow, fieldName, fieldNames, values ) {
	let val = 0;
	if ( (values[fieldNames.indexOf("outQty")]||0) !== 0 ) {
		val = ( ( (values[fieldNames.indexOf("errorPmQty")]||0)
		 	+ (values[fieldNames.indexOf("errorDropQty")]||0)
			+ (values[fieldNames.indexOf("errorNgboxQty")]||0)
			+ (values[fieldNames.indexOf("errorEquipQty")]||0)
			+ (values[fieldNames.indexOf("errorAppearanceQty")]||0) )  * 100 
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
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		fixed: { colBarWidth: 1, colCount: 11},
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

		{ fieldName: 'outNo'         ,dataType: ValueType.TEXT },
		{ fieldName: 'matTypeCode'	,dataType: ValueType.TEXT },
		{ fieldName: 'subMatTypeCode',dataType: ValueType.TEXT },
		{ fieldName: 'workDate'		,dataType: ValueType.TEXT },
		{ fieldName: 'shiftCode'	,dataType: ValueType.TEXT },
		{ fieldName: 'outSeq'		,dataType: ValueType.NUMBER },
		{ fieldName: 'outDate'		,dataType: ValueType.TEXT },
		{ fieldName: 'outTime'		,dataType: ValueType.TEXT },	
		{ fieldName: 'materialId'	,dataType: ValueType.TEXT },	
		{ fieldName: 'prodCategory'	,dataType: ValueType.TEXT },		
		{ fieldName: 'prodCategoryName',dataType: ValueType.TEXT },		
		{ fieldName: 'modelCode'	,dataType: ValueType.TEXT },	
		{ fieldName: 'filmName'		,dataType: ValueType.TEXT },
		{ fieldName: 'workerName'	,dataType: ValueType.TEXT },	
		{ fieldName: 'line'			,dataType: ValueType.TEXT },	
		{ fieldName: 'stepCode'		,dataType: ValueType.TEXT },
		{ fieldName: 'stepNm'		,dataType: ValueType.TEXT },	
		{ fieldName: 'equipNo'		,dataType: ValueType.TEXT },	
		{ fieldName: 'equipNm'		,dataType: ValueType.TEXT },
		{ fieldName: 'unit'			,dataType: ValueType.TEXT },			
		{ fieldName: 'remainQty'	,dataType: ValueType.NUMBER },
		{ fieldName: 'stockQty'		,dataType: ValueType.NUMBER },
		{ fieldName: 'logQty'		,dataType: ValueType.NUMBER },
		{ fieldName: 'outQty'		,dataType: ValueType.NUMBER },
		{ fieldName: 'orgOutQty'    ,dataType: ValueType.NUMBER },
		{ fieldName: 'goodQty'		, dataType: ValueType.NUMBER, valueCallback:computeGoodQty },		
		{ fieldName: 'errorRate'	, dataType: ValueType.NUMBER, valueCallback:computeErrorRate },		
		{ fieldName: 'errorQty'           ,dataType: ValueType.NUMBER, valueCallback:computeErrorQty },    
		{ fieldName: 'errorPmQty'         ,dataType: ValueType.NUMBER },    
		{ fieldName: 'errorDropQty'       ,dataType: ValueType.NUMBER },  
		{ fieldName: 'errorNgboxQty'      ,dataType: ValueType.NUMBER },  
		{ fieldName: 'errorEquipQty'      ,dataType: ValueType.NUMBER },  
		{ fieldName: 'errorAppearanceQty' ,dataType: ValueType.NUMBER },   		
		{ fieldName: 'comments'		,dataType: ValueType.TEXT },
		{ fieldName: 'inComments', dataType: ValueType.TEXT },	
		{ fieldName: 'editable'     ,dataType: ValueType.TEXT },
		{ fieldName: 'createUser'	,dataType: ValueType.TEXT },
	],
	columns: [
		{ name:'workDate'        ,fieldName:'workDate'      ,width: '100'  ,header: { text: '작업일' }, editable: false, autoFilter:true, editor: { mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3" },
		{ name:'shiftCode'       ,fieldName:'shiftCode'     ,width: '50'  ,header: { text: '근무조' }, editable: false, autoFilter:true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true }},
		{ name:'outSeq'          ,fieldName:'outSeq'        ,width: '60'  ,header: { text: '투입\n순서', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0' },
		{ name:'outDate'         ,fieldName:'outDate'       ,width: '100'  ,header: { text: '투입일' }, editable: false, autoFilter:true, editor: { mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3" },
		{ name:'outTime'         ,fieldName:'outTime'       ,width: '60'  ,header: { text: '투입\n시간', styleName:'multiline-header' }, editable: false, autoFilter:true, editor: {mask:{editMask:"00:00"}}, "textFormat": "([0-9]{2})([0-9]{2});$1:$2" },
        { name:'materialId'      ,fieldName:'materialId'    ,width: '280' ,header: { text: '자재 ID' }, editable: false, autoFilter:true },        
		{ name:'prodCategoryName' ,fieldName:'prodCategoryName'	,width: '60'  ,header: { text: '제품' }, editable: false,  autoFilter:true },		
		{ name:'modelCode'		 ,fieldName:'modelCode'		,width: '60'  ,header: { text: '모델' }, editable: false, autoFilter:true},
		{ name:'filmName'		 ,fieldName:'filmName'		,width: '90' ,header: { text: '필름' }, editable: false, autoFilter:true },		
		{ name:'workerName'      ,fieldName:'workerName'    ,width: '70'  ,header: { text: '작업자' }, editable: false, autoFilter:true }, 
		{ name:'equipNm'         ,fieldName:'equipNm'       ,width: '100' ,header: { text: '투입설비' }, editable: false, autoFilter:true },        
        { name:'stepNm'          ,fieldName:'stepNm'        ,width: '60' ,header: { text: 'Step' }, editable: false, autoFilter:true },        
        { name:'unit'            ,fieldName:'unit'          ,width: '40'  ,header: { text: '단위' }, editable: false, autoFilter:true },
        { name:'stockQty'        ,fieldName:'stockQty'      ,width: '80'  ,header: { text: '투입가능\n재고수량', styleName:'multiline-header'  }, editable: false, autoFilter:true, numberFormat: '#,##0' , styleName:'tr' , footer: {text:"합계"} },
		{ name:'logQty'       	 ,fieldName:'logQty'      	,width: '80'  ,header: { text: '설비로그\n투입수량' , styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0' , styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer5"} },
        { name:'outQty'          ,fieldName:'outQty'        ,width: '60'  ,header: { text: '투입\n수량', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0' , styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer1"} },
		{ name: 'goodQty'		, fieldName: 'goodQty', width: '60', header: { text: '양품\n수량', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer2"} },		
		{ name: 'errorRate'		, fieldName: 'errorRate', width: '80', header: { text: '불량율\n(%)', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0.##', styleName:'tr'},		
		{ name:'errorQty'           ,fieldName:'errorQty'           ,width: '60' ,header: { text: '불량\n수량', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr' , footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer3"} },
		{ name:'errorPmQty'         ,fieldName:'errorPmQty'         ,width: '80' ,header: { text: 'PM' }, editable: true, autoFilter:true, numberFormat: '#,##0', styleName:'edit tr' , footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}   },
		{ name:'errorDropQty'       ,fieldName:'errorDropQty'       ,width: '90' ,header: { text: '설비낙하' }, editable: true, autoFilter:true, numberFormat: '#,##0', styleName:'edit tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}  },
		{ name:'errorNgboxQty'      ,fieldName:'errorNgboxQty'      ,width: '80' ,header: { text: 'NG박스' }, editable: true, autoFilter:true, numberFormat: '#,##0', styleName:'edit tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}  },
		{ name:'errorEquipQty'      ,fieldName:'errorEquipQty'      ,width: '90' ,header: { text: '설비에러' }, editable: true, autoFilter:true, numberFormat: '#,##0', styleName:'edit tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}  },
		{ name:'errorAppearanceQty' ,fieldName:'errorAppearanceQty' ,width: '90' ,header: { text: '외관불량' }, editable: true, autoFilter:true, numberFormat: '#,##0', styleName:'edit tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}  },		
		{ name: 'comments', 	fieldName: 'comments', width: '250', header: { text: '공정 투입' }, styleName:'edit tl', autoFilter:true, renderer: { showTooltip: true } },
		{ name: 'inComments', 	fieldName: 'inComments', width: '250', header: { text: '공정전 입고' }, styleName:'tl', editable: false, autoFilter:true, renderer: { showTooltip: true }   },
	],	

	layout: [
		'workDate' 	,
		'shiftCode'       ,
		'outSeq'          ,
		'outDate'         ,
		'outTime'         ,
		'materialId'      ,
		'prodCategoryName',
		'modelCode'		  ,		 
		'filmName'		  ,
		'workerName'      ,
		'equipNm'         ,
		'stepNm'          ,
		'unit'            ,
		'stockQty'        ,
		'logQty'       	  ,
		'outQty'          ,
		'goodQty'	,
		'errorRate',		
		'errorQty'    ,
		{
			name : "error",
			direction: "horizontal",
			items: [		 
				'errorPmQty',
				'errorDropQty',
				'errorNgboxQty',     
				'errorEquipQty' ,    
				'errorAppearanceQty'
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