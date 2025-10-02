/*
* 제조 실적 입력 > Lot Run Card 발행 > Lot Card 발행_1
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: true },
		copy: { enabled: true, singleMode: false },
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
		headerSummaries: {visible:true, items:[
			{
			  //styleName: "blue-column",   개별 css 스타일 적용 필요시
			  height: 25
			}, 
			{
			  height: 25
			}
		  ]},
		headerSummary: {height:40},
		//hideDeletedRows: {},
		paste: { enabled: false },
		//rowIndicator: {},
		//sorting: {},
		//sortMode: {},
		//stateBar: {},
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'poNo', dataType: ValueType.TEXT },
		{ fieldName: 'poDate', dataType: ValueType.TEXT },
		{ fieldName: '총수량', dataType: ValueType.TEXT },
		{ fieldName: '잔량', dataType: ValueType.TEXT },
		{ fieldName: 'todayInput', dataType: ValueType.TEXT },
		{ fieldName: 'startLabel', dataType: ValueType.TEXT },
		{ fieldName: 'createQty', dataType: ValueType.TEXT },
		{ fieldName: 'remainQty', dataType: ValueType.TEXT },
		{ fieldName: '지시일자', dataType: ValueType.TEXT },
		{ fieldName: '작업구분코드', dataType: ValueType.TEXT },
		{ fieldName: '거래처명', dataType: ValueType.TEXT },
		{ fieldName: '제품모델', dataType: ValueType.TEXT },
		{ fieldName: '제품inch', dataType: ValueType.TEXT },
		{ fieldName: 'glass두께', dataType: ValueType.TEXT },
		{ fieldName: '제품버젼', dataType: ValueType.TEXT },
		{ fieldName: '제품규격', dataType: ValueType.TEXT },
		{ fieldName: '제품품명', dataType: ValueType.TEXT },
		{ fieldName: '제품코드', dataType: ValueType.TEXT },
		{ fieldName: 'lot', dataType: ValueType.TEXT },
		{ fieldName: 'no', dataType: ValueType.TEXT },
		{ fieldName: 'cell', dataType: ValueType.NUMBER },
		{ fieldName: '단위', dataType: ValueType.TEXT },
		{ fieldName: 'sheet', dataType: ValueType.NUMBER },
		{ fieldName: 'block', dataType: ValueType.NUMBER },
		{ fieldName: '발행자', dataType: ValueType.TEXT },
		{ fieldName: '승인자', dataType: ValueType.TEXT },
		{ fieldName: '입고일자', dataType: ValueType.TEXT },
		{ fieldName: '입고시각', dataType: ValueType.TEXT },
		{ fieldName: '작업일자', dataType: ValueType.TEXT },
		{ fieldName: '작업시각', dataType: ValueType.TEXT },
		{ fieldName: '자재품명', dataType: ValueType.TEXT },
		{ fieldName: '자재재질', dataType: ValueType.TEXT },
		{ fieldName: '자재두께', dataType: ValueType.TEXT },
		{ fieldName: '자재규격', dataType: ValueType.TEXT },
		{ fieldName: '자재거래처명', dataType: ValueType.TEXT },
		{ fieldName: '작업구분', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: '출력횟수', dataType: ValueType.NUMBER },
	],

	columns: [
		{ name: 'poNo', fieldName: 'poNo', width: '120', header: { text: 'poNo' }, mergeRule: { criteria: "value" }, autoFilter: true,editable: false },
		{ name: '지시일자', fieldName: '지시일자', width: '80', header: { text: '수주일자' }, editable: false },
		{ 
			name: '제품품명', fieldName: '제품품명', width: '200', header: { text: '제품 품명' }, editable: false,
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
			name: 'lot', fieldName: 'lot', width: '80', header: { text: 'Lot' }, mergeRule: { criteria: "value" }, editable: false,
			"summaries": [
				{
					"text": "LOT",
				}, 
				{
					"numberFormat": "#,##0", 
					valueCallback: function (grid, column, childIndex, summary, value) {
						return grid.getSummary("Lot", "count");
					}
				}
			]
			 
		},
		{
			name: 'no', fieldName: 'no', width: '80', header: { text: 'No' }, editable: false,
			"summaries": [
				{
					"text": "Sheet",
				}, 
				{
					"numberFormat": "#,##0", 
					valueCallback: function (grid, column, childIndex, summary, value) {
						return grid.getSummary("sheet", "sum");
					}
				}
			]
		 },
		{ 
			name: 'cell', fieldName: 'cell', width: '80', header: { text: '수량' }, numberFormat: '#,##0', styleName: 'tr', editable: false,
			"summaries": [
				{
					"text": "Block",
				}, 
				{
					"numberFormat": "#,##0", 
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
			name: '단위', fieldName: '단위', width: '80', header: { text: '단위' }, editable: false,
			"summaries": [
				{
					"text": "Cell",
				}, 
				{
					"numberFormat": "#,##0", 
					valueCallback: function (grid, column, childIndex, summary, value) {
						return grid.getSummary("cell", "sum");
					}
				}
			]
		},
		{ 
			name: 'sheet', fieldName: 'sheet', width: '80', header: { text: '적층수' }, numberFormat: '#,##0', styleName: 'tr', editable: false,
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
			name: '발행자', fieldName: '발행자', width: '80', header: { text: '발행자' }, editable: false,
			"summaries": [
				{
					"text": "LOT",
				}, 
				{
					valueCallback: function (grid, column, childIndex, summary, value) {
						let rows = grid.getCheckedRows(true);
						return rows.length;
					}
				}
			]
		},
		/*
		{ 
			name: '승인자', fieldName: '승인자', width: '80', header: { text: '승인자' }, editable: false,
			"summaries": [
				{
					"text": "수량",
				}, 
				{
					valueCallback: function (grid, column, childIndex, summary, value) {
						let rows = grid.getCheckedItems();
						let sum = 0;
						rows.forEach(elem=>sum+=grid.getValue(elem,"cell"));
						return sum;
					}
				}
			]
		},*/
		{ name: '작업구분', fieldName: '작업구분', width: '100', header: { text: '작업구분' }, editable: false,},
		{ name: '특이사항', fieldName: '특이사항', width: '80', header: { text: '특이사항' }, editable: false, styleName: 'edit tl', placeHolder: "LOT별 특이사항 ..." , },
	]
}

module.exports = grid;