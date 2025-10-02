/*
* 설비관리 > 설비효율 report
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
		fixed: { colBarWidth: 1, colCount: 3 },
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
		rowIndicator: { visible: false },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'line'			,dataType: ValueType.TEXT },	
		{ fieldName: 'stepCode'		,dataType: ValueType.TEXT },			
		{ fieldName: 'equipNo'		,dataType: ValueType.TEXT },	
		{ fieldName: 'stepName'		,dataType: ValueType.TEXT },	
		{ fieldName: 'equipName'	,dataType: ValueType.TEXT },					
		{ fieldName: 'item'			,dataType: ValueType.TEXT },
		{ fieldName: 'itemName'		,dataType: ValueType.TEXT },
		{ fieldName: 'subName'		,dataType: ValueType.TEXT },
		{ fieldName: 'itemOrder'	,dataType: ValueType.INT },
		{ fieldName: 'subOrder'	,dataType: ValueType.INT }
	],

	columns: [	
		{ name:'stepName' ,fieldName:'stepName' ,width:'60', header:{text:'Step' }, editable:false, mergeRule: "value", autoFilter:true},
		{ name:'equipName' ,fieldName:'equipName' ,width:'80', header:{text:'설비' }, editable:false, mergeRule: "values['stepName'] + value", autoFilter:true},
		{ name:'itemName' ,fieldName:'itemName' ,width:'150', header:{text:'구분' }, editable:false, mergeRule: "values['stepName'] + values['equipName'] + value", autoFilter:true},
		{ name:'subName' ,fieldName:'subName' ,width:'110', header:{text:'항목' }, editable:false, mergeRule: "values['stepName'] + values['equipName'] + values['itemName'] + value", autoFilter:true},
	],	

	layout: [
		'stepName',
		'equipName',
		{
			name : "itemName",
			direction: "horizontal",
			hideChildHeaders: true,
			items: [
				'itemName',
				'subName'
			],
			header: {
				text : "구분"
			}
		},
	],	
}

module.exports = grid;