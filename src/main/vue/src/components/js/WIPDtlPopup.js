/*
 * 작업현황 > 재공/재고현황 > 상세 팝업
 */
const { ValueType,SummaryMode,GridFitStyle } = require('realgrid');

const grid = {
  dataProvider: null,
	gridView: null,
  options: {
    checkBar: { visible: false },
    copy: { enabled: true,singleMode:false},
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: GridFitStyle.EVEN_FILL,
      hscrollBar: true,
      showEmptyMessage: true,
      summaryMode: SummaryMode.AGGREGATE,
    },
    // fixed: {colCount:3},
    edit: { editable: false },
    footers: { visible: true },
    header: { height: 25 },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },    
  },
  
  fields: [
    { fieldName: 'objNo', dataType: ValueType.TEXT },
    { fieldName: '수량', dataType: ValueType.NUMBER },
    { fieldName: '시작시간', dataType: ValueType.TEXT },
    { fieldName: '상태', dataType: ValueType.TEXT },
    { fieldName: '작업자', dataType: ValueType.TEXT },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
    { fieldName: '상세정보', dataType: ValueType.TEXT },
    { fieldName: '실적입력', dataType: ValueType.TEXT },
    { fieldName: 'area', dataType: ValueType.TEXT },
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: 'lotNo', dataType: ValueType.TEXT },
    { fieldName: '공정코드', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'objNo', fieldName: 'objNo', header: { text: 'LotRunNo' }, width: '100',autoFilter: true, styleName: "tc",footer: {text: "합계"} },
    { name: '수량', fieldName: '수량', header: { text: '수량' }, width: '100',autoFilter: false, styleName: "tr",numberFormat: '#,##0', footer: {expression: "sum",numberFormat: '#,##0'}},
    { name: '설비약명', fieldName: '설비약명', header: { text: '설비약명' }, width: '80',autoFilter: false, styleName: "tl"},
    { name: '작업자', fieldName: '작업자', header: { text: '작업자' }, width: '80',autoFilter: false, styleName: "tc"},
    { name: '시작시간', fieldName: '시작시간', header: { text: '시작 시간' }, width: '100',autoFilter: false, styleName: "tc"},
    { name: '상태', fieldName: '상태', header: { text: '상태' }, width: '80',styleName: "tc"},
    { name: "상세정보", fieldName: "상세정보", header: { text: "상세정보" },
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					return '<button type="button" class="btn_sucess">상세보기</button>';
				}
		  },
		},
    { name: "실적입력", fieldName: "실적입력", header: { text: "실적입력" },
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					return '<button type="button" class="btn_sucess">바로가기</button>';
				}
      },
		},
  ],
};

module.exports = grid;
