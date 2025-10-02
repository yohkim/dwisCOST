/*
* cell_id 리스트트
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');
const { rgDisplayDateTime1 } = require('@/utils/dateUtils');

const grid = {
	
	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.NONE,
		},
		edit: { editable: false },
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
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'cstNo', dataType: ValueType.TEXT },
		{ fieldName: 'cellId', dataType: ValueType.TEXT },		
		{ fieldName: '설비호기', dataType: ValueType.TEXT },		
		{ fieldName: '근무조', dataType: ValueType.TEXT },		
		{ fieldName: '작업자', dataType: ValueType.TEXT },		
		{ fieldName: 'startTime', dataType: ValueType.TEXT },
		{ fieldName: 'endTime', dataType: ValueType.TEXT },
		{ fieldName: 'result', dataType: ValueType.TEXT },
		{ fieldName: 'scrap', dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'cstNo', fieldName: 'cstNo', width: 110, header: { text: 'CST_NO' }, autoFilter: true, styleName: 'tl' },		
		{ name: 'cellId', fieldName: 'cellId', width: 250, header: { text: 'CELL_ID' }, autoFilter: true, styleName: 'tl' },		
		{ name: '설비호기', fieldName: '설비호기', width: 100, header: { text: '설비호기' }, autoFilter: true, styleName: 'tl' },		
		{ name: '근무조', fieldName: '근무조', width: 80, header: { text: '근무조' }, autoFilter: true, styleName: 'tl' },
	    { name: '작업자', fieldName: '작업자', width: 80, header: { text: '작업자' }, autoFilter: true, styleName: 'tl' },
    
		{ name: 'startTime', fieldName: 'startTime', width: 200, header: { text: 'Start_Time' }, autoFilter: true, styleName: 'tl',
			displayCallback: rgDisplayDateTime1
		},
		{ name: 'endTime', fieldName: 'endTime', width: 200, header: { text: 'End_Time' }, autoFilter: true, styleName: 'tl',
			displayCallback: rgDisplayDateTime1
		},
		{ name: 'result', fieldName: 'result', width: 80, header: { text: 'RESULT' }, autoFilter: true, styleName: 'tl' },
    	{ name: 'scrap', fieldName: 'scrap', width: 80, header: { text: 'SCRAP' }, autoFilter: true, styleName: 'tl' },
	],
}

module.exports = grid;