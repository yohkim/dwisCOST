/*
* 기준정보 > 모델관리 > 공정별_모니터링항목
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: true, exclusive: false, syncHeadCheck:true },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, fitStyle: "even" },
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
		//hideDeletedRows: true,
		paste: { enabled: true },
		rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'seqId', dataType: ValueType.TEXT },
		{ fieldName: 'line', dataType: ValueType.TEXT },
		{ fieldName: 'processId', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: '공정명', dataType: ValueType.TEXT },
		{ fieldName: '설비번호', dataType: ValueType.TEXT },
		{ fieldName: '설비약명', dataType: ValueType.TEXT },
		{ fieldName: 'modelCode', dataType: ValueType.TEXT },
		{ fieldName: 'shift', dataType: ValueType.TEXT },
		{ fieldName: 'code', dataType: ValueType.TEXT },
		{ fieldName: 'qr', dataType: ValueType.TEXT },
		{ fieldName: 'initDt', dataType: ValueType.TEXT },
		{ fieldName: 'initUser', dataType: ValueType.TEXT },
		{ fieldName: 'initUserNm', dataType: ValueType.TEXT },
		{ fieldName: 'modiDt', dataType: ValueType.TEXT },
		{ fieldName: 'modiUser', dataType: ValueType.TEXT },
		{ fieldName: 'modiUserNm', dataType: ValueType.TEXT },
	],
	
	columns: [		
		{ name: '공정명', fieldName: '공정명', width: '75', header: { text: '공정명' }, editable: false, autoFilter: true, styleName: "tl" },
		{ name: '설비약명', fieldName: '설비약명', width: '100', header: { text: '설비명' }, editable: false, autoFilter: true, styleName: "tl" },
		{ name: 'modelCode', fieldName: 'modelCode', width: '75', header: { text: 'Model' }, editable: false, autoFilter: true, styleName: "tl" },
		{ name: 'shift', fieldName: 'shift', width: '75', header: { text: '근무조' }, editable: false, autoFilter: true, styleName: "tl", editor: { type:"dropdown", domainOnly: true, textReadOnly:true, dropDownWhenClick: true }, lookupDisplay:true, values:["-","A","B","C"], labels:["선택없음","A","B","C"] },
		{ name: 'code', fieldName: 'code', width: '75', header: { text: 'CODE' }, editable: true, autoFilter: true, styleName: "tl edit", editor: { textCase: 'upper' } },
		{ name: 'qr', fieldName: 'qr', width: '75', header: { text: 'QR' }, editable: true, autoFilter: true, styleName: "tl edit", editor: { textCase: 'upper' } },
		{ name: 'initUserNm', fieldName: 'initUserNm', width: '75', header: { text: '생성자' }, editable: false, autoFilter: true, styleName: "tl" },
		{ name: 'initDt', fieldName: 'initDt', width: '75', header: { text: '생성일자' }, editable: false, autoFilter: true, styleName: "tl" },
		{ name: 'modiUserNm', fieldName: 'modiUserNm', width: '75', header: { text: '변경자' }, editable: false, autoFilter: true, styleName: "tl" },
		{ name: 'modiDt', fieldName: 'modiDt', width: '75', header: { text: '변경일자' }, editable: false, autoFilter: true, styleName: "tl" },
	],

	layout: ["공정명","설비약명","modelCode","shift","code","qr","initUserNm","initDt","modiUserNm","modiDt"],
}

module.exports = grid;