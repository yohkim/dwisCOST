/*
* 프로세스 플래닝 > 생산 공정 관리 - 제품 공정 마스터
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const grid = {
	
	options: {
		checkBar: { visible: true },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
		},
		edit: { editable: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: {visible: false},
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: false },
		rowIndicator: { visible : false},
		sorting: {enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'line'        ,	dataType: ValueType.TEXT },		
		{ fieldName: 'prodCode'    , 	dataType: ValueType.TEXT },		
		{ fieldName: 'model'       ,	dataType: ValueType.TEXT },
		{ fieldName: 'modelName'   ,	dataType: ValueType.TEXT },
		{ fieldName: 'inch'     	,	dataType: ValueType.NUMBER },
		{ fieldName: 'glassThick'   ,	dataType: ValueType.TEXT },
		{ fieldName: 'prodVersion'    ,	dataType: ValueType.TEXT },	
		{ fieldName: 'sheet'       ,	dataType: ValueType.NUMBER },
		{ fieldName: 'block'       ,	dataType: ValueType.NUMBER },
		{ fieldName: 'runSize'     ,	dataType: ValueType.NUMBER },
		{ fieldName: 'spec'     	,	dataType: ValueType.TEXT },
		{ fieldName: 'processId'   ,	dataType: ValueType.TEXT },
		{ fieldName: 'version'     ,	dataType: ValueType.NUMBER },
		{ fieldName: 'createDate'  , 	dataType: ValueType.DATE },
		{ fieldName: 'createName'  ,	dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'line'        ,fieldName: 'line'         ,width: '70', header: { text: 'Line' }, autoFilter:true, editable: true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },		
		{ name: 'prodCode'    ,fieldName: 'prodCode'    ,width: '70', header: { text: '제품코드' }, autoFilter:true, editable: false },
		{ name: 'model'       ,fieldName: 'model'        ,width: '70', header: { text: 'Model' }, autoFilter:true, editable: false},
		{ name: 'modelName'   ,fieldName: 'modelName'    ,width: '200', header: { text: 'Model명' }, autoFilter:true, editable: false},
		{ name: 'inch'    	  ,fieldName: 'inch'    	,width: '70', header: { text: '제품Inch' }, autoFilter:true, editable: false },
		{ name: 'glassThick'   ,fieldName: 'glassThick'   ,width: '70', header: { text: 'GLASS두께' }, autoFilter:true, editable: false },
		{ name: 'prodVersion'  ,fieldName: 'prodVersion'   ,width: '70', header: { text: '제품버전' }, autoFilter:true, editable: false },
		{ name: 'sheet'       ,fieldName: 'sheet'   	,width: '60', header: { text: 'sheet' }, autoFilter:true, editable: false, numberFormat: '#,##0' },
		{ name: 'block'       ,fieldName: 'block'   	,width: '60', header: { text: 'block' }, autoFilter:true, editable: false, numberFormat: '#,##0' },
		{ name: 'runSize'      ,fieldName: 'runSize'   	,width: '60', header: { text: 'Run Size' }, autoFilter:true, editable: false, numberFormat: '#,##0' },
		{ name: 'spec'     		,fieldName: 'spec'     ,width: '180', header: { text: '제품규격' }, autoFilter:true, editable: false },
		{ name: 'processId'   ,fieldName: 'processId'   ,width: '100', header: { text: 'Process ID' }, autoFilter:true, editable: false, autoFilter:true },
		{ name: 'version'     ,fieldName: 'version'      ,width: '70', header: { text: 'Version' }, autoFilter:true, editable: false, numberFormat: '#,##0' },
		{ name: 'createDate'  ,fieldName: 'createDate'  ,width: '80', header: { text: '등록일' }, autoFilter:true, editable: false, datetimeFormat: "yyyy-MM-dd" },
		{ name: 'createName'  ,fieldName: 'createName'  ,width: '80', header: { text: '등록자' }, autoFilter:true, editable: false },	
	],
}

module.exports = grid;