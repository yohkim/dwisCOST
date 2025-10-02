/*
* 프로세스 플래닝 >  생산 공정 관리 > 공정별 불량코드 등록
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
		{ fieldName: 'line', dataType: ValueType.TEXT },
		{ fieldName: '공정코드', dataType: ValueType.TEXT },
		{ fieldName: '불량명', dataType: ValueType.TEXT },
		{ fieldName: '불량코드', dataType: ValueType.TEXT },
		{ fieldName: '적용구분', dataType: ValueType.TEXT },
		{ fieldName: '적용순서', dataType: ValueType.TEXT },
		{ fieldName: 'rw적용', dataType: ValueType.TEXT },
		{ fieldName: '비고', dataType: ValueType.TEXT },
		{ fieldName: '사용여부', dataType: ValueType.TEXT },
		{ fieldName: '신뢰성인계여부', dataType: ValueType.TEXT },
		{ fieldName: '수율불량제외여부', dataType: ValueType.TEXT },
		{ fieldName: 'rework진행여부', dataType: ValueType.TEXT },
	],

	columns: [
		{ 
			name: 'line', fieldName: 'line', width: '80', header: { text: 'LINE' }, autoFilter:true
		},
		{ 
			name: '불량명', fieldName: '불량명', width: '80', header: { text: '불량사유명' }, autoFilter:true, styleName:'edit',
		},
		{ 
			name: '불량코드', fieldName: '불량코드', width: '80', header: { text: '불량코드' }, autoFilter:true, styleName:'edit',
		},
		{ 
			name: '적용구분', fieldName: '적용구분', width: '80', header: { text: '적용구분' }, autoFilter:true,
		 },
		{ name: '비고', fieldName: '비고', width: '80', header: { text: '비고' }, autoFilter:true },
		{ name: '적용순서', fieldName: '적용순서', width: '80', header: { text: '적용순서' }, autoFilter:true },
		{
			name: 'rw적용', fieldName: 'rw적용', width: '80', header: { text: 'rw_적용' }, autoFilter:true,editable:false,
			renderer: {
				type: "check",
				trueValues: "true",
      			falseValues: "false"
			},
		},
		{ 
			name: '사용여부', fieldName: '사용여부', width: '90', header: { text: '사용여부' }, autoFilter:true,editable:false,
			renderer: {
				type: "check",
				trueValues: "true",
      			falseValues: "false"
			},
		},
		{ 
			name: '신뢰성인계여부', fieldName: '신뢰성인계여부', width: '150', header: { text: '신뢰성인계여부' }, autoFilter:true,editable:false,
			renderer: {
				type: "check",
				trueValues: "1",
      			falseValues: "0"
			},
		},
		{ 
			name: '수율불량제외여부', fieldName: '수율불량제외여부', width: '150', header: { text: '수율불량제외여부' }, autoFilter:true,editable:false,
			renderer: {
				type: "check",
				trueValues: "1",
      			falseValues: "0"
			},
		},
		{ 
			name: 'rework진행여부', fieldName: 'rework진행여부', width: '150', header: { text: 'Rework진행여부' }, autoFilter:true,editable:false,
			renderer: {
				type: "check",
				trueValues: "1",
      			falseValues: "0"
			},
		},
	],
}

module.exports = grid;