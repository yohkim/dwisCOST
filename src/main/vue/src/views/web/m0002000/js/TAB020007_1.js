/*
* 프로세스 플래닝 >  생산 공정 관리 > 공정별 불량코드 등록
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false, exclusive: false,syncHeadCheck:true },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill" },
		edit: { editable: false},
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
		//paste: { enabled: true },
		//rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		//stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: '공정명', dataType: ValueType.TEXT },
		{ fieldName: '공정구분', dataType: ValueType.TEXT },
		{ fieldName: '비고', dataType: ValueType.TEXT },
	],

	columns: [
		{ name: '공정코드', fieldName: '공정코드', width: '50', header: { text: '공정코드' }, autoFilter:true},
		{ name: '공정명', fieldName: '공정명', width: '100', header: { text: '공정명' }, autoFilter:true },
		{ name: '공정구분', fieldName: '공정구분', width: '80', header: { text: '공정구분' }, autoFilter:true },
		{ name: '비고', fieldName: '비고', width: '100', header: { text: '비고' }, autoFilter:true },
	],
}

module.exports = grid;