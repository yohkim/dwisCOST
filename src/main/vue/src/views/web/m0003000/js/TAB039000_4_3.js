/*
* BACK#2 Cell QC INFO2
*/
const { ValueType, SyncGridHeight } = require('realgrid');
const { rgDisplayDate, rgDisplayDateTime2 } = require('@/utils/dateUtils');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "NONE" },
		edit: { editable: false },
		//editor: {},
		filtering: { enabled: true },
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
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'runId', dataType: ValueType.TEXT },
		{ fieldName: 'cstNo', dataType: ValueType.TEXT },
		{ fieldName: '작업일자', dataType: ValueType.TEXT },
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: '설비호기', dataType: ValueType.TEXT },
		{ fieldName: '설비약명', dataType: ValueType.TEXT },
		{ fieldName: '근무조', dataType: ValueType.TEXT },
		{ fieldName: 'cellId', dataType: ValueType.TEXT },
		{ fieldName: 'startTime', dataType: ValueType.TEXT },
		{ fieldName: 'endTime', dataType: ValueType.TEXT },				
		{ fieldName: '차수', dataType: ValueType.INT },				
		{ fieldName: 'result', dataType: ValueType.TEXT },				
		{ fieldName: 'result1', dataType: ValueType.TEXT },				
		{ fieldName: 'result2', dataType: ValueType.TEXT },				
		{ fieldName: 'scrap', dataType: ValueType.TEXT },				
		{ fieldName: '특이사항', dataType: ValueType.TEXT },				
		{ fieldName: '시료일자', dataType: ValueType.TEXT },				
		{ fieldName: '신뢰성작업확인', dataType: ValueType.TEXT },				
		{ fieldName: '신뢰성시료유형', dataType: ValueType.TEXT },			
	],

	columns: [
		{ name: "작업일자", fieldName: "startTime", header: { text: "작업일자" }, width: 100, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "설비약명", fieldName: "설비약명", header: { text: "설비호기" }, width: 80, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "근무조", fieldName: "근무조", header: { text: "근무조" }, width: 80, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "작업자", fieldName: "작업자", header: { text: "검사자" }, width: 100, renderer: { showTooltip: true }, styleName: "tl", autoFilter: true },
		{ name: "cellId", fieldName: "cellId", header: { text: "Cell No." }, width: 250, renderer: { showTooltip: true }, styleName: "tl", autoFilter: true },
		{ name: "startTime", fieldName: "startTime", header: { text: "시작시각" }, width: 100, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDateTime2
		},
		{ name: "endTime", fieldName: "endTime", header: { text: "종료시각" }, width: 100, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDateTime2
		},
		{ name: "차수", fieldName: "차수", header: { text: "차수" }, width: 80, renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "result1", fieldName: "result1", header: { text: "양품" }, width: 100, renderer: { showTooltip: true }, styleName: "tl", autoFilter: true },
		{ name: "result2", fieldName: "result2", header: { text: "불량" }, width: 100, renderer: { showTooltip: true }, styleName: "tl", autoFilter: true },
		{ name: "scrap", fieldName: "scrap", header: { text: "불량사유" }, width: 250, renderer: { showTooltip: true }, styleName: "tl", autoFilter: true },
		{ name: "시료일자", fieldName: "시료일자", header: { text: "시료일자" }, width: 100, renderer: { showTooltip: true }, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "신뢰성작업확인", fieldName: "신뢰성작업확인", header: { text: "신뢰성작업확인" }, width: 150, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "신뢰성시료유형", fieldName: "신뢰성시료유형", header: { text: "신뢰성시료유형" }, width: 100, renderer: { showTooltip: true }, styleName: "tl" },
	],

	layout: [
		"작업일자","설비약명","근무조","작업자","cellId","startTime","endTime","차수","result1","result2","scrap","시료일자","신뢰성작업확인","신뢰성시료유형"
	],
}

module.exports = grid;