/*
* 프로세스 플래닝 > 제품 모델 관리 - 제품마스터
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const USE_YN_LABELS = ["Y", "N"];
const USE_YN_VALUE = ["Y", "N"];

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
		{ fieldName: 'line'			,dataType: ValueType.TEXT },
		{ fieldName: 'prodCode'		,dataType: ValueType.TEXT },
		{ fieldName: 'model'		,dataType: ValueType.TEXT },
		{ fieldName: 'modelName'	,dataType: ValueType.TEXT },
		{ fieldName: 'inch'			,dataType: ValueType.NUMBER },
		{ fieldName: 'glassThick'	,dataType: ValueType.TEXT },
		{ fieldName: 'version'		,dataType: ValueType.TEXT },		
		{ fieldName: 'spec'			,dataType: ValueType.TEXT },
		{ fieldName: 'unit'			,dataType: ValueType.TEXT },
		{ fieldName: 'unitCode'		,dataType: ValueType.TEXT },
		{ fieldName: 'customerCode' ,dataType: ValueType.TEXT },
		{ fieldName: 'customerName' ,dataType: ValueType.TEXT },
		{ fieldName: 'sheet'		,dataType: ValueType.NUMBER },
		{ fieldName: 'block'		,dataType: ValueType.NUMBER },
		{ fieldName: 'cell'			,dataType: ValueType.NUMBER },
		{ fieldName: 'runSize' 		,dataType: ValueType.NUMBER },
		{ fieldName: 'massProd'		,dataType: ValueType.TEXT },
		{ fieldName: 'note'			,dataType: ValueType.TEXT },
		{ fieldName: 'createDate'	,dataType: ValueType.DATE },
		{ fieldName: 'createName'	,dataType: ValueType.TEXT }
	],
	columns: [
		{ name: 'line' 			,fieldName:'line' 			 ,width: '60', header: { text: 'Line' }, autoFilter:true, editable:false, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true }},	
		{ name: 'prodCode'		,fieldName:'prodCode'		 ,width: '70', header: { text:'제품코드' }, autoFilter:true, editable: false, editor: { type:"text", maxLength:7 }  },
		{ name: 'model'			,fieldName:'model'			 ,width: '60', header: { text: 'Model' }, autoFilter:true, editable: false },
		{ name: 'modelName'		,fieldName:'modelName'		 ,width: '120', header: { text: 'Model명' }, autoFilter:true, editable: false },
		{ name: 'inch'			,fieldName:'inch'			 ,width: '60', header: { text:'Inch' }, autoFilter:true, numberFormat: '#,##0.00', editable: false },
		{ name: 'glassThick'	,fieldName:'glassThick'		 ,width: '70', header: { text: 'GLASS두께' }, autoFilter:true, editable: false },
		{ name: 'version'		,fieldName:'version'		 ,width: '60', header: { text:'Version' }, autoFilter:true, editable: false },
		{ name: 'spec'			,fieldName:'spec'			 ,width: '150', header: { text: '규격' }, autoFilter:true, editable: false },
		{ name: 'unitCode'		,fieldName:'unitCode'		 ,width: '60', header: { text: '단위코드' }, autoFilter:true, visible: false, editable: false  },
		{ name: 'unit'			,fieldName:'unit'			 ,width: '50', header: { text: '단위명' }, autoFilter:true, editable: false },						
		{ name: 'customerCode'  ,fieldName:'customerCode'    ,width: '60', header: { text: '고객코드'}, autoFilter:true, visible: false, editable: false  },
		{ name: 'customerName' 	,fieldName:'customerName' 	 ,width: '100', header: { text:'고객명' }, autoFilter:true, editable: false  },
		{ name: 'sheet'			,fieldName:'sheet'			 ,width: '50', header: { text: 'Sheet' }, autoFilter:true, numberFormat: '#,##0' },
		{ name: 'block'			,fieldName:'block'			 ,width: '50', header: { text: 'Block'	 }, autoFilter:true, numberFormat: '#,##0' },
		{ name: 'cell'			,fieldName:'cell'			 ,width: '50', header: { text: 'Cell'	 }, autoFilter:true, numberFormat: '#,##0', editable: false },		
		{ name: 'runSize' 		,fieldName:'runSize' 		 ,width: '60', header: { text: 'Run Size' }, autoFilter:true, numberFormat: '#,##0' },
		{ name: 'massProd'		,fieldName:'massProd'		 ,width: '60', header: { text:'양산여부' },autoFilter:true,  editor: {type:"dropdown", domainOnly: true, textReadOnly:true}, lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS },
		{ name: 'note'			,fieldName:'note'			 ,width: '100', header: { text:'비고' }, autoFilter:true, },
		{ name: 'createDate' 	,fieldName: 'createDate' 	,width: '80', header: { text: '등록일' }, autoFilter:true, type:"datetime", datetimeFormat: "yyyy-MM-dd" },
		{ name: 'createName' 	,fieldName: 'createName' 	,width: '80', header: { text: '등록자' }, autoFilter:true,  }				
		],
	layout: [
		'line' 			,
		'prodCode'		,
		'model'			,
		'modelName'     ,
		'inch'			,
		'glassThick'	,
		'version'		,
		'spec'			,
		'unitCode'	,
		'unit'		,
		'customerCode'  ,
		'customerName' 	,
		{
			name : "LotSize",
			direction: "horizontal",
			items: [
				'sheet'    ,
				'block'    ,
				'cell'    ,
			],
			header: {
				text : "Lot Size"
			}
		},	
		'runSize' 		,
		'massProd'		,
		'note'			,
		'createDate' 	,
		'createName' 	
	]
}

module.exports = grid;