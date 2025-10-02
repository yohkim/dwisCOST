/*
* 프로세스 플래닝 > 생산 공정 관리 - 스텝 마스터
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
		{ fieldName: 'line'     ,dataType: ValueType.TEXT },
		{ fieldName: '공정코드'     ,dataType: ValueType.TEXT },
		{ fieldName: '공정명'       ,dataType: ValueType.TEXT },
		{ fieldName: '공정약어'     ,dataType: ValueType.TEXT },
		{ fieldName: 'areaCode' ,dataType: ValueType.TEXT },
		{ fieldName: 'area'   ,dataType: ValueType.TEXT },
		{ fieldName: '치수관리'     ,dataType: ValueType.TEXT },
		{ fieldName: '작업순서'     ,dataType: ValueType.NUMBER },
		{ fieldName: '목표치'       ,dataType: ValueType.NUMBER },
		{ fieldName: '작업여부'     ,dataType: ValueType.TEXT },
		{ fieldName: 'remark'         ,dataType: ValueType.TEXT },
		{ fieldName: 'createDate', 		dataType: ValueType.DATE },
		{ fieldName: 'createName',	 	dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'line'			,fieldName: 'line'   	,width: '70', header: { text: 'Line' }, autoFilter:true, lookupDisplay:true },
		{ name: '공정코드'     ,fieldName: '공정코드'     ,width: '70', header: { text: 'Step코드' }, autoFilter:true,  },		
		{ name: '공정명'       ,fieldName: '공정명'       ,width: '180', header: { text: 'Step명' }, autoFilter:true,  },
		{ name: '공정약어'     ,fieldName: '공정약어'     ,width: '100', header: { text: 'Step약어' }, autoFilter:true,  },		
		{ name: 'areaCode'    ,fieldName: 'areaCode'    ,width: '70', header: { text: 'Area코드' }, autoFilter:true, editable: false  },
		{ name: 'area'    	 ,fieldName: 'area'    		,width: '150', header: { text: 'Area명' }, autoFilter:true, editable: false  },
		{ name: '치수관리'     ,fieldName: '치수관리'     ,width: '70', header: { text: '치수관리' }, autoFilter:true, editor: {type:"dropdown", domainOnly: true, textReadOnly:true}, lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS },
		{ name: '작업순서'     ,fieldName: '작업순서'     ,width: '70', header: { text: '작업순서' }, autoFilter:true, default:0, numberFormat: '#,##0'  },		
		{ name: '목표치'       ,fieldName: '목표치'       ,width: '70', header: { text: '목표치' }, autoFilter:true, default:0, numberFormat: '#,##0'  },
		{ name: '작업여부'     ,fieldName: '작업여부'     ,width: '70', header: { text: '작업여부' }, autoFilter:true, editor: {type:"dropdown", domainOnly: true, textReadOnly:true}, lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS },
		{ name: 'remark'       ,fieldName: 'remark'         ,width: '200', header: { text: '비고' }, autoFilter:true,  },			
		{ name: 'createDate' 	,fieldName: 'createDate' 	,width: '80', header: { text: '등록일' }, autoFilter:true, type:"datetime", datetimeFormat: "yyyy-MM-dd" },
		{ name: 'createName' 	,fieldName: 'createName' 	,width: '80', header: { text: '등록자' }, autoFilter:true,  }				
	],
}

module.exports = grid;