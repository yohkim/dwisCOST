/*
* PO_NO 찾기
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const grid = {
	
	options: {
		checkBar: { visible: false,exclusive:true },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true,fitStyle: GridFitStyle.EVEN_FILL, },
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
		{ fieldName: '수주일자', dataType: ValueType.TEXT },
		{ fieldName: 'poNo', dataType: ValueType.TEXT },
		{ fieldName: '거래처명', dataType: ValueType.TEXT },
		{ fieldName: '제품명', dataType: ValueType.TEXT },
		{ fieldName: '제품코드', dataType: ValueType.TEXT },
		{ fieldName: '수주수량', dataType: ValueType.TEXT },
		{ fieldName: '필요자재량', dataType: ValueType.TEXT },
		{ fieldName: '내용', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '수주일자', fieldName: '수주일자', width: '90', header: { text: '수주일자' }, autoFilter:true },
		{ name: 'poNo', fieldName: 'poNo', width: '180', header: { text: 'PO_NO' } , autoFilter:true},
		{ name: '거래처명', fieldName: '거래처명', width: '120', header: { text: '거래처명' }, autoFilter:true },
		{ name: '제품명', fieldName: '제품명', width: '180', header: { text: '제품명' } , autoFilter:true},
		{ name: '제품코드', fieldName: '제품코드', width: '100', header: { text: '제품코드' }, autoFilter:true },
		{ name: '수주수량', fieldName: '수주수량', width: '90', header: { text: '수주수량' }, autoFilter:true },
		{ name: '필요자재량', fieldName: '필요자재량', width: '90', header: { text: '필요자재량' }, autoFilter:true },
		{ name: '내용', fieldName: '내용', width: '210', header: { text: '내용' }, autoFilter:true },
	],

}

module.exports = grid;