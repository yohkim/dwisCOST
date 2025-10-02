const { ValueType } = require('realgrid');

const grid = {
	
	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true },
		edit: { editable: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		//footer: {},
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: false },
		//rowIndicator: {},
		//sorting: {},
		//sortMode: {},
		stateBar: { enabled: true },
		//summaryMode: {},
	},

	fields: [
		{
			fieldName: 'Name',
			dataType: ValueType.TEXT,
		},
		{
			fieldName: 'FullName',
			dataType: ValueType.TEXT,
		},
		{
			fieldName: 'Age',
			dataType: ValueType.NUMBER,
		},
		{
			fieldName: 'Company',
			dataType: ValueType.TEXT,
		},
		{
			fieldName: 'Email',
			dataType: ValueType.TEXT,
		},
	],

	columns: [
		{
			name: 'Name',
			fieldName: 'Name',
			width: '80',
			header: {
				text: 'Name',
			},
		},
		{
			name: 'FullName',
			fieldName: 'FullName',
			width: '150',
			header: {
				text: 'Full Name',
			},
		},
		{
			name: 'Company',
			fieldName: 'Company',
			width: '220',
			styles: {
				textAlignment: 'center',
			},
			header: 'Company Name',
		},
		{
			name: 'Age',
			fieldName: 'Age',
			width: '130',
			header: {
				text: 'Age',
			},
			numberFormat: '0',
		},
		{
			name: 'Email',
			fieldName: 'Email',
			width: '300',
			header: {
				text: 'Email',
			},
		},
	],
}

module.exports = grid;