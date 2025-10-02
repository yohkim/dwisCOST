/*
* 제조 실적 입력 > Rework > M-RUN 발행 > RUN CARD
*/
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
			// selectionStyle: SelectionStyle.SINGLE_ROW,
			// selectionMode: SelectionMode.SINGLE,
			fitStyle: "fill", //GridFitStyle.EVEN_FILL,
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
		{ fieldName: '공정명', dataType: ValueType.TEXT },
		{ fieldName: '코드', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '공정명', fieldName: '공정명', width: '150', header: { text: '공정명' }},
		{ name: '코드', fieldName: '코드', width: '150', header: { text: '코드' }},
	],
}
module.exports = grid;