const { ValueType } = require('realgrid');
const { formatNumber, numberValueOrDefault } = require('@/utils/dataTransform');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

const valueCallback1 = function (ds, index, fieldName, fields, values) {
	let f수량 = numberValueOrDefault(values[fields.indexOf('투입수량')]);
	let t양품수량 = numberValueOrDefault(values[fields.indexOf('양품수량')]);
	return f수량 == 0 ? 0 : formatNumber(((t양품수량*100)/f수량), 2);
}

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill" },
		edit: { editable: true },
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
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: 'shift', dataType: ValueType.TEXT },
		{ fieldName: '작업조', dataType: ValueType.TEXT },
		{ fieldName: 'pCode', dataType: ValueType.TEXT },
		{ fieldName: 'machineCode', dataType: ValueType.TEXT },
		{ fieldName: '설비약명', dataType: ValueType.TEXT },
		{ fieldName: 'chamber', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: '투입수량', dataType: ValueType.INT },
		{ fieldName: '검사수량', dataType: ValueType.INT },
		{ fieldName: '양품수량', dataType: ValueType.INT },
		{ fieldName: '불량수량', dataType: ValueType.INT },
		{ fieldName: '수율', dataType: ValueType.NUMBER,
			valueCallback: valueCallback1
		},
		{ fieldName: 'cell수량', dataType: ValueType.INT },
		{ fieldName: '특기사항', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: '공정비고', dataType: ValueType.TEXT },
		{ fieldName: '불량입력', dataType: ValueType.TEXT },
		{ fieldName: 'next작업시작', dataType: ValueType.TEXT },
		{ fieldName: 'block수', dataType: ValueType.INT },
	],
	columns: [
		{ name: "lotNo", fieldName: "lotNo", header: { text: "Lot No" }, editable: false, width: 200, renderer: { showTooltip: true } },
		{ name: "작업자", fieldName: "작업자", header: { text: "작업자" }, editable: false, renderer: { showTooltip: true } },
		{ name: "shift", fieldName: "shift", header: { text: "근무조" }, editable: false, renderer: { showTooltip: true },
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					if(_.isNil(cell.value))return ""
					return cell.value.substring(0,1);
				}
			},
		},
		{ name: "작업조", fieldName: "작업조", header: { text: "근무 시간" }, editable: false, renderer: { showTooltip: true } },
		{ name: "설비약명", fieldName: "설비약명", header: { text: "M/C" }, editable: false, renderer: { showTooltip: true } },
		{ name: "chamber", fieldName: "chamber", header: { text: "Line(축)" }, editable: false, renderer: { showTooltip: true } },
		{ name: "작업시작", fieldName: "작업시작", header: { text: "Date" }, editable: false, renderer: { showTooltip: true },
			displayCallback: rgDisplayDate
		},
		{ name: "시작시각", fieldName: "시작시각", header: { text: "Time" }, editable: false, renderer: { showTooltip: true },
			displayCallback: rgDisplayTime
		},
		{ name: "작업종료", fieldName: "작업종료", header: { text: "Date" }, editable: false, renderer: { showTooltip: true },
			displayCallback: rgDisplayDate
		},
		{ name: "종료시각", fieldName: "종료시각", header: { text: "Time" }, editable: false, renderer: { showTooltip: true },
			displayCallback: rgDisplayTime
		},
		{ name: "투입수량", fieldName: "투입수량", header: { text: "투입" }, editable: false, width: 50, renderer: { showTooltip: true } },
		{ name: "양품수량", fieldName: "양품수량", header: { text: "양품" }, editable: false, width: 50, renderer: { showTooltip: true } },
		{ name: "불량수량", fieldName: "불량수량", header: { text: "불량" }, editable: false, width: 50, renderer: { showTooltip: true } },
		{ name: "수율", fieldName: "수율", header: { text: "수율" }, editable: false, numberFormat: "#,##0.##", width: 50, renderer: { showTooltip: true } },
		{ name: "특기사항", fieldName: "특기사항", header: { text: "Lot-CARD 특이사항 및 작업시 주의사항" }, editable: false, width: 300, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "불량입력", fieldName: "불량입력", header: { text: "item" }, renderer: { showTooltip: true }, width: 100,
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					const ds = grid.getDataSource();
        			const jsonData = ds.getJsonRow(cell.index.itemIndex);
					const str = '<button type="button" class="'+(jsonData['불량수량'] > 0 ? 'btn_sucess' : 'btn_error')+'">불량입력</button>';
					return str;
				}
		  	},
		},
		{ name: "특이사항", fieldName: "특이사항", header: { text: "특이사항" }, editable: false, width: 250, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "공정비고", fieldName: "공정비고", header: { text: "E/T RATE" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
	],

	layout: ["lotNo","작업자","shift","설비약명",		
		{
			name: "작업시작",
			items: ["작업시작", "시작시각"],
			header: { text: "작업시작" },
		},
		{
			name: "작업종료",
			items: ["작업종료", "종료시각"],
			header: { text: "작업종료" },
		},
		{
			name: "생산실적",
			items: ["투입수량", "양품수량", "불량수량", "수율"],
			header: { text: "생산실적" },
		},
		"특기사항","불량입력","특이사항","공정비고"	
	],
}

module.exports = grid;