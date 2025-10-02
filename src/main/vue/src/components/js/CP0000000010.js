/*
* 공정(step) 다수 선택
*/
const { ValueType } = require('realgrid');

const grid = {
	
	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: 'even' },
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
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '공정명', fieldName: '공정명', width: '80', header: { text: '공정명' }, styleName:'tl', renderer: { showTooltip: true } },
		{ name: '특이사항', fieldName: '특이사항', width: '500', header: { text: '특이사항' }, styleName:'tl', renderer: { showTooltip: true } },
	],

}

module.exports = grid;