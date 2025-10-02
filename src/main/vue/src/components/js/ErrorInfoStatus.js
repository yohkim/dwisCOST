/*
* 제조 실적 입력 > 제품현황
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, SyncGridHeight } = require('realgrid');
const { numberValueOrDefault } = require('@/utils/dataTransform');

const valueCallback1 = function (ds, index, fieldName, fields, values) {
	const filteredArray = fields.filter(item => item !== "불량합계");
	const sum = filteredArray.reduce((acc, item) => {
		const value = numberValueOrDefault(values[fields.indexOf(item)]);
		return acc + value;
	}, 0);
	return sum;
}

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
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.FILL,
			syncGridHeight: SyncGridHeight.ALWAYS,
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
		rowIndicator: { visible: false },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [],

	orgFields: [
		{ fieldName: '불량합계', dataType: ValueType.NUMBER,
			valueCallback: valueCallback1
		},		
	],

	columns: [],

	orgColumns: [
		{ name: '불량합계', fieldName: '불량합계', width: 150, header: { text: '불량합계' }, numberFormat: "#,##0", styleName: "tr" },
	],
	layout: [],

	orgLayout: ["불량합계",
		{
			name: "불량정보",
			direction: "horizontal",
			items: [],
			header:{ visible: false }
		},		
	]
}
module.exports = grid;