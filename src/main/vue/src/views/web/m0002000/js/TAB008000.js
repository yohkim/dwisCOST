/*
* 프로세스 플래닝 > LINE/AREA 관리 - 설비마스터
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
		{ fieldName: 'line' 	,dataType: ValueType.TEXT },
		{ fieldName: '설비번호' ,dataType: ValueType.TEXT },
		{ fieldName: '설비명'  	,dataType: ValueType.TEXT },
		{ fieldName: '설비약명' ,dataType: ValueType.TEXT },
		{ fieldName: 'chamber'	,dataType: ValueType.TEXT },
		{ fieldName: '공정코드' ,dataType: ValueType.TEXT },
		{ fieldName: '공정명'  	,dataType: ValueType.TEXT },
		{ fieldName: 'areaCode' ,dataType: ValueType.TEXT },
		{ fieldName: 'area'		,dataType: ValueType.TEXT },
		{ fieldName: '사용여부'	,dataType: ValueType.TEXT },
		{ fieldName: '비고'		,dataType: ValueType.TEXT },
		{ fieldName: '생성일'	,dataType: ValueType.DATE },
		{ fieldName: '생성자'  	,dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'line' 			,fieldName:'line' 		,width: '60', header: { text: 'Line' }, autoFilter:true, editable:false, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true }},	
		{ name: '설비번호' 		,fieldName:'설비번호' 	 ,width: '60', header: { text: '설비번호' }, autoFilter:true, editable:false, editor: { type:"text", maxLength:3 }},	
		{ name: '설비명'  		,fieldName:'설비명'  	 ,width: '220', header: { text: '설비명' }, autoFilter:true, editor: { type:"text", maxLength:43 }},	
		{ name: '설비약명' 		,fieldName:'설비약명' 	 ,width: '130', header: { text: '설비약명' }, autoFilter:true, editor: { type:"text", maxLength:15 }},	
		{ name: 'chamber'		,fieldName:'chamber'	,width: '70', header: { text: 'Chamber' }, autoFilter:true, editor: { type:"text", maxLength:1 }},	
		{ name: '공정코드' 		,fieldName:'공정코드' 	 ,width: '60', header: { text: 'Step코드' }, autoFilter:true, editable:false },	
		{ name: '공정명'  		,fieldName:'공정명'  	 ,width: '150', header: { text: 'Step' }, autoFilter:true, editable:false, autoFilter:true  },	
		{ name: 'areaCode' 		,fieldName:'areaCode' 	 ,width: '60', header: { text: 'Area코드' }, autoFilter:true, editable:false },	
		{ name: 'area'			,fieldName:'area'		,width: '120', header: { text: 'Area' }, autoFilter:true, editable:false, autoFilter:true },
		{ name: '사용여부' 		,fieldName:'사용여부' 	,width: '80', header: { text: '사용여부' },  autoFilter:true, lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS, editor: { type:"dropdown", dropDownCount:2, textReadOnly:true } },		
		{ name: '비고'			,fieldName:'비고'		,width: '160', header: { text: '비고' },  autoFilter:true, editor: { type:"text", maxLength:40 } },
		{ name: '생성일'		,fieldName:'생성일'		,width: '80', header: { text: '생성일' }, autoFilter:true, type:"datetime", datetimeFormat: "yyyy-MM-dd", editable:false },
		{ name: '생성자'		,fieldName:'생성자'		,width: '80', header: { text: '생성자' }, autoFilter:true, editable:false }		
	],
}

module.exports = grid;