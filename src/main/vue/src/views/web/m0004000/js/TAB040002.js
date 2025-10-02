/*
* 제조 실적 관리 > Hold 관리 > Hold 해제
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: true, exclusive: false },
		copy: { enabled: true, singleMode: false, datetimeFormat : 'yyyy-MM-dd' },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "even" },
		edit: { editable: true, commitByCell: true, enterToNextRow:true,enterToTab:true,enterToNextCell:false},
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
		paste: { enabled: false },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'hold일시', dataType: ValueType.TEXT },
		{ fieldName: 'runNo', dataType: ValueType.TEXT },
		{ fieldName: 'hold여부', dataType: ValueType.TEXT },
		{ fieldName: 'min공정명', dataType: ValueType.TEXT },
		{ fieldName: 'min설비명', dataType: ValueType.TEXT },
		{ fieldName: 'max공정명', dataType: ValueType.TEXT },
		{ fieldName: 'max설비명', dataType: ValueType.TEXT },
		{ fieldName: 'hold코드', dataType: ValueType.TEXT },
		{ fieldName: 'hold명', dataType: ValueType.TEXT },
		{ fieldName: 'hold기준', dataType: ValueType.TEXT },
		{ fieldName: 'hold범위', dataType: ValueType.TEXT },
		{ fieldName: '모니터링주기', dataType: ValueType.TEXT },
		{ fieldName: 'hold사유', dataType: ValueType.TEXT },
		{ fieldName: '담당자', dataType: ValueType.TEXT },
		{ fieldName: '비고', dataType: ValueType.TEXT },
		{ fieldName: 'hold해제일시', dataType: ValueType.TEXT },
		{ fieldName: 'hold해제처리자', dataType: ValueType.TEXT },
		{ fieldName: 'hold해제조치내역', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: 'hold일시', fieldName: 'hold일시', width: '200', header: { text: 'hold일시' }, editable: false, autoFilter:true,},
		{ name: 'runNo', fieldName: 'runNo', width: '200', header: { text: 'Run No' }, editable: false, autoFilter:true,},
		{ name: 'hold여부', fieldName: 'hold여부', width: '200', header: { text: 'HOLD 여부' }, editable: false, autoFilter:true, styleName: 'tl', },
		{ name: 'min공정명', fieldName: 'min공정명', width: '200', header: { text: 'min공정명' }, autoFilter:true, styleName: 'tl', },
		{ name: 'min설비명', fieldName: 'min설비명', width: '200', header: { text: 'min설비명' }, autoFilter:true, styleName: 'tl', },
		{ name: 'max공정명', fieldName: 'max공정명', width: '200', header: { text: 'max공정명' }, autoFilter:true, styleName: 'tl', },
		{ name: 'max설비명', fieldName: 'max설비명', width: '200', header: { text: 'max설비명' }, autoFilter:true, styleName: 'tl', },
		{ name: 'hold명', fieldName: 'hold명', width: '200', header: { text: 'hold명' }, autoFilter:true, styleName: 'tl', },
		{ name: 'hold기준', fieldName: 'hold기준', width: '200', header: { text: 'hold기준' }, autoFilter:true, styleName: 'tl', },
		{ name: 'hold범위', fieldName: 'hold범위', width: '200', header: { text: 'hold범위' }, autoFilter:true, styleName: 'tl', },
		{ name: '모니터링주기', fieldName: '모니터링주기', width: '200', header: { text: '모니터링주기' }, autoFilter:true, styleName: 'tl', },
		{ name: 'hold사유', fieldName: 'hold사유', width: '200', header: { text: 'hold사유' }, autoFilter:true, styleName: 'tl', },
		{ name: '담당자', fieldName: '담당자', width: '200', header: { text: '담당자' }, autoFilter:true, styleName: 'tl', },
		{ name: '비고', fieldName: '비고', width: '400', header: { text: '비고' }, autoFilter:true, styleName: 'tl', },
		{ name: 'hold해제일시', fieldName: 'hold해제일시', width: '400', header: { text: 'hold해제일시' }, autoFilter:true, },
		{ name: 'hold해제처리자', fieldName: 'hold해제처리자', width: '400', header: { text: 'hold해제처리자' }, autoFilter:true, styleName: 'tl', },
		{ name: 'hold해제조치내역', fieldName: 'hold해제조치내역', width: '400', header: { text: 'hold해제조치내역' }, autoFilter:true, styleName: 'tl', },
	],
}

module.exports = grid;