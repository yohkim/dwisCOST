/*
* 자재 찾기
*/
const { ValueType } = require('realgrid');

const grid = {
	
	options: {
		checkBar: { visible: false,exclusive:true },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true },
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
		{ fieldName: '자재코드', dataType: ValueType.TEXT },
		{ fieldName: '자재품명', dataType: ValueType.TEXT },
		{ fieldName: '자재재질', dataType: ValueType.TEXT },
		{ fieldName: '자재두께', dataType: ValueType.TEXT },
		{ fieldName: '자재규격', dataType: ValueType.TEXT },
		{ fieldName: '자재단위', dataType: ValueType.TEXT },
		{ fieldName: '거래처명', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '자재코드', fieldName: '자재코드', width: '100', header: { text: '자재코드' }, autoFilter:true },
		{ name: '자재품명', fieldName: '자재품명', width: '200', header: { text: '자재품명' }, autoFilter:true },
		{ name: '자재재질', fieldName: '자재재질', width: '150', header: { text: '자재재질' }, autoFilter:true },
		{ name: '자재두께', fieldName: '자재두께', width: '100', header: { text: '자재두께' }, autoFilter:true },
		{ name: '자재규격', fieldName: '자재규격', width: '200', header: { text: '자재규격' }, autoFilter:true },
		{ name: '자재단위', fieldName: '자재단위', width: '100', header: { text: '자재단위' }, autoFilter:true },
		{ name: '거래처명', fieldName: '거래처명', width: '200', header: { text: '거래처명' }, autoFilter:true },
	],

}

module.exports = grid;