/*
* 제조 실적 입력 > Rework > M-BOX 관리
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, SummaryMode } = require('realgrid');
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
			summaryMode: SummaryMode.AGGREGATE,
		},
		edit: { editable: false },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: true , height: 30, text: '합계', styles: {
					background: '#f5f5f5',
					text: '#333333',
					border: '#e0e0e0',
					borderBottom: '1px solid #e0e0e0' 
					}},
		//footers: {},
		//format: {},
		header: { height: 40 },
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
		{ fieldName: '공정순서', dataType: ValueType.TEXT },
		{ fieldName: '공정', dataType: ValueType.TEXT },
		{ fieldName: 'total', dataType: ValueType.NUMBER },
	],

	columns: [
		{ name: '공정순서', fieldName: '공정순서', width: '150', header: { text: '공정순서' }, visible: false},
		{ name: '공정', fieldName: '공정', width: '150', header: { text: '공정' }, footer: {text: "공정 합계"}},
		{ name: 'total', fieldName: 'total', width: '150', header: { text: 'TOTAL' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"} }, 
	],
}
module.exports = grid;
