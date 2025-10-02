/*
* 자재관리 > 포장재 - 품목관리
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
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: { },
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
		{ fieldName: 'matCategoryCode'	,dataType: ValueType.TEXT },
		{ fieldName: 'matCategoryName'	,dataType: ValueType.TEXT },
		{ fieldName: 'matTypeCode'		,dataType: ValueType.TEXT },
		{ fieldName: 'matTypeName'		,dataType: ValueType.TEXT },	
		{ fieldName: 'unitCode'			,dataType: ValueType.TEXT },
		{ fieldName: 'unit'				,dataType: ValueType.TEXT },
		{ fieldName: 'etcYn'  			,dataType: ValueType.TEXT },
		{ fieldName: 'editable'  		,dataType: ValueType.TEXT },
		{ fieldName: 'createUser'		,dataType: ValueType.TEXT },
			
	],
	columns: [		
		{ name:'matCategoryCode',fieldName:'matCategoryCode',width:'100', header:{text:'자재분류명' }, editable:false, autoFilter:true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true }},
		{ name:'matTypeCode' 	,fieldName:'matTypeCode'	,width:'100', header:{text:'품목 코드' }, editable:false, autoFilter:true, editor: { type:"text", maxLength:10 }},
		{ name:'matTypeName' 	,fieldName:'matTypeName'	,width:'100', header:{text:'품목명' }, editable:false, autoFilter:true, editor: { type:"text", maxLength:20 }},		
		{ name:'unitCode' 		,fieldName:'unitCode'		,width:'100', header:{text:'단위코드' }, editable:false, autoFilter:true, editor: { type:"text", maxLength:2 }},
		{ name:'unit' 			,fieldName:'unit'			,width:'100', header:{text:'단위' }, editable:false, autoFilter:true, editor: { type:"text", maxLength:10 }}		
		
	],

} 

module.exports = grid;