/*
* 작업이력조회>Cell작업이력조회
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false, exclusive: false,syncHeadCheck:true },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "fill" },
		edit: { editable: false, commitByCell: true },
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
		//hideDeletedRows: true,
		//paste: { enabled: true },
		//rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		//stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'cellId', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: '공정명', dataType: ValueType.TEXT },
		{ fieldName: 'machinCode', dataType: ValueType.TEXT },
		{ fieldName: '설비약명', dataType: ValueType.TEXT },
		{ fieldName: 'chamber', dataType: ValueType.TEXT },
		{ fieldName: 'startTime', dataType: ValueType.TEXT },
		{ fieldName: 'endTime', dataType: ValueType.TEXT },
		{ fieldName: 'poNo', dataType: ValueType.TEXT },
		{ fieldName: 'runId', dataType: ValueType.TEXT },
		{ fieldName: 'lotNo', dataType: ValueType.TEXT },
		{ fieldName: 'fromCstno', dataType: ValueType.TEXT },
		{ fieldName: 'fromCst행렬', dataType: ValueType.TEXT },
		{ fieldName: 'toCstno', dataType: ValueType.TEXT },
		{ fieldName: 'toCst행렬', dataType: ValueType.TEXT },
		{ fieldName: 'panelId', dataType: ValueType.TEXT },
		{ fieldName: 'resinId', dataType: ValueType.TEXT },
		{ fieldName: 'filmId상부', dataType: ValueType.TEXT },
		{ fieldName: 'filmId하부', dataType: ValueType.TEXT },
		{ fieldName: 'trayId', dataType: ValueType.TEXT },
		{ fieldName: 'packNo', dataType: ValueType.TEXT },
		{ fieldName: 'palletNo', dataType: ValueType.TEXT },
	],
	
	columns: [
		{ 
			name: 'cellId', 
			fieldName: 'cellId', 
			width: '280', 
			header: { text: 'CELL ID' }, 
			autoFilter: true 
		},
		{ 
			name: '공정코드', 
			fieldName: '공정코드', 
			width: '80', 
			header: { text: '공정코드' }, 
			autoFilter: true 
		},
		{ 
			name: '공정명', 
			fieldName: '공정명', 
			width: '150', 
			header: { text: '공정명' }, 
			autoFilter: true 
		},
		{ 
			name: 'machinCode', 
			fieldName: 'machinCode', 
			width: '80', 
			header: { text: 'Machin Code' }, 
			autoFilter: true 
		},
		{ 
			name: '설비약명', 
			fieldName: '설비약명', 
			width: '80', 
			header: { text: '설비약명' }, 
			autoFilter: true 
		},
		{ 
			name: 'chamber', 
			fieldName: 'chamber', 
			width: '80', 
			header: { text: 'Chamber' }, 
			autoFilter: true 
		},
		{ 
			name: 'startTime', 
			fieldName: 'startTime', 
			width: '150', 
			header: { text: 'Start Time' }, 
			autoFilter: true 
		},
		{ 
			name: 'endTime', 
			fieldName: 'endTime', 
			width: '150', 
			header: { text: 'End Time' }, 
			autoFilter: true 
		},
		{ 
			name: 'poNo', 
			fieldName: 'poNo', 
			width: '150', 
			header: { text: 'PO NO' }, 
			autoFilter: true 
		},
		{ 
			name: 'runId', 
			fieldName: 'runId', 
			width: '180', 
			header: { text: 'RUN ID' }, 
			autoFilter: true 
		},
		{ 
			name: 'lotNo', 
			fieldName: 'lotNo', 
			width: '150', 
			header: { text: 'LOT NO' }, 
			autoFilter: true 
		},
		{ 
			name: 'fromCstno', 
			fieldName: 'fromCstno', 
			width: '180', 
			header: { text: 'From Cstno' }, 
			autoFilter: true 
		},
		{ 
			name: 'fromCst행렬', 
			fieldName: 'fromCst행렬', 
			width: '180', 
			header: { text: 'From Cst행렬' }, 
			autoFilter: true 
		},
		{ 
			name: 'toCstno', 
			fieldName: 'toCstno', 
			width: '180', 
			header: { text: 'To Cstno' }, 
			autoFilter: true 
		},
		{ 
			name: 'toCst행렬', 
			fieldName: 'toCst행렬', 
			width: '180', 
			header: { text: 'To Cst행렬' }, 
			autoFilter: true 
		},
		{ 
			name: 'panelId', 
			fieldName: 'panelId', 
			width: '250', 
			header: { text: 'PANEL ID' }, 
			autoFilter: true 
		},
		{ 
			name: 'resinId', 
			fieldName: 'resinId', 
			width: '180', 
			header: { text: 'RESIN ID' }, 
			autoFilter: true 
		},
		{ 
			name: 'filmId상부', 
			fieldName: 'filmId상부', 
			width: '250', 
			header: { text: 'Film ID 상부' }, 
			autoFilter: true 
		},
		{ 
			name: 'filmId하부', 
			fieldName: 'filmId하부', 
			width: '250', 
			header: { text: 'Film ID 하부' }, 
			autoFilter: true 
		},
		{ 
			name: 'trayId', 
			fieldName: 'trayId', 
			width: '180', 
			header: { text: 'Tray Id' }, 
			autoFilter: true 
		},
		{ 
			name: 'packNo', 
			fieldName: 'packNo', 
			width: '250', 
			header: { text: 'Pack No' }, 
			autoFilter: true 
		},
		{ 
			name: 'palletNo', 
			fieldName: 'palletNo', 
			width: '180', 
			header: { text: 'Pallet No' }, 
			autoFilter: true 
		}
	]	
}

module.exports = grid;