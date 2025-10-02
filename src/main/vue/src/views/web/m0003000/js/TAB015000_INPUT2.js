/*
* 제조 실적 입력 > Lot Run Card 발행 > Lot Card 발행_입력단
*/
const { ValueType } = require('realgrid');

editCallback=function(grid, dataCell){
	var ret = {}
	if(dataCell.dataColumn.editable)
		ret.styleName='edit';

	return ret;
};

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill" },
		edit: { editable: true,commitByCell:true },
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
		rowIndicator: {visible:false},
		sorting: {enabled: false},
		//sortMode: {},
		stateBar: {visible:false},
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '거래처명', dataType: ValueType.TEXT },
		{ fieldName: '제품모델', dataType: ValueType.TEXT },
		{ fieldName: '제품inch', dataType: ValueType.TEXT },
		{ fieldName: '제품버젼', dataType: ValueType.TEXT },
		{ fieldName: '제품규격', dataType: ValueType.TEXT },
		{ fieldName: '자재품명', dataType: ValueType.TEXT },
		{ fieldName: '자재재질', dataType: ValueType.TEXT },
		{ fieldName: '자재두께', dataType: ValueType.TEXT },
		{ fieldName: '자재규격', dataType: ValueType.TEXT },
		{ fieldName: '자재거래처명', dataType: ValueType.TEXT },
		{ fieldName: '입고일자', dataType: ValueType.TEXT },
		//{ fieldName: '입고시각', dataType: ValueType.TEXT },
		{ fieldName: '작업일자', dataType: ValueType.TEXT },
		//{ fieldName: '작업시각', dataType: ValueType.TEXT },
		{ fieldName: '발행자', dataType: ValueType.TEXT },
		{ fieldName: '승인자', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT }
	],

	columns: [
		{ name: '거래처명', fieldName: '거래처명', width: '80', header: { text: '거래처명' }, editable: false },
		{ name: '제품모델', fieldName: '제품모델', width: '80', header: { text: '제품모델' }, editable: false },
		{ name: '제품inch', fieldName: '제품inch', width: '80', header: { text: '제품inch' }, editable: false },
		{ name: '제품버젼', fieldName: '제품버젼', width: '80', header: { text: '제품버젼' }, editable: false },
		{ name: '제품규격', fieldName: '제품규격', width: '80', header: { text: '제품규격' }, editable: false },
		{ name: '자재품명', fieldName: '자재품명', width: '80', header: { text: '자재품명' }, editable: false,styleCallback:editCallback },
		{ name: '자재재질', fieldName: '자재재질', width: '80', header: { text: '자재재질' }, editable: false },
		{ name: '자재두께', fieldName: '자재두께', width: '80', header: { text: '자재두께' }, editable: false },
		{ name: '자재규격', fieldName: '자재규격', width: '80', header: { text: '자재규격' }, editable: false },
		{ name: '자재거래처명', fieldName: '자재거래처명', width: '80', header: { text: '자재거래처명' }, editable: false },
		/*
		{ name: '입고일자', fieldName: '입고일자', width: '80', header: { text: '입고일자' }, editable: true,
			editor: {
				"type": "date",
				"datetimeFormat": "yyyy.MM.dd",
				"commitOnSelect": true,
				"mask": {
				"editMask": "9999/99/99",
				"placeHolder":"yyyy/MM/dd", 
				"includedFormat": true
				}
			},
		},*/
		{ name: '입고일자', fieldName: '입고일자', width: '160', header: { text: '발행일시' }, editable: false,
			"editor": {
				"type": "date",
				"timeSelectType": "second",
				"datetimeFormat": "yyyy-MM-dd HH:mm:ss",
				"commitOnSelect": true,
			},
			"datetimeFormat": "yyyy/MM/dd HH:mm:ss",
		
		},
		/*
		{ name: '작업일자', fieldName: '작업일자', width: '80', header: { text: '작업일자' }, editable: false,
			editor: {
				"type": "date",
				"datetimeFormat": "yyyy.MM.dd",
				"commitOnSelect": true,
				"mask": {
				"editMask": "9999/99/99",
				"placeHolder":"yyyy/MM/dd", 
				"includedFormat": true
				}
			},
		},*/
		{ name: '작업일자', fieldName: '작업일자', width: '160', header: { text: '작업일자' }, editable: false,styleCallback:editCallback,
			"editor": {
				"type": "date",
				"timeSelectType": "second",
				"datetimeFormat": "yyyy-MM-dd HH:mm:ss",
				"commitOnSelect": true,
			},
			"datetimeFormat": "yyyy/MM/dd HH:mm:ss",
		},
		{ name: '발행자', fieldName: '발행자', width: '80', header: { text: '발행자' }, editable: false,styleCallback:editCallback },
		{ name: '승인자', fieldName: '승인자', width: '80', header: { text: '승인자' }, editable: false,styleCallback:editCallback },
		{ name: '특이사항', fieldName: '특이사항', width: '80', header: { text: '특이사항' }, editable: true,styleCallback:editCallback, styleName: 'edit tl',
			placeHolder: "전체LOT 특이사항 입력..." ,  },
	],

	layout: [
		{
			name: "제품현황",
			direction: "horizontal",
			items: ["거래처명", "제품모델","제품inch","제품버젼","제품규격"],
			header: { text: "제품현황" },
		},		
		{
			name: "원자재정보",
			direction: "horizontal",
			items: ["자재품명", "자재재질","자재두께","자재규격","자재거래처명"],
			header: { text: "원자재정보" },
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
						//"입고시각"
						
					],
					header: { text: "In" },
				},
				"발행자",
			],
			header: { text: "Fab #1 Schedule" },
		},
		"특이사항"	
	],
}

module.exports = grid;