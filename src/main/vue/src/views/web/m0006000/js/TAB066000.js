/*
* 기준정보 > 설비관리 > 설비로그관리
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
		{ fieldName: '공장코드', dataType: ValueType.TEXT },
		{ fieldName: 'seqNo', dataType: ValueType.TEXT },
		{ fieldName: '설비유형', dataType: ValueType.TEXT },
		{ fieldName: '설비호기', dataType: ValueType.TEXT },
		{ fieldName: '이력관리여부', dataType: ValueType.TEXT },
		{ fieldName: 'db연계여부', dataType: ValueType.TEXT },
		{ fieldName: 'db테이블유무', dataType: ValueType.TEXT },
		{ fieldName: '업체명', dataType: ValueType.TEXT },
		{ fieldName: '관리ip', dataType: ValueType.TEXT },
		{ fieldName: '비고', dataType: ValueType.TEXT },
	],

	columns: [
		{ 
			name: '공장코드', fieldName: '공장코드', width: '80', header: { text: '공장코드' }, autoFilter:true,
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
			name: 'seqNo', fieldName: 'seqNo', width: '80', header: { text: 'seqNo' }, autoFilter:true,
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
			name: '설비유형', fieldName: '설비유형', width: '80', header: { text: '설비유형' }, autoFilter:true,
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
			name: '설비호기', fieldName: '설비호기', width: '80', header: { text: '설비호기' }, autoFilter:true,
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
		{ name: '이력관리여부', fieldName: '이력관리여부', width: '80', header: { text: '이력관리여부' }, autoFilter:true },
		{ name: 'db연계여부', fieldName: 'db연계여부', width: '80', header: { text: 'DB연계여부' }, autoFilter:true },
		{ name: 'db테이블유무', fieldName: 'db테이블유무', width: '80', header: { text: 'DB테이블유무' }, autoFilter:true },
		{ name: '업체명', fieldName: '업체명', width: '80', header: { text: '업체명' }, autoFilter:true },
		{ name: '관리ip', fieldName: '관리ip', width: '80', header: { text: '관리IP' }, autoFilter:true },
		{ name: '비고', fieldName: '비고', width: '80', header: { text: '비고' }, autoFilter:true },
	],
}

module.exports = grid;