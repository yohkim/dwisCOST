
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle,SyncGridHeight } = require('realgrid');
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
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,	
			syncGridHeight:SyncGridHeight.ALWAYS,
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
		rowIndicator: { visible: false },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'mboxNo', dataType: ValueType.TEXT },
		{ fieldName: 'befRunno', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },		
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'cstNo', dataType: ValueType.TEXT },
		{ fieldName: 'cstCell', dataType: ValueType.NUMBER },
		{ fieldName: '차수', dataType: ValueType.INT },
		{ fieldName: 'f불량수량', dataType: ValueType.NUMBER },
		{ fieldName: '불량수량', dataType: ValueType.NUMBER },
		{ fieldName: 'machineCode', dataType: ValueType.TEXT },
		{ fieldName: '불량입력', dataType: ValueType.TEXT },
		{ fieldName: 'pkey', dataType: ValueType.TEXT },
		{ fieldName: 'tCstno', dataType: ValueType.TEXT },

		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'mboxNo', fieldName: 'mboxNo', width: '130', header: { text: 'M-BOX NO' } },	
		{ name: 'befRunno', fieldName: 'befRunno', width: '130', header: { text: 'Bef-RUN NO' }},	
		{ name: 'cstNo', fieldName: 'cstNo', width: '90', header: { text: 'CST NO' }},
		{ name: 'cstCell', fieldName: 'cstCell', width: '80', header: { text: '입고수량' },numberFormat: "#,##0", footer: {expression: "sum"}, styleName: 'tr',
			editor:  { 
				maxLength: 0 , 
				type: 'number',
				editFormat: '#,##0',
				min: 1,
				positiveOnly: true,
			}, 
		},
		{ name: 'f불량수량', fieldName: 'f불량수량', width: '80', header: { text: '불량수량' },numberFormat: "#,##0", footer: {expression: "sum"}, styleName: 'tr'},
		{ name: "불량입력", fieldName: "불량입력", header: { text: "" },
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
			items: ["mboxNo","befRunno","cstNo","cstCell","f불량수량","불량입력"],
			header: { text: "입고현황" },      
		},
	],
}
module.exports = grid;