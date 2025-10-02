const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');

const footerLotCellSum = function (grid, column, footerIndex, columnFooter, value) {
	let sumLotNoList = [];
	let s = 0;
	let rds = grid.getDataSource().getJsonRows();
	rds.forEach(el => {
		if(sumLotNoList.indexOf(el['lotNo']) === -1){
			s += el['cell'];
			sumLotNoList.push(el['lotNo']);
		}
	});
	return s;
}

const footerBadCellSum = function (grid, column, footerIndex, columnFooter, value) {
	let sumLotNoList = [];
	let s = 0;
	let rds = grid.getDataSource().getJsonRows();
	rds.forEach(el => {
		if(sumLotNoList.indexOf(el['lotNo']) === -1){
			s += el['불량예상수량'];
			sumLotNoList.push(el['lotNo']);
		}
	});
	return s;
}

const footerCalCellSum = function (grid, column, footerIndex, columnFooter, value) {
	let sumLotNoList = [];
	let s = 0;
	let rds = grid.getDataSource().getJsonRows();
	rds.forEach(el => {
		if(sumLotNoList.indexOf(el['lotNo']) === -1){
			s += el['calCell'];
			sumLotNoList.push(el['lotNo']);
		}
	});
	return s;
}

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
			selectionStyle: SelectionStyle.BLOCK,
			selectionMode: SelectionMode.EXTENDED,
			fitStyle: GridFitStyle.EVEN_FILL,
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
		paste: { enabled: true,eventEachRow:true,enableAppend:false},
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '공장코드', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'seq', dataType: ValueType.TEXT},
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: 'cell', dataType: ValueType.NUMBER },
		{ fieldName: 'adjCell', dataType: ValueType.NUMBER },
		{ fieldName: 'fCstno', dataType: ValueType.TEXT },
		{ fieldName: 'f수량', dataType: ValueType.NUMBER },	
		{ fieldName: '작업자', dataType: ValueType.TEXT },
		{ fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
		{ fieldName: 'tCstno', dataType: ValueType.TEXT },
		{ fieldName: '설비cell수량', dataType: ValueType.NUMBER},
		{ fieldName: 't수량', dataType: ValueType.NUMBER},	//field 참조 위치변경 하면 안됨
		{ fieldName: '불량예상수량', dataType: ValueType.NUMBER},
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: 'bef공정코드', dataType: ValueType.TEXT },
		{ fieldName: 'nxt공정코드', dataType: ValueType.TEXT },
		{ fieldName: '박리작업구분', dataType: ValueType.TEXT },
		{ fieldName: '불량합계', dataType: ValueType.NUMBER},
		{ fieldName: 'cstKey', dataType: ValueType.TEXT },
		
		{ fieldName: '설비호기', dataType: ValueType.TEXT },
		{ fieldName: '근무조', dataType: ValueType.TEXT },
		{ fieldName: 'pkey', dataType: ValueType.TEXT },
		{ fieldName: 'f불량수량', dataType: ValueType.NUMBER },
		
		{ fieldName: 'tOrg수량', dataType: ValueType.NUMBER },
		{ fieldName: 'tCnt', dataType: ValueType.NUMBER },
		{ fieldName: 'calCell', dataType: ValueType.NUMBER},
	],
	columns: [
		{ name: 'lotNo', fieldName: 'lotNo', width: '150', header: { text: 'LOT NO' }, editable:false,footer: {text: "합계"},mergeRule: { criteria: "value" }},
		{ name: 'cell', fieldName: 'cell', width: '60', header: { text: '기준 CELL' } , editable:false, numberFormat: "#,##0",footer: {valueCallback:footerLotCellSum},mergeRule: { criteria: "values['lotNo']" }},
		{ name: 'calCell', fieldName: 'calCell', width: '60', header: { text: 'CELL' } , editable:false, numberFormat: "#,##0",footer: {valueCallback:footerCalCellSum},mergeRule: { criteria: "values['lotNo']" }},
		{ name: 'fCstno', fieldName: 'fCstno', width: '80', header: { text: 'CST NO' }, editable:false},
		{ name: '설비cell수량', fieldName: '설비cell수량', width: '80', header: { text: '설비수량' }, editable:false, numberFormat: "#,##0", footer: {expression: "sum"}},
		{ name: 't수량', fieldName: 't수량', width: '80', header: { text: '양품수량' },styleName:"edit",editable:true, numberFormat: "#,##0", footer: {expression: "sum"}},
		{ name: '불량예상수량', fieldName: '불량예상수량', width: '80', header: { text: '불량예상수량' }, editable:false, numberFormat: "#,##0",footer: {valueCallback:footerBadCellSum}},
	],
	
}
module.exports = grid;