/*
 * 포장/출하 > 내포장 실적 > PACK_NO 조회
 */
const { ValueType } = require('realgrid');

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
    edit: { editable: false },
    footers: { visible: false },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colCount: 2 },
  },

  fields: [
    { fieldName: '구분', dataType: ValueType.TEXT },
    { fieldName: '합계', dataType: ValueType.NUMBER, valueExpression: "values['si대기']+values['si의뢰']+values['소포장반출']+values['창고재고']+values['출하완료']+values['폐기']", }, //styles: {numberFormat: "#,##0"}
    { fieldName: 'si대기', dataType: ValueType.NUMBER },
    //{ fieldName: 'siList', dataType: ValueType.NUMBER },
    { fieldName: 'si의뢰', dataType: ValueType.NUMBER },
    { fieldName: '소포장반출', dataType: ValueType.NUMBER },
    { fieldName: '창고재고', dataType: ValueType.NUMBER },
    { fieldName: '출하완료', dataType: ValueType.NUMBER },
    { fieldName: '폐기', dataType: ValueType.NUMBER },
  ],

  columns: [
    { name: '구분', fieldName: '구분', width: '100', header: { text: '구분' }, autoFilter: false, styleName: 'tc' },
    { name: '합계', fieldName: '합계', width: '100', header: { text: '합계' }, autoFilter: false, numberFormat: '#,###,###', styleName: 'tr', footer: [
          {expression: "sum",numberFormat: '#,##0'}, ] },
    { name: 'si대기', fieldName: 'si대기', width: '100', header: { text: '출하검사 대기' }, autoFilter: false, numberFormat: '#,###,###', styleName: 'tr' },
    //{ name: 'siList', fieldName: 'siList', width: '100', header: { text: 'SI_LIST' }, autoFilter: true, numberFormat: '#,###,###', styleName: 'tr' },
    { name: 'si의뢰', fieldName: 'si의뢰', width: '100', header: { text: '출하검사 의뢰' }, autoFilter: false, numberFormat: '#,###,###', styleName: 'tr' },
    { name: '소포장반출', fieldName: '소포장반출', width: '100', header: { text: '소포장 반출' }, autoFilter: false, numberFormat: '#,###,###', styleName: 'tr' },
    { name: '창고재고', fieldName: '창고재고', width: '100', header: { text: '창고 재고' }, autoFilter: false, numberFormat: '#,###,###', styleName: 'tr' },
    { name: '출하완료', fieldName: '출하완료', width: '100', header: { text: '출하 완료' }, autoFilter: false, numberFormat: '#,###,###', styleName: 'tr' },
    { name: '폐기', fieldName: '폐기', width: '100', header: { text: '폐기' }, autoFilter: false, numberFormat: '#,###,###', styleName: 'tr' },
  ],
};

module.exports = grid;
