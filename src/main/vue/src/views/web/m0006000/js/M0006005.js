/*
* 기준정보 > 불량사유 코드
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const grid = {
	dataProvider: null,
	gridView: null,
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
		footer: { visible: false },
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: true },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '불량코드', dataType: ValueType.TEXT },
		{ fieldName: '불량명', dataType: ValueType.TEXT },
		{ fieldName: '불량약명', dataType: ValueType.TEXT },
		{ fieldName: '검사불량', dataType: ValueType.BOOLEAN },
		{ fieldName: '일반불량', dataType: ValueType.BOOLEAN },
		{ fieldName: '사용여부', dataType: ValueType.BOOLEAN },
		{ fieldName: '특기사항', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '불량코드', fieldName: '불량코드', width: '150', header: { text: '불량코드' }, editable: false, sortable: true, editor: {maxLength: 3}, autoFilter:true, },
		{ name: '불량명', fieldName: '불량명', width: '180', header: { text: '불량명' }, editable: true, styleName:'edit', sortable: true, editor: {maxLength: 50}, autoFilter:true, },
		{ name: '불량약명', fieldName: '불량약명', width: '180', header: { text: '약명' }, editable: true, styleName:'edit', sortable: false, editor: {maxLength: 16}, autoFilter:true, },
		{
			name: '검사불량', fieldName: '검사불량', width: '120', header: { text: '검사불량' }, editable: false, styleName:'edit', sortable: false,autoFilter:true,
			renderer: {
				type: "check",
				editable: true,
				trueValues: "1",
				falseValues: "0",
			},
		},
		{
			name: '일반불량', fieldName: '일반불량', width: '120', header: { text: '일반불량' }, editable: false, styleName:'edit', sortable: false,autoFilter:true,
			renderer: {
				type: "check",
				editable: true,
				trueValues: "1",
				falseValues: "0",
			},
		},
		{
			name: '사용여부', fieldName: '사용여부', width: '120', header: { text: '사용여부' }, editable: false, styleName:'edit', sortable: false,autoFilter:true,
			renderer: {
				type: "check",
				editable: true,
				trueValues: "1",
				falseValues: "0",
			},
		},
		{ name: '특기사항', fieldName: '특기사항', width: '500', header: { text: '비고' }, editable: true, styleName:'edit', sortable: false, editor: {maxLength: 50},autoFilter:true, },
	],
}

module.exports = grid;