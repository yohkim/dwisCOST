/*
* 제조 실적 입력 > Rework > M-BOX 관리 > BareCellMng
*/
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');
const grid = {
	dataProvider: null,
	gridView: null,
	options: {
		checkBar: { visible: true },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: {
			columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.BLOCK,
			selectionMode: SelectionMode.EXTENDED,
			fitStyle: GridFitStyle.EVEN_FILL,
		},
		edit: { editable: true, commitByCell:false },
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
		{ fieldName: '공정', dataType: ValueType.TEXT },
		{ fieldName: 'bareCell', dataType: ValueType.TEXT },
		{ fieldName: 'runId', dataType: ValueType.TEXT },
		{ fieldName: '담당자', dataType: ValueType.TEXT },
		{ fieldName: '작업시각', dataType: ValueType.TEXT },
		{ fieldName: '특이사항', dataType: ValueType.TEXT },
		{ fieldName: '순서', dataType: ValueType.INT },
	],

	columns: [
		{ name: '순서', fieldName: '순서', width: '150', header: { text: '순서' }, visible : false},
		{ name: '공정', fieldName: '공정', width: '150', header: { text: '공정' }, autoFilter: true},
		{ name: 'bareCell', fieldName: 'bareCell', width: '250', header: { text: 'Bare Cell No' }, autoFilter: true},
		{ name: 'runId', fieldName: 'runId', width: '250', header: { text: 'RUN NO' }, autoFilter: true,editable:false},
		{ name: '담당자', fieldName: '담당자', width: '250', header: { text: '담당자' }, autoFilter: true,editable:false},
		{ name: '작업시각', fieldName: '작업시각', width: '250', header: { text: '작업시각' }, autoFilter: true,editable:false},
		// { name: 'agb호기명', fieldName: 'agb호기명', width: '60', header: { text: 'AGB' },editable:false},
		// { name: 'pfl설비명', fieldName: 'pfl설비명', width: '80', header: { text: '호기' },editable:false},
		// { name: 'pflStage', fieldName: 'pflStage', width: '100', header: { text: 'STAGE' },editable:false},
		// { name: 'pflScrap', fieldName: 'pflScrap', width: '100', header: { text: '필름포장검사' },editable:false},
		// { name: '이물Line', fieldName: '이물Line', width: '100', header: { text: '이물제거' },editable:false},
		{ name: '특이사항', fieldName: '특이사항', width: '450', header: { text: '특이사항' },editable:true,styleName:"tl edit"},
		//{ name: '특이사항', fieldName: '특이사항', width: '450', mergeRule: { criteria: "value['runId'] + '|' + value['작업시각']" }, header: { text: '특이사항' },editable:true,styleName:"tl edit"},
	],
}
module.exports = grid;
