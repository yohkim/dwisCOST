/*
* 자재관리 > 부자재 - Tray > TrayCode별 Model정보
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

		{ fieldName: 'trayCode'		,dataType: ValueType.TEXT },
		{ fieldName: 'model'		,dataType: ValueType.TEXT },
		{ fieldName: 'createUserId'	,dataType: ValueType.TEXT },
	],
	columns: [
		{ name:'trayCode'	,fieldName:'trayCode'	,width:'200', header:{text:'Tray 코드' }, editable:false, autoFilter:true, editor: { type:"text", maxLength:10 }},
		{ name:'model'		,fieldName:'model'		,width:'300', header:{text:'모델' }, editable:true, autoFilter:true },		
	],

} 

module.exports = grid;