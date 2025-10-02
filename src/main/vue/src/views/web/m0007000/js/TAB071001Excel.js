/*
 * 카세트 관리 > 카세트 불출 > ?? 카세트 > 대상 업로드
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

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
    edit: { editable: true },
    footers: { visible: false },
    paste: { enabled: true },
    rowIndicator: { visible: false },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    header: { height: 45 },
  },

  fields: [
    { fieldName: '불출대기일자', dataType: ValueType.TEXT },
    { fieldName: 'seqNo', dataType: ValueType.NUMBER },
    { fieldName: '종류', dataType: ValueType.TEXT },
    { fieldName: '타입', dataType: ValueType.TEXT },
    { fieldName: '모델', dataType: ValueType.TEXT },
    { fieldName: 'cstNo', dataType: ValueType.TEXT },
    { fieldName: '열', dataType: ValueType.NUMBER },
    { fieldName: '행', dataType: ValueType.NUMBER },
    { fieldName: '카세트팀담당자', dataType: ValueType.TEXT },
  ],

  columns: [
    {
      name: '불출대기일자',
      fieldName: '불출대기일자',
      width: '100',
      header: { text: '불출대기일자(YYYYMMDD)' },
      autoFilter: true,
      displayCallback: rgDisplayDate,
    },
    { name: 'seqNo', fieldName: 'seqNo', width: '80', header: { text: 'seq_no' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: '종류', fieldName: '종류', width: '80', header: { text: '종류' }, autoFilter: true, styleName: 'tl' },
    { name: '타입', fieldName: '타입', width: '80', header: { text: '타입' }, autoFilter: true, styleName: 'tl' },
    { name: '모델', fieldName: '모델', width: '80', header: { text: '모델' }, autoFilter: true, styleName: 'tl' },
    { name: 'cstNo', fieldName: 'cstNo', width: '80', header: { text: 'CST_NO' }, autoFilter: true, styleName: 'tl' },
    { name: '열', fieldName: '열', width: '80', header: { text: '열' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: '행', fieldName: '행', width: '80', header: { text: '행' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: '카세트팀담당자', fieldName: '카세트팀담당자', width: '100', header: { text: '카세트팀_담당자' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
