/*
* FRONT INFO3
*/
const { ValueType, SyncGridHeight } = require('realgrid');
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

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "NONE", syncGridHeight: SyncGridHeight.ALWAYS, rowHeight: 45 },
		edit: { editable: false },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: true },
		//footers: {visible:false},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {visible:false},
		//headerSummary: {height:40},
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

	layout: ["불량합계",
		{
			name: "불량명",
			direction: "horizontal",
			items: [],
			header:{ visible: false }
		},
	],
}

module.exports = grid;