/*
* 프로세스 플래닝 > LINE/AREA 관리 - LINE
*/
const { ValueType, SelectionMode, SelectionStyle, GridFitStyle } = require('realgrid');

const USE_YN_LABELS = ["Y", "N"];
const USE_YN_VALUE = ["Y", "N"];

const grid = {
	
	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { 
			columnMovable: false, 
			editItemMerging: false,
			selectionMode: SelectionMode.SINGLE,
			selectionStyle:SelectionStyle.SINGLE_ROW,
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
		{ fieldName: 'lineDecs'		,dataType: ValueType.TEXT },
		{ fieldName: 'site'			,dataType: ValueType.TEXT },
		{ fieldName: 'useYn'		,dataType: ValueType.TEXT },
		{ fieldName: 'createDate'	,dataType: ValueType.DATE },
		{ fieldName: 'createName'	,dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'line'			,fieldName: 'line'		  	,width: '80', header: { text: 'Line' }, autoFilter:true, editable:false },		
		{ name: 'lineDecs'  	,fieldName: 'lineDecs' 		,width: '170', header: { text: 'Description' }, autoFilter:true, editable:false  },
		{ name: 'site'			,fieldName: 'site'			,width: '100', header: { text: 'Site' }, autoFilter:true, editable:false },	
		{ name: 'useYn'			,fieldName: 'useYn'			,width: '70', header: { text: '사용여부' }, autoFilter:true, editable:false },
		// { name: 'createDate'	,fieldName: 'createDate'	,width: '70', header: { text: '등록일' }, type:"datetime", datetimeFormat: "yyyy-MM-dd" },
		// { name: 'createName'	,fieldName: 'createName'	,width: '70', header: { text: '등록자' } }		
	],
}

module.exports = grid;