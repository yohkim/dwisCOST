/*
 * 포장/출하 > 출하 검사> 출하검사 결과조회
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: true, exclusive: true },
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
    fixed: { colBarWidth: 1, colCount: 6 },
  },

  fields: [
    { fieldName: '의뢰차수', dataType: ValueType.TEXT },
    { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: 'si진행단계', dataType: ValueType.TEXT },
    { fieldName: 'si의뢰일', dataType: ValueType.TEXT },
    { fieldName: 'si검사일', dataType: ValueType.TEXT },
    { fieldName: 'si요청자', dataType: ValueType.TEXT },
    { fieldName: 'sample요청자', dataType: ValueType.TEXT },
    { fieldName: 'sample인계자', dataType: ValueType.TEXT },
    { fieldName: 'si검사자', dataType: ValueType.TEXT },
    { fieldName: '총의뢰수량', dataType: ValueType.NUMBER },
    { fieldName: '외관', dataType: ValueType.TEXT },
    { fieldName: '엣지', dataType: ValueType.TEXT },
    { fieldName: '포장이물', dataType: ValueType.TEXT },
    { fieldName: 'curl', dataType: ValueType.TEXT },
    { fieldName: '접촉각', dataType: ValueType.TEXT },
    { fieldName: 'pf저항', dataType: ValueType.TEXT },
    { fieldName: '치수', dataType: ValueType.TEXT },
    { fieldName: '두께', dataType: ValueType.TEXT },
    { fieldName: '강화특성', dataType: ValueType.TEXT },
    { fieldName: '이형력', dataType: ValueType.TEXT },
    { fieldName: '점착력', dataType: ValueType.TEXT },
    { fieldName: '굴곡강도', dataType: ValueType.TEXT },
    { fieldName: '최종결과', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
    { fieldName: 'groupId', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: '의뢰차수', fieldName: '의뢰차수', width: '80', header: { text: '차수' }, autoFilter: true, styleName: 'tl' },
    { name: 'si진행단계', fieldName: 'si진행단계', width: '100', header: { text: 'SI진행단계' }, autoFilter: true, styleName: 'tl', visible: false },
    { name: 'si의뢰일', fieldName: 'si의뢰일', width: '100', header: { text: '의뢰일' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: 'si검사일', fieldName: 'si검사일', width: '100', header: { text: '검사일' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: 'si검사자', fieldName: 'si검사자', width: '100', header: { text: '검사자' }, autoFilter: true, styleName: 'tl' },
    { name: 'model', fieldName: 'model', width: '80', header: { text: 'MODEL' }, autoFilter: true, styleName: 'tl' },
    { name: '총의뢰수량', fieldName: '총의뢰수량', width: '80', header: { text: '수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tl' },
    { name: '외관', fieldName: '외관', width: '80', header: { text: '외관' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], displayLabels: 'label', autoFilter: true, styleName: 'tl' },
    { name: '엣지', fieldName: '엣지', width: '80', header: { text: '엣지' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: '포장이물', fieldName: '포장이물', width: '90', header: { text: '포장이물' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: 'curl', fieldName: 'curl', width: '80', header: { text: 'Curl' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: '접촉각', fieldName: '접촉각', width: '80', header: { text: '접촉각' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: 'pf저항', fieldName: 'pf저항', width: '90', header: { text: 'PF저항' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: '치수', fieldName: '치수', width: '80', header: { text: '치수' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: '두께', fieldName: '두께', width: '80', header: { text: '두께' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: '강화특성', fieldName: '강화특성', width: '90', header: { text: '강화특성' }, lookupDisplay: true, numberFormat: '#,###.###', values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: '이형력', fieldName: '이형력', width: '80', header: { text: '이형력' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: '점착력', fieldName: '점착력', width: '80', header: { text: '점착력' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: '굴곡강도', fieldName: '굴곡강도', width: '90', header: { text: '굴곡강도' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: '최종결과', fieldName: '최종결과', width: '90', header: { text: '최종결과' }, lookupDisplay: true, values: [true, false], labels: ['PASS', 'NG'], autoFilter: true, styleName: 'tl' },
    { name: '특이사항', fieldName: '특이사항', width: '90', header: { text: '특이사항' }, autoFilter: true, styleName: 'tl' },
    { name: 'groupId', fieldName: 'groupId', width: '100', header: { text: 'groupId' }, autoFilter: true, visible: false, styleName: 'tl' },
  ],
};

module.exports = grid;
