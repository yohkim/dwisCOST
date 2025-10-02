/*
* 프로세스 플래닝 > 생산 공정 관리 - 공정 마스터
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
		{ fieldName: 'line'         ,	dataType: ValueType.TEXT },
		{ fieldName: 'processId'   , 	dataType: ValueType.TEXT },
		{ fieldName: 'description'	,	dataType: ValueType.TEXT },
		{ fieldName: 'version'      ,	dataType: ValueType.NUMBER },
		{ fieldName: 'createDate'  ,	dataType: ValueType.DATE },
		{ fieldName: 'createName'  , 	dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'line'         ,fieldName: 'line'          ,width: '80', header: { text: 'Line' }, autoFilter:true, editable: true, lookupDisplay:true, editor: { type:"dropdown", textReadOnly:true } },		
		{ name: 'processId'    ,fieldName: 'processId'    ,width: '100', header: { text: 'Process ID' }, autoFilter:true,  },
		{ name: 'description'  ,fieldName: 'description'   ,width: '870', header: { text: 'Desc' }, autoFilter:true,  },
		{ name: 'version'      ,fieldName: 'version'       ,width: '80', header: { text: 'Version' }, autoFilter:true, numberFormat: '#,##0' },
		{ name: 'createDate'  ,fieldName: 'createDate'   ,width: '80', header: { text: '등록일' }, autoFilter:true, editable: false, datetimeFormat: "yyyy-MM-dd" },
		{ name: 'createName'  ,fieldName: 'createName'   ,width: '80', header: { text: '등록자' }, autoFilter:true, editable: false },
	],
}

module.exports = grid;