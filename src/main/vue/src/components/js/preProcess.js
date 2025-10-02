const { ValueType, SelectionStyle, SelectionMode, GridFitStyle, SyncGridHeight } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false,exclusive:true },
		copy: { enabled: true },
		//dataDrop: {},
		display: { 
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
			syncGridHeight: SyncGridHeight.ALWAYS,
		},
		edit: { editable: false },
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
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'cstNo', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: '차수', dataType: ValueType.INT },
		{ fieldName: 'cstCell', dataType: ValueType.NUMBER },
		{ fieldName: 'f불량수량', dataType: ValueType.NUMBER },
		{ fieldName: '불량수량', dataType: ValueType.NUMBER },
		{ fieldName: 'machineCode', dataType: ValueType.TEXT },
		{ fieldName: '불량입력', dataType: ValueType.TEXT },
		{ fieldName: 'pkey', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'cstNo', fieldName: 'cstNo', width: '200', header: { text: 'CST NO' }, styleName: 'tl' },
		{ name: 'cstCell', fieldName: 'cstCell', width: '100', header: { text: '입고수량' },numberFormat: "#,##0", footer: {expression: "sum"}, styleName: 'tr',
			editor:  { 
				maxLength: 0 , 
				type: 'number',
				editFormat: '#,##0',
				min: 1,
				positiveOnly: true,
			}, 
		},
		{ name: 'f불량수량', fieldName: 'f불량수량', width: '100', header: { text: '불량수량' },numberFormat: "#,##0", footer: {expression: "sum"}, styleName: 'tr'},
		{ name: "불량입력", fieldName: "불량입력", header: { text: "item" },
			renderer:{
				type:"html",
				callback: function(grid, cell, w, h) {
					const ds = grid.getDataSource();
					const jsonData = ds.getJsonRow(cell.index.itemIndex);
					const str = '<button type="button" class="'+(jsonData['불량수량'] != jsonData['f불량수량'] ? 'btn_error' : 'btn_sucess')+'">불량입력</button>';
					return str;
				}
			},
		},
		{ name: "불량입력1", fieldName: "불량입력", header: { text: "Bare Cell" },
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					const ds = grid.getDataSource();
					const jsonData = ds.getJsonRow(cell.index.itemIndex);
					const str = '<button type="button" class="'+(jsonData['불량수량'] != jsonData['f불량수량'] ? 'btn_error' : 'btn_sucess')+'">불량입력</button>';
					return str;
				}
			},
		},
	],
	layout: [
		{
			name: "입고현황",
			items: ["cstNo","cstCell","f불량수량","불량입력"],
			header: { text: "입고현황" },      
		},
	],

	layout1: [
		{
			name: "입고현황",
			items: ["cstNo","cstCell"],
			header: { text: "입고현황" },      
		},
	],

	layout2: [
		{
			name: "입고현황",
			items: ["cstNo","cstCell","f불량수량","불량입력1"],
			header: { text: "입고현황" },      
		},
	],
}

module.exports = grid;