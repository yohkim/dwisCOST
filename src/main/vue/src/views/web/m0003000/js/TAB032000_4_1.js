/*
* 2 Cassette QC INFO4
*/
const { ValueType, SyncGridHeight } = require('realgrid');
const { numberValueOrDefault } = require('@/utils/dataTransform');

const valueCallback1 = function (ds, index, fieldName, fields, values) {
	const filteredArray = fields.filter(item => item !== "합계");
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
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill", syncGridHeight: SyncGridHeight.ALWAYS, },
		edit: { editable: false },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		//footer: {height:40},
		footers: {visible:false},
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

	fields: [
		{ fieldName: '합계', dataType: ValueType.NUMBER,
			valueCallback: valueCallback1
		},
		/*{ fieldName: '불량코드', dataType: ValueType.TEXT },
		{ fieldName: '불량명', dataType: ValueType.TEXT },
		{ fieldName: 'blockSu', dataType: ValueType.INT },
		{ fieldName: '불량수량', dataType: ValueType.INT },*/
	],

	orgFields: [
		{ fieldName: '합계', dataType: ValueType.NUMBER,
			valueCallback: valueCallback1
		},
	],

	columns: [
		{ name: "합계", fieldName: "합계", header: { text: "불량합계" }, numberFormat: "#,##0", renderer: { showTooltip: true }, styleName: "tr" },
		/*{ name: "불량명", fieldName: "불량명", header: { text: "불량명" }, editable: false, renderer: { showTooltip: true } },
		{ name: "불량수량", fieldName: "불량수량", header: { text: "수량" }, editable: false, renderer: { showTooltip: true } },*/
	],

	orgColumns: [
		{ name: "합계", fieldName: "합계", header: { text: "불량합계" }, numberFormat: "#,##0", renderer: { showTooltip: true }, styleName: "tr" },
	],

	layout: [
		/*"불량명", "불량수량"*/
		"합계",
		{
			name: "불량명",
			direction: "horizontal",
			items: [],
			header:{ visible: false }
		},		
	],
}

module.exports = grid;