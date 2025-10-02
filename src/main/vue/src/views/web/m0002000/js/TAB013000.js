/*
* 프로세스 플래닝 > 생산 공정 관리 - 공정 스텝 마스터
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
		{ fieldName: 'line'       ,dataType: ValueType.TEXT },
		{ fieldName: 'processId' ,dataType: ValueType.TEXT },
		{ fieldName: 'version'    ,dataType: ValueType.TEXT },
		{ fieldName: '공정코드'    ,dataType: ValueType.TEXT },
		{ fieldName: '공정명'      ,dataType: ValueType.TEXT },
		{ fieldName: '공정약어'    ,dataType: ValueType.TEXT },
		{ fieldName: '다음공정코드'    ,dataType: ValueType.TEXT },
		{ fieldName: '다음공정명'    ,dataType: ValueType.TEXT },
		{ fieldName: 'areaCode'    ,dataType: ValueType.TEXT },
		{ fieldName: 'area'       ,dataType: ValueType.TEXT },		
		{ fieldName: 'useYn'     ,dataType: ValueType.TEXT },
		{ fieldName: '등록일'      ,dataType: ValueType.TEXT },
		{ fieldName: '등록자'      ,dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'line'        ,fieldName:'line'        ,width: '50', header: { text: 'Line' }, autoFilter:true, editable: false },		
		{ name: 'processId'  ,fieldName: 'processId'  ,width: '80', header: { text: 'Process ID' }, autoFilter:true, editable: false },
		{ name: 'version'    ,fieldName: 'version'    ,width: '50', header: { text: 'Ver.' }, autoFilter:true, editable: false },
		{ name: '공정코드'   ,fieldName: '공정코드'   ,width: '80', header: { text: 'Step코드' }, autoFilter:true, editable: false },
		{ name: '공정명'     ,fieldName: '공정명'     ,width: '200', header: { text: 'Step명' }, autoFilter:true, editable: false },
		{ name: '공정약어'   ,fieldName: '공정약어'   ,width: '150', header: { text: 'Step약어' }, autoFilter:true, editable: false },
		{ name: 'areaCode'   ,fieldName: 'areaCode'   ,width: '80', header: { text: 'Area코드' }, autoFilter:true, editable: false  },
		{ name: 'area'       ,fieldName: 'area'      ,width: '150', header: { text: 'Area' },autoFilter: true},		
		{ name: '다음공정코드'   ,fieldName: '다음공정코드'   ,width: '100', header: { text: '다음Step코드' },autoFilter:true, editable: false },
		{ name: '다음공정명'   ,fieldName: '다음공정명'   ,width: '200', header: { text: '다음Step명' }, autoFilter:true, editable: false },	
		{ name: 'useYn'      ,fieldName: 'useYn'     ,width: '80', header: { text: '사용여부' }, autoFilter: true, editor: {type:"dropdown", domainOnly: true, textReadOnly:true}, lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS,  },
		{ name: '등록일'     ,fieldName: '등록일'     ,width: '80', header: { text: '등록일' }, autoFilter:true, editable: false  },
		{ name: '등록자'     ,fieldName: '등록자'     ,width: '80', header: { text: '등록자' }, autoFilter:true, editable: false  },
	],
}

module.exports = grid;