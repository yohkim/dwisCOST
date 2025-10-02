/*
* 기준정보 > 공정별 불량코드 등록
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
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: '불량명', dataType: ValueType.TEXT },
		{ fieldName: '불량코드', dataType: ValueType.TEXT },
		{ fieldName: '적용구분', dataType: ValueType.TEXT },
		{ fieldName: '적용순서', dataType: ValueType.TEXT },
		{ fieldName: 'rw적용', dataType: ValueType.TEXT },
		{ fieldName: '비고', dataType: ValueType.TEXT },
		{ fieldName: '사용여부', dataType: ValueType.TEXT },
	],

	columns: [
		{ 
			name: '불량명', fieldName: '불량명', width: '80', header: { text: '불량사유명' }, autoFilter:true,
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
			name: '불량코드', fieldName: '불량코드', width: '80', header: { text: '불량코드' }, autoFilter:true,
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
			name: '적용구분', fieldName: '적용구분', width: '80', header: { text: '적용구분' }, autoFilter:true,
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
		{ name: '비고', fieldName: '비고', width: '80', header: { text: '비고' }, autoFilter:true },
		{ name: '적용순서', fieldName: '적용순서', width: '80', header: { text: '적용순서' }, autoFilter:true },
		{
			name: 'rw적용', fieldName: 'rw적용', width: '80', header: { text: 'rw_적용' }, autoFilter:true,
			renderer: {
				type: "check",
				trueValues: "true",
      			falseValues: "false"
			},
		},
		{ 
			name: '사용여부', fieldName: '사용여부', width: '90', header: { text: '사용여부' }, autoFilter:true,
			renderer: {
				type: "check",
				trueValues: "true",
      			falseValues: "false"
			},
		},
	],
}

module.exports = grid;