/*
* 제조 실적 입력 > Rework > M-RUN 발행 > M-RUN 발행
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');
const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: true },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			// selectionStyle: SelectionStyle.SINGLE,
			// selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
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
		{ fieldName: '상태', dataType: ValueType.TEXT },
		{ fieldName: '등록일시', dataType: ValueType.TEXT },
		{ fieldName: 'mboxNo', dataType: ValueType.TEXT },
		{ fieldName: '수량', dataType: ValueType.NUMBER },
		{ fieldName: 'aftRunno', dataType: ValueType.TEXT },
		{ fieldName: '등록자', dataType: ValueType.TEXT },
		{ fieldName: '승인자', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '상태', fieldName: '상태', width: '150', header: { text: '상태' }},
		{ name: '등록일시', fieldName: '등록일시', width: '150', header: { text: '등록일시' }},
		{ name: 'mboxNo', fieldName: 'mboxNo', width: '150', header: { text: 'M BOX NO' }, autoFilter:true},
		{ name: 'aftRunno', fieldName: 'aftRunno', width: '150', header: { text: 'M-RUN NO' }},
		{ name: '수량', fieldName: '수량', width: '150', header: { text: 'Cell수량' }, numberFormat: "#,##0"},
		
		{ name: '등록자', fieldName: '등록자', width: '100', header: { text: '담당자' }},
		{ name: '승인자', fieldName: '승인자', width: '100', header: { text: '승인자' }},
		{ name: '특이사항', fieldName: '특이사항', width: '100', header: { text: '특이사항' }},
	],
}
module.exports = grid;