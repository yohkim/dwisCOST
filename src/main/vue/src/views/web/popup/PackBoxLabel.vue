<template>
  <div v-show="isPreview">
    <b-modal
      v-model="isOpen"
      hide-footer
      size="lg"
      no-close-on-backdrop
      centered
    >
      <template #title>
        {{ params.dialogTitle }}
      </template>
      <div ref="pdfContent">
        <div class="lot-card-container page-section page-break">
          <table class="lot-card-table">
            <tr>
              <td rowspan="3">
                <qrcode-vue size="98" :text="PACK.packNo" class="qr_code"/>
                <div style="font-size: 18px;margin-top:10px; line-height:1.0; whiteSpace : pre-wrap;">
                  {{ PACK.packNo.substring(0,15)+'\n'+PACK.packNo.substring(15,30) }}
                </div>
              </td>
              <td>Material Code</td>
              <td>{{ PACK.matCode }}</td>
            </tr>
            <tr>
              <td>SDC Product</td>
              <td>{{ PACK.sdcProd }}</td>
            </tr>
            <tr>
              <td>Supplier(Factory)</td>
              <td>{{ PACK.supplier }}</td>
            </tr>
            <tr>
              <td style="font-size:24px">{{PACK.worker}}</td>
              <td>Quantity</td>
              <td>{{PACK.qty}}</td>
            </tr>
            <tr>
              <td rowspan="2">
                <canvas ref="packNoDatamatrix0"></canvas>
                <div style="font-size: 18px;">
                  {{ PACK.packNoShort }}
                </div>
              </td>
              <td>Run no.</td>
              <td>{{ PACK.runNo }}</td>
            </tr>
            <tr>
              <td>Expiration Date.</td>
              <td>{{ PACK.expDate }}</td>
            </tr>
          </table>
        </div>
        <div class="lot-card-container page-section page-break">
          <table class="lot-card-table">
            <tr>
              <td rowspan="3">
                <qrcode-vue size="98" :text="PACK.boxNo" class="qr_code"/>
                <div style="font-size: 18px;margin-top:10px; line-height:1.0; whiteSpace : pre-wrap;">
                  {{ PACK.boxNo.substring(0,15)+'\n'+PACK.boxNo.substring(15,30) }}
                </div>
              </td>
              <td>Material Code</td>
              <td>{{ PACK.matCode }}</td>
            </tr>
            <tr>
              <td>SDC Product</td>
              <td>{{ PACK.sdcProd }}</td>
            </tr>
            <tr>
              <td>Supplier(Factory)</td>
              <td>{{ PACK.supplier }}</td>
            </tr>
            <tr>
              <td style="font-size:24px">{{PACK.worker}}</td>
              <td>Quantity</td>
              <td>{{PACK.qty}}</td>
            </tr>
            <tr>
              <td rowspan="2">
                <canvas ref="boxNoDatamatrix0"></canvas>
                <div style="font-size: 18px; ">
                  {{ PACK.boxNoShort }}
                </div>
              </td>
              <td>Run no.</td>
              <td>{{ PACK.runNo }}</td>
            </tr>
            <tr>
              <td>Expiration Date.</td>
              <td>{{ PACK.expDate }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="bttn_wrap">
        <b-button block @click="closeDialog">닫기</b-button>
        <b-button class="main" block @click="printLabel"
          >인쇄</b-button
        >
      </div>
    </b-modal>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
import QrcodeVue from 'vue-qrcode-component'
import bwipjs from 'bwip-js';

export default {
  name: "PackBoxLabel",
  components:{QrcodeVue},
  data() {
    return {
      //팝업 관련정보
      isOpen: false,
      isPreview: false,
      params: {
        dialogTitle: "인쇄 미리보기",
        step: 0,
        height: 300,
        width: 500,
        packInfo:{
          packNo:'LJ9707720AE1DLD4N1P1P000701090',
          packNoShort:'P1P000701',
          matCode:'LJ97-07720A',
          sdcProd:'AMF800GX01',
          supplier:'D',
          qty:'090',
          boxNo:'LJ9707720AE1DLD4N1P1P70100090C',
          boxNoShort:'P1P701',
          runNo:'810PB2501-P0014',
          expDate:'2026-01-25',
          worker:'A02'
        },
      },
      runNoInsertInfo:[
        {startYPos:804,yPosInterval:0,fontHeight:70,dateYPos:987,quantityYPos:625,runTopYPos:734,runBotYpos:917},
        {startYPos:760,yPosInterval:80,fontHeight:70,dateYPos:987,quantityYPos:625,runTopYPos:734,runBotYpos:917},
        {startYPos:740,yPosInterval:60,fontHeight:60,dateYPos:987,quantityYPos:625,runTopYPos:734,runBotYpos:917},
        {startYPos:690,yPosInterval:70,fontHeight:70,dateYPos:1020,quantityYPos:580,runTopYPos:670,runBotYpos:980},
        {startYPos:690,yPosInterval:56,fontHeight:56,dateYPos:1020,quantityYPos:580,runTopYPos:670,runBotYpos:980},
        {startYPos:690,yPosInterval:47,fontHeight:47,dateYPos:1020,quantityYPos:580,runTopYPos:670,runBotYpos:980},
        {startYPos:690,yPosInterval:40,fontHeight:40,dateYPos:1020,quantityYPos:580,runTopYPos:670,runBotYpos:980},
        {startYPos:690,yPosInterval:35,fontHeight:35,dateYPos:1020,quantityYPos:580,runTopYPos:670,runBotYpos:980},
        {startYPos:690,yPosInterval:31,fontHeight:31,dateYPos:1020,quantityYPos:580,runTopYPos:670,runBotYpos:980},
        {startYPos:690,yPosInterval:28,fontHeight:28,dateYPos:1020,quantityYPos:580,runTopYPos:670,runBotYpos:980},
        {startYPos:690,yPosInterval:25,fontHeight:25,dateYPos:1020,quantityYPos:580,runTopYPos:670,runBotYpos:980},
        {startYPos:690,yPosInterval:23,fontHeight:23,dateYPos:1020,quantityYPos:580,runTopYPos:670,runBotYpos:980},
        {startYPos:690,yPosInterval:22,fontHeight:22,dateYPos:1020,quantityYPos:580,runTopYPos:670,runBotYpos:980},
        {startYPos:690,yPosInterval:20,fontHeight:20,dateYPos:1020,quantityYPos:580,runTopYPos:670,runBotYpos:980},
      ],
    };
  },
  computed: {
    PACK() {
      return this.params.packInfo;
    }
  },
  methods: {
    async openDialog(params) {
      this.isPreview = true;
      if(params!=undefined)
        Object.assign(this.params, params);
      this.setShortNo();
      try {
        // 캔버스 요소에 Data Matrix 코드 렌더링
        bwipjs.toCanvas(this.$refs['packNoDatamatrix0'], {
          bcid: 'datamatrix',          // Data Matrix 형식 지정
          text: this.PACK.packNoShort,    // 인코딩할 데이터
          scale: 3,                    // 스케일 (필요에 따라 조절)
          //includetext: true           // 텍스트 포함 여부 (옵션)
        });
        bwipjs.toCanvas(this.$refs['boxNoDatamatrix0'], {
          bcid: 'datamatrix',          // Data Matrix 형식 지정
          text: this.PACK.boxNoShort,    // 인코딩할 데이터
          scale: 3,                    // 스케일 (필요에 따라 조절)
          //includetext: true           // 텍스트 포함 여부 (옵션)
        });
        
      } catch (e) {
        console.error(e);
      }
      this.$nextTick(() => {
        this.isOpen = true;
      });
    },
    closeDialog() {
      this.isOpen = false;
    },
    confirm() {
      this.$emit("confirm", this.params);
      this.closeDialog();
    },
    setShortNo(){
      this.PACK.packNoShort=this.PACK.packNo.substring(18,27);
      this.PACK.boxNoShort=this.PACK.boxNo.substring(18,24);
    },
    async printLabel(params){
      if(params!=undefined)
        Object.assign(this.params, params);
      this.setShortNo();
      const packZPLCode = this.getPackZPLCode();
      const boxZPLCode = this.getBoxZPLCode();
      const trayLabelZPLCode = this.getTrayLabelZplCode();
      let packIpInfo;
      let trayIpInfo;
      let param = {
        menuId: "COMCODE",
        queryId: "selectPrinterInfo"
      };
      try {
			  let ipInfo = await this.$axios.api.search(param);
			  packIpInfo = ipInfo.find(elem=>elem.codeName =='Pack용');
        if(!this.PACK.worker.includes("Line"))
          trayIpInfo = ipInfo.find(elem=>elem.codeName =='Tray용');

        console.log(packIpInfo);
        if(!this.PACK.worker.includes("Line"))
          console.log(trayIpInfo);
      } catch {
        this.$toast("error", "프린터 IP를 읽어오는데 실패했습니다.");
        return;
      }
      try {
        //packLabel
        const zplList1 = [packZPLCode,packZPLCode,boxZPLCode,boxZPLCode]
        // 방법 1: 로컬 프린터 API 호출 (예: Zebra 브라우저 프린트)
        const param1 = {
          zplList:zplList1,
          printerIp:packIpInfo.ip,
          printerPort:packIpInfo.port
        }
        let resp1 = await this.$axios.post('/api/print/printZpl',param1);       
        if(!this.PACK.worker.includes("Line")){
          //tray label은 다른 프린터기로 처리
          const zplList2 = [trayLabelZPLCode,trayLabelZPLCode]
          // 방법 1: 로컬 프린터 API 호출 (예: Zebra 브라우저 프린트)
          const param2 = {
            zplList:zplList2,
            printerIp:trayIpInfo.ip,
            printerPort:trayIpInfo.port
          }
         let resp2 = await this.$axios.post('/api/print/printZpl',param2);
        }   
      } catch (error) {
        console.log(error);
        this.$toast("error", '프린트 오류: ' + error.message);
      }
    },
    getTrayLabelZplCode(){
      let zplCode = `^XA
      ^FO30,10^BQ,2,8^FDMM,A${this.PACK.packNo}^FS
      ^FO250,30^A0,55,58 ^FD${this.PACK.packNo.substring(0,10)}^FS
      ^FO250,100^A0,55,58 ^FD${this.PACK.packNo.substring(10,20)}^FS
      ^FO250,170^A0,55,58 ^FD${this.PACK.packNo.substring(20,30)}^FS
      ^FO565,10^BQ,2,8^FDMM,A${this.PACK.packNo}^FS
      ^XZ`;

      return zplCode;
    },
    getRunNoCode(insertData){
      let runNoCode = '';
      let info = insertData.info;
      for(let i = 0;i<insertData.len; i++){
        let yPos = info.startYPos+(info.yPosInterval*i);
        runNoCode+=`^FO1000,${yPos}^A0,${info.fontHeight},50 ^FD${insertData.runList[i]}^FS\n`
      }
      return runNoCode;
    },
    getRunNoInsertData(){
      let runList = this.PACK.runNo.split('\n');
      let info=this.runNoInsertInfo[0];
      let len = 0;
      if(runList.length>0){
        //미리 작성해둔 템플릿 runNo 개수초과 하면 최대치로 적용
        len = runList.length>this.runNoInsertInfo.length?this.runNoInsertInfo.length:runList.length;
        info=this.runNoInsertInfo[len-1];
      }
      return {info,runList,len};
    },
    getPackZPLCode(){
      let insertData = this.getRunNoInsertData();

      let runNoCode = this.getRunNoCode(insertData);

      let zplCode =`^XA
        ^LH50,30^FS
        ^FO10,10^GB1510,1100,4^FS
        ^FO10,550^GB1510,4,4^FS
        ^FO140,100^BQ,2,10^FDMM,A${this.PACK.packNo}^FS
        ^FO25,400^A0,60,60 ^FD${this.PACK.packNo.substring(0,15)}^FS
        ^FO25,460^A0,60,60 ^FD${this.PACK.packNo.substring(15,30)}^FS
        ^FO150,790^BXN,16,200^FD${this.PACK.packNoShort}^FS
        ^FO125,1030^A0,60,60 ^FD${this.PACK.packNoShort}^FS
        ^FO500,183^GB1020,4,4^FS
        ^FO560,65^A0,70,60 ^FDMaterials code^FS
        ^FO1070,70^A0,70,60 ^FD${this.PACK.matCode}^FS
        ^FO580,250^A0,70,60 ^FDSDC  Product^FS
        ^FO1070,253^A0,70,60 ^FD${this.PACK.sdcProd}^FS
        ^FO550,430^A0,70,60 ^FDSupplier(Factory)^FS
        ^FO1220,437^A0,70,60 ^FD${this.PACK.supplier}^FS
        ^FO500,367^GB1020,4,4^FS
        ^FO500,10^GB4,1100,4^FS
        ^FO980,10^GB4,1100,4^FS
        ^FO025,${insertData.info.quantityYPos}^A0,80,70 ^FD${this.PACK.worker}^FS
        ^FO670,${insertData.info.quantityYPos}^A0,70,60 ^FDQuantity^FS
        ^FO1210,${insertData.info.quantityYPos}^A0,70,60 ^FD${this.PACK.qty}^FS
        ^FO10,${insertData.info.runTopYPos}^GB1510,4,4^FS
        ^FO670,790^A0,70,60 ^FDRun no.^FS
        ${runNoCode}
        ^FO500,${insertData.info.runBotYpos}^GB1020,4,4^FS
        ^FO550,${insertData.info.dateYPos}^A0,70,60 ^FDExpiration Date.^FS
        ^FO1080,${insertData.info.dateYPos}^A0,70,60 ^FD${this.PACK.expDate}^FS
        ^XZ
      `;
      console.log(zplCode);
      return zplCode;
    },
    getBoxZPLCode(){
      let insertData = this.getRunNoInsertData();

      let runNoCode = this.getRunNoCode(insertData);

      let zplCode =`^XA
        ^LH50,30^FS
        ^FO10,10^GB1510,1100,4^FS
        ^FO10,550^GB1510,4,4^FS
        ^FO140,100^BQ,2,10^FDMM,A${this.PACK.boxNo}^FS
        ^FO25,400^A0,60,60 ^FD${this.PACK.boxNo.substring(0,15)}^FS
        ^FO25,460^A0,60,60 ^FD${this.PACK.boxNo.substring(15,30)}^FS
        ^FO150,790^BXN,16,200^FD${this.PACK.boxNoShort}^FS
        ^FO125,1030^A0,60,60 ^FD${this.PACK.boxNoShort}^FS
        ^FO500,183^GB1020,4,4^FS
        ^FO560,65^A0,70,60 ^FDMaterials code^FS
        ^FO1070,70^A0,70,60 ^FD${this.PACK.matCode}^FS
        ^FO580,250^A0,70,60 ^FDSDC  Product^FS
        ^FO1070,253^A0,70,60 ^FD${this.PACK.sdcProd}^FS
        ^FO550,430^A0,70,60 ^FDSupplier(Factory)^FS
        ^FO1220,437^A0,70,60 ^FD${this.PACK.supplier}^FS
        ^FO500,367^GB1020,4,4^FS
        ^FO500,10^GB4,1100,4^FS
        ^FO980,10^GB4,1100,4^FS
        ^FO025,${insertData.info.quantityYPos}^A0,80,70 ^FD${this.PACK.worker}^FS
        ^FO670,${insertData.info.quantityYPos}^A0,70,60 ^FDQuantity^FS
        ^FO1210,${insertData.info.quantityYPos}^A0,70,60 ^FD${this.PACK.qty}^FS
        ^FO10,${insertData.info.runTopYPos}^GB1510,4,4^FS
        ^FO670,790^A0,70,60 ^FDRun no.^FS
        ${runNoCode}
        ^FO500,${insertData.info.runBotYpos}^GB1020,4,4^FS
        ^FO550,${insertData.info.dateYPos}^A0,70,60 ^FDExpiration Date.^FS
        ^FO1080,${insertData.info.dateYPos}^A0,70,60 ^FD${this.PACK.expDate}^FS
        ^XZ
      `;
      console.log(zplCode);

      return zplCode;
    },
  },
};
</script>

<style scoped>
.lot-card-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}
.lot-num {
  font-size: 14px;
  font-weight: 600;
}
.lot-card-table {
  border-collapse: collapse;
  /* font-family: Arial, sans-serif; */
  width: 100%;
  text-align: center;
  border: 2px solid black;
  margin-bottom: 20px;
}

.lot-card-table td,
.lot-card-table th {
  border: 1px solid black;
  padding:3px;
  font-size: 16px;
  font-weight: bold;
  height: 54px;
}
.lot-card-table th {
  background-color: #f0f0f0;
  white-space: nowrap;
}
.header {
  font-weight: bold;
  background-color: #f0f0f0;
  width: 20%;
  font-size: 12px;
}
.head_01 td {
  font-size: 11px;
  white-space: nowrap;
}
td.head_01 {
  font-size: 11px !important;
  white-space: nowrap;
}
.head_02 {
  font-size: 9px !important;
  white-space: nowrap;
}
.model-info {
  font-weight: bold;
  text-align: center;
  padding-left: 10px;
  font-size: 12px;
}

.size-info {
  font-size: 36px !important;
  font-weight: bold;
  line-height: 1.1;
  color: red;
}

.lot-card-details {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.4;
  padding: 10px;
  white-space: nowrap;
}

.lot-card-title {
  text-decoration: underline;
  font-size: 28px;
}

.production-run {
  color: red;

  font-weight: bold;
  font-size: 20px;
}

.page-break {
  page-break-after: always; /* 페이지 나누기 */
}

.page-section {
  padding: 10px; /* 섹션 내 여백 */
}
.lot_card {
  border: 1px solid #000;
  border-radius: 5px;
  width: 65px;
  height: 85px;
  margin: 3px auto;
}
.brd_b_bold {
  border-bottom: 2px solid #000;
}
.brd_r_bold {
  border-bottom: 2px solid #000;
}
.title {
  font-size: 21px !important;
  font-weight: 400;
}
.barcode-text {
  font-family: "CODE39-2";
  font-size: 30px; /* 크기 줄임 */
  font-weight: normal;
  letter-spacing: 2px; /* 글자 간격 조정 */
}
.qr_code{
  display: flex;
  justify-content: center;
}
</style>
