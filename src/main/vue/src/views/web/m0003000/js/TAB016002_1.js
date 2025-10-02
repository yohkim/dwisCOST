/*
* 제조 실적 입력 > Lot Run Card 발행 > Run Card 발행 > 미생성분
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: false, fitStyle: "evenFill" },
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
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: {visible:false},
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: 'sheet', dataType: ValueType.NUMBER },
		{ fieldName: 'block', dataType: ValueType.NUMBER },
		{ fieldName: 'cell', dataType: ValueType.NUMBER },
		{ fieldName: 'runNo1', dataType: ValueType.TEXT },
		{ fieldName: 'runCell1', dataType: ValueType.NUMBER },
		{ fieldName: 'runNo2', dataType: ValueType.TEXT },
		{ fieldName: 'runCell2', dataType: ValueType.NUMBER },
		{ fieldName: '기준', dataType: ValueType.BOOLEAN },
		{ fieldName: '선택', dataType: ValueType.BOOLEAN },
		{ fieldName: '입고일자', dataType: ValueType.TEXT },
		{ fieldName: '작업일자', dataType: ValueType.TEXT },
		{ fieldName: '발행자', dataType: ValueType.TEXT },
		{ fieldName: '승인자', dataType: ValueType.TEXT },
		{ fieldName: '지시일자', dataType: ValueType.TEXT },
		{ fieldName: '적층설비', dataType: ValueType.TEXT },
		{ fieldName: '가공설비', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT }
	],

	columns: [
		{ 
			name: 'lotNo', fieldName: 'lotNo', width: '150', header: { text: 'Lot No' }, editable: false,
			"summaries": [
				{
					"text": " ",
				},
				{
					"text": "조회수량 ==>  ",
				}
			]
		},
		{
			name: 'sheet', fieldName: 'sheet', width: '80', header: { text: 'Sheet' }, numberFormat: '#,##0', styleName: 'tr', editable: false,
			"summaries": [
				{
					"text": "Lot",
				}, 
				{
					valueCallback: function (grid, column, childIndex, summary, value) {
						return grid.getSummary("lotNo", "count");
					}
				}
			]
			 
		},
		{ 
			name: 'block', fieldName: 'block', width: '80', header: { text: 'Block' }, numberFormat: '#,##0', styleName: 'tr', editable: false,
			"summaries": [
				{
					"text": "Block",
				}, 
				{
					valueCallback: function (grid, column, childIndex, summary, value) {
						let dataProvider = grid.getDataSource();
						let sum = 0;
						dataProvider.getFieldValues("block",0,-1).forEach(element => {
							sum+=element;
						});
						return sum;
					}
				}
			]
		},
		{ 
			name: 'cell', fieldName: 'cell', width: '80', header: { text: 'Cell' }, numberFormat: '#,##0', styleName: 'tr', editable: false,
			"summaries": [
				{
					"text": "Cell",
				}, 
				{
					valueCallback: function (grid, column, childIndex, summary, value) {
						return grid.getSummary("cell", "sum");
					}
				}
			]
		},
		{ 
			name: 'runNo1', fieldName: 'runNo1', width: '150', header: { text: 'RUN_NO' }, editable: false,
			"summaries": [
				{
					"text": " ",
				}, 
				{
					"text": "생성현황 ==>  ",
				}
			]
		},
		{ 
			name: 'runCell1', fieldName: 'runCell1', width: '80', header: { text: 'Cell' }, numberFormat: '#,##0', styleName: 'tr', editable: false,
			"summaries": [
				{
					"text": "Run Size",
				}, 
				{
					valueCallback: function (grid, column, childIndex, summary, value) {
						return grid.getSummary("cell1", "sum");
					}
				}
			]
		},
		{ name: 'runNo2', fieldName: 'runNo2', width: '150', header: { text: 'RUN_NO' }, editable: false,},
		{ name: 'runCell2', fieldName: 'runCell2', width: '80', header: { text: 'Cell' }, numberFormat: '#,##0', styleName: 'tr', editable: false,},
		/*
		{ 
			name: '기준', fieldName: '기준', width: '50', header: { text: '기준' }, editable: false,
			renderer: {
				type: "check",
			},
		},
		*/
		{
			 name: '선택', fieldName: '선택', width: '50', header: { text: '선택'}, editable: false,checked:false,
			 renderer: {
				type: "check",
			},
		},
		{ name: '입고일자', fieldName: '입고일자', width: '160', header: { text: '발행일시' }, editable: false,
			"editor": {
				"type": "date",
				"timeSelectType": "second",
				"datetimeFormat": "yyyy-MM-dd HH:mm:ss",
				"commitOnSelect": true,
			},
			"datetimeFormat": "yyyy/MM/dd HH:mm:ss",
		
		},
		{ name: '작업일자', fieldName: '작업일자', width: '160', header: { text: '작업일자' }, editable: true,
			"editor": {
				"type": "date",
				"timeSelectType": "second",
				"datetimeFormat": "yyyy-MM-dd HH:mm:ss",
				"commitOnSelect": true,
			},
			"datetimeFormat": "yyyy/MM/dd HH:mm:ss",
		},
		{ name: '발행자', fieldName: '발행자', width: '80', header: { text: '발행자' }, editable: false},
		{ name: '승인자', fieldName: '승인자', width: '80', header: { text: '승인자' }, editable: false,styleName:'edit'},
		{ name: '지시일자', fieldName: '지시일자', width: '100', header: { text: '지시일자' }, editable: false,},
		{ name: '적층설비', fieldName: '적층설비', width: '80', header: { text: '적층설비' }, editable: false,},
		{ name: '가공설비', fieldName: '가공설비', width: '80', header: { text: '가공설비' }, editable: false,},
		{ name: '특이사항', fieldName: '특이사항', width: '80', header: { text: '특이사항' }, editable: false,},
	],
	layout: [
		{
			name: "제품현황",
			direction: "horizontal",
			items: ["lotNo",
				{
					name: "제품현황 수량",
					direction: "horizontal",
					items: ["sheet","block","cell"],
					header: { text: "수량" },
				},
			],
			header: { text: "제품현황" },
		},		
		{
			name: "RunNo1",
			direction: "horizontal",
			items: ["runNo1","runCell1"],
			header: { text: "RUN NO1" },
		},
		{
			name: "RunNo2",
			direction: "horizontal",
			items: ["runNo2","runCell2"],
			header: { text: "RUN NO2" },
		},
		//"기준",
		"선택",
		{
			name: "Schedule",
			direction: "horizontal",
			items: [
				"입고일자",
				"발행자",
				//"승인자"
			],
			header: { text: "Fab #2 Schedule" },
		},
		//"지시일자",
		"적층설비",
		"가공설비",
		"특이사항"	
	],
	//생성 처리후 레이아웃
	layoutCreated:[
		{
			name: "제품현황",
			direction: "horizontal",
			items: ["lotNo",
				{
					name: "제품현황 수량",
					direction: "horizontal",
					items: ["sheet","block","cell"],
					header: { text: "수량" },
				},
			],
			header: { text: "제품현황" },
		},		
		{
			name: "RunNo1",
			direction: "horizontal",
			items: ["runNo1","runCell1"],
			header: { text: "RUN NO1" },
		},
		{
			name: "RunNo2",
			direction: "horizontal",
			items: ["runNo2","runCell2"],
			header: { text: "RUN NO2" },
		},
		{
			name: "Schedule",
			direction: "horizontal",
			items: [
				{
					name: "In",
					direction: "horizontal",
					items: [
						"입고일자",
					],
					header: { text: "In" },
				},
				/*
				{
					name: "Out",
					direction: "horizontal",
					items: [
						"작업일자",
					],
					header: { text: "Out" },
					
				},*/
				"발행자",
				//"승인자"
			],
			header: { text: "Fab #2 Schedule" },
		},
		//"지시일자",
		"적층설비",
		"가공설비",
		"특이사항"	
	],
}

module.exports = grid;