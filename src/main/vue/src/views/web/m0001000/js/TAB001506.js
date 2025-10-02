/*
* 부자재-Chemical > 공정창고 반납
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

const USE_YN_LABELS = ["Y", "N"];
const USE_YN_VALUE = ["Y", "N"];

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
		//fixed: { colBarWidth: 1, colCount: 7 },
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
		{ fieldName: 'returnNo'      ,dataType: ValueType.TEXT },		
		{ fieldName: 'matTypeCode'	,dataType: ValueType.TEXT },
		{ fieldName: 'subMatTypeCode',dataType: ValueType.TEXT },
		{ fieldName: 'workDate'		,dataType: ValueType.TEXT },
		{ fieldName: 'shiftCode'	,dataType: ValueType.TEXT },
		{ fieldName: 'shiftName'	,dataType: ValueType.TEXT },
		{ fieldName: 'outNo'         ,dataType: ValueType.TEXT },
		{ fieldName: 'outSeq'		,dataType: ValueType.NUMBER },
		{ fieldName: 'outDate'		,dataType: ValueType.TEXT },
		{ fieldName: 'outTime'		,dataType: ValueType.TEXT },	
		{ fieldName: 'materialId'	,dataType: ValueType.TEXT },	
		{ fieldName: 'chemicalName'	,dataType: ValueType.TEXT },	
		{ fieldName: 'outWorkerName',dataType: ValueType.TEXT },	
		{ fieldName: 'line'			,dataType: ValueType.TEXT },	
		{ fieldName: 'stepCode'		,dataType: ValueType.TEXT },
		{ fieldName: 'stepNm'		,dataType: ValueType.TEXT },	
		{ fieldName: 'equipNo'		,dataType: ValueType.TEXT },	
		{ fieldName: 'equipNm'		,dataType: ValueType.TEXT },
		{ fieldName: 'unit'			,dataType: ValueType.TEXT },
		{ fieldName: 'outQty'		,dataType: ValueType.NUMBER },		
		{ fieldName: 'orgReturnQty' ,dataType: ValueType.NUMBER },
		{ fieldName: 'returnQty'    ,dataType: ValueType.NUMBER },
		{ fieldName: 'returnDate'	,dataType: ValueType.TEXT },
		{ fieldName: 'returnTime'	,dataType: ValueType.TEXT },	
		{ fieldName: 'workerName'   ,dataType: ValueType.TEXT },			
		{ fieldName: 'confirmYn'	,dataType: ValueType.TEXT },	
		{ fieldName: 'comments'		,dataType: ValueType.TEXT },	
		{ fieldName: 'editable'     ,dataType: ValueType.TEXT },
		{ fieldName: 'createUser'	,dataType: ValueType.TEXT },
	],
	columns: [
		{ name:'workDate'        ,fieldName:'workDate'      ,width: '80'  ,header: { text: '작업일' }, editable: false, autoFilter:true, editor: { mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3" },
		{ name:'shiftName'       ,fieldName:'shiftName'     ,width: '50'  ,header: { text: '근무조' }, editable: false, autoFilter:true},
		{ name:'outSeq'          ,fieldName:'outSeq'        ,width: '60'  ,header: { text: '투입\n순서', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0' },
		{ name:'outDate'         ,fieldName:'outDate'       ,width: '80'  ,header: { text: '투입일' }, editable: false, autoFilter:true, editor: { mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3" },
		{ name:'outTime'         ,fieldName:'outTime'       ,width: '60'  ,header: { text: '투입\n시간', styleName:'multiline-header' }, editable: false, autoFilter:true, editor: {mask:{editMask:"00:00"}}, "textFormat": "([0-9]{2})([0-9]{2});$1:$2" },
        { name:'materialId'      ,fieldName:'materialId'    ,width: '100' ,header: { text: '자재 ID' }, editable: false, autoFilter:true },        
		{ name:'chemicalName'	 ,fieldName:'chemicalName'  ,width: '80'  ,header: { text: '품명' }, editable: false, autoFilter:true},
		{ name:'outWorkerName'   ,fieldName:'outWorkerName'  ,width: '80'  ,header: { text: '작업자' }, editable: false, autoFilter:true }, 
		{ name:'equipNm'         ,fieldName:'equipNm'       ,width: '100' ,header: { text: '투입설비' }, editable: false, autoFilter:true },        
        { name:'stepNm'          ,fieldName:'stepNm'        ,width: '60' ,header: { text: 'Step' }, editable: false, autoFilter:true },        
        { name:'unit'            ,fieldName:'unit'          ,width: '40'  ,header: { text: '단위' }, editable: false, autoFilter:true, footer: {text:"합계"}  },
        { name:'outQty'          ,fieldName:'outQty'        ,width: '60'  ,header: { text: '투입\n수량', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer1"}},
		{ name:'returnQty'       ,fieldName:'returnQty'     ,width: '60'  ,header: { text: '반납\n수량', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer2"}},
		{ name:'returnDate'      ,fieldName:'returnDate'    ,width: '80'  ,header: { text: '반납일' }, editable: false, autoFilter:true, editor: { mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3" },
		{ name:'returnTime'      ,fieldName:'returnTime'    ,width: '60'  ,header: { text: '반납\n시간' , styleName:'multiline-header'}, editable: false, autoFilter:true, editor: {mask:{editMask:"00:00"}}, "textFormat": "([0-9]{2})([0-9]{2});$1:$2" },		
		{ name:'workerName'   	 ,fieldName:'workerName'    ,width: '80'  ,header: { text: '반납자' }, editable: false, autoFilter:true }, 		
        { name:'comments'        ,fieldName:'comments'      ,width: '200' ,header: { text: '비고' }, editable: true, autoFilter:true, styleName:'tl' },
	],	
} 

module.exports = grid;