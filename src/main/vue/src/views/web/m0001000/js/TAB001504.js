/*
* 부자재-필름 > 불량발생
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

const computeBackErrorQty = function ( prod, dataRow, fieldName, fieldNames, values ) {
	let val = (values[fieldNames.indexOf("backErrorPmQty")]||0)
			+ (values[fieldNames.indexOf("backErrorDropQty")]||0)
			+ (values[fieldNames.indexOf("backErrorNgboxQty")]||0)
			+ (values[fieldNames.indexOf("backErrorEquipQty")]||0)
			+ (values[fieldNames.indexOf("backErrorAppearanceQty")]||0);

	return val;
};

const computeFrontErrorQty = function ( prod, dataRow, fieldName, fieldNames, values ) {
	let val = (values[fieldNames.indexOf("frontErrorPmQty")]||0)
			+ (values[fieldNames.indexOf("frontErrorDropQty")]||0)
			+ (values[fieldNames.indexOf("frontErrorNgboxQty")]||0)
			+ (values[fieldNames.indexOf("frontErrorEquipQty")]||0)
			+ (values[fieldNames.indexOf("frontErrorAppearanceQty")]||0);

	return val;
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
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
			rowHoverType: RowMaskType.ROW
		},
		edit: { editable: false },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: { colBarWidth: 1, colCount: 8},
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

		{ fieldName: 'workDate'               ,dataType: ValueType.TEXT },     
		{ fieldName: 'shiftCode'              ,dataType: ValueType.TEXT },     
		{ fieldName: 'shiftName'              ,dataType: ValueType.TEXT },     
		{ fieldName: 'prodCategory'           ,dataType: ValueType.TEXT },     
		{ fieldName: 'prodCategoryName'       ,dataType: ValueType.TEXT },     
		{ fieldName: 'modelCode'	          ,dataType: ValueType.TEXT },       
		{ fieldName: 'line'                   ,dataType: ValueType.TEXT },      
		{ fieldName: 'stepCode'               ,dataType: ValueType.TEXT },     
		{ fieldName: 'stepNm'                 ,dataType: ValueType.TEXT },     
		{ fieldName: 'equipNo'                ,dataType: ValueType.TEXT },     
		{ fieldName: 'equipNm'                ,dataType: ValueType.TEXT },     
		{ fieldName: 'unit'                   ,dataType: ValueType.TEXT },      
		// { fieldName: 'errorDate'              ,dataType: ValueType.TEXT },     
		// { fieldName: 'errorTime'              ,dataType: ValueType.TEXT },     
		{ fieldName: 'workerName'		      ,dataType: ValueType.TEXT },    
		//{ fieldName: 'backErrorQty'           ,dataType: ValueType.NUMBER, valueCallback:computeBackErrorQty },    
		{ fieldName: 'backErrorQty'           ,dataType: ValueType.NUMBER },    
		{ fieldName: 'backErrorPmQty'         ,dataType: ValueType.NUMBER },    
		{ fieldName: 'backErrorDropQty'       ,dataType: ValueType.NUMBER },  
		{ fieldName: 'backErrorNgboxQty'      ,dataType: ValueType.NUMBER },  
		{ fieldName: 'backErrorEquipQty'      ,dataType: ValueType.NUMBER },  
		{ fieldName: 'backErrorAppearanceQty' ,dataType: ValueType.NUMBER },   
		//{ fieldName: 'frontErrorQty'          ,dataType: ValueType.NUMBER, valueCallback:computeFrontErrorQty },
		{ fieldName: 'frontErrorQty'          ,dataType: ValueType.NUMBER},
		{ fieldName: 'frontErrorPmQty'        ,dataType: ValueType.NUMBER },
		{ fieldName: 'frontErrorDropQty'      ,dataType: ValueType.NUMBER },
		{ fieldName: 'frontErrorNgboxQty'     ,dataType: ValueType.NUMBER },
		{ fieldName: 'frontErrorEquipQty'     ,dataType: ValueType.NUMBER },
		{ fieldName: 'frontErrorAppearanceQty',dataType: ValueType.NUMBER },
	//	{ fieldName: 'comments'               ,dataType: ValueType.TEXT },  
	],
	columns: [
		{ name:'workDate'               ,fieldName:'workDate'               ,width: '100' ,header: { text: '작업일자' }, editable: false, autoFilter:true,  editor: { mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3"  },
		{ name:'shiftName'              ,fieldName:'shiftName'              ,width: '80' ,header: { text: '근무조' }, editable: false, autoFilter:true },
		{ name:'prodCategoryName'       ,fieldName:'prodCategoryName'       ,width: '80' ,header: { text: '제품' }, editable: false, autoFilter:true },
		{ name:'modelCode'	            ,fieldName:'modelCode'	            ,width: '80' ,header: { text: '모델' }, editable: false, autoFilter:true },
		{ name:'equipNm'                ,fieldName:'equipNm'                ,width: '120' ,header: { text: '설비' }, editable: false, autoFilter:true },		
		{ name:'stepNm'                 ,fieldName:'stepNm'                 ,width: '80' ,header: { text: 'Step' }, editable: false, autoFilter:true },
		// { name:'errorDate'              ,fieldName:'errorDate'              ,width: '80' ,header: { text: '발생일자' }, editable: false, autoFilter:true,  editor: { mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3"  },
		// { name:'errorTime'              ,fieldName:'errorTime'              ,width: '80' ,header: { text: '발생시간' }, editable: false, autoFilter:true },
		{ name:'workerName'		        ,fieldName:'workerName'		        ,width: '100' ,header: { text: '작업자' }, editable: false, autoFilter:true, styleName:'tc' },
		{ name:'unit'                   ,fieldName:'unit'                   ,width: '70' ,header: { text: '단위' }, editable: false, autoFilter:true, footer: {text:"합계"}  },		
		{ name:'backErrorQty'           ,fieldName:'backErrorQty'           ,width: '90' ,header: { text: '불량합계' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer3"}   },
		{ name:'backErrorPmQty'         ,fieldName:'backErrorPmQty'         ,width: '90' ,header: { text: 'PM' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}   },
		{ name:'backErrorDropQty'       ,fieldName:'backErrorDropQty'       ,width: '90' ,header: { text: '설비낙하' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr' , footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"} },
		{ name:'backErrorNgboxQty'      ,fieldName:'backErrorNgboxQty'      ,width: '90' ,header: { text: 'NG박스' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}  },
		{ name:'backErrorEquipQty'      ,fieldName:'backErrorEquipQty'      ,width: '90' ,header: { text: '설비에러' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}  },
		{ name:'backErrorAppearanceQty' ,fieldName:'backErrorAppearanceQty' ,width: '90' ,header: { text: '외관불량' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:' tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}  },
		{ name:'frontErrorQty'          ,fieldName:'frontErrorQty'          ,width: '90' ,header: { text: '불량합계' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:' tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer3"}  },
		{ name:'frontErrorPmQty'        ,fieldName:'frontErrorPmQty'        ,width: '90' ,header: { text: 'PM' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:' tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}  },
		{ name:'frontErrorDropQty'      ,fieldName:'frontErrorDropQty'      ,width: '90' ,header: { text: '설비낙하' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:' tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}  },
		{ name:'frontErrorNgboxQty'     ,fieldName:'frontErrorNgboxQty'     ,width: '90' ,header: { text: 'NG박스' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:' tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"} },
		{ name:'frontErrorEquipQty'     ,fieldName:'frontErrorEquipQty'     ,width: '90' ,header: { text: '설비에러' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:' tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}  },
		{ name:'frontErrorAppearanceQty',fieldName:'frontErrorAppearanceQty',width: '90' ,header: { text: '외관불량' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:' tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"}  },
//		{ name:'comments'               ,fieldName:'comments'               ,width: '300' ,header: { text: '비고' }, editable: true, autoFilter:true, styleName:'edit tl'  },
	],	

	layout: [
		'workDate'               ,
		'shiftName'              ,
		'prodCategoryName'       ,
		'modelCode'	            ,
		'equipNm'                ,
		'stepNm'                 ,
	//	'errorDate'              ,
	//	'errorTime'              ,
		'workerName'		     ,
		'unit'                   ,
		{
			name : "BackError",
			direction: "horizontal",
			items: [
				'backErrorQty'           ,
				'backErrorPmQty'         ,
				'backErrorDropQty'       ,
				'backErrorNgboxQty'      ,
				'backErrorEquipQty'      ,
				'backErrorAppearanceQty' 
			],
			header: {
				text : "Back ( 상부 )"
			}
		},
		{
			name : "FrontError",
			direction: "horizontal",
			items: [
				'frontErrorQty'           ,
				'frontErrorPmQty'         ,
				'frontErrorDropQty'       ,
				'frontErrorNgboxQty'      ,
				'frontErrorEquipQty'      ,
				'frontErrorAppearanceQty' 
			],
			header: {
				text : "Front ( 하부 )"
			}
		},		
	//	'comments'
	]	
} 

module.exports = grid;