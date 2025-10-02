/*
* FRONT INFO1
*/
const { ValueType } = require('realgrid');

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
		rowIndicator: { visible: false },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		// { fieldName: '공정코드', dataType: ValueType.TEXT },
		// { fieldName: 'lotrunId', dataType: ValueType.TEXT },
		// { fieldName: 'blNo', dataType: ValueType.TEXT },
		// { fieldName: 'machineCode', dataType: ValueType.TEXT },
		// { fieldName: '불량구분', dataType: ValueType.TEXT },
		// { fieldName: '불량위치', dataType: ValueType.TEXT },
		// { fieldName: '불량수량', dataType: ValueType.TEXT },
		// { fieldName: '불량코드', dataType: ValueType.TEXT },
		// { fieldName: '검사시각', dataType: ValueType.TEXT },
		// { fieldName: 'plus', dataType: ValueType.TEXT },
		// { fieldName: 'minus', dataType: ValueType.TEXT },
	],

	columns: [
		// { name: "불량위치", fieldName: "불량위치", header: { text: "위치" }, editable: false },
		// { name: "minus", fieldName: "minus", header: { text: "MINUS" }, editable: false,
		// 	renderer: {
		// 		type: "icon",
		// 		iconCallback: function (grid, cell) {						
		// 			return require('@assets/images/ico_pw.png');
		// 		},
		// 		iconLocation: "center",
		// 		iconHeight: 15,
		// 		iconWidth: 10
		// 	},
		// },
		// { name: "불량수량", fieldName: "불량수량", header: { text: "수량" }, editable: false },
		// { name: "plus", fieldName: "plus", header: { text: "PLUS" }, editable: false,
		// 	renderer: {
		// 		type: "icon",
		// 		iconCallback: function (grid, cell) {						
		// 			return require('@assets/images/ico_pw.png');
		// 		},
		// 		iconLocation: "center",
		// 		iconHeight: 15,
		// 		iconWidth: 10
		// 	},
		// },
	],

	layout: [
		// "불량위치",
		// {
		// 	name: "불량수량",
		// 	direction: "vertical",
		// 	width: 200,
		// 	items: [
		// 		{
		// 			name: "info1",
		// 			direction: "horizontal",
		// 			hideChildHeaders: true,
		// 			items: [
		// 				{column: "minus", width: 50},
		// 				{column: "불량수량", width: 100},
		// 				{column: "plus", width: 50}
		// 			],
		// 			header: {
		// 				text: "불량수량",
		// 			}
		// 		}				
		// 	],
		// 	header: {visible: false}
		// }
	],
}

module.exports = grid;