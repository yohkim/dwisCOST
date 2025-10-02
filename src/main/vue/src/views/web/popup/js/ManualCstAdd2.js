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
		edit: { editable: true,commitByCell:false },
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
		paste: { 
			enabled: true,
			eventEachRow:true,
			enableAppend:false,
			throwValidationError:false,
		},
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '공장코드', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: 'process', dataType: ValueType.TEXT },
		{ fieldName: 'seq', dataType: ValueType.TEXT},
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: 'cell', dataType: ValueType.NUMBER },
		{ fieldName: 'adjCell', dataType: ValueType.NUMBER },
		{ fieldName: 'fCstno', dataType: ValueType.TEXT },
		{ fieldName: 'f수량', dataType: ValueType.NUMBER },
		{ fieldName: 'worker', dataType: ValueType.TEXT },
		{ fieldName: 'shift', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: 'tCstno', dataType: ValueType.TEXT },
		{ fieldName: '설비cell수량', dataType: ValueType.NUMBER},
		{ fieldName: 't수량', dataType: ValueType.NUMBER},
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: 'bef공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'nxt공정코드', dataType: ValueType.TEXT },
		{ fieldName: '박리작업구분', dataType: ValueType.TEXT },
		{ fieldName: 'machineCode', dataType: ValueType.TEXT },
		{ fieldName: '불량합계', dataType: ValueType.NUMBER},
		
		{ fieldName: 'f불량수량', dataType: ValueType.NUMBER },
		{ fieldName: '투입수량', dataType: ValueType.NUMBER },
		{ fieldName: 'cstKey', dataType: ValueType.TEXT },
		{ fieldName: '배출구', dataType: ValueType.TEXT },
		{ fieldName: 'inCstno', dataType: ValueType.TEXT },

		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: '작업시작datetime', dataType: ValueType.TEXT },
		{ fieldName: '작업종료datetime', dataType: ValueType.TEXT },

		{ fieldName: 'pkey', dataType: ValueType.TEXT },
		{ fieldName: 'tOrg수량', dataType: ValueType.NUMBER },
		{ fieldName: 'tCnt', dataType: ValueType.NUMBER },
		{ fieldName: '삭제', dataType: ValueType.NUMBER },
	],
	columns: [
		{ name: 'fCstno', fieldName: 'fCstno', width: '80', header: { text: 'F-CST NO' },styleName:"edit", editable:true},
		{ name: 'inCstno', fieldName: 'inCstno', width: '80', header: { text: 'IN-CST NO' },styleName:"edit", editable:true},
		{ name: 'tCstno', fieldName: 'tCstno', width: '80', header: { text: 'T-CST NO' },styleName:"edit", editable:true,footer: {text: "합계"}},
		{ name: 't수량', fieldName: 't수량', width: '60', header: { text: '설비수량' },styleName:"edit tr",editable:true, numberFormat: "#,##0", footer: {expression: "sum"}},
		{ name: 'f수량', fieldName: 'f수량', width: '60', header: { text: '양품수량' },styleName:"edit tr",editable:true, numberFormat: "#,##0", footer: {expression: "sum"}},
		{ name: '작업시작datetime', fieldName: '작업시작datetime', width: '80', header: { text: '작업시작' },styleName:"edit", editable:true,editor:{type: "date",datetimeFormat: "yyyy-MM-dd HH:mm:ss", timeSelectType: "second",commitOnSelect: true},editButtonVisibility:"always",datetimeFormat: "yyyy-MM-dd HH:mm:ss"},
		{ name: '작업종료datetime', fieldName: '작업종료datetime', width: '80', header: { text: '작업종료' },styleName:"edit", editable:true,editor:{type: "date",datetimeFormat: "yyyy-MM-dd HH:mm:ss", timeSelectType: "second",commitOnSelect: true},editButtonVisibility:"always",datetimeFormat: "yyyy-MM-dd HH:mm:ss"},
		{ name: "삭제", fieldName: "삭제", header: { text: "" },width: '40',
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					const str = '<button type="button" class="btn_sucess">삭제</button>';
					return str;
				}
		  	},
		},
	],
	
}
module.exports = grid;