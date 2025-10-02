const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');

const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.BLOCK,
			selectionMode: SelectionMode.EXTENDED,
			fitStyle: GridFitStyle.EVEN_FILL,
		},
		edit: { 
			editable: true,
			commitByCell:true,
			movable :true,
		},
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: true },
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: true,eventEachRow:true,enableAppend:false},
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '공장코드', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'seq', dataType: ValueType.TEXT},
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: 'cell', dataType: ValueType.NUMBER },
		{ fieldName: 'adjCell', dataType: ValueType.NUMBER },
		{ fieldName: 'fCstno', dataType: ValueType.TEXT },
		{ fieldName: 'f수량', dataType: ValueType.NUMBER },		//field 참조 위치변경 하면 안됨
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: 'tCstno', dataType: ValueType.TEXT },
		{ fieldName: 'inCstno', dataType: ValueType.TEXT },
		{ fieldName: '설비cell수량', dataType: ValueType.NUMBER},
		{ fieldName: 't수량', dataType: ValueType.NUMBER},	
		{ fieldName: '불량예상수량', dataType: ValueType.NUMBER},
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: 'bef공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'nxt공정코드', dataType: ValueType.TEXT },
		{ fieldName: '박리작업구분', dataType: ValueType.TEXT },
		{ fieldName: '불량합계', dataType: ValueType.NUMBER},
		{ fieldName: 'cstKey', dataType: ValueType.TEXT },
		{ fieldName: 'notLogYn', dataType: ValueType.TEXT },
		
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: '설비호기', dataType: ValueType.TEXT },
		{ fieldName: '설비명', dataType: ValueType.TEXT },
		{ fieldName: '근무조', dataType: ValueType.TEXT },
		{ fieldName: 'shift', dataType: ValueType.TEXT },

		{ fieldName: 'pkey', dataType: ValueType.TEXT },		
		{ fieldName: 'f불량수량', dataType: ValueType.NUMBER },

		{ fieldName: 'tOrg수량', dataType: ValueType.NUMBER },
		{ fieldName: 'tCnt', dataType: ValueType.NUMBER },
	],
	columns: [
		{ name: 'tCstno', fieldName: 'tCstno', width: '100', header: { text: 'CST NO' }, editable:false},
		{ name: 't수량', fieldName: 't수량', width: '80', header: { text: '수량' }, editable:false, numberFormat: "#,##0", footer: {expression: "sum"}},
	],

	
}
module.exports = grid;