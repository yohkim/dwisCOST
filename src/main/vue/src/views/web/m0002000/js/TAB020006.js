/*
* 프로세스 플래닝 >  생산 공정 관리 > 공정별_모니터링항목
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: true, exclusive: false,syncHeadCheck:true },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "even" },
		edit: { editable: true, commitByCell: true },
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
		hideDeletedRows: true,
		paste: { enabled: true },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'line', dataType: ValueType.TEXT },
		{ fieldName: 'processId', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: '공정명', dataType: ValueType.TEXT },
		{ fieldName: '모니터링구분', dataType: ValueType.TEXT },
		{ fieldName: '모니터링항목', dataType: ValueType.TEXT },
		{ fieldName: '등급및수량', dataType: ValueType.TEXT },
		{ fieldName: '검증부서', dataType: ValueType.TEXT },
		{ fieldName: '순서', dataType: ValueType.TEXT },
		{ fieldName: '설비유형수동대수', dataType: ValueType.TEXT },
		{ fieldName: '설비유형자동대수', dataType: ValueType.TEXT },
	],
	
	columns: [
		{ 
			name: 'line', fieldName: 'line', width: '60', header: { text: 'LINE' }, autoFilter: true,
			styleCallback: function(grid, dataCell){
				var ret = {}
		
				if(dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting'){
				ret.editable = true;
				} else {
				ret.editable = false;
				}
		
				return ret;
			}
		},
		{ 
			name: 'processId', fieldName: 'processId', width: '135', header: { text: 'PROCESSID' }, autoFilter: true,
			styleCallback: function(grid, dataCell){
				var ret = {}
		
				if(dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting'){
				ret.editable = true;
				} else {
				ret.editable = false;
				}
		
				return ret;
			}
		},
		{ 
			name: '공정코드', fieldName: '공정코드', width: '60', header: { text: '공정코드' }, autoFilter: true,
			styleCallback: function(grid, dataCell){
				var ret = {}
		
				if(dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting'){
				ret.editable = true;
				} else {
				ret.editable = false;
				}
		
				return ret;
			}
		},
		{ name: '공정명', fieldName: '공정명', width: '45', header: { text: '공정명' }, autoFilter: true },
		{ 
			name: '모니터링구분', fieldName: '모니터링구분', width: '90', header: { text: '모니터링구분' }, autoFilter: true,
			styleCallback: function(grid, dataCell){
				var ret = {}
		
				if(dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting'){
				ret.editable = true;
				} else {
				ret.editable = false;
				}
		
				return ret;
			}
		},
		{ 
			name: '모니터링항목', fieldName: '모니터링항목', width: '90', header: { text: '모니터링항목' }, autoFilter: true,
			styleCallback: function(grid, dataCell){
				var ret = {}
		
				if(dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting'){
				ret.editable = true;
				} else {
				ret.editable = false;
				}
		
				return ret;
			}
		},
		{ name: '등급및수량', fieldName: '등급및수량', width: '75', header: { text: '등급및수량' }, autoFilter: true },
		{ name: '검증부서', fieldName: '검증부서', width: '60', header: { text: '검증부서' }, autoFilter: true },
		{ name: '순서', fieldName: '순서', width: '30', header: { text: '순서' }, autoFilter: true },
		{ name: '설비유형수동대수', fieldName: '설비유형수동대수', width: '120', header: { text: '설비유형수동대수' }, autoFilter: true },
		{ name: '설비유형자동대수', fieldName: '설비유형자동대수', width: '120', header: { text: '설비유형자동대수' }, autoFilter: true }
	]
}

module.exports = grid;