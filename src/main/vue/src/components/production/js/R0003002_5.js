/*
 * 제조 실적 입력 > Back#2 Cassette QC > 설비 로그 조회
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
    fixed: { colBarWidth: 1, colCount: 5 },
  },

  fields: [
    { fieldName: '작업일자', dataType: ValueType.TEXT },
    { fieldName: '설비호기', dataType: ValueType.TEXT },
    { fieldName: '근무조', dataType: ValueType.TEXT },
    { fieldName: '검사자', dataType: ValueType.TEXT },
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: 'cell수량', dataType: ValueType.NUMBER },
    { fieldName: '시작', dataType: ValueType.TEXT },
    { fieldName: '종료', dataType: ValueType.TEXT },
    { fieldName: '번호', dataType: ValueType.TEXT },
    { fieldName: '수량1', dataType: ValueType.TEXT },
    { fieldName: '행', dataType: ValueType.TEXT },
    { fieldName: '열', dataType: ValueType.TEXT },
    { fieldName: '위치', dataType: ValueType.TEXT },
    { fieldName: '수량', dataType: ValueType.NUMBER },
    { fieldName: '깨짐', dataType: ValueType.NUMBER },
    { fieldName: '흡착', dataType: ValueType.NUMBER },
  ],

  columns: [
    { name: '작업일자', fieldName: '작업일자', width: '80', header: { text: '작업일자' }, autoFilter: true, styleName: 'tl' },
    { name: '설비호기', fieldName: '설비호기', width: '80', header: { text: '설비호기' }, autoFilter: true, styleName: 'tl' },
    { name: '근무조', fieldName: '근무조', width: '80', header: { text: '근무조' }, autoFilter: true, styleName: 'tl' },
    { name: '검사자', fieldName: '검사자', width: '90', header: { text: '검사자' }, autoFilter: true, styleName: 'tl' },
    { name: 'runNo', fieldName: 'runNo', width: '250', header: { text: 'RUN No.' }, autoFilter: true, styleName: 'tl' },
    { name: 'cell수량', fieldName: 'cell수량', width: '80', header: { text: 'CELL수량' }, autoFilter: true, numberFormat: '#,###.####', styleName: 'tr' },
    { name: '시작', fieldName: '시작', width: '80', header: { text: '시작' }, autoFilter: true, styleName: 'tl' },
    { name: '종료', fieldName: '종료', width: '80', header: { text: '종료' }, autoFilter: true, styleName: 'tl' },
    { name: '번호', fieldName: '번호', width: '80', header: { text: '번호' }, autoFilter: true, styleName: 'tl' },
    { name: '수량1', fieldName: '수량1', width: '80', header: { text: '수량' }, autoFilter: true, styleName: 'tl' },
    { name: '행', fieldName: '행', width: '80', header: { text: '행' }, autoFilter: true, styleName: 'tl' },
    { name: '열', fieldName: '열', width: '80', header: { text: '열' }, autoFilter: true, styleName: 'tl' },
    { name: '위치', fieldName: '위치', width: '80', header: { text: '위치' }, autoFilter: true, styleName: 'tl' },
    { name: '수량', fieldName: '수량', width: '80', header: { text: '수량' }, autoFilter: true, numberFormat: '#,###.####', styleName: 'tr' },
    { name: '깨짐', fieldName: '깨짐', width: '80', header: { text: '깨짐' }, autoFilter: true, numberFormat: '#,###.####', styleName: 'tr' },
    { name: '흡착', fieldName: '흡착', width: '80', header: { text: '흡착' }, autoFilter: true, numberFormat: '#,###.####', styleName: 'tr' },
  ],

  layout: [
    '작업일자',
    '설비호기',
    '근무조',
    '검사자',
    'runNo',
    'cell수량',
    {
      name: '작업시간',
      direction: 'horizontal',
      items: ['시작', '종료'],
      header: { text: '작업시간' },
    },
    {
      name: '카세트',
      direction: 'horizontal',
      items: ['번호', '수량1', '행', '열'],
      header: { text: '카세트' },
    },
    {
      name: 'Scrap',
      direction: 'horizontal',
      items: ['위치', '수량'],
      header: { text: 'Scrap' },
    },
    '깨짐',
    '흡착',
  ],
};

module.exports = grid;
