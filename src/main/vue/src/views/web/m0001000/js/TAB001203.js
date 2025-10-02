/*
* 부자재-Tool > 공정투입
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
			fitStyle: GridFitStyle.NONE,
			rowHoverType: RowMaskType.ROW
		},
		edit: { editable: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		fixed: { colBarWidth: 1, colCount: 10 },
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

		{ fieldName: 'materialId'      ,dataType: ValueType.TEXT },
		{ fieldName: 'matTypeCode'     ,dataType: ValueType.TEXT },
		{ fieldName: 'subMatTypeCode'  ,dataType: ValueType.TEXT },
		{ fieldName: 'subMatTypeName'  ,dataType: ValueType.TEXT },
		{ fieldName: 'workDate'        ,dataType: ValueType.TEXT },
		{ fieldName: 'shiftCode'       ,dataType: ValueType.TEXT },
		{ fieldName: 'outSeq'          ,dataType: ValueType.NUMBER },
		{ fieldName: 'outDate'         ,dataType: ValueType.TEXT },
		{ fieldName: 'outTime'         ,dataType: ValueType.TEXT },
		{ fieldName: 'workerName'      ,dataType: ValueType.TEXT },
		{ fieldName: 'useCategory'     ,dataType: ValueType.TEXT },
		{ fieldName: 'line'            ,dataType: ValueType.TEXT },
		{ fieldName: 'stepCode'        ,dataType: ValueType.TEXT },
		{ fieldName: 'stepNm'          ,dataType: ValueType.TEXT },
		{ fieldName: 'equipNo'         ,dataType: ValueType.TEXT },
		{ fieldName: 'equipNm'         ,dataType: ValueType.TEXT },
		{ fieldName: 'orgEquipNm'         ,dataType: ValueType.TEXT },
		{ fieldName: 'unit'            ,dataType: ValueType.TEXT },
		{ fieldName: 'outQty'          ,dataType: ValueType.NUMBER },
		{ fieldName: 'errorWorkQty'    ,dataType: ValueType.NUMBER },
		{ fieldName: 'errorMatQty'     ,dataType: ValueType.NUMBER },
		{ fieldName: '사용구분'         ,dataType: ValueType.TEXT },
		{ fieldName: '최대사용횟수'     ,dataType: ValueType.NUMBER },
		{ fieldName: '사용횟수'     	,dataType: ValueType.NUMBER },
		{ fieldName: '사용완료여부'      ,dataType: ValueType.TEXT },
		{ fieldName: '폐기여부'     	 ,dataType: ValueType.TEXT },
		{ fieldName: 'comments'        ,dataType: ValueType.TEXT },
		{ fieldName: 'inComments'	    ,dataType: ValueType.TEXT },
		{ fieldName: 'editable'        ,dataType: ValueType.TEXT },
		{ fieldName: 'createUser'        ,dataType: ValueType.TEXT },
	],
	columns: [
		{ name:'workDate'        ,fieldName:'workDate'      ,width: '100'  ,header: { text: '작업일' }, editable: false, autoFilter:true, editor: { mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3" },
		{ name:'shiftCode'       ,fieldName:'shiftCode'     ,width: '60'  ,header: { text: '근무조' }, editable: false, autoFilter:true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true }},
		{ name:'outSeq'          ,fieldName:'outSeq'        ,width: '60'  ,header: { text: '투입\n순서', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0' },
		{ name:'outDate'         ,fieldName:'outDate'       ,width: '100'  ,header: { text: '투입일' }, editable: false, autoFilter:true, editor: { mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3" },
		{ name:'outTime'         ,fieldName:'outTime'       ,width: '60'  ,header: { text: '시간' }, editable: false, autoFilter:true, editor: {mask:{editMask:"00:00"}}, "textFormat": "([0-9]{2})([0-9]{2});$1:$2" },
        { name:'materialId'      ,fieldName:'materialId'    ,width: '150' ,header: { text: '자재 ID' }, editable: false, autoFilter:true },        
        { name:'subMatTypeName'  ,fieldName:'subMatTypeName',width: '80'  ,header: { text: '커팅\n구분', styleName:'multiline-header'  }, editable: false, autoFilter:true, autoFilter:true},
		{ name:'workerName'      ,fieldName:'workerName'    ,width: '80' ,header: { text: '작업자' }, editable: false, autoFilter:true }, 
        { name:'useCategory'     ,fieldName:'useCategory'   ,width: '60'  ,header: { text: '투입\n구분', styleName:'multiline-header' }, editable: false, autoFilter:true,  lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },
		{ name:'equipNm'         ,fieldName:'equipNm'       ,width: '100' ,header: { text: '투입설비' }, editable: false, autoFilter:true },        
        { name:'stepNm'          ,fieldName:'stepNm'        ,width: '60' ,header: { text: 'Step' }, editable: false, autoFilter:true },        
        { name:'unit'            ,fieldName:'unit'          ,width: '40'  ,header: { text: '단위' }, editable: false, autoFilter:true, footer: {text:"합계"}  },
        { name:'outQty'          ,fieldName:'outQty'        ,width: '60'  ,header: { text: '투입\n수량' , styleName:'multiline-header'}, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer1"}},
        { name:'errorWorkQty'    ,fieldName:'errorWorkQty'  ,width: '100'  ,header: { text: '작업불량' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr', footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer3"}  },
        { name:'errorMatQty'     ,fieldName:'errorMatQty'   ,width: '100'  ,header: { text: '원자재불량' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr' , footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer4"} },
		{ name:'사용구분'  		  ,fieldName:'사용구분'		 ,width: '80'  ,header: { text: '사용\n구분', styleName:'multiline-header' }, editable: false, autoFilter:true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true }},
		{ name:'최대사용횟수'     ,fieldName:'최대사용횟수'   ,width: '80'  ,header: { text: '최대\n사용횟수', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr'  },
		{ name:'사용횟수'         ,fieldName:'사용횟수'       ,width: '60'  ,header: { text: '사용\n횟수', styleName:'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:'tr'  },		
		{ name:'사용완료여부'     ,fieldName:'사용완료여부'    ,width: '80'  ,header: { text: '사용완료\n여부', styleName:'multiline-header' }, editable: false, autoFilter:true, editor: {type:"dropdown", textReadOnly:true}, lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS },
		{ name:'폐기여부'     	  ,fieldName:'폐기여부'    ,width: '60'  ,header: { text: '폐기\n여부', styleName:'multiline-header' }, editable: false, autoFilter:true, editor: {type:"dropdown", textReadOnly:true}, lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS },
		{ name: 'comments', 	fieldName: 'comments', width: '250', header: { text: '공정 투입' }, styleName:'edit tl', autoFilter:true, renderer: { showTooltip: true } },
		{ name: 'inComments', 	fieldName: 'inComments', width: '250', header: { text: '공정전 입고' }, styleName:'tl', editable: false, autoFilter:true, renderer: { showTooltip: true }   },
	],	

 	layout: [
		'workDate'        ,
		'shiftCode'       ,
		'outSeq'          ,
		'outDate'         ,
		'outTime'         ,
		'materialId'      ,
		'subMatTypeName'  ,
		'workerName'      ,
		'useCategory'     ,
		'equipNm'         ,
		'stepNm'          ,
		'unit'            ,
		'outQty'          ,
		{
			name : "Error",
			direction: "horizontal",
			items: [
				'errorWorkQty',
				'errorMatQty'
			],
			header: {
				text : "Loss 수량"
			}
		},
		'사용구분',
		'최대사용횟수',
		'사용횟수',
		'사용완료여부',
		'폐기여부',
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