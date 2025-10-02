/*
 * 포장/출하 > 출하 검사 의뢰 > SI 대기
 */
const { ValueType } = require('realgrid');
const { rgDisplayDateTime1, rgDisplayDate  } = require('@/utils/dateUtils');
const { TRUE } = require('sass');

const grid = {
  options: {
	checkBar: { visible: true ,exclusive:true, headText: "선택"},
    copy: { enabled: true, singleMode: false },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: 'NONE',
      hscrollBar: true,
      showEmptyMessage: true,
    },
    header: { height: 40}, 
    edit: { editable: false },
    footers: { visible: true },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },
    filtering: { enabled: true },
    //fixed: { colBarWidth: 1, colCount: 6 },
  },

  fields: [
    { fieldName: '의뢰일자', dataType: ValueType.TEXT },
    { fieldName: '의뢰차수', dataType: ValueType.TEXT },
    { fieldName: '검사단계', dataType: ValueType.TEXT },
    { fieldName: '발행구분', dataType: ValueType.TEXT },
    { fieldName: 'packNo', dataType: ValueType.TEXT },
    { fieldName: '샘플요청', dataType: ValueType.TEXT },
    { fieldName: '수량x', dataType: ValueType.NUMBER },
    { fieldName: '포장일', dataType: ValueType.TEXT },
    { fieldName: 'runId', dataType: ValueType.TEXT },
    { fieldName: '수량', dataType: ValueType.NUMBER },
    { fieldName: '작업자', dataType: ValueType.TEXT },
    { fieldName: '외관검사', dataType: ValueType.TEXT },
    { fieldName: 'pfl', dataType: ValueType.TEXT },
    { fieldName: '현미경검사', dataType: ValueType.TEXT },
    { fieldName: '이물제거', dataType: ValueType.TEXT },
    // { fieldName: '포장구분', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
  ],

  columns: [
    // {
    //    name: 'sel', fieldName: 'sel', width: '50', header: { text: '의뢰\n제외', styleName:'multiline-header'}, autoFilter: false, editable: true, checked:true,
    //           renderer: {type: 'check',   exclusive: true},
    //    styleName: 'tc',  checked: true,
    // },
    { name: '의뢰일자', fieldName: '의뢰일자', width: '100',  mergeRule: { criteria: "value" },  header: { text: 'SI의뢰일' }, autoFilter: true, styleName: 'tl' , displayCallback: rgDisplayDate},
    { name: '의뢰차수', fieldName: '의뢰차수', width: '50', mergeRule: { criteria: "value['의뢰일자'] + '|' + value['의뢰차수']" },  header: { text: '의뢰차수' }, autoFilter: true, styleName: 'tl' },
    { name: '검사단계', fieldName: '검사단계', width: '120', mergeRule: { criteria: "value['의뢰일자'] + '|' + value['의뢰차수']" }, header: { text: '진행상태' }, autoFilter: true, styleName: 'tl' },
    { name: '작업자', fieldName: '작업자', width: '120',  header: { text: '의뢰자' }, autoFilter: true, styleName: 'tl' },
    { name: '발행구분', fieldName: '발행구분', width: '120', header: { text: '발행구분' }, autoFilter: true, styleName: 'tl' },
    { name: 'packNo', fieldName: 'packNo', width: '220', mergeRule: { criteria: "value" }, header: { text: 'PACK NO' }, autoFilter: true, styleName: 'tl', footer: { expression: "distinct"   }  },
    { name: '수량', fieldName: '수량', width: '60', header: { text: '수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr',footer: {expression: 'sum',numberFormat: '#,###.###',} },		
    { name: '포장일', fieldName: '포장일', width: '120',  header: { text: '포장일' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    {	name: '샘플요청', fieldName: '샘플요청', width: '50', header: { text: '샘플요청'}, autoFilter: true, },
    { name: '수량x', fieldName: '수량x', width: '60', header: { text: '수량' }, mergeRule: { criteria: "value['packNo']" }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr',
     footer: {
    expressions: {total: "sum('수량')"}, 
    numberFormat: '#,###.###', mergePolicy: 'row'
    }},
    { name: 'runId', fieldName: 'runId', width: '100', mergeRule: { criteria: "value['runId'] + '|' + value['의뢰차수']" }, header: { text: 'RUN NO' }, autoFilter: true, styleName: 'tl' },
    { name: '외관검사', fieldName: '외관검사', width: '80', header: { text: '외관검사' }, autoFilter: true, styleName: 'tl' },
    { name: 'pfl', fieldName: 'pfl', width: '80', header: { text: 'PFL' }, autoFilter: true, styleName: 'tl' },
    { name: '현미경검사', fieldName: '현미경검사', width: '80', header: { text: '현미경검사' }, autoFilter: true, styleName: 'tl' },
    { name: '이물제거', fieldName: '이물제거', width: '80', header: { text: '이물제거' }, autoFilter: true, styleName: 'tl' },
    //{ name: '특이사항', fieldName: '특이사항', width: '120', header: { text: '특이사항' }, autoFilter: true, styleName: 'tl' },
    { name: "특이사항",
      fieldName: "특이사항",
      width: 100,
      mergeRule: { criteria: "value['packNo']"}, 
      autoFilter: true,
      styleName: 'tl',
      renderer: { type: "text", showTooltip:true },
      displayCallback: function(grid, index, value) {
        // 10자만 표시 (한글/영문 모두 고려)
        if (!value) return "";
        return value.length > 15 ? value.substring(0, 15) + "..." : value;
      },
    } 
  ],
  layout: [
    {
      name: '출하검사 의뢰정보',
      direction: 'horizontal',
      items: [ "의뢰일자","의뢰차수","검사단계", "작업자"],
      header: { text: '출하검사 의뢰정보'}
    },
    {
      name: 'PACK 구성정보',
      direction: 'horizontal',
      items: [  '발행구분', 'packNo', '수량x','포장일','특이사항','샘플요청'],
      header: { text: 'PACK 구성정보'}
    },
    'runId', '수량','외관검사', 'pfl','현미경검사','이물제거'
  ]  
};

module.exports = grid;
