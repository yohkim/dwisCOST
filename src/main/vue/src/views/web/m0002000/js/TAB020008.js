
const { ValueType,GridFitStyle } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false},
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { 
			columnMovable: false, 
			fitStyle: GridFitStyle.EVEN,
			editItemMerging :true,
			showTooltip:true,
			showEmptyTooltip:true
		},
		edit: { editable: true,commitByCell:true},
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		fixed: {colCount:5},
		footer: { visible: false },
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		hideDeletedRows: true,
		paste: { enabled: true },
		rowIndicator: { visible: false },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '공장코드', dataType: ValueType.TEXT },
		{ fieldName: 'seqNo', dataType: ValueType.NUMBER },
		{ fieldName: '공정', dataType: ValueType.TEXT },
		{ fieldName: '설비명', dataType: ValueType.TEXT },
		{ fieldName: 'pm기준', dataType: ValueType.NUMBER },
		{ fieldName: '누적실적', dataType: ValueType.NUMBER },
		{ fieldName: 'pm최근실행일', dataType: ValueType.TEXT },
		{ fieldName: '구분', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '공정', fieldName: '공정', width: '80', header: { text: '공정' },  mergeRule:{criteria: "row div 3"},editable: false},
		{ name: '설비명', fieldName: '설비명', width: '120', header: { text: '설비명' },  mergeRule:{criteria: "value"},editable: false},
		{ name: 'pm기준', fieldName: 'pm기준', width: '80', header: { text: 'PM 기준' },styleName:"tr",  mergeRule:{criteria: "row div 3"},editable: false, numberFormat: "#,##0", nanText: "0"},
		{ name: '누적실적', fieldName: '누적실적', width: '80',editor:{type:"number"} ,styleName:"edit tr", header: { text: '누적실적' }, mergeRule:{criteria: "row div 3"},numberFormat: "#,##0",mergeEdit: true},
		{ name: '구분', fieldName: '구분', width: '80', header: { text: '구분' },editable: false},
	],
}

module.exports = grid;