/*
* 설비관리 > 설비 기준정보 > 설비 기준 mst
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
		editorOptions: { crossWhenExitLast : true},
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: false },
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
		{ fieldName: 'line'			,dataType: ValueType.TEXT },	
		{ fieldName: 'stepCode'		,dataType: ValueType.TEXT },	
		{ fieldName: 'equipNo'		,dataType: ValueType.TEXT },
		{ fieldName: 'equipName'	,dataType: ValueType.TEXT },		
		{ fieldName: 'applyDate'	,dataType: ValueType.TEXT },	
		{ fieldName: 'model'		,dataType: ValueType.TEXT },
		{ fieldName: 'stepName'		,dataType: ValueType.TEXT },
		{ fieldName: 'useCategory'	,dataType: ValueType.TEXT },
		{ fieldName: 'mst'			,dataType: ValueType.NUMBER },			
		{ fieldName: 'workerName'	,dataType: ValueType.TEXT },
		{ fieldName: 'comments'		,dataType: ValueType.TEXT },
		{ fieldName: 'workerId' 	,dataType: ValueType.TEXT },
		{ fieldName: 'editable' 	,dataType: ValueType.TEXT },
	],
	columns: [		
		{ name: 'stepName'		,fieldName:'stepName'		,width: '100', header: { text: 'Step' }, styleName:"tc", editable: false, autoFilter:true },
		{ name: 'equipName'		,fieldName:'equipName'		,width: '100', header: { text: '설비' }, styleName:"tc",editable: false,autoFilter:true },				
		{ name: 'applyDate'     ,fieldName:'applyDate'      ,width: '100',	header: { text: '적용일자' }, styleName:"edit tc",editable: true, autoFilter:true, datetimeFormat:"yyyy-MM-dd",
																			editor: { type:'date', datetimeFormat:"yyyy-MM-dd",  dropDownWhenClick: true, textReadOnly: true }},																
		{ name: 'model'			,fieldName:'model'			,width: '100', header: { text: '모델' }, styleName:"edit tc",editable: true,autoFilter:true },															
		{ name: 'useCategory'   ,fieldName:'useCategory'    ,width: '80'  ,header: { text: '양산/개발' },styleName:"edit tc", editable: true, autoFilter:true,  lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },
		{ name: 'mst'			,fieldName:'mst'			,width: '80', header: { text: 'MST' }, styleName:"edit tr",editable: true, autoFilter:true, numberFormat: '#,##0.0' },		
		{ name: 'workerName'	,fieldName:'workerName'		,width: '100', header: { text: '작업자' }, styleName:"tc",editable: false,autoFilter:true },	
		{ name: 'comments'		,fieldName:'comments'		,width: '500', header: { text: '비고' }, styleName:"edit tl", editable: true, autoFilter:true },	
	],	
}

module.exports = grid;