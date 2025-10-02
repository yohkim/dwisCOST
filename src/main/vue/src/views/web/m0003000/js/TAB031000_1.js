/*
* 제조 실적 입력 > Back#1 > 생산실적입력 Grid > 박리
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, SummaryMode, SyncGridHeight,RowMaskType} = require('realgrid');
const { rgDisplayDate,rgDisplayTime2 } = require('@/utils/dateUtils.js'); 

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
			selectionStyle: SelectionStyle.SINGLE_ROW,
			selectionMode: SelectionMode.NONE,
			fitStyle: GridFitStyle.EVEN_FILL,
			summaryMode: SummaryMode.AGGREGATE,
			syncGridHeight:SyncGridHeight.ALWAYS,
			rowHoverType: RowMaskType.ROW,
			focusVisible:false,
		},
		edit: { 
			editable: true,
			commitByCell:true,
			movable :true,
		},
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
		paste: { enabled: true,enableAppend:false},
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'f수량', dataType: ValueType.NUMBER },	//field 참조 위치변경 하면 안됨
		{ fieldName: '공장코드', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'seq', dataType: ValueType.TEXT},
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: 'cell', dataType: ValueType.TEXT },
		{ fieldName: 'fCstno', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: 'tCstno', dataType: ValueType.TEXT },
		{ fieldName: 'lotCellCount', dataType: ValueType.NUMBER},
		{ fieldName: 't수량', dataType: ValueType.NUMBER},
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: 'bef공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'nxt공정코드', dataType: ValueType.TEXT },
		{ fieldName: '박리작업구분', dataType: ValueType.TEXT },
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: 'f불량수량', dataType: ValueType.NUMBER },
		{ fieldName: '투입수량', dataType: ValueType.NUMBER },
		{ fieldName: 'machineCode', dataType: ValueType.TEXT },
		{ fieldName: '배출구', dataType: ValueType.TEXT },
		{ fieldName: 'lotCnt', dataType: ValueType.NUMBER },
		{ fieldName: 'cellEqQty', dataType: ValueType.NUMBER },
		{ fieldName: 'inCstno', dataType: ValueType.TEXT },

		{ fieldName: '불량입력', dataType: ValueType.TEXT },
		{ fieldName: 'pkey', dataType: ValueType.TEXT },

		{ fieldName: 'tOrg수량', dataType: ValueType.NUMBER },
		{ fieldName: 'tCnt', dataType: ValueType.NUMBER },

		{ fieldName: '작업조', dataType: ValueType.TEXT },
		{ fieldName: 'shift', dataType: ValueType.TEXT },
		{ fieldName: '설비명', dataType: ValueType.TEXT },
		{ fieldName: 'zone', dataType: ValueType.TEXT },
	],
	
	columns: [
		{ name: 'lotNo', fieldName: 'lotNo', width: '140', header: { text: 'LOT NO' }, editable:false},
		{ name: 'fCstno', fieldName: 'fCstno', width: '80', header: { text: '투입카세트' }, editable:false},
		{ name: 'f수량', fieldName: 'f수량', width: '80', header: { text: '수량' },styleName:"edit tr", numberFormat: "#,##0",footer: {expression: "sum"}},		
		{ name: '작업시작', fieldName: '작업시작', width: '90', header: { text: 'Date' }, editable:false, displayCallback:rgDisplayDate},
		{ name: '작업종료', fieldName: '작업종료', width: '80', header: { text: 'Date' }, editable:false, displayCallback:rgDisplayDate},
		{ name: '시작시각', fieldName: '시작시각', width: '90', header: { text: 'Time' }, editable:false, displayCallback:rgDisplayTime2 },
		{ name: '종료시각', fieldName: '종료시각', width: '80', header: { text: 'Time' }, editable:false, displayCallback:rgDisplayTime2 },
		{ name: 'cellEqQty', fieldName: 'cellEqQty', width: '80', header: { text: '설비수량' },styleName:"tr", editable:false, numberFormat: "#,##0", footer: {expression: "sum"}},
		
		{ name: 'tCstno', fieldName: 'tCstno', width: '80', header: { text: '출고카세트' },editable:false,mergeRule:"value"},
		// { name: 't수량', fieldName: 't수량', width: '80', header: { text: '수량' },styleName:"tr", numberFormat: "#,##0", nanText: "0", footer: {expression: "sum"},mergeRule: "values['tCstno'] + value", editable:false},
		{ name: "t수량", fieldName: "t수량", header: { text: "수량" }, numberFormat: "#,##0", footer: {
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
		}, styleName: "tr", mergeRule: "values['tCstno'] + value", editable:false},
		{ name: '특이사항', fieldName: '특이사항', width: '150', header: { text: '특이사항' }, styleName:"edit tl",showTooltip:true},
		
		{ name: 'shift', fieldName: 'shift', width: '80', header: { text: 'SHIFT' },editable:false},
		{ name: '작업자', fieldName: '작업자', width: '80', header: { text: '작업자' },editable:false},
		{ name: '설비명', fieldName: '설비명', width: '80', header: { text: '설비명' },editable:false},
		{ name: 'zone', fieldName: 'zone', width: '80', header: { text: 'ZONE' },editable:false},
		{ name: '작업조', fieldName: '작업조', width: '80', header: { text: '근무조' },editable:false},
	],
	layout: [
		"lotNo",
		"fCstno","설비명","zone","shift","작업자",
		{
			name: "출고현황",
			direction: "horizontal",
			items: [
				{
					name: "작업시작",
					direction: "horizontal",
					items: ["작업시작","시작시각"],
					header:{ text: "작업시작" }
				},
				{
					name: "작업종료",
					direction: "horizontal",
					items: ["작업종료","종료시각"],
					header:{ text: "작업종료" }
				},				
			],
			header:{ text: "출고현황" }
		},
		"tCstno","cellEqQty","t수량","특이사항"
	]
}
module.exports = grid;