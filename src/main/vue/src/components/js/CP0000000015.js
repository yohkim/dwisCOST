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
		{ fieldName: 'startTime', dataType: ValueType.TEXT },
		{ fieldName: 'endTime', dataType: ValueType.TEXT },
		{ fieldName: 'filmId상부', dataType: ValueType.TEXT },
		{ fieldName: 'filmId하부', dataType: ValueType.TEXT },
		{ fieldName: 'mcrWrite', dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'cstNo', fieldName: 'cstNo', width: 110, header: { text: 'cst_no' }, autoFilter: true, styleName: 'tl' },		
		{ name: 'cellId', fieldName: 'cellId', width: 250, header: { text: 'cell_id' }, autoFilter: true, styleName: 'tl' },		
		{ name: 'startTime', fieldName: 'startTime', width: 200, header: { text: 'start_time' }, autoFilter: true, styleName: 'tl',
			displayCallback: rgDisplayDateTime1
		},
		{ name: 'endTime', fieldName: 'endTime', width: 200, header: { text: 'end_time' }, autoFilter: true, styleName: 'tl',
			displayCallback: rgDisplayDateTime1
		},
		{ name: 'filmId상부', fieldName: 'filmId상부', width: 250, header: { text: 'film_id_상부' }, autoFilter: true, styleName: 'tl' },
		{ name: 'filmId하부', fieldName: 'filmId하부', width: 250, header: { text: 'film_id_하부' }, autoFilter: true, styleName: 'tl' },
		{ name: 'mcrWrite', fieldName: 'mcrWrite', width: 250, header: { text: 'mcr_write' }, autoFilter: true, styleName: 'tl' },
	],
}

module.exports = grid;