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
			fitStyle: GridFitStyle.EVEN_FILL,
			rowHoverType: RowMaskType.ROW,
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
		{ fieldName: 'line'			,dataType: ValueType.TEXT },	
		{ fieldName: 'stepCode'		,dataType: ValueType.TEXT },	
		{ fieldName: 'equipNo'		,dataType: ValueType.TEXT },	
		{ fieldName: 'equipName'	,dataType: ValueType.TEXT },	
		{ fieldName: 'version'		,dataType: ValueType.TEXT },		
		{ fieldName: 'applyDate'	,dataType: ValueType.TEXT },	
		{ fieldName: 'model'		,dataType: ValueType.TEXT },	
		{ fieldName: 'stepName'		,dataType: ValueType.TEXT },
		{ fieldName: 'useCategory'	,dataType: ValueType.TEXT },	
		{ fieldName: 'useCategoryName'	,dataType: ValueType.TEXT },
		{ fieldName: 'mst'			,dataType: ValueType.NUMBER },			
		{ fieldName: 'workerName'	,dataType: ValueType.TEXT },
		{ fieldName: 'comments'		,dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'stepName'		,fieldName:'stepName'		,width: '80', header: { text: 'Step' }, styleName:"tc", editable: false, autoFilter:true },
		{ name: 'equipName'		,fieldName:'equipName'		,width: '120', header: { text: '설비' }, styleName:"tc",editable: false,autoFilter:true },				
		{ name: 'applyDate'		,fieldName:'applyDate'		,width: '100', header: { text: '적용일시' }, styleName:"tc",editable: false, autoFilter:true },
		{ name: 'model'			,fieldName:'model'		,width: '80', header: { text: '모델' }, styleName:"tc",editable: false, autoFilter:true },
		{ name: 'useCategoryName',fieldName:'useCategoryName'		,width: '80', header: { text: '양산/개발' }, styleName:"tc",editable: false, autoFilter:true },		
		{ name: 'mst'			,fieldName:'mst'		,width: '80', header: { text: 'MST' }, styleName:"tc",editable: false, autoFilter:true },
		{ name: 'workerName'	,fieldName:'workerName'		,width: '80', header: { text: '작업자' }, styleName:"tc",editable: false, autoFilter:true },
		{ name: 'comments'		,fieldName:'comments'		,width: '150', header: { text: '비고' }, styleName:"tl",editable: false, autoFilter:true },

	],
}

module.exports = grid;
