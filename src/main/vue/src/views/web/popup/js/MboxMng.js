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
			// fitStyle:  GridFitStyle.FILL,
			emptyMessage: '조회된 데이터가 없습니다.',
			fitStyle: 'even',
			hscrollBar: true,
			showEmptyMessage: true,
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
		{ fieldName: 'cellNo', dataType: ValueType.TEXT },
		{ fieldName: '투입구분', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: 'runNo2', dataType: ValueType.TEXT },
		{ fieldName: 'runNo3', dataType: ValueType.TEXT },
		{ fieldName: 'runNo4', dataType: ValueType.TEXT },
		{ fieldName: 'rework판정', dataType: ValueType.NUMBER },
		{ fieldName: 'agb호기명', dataType: ValueType.TEXT },
		{ fieldName: 'pfl설비명', dataType: ValueType.TEXT },
		{ fieldName: 'stage', dataType: ValueType.TEXT },
		{ fieldName: 'pflScrap', dataType: ValueType.TEXT },
		{ fieldName: '이물line', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: 'mrunNo', dataType: ValueType.TEXT },
		{ fieldName: 'org투입구분', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'cellNo', fieldName: 'cellNo', width: '270', header: { text: "           CELL NO           ".replace(/ /g, '\u00A0'), style: {whiteSpace: "pre",  fontFamily: "'Courier New', monospace", }}, styleName:"edit", },
		{ name: '투입구분', fieldName: '투입구분', width: '80', header: { text: '투입구분' },editable:false},
		{ name: 'runNo', fieldName: 'runNo', width: '130', header: { text: '  RUN NO  '.replace(/ /g, '\u00A0'), style: {whiteSpace: "pre", } },editable:false},
		{ name: 'runNo2', fieldName: 'runNo2', width: '130', header: { text: 'RUN NO-1' },editable:false},
		{ name: 'runNo3', fieldName: 'runNo3', width: '130', header: { text: 'RUN NO-2' },editable:false},
		{ name: 'runNo4', fieldName: 'runNo4', width: '130', header: { text: 'RUN NO-3' },editable:false},
		{ name: 'rework판정', fieldName: 'rework판정', width: '50', header: { text: 'R/W\n횟수', styleName:'multiline-header' },editable:false, numberFormat: '#'},
		{ name: 'agb호기명', fieldName: 'agb호기명', width: '80', header: { text: 'AGB' },editable:false},
		{ name: 'pfl설비명', fieldName: 'pfl설비명', width: '80', header: { text: '호기' },editable:false},
		{ name: 'stage', fieldName: 'stage', width: '50', header: { text: 'STAGE' },editable:false},
		
		{ name: '이물line', fieldName: '이물line', width: '80', header: { text: '이물제거' },editable:false},
		{ name: '특이사항', fieldName: '특이사항', width: '150', header: { text: '특이사항' },styleName:"tl",editable:false},
		{ name: 'org투입구분', fieldName: 'org투입구분', width: '150', header: { text: 'org투입구분' }, visible: false},
		{ name: 'mrunNo', fieldName: 'mrunNo', width: '150', header: { text: 'MRUN_NO' }, visible: false},
	],
	layout: [
		"cellNo","투입구분","runNo","runNo2","runNo3","runNo4","rework판정","agb호기명",
		{
			name: "PFL",
			direction: "horizontal",
			items: ["pfl설비명", "stage"],
			header:{ text: "PFL" }
		},
		"이물line","특이사항","org투입구분","mrunNo"
	],
}
module.exports = grid;
