/*
* 제품 찾기
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false,exclusive:true },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
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
		{ fieldName: '제품코드', dataType: ValueType.TEXT },
		{ fieldName: '고객약명', dataType: ValueType.TEXT },
		{ fieldName: '제품모델', dataType: ValueType.TEXT },
		{ fieldName: 'modelName', dataType: ValueType.TEXT },
		{ fieldName: '제품inch', dataType: ValueType.TEXT },
		{ fieldName: 'glass두께', dataType: ValueType.TEXT },
		{ fieldName: '제품버젼', dataType: ValueType.TEXT },
		{ fieldName: 'sheet', dataType: ValueType.TEXT },
		{ fieldName: 'block', dataType: ValueType.TEXT },
		{ fieldName: 'runSize', dataType: ValueType.TEXT },
		{ fieldName: '제품규격', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '제품코드', fieldName: '제품코드', width: '80', header: { text: '제품코드' }, autoFilter: true },
		{ name: '고객약명', fieldName: '고객약명', width: '100', header: { text: '고객약명' }, autoFilter: true },
		{ name: '제품모델', fieldName: '제품모델', width: '80', header: { text: '제품모델' }, autoFilter: true },
		{ name: 'modelName', fieldName: 'modelName', width: '120', header: { text: '모델명' }, autoFilter: true },
		{ name: '제품inch', fieldName: '제품inch', width: '80', header: { text: '제품Inch' }, autoFilter: true },
		{ name: 'glass두께', fieldName: 'glass두께', width: '80', header: { text: 'Glass두께' }, autoFilter: true },
		{ name: '제품버젼', fieldName: '제품버젼', width: '80', header: { text: '제품버젼' }, autoFilter: true },
		{ name: 'sheet', fieldName: 'sheet', width: '50', header: { text: 'Sheet' }, autoFilter: true },
		{ name: 'block', fieldName: 'block', width: '50', header: { text: 'Block' }, autoFilter: true },
		{ name: 'runSize', fieldName: 'runSize', width: '80', header: { text: 'RUN_SIZE' }, autoFilter: true },
		{ name: '제품규격', fieldName: '제품규격', width: '150', header: { text: '규격' }, autoFilter: true },
	],
}

module.exports = grid;
