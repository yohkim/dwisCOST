/*
* 제조 실적 입력 > Rework > M-BOX 관리 > GenCount
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
		rowIndicator: { visible: false },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'code', dataType: ValueType.TEXT },
		{ fieldName: '구분', dataType: ValueType.TEXT },
		{ fieldName: '계', dataType: ValueType.NUMBER},
		{ fieldName: 'a', dataType: ValueType.NUMBER},
		{ fieldName: 'u', dataType: ValueType.NUMBER},
		{ fieldName: 'c', dataType: ValueType.NUMBER},
		{ fieldName: 'f', dataType: ValueType.NUMBER},
		{ fieldName: 'p', dataType: ValueType.NUMBER},
		{ fieldName: 'm', dataType: ValueType.NUMBER},
		{ fieldName: 'g', dataType: ValueType.NUMBER},
		{ fieldName: 'i', dataType: ValueType.NUMBER},
		{ fieldName: 'r', dataType: ValueType.NUMBER},
		{ fieldName: 'e', dataType: ValueType.NUMBER},
	],

	columns: [
		{ name: 'code', fieldName: 'code', width: '150', header: { text: 'code' }, mergeRule:{criteria: "value"} },
		{ name: '구분', fieldName: '구분', width: '150', header: { text: '구분' }},
		{ name: '계', fieldName: '계', width: '150', header: { text: '계' }, numberFormat: "#,##0"},
		{ name: 'a', fieldName: 'a', width: '160', header: { text: '[A] AGB 깨짐 NG' }, numberFormat: "#,##0"},
		{ name: 'u', fieldName: 'u', width: '160', header: { text: '[U] 굴곡강도 NG' }, numberFormat: "#,##0"},
		{ name: 'c', fieldName: 'c', width: '160', header: { text: '[C] 깨짐 NG' }, numberFormat: "#,##0"},
		{ name: 'f', fieldName: 'f', width: '180', header: { text: '[F] 필름포장검사 불량 NG' }, numberFormat: "#,##0"},
		{ name: 'p', fieldName: 'p', width: '160', header: { text: '[P] 이물제거 설비 NG' }, numberFormat: "#,##0"},
		{ name: 'm', fieldName: 'm', width: '170', header: { text: '[M] 모니터링 NG(얼룩등)' }, numberFormat: "#,##0"},
		{ name: 'g', fieldName: 'g', width: '160', header: { text: '[G] 유리이물 NG' }, numberFormat: "#,##0"},
		{ name: 'i', fieldName: 'i', width: '160', header: { text: '[I] 재검 (FQC등)' }, numberFormat: "#,##0"},
		{ name: 'r', fieldName: 'r', width: '160', header: { text: '[R] RMA Rework' }, numberFormat: "#,##0"},
		{ name: 'e', fieldName: 'e', width: '160', header: { text: '[E] 기타' }, numberFormat: "#,##0"},
	],

	layout: [
		{
			name: "Code",
			direction: "horizontal",
			items: ["code", "구분"],
			header:{ text: "Code" },
			hideChildHeaders: true,
		},
		"계","a","u","c","f","p","m","g","i","r","e"
	],
}
module.exports = grid;