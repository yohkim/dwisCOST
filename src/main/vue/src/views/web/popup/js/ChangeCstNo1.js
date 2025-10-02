
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
		paste: { enabled: true,eventEachRow:true },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'seq', dataType: ValueType.TEXT},
		{ fieldName: '차수', dataType: ValueType.TEXT},
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'fCstno', dataType: ValueType.TEXT },
		{ fieldName: 'tCstno', dataType: ValueType.TEXT },
		{ fieldName: 'inCstno', dataType: ValueType.TEXT },
		{ fieldName: 'tCstno1', dataType: ValueType.TEXT },
		
	],
	columns: [
		{ name: 'fCstno', fieldName: 'fCstno', width: '80', header: { text: '투입카세트' }, editable:false},
		{ name: 'tCstno', fieldName: 'tCstno', width: '80', header: { text: '출고카세트' }, editable:false},
		{ name: 'inCstno', fieldName: 'inCstno', width: '80', header: { text: '변경카세트' }, editable:false, styleName:"edit"},		
	],

	layout: [
		{
			name: "변경 전",
			items: ["fCstno","tCstno"],
			header: { text: "기존" },
		},
		{
			name: "변경 후",
			items: ["inCstno"],
			header: { text: "변경" },
		},		
	],
	
}
module.exports = grid;