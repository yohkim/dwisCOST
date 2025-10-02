/*
* 프로세스 플래닝 > LINE/AREA 관리 - AREA
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
		{ fieldName: 'area'			,dataType: ValueType.TEXT },
		{ fieldName: '공정구분'		,dataType: ValueType.TEXT },
		{ fieldName: 'areaOrd'		,dataType: ValueType.NUMBER },
		{ fieldName: 'useYn'		,dataType: ValueType.TEXT },
		{ fieldName: 'createDate'	,dataType: ValueType.DATE },
		{ fieldName: 'createName'	,dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'line'			,fieldName: 'line'		  	,width: '80', header: { text: 'Line' }, autoFilter:true, editable: false, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true }},	
		{ name: '공정구분'		 ,fieldName: '공정구분'		 ,width: '80', header: { text: 'Area코드' }, autoFilter:true, editable: false, editor: { type:"text", maxLength:7 } },
		{ name: 'area'			,fieldName: 'area'		  	,width: '250', header: { text: 'Area명' }, autoFilter:true, editor: { type:"text", maxLength:20 }},
		{ name: 'areaOrd'		,fieldName: 'areaOrd'		,width: '80', header: { text: '순서' }, autoFilter:true , editor: { type:"int", maxLength:7 }, numberFormat: '#,##0' },	
		{ name: 'useYn'		    ,fieldName: 'useYn'			,width: '80', header: { text: '사용여부' }, autoFilter:true, lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS, editor: { type:"dropdown", dropDownCount:2, textReadOnly:true } },
		{ name: 'createDate'	,fieldName: 'createDate'	,width: '100', header: { text: '등록일' }, autoFilter:true, type:"datetime", datetimeFormat: "yyyy-MM-dd", editable:false },
		{ name: 'createName'	,fieldName: 'createName'	,width: '100', header: { text: '등록자' }, autoFilter:true, editable:false }		
	],
}

module.exports = grid;