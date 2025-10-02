/*
 * 제조 실적 입력 > FRONT > 설비 로그 조회
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate, rgDisplayDateTime3 } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: false },
    copy: { enabled: true },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: 'NONE',
      hscrollBar: true,
      showEmptyMessage: true,
    },
    edit: { editable: false },
    footers: { visible: false },
    fixed: {colCount:2},
    header: { heights: [25, 50] },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true, style: "inclusive" },
    stateBar: { visible: false },    
    filtering: {
      automating: {
        textCategorize: true,         
        textCategoryCallback: function (column, values) {}
      }
    }
  },
  
  fields: [],

  orgFields: [
    { fieldName: '차수', dataType: ValueType.TEXT },
    { fieldName: 'area', dataType: ValueType.TEXT },
    { fieldName: '공정명', dataType: ValueType.TEXT },
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: 'poNo', dataType: ValueType.TEXT },
    { fieldName: 'panelId', dataType: ValueType.TEXT },
    { fieldName: 'lotNo', dataType: ValueType.TEXT },
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
    { fieldName: '작업자', dataType: ValueType.TEXT },
    { fieldName: 'shift', dataType: ValueType.TEXT },
    { fieldName: '작업시작', dataType: ValueType.TEXT },
    { fieldName: '작업시작시간', dataType: ValueType.TEXT },
    { fieldName: '작업종료', dataType: ValueType.TEXT },
    { fieldName: '작업종료시간', dataType: ValueType.TEXT },
    { fieldName: '투입수량', dataType: ValueType.NUMBER },
    { fieldName: '양품수량', dataType: ValueType.NUMBER },
    { fieldName: '수율', dataType: ValueType.NUMBER },
    { fieldName: '불량수량', dataType: ValueType.NUMBER },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
    { fieldName: 'rn', dataType: ValueType.NUMBER },
  ],
  
  columns: [],

  orgColumns1: [
    { name: '차수', fieldName: '차수', header: { text: '차수' }, width: 80, autoFilter: true, styleName: "tl" },
    { name: 'area', fieldName: 'area', header: { text: 'AREA' }, width: 150, autoFilter: true, styleName: "tl" },
    { name: '공정명', fieldName: '공정명', header: { text: '공정명' }, width: 120, autoFilter: true, styleName: "tl" },
    { name: '공정코드', fieldName: '공정코드', header: { text: '공정코드' }, autoFilter: true, styleName: "tl" },
    { name: 'poNo', fieldName: 'poNo', header: { text: 'PO NO' }, width: 150, autoFilter: true, styleName: "tl" },
    { name: 'panelId', fieldName: 'panelId', header: { text: 'PANEL ID' }, width: 270, autoFilter: true, styleName: "tl" },
    { name: 'lotNo', fieldName: 'lotNo', header: { text: 'LOT NO' }, width: 150, autoFilter: true, styleName: "tl" },
    { name: 'runNo', fieldName: 'runNo', header: { text: 'RUN NO' }, width: 150, autoFilter: true, styleName: "tl" },
    { name: '설비약명', fieldName: '설비약명', header: { text: '설비약명' }, width: 120, autoFilter: true, styleName: "tl" },
    { name: '작업자', fieldName: '작업자', header: { text: '작업자' }, width: 120, autoFilter: true, styleName: "tl" },
    { name: 'shift', fieldName: 'shift', header: { text: 'SHIFT' }, width: 120, autoFilter: true, styleName: "tl" },
    { name: '작업시작시간', fieldName: '작업시작시간', header: { text: '작업시작시간' }, width: 120, autoFilter: true,
      displayCallback: rgDisplayDateTime3
    },
    { name: '작업종료시간', fieldName: '작업종료시간', header: { text: '작업종료시간' }, width: 120, autoFilter: true,
      displayCallback: rgDisplayDateTime3
    },    
    { name: '투입수량', fieldName: '투입수량', header: { text: 'IN' }, width: 80, numberFormat: "#,##0", autoFilter: true, styleName: "tr",
      footer: {
        expression: "sum",
        numberFormat: "#,##0",
        styleName: "tr"
      }
    },
    { name: '양품수량', fieldName: '양품수량', header: { text: 'OUT' }, width: 80, numberFormat: "#,##0", autoFilter: true, styleName: "tr",
      footer: {
        expression: "sum",
        numberFormat: "#,##0",
        styleName: "tr"
      }
    },
    { name: '수율', fieldName: '수율', header: { text: '수율' }, width: 80, numberFormat: "#,##0.0", autoFilter: true, styleName: "tr",
      footer: {
        numberFormat: "#,##0.0",
        valueCallback: function (grid, column, footerIndex, columnFooter, value){          
          var sum1 = 0;
          var sum2 = 0;
          var prod = grid.getDataSource();
          let rows = grid.getFilteredRows();
          for(let row of rows){            
            sum1 += prod.getValue(row, '양품수량');
            sum2 += prod.getValue(row, '불량수량');
          }
          return Math.round((sum1 / (sum1 + sum2)) * 1000) / 10;  
        }
      }
    },
    { name: '불량수량', fieldName: '불량수량', header: { text: '불량합' }, width: 80, numberFormat: "#,##0", autoFilter: true, styleName: "tr",
      footer: {
        expression: "sum",
        numberFormat: "#,##0",
        styleName: "tr"
      }
    },    
    { name: '특이사항', fieldName: '특이사항', width: '150', header: { text: '특이사항' }, autoFilter: true, styleName: "tl", renderer: { showTooltip: true }},	
  ],

  orgColumns2: [
    { name: '차수', fieldName: '차수', header: { text: '차수' }, width: 80, autoFilter: true, styleName: "tl" },
    { name: 'area', fieldName: 'area', header: { text: 'AREA' }, width: 150, autoFilter: true, styleName: "tl" },
    { name: '공정명', fieldName: '공정명', header: { text: '공정명' }, width: 120, autoFilter: true, styleName: "tl" },
    { name: '공정코드', fieldName: '공정코드', header: { text: '공정코드' }, width: 120, autoFilter: true, styleName: "tl" },
    { name: 'poNo', fieldName: 'poNo', header: { text: 'PO NO' }, width: 150, autoFilter: true, styleName: "tl" },
    { name: 'panelId', fieldName: 'panelId', header: { text: 'PANEL ID' }, width: 270, autoFilter: true, styleName: "tl" },
    { name: 'lotNo', fieldName: 'lotNo', header: { text: 'LOT NO' }, width: 150, autoFilter: true, styleName: "tl" },
    { name: 'runNo', fieldName: 'runNo', header: { text: 'RUN NO' }, width: 150, autoFilter: true, styleName: "tl", mergeRule: { criteria: "values['차수'] + value" } },
    { name: '설비약명', fieldName: '설비약명', header: { text: '설비약명' }, width: 120, autoFilter: true, styleName: "tl" },
    { name: '작업자', fieldName: '작업자', header: { text: '작업자' }, width: 120, autoFilter: true, styleName: "tl" },
    { name: 'shift', fieldName: 'shift', header: { text: 'SHIFT' }, width: 120, autoFilter: true, styleName: "tl" },
    { name: '작업시작시간', fieldName: '작업시작시간', header: { text: '작업시작시간' }, width: 120, autoFilter: true,
      displayCallback: rgDisplayDateTime3
    },
    { name: '작업종료시간', fieldName: '작업종료시간', header: { text: '작업종료시간' }, width: 120, autoFilter: true,
      displayCallback: rgDisplayDateTime3
    },    
    { name: '투입수량', fieldName: '투입수량', header: { text: 'IN' }, width: 80, numberFormat: "#,##0", autoFilter: true, styleName: "tr",
      footer: {
        numberFormat: "#,##0",
        valueCallback: function (grid, column, footerIndex, columnFooter, value){  
          var sum = 0;
          var prod = grid.getDataSource();
          let rows = grid.getFilteredRows();
          for(let row of rows){            
            if(prod.getValue(row, 'rn') == 1){
              sum += prod.getValue(row, column.fieldName);
            }
          }
          return sum;  
        }
      }
    },
    { name: '양품수량', fieldName: '양품수량', header: { text: 'OUT' }, width: 80, numberFormat: "#,##0", autoFilter: true, styleName: "tr",
      footer: {
        numberFormat: "#,##0",
        valueCallback: function (grid, column, footerIndex, columnFooter, value){          
          var sum = 0;
          var prod = grid.getDataSource();
          let rows = grid.getFilteredRows();
          for(let row of rows){            
            if(prod.getValue(row, 'rn') == 1){
              sum += prod.getValue(row, column.fieldName);
            }
          }
          return sum;  
        }
      }
    },
    { name: '수율', fieldName: '수율', header: { text: '수율' }, width: 80, numberFormat: "#,##0.0", autoFilter: true, styleName: "tr",
      footer: {
        numberFormat: "#,##0.0",
        valueCallback: function (grid, column, footerIndex, columnFooter, value){          
          var sum1 = 0;
          var sum2 = 0;
          var prod = grid.getDataSource();
          let rows = grid.getFilteredRows();
          for(let row of rows){            
            if(prod.getValue(row, 'rn') == 1){
              sum1 += prod.getValue(row, '양품수량');
              sum2 += prod.getValue(row, '불량수량');
            }
          }
          return Math.round((sum1 / (sum1 + sum2)) * 1000) / 10;  
        }
      }
    },
    { name: '불량수량', fieldName: '불량수량', header: { text: '불량합' }, width: 80, numberFormat: "#,##0", autoFilter: true, styleName: "tr",
      footer: {
        numberFormat: "#,##0",
        valueCallback: function (grid, column, footerIndex, columnFooter, value){          
          var sum = 0;
          var prod = grid.getDataSource();
          let rows = grid.getFilteredRows();
          for(let row of rows){            
            if(prod.getValue(row, 'rn') == 1){
              sum += prod.getValue(row, column.fieldName);
            }
          }
          return sum;  
        }
      }
    },    
    { name: '특이사항', fieldName: '특이사항', width: '150', header: { text: '특이사항' }, autoFilter: true, styleName: "tl", renderer: { showTooltip: true } },	
  ],

  layout: [],

  orgLayout1: [
    {
      name:"group1",
      expandable: true,
      expanded: false,
      items:[
        {column: "area", groupShowMode:"always"},
        {column: "공정명", groupShowMode:"always"},
        {column: "차수", groupShowMode:"always"},
        {column: "작업시작시간", groupShowMode:"always"},
        {column: "작업종료시간", groupShowMode:"always"},        
        {column: "poNo", groupShowMode:"expand"},        
        {column: "panelId", groupShowMode:"expand"},        
        {column: "lotNo", groupShowMode:"always"},        
      ],
      header: { text: "요약" }
    },
    {
      name:"group2",
      expandable: true,
      expanded: false,
      items:[
        {column: "runNo", groupShowMode:"always"},
        {column: "특이사항", groupShowMode:"expand"},
        {column: "설비약명", groupShowMode:"expand"},
        {column: "작업자", groupShowMode:"expand"},
        {column: "shift", groupShowMode:"expand"},        
        {column: "투입수량", groupShowMode:"always"},        
        {column: "양품수량", groupShowMode:"always"},        
        {column: "수율", groupShowMode:"always"},        
        {column: "불량수량", groupShowMode:"always"},   
      ],
      header: { text: "기본 정보" }
    },    
  ],

  orgLayout2: [
    {
      name:"group1",
      items:[
        {column: "area", groupShowMode:"always"},
        {column: "공정명", groupShowMode:"always"},
        {column: "차수", groupShowMode:"always"},
        {column: "작업시작시간", groupShowMode:"always"},
        {column: "작업종료시간", groupShowMode:"always"},        
      ],
      header: { text: "요약" }
    },
    {
      name:"group2",
      expandable: true,
      expanded: false,
      items:[
        {column: "runNo", groupShowMode:"always"},
        {column: "특이사항", groupShowMode:"expand"},
        {column: "설비약명", groupShowMode:"expand"},
        {column: "작업자", groupShowMode:"expand"},
        {column: "shift", groupShowMode:"expand"},        
        {column: "투입수량", groupShowMode:"always"},        
        {column: "양품수량", groupShowMode:"always"},        
        {column: "수율", groupShowMode:"always"},        
        {column: "불량수량", groupShowMode:"always"},        
      ],
      header: { text: "기본 정보" }
    },    
  ]
};

module.exports = grid;
