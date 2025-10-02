/*
* BACK#2 Cassette QC INFO3
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, SummaryMode, SyncGridHeight} = require('realgrid');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { 
			columnMovable: false, 
			editItemMerging: true, 
			fitStyle: GridFitStyle.EVEN_FILL, 
			summaryMode: SummaryMode.AGGREGATE,
			syncGridHeight: SyncGridHeight.ALWAYS,
			//editItemMerging: true,
			showInnerFocus: false,
		},
		edit: { editable: false, commitByCell: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		//footer: {height:40},
		footers: { visible: true },
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
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: 'fCstno', dataType: ValueType.TEXT },
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: 'shift', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: 'f수량', dataType: ValueType.NUMBER },
		{ fieldName: 'f양품수량', dataType: ValueType.NUMBER },
		{ fieldName: 'f불량수량', dataType: ValueType.NUMBER },
		{ fieldName: 't양품수량', dataType: ValueType.NUMBER },
		{ fieldName: 't불량수량', dataType: ValueType.NUMBER },
		{ fieldName: '불량입력', dataType: ValueType.TEXT },
		{ fieldName: 't수량', dataType: ValueType.NUMBER },
		{ fieldName: 'tOrg수량', dataType: ValueType.NUMBER },
		{ fieldName: 'tCnt', dataType: ValueType.NUMBER },
		{ fieldName: 'tCstno', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: '차수', dataType: ValueType.INT },
		{ fieldName: 'nxt공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'pkey', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: "fCstno", fieldName: "fCstno", header: { text: "투입카세트" }, renderer: { showTooltip: true }, styleName: "tl" },
		//{ name: "f수량", fieldName: "f수량", header: { text: "수량" }, numberFormat: "#,##0", renderer: { showTooltip: true }, footer: {expression: "sum"} },
		{ name: "작업자", fieldName: "작업자", header: { text: "작업자" }, renderer: { showTooltip: true }, editable: false, styleName: "tl" },
		{ name: "shift", fieldName: "shift", header: { text: "근무조" }, renderer: { showTooltip: true }, editable: false, styleName: "tl" },
		{ name: "작업시작", fieldName: "작업시작", header: { text: "Date" }, renderer: { showTooltip: true }, editable: false, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "시작시각", fieldName: "시작시각", header: { text: "Time" }, renderer: { showTooltip: true }, editable: false, styleName: "tl",
			displayCallback: rgDisplayTime
		},
		{ name: "작업종료", fieldName: "작업종료", header: { text: "Date" }, renderer: { showTooltip: true }, editable: false, styleName: "tl",
			displayCallback: rgDisplayDate
		},
		{ name: "종료시각", fieldName: "종료시각", header: { text: "Time" }, renderer: { showTooltip: true }, editable: false, styleName: "tl",
			displayCallback: rgDisplayTime
		},
		{ name: "t수량", fieldName: "t수량", header: { text: "수량" }, numberFormat: "#,##0", renderer: { showTooltip: true }, footer: {
			valueCallback: function(grid, column, footerIndex, columnFooter, value){
				const ds = grid.getDataSource();
				let jsonRows = ds.getJsonRows(0, -1);
				let rows = [];
				for(jsonRow of jsonRows){
					if(rows.length == 0 || rows.find((el) => el.cstNo == jsonRow["tCstno"]) == undefined){
						rows.push({ cstNo: jsonRow["tCstno"], t수량: jsonRow["t수량"]});
					}
				}
				return rows.reduce((acc, item) => acc + item['t수량'], 0);
			}
		}, styleName: "tr", mergeRule: "values['tCstno'] + value", mergeEdit: true },
		{ name: "tCstno", fieldName: "tCstno", header: { text: "출고카세트" }, renderer: { showTooltip: true }, styleName: "tl", mergeRule: "value" },
		{ name: "tCstno1", fieldName: "tCstno", header: { text: "No." }, styleName: "tc", mergeRule: "value['tCstno']",
			renderer:{				
				type:"html",
				callback: function(grid, cell, w, h) {
					const ds = grid.getDataSource();
					const jsonRows = ds.getJsonRows(0, -1);
					const uniqueCstNos = [];
					for (const row of jsonRows) {
					const cstNo = row["tCstno"];
					if (!uniqueCstNos.includes(cstNo)) {
						uniqueCstNos.push(cstNo);
					}
					}
					const currentCstNo = cell.value;

					const index = uniqueCstNos.indexOf(currentCstNo);
					return index !== -1 ? (index + 1).toString() : "";
				}
			},
		},
		{ name: "불량입력", fieldName: "불량입력", header: { text: "item" },
			renderer:{				
				type:"html",
				callback: function(grid, cell, w, h) {
					const ds = grid.getDataSource();
					const jsonData = ds.getJsonRow(cell.index.itemIndex);
					const str = '<button type="button" class="'+(jsonData['f불량수량'] > 0 ? 'btn_sucess' : 'btn_error')+'">불량입력</button>';
					return str;
				}
			},
		},
		{ name: "특이사항", fieldName: "특이사항", width: "250", header: { text: "특이사항" }, renderer: { showTooltip: true }, styleName: "tl" },
	],

	layout: ["fCstno",
		{
			name: "출고현황",
			direction: "horizontal",
			items: ["작업자", "shift",
				{
					name: "작업시작",
					items: ["작업시작","시작시각"],
					header: { text: "작업시작" },      
				},
				{
					name: "작업종료",
					items: ["작업종료","종료시각"],
					header: { text: "작업종료" },      
				},
			],
			header:{ text: "출고현황" }
		},
		"tCstno","tCstno1","t수량",
		//"불량입력",
		"특이사항"],
}

module.exports = grid;