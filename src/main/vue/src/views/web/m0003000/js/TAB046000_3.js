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
		footer: { visible: true },
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
		{ fieldName: '공정', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: 'mBox', dataType: ValueType.NUMBER },
		{ fieldName: 'mRun', dataType: ValueType.NUMBER },
		{ fieldName: '폐기', dataType: ValueType.NUMBER },
		
		{ fieldName: 'total', dataType: ValueType.NUMBER },
		{ fieldName: 'rework대상', dataType: ValueType.NUMBER },
		{ fieldName: '폐기대상', dataType: ValueType.NUMBER },
		{ fieldName: 'totalS', dataType: ValueType.NUMBER },
		{ fieldName: '미처리', dataType: ValueType.NUMBER },

		{ fieldName: '설비jc', dataType: ValueType.NUMBER },
		{ fieldName: 'oba시료', dataType: ValueType.NUMBER },
		{ fieldName: '반출폐기', dataType: ValueType.NUMBER },
		{ fieldName: '기타', dataType: ValueType.NUMBER },
		{ fieldName: '평탄도접촉각', dataType: ValueType.NUMBER },
		{ fieldName: 'qr거리', dataType: ValueType.NUMBER },
		{ fieldName: '치수두께강화특성', dataType: ValueType.NUMBER },
		{ fieldName: '표면전기저항박리대전압', dataType: ValueType.NUMBER },
		{ fieldName: 'pf이형력', dataType: ValueType.NUMBER },
		{ fieldName: '상온점착력', dataType: ValueType.NUMBER },
		{ fieldName: '유상판매', dataType: ValueType.NUMBER },
	],

	columns: [
		{ name: '공정', fieldName: '공정', width: '100', header: { text: '공정' }},
		{ name: 'mBox', fieldName: 'mBox', width: '100', header: { text: 'M-BOX' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: 'mRun', fieldName: 'mRun', width: '100', header: { text: 'M-RUN' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: 'runNo', fieldName: 'runNo', width: '150', header: { text: 'RUN No.' }, autoFilter: true, footer: {text: "합계"}},
		{ name: '폐기', fieldName: '폐기', width: '100', header: { text: '폐기' }, numberFormat: "#,##0"},
		{ name: 'total', fieldName: 'total', width: '100', header: { text: 'Total' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: 'rework대상', fieldName: 'rework대상', width: '100', header: { text: 'Rework대상' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: '폐기대상', fieldName: '폐기대상', width: '100', header: { text: '폐기대상' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: 'totalS', fieldName: 'totalS', width: '100', header: { text: 'Total' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: '미처리', fieldName: '미처리', width: '100', header: { text: '미처리' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},

		{ name: '설비jc', fieldName: '설비jc', width: '70', header: { text: '설비J/C' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: 'oba시료', fieldName: 'oba시료', width: '70', header: { text: 'OBA' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: '반출폐기', fieldName: '반출폐기', width: '70', header: { text: '폐기' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: '기타', fieldName: '기타', width: '70', header: { text: '기타' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: '평탄도접촉각', fieldName: '평탄도접촉각', width: '150', header: { text: '평탄도(Curl) & 접촉각(전/배면)' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: 'qr거리', fieldName: 'qr거리', width: '70', header: { text: 'QR 거리' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: '치수두께강화특성', fieldName: '치수두께강화특성', width: '150', header: { text: '치수 & 두께 & 강화특성' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: '표면전기저항박리대전압', fieldName: '표면전기저항박리대전압', width: '150', header: { text: '표면 전기 저항 및 박리대전압' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: 'pf이형력', fieldName: 'pf이형력', width: '70', header: { text: 'PF 이형력(전/배면)' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: '상온점착력', fieldName: '상온점착력', width: '70', header: { text: '상온 점착력' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
		{ name: '유상판매', fieldName: '유상판매', width: '70', header: { text: '유상판매' }, numberFormat: "#,##0",footer: {expression: "sum", numberFormat: "#,##0"}},
	],

	layout: [
		{
			name: "검사 결과",
			direction: "horizontal",
			items: ["공정","runNo", "total",
				{
					name: "Loss",
					direction: "horizontal",
					items: ["rework대상", "폐기대상"],
					header:{ text: "Loss" }
				},
			],
			header:{ text: "검사 결과" }
		},
		{
			name: "현황",
			direction: "horizontal",
			items: ["totalS", "미처리",
				{
					name: "Rework",
					direction: "horizontal",
					items: ["mBox", "mRun"],
					header:{ text: "Rework" }
				},
				{
					name: "반출",
					direction: "horizontal",
					items: ["설비jc","oba시료", "반출폐기",'기타',"평탄도접촉각","qr거리","치수두께강화특성","표면전기저항박리대전압","pf이형력","상온점착력","유상판매"],
					header:{ text: "반출" }
				},
			],
			header:{ text: "상태 현황" }
		},
		
	],
}
module.exports = grid;