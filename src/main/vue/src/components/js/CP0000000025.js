/*
*  설비별 MST 정보 찾기 
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: true,exclusive:true },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.NONE,
			rowHoverType: RowMaskType.ROW
		},
		edit: { editable: false },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: false },
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'offCategoryCode',dataType: ValueType.TEXT },	
		{ fieldName: 'offCategoryName',dataType: ValueType.TEXT },	
		{ fieldName: 'subCategoryCode',dataType: ValueType.TEXT },	
		{ fieldName: 'subCategoryName',dataType: ValueType.TEXT },			
		{ fieldName: 'offCode'		,dataType: ValueType.TEXT },			
		{ fieldName: 'offName'		,dataType: ValueType.TEXT },		
		{ fieldName: 'offGubunCode'	,dataType: ValueType.TEXT },		
		{ fieldName: 'offGubunName'	,dataType: ValueType.TEXT },		
		{ fieldName: 'itemOrder'	,dataType: ValueType.INT },		
		{ fieldName: 'useYn'		,dataType: ValueType.TEXT },
		{ fieldName: 'comments'		,dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'offCategoryName',fieldName:'offCategoryName',width: '150', header: { text: '대분류' }, styleName:"tc", editable: false,  mergeRule: "value", autoFilter:true },
		{ name: 'subCategoryName',fieldName:'subCategoryName',width: '200', header: { text: '중분류' }, styleName:"tc", editable: false,  mergeRule: "value", autoFilter:true },
		{ name: 'offName'		,fieldName:'offName'		,width: '200', header: { text: '비가동 항목' }, styleName:"tc", editable: false, autoFilter:true },
		{ name: 'offGubunName'	,fieldName:'offGubunName'	,width: '130', header: { text: '구분' }, styleName:"tc", editable: false, autoFilter:true },
		{ name: 'useYn'			,fieldName:'useYn'			,width: '100', header: { text: '사용여부' }, styleName:"tc", editable: false, autoFilter:true },
		{ name: 'comments'		,fieldName:'comments'		,width: '500', header: { text: '비고' }, styleName:"tl",editable: false, autoFilter:true, }
	],
}

module.exports = grid;
