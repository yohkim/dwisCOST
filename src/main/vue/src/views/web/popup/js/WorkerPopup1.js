/*
* 불량코드 찾기
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { 
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
			rowHeight: 65
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
		{ fieldName: 'codeName', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'codeName', fieldName: 'codeName', width: '100', header: { text: '작업자' }, styleName: 'tl' },
	],
}

module.exports = grid;