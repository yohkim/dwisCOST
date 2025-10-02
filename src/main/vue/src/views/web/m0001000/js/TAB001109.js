/*
* 포장재 > 공정전 입고
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
		{ fieldName: 'inNo'   ,dataType: ValueType.TEXT },
		{ fieldName: 'matCategoryCode'  ,dataType: ValueType.TEXT },
		{ fieldName: 'matCategoryName'  ,dataType: ValueType.TEXT },		
		{ fieldName: 'matTypeCode'		,dataType: ValueType.TEXT },
		{ fieldName: 'matTypeName'		,dataType: ValueType.TEXT },
		{ fieldName: 'inDate'       ,dataType: ValueType.TEXT },
		{ fieldName: 'inTime'       ,dataType: ValueType.TEXT },		
		{ fieldName: 'unit'         ,dataType: ValueType.TEXT },
		{ fieldName: 'inQty'        ,dataType: ValueType.NUMBER },
		{ fieldName: 'useQty'       ,dataType: ValueType.NUMBER },
		{ fieldName: 'remainQty'    ,dataType: ValueType.NUMBER},
		{ fieldName: 'useYn'        ,dataType: ValueType.TEXT },
		{ fieldName: 'workerId'     ,dataType: ValueType.TEXT },
		{ fieldName: 'workerName'   ,dataType: ValueType.TEXT },
		{ fieldName: 'comments'     ,dataType: ValueType.TEXT },
		{ fieldName: 'createUser'	,dataType: ValueType.TEXT },	
		{ fieldName: 'editable'     ,dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'inNo'				,fieldName:'inNo'			,width: '120', header: { text: '입고번호' }, editable: false, autoFilter:true },		
		{ name: 'inDate' 			,fieldName:'inDate' 		,width: '80', header: { text: '입고일' }, editable: true, autoFilter:true, editor: { mask:{editMask:"0000-00-00"}}, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3"},
		{ name: 'inTime'			,fieldName:'inTime'			,width: '60', header: { text:'시간' }, editable: false, autoFilter:true, editor: {mask:{editMask:"00:00"}}, "textFormat": "([0-9]{2})([0-9]{2});$1:$2"},				
		{ name: 'matCategoryName'	,fieldName:'matCategoryName',width: '100', header: { text: '자재분류' }, editable: false, autoFilter:true },
		{ name: 'matTypeName'		,fieldName:'matTypeName'	,width: '100', header: { text: '품명' }, editable: false, autoFilter:true },
		{ name: 'unit'				,fieldName:'unit'			,width: '60', header: { text: '단위' }, editable: false, autoFilter:true, footer: {text:"합계"}  },
		{ name: 'inQty' 			,fieldName:'inQty' 			,width: '60', header: { text:'입고\n수량', styleName: 'multiline-header' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:"tr", footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer1"}  },
		{ name: 'remainQty' 		,fieldName:'remainQty' 		,width: '60', header: { text:'잔량' }, editable: false, autoFilter:true, numberFormat: '#,##0', styleName:"tr", footer:{expression:"sum", numberFormat: "#,##0", styleName:"sum-footer2"} },
		{ name: 'useYn' 			,fieldName:'useYn' 			,width: '80', header: { text: '사용\n여부', styleName: 'multiline-header' }, editable: false, autoFilter:true },	
		{ name: 'workerName' 		,fieldName:'workerName' 	,width: '80', header: { text:'담당자' }, editable: false, autoFilter:true  },
		{ name: 'comments' 			,fieldName:'comments' 		,width: '300', header: { text: '비고' }, editable: true, autoFilter:true },	
	],	
}

module.exports = grid;