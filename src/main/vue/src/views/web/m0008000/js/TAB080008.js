/*
 * 품질검사 > 공정모니터링 > 검사의뢰(제조)
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate, rgDisplayDateTime1 } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: true },
    copy: { enabled: true, singleMode: true },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: 'NONE',
      hscrollBar: true,
      showEmptyMessage: true,
    },
    edit: { editable: true, commitByCell: true },
    footers: { visible: false },
    paste: { enabled: true, checkReadOnly: true, enableAppend: false, selectBlockPaste: true, singleMode: false, eventEachRow: true },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colBarWidth: 1, colCount: 1 },
  },

  fields: [
    { fieldName: '공장코드', dataType: ValueType.TEXT },
    { fieldName: '의뢰일자', dataType: ValueType.TEXT },
    { fieldName: '차수', dataType: ValueType.NUMBER },
    { fieldName: '대분류코드', dataType: ValueType.TEXT },
    { fieldName: '중분류코드', dataType: ValueType.TEXT },
    { fieldName: '검사측정항목코드', dataType: ValueType.TEXT },
    { fieldName: '검사측정항목', dataType: ValueType.TEXT },
    { fieldName: '의뢰자', dataType: ValueType.TEXT },
    { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: 'cellId', dataType: ValueType.TEXT },
    { fieldName: '진행상태', dataType: ValueType.TEXT },
    { fieldName: 'utm호기', dataType: ValueType.TEXT },
    { fieldName: '검사자', dataType: ValueType.TEXT },
    { fieldName: '검사시작', dataType: ValueType.TEXT },
    { fieldName: '검사종료', dataType: ValueType.TEXT },
    { fieldName: '판정1', dataType: ValueType.TEXT },
    { fieldName: '판정2', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
    { fieldName: '검사결과확인', dataType: ValueType.TEXT },
    { fieldName: '검사결과확인일시', dataType: ValueType.TEXT },
    { fieldName: 'packno', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: '공장코드', fieldName: '공장코드', width: '80', header: { text: '공장코드' }, autoFilter: true, visible: false, editable: false, styleName: 'tl' },
    { name: '의뢰일자', fieldName: '의뢰일자', width: '100', header: { text: '의뢰일자' }, autoFilter: true, editable: false, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: '차수', fieldName: '차수', width: '80', header: { text: '차수' }, autoFilter: true, numberFormat: '#,###.###', editable: false, styleName: 'tr' },
    { name: '대분류코드', fieldName: '대분류코드', width: '100', header: { text: '대분류코드' }, autoFilter: true, visible: false, editable: false, styleName: 'tl' },
    { name: '중분류코드', fieldName: '중분류코드', width: '100', header: { text: '중분류코드' }, autoFilter: true, visible: false, editable: false, styleName: 'tl' },
    { name: '검사측정항목코드', fieldName: '검사측정항목코드', width: '100', header: { text: '검사측정항목코드' }, autoFilter: true, visible: false, editable: false, styleName: 'tl' },
    { name: '검사측정항목', fieldName: '검사측정항목', width: '120', header: { text: '검사측정항목' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: '의뢰자', fieldName: '의뢰자', width: '100', header: { text: '의뢰자' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: 'model', fieldName: 'model', width: '80', header: { text: 'model' }, autoFilter: true, visible: false, editable: false, styleName: 'tl' },
    { name: 'packno', fieldName: 'packno', width: '230', header: { text: 'Pack No.' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: 'runNo', fieldName: 'runNo', width: '120', header: { text: 'Run No.' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: 'cellId', fieldName: 'cellId', width: '220', header: { text: 'QR code(Cell)' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: '진행상태', fieldName: '진행상태', width: '80', header: { text: '진행상태' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: 'utm호기', fieldName: 'utm호기', width: '100', header: { text: 'UTM호기' }, autoFilter: true, editable: false, visible: false, styleName: 'tl' },
    { name: '검사자', fieldName: '검사자', width: '100', header: { text: '검사자' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: '검사시작', fieldName: '검사시작', width: '140', header: { text: '검사시작' }, autoFilter: true, editable: false, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    { name: '검사종료', fieldName: '검사종료', width: '140', header: { text: '검사종료' }, autoFilter: true, editable: false, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    {
      name: '판정1',
      fieldName: '판정1',
      width: '80',
      header: { text: '판정1' },
      values: ['PASS', 'NG'],
      editor: {
        type: 'dropdown',
        domainOnly: true, //*** dropdown 목록에 있는 값만 허용하고자 할때
        dropDownWhenClick: true, //셀을 클릭해도 dropdown 목록이 펼쳐지길 원할때
      },
      autoFilter: true,
      styleName: 'edit tl',
      editable: true,
    },
    {
      name: '판정2',
      fieldName: '판정2',
      width: '80',
      header: { text: '판정2' },
      values: ['PASS', 'NG'],
      editor: {
        type: 'dropdown',
        domainOnly: true, //*** dropdown 목록에 있는 값만 허용하고자 할때
        dropDownWhenClick: true, //셀을 클릭해도 dropdown 목록이 펼쳐지길 원할때
      },
      autoFilter: true,
      styleName: 'edit tl',
      editable: true,
    },
    { name: '특이사항', fieldName: '특이사항', width: '120', header: { text: '특이사항' }, autoFilter: true, styleName: 'edit tl', editable: true },
    { name: '검사결과확인', fieldName: '검사결과확인', width: '100', header: { text: '확인자' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: '검사결과확인일시', fieldName: '검사결과확인일시', width: '140', header: { text: '검사결과 확인일시' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1, editable: false },
  ],
  layout: [
    {
      name: '제조',
      direction: 'horizontal',
      items: ['의뢰일자', '차수', '검사측정항목', '의뢰자', 'packno', 'runNo', 'cellId'],
      header: { text: '제조' },
    },
    {
      name: '품질',
      direction: 'horizontal',
      items: ['진행상태', 'utm호기', '검사자', '검사시작', '검사종료', '판정1', '판정2', '특이사항'],
      header: { text: '품질' },
    },
    {
      name: '제조 검사결과 확인',
      direction: 'horizontal',
      items: ['검사결과확인', '검사결과확인일시'],
      header: { text: '제조 검사결과 확인' },
    },
  ],
};

module.exports = grid;
