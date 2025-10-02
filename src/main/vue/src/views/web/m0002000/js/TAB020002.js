/*
* 기준정보 > 설비관리 > 설비현황
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
		{ fieldName: '공정', dataType: ValueType.TEXT },
		{ fieldName: '설비명', dataType: ValueType.TEXT },
		{ fieldName: '제어Base', dataType: ValueType.TEXT },
		{ fieldName: 'plcBase', dataType: ValueType.TEXT },
		{ fieldName: '여유슬롯', dataType: ValueType.TEXT },
		{ fieldName: 'plcCpuMaker', dataType: ValueType.TEXT },
		{ fieldName: 'plcCpu모델', dataType: ValueType.TEXT },
		{ fieldName: 'hmiTouch', dataType: ValueType.TEXT },
		{ fieldName: 'hmiScada', dataType: ValueType.TEXT },
		{ fieldName: 'scada', dataType: ValueType.TEXT },
		{ fieldName: 'windowsVersion', dataType: ValueType.TEXT },
		{ fieldName: 'plcComment', dataType: ValueType.TEXT },
		{ fieldName: '외산설비Lock유무', dataType: ValueType.TEXT },
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
			name: '공정', fieldName: '공정', width: '80', header: { text: '공정' }, autoFilter:true,
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
			name: '설비명', fieldName: '설비명', width: '80', header: { text: '설비명' }, autoFilter:true,
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
		{ name: '제어Base', fieldName: '제어Base', width: '80', header: { text: '제어Base' }, autoFilter:true },
		{ name: 'plcBase', fieldName: 'plcBase', width: '80', header: { text: 'PLCBase' }, autoFilter:true },
		{ name: '여유슬롯', fieldName: '여유슬롯', width: '80', header: { text: '여유슬롯' }, autoFilter:true },
		{ name: 'plcCpuMaker', fieldName: 'plcCpuMaker', width: '80', header: { text: 'PLCCPUMAKER' }, autoFilter:true },
		{ name: 'plcCpu모델', fieldName: 'plcCpu모델', width: '80', header: { text: 'PLCCPU모델' }, autoFilter:true },
		{ name: 'hmiTouch', fieldName: 'hmiTouch', width: '80', header: { text: 'HMITOUCH' }, autoFilter:true },
		{ name: 'hmiScada', fieldName: 'hmiScada', width: '80', header: { text: 'HMISCADA' }, autoFilter:true },
		{ name: 'scada', fieldName: 'scada', width: '80', header: { text: 'SCADA' }, autoFilter:true },
		{ name: 'windowsVersion', fieldName: 'windowsVersion', width: '80', header: { text: 'WindowsVersion' }, autoFilter:true },
		{ name: 'plcComment', fieldName: 'plcComment', width: '80', header: { text: 'PLCComment' }, autoFilter:true },
		{ name: '외산설비Lock유무', fieldName: '외산설비Lock유무', width: '80', header: { text: '외산설비Lock유무' }, autoFilter:true },
		{ name: '비고', fieldName: '비고', width: '80', header: { text: '비고' }, autoFilter:true },
	],
}

module.exports = grid;