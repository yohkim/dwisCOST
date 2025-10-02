/*
* 제조 실적 입력 > Rework > M-BOX 관리 > M-CST 관리리
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');
const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: true },
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
			editable: true ,
			commitByCell:true,
		},
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: false },
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: true,eventEachRow:true },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'mboxNo', dataType: ValueType.TEXT },
		{ fieldName: 'manager', dataType: ValueType.TEXT },
		{ fieldName: 'approver', dataType: ValueType.TEXT },
		{ fieldName: 'scrapCode', dataType: ValueType.TEXT },


		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: 'cstNo', dataType: ValueType.TEXT },
		{ fieldName: 'cell', dataType: ValueType.TEXT },
		{ fieldName: 'agb', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		
	],

	columns: [
		{ name: 'runNo', fieldName: 'runNo', width: '200', header: { text: 'RUN NO' },styleName:"edit tl"},
		{ name: 'cstNo', fieldName: 'cstNo', width: '150', header: { text: 'CST NO' },styleName:"edit tl"},
		{ name: 'cell', fieldName: 'cell', width: '150', header: { text: 'CELL' },styleName:"edit tr"},
		{ name: 'agb', fieldName: 'agb', width: '150', header: { text: 'AGB' },styleName:"edit tl",editor: {type: "dropdown"}},
		{ name: '특이사항', fieldName: '특이사항', width: '150', header: { text: '특이사항' },styleName:"edit tl"},
	],
	
}
module.exports = grid;