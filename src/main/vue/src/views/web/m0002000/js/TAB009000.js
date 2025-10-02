/*
* 프로세스 플래닝 > 제품 모델 관리 - 모델마스터
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle} = require('realgrid');

const USE_YN_LABELS = ["Y", "N"];
const USE_YN_VALUE = ["Y", "N"];

const grid = {
	
	options: {
		checkBar: { visible: true },
		copy: { enabled: true, singleMode: true },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.ROWS,
			selectionMode: SelectionMode.SINGLE,
			fitStyle: GridFitStyle.EVEN_FILL,
		},
		edit: { editable: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: {visible: false},
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: {},
		paste: { enabled: false },
		rowIndicator: { visible : false},
		sorting: {enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'model',  			dataType: ValueType.TEXT },
		{ fieldName: 'code',  			dataType: ValueType.TEXT },
		{ fieldName: 'description', 	dataType: ValueType.TEXT },
		{ fieldName: 'trayCell', 		dataType: ValueType.TEXT },
		{ fieldName: 'useYn', 			dataType: ValueType.TEXT },
		{ fieldName: 'createDate', 		dataType: ValueType.DATE },
		{ fieldName: 'createName',	 	dataType: ValueType.TEXT },
		{ fieldName: 'imageExist',	 	dataType: ValueType.TEXT },
		{ fieldName: 'imageUpload',	 	dataType: ValueType.TEXT },
	],
	columns: [
		{ name: 'model'			,fieldName: 'model' 	   	,width: '100', header: { text: 'Model' }, autoFilter:true, editable:false, editor: { type:"text", maxLength:7 }},		
		{ name: 'code'			,fieldName: 'code' 	   		,width: '100', header: { text: 'code' }, autoFilter:true, editable:false, editor: { type:"text", maxLength:7 }},		
		{ name: 'description'  ,fieldName: 'description'	,width: '500', header: { text: 'Description' }, autoFilter:true, editor: { type:"text", maxLength:34 } },
		{ name: 'trayCell'   	,fieldName: 'trayCell'		,width: '100', header: { text: 'TrayCell' }, autoFilter:true, editor: { type:"int", maxLength:1 } },	
		{ name: 'useYn' 		,fieldName: 'useYn' 		,width: '100', header: { text: '사용여부' },  autoFilter:true, lookupDisplay:true, values:USE_YN_VALUE, labels:USE_YN_LABELS, editor: { type:"dropdown", dropDownCount:2, textReadOnly:true } },
		{ name: 'createDate' 	,fieldName: 'createDate' 	,width: '100', header: { text: '등록일' }, autoFilter:true, type:"datetime", datetimeFormat: "yyyy-MM-dd" },
		{ name: 'createName' 	,fieldName: 'createName' 	,width: '100', header: { text: '등록자' }, autoFilter:true,  },
		{ name: 'imageExist' 	,fieldName: 'imageExist' 	,width: '100', header: { text: '필름등록여부' }, editable:false, autoFilter:true,
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					if(cell.value==1)
						return '<button type="button" class="btn_error">미리보기</button>'
					else
						return '미등록';
				}
		  	},
		},
		{ name: 'imageUpload' 	,fieldName: 'imageUpload' 	,width: '100', header: { text: '등록' }, 
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					return '<button type="button" class="btn_error">등록</button>';
				}
		  	},
		}
	],
}

module.exports = grid;
