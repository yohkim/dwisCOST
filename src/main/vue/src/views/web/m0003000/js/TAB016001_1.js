/*
* 제조 실적 입력 > Lot Run Card 발행 > Lot Card 발행_1
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: true ,exclusive:true},
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "fill" },
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
		headerSummaries: {visible:true, items:[
			{
			  //styleName: "blue-column",   개별 css 스타일 적용 필요시
			  height: 25
			}, 
			{
			  height: 25
			}
		  ]},
		//hideDeletedRows: {},
		paste: { enabled: false },
		//rowIndicator: {},
		//sorting: {},
		//sortMode: {},
		stateBar: {visible:false},
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '생성일자', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: 'runCell', dataType: ValueType.NUMBER },
		{ fieldName: '특이사항', dataType: ValueType.TEXT},
		{ fieldName: 'lotNo1', dataType: ValueType.TEXT },
		{ fieldName: 'cell1', dataType: ValueType.NUMBER },
		{ fieldName: 'lotNo2', dataType: ValueType.TEXT },
		{ fieldName: 'cell2', dataType: ValueType.NUMBER },
		{ fieldName: 'lotNo3', dataType: ValueType.TEXT },
		{ fieldName: 'cell3', dataType: ValueType.NUMBER },
		{ fieldName: 'lotNo4', dataType: ValueType.TEXT },
		{ fieldName: 'cell4', dataType: ValueType.NUMBER },
		{ fieldName: 'lotNo5', dataType: ValueType.TEXT },
		{ fieldName: 'cell5', dataType: ValueType.NUMBER },
		{ fieldName: 'lotNo6', dataType: ValueType.TEXT },
		{ fieldName: 'cell6', dataType: ValueType.NUMBER },
		{ fieldName: 'lotNo7', dataType: ValueType.TEXT },
		{ fieldName: 'cell7', dataType: ValueType.NUMBER },
		{ fieldName: 'lotNo8', dataType: ValueType.TEXT },
		{ fieldName: 'cell8', dataType: ValueType.NUMBER },
		{ fieldName: 'lotNo9', dataType: ValueType.TEXT },
		{ fieldName: 'cell9', dataType: ValueType.NUMBER },
		{ fieldName: 'lotNo10', dataType: ValueType.TEXT },
		{ fieldName: 'cell10', dataType: ValueType.NUMBER },
		{ fieldName: 'runBlock', dataType: ValueType.NUMBER },
	],

	columns: [
		{ 
			name: '생성일자', fieldName: '생성일자', width: '100', header: { text: '생성일자' }, autoFilter: true,editable: false, 
			"summaries": [
				{
					"text": " ",
				}, 
				{
					"text": "선택수량 ==>  ",
				}
			]
		},
		{ 
			name: 'runNo', fieldName: 'runNo', width: '120', header: { text: 'NO' }, editable: false,
			"summaries": [
				{
					"text": "RUN",
				}, 
				{
					"numberFormat": "#,##0",
					valueCallback: function (grid, column, childIndex, summary, value) {
						let rows = grid.getCheckedRows(true);
						return rows.length;
					}
				}
			]
	 	},
		{
			name: 'runCell', fieldName: 'runCell', width: '50', header: { text: '수량'}, numberFormat: '#,##0', styleName: 'tr',
			"summaries": [
				{
					"text": "Block",
				}, 
				{
					"numberFormat": "#,##0",
					valueCallback: function (grid, column, childIndex, summary, value) {
						let rows = grid.getCheckedItems();
						let sum = 0;
						rows.forEach(elem=>sum+=grid.getValue(elem,"runBlock"));
						return sum;
					}
				}
			]
		},
		{
			name: '특이사항', fieldName: '특이사항', width: '120', header: { text: '특이사항' }, editable: true ,
			"summaries": [
				{
					"text": "Cell",
				}, 
				{
					"numberFormat": "#,##0",
					valueCallback: function (grid, column, childIndex, summary, value) {
						let rows = grid.getCheckedItems();
						let sum = 0;
						rows.forEach(elem=>sum+=grid.getValue(elem,"runCell"));
						return sum;
					}
				}
			],
			renderer: { showTooltip:true },
		},
		{ name: 'lotNo1', fieldName: 'lotNo1', width: '120', header: { text: 'NO' }, editable: false ,},
		{ name: 'cell1', fieldName: 'cell1', width: '50', header: { text: '수량' }, numberFormat: '#,##0', styleName: 'tr',},
		{ name: 'lotNo2', fieldName: 'lotNo2', width: '120', header: { text: 'NO' }, editable: false },
		{ name: 'cell2', fieldName: 'cell2', width: '50', header: { text: '수량' }, numberFormat: '#,##0', styleName: 'tr',},
		{ name: 'lotNo3', fieldName: 'lotNo3', width: '120', header: { text: 'NO' }, editable: false },
		{ name: 'cell3', fieldName: 'cell3', width: '50', header: { text: '수량' }, numberFormat: '#,##0', styleName: 'tr',},
		{ name: 'lotNo4', fieldName: 'lotNo4', width: '120', header: { text: 'NO' }, editable: false },
		{ name: 'cell4', fieldName: 'cell4', width: '50', header: { text: '수량' }, numberFormat: '#,##0', styleName: 'tr',},
		{ name: 'lotNo5', fieldName: 'lotNo5', width: '120', header: { text: 'NO' }, editable: false },
		{ name: 'cell5', fieldName: 'cell5', width: '50', header: { text: '수량' }, numberFormat: '#,##0', styleName: 'tr',},
		{ name: 'lotNo6', fieldName: 'lotNo6', width: '120', header: { text: 'NO' }, editable: false },
		{ name: 'cell6', fieldName: 'cell6', width: '50', header: { text: '수량' }, numberFormat: '#,##0', styleName: 'tr',},
		{ name: 'lotNo7', fieldName: 'lotNo7', width: '120', header: { text: 'NO' }, editable: false },
		{ name: 'cell7', fieldName: 'cell7', width: '50', header: { text: '수량' }, numberFormat: '#,##0', styleName: 'tr',},
		{ name: 'lotNo8', fieldName: 'lotNo8', width: '120', header: { text: 'NO' }, editable: false },
		{ name: 'cell8', fieldName: 'cell8', width: '50', header: { text: '수량' }, numberFormat: '#,##0', styleName: 'tr',},
		{ name: 'lotNo9', fieldName: 'lotNo9', width: '120', header: { text: 'NO' }, editable: false },
		{ name: 'cell9', fieldName: 'cell9', width: '50', header: { text: '수량' }, numberFormat: '#,##0', styleName: 'tr',},
		{ name: 'lotNo10', fieldName: 'lotNo10', width: '120', header: { text: 'NO' }, editable: false },
		{ name: 'cell10', fieldName: 'cell10', width: '50', header: { text: '수량' }, numberFormat: '#,##0', styleName: 'tr',},
	],
	layout: [
		{
			name: "RUN",
			direction: "horizontal",
			items: ["생성일자","runNo","runCell","특이사항"],
			header: { text: "RUN" },
		},		
		{
			name: "LOT1",
			direction: "horizontal",
			items: ["lotNo1","cell1"],
			header: { text: "LOT 1" },
		},
		{
			name: "LOT2",
			direction: "horizontal",
			items: ["lotNo2","cell2"],
			header: { text: "LOT 2" },
		},
		{
			name: "LOT3",
			direction: "horizontal",
			items: ["lotNo3","cell3"],
			header: { text: "LOT 3" },
		},
		{
			name: "LOT4",
			direction: "horizontal",
			items: ["lotNo4","cell4"],
			header: { text: "LOT 4" },
		},
		{
			name: "LOT5",
			direction: "horizontal",
			items: ["lotNo5","cell5"],
			header: { text: "LOT 5" },
		},
		{
			name: "LOT6",
			direction: "horizontal",
			items: ["lotNo6","cell6"],
			header: { text: "LOT 6" },
		},
		{
			name: "LOT7",
			direction: "horizontal",
			items: ["lotNo7","cell7"],
			header: { text: "LOT 7" },
		},
		{
			name: "LOT8",
			direction: "horizontal",
			items: ["lotNo8","cell8"],
			header: { text: "LOT 8" },
		},
		{
			name: "LOT9",
			direction: "horizontal",
			items: ["lotNo9","cell9"],
			header: { text: "LOT 9" },
		},
		{
			name: "LOT10",
			direction: "horizontal",
			items: ["lotNo10","cell10"],
			header: { text: "LOT 10" },
		},
	],
}

module.exports = grid;