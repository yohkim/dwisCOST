/*
 * 작업현황 > 생산 일보
 */
const { ValueType,SummaryMode } = require('realgrid');
const grid = {
  dataProvider: null,
	gridView: null,
  options: {
    checkBar: { visible: false },
    copy: { enabled: true, singleMode: false },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      // fitStyle: GridFitStyle.NONE,
      hscrollBar: true,
      showEmptyMessage: true,
      summaryMode: SummaryMode.AGGREGATE,
    },
    fixed: {colCount:2},
    edit: { editable: false },
    header: { height: 25 },
    paste: { enabled: false },
    rowIndicator: { visible: false },
    sorting: { enabled: false },
    stateBar: { visible: false },    
    footers: { 
      visible: true, 
      items:[
      ]
    },
  },
  
  fields: [
    { fieldName: '구분', dataType: ValueType.TEXT },
    { fieldName: '도우코드', dataType: ValueType.TEXT },
    { fieldName: '도우모델', dataType: ValueType.TEXT },
    { fieldName: '작업구분', dataType: ValueType.TEXT },
    { fieldName: 'org작업구분', dataType: ValueType.TEXT },
    { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: 'inch', dataType: ValueType.TEXT },
    { fieldName: 'site', dataType: ValueType.TEXT },
    
    { fieldName: 'bohDay', dataType: ValueType.NUMBER },
    { fieldName: 'bohWeek', dataType: ValueType.NUMBER },
    { fieldName: 'bohMonth', dataType: ValueType.NUMBER },

    { fieldName: 'inDay', dataType: ValueType.NUMBER },
    { fieldName: 'inWeek', dataType: ValueType.NUMBER },
    { fieldName: 'inMonth', dataType: ValueType.NUMBER },

    { fieldName: 'bonusDay', dataType: ValueType.NUMBER },
    { fieldName: 'bonusWeek', dataType: ValueType.NUMBER },
    { fieldName: 'bonusMonth', dataType: ValueType.NUMBER },

    { fieldName: 'eoh', dataType: ValueType.NUMBER },

    { fieldName: 'outDay', dataType: ValueType.NUMBER },
    { fieldName: 'outWeek', dataType: ValueType.NUMBER },
    { fieldName: 'outMonth', dataType: ValueType.NUMBER },

    { fieldName: 'lossDay', dataType: ValueType.NUMBER },
    { fieldName: 'lossWeek', dataType: ValueType.NUMBER },
    { fieldName: 'lossMonth', dataType: ValueType.NUMBER },

    { fieldName: 'shippingDay', dataType: ValueType.NUMBER },
    { fieldName: 'shippingWeek', dataType: ValueType.NUMBER },
    { fieldName: 'shippingPlanMonth', dataType: ValueType.NUMBER },
    { fieldName: 'shippingActualMonth', dataType: ValueType.NUMBER },

    
  ],

  columns: [
    { name: '구분', fieldName: '구분', header: { text: '구분' }, width: '80',autoFilter: true, styleName: "tc", mergeRule: { criteria: "value" }},
    { name: '도우코드', fieldName: '도우코드', header: { text: '도우코드' }, width: '90',autoFilter: true, styleName: "tc", mergeRule: { criteria: "values['구분'] + value"}},
    { name: '도우모델', fieldName: '도우모델', header: { text: '도우모델' }, width: '90',autoFilter: true, styleName: "tc", mergeRule: { criteria: "values['구분'] + values['도우코드'] + value"}},
    { name: '작업구분', fieldName: '작업구분', header: { text: '작업구분' }, width: '90',autoFilter: true, styleName: "tc"},
    { name: 'org작업구분', fieldName: 'org작업구분', header: { text: 'org작업구분' }, width: '110',autoFilter: true, styleName: "tc"},

    { name: 'model', fieldName: 'model', header: { text: 'Model' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'inch', fieldName: 'inch', header: { text: 'Inch' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'site', fieldName: 'site', header: { text: 'Site' }, width: '80',autoFilter: true, styleName: "tc",footer: [{text: "Total"},{text: "양산"},{text: "개발"}]},
    

    { name: 'bohDay', fieldName: 'bohDay', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'bohWeek', fieldName: 'bohWeek', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'bohMonth', fieldName: 'bohMonth', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},

    { name: 'inDay', fieldName: 'inDay', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'inWeek', fieldName: 'inWeek', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'inMonth', fieldName: 'inMonth', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},

    { name: 'bonusDay', fieldName: 'bonusDay', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'bonusWeek', fieldName: 'bonusWeek', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'bonusMonth', fieldName: 'bonusMonth', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    
    { name: 'eoh', fieldName: 'eoh', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},

    { name: 'outDay', fieldName: 'outDay', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'outWeek', fieldName: 'outWeek', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'outMonth', fieldName: 'outMonth', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},

    { name: 'lossDay', fieldName: 'lossDay', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'lossWeek', fieldName: 'lossWeek', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'lossMonth', fieldName: 'lossMonth', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},

    { name: 'shippingDay', fieldName: 'shippingDay', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'shippingWeek', fieldName: 'shippingWeek', header: { text: '' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'shippingPlan', fieldName: 'shippingPlanMonth', header: { text: 'Plan' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
    { name: 'shippingActual', fieldName: 'shippingActualMonth', header: { text: 'Actual' }, width: '100', styleName: "tr",numberFormat: '#,##0',needFooter:true},
  ],
  
  layout: [  
    "구분",
    {name: "Product",header:{ text: "Product" }, items:["도우코드","도우모델","작업구분","org작업구분","model","inch","site"]},
    {name: "BOH",header:{ text: "BOH" }, items:["bohDay","bohWeek","bohMonth"]},
    {name: "in",header:{ text: "In(적층 기준)" }, items:["inDay","inWeek","inMonth"]},
    {name: "BONUS",header:{ text: "BONUS" }, items:["bonusDay","bonusWeek","bonusMonth"]},
    {name: "eohParent",header:{ text: "EOH" }, items:["eoh"]},
    {name: "out",header:{ text: "Out(이물제거 기준)" }, items:["outDay","outWeek","outMonth"]},
    {name: "loss",header:{ text: "Loss" }, items:["lossDay","lossWeek","lossMonth"]},
    {name: "shipping",header:{ text: "Shipping" }, 
      items:[
        "shippingDay",
        "shippingWeek",
        {name: "shippingMonthMonth",header:{ text: "" }, items:["shippingPlan","shippingActual"]},
      ]
    },
  ],
};

module.exports = grid;
