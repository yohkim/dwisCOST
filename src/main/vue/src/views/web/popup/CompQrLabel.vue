<template>
  <div v-show="isPreview">
    <b-modal
      v-model="isOpen"
      hide-footer
      size="large"
      no-close-on-backdrop
      centered
      :style="{  zIndex: zIndex }" 
    >
      <template #title>
        {{ params.dialogTitle }}
      </template>
      <div ref="visibleContent" class="lot-card-container" style="display:flex;">
        <div v-for="(qr, index) in params.qrCodes" :key="'big-' + index"
            style="margin:10px; text-align:center;">
          <qrcode-vue :size="120" :text="qr.code" />
          <div style="font-size: 24px; font-weight: bold; margin-top:5px;">
            {{ qr.text }}
          </div>
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
  name: "CompQrLabel",
  components:{QrcodeVue},
  data() {
    return {
      //팝업 관련정보
      isOpen: false,
      isPreview: false,
      target: "",
      zIndex: 0,
      params: {
        dialogTitle: "인쇄 미리보기",
        step: 0,
        height: 300,
        width: 500,
        qrCodes1: [],
        qrCodes: [
          { text: "", code: "" },
          { text: "", code: "" },
          { text: "", code: "" }
        ]
      },

    };
  },
  computed: {},
  methods: {
    async openDialog(params) {
      this.isPreview = true;
      if(params!=undefined)
      Object.assign(this.params, params);

      this.$nextTick(() => {
        this.params.qrCodes = this.params.qrCodes1.slice(0, 3).map(item => ({
          text: item.text || "", code: item.code || ""
        }));
        this.zIndex = this.$zIndexManager.next();
        this.isOpen = true;
      });
    },
    closeDialog() {
      this.$zIndexManager.release();
      this.isOpen = false;
    },
    confirm() {
      this.$emit("confirm", this.params);
      this.closeDialog();
    },
    async printLabel(params){
      if(params!=undefined)
        Object.assign(this.params, params);
      
      const qrZPLCode = this.getQRZPLCode();
      let qrIpInfo;
      let param = {
        menuId: "COMCODE",
        queryId: "selectPrinterInfo"
      };
      try {
			  let ipInfo = await this.$axios.api.search(param);
			  qrIpInfo = ipInfo.find(elem=>elem.codeName =='QR발행용');
        //console.log(qrIpInfo);
      } catch {
        this.$toast("error", "프린터 IP를 읽어오는데 실패했습니다.");
        return;
      }
      try {
        const zplList2 = [qrZPLCode]
        // 방법 1: 로컬 프린터 API 호출 (예: Zebra 브라우저 프린트)
        let resp2 = await this.$axios.post('/api/print/printZpl',{
          zplList:zplList2,
          printerIp:qrIpInfo.ip,
          printerPort:qrIpInfo.port
        });        
      } catch (error) {
        console.log(error);
        this.$toast("error", '프린트 오류: ' + error.message);
      }
    },
    getQRZPLCode(){
      let zplCode = `^XA`;
      zplCode+=`^LH16,5^FS`;
      if(this.params.qrCodes[0].text != ''){
        zplCode+=`^FO10,2^BQ,2,5^FDMM,A${this.params.qrCodes[0].code}^FS`;
        zplCode+=`^FO5,125^A0,30,30 ^FD${this.params.qrCodes[0].text}^FS`;
      }
      if(this.params.qrCodes[1].text != ''){
        zplCode+=`^FO173,1^BQ,2,5^FDMM,A${this.params.qrCodes[1].code}^FS`;
        zplCode+=`^FO160,125^A0,30,30 ^FD${this.params.qrCodes[1].text}^FS`;
      }
      if(this.params.qrCodes[2].text != ''){
        zplCode+=`^FO333,1^BQ,2,5^FDMM,A${this.params.qrCodes[2].code}^FS`;
        zplCode+=`^FO330,125^A0,30,30 ^FD${this.params.qrCodes[2].text}^FS`;
      }
      zplCode+=`^XZ`;
      //console.log(zplCode);
      return zplCode;
    },    
  },
};
</script>

<style scoped>
.lot-card-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  padding: 0 20px;
}
.lot-num {
  font-size: 14px;
  font-weight: 600;
}
.lot-card-table {
  border-collapse: collapse;
  /* font-family: Arial, sans-serif; */
  width: 90%;
  text-align: center;
  border: 2px solid black;
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
