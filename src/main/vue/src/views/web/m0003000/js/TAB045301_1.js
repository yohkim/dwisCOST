/*
 * 포장/출하 > 출하 검사> 출하검사 SAMPLE PACK 요청
 */
const { ValueType } = require('realgrid');
const { rgDisplayDateTime1, rgDisplayDate } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: false },
    copy: { enabled: true, singleMode: true },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: 'NONE',
      hscrollBar: true,
      showEmptyMessage: true,
    },
    header: { height: 50}, 
    edit: { editable: false },
    footers: { visible: true },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },
    filtering: { enabled: true },
    //fixed: { colBarWidth: 1, colCount: 6 },
  styles: {
    // 기본 스타일들
    tc: { textAlignment: "center" },
    tr: { textAlignment: "far" },
    'multiline-header': {
      textAlignment: "center",
      multiLine: true
      },
    },
  },
  fields: [
    { fieldName: 'si의뢰일자', dataType: ValueType.TEXT },
    { fieldName: 'si의뢰차수', dataType: ValueType.TEXT },
    { fieldName: '검사단계', dataType: ValueType.TEXT },
    { fieldName: '작업자', dataType: ValueType.TEXT },
    { fieldName: 'packNo', dataType: ValueType.TEXT },
    { fieldName: '발행구분', dataType: ValueType.TEXT },
    { fieldName: 'pack수량', dataType: ValueType.NUMBER },
		{ fieldName: 'sel', dataType: ValueType.BOOLEAN },
		//{ fieldName: '샘플필터', dataType: ValueType.TEXT },
    { fieldName: 'runId', dataType: ValueType.TEXT },
    { fieldName: '수량', dataType: ValueType.NUMBER },
    //{ fieldName: 'orginNo', dataType: ValueType.TEXT },
    { fieldName: '포장일', dataType: ValueType.TEXT },
    { fieldName: '외관검사', dataType: ValueType.TEXT },
    { fieldName: 'pfl', dataType: ValueType.TEXT },
    { fieldName: '현미경검사', dataType: ValueType.TEXT },
    { fieldName: '이물제거', dataType: ValueType.TEXT },
    { fieldName: '포장구분', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
    { fieldName: '샘플인계run', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'si의뢰일자', fieldName: 'si의뢰일자', width: '80', header: { text: '의뢰 일자', styleName:'multiline-header'}, mergeRule: { criteria: "value['si의뢰일자'] + '|' + value['si의뢰차수']" }, autoFilter: true,  displayCallback: rgDisplayDate},
    { name: 'si의뢰차수', fieldName: 'si의뢰차수', width: '80', header: { text: '의뢰 차수', styleName:'multiline-header'}, mergeRule: { criteria: "value['si의뢰일자'] + '|' + value['si의뢰차수']" }, autoFilter: true },
    { name: '검사단계', fieldName: '검사단계', width: '80', mergeRule: { criteria: "value['si의뢰일자'] + '|' + value['si의뢰차수']" }, header: { text: '출하 검사\n진행 단계', styleName:'multiline-header' }, autoFilter: true, styleName: 'tl' },
    { name: '작업자', fieldName: '작업자', width: '80',  header: { text: '의 뢰 자', styleName:'multiline-header'}, autoFilter: true, styleName: 'tl' },
    { name: 'runId', fieldName: 'runId', width: '100', mergeRule: { criteria: "value['runId'] + '|' + value['si의뢰차수']" }, header: { text: 'RUN NO' }, autoFilter: true, styleName: 'tl' },
    //{ name: 'orginNo', fieldName: 'orginNo', width: '100', mergeRule: { criteria: "value['runId'] + '|' + value['의뢰차수']" }, header: { text: 'ORIGIN NO' }, autoFilter: true, styleName: 'tl' },
		{
			 name: 'sel', fieldName: 'sel', width: '50', header: { text: '샘플요청\nRUN 선택', styleName:'multiline-header'}, autoFilter: false, editable: true,checked:true,
			  renderer: {type: 'check'},
       styleName: 'tc',
		},
    //{ name: '샘플필터', fieldName: '샘플필터', width: '30',  header: { text: '샘플\n필터', styleName:'multiline-header' }, autoFilter: true, styleName: 'tl' , },
    { name: '수량', fieldName: '수량', width: '30', header: { text: 'CELL수량' , styleName:'multiline-header'}, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr',footer: {expression: 'sum',numberFormat: '#,###.###',} },
    { name: 'packNo', fieldName: 'packNo', width: '220', mergeRule: { criteria: "value['packNo']"}, header: { text: 'PACK NO' }, autoFilter: true, styleName: 'tl', footer: { expression: "distinct"   }  },
    { name: '발행구분', fieldName: '발행구분', width: '220', header: { text: '발행 구분' }, autoFilter: true, styleName: 'tl', footer: { expression: "distinct"   }  },
    { name: 'pack수량', fieldName: 'pack수량', width: '30', header: { text: 'CELL수량' , styleName:'multiline-header'}, mergeRule: { criteria: "value['packNo']"}, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' }, //,footer: {expression: 'sum',numberFormat: '#,###.###',}
    { name: '포장일', fieldName: '포장일', width: '80', header: { text: '포장일',styles :{background: "#FFD700" }}, autoFilter: true, displayCallback: rgDisplayDateTime1 },
    { name: 'pfl', fieldName: 'pfl', width: '80', header: { text: 'PFL정보' }, autoFilter: true, styleName: "goldHeader" },
    { name: '외관검사', fieldName: '외관검사', width: '80', header: { text: '외관검사' }, autoFilter: true, styleName: "goldHeader" },
    { name: '현미경검사', fieldName: '현미경검사', width: '80', header: { text: '현미경검사' }, autoFilter: true, styleName: "goldHeader" },
    { name: '이물제거', fieldName: '이물제거', width: '80', header: { text: '이물제거' }, autoFilter: true, styleName: "goldHeader" },
    { name: '포장구분', fieldName: '포장구분', width: '80', header: { text: '포장구분' }, autoFilter: true, styleName: "goldHeader" },
    { name: '특이사항', fieldName: '특이사항', width: '120', header: { text: '특이사항' }, autoFilter: true, styleName: 'tl' },
    { name: '샘플인계run', fieldName: '샘플인계run', width: '120', header: { text: '샘플인계run' }, visible: false, styleName: 'tl' },
  ],
  layout: [
    {
      name: '출하검사 의뢰정보',
      direction: 'horizontal',
      items: [ "si의뢰일자","si의뢰차수","검사단계", "작업자"],
      header: { text: '출하검사 의뢰정보'}
    },    {
      name: 'PACK 정보',
      direction: 'horizontal',
      items: [ "발행구분", "packNo", "pack수량",  "포장일" ],
      header: { text: 'PACK 정보'}
    },   
    'sel',
    //'originNo',
    {
      name: 'SI RUN 정보',
      direction: 'horizontal',
      items: [ "runId", "수량", "외관검사", "pfl", "현미경검사", "이물제거", "포장구분", "특이사항"],
      header: { 
        text: '출하 검사 RUN 정보',
        styles: {
          background: "#FFD700",
          textAlignment: "center",
          fontBold: true,
          fontSize: "14px"
        }
      }
    },
  ],
};

module.exports = grid;
