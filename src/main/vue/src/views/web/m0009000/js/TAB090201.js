/*
* 설비관리 > 설비 비가동 관리
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
		{ fieldName: 'offStartTime'	,dataType: ValueType.TEXT },
		{ fieldName: 'stepName'		,dataType: ValueType.TEXT },		
		{ fieldName: 'offEndTime'	,dataType: ValueType.TEXT },
		{ fieldName: 'offTime'		,dataType: ValueType.INT },		
		{ fieldName: 'finishYn'		,dataType: ValueType.TEXT },	
		{ fieldName: 'offCategoryCode',dataType: ValueType.TEXT },	
		{ fieldName: 'offCategoryName',dataType: ValueType.TEXT },	
		{ fieldName: 'subCategoryCode',dataType: ValueType.TEXT },	
		{ fieldName: 'subCategoryName',dataType: ValueType.TEXT },			
		{ fieldName: 'offCode'		,dataType: ValueType.TEXT },
		{ fieldName: 'offName'		,dataType: ValueType.TEXT },
		{ fieldName: 'workerName'	,dataType: ValueType.TEXT },
		{ fieldName: 'comments'		,dataType: ValueType.TEXT },
		{ fieldName: 'workerId' 	,dataType: ValueType.TEXT },
		{ fieldName: 'editable' 	,dataType: ValueType.TEXT },
	],
	columns: [		
		{ name: 'stepName'		,fieldName:'stepName'		,width: '100', header: { text: 'Step' }, styleName:"tc", editable: false, autoFilter:true },
		{ name: 'equipName'		,fieldName:'equipName'		,width: '100', header: { text: '설비' }, styleName:"tc",editable: false,autoFilter:true },	
		{ name: 'offCategoryName',fieldName:'offCategoryName',width: '120', header: { text: '대분류' }, styleName:"edit tc",editable: true,autoFilter:true },
		{ name: 'subCategoryName',fieldName:'subCategoryName',width: '120', header: { text: '중분류' }, styleName:"edit tc",editable: true,autoFilter:true },
		{ name: 'offName'		,fieldName:'offName'		,width: '120', header: { text: '비가동 항목' }, styleName:"edit tc",editable: true,autoFilter:true },
		{ name: 'offStartTime'  ,fieldName:'offStartTime'   ,width: '150',	header: { text: '시작 시간' }, styleName:"tc",editable: false, autoFilter:true,  		
																				datetimeFormat: "yyyy-MM-dd HH:mm",
																				 editor: { type:'date', timeSelectType: "minute", datetimeFormat:"yyyy-MM-dd HH:mm",
																 		 		 		 dropDownWhenClick: true, textReadOnly: true  },
 																			},
      { name: 'offEndTime'     ,fieldName:'offEndTime'      ,width: '150',	header: { text: '종료 시간' }, styleName:"edit tc",editable: true, autoFilter:true, 
	  																		datetimeFormat: "yyyy-MM-dd HH:mm",
																		    editor: { type:'date', timeSelectType: "minute", datetimeFormat:"yyyy-MM-dd HH:mm",
																					  dropDownWhenClick: true, textReadOnly: true },
																			},		
		{ name: 'offTime',fieldName:'offTime'    ,width: '80'  ,header: { text: '소요시간(분)' },styleName:"tc", editable: false, autoFilter:true },		
		{ name: 'workerName'	,fieldName:'workerName'		,width: '100', header: { text: '작업자' }, styleName:"tc",editable: false,autoFilter:true },	
		{ name: 'comments'		,fieldName:'comments'		,width: '500', header: { text: '비고' }, styleName:"edit tl", editable: true, autoFilter:true },	
	],	

	layout: [
			'stepName'	,
			'equipName'	,
			{
				name : "offInfo",
				direction: "horizontal",
				items: [
					'offCategoryName' ,
					'subCategoryName' ,
					'offName' ,
					'offStartTime' ,
					'offEndTime' ,
					'offTime'
				],
				header: {
					text : "비가동 정보"
				}
			},	
			'workerName' ,
			'comments'
		]	
}

module.exports = grid;