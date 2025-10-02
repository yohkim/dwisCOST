/*
* 제조 실적 입력 > Rework > M-BOX 관리 > M-BOX 대기Cell 관리 팝업
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');
const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.BLOCK,
			selectionMode: SelectionMode.EXTENDED,
			fitStyle: GridFitStyle.EVEN_FILL,
		},
		edit: { editable: true },
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
		{ fieldName: 'cellId', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: 'agb호기명', dataType: ValueType.TEXT },
		{ fieldName: 'pfl설비명', dataType: ValueType.TEXT },
		{ fieldName: 'pflStage', dataType: ValueType.TEXT },
		{ fieldName: 'pflScrap', dataType: ValueType.TEXT },
		{ fieldName: '이물Line', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: '공정명', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'cellId', fieldName: 'cellId', width: '350', header: { text: "          CELL NO          ".replace(/ /g, '\u00A0'), style: {whiteSpace: "pre",  fontFamily: "'Courier New', monospace", }}, styleName:"edit"},
		{ name: 'runNo', fieldName: 'runNo', width: '200', header: { text: '  RUN NO  '.replace(/ /g, '\u00A0'), style: {whiteSpace: "pre",  fontFamily: "'Courier New', monospace", } },editable:false},
		{ name: 'agb호기명', fieldName: 'agb호기명', width: '60', header: { text: 'AGB' },editable:false},
		{ name: 'pfl설비명', fieldName: 'pfl설비명', width: '80', header: { text: '호기' },editable:false},
		{ name: 'pflStage', fieldName: 'pflStage', width: '100', header: { text: 'STAGE' },editable:false},
		{ name: 'pflScrap', fieldName: 'pflScrap', width: '100', header: { text: '필름포장검사' },editable:false},
		{ name: '이물Line', fieldName: '이물Line', width: '100', header: { text: '이물제거' },editable:false},
		{ name: '특이사항', fieldName: '특이사항', width: '450', header: { text: '특이사항' },styleName:"edit"},
		{ name: '공정명', fieldName: '공정명', width: '450', header: { text: '공정명' },editable:false},
		{ name: '공정코드', fieldName: '공정코드', width: '450', header: { text: '공정코드' },editable:false,visible:false},
	],

	layout: [
		"cellId","runNo","agb호기명",
		{
			name: "PFL",
			direction: "horizontal",
			items: ["pfl설비명", "pflStage"],
			header:{ text: "PFL" }
		},
		"pflScrap","이물Line","특이사항","공정명","공정코드"
	],
}
module.exports = grid;