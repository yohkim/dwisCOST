/*
* 자재관리 > 부자재 - 필름 > Model별 필름정보
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

		{ fieldName: 'modelCode'		,dataType: ValueType.TEXT },
		{ fieldName: 'division'			,dataType: ValueType.TEXT },
		{ fieldName: 'sdcCode'			,dataType: ValueType.TEXT },
		{ fieldName: 'filmFrontCode'	,dataType: ValueType.TEXT },
		{ fieldName: 'filmBackCode'		,dataType: ValueType.TEXT },	
		{ fieldName: 'createUser'		,dataType: ValueType.TEXT },	
	],
	columns: [
		{ name:'modelCode'		,fieldName:'modelCode'		,width:'100', header:{text:'모델코드' }, editable:false, autoFilter:true, editor: { type:"text", maxLength:7 }},
		{ name:'division'		,fieldName:'division'		,width:'100', header:{text:'구분' }, editable:false, autoFilter:true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true }},
		{ name:'sdcCode'		,fieldName:'sdcCode'		,width:'150', header:{text:'SDC Code' }, editable:true, autoFilter:true, styleName:"edit tc", editor: { type:"text", maxLength:15 }},
		{ name:'filmFrontCode'	,fieldName:'filmFrontCode'	,width:'200', header:{text:'Front ( 하부 )' }, editable:true, autoFilter:true, styleName:"edit tc", editor: { type:"text", maxLength:10 }},
		{ name:'filmBackCode'	,fieldName:'filmBackCode'	,width:'200', header:{text:'Back ( 상부 )' }, editable:true, autoFilter:true, styleName:"edit tc", editor: { type:"text", maxLength:10 }},		
	],

} 

module.exports = grid;