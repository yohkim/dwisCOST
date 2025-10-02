/*
* 설비관리 > 설비 기준정보 > 비가동 항목정보
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
			rowHoverType: RowMaskType.ROW,
			//rowHeight: 40
		},
		edit: { editable: true },
		editorOptions: { crossWhenExitLast : true, tabMove:true},
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
		{ fieldName: 'displayOffCategoryCode',dataType: ValueType.TEXT },	
		{ fieldName: 'offCategoryCode',dataType: ValueType.TEXT },	
		{ fieldName: 'displaySubCategoryCode',dataType: ValueType.TEXT },	
		{ fieldName: 'subCategoryCode',dataType: ValueType.TEXT },	
		{ fieldName: 'offCode'		,dataType: ValueType.TEXT },			
		{ fieldName: 'offName'		,dataType: ValueType.TEXT },		
		{ fieldName: 'offGubunCode'	,dataType: ValueType.TEXT },		
		{ fieldName: 'itemOrder'	,dataType: ValueType.INT },		
		{ fieldName: 'useYn'		,dataType: ValueType.TEXT },
		{ fieldName: 'comments'		,dataType: ValueType.TEXT },
		{ fieldName: 'workerId' 	,dataType: ValueType.TEXT },
		{ fieldName: 'editable' 	,dataType: ValueType.TEXT },
	],
	columns: [		
		{ name: 'displayOffCategoryCode', fieldName:'displayOffCategoryCode', width: '100'  ,header: { text: '대분류\n코드', styleName:"multiline-header" },styleName:"tc", editable: false, autoFilter:true },
		{ name: 'offCategoryCode',fieldName:'offCategoryCode',width: '120'  ,header: { text: '대분류명' },styleName:"edit tc ", editable: false, autoFilter:true,  lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },
		{ name: 'displaySubCategoryCode', fieldName:'displaySubCategoryCode', width: '100'  ,header: { text: '중분류\n코드', styleName:"multiline-header" },styleName:"tc", editable: false, autoFilter:true },
		{ name: 'subCategoryCode',fieldName:'subCategoryCode',width: '150'  ,header: { text: '중분류명' },styleName:"edit tc", editable: false, autoFilter:true,  lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },
		{ name: 'offCode'		,fieldName:'offCode'		,width: '100', header: { text: '비가동\n항목코드', styleName:"multiline-header" }, styleName:"edit tc", editable: false, autoFilter:true,
			editor: { type:"text", maxLength:5,  inputValidator: function(char, text) {
												return /^[a-zA-Z0-9]$/.test(char);
												} }
		},
		{ name: 'offName'		,fieldName:'offName'		,width: '150', header: { text: '비가동\n항목명', styleName:"multiline-header" }, styleName:"edit tc", editable: true, autoFilter:true },		
		{ name: 'offGubunCode'  ,fieldName:'offGubunCode'   ,width: '100'  ,header: { text: '분류' }, styleName:"edit tc", editable: true, autoFilter:true,  lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },		
		{ name: 'itemOrder'		,fieldName:'itemOrder'		,width: '80', header: { text: '순서' }, styleName:"edit tr", editable: true},		
		{ name: 'useYn'		    ,fieldName: 'useYn'			,width: '60', header: { text: '사용\n여부', styleName:"multiline-header" }, styleName:"edit tc", autoFilter:true, lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS, editor: { type:"dropdown", dropDownCount:2, textReadOnly:true } },		
		{ name: 'comments'		,fieldName:'comments'	    ,width: '800', header: { text: '비고' }, styleName:"edit tl", editable: true, autoFilter:true, editor: { type: "multiline" } },	
	],	
}

module.exports = grid;