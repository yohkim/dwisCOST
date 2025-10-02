/*
* 자재관리 > 부자재 - Tray > 재고실사
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
		//fixed: { colBarWidth: 1, colCount: 4 },
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
		{ fieldName: 'stockDate'  		,dataType: ValueType.TEXT },
		{ fieldName: 'materialId'		,dataType: ValueType.TEXT },
		{ fieldName: 'subMatTypeCode'	,dataType: ValueType.TEXT },
		{ fieldName: 'subMatTypeName'	,dataType: ValueType.TEXT },
		{ fieldName: 'model'			,dataType: ValueType.TEXT },		
		{ fieldName: 'unit'				,dataType: ValueType.TEXT },
		{ fieldName: 'prevStockQty'		,dataType: ValueType.NUMBER },
		{ fieldName: 'prevRealStockQty'	,dataType: ValueType.NUMBER },
		{ fieldName: 'inQty'			,dataType: ValueType.NUMBER },
		{ fieldName: 'outQty'			,dataType: ValueType.NUMBER },
		{ fieldName: 'useQty'			,dataType: ValueType.NUMBER },
		{ fieldName: 'errorQty'			,dataType: ValueType.NUMBER },
		{ fieldName: 'stockQty'			,dataType: ValueType.NUMBER },
		{ fieldName: 'realStockQty'		,dataType: ValueType.NUMBER },
		{ fieldName: 'diffQty'			,dataType: ValueType.NUMBER },
		{ fieldName: 'confirmYn'		,dataType: ValueType.TEXT },
		{ fieldName: 'chargerName'		,dataType: ValueType.TEXT },
		{ fieldName: 'comments'			,dataType: ValueType.TEXT },
		{ fieldName: 'editable'			,dataType: ValueType.TEXT },
	],
	columns: [
		{ name:'stockDate'  		,fieldName:'stockDate'  		,width:'100', header:{text:'재고일' }, editable:false, autoFilter:true, "textFormat": "([0-9]{4})([0-9]{2})([0-9]{2});$1-$2-$3" },						
		{ name:'materialId'			,fieldName:'materialId'			,width:'280', header:{text:'자재ID' }, editable:false, autoFilter:true},
		{ name:'subMatTypeName'		,fieldName:'subMatTypeName'		,width:'60', header:{text:'자재\n종류', styleName: 'multiline-header' }, editable:false, autoFilter:true},
		{ name:'model'				,fieldName:'model'				,width:'100', header:{text:'모델' }, editable:false, autoFilter:true},
		{ name:'unit'				,fieldName:'unit'				,width:'40', header:{text:'단위' }, editable:false, autoFilter:true},		
		{ name:'prevStockQty'		,fieldName:'prevStockQty'		,width:'60', header:{text:'전일\n재고', styleName: 'multiline-header' }, editable:false, autoFilter:true,numberFormat: '#,##0', styleName:"tr"},
		{ name:'prevRealStockQty'	,fieldName:'prevRealStockQty'	,width:'60', header:{text:'전일\n실재고', styleName: 'multiline-header' }, editable:false, autoFilter:true,numberFormat: '#,##0', styleName:"tr"},
		{ name:'inQty'				,fieldName:'inQty'				,width:'60', header:{text:'입고\n수량', styleName: 'multiline-header' }, editable:false, autoFilter:true,numberFormat: '#,##0', styleName:"tr"},
		{ name:'outQty'				,fieldName:'outQty'				,width:'60', header:{text:'투입\n수량', styleName: 'multiline-header' }, editable:false, autoFilter:true,numberFormat: '#,##0', styleName:"tr"},
		{ name:'useQty'				,fieldName:'useQty'				,width:'60', header:{text:'사용\n수량', styleName: 'multiline-header' }, editable:false, autoFilter:true,numberFormat: '#,##0', styleName:"tr"},
		{ name:'errorQty'			,fieldName:'errorQty'			,width:'60', header:{text:'불량\n수량', styleName: 'multiline-header' }, editable:false, autoFilter:true,numberFormat: '#,##0', styleName:"tr"},
		{ name:'stockQty'			,fieldName:'stockQty'			,width:'60', header:{text:'재고\n수량', styleName: 'multiline-header' }, editable:false, autoFilter:true,numberFormat: '#,##0', styleName:"tr"},
		{ name:'realStockQty'		,fieldName:'realStockQty'		,width:'60', header:{text:'실재고\n수량', styleName: 'multiline-header' }, editable:false, autoFilter:true,numberFormat: '#,##0', styleName:"tr"},
		{ name:'diffQty'			,fieldName:'diffQty'			,width:'60', header:{text:'차이\n수량', styleName: 'multiline-header' }, editable:false, autoFilter:true,numberFormat: '#,##0', styleName:"tr"},
		{ name:'confirmYn'			,fieldName:'confirmYn'			,width:'60', header:{text:'재고\n확인', styleName: 'multiline-header' }, editable:false, autoFilter:true, editor: {type:"dropdown", textReadOnly:true}, lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS },
		{ name:'chargeName'			,fieldName:'chargerName'		,width:'80', header:{text:'담당자' }, editable:false, autoFilter:true},
		{ name:'comments'			,fieldName:'comments'			,width:'300', header:{text:'비고' }, editable:false, autoFilter:true},
	],	
}

module.exports = grid;