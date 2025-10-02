<template>
  <div v-show="isPreview">
    <b-modal v-model="isOpen" hide-footer size="sm" no-close-on-backdrop centered>
      <template #title>
        {{ params.dialogTitle }}
      </template>
      <div ref="pdfContent" class="lot-card-container">
        <table class="lot-card-table">
          <colgroup>
            <col style="width: 65%" />
            <col style="width: 35%" />
          </colgroup>
          <tr>
            <td style="font-size: 60px; line-height: 0.9">{{ params.model }}</td>
            <td rowspan="2"></td>
          </tr>
          <tr>
            <td style="font-size: 70px; line-height: 0.9">{{ getLastNumber(params.palletNo) }}</td>
          </tr>
          <tr>
            <td style="font-size: 20px; line-height: 1">{{ params.palletDate.slice(0, 4) }}-{{ params.palletDate.slice(4, 6) }}</td>
            <td>
              <div style="font-size: 10px; font-weight: bold; text-align: center">
                {{ params.palletNo }}
              </div>
              <qrcode-vue size="25" :text="params.palletNo" class="qr_code" />
              <div style="font-size: 12px">Cell QTY :{{ params['수량'] }}</div>
            </td>
          </tr>
        </table>
      </div>
      <div class="bttn_wrap">
        <b-button block @click="closeDialog">닫기</b-button>
        <b-button class="main" block @click="printLabel">인쇄</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import QrcodeVue from 'vue-qrcode-component';

export default {
  name: 'PalletLabel',
  components: { QrcodeVue },
  data() {
    return {
      //팝업 관련정보
      isOpen: false,
      isPreview: false,
      params: {
        dialogTitle: '인쇄 미리보기',
        step: 0,
        height: 300,
        width: 500,
        palletNo: '',
        palletDate: '',
      },
    };
  },
  computed: {
  },
  methods: {
    async openDialog(params) {
      this.isPreview = true;
      if (params != undefined) Object.assign(this.params, params);
      this.$nextTick(() => {
        this.isOpen = true;
      });
    },
    closeDialog() {
      this.isOpen = false;
    },
    confirm() {
      this.$emit('confirm', this.params);
      this.closeDialog();
    },
    async printLabel(params) {
      console.log(params);
      if (params != undefined) Object.assign(this.params, params);
      const palletZplCode = this.getPalletLabelZplCode();
      let palletIpInfo;
      let param = {
        menuId: 'COMCODE',
        queryId: 'selectPrinterInfo',
      };
      try {
        let ipInfo = await this.$axios.api.search(param);
        palletIpInfo = ipInfo.find((elem) => elem.codeName == 'Pallet용');
      } catch {
        this.$toast('error', '프린터 IP를 읽어오는데 실패했습니다.');
        return;
      }
      try {
        const zplList1 = [palletZplCode];
        // 방법 1: 로컬 프린터 API 호출 (예: Zebra 브라우저 프린트)
        const param = {
          zplList: zplList1,
          printerIp: palletIpInfo.ip,
          printerPort: palletIpInfo.port,
        };
        let resp = await this.$axios.post('/api/print/printZpl', param);
      } catch (error) {
        console.log(error);
        this.$toast('error', '프린트 오류: ' + error.message);
      }
    },
    getPalletLabelZplCode() {
      let zplCode = `^XA
        ^LH50,30^FS 
        ^FO140,30^A0,180,200 ^FD${this.params.model}^FS
        ^FO300,220^A0,230,260 ^FD${this.getLastNumber(this.params.palletNo)}^FS
        ^FO200,470^A0,55,75 ^FD${this.params.palletDate.slice(0, 4)}-${this.params.palletDate.slice(4, 6)}^FS
        ^FO540,400^A0,25,25 ^FD${this.params.palletNo}^FS
        ^FO600,420^BQ,10,3^FDMM,A${this.params.palletNo}^FS
        ^FO545,510^A0,30,30 ^FDCell Qty : ${this.params['수량']}^FS
        ^XZ`;

      return zplCode;
    },
    getLastNumber(str) {
      const parts = str.split('-');
      const lastPart = parts[parts.length - 1];
      return parseInt(lastPart, 10); // 10진수로 파싱해서 앞의 0 제거
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
  /* padding: 0 20px; */
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
}

.lot-card-table td,
.lot-card-table th {
  /* border: 1px solid black; */
  padding: 3px;
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
  font-family: 'CODE39-2';
  font-size: 30px; /* 크기 줄임 */
  font-weight: normal;
  letter-spacing: 2px; /* 글자 간격 조정 */
}
.qr_code {
  display: flex;
  justify-content: center;
}
</style>
