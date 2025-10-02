/*
* 자재관리 > 부자재 - 더미글라스 > 재고현황
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

		{ fieldName: 'subMatTypeCode'		,dataType: ValueType.TEXT },
		{ fieldName: 'subMatTypeName'		,dataType: ValueType.TEXT },
		{ fieldName: 'gubun'			,dataType: ValueType.TEXT },
		{ fieldName: 'sortOrder'		,dataType: ValueType.NUMBER },
		{ fieldName: 'itemOrder'		,dataType: ValueType.NUMBER },
		{ fieldName: 'subItemOrder'		,dataType: ValueType.NUMBER },
		{ fieldName: 'subItemSortOrder'		,dataType: ValueType.NUMBER },
		{ fieldName: 'itemName1'		,dataType: ValueType.TEXT },
		{ fieldName: 'itemName2'		,dataType: ValueType.TEXT },
		{ fieldName: 'itemName3'		,dataType: ValueType.TEXT },
		{ fieldName: 'itemName4'		,dataType: ValueType.TEXT },
		{ fieldName: 'preStock'			,dataType: ValueType.NUMBER },
		{ fieldName: 'dTotal'			,dataType: ValueType.NUMBER },		
	],
	columns: [
		{ name:'subMatTypeName'	,fieldName:'subMatTypeName'	,width:'80', header:{text:'사양' }, editable:false, mergeRule: "value", autoFilter:true},
		{ name:'itemName1'		,fieldName:'itemName1'	,width:'60', header:{text:'구분' }, editable:false, mergeRule: "value"},
		{ name:'itemName2'		,fieldName:'itemName2'	,width:'60', header:{text:'구분' }, editable:false, mergeRule: "values['itemName1'] + value", },
		{ name:'itemName3'		,fieldName:'itemName3'	,width:'80', header:{text:'구분' }, editable:false, mergeRule: "values['itemName1'] + values['itemName2'] + value",},
		{ name:'itemName4'		,fieldName:'itemName4'	,width:'100', header:{text:'구분' }, editable:false,},
		{ name:'preStock'		,fieldName:'preStock'	,width:'60', header:{text:'이월' }, editable:false,numberFormat: '#,##0', styleName:"tr"},
		{ name:'dTotal'			,fieldName:'dTotal'		,width:'60', header:{text:'Total' }, editable:false,numberFormat: '#,##0', styleName:"tr"},	
	],

	layout: [
		'subMatTypeName',
		{
			name : "itemName",
			direction: "horizontal",
			hideChildHeaders: true,
			items: [
				'itemName1',
				'itemName2',
				'itemName3',
				'itemName4'
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
			let itemName1 = grid.getValue(itemIndex, "itemName1");
			let itemName2 = grid.getValue(itemIndex, "itemName2");
			let subMatTypeName = grid.getValue(itemIndex, "subMatTypeName");
			let dTotal = grid.getValue(itemIndex, "dTotal");
			let nextIemName1 = grid.getValue(itemIndex+1, "itemName1");
			if ( itemName1 === "입고") {
				return 4;
			}
			else if ( itemName1 === "투입" )  {
				if ( subMatTypeName === "Total" || ( itemName2 === "Total" && dTotal === 0 )) 
					return 4;
				else 
					return 1;
			}
			else if ( itemName1 === "Loss")  {

				if ( subMatTypeName === "Total" ||( itemName2 === "Total" &&  nextIemName1 !== "Loss" ) )  
					return 4;
				else {				
					return 2;				
				}
				
			}
			else if ( itemName1 === "재고")  {
				return 3;
			}
			return 1;
		};

		gridView.layoutByColumn("itemName2").spanCallback = function (grid, layout, itemIndex) {
			let itemName2 = grid.getValue(itemIndex, "itemName2");

			if ( itemName2 === 'Total')  {
				return 3;
			}

			return 1;
		};		
	}		
} 

module.exports = grid;