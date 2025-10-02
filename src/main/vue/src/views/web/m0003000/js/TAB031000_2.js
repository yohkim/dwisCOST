/*
* 제조 실적 입력 > Back#1 > 생산실적입력 Grid > 박리 후 세정
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, SyncGridHeight, RowMaskType} = require('realgrid');
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
		paste: { enabled: true,enableAppend:false },
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
		{ fieldName: 'inCstno', dataType: ValueType.TEXT },
		
		{ fieldName: '불량합계', dataType: ValueType.NUMBER},
		{ fieldName: '불량입력', dataType: ValueType.TEXT },
		{ fieldName: '차수', dataType: ValueType.NUMBER },
		{ fieldName: 'pkey', dataType: ValueType.TEXT },

		{ fieldName: 'tOrg수량', dataType: ValueType.NUMBER },
		{ fieldName: 'tCnt', dataType: ValueType.NUMBER },
	],
	
	columns: [		
		{ name: 'fCstno', fieldName: 'fCstno', width: '80', header: { text: '투입카세트' },editable:false},
		{ name: '작업시작', fieldName: '작업시작', width: '100', header: { text: 'Date' }, editable:false, displayCallback:rgDisplayDate},
		{ name: '작업종료', fieldName: '작업종료', width: '100', header: { text: 'Date' }, editable:false, displayCallback:rgDisplayDate},
		{ name: '시작시각', fieldName: '시작시각', width: '100', header: { text: 'Time' }, editable:false, displayCallback:rgDisplayTime2 },
		{ name: '종료시각', fieldName: '종료시각', width: '100', header: { text: 'Time' }, editable:false, displayCallback:rgDisplayTime2 },
		{ name: 'tCstno', fieldName: 'tCstno', width: '80', header: { text: '출고카세트' }, editable:false },
		
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

		{ name: '특이사항', fieldName: '특이사항', width: '150', header: { text: '특이사항' },styleName:"edit tl" },
	],
	layout: [
		"fCstno",
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
		"tCstno","t수량","특이사항"
	]
}
module.exports = grid;