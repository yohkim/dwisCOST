/*
* 공통코드
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, RowMaskType} = require('realgrid');

const USE_YN_LABELS = ["Y", "N"];
const USE_YN_VALUE = [true, false];

const grid = {
	
	options: {
		checkBar: { visible: true,exclusive:true },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
			rowHoverType: RowMaskType.ROW
		},
		edit: { editable: false },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: false },
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '대분류코드'	,dataType: ValueType.TEXT },
		{ fieldName: '대분류명'		,dataType: ValueType.TEXT },		
		{ fieldName: '코드'			,dataType: ValueType.TEXT },
		{ fieldName: '내용'			,dataType: ValueType.TEXT },
		{ fieldName: '공정구분'		,dataType: ValueType.TEXT },
		{ fieldName: '기준일자'		,dataType: ValueType.DATE },
		{ fieldName: '사용여부'		,dataType: ValueType.TEXT },
	],
	columns: [
		{ name: '대분류코드'	,fieldName: '대분류코드'   ,width: '100', header: { text: '대분류코드' } },
		{ name: '대분류명'		,fieldName: '대분류명'   ,width: '100', header: { text: '대분류명' }, autoFilter: true },			
		{ name: '코드'			,fieldName: '코드'	   ,width: '100', header: { text: '코드' }, autoFilter: true },
		{ name: '내용'			,fieldName: '내용'	   ,width: '200', header: { text: '내용' }, autoFilter: true },
	//	{ name: '공정구분'		,fieldName: '공정구분'   ,width: '80', header: { text: '공정구분' } },
	//	{ name: '기준일자'		,fieldName: '기준일자'   ,width: '80', header: { text: '기준일자' } },
		{ name: '사용여부'		,fieldName: '사용여부'   ,width: '80', header: { text: '사용여부' },lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS  },		
	],
}

module.exports = grid;