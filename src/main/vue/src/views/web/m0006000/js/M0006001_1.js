/*
* 기준정보 > 제품수주서 입력
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: true, exclusive: true },
		copy: { enabled: true, singleMode: true, datetimeFormat : 'yyyy-MM-dd' },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "even" },
		edit: { editable: true, commitByCell: true },
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
		{ fieldName: '수주일자', dataType: ValueType.DATE },
		{ fieldName: '수주번호', dataType: ValueType.TEXT },
		{ fieldName: '제품유형라벨', dataType: ValueType.TEXT },
		{ fieldName: '제품유형', dataType: ValueType.TEXT },
		{ fieldName: '작업구분라벨', dataType: ValueType.TEXT },
		{ fieldName: '작업구분', dataType: ValueType.TEXT },
		{ fieldName: '거래처명', dataType: ValueType.TEXT },
		{ fieldName: '거래처코드', dataType: ValueType.TEXT },
		{ fieldName: '제품명', dataType: ValueType.TEXT },
		{ fieldName: '제품코드', dataType: ValueType.TEXT },
		{ fieldName: 'poNo', dataType: ValueType.TEXT },
		{ fieldName: '수주수량', dataType: ValueType.NUMBER },
		{ fieldName: '수주단위', dataType: ValueType.TEXT },
		{ fieldName: '수주구분', dataType: ValueType.TEXT },
		{ fieldName: '수율', dataType: ValueType.NUMBER },
		{ fieldName: '필요자재량', dataType: ValueType.NUMBER, valueExpression: "values['수주수량'] / values['수율'] * 100" },
		{ fieldName: '투입수량', dataType: ValueType.NUMBER },
		{ fieldName: '잔량', dataType: ValueType.NUMBER },
		{ fieldName: '납기일', dataType: ValueType.DATE },
		{ fieldName: '비고', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '수주일자', fieldName: '수주일자', width: '100', header: { text: '수주일자' }, editable: false, type:"datetime", datetimeFormat: "yyyy-MM-dd",autoFilter:true, },
		{ name: '제품유형라벨', fieldName: '제품유형라벨', width: '100', header: { text: '제품유형' }, editable: false,autoFilter:true },
		{ name: '작업구분라벨', fieldName: '작업구분라벨', width: '200', header: { text: '작업구분' }, editable: false,autoFilter:true },
		{ name: '거래처명', fieldName: '거래처명', width: '150', header: { text: '거래처명' }, editable: false,autoFilter:true },
		{ name: '제품명', fieldName: '제품명', width: '400', header: { text: '제품명' }, editable: false,autoFilter:true },
		{ name: '제품코드', fieldName: '제품코드', width: '100', header: { text: '제품코드' }, editable: false,autoFilter:true },
		{ name: 'poNo', fieldName: 'poNo', width: '150', header: { text: 'PO_NO' }, editable: false,autoFilter:true },
		{ name: '수주수량', fieldName: '수주수량', width: '100', header: { text: '수주수량' }, numberFormat: '#,##0', styleName: 'tr',autoFilter:true },
		{ name: '수율', fieldName: '수율', width: '100', header: { text: '수율' }, numberFormat: '#,##0', styleName: 'tr',autoFilter:true },
		{ name: '필요자재량', fieldName: '필요자재량', width: '100', header: { text: '필요수량' }, numberFormat: '#,##0', styleName: 'tr', editable: false,autoFilter:true },
		{ name: '투입수량', fieldName: '투입수량', width: '100', header: { text: '투입수량' }, numberFormat: '#,##0', styleName: 'tr', editable: false,autoFilter:true },
		{ name: '잔량', fieldName: '잔량', width: '100', header: { text: '잔량' }, numberFormat: '#,##0', styleName: 'tr', editable: false,autoFilter:true },
		{ name: '납기일', fieldName: '납기일', width: '100', header: { text: '납기일' }, type:"datetime", datetimeFormat: "yyyy-MM-dd",editor: {
			type: "line",
			editMask: "####-##-##",  // 6자리 입력 후 자동 포맷팅
			textAlignment: "center",
			maxLength: 10
		}, autoFilter:true },
		{ name: '비고', fieldName: '비고', width: '400', header: { text: '비고' },autoFilter:true },
	],

	layout: [
		'수주일자',
		'제품유형라벨',
		'작업구분라벨',
		'거래처명',
		{
			name: "product",
			direction: "horizontal",
			items: [
				'제품명',
				'제품코드',
			],
			header: {
				text: "제품현황",
			}
		},
		'poNo',
		'수주수량',
		'수율',
		'필요자재량',
		'투입수량',
		'잔량',
		'납기일',
		'비고',
	],
}

module.exports = grid;