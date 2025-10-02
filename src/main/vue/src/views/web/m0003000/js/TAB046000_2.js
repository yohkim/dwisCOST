/*
* 제조 실적 입력 > Rework > M-BOX 관리
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
			selectionStyle: SelectionStyle.BLOCK,
			selectionMode: SelectionMode.EXTENDED,
			fitStyle: GridFitStyle.EVEN_FILL,
		},
		edit: { editable: false },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: true},
		//footers: {},
		//format: {},
		header: { height: 40, showTooltip: true, tooltipEllipsisOnly: true },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: true },
		//sortMode: {},
		stateBar: { visible: false },
    	filtering: { enabled: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: 'cellQr', dataType: ValueType.TEXT },
		{ fieldName: '수량', dataType: ValueType.NUMBER },
		{ fieldName: '구분', dataType: ValueType.TEXT },
		//{ fieldName: 'before상태', dataType: ValueType.TEXT },
		//{ fieldName: 'after상태', dataType: ValueType.TEXT },
		{ fieldName: '사유', dataType: ValueType.TEXT },
		{ fieldName: '날짜', dataType: ValueType.TEXT },
		{ fieldName: '담당자', dataType: ValueType.TEXT },
		//{ fieldName: 'mBoxNo', dataType: ValueType.TEXT },
		//{ fieldName: 'mRunNo', dataType: ValueType.TEXT },
		{ fieldName: '비고', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'runNo', fieldName: 'runNo', width: '150', mergeRule: { criteria: "value" }, header: { text: 'RUN No.' }, autoFilter: true},
		{ name: 'cellQr', fieldName: 'cellQr', width: '250', header: { text: 'Cell QR' }, autoFilter: true, footer: { text: "Cell 합계 =>"}},
		{ name: '수량', fieldName: '수량', width: '60', header: { text: '수량' }, numberFormat: "#,##0", footer: { expression: "sum", numberFormat: "#,##0"}},
		{ name: '구분', fieldName: '구분', width: '80', header: { text: '구분' }},
		//{ name: 'before상태', fieldName: 'before상태', width: '100', header: { text: 'Before상태' }},
		//{ name: 'after상태', fieldName: 'after상태', width: '100', header: { text: 'After상태' }},
		{ name: '사유', fieldName: '사유', width: '100', header: { text: '사유' }},
		{ name: '날짜', fieldName: '날짜', width: '100', header: { text: '날짜' }},
		{ name: '담당자', fieldName: '담당자', width: '80', header: { text: '담당자' }},
		//{ name: 'mBoxNo', fieldName: 'mBoxNo', width: '120', header: { text: 'M-BOX No' }},
		//{ name: 'mRunNo', fieldName: 'mRunNo', width: '120', header: { text: 'M-RUN No' }},
		{ name: '비고', fieldName: '비고', width: '200', header: { text: '비고' }},
	],

	layout: [
		{
			name: "상태현황",
			direction: "horizontal",
			items: ["runNo", "cellQr","수량","구분",/*"before상태","after상태",*/"사유","날짜","담당자"/*,"mBoxNo","mRunNo"*/],
			header:{ text: "상태현황" }
		},
		"비고"		
	],
}
module.exports = grid;