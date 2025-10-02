/*
* 자재관리 > 부자재 - 레진 > 재고현황
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.BLOCK,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.NONE,
			rowHoverType: RowMaskType.ROW
		},
		edit: { editable: false },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		fixed: { colBarWidth: 1, colCount: 4 },
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
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [

		{ fieldName: 'subMatTypeCode',dataType: ValueType.TEXT },
		{ fieldName: 'subMatTypeName'	,dataType: ValueType.TEXT },
		{ fieldName: 'gubun'			,dataType: ValueType.TEXT },
		{ fieldName: 'sortOrder'		,dataType: ValueType.NUMBER },
		{ fieldName: 'itemOrder'		,dataType: ValueType.NUMBER },
		{ fieldName: 'itemName1'		,dataType: ValueType.TEXT },
		{ fieldName: 'itemName2'		,dataType: ValueType.TEXT },
		{ fieldName: 'preStock'			,dataType: ValueType.NUMBER },
		{ fieldName: 'dTotal'			,dataType: ValueType.NUMBER },		
	],
	columns: [
		{ name:'subMatTypeName'	,fieldName:'subMatTypeName'	,width:'80', header:{text:'사양' }, editable:false, mergeRule: "value", autoFilter:true},
		{ name:'itemName1'		,fieldName:'itemName1'		,width:'80', header:{text:'구분' }, editable:false, mergeRule: "value"},
		{ name:'itemName2'		,fieldName:'itemName2'		,width:'80', header:{text:'분류' }, editable:false, mergeRule: "value"},
		{ name:'preStock'		,fieldName:'preStock'		,width:'60', header:{text:'이월' }, editable:false,numberFormat: '#,##0', styleName:"tr"},
		{ name:'dTotal'			,fieldName:'dTotal'			,width:'60', header:{text:'Total' }, editable:false,numberFormat: '#,##0', styleName:"tr"},	
	],

	layout: [
		'subMatTypeName',
		{
			name : "itemName",
			direction: "horizontal",
			hideChildHeaders: true,
			items: [
				'itemName1',
				'itemName2'
			],
			header: {
				text : "구분"
			}
		},
		'preStock',
		'dTotal',
	],
	
	applySpanCallback(gridView) {
		gridView.layoutByColumn("itemName1").spanCallback = function (grid, layout, itemIndex) {
			let value = grid.getValue(itemIndex, "itemName1");
			if ( value === "입고") {
				return 2;
			}
			return 1;
		};
	}

} 

module.exports = grid;