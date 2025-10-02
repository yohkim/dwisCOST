<template>
  <div>
  </div>
</template>

<script>
import ExcelJS from '@plugins/exceljs.js';
import runCardExcel from '@/assets/excel/RunCardTemplate.xlsx'; // 경로에 따라 수정

export default {
  data() {
    return {
      workbook:null,
    };
  },
  mounted() {
    //this.loadExcel();
  },
  methods: {
    async loadExcel() {
      try {
        const response = await fetch(runCardExcel);
        const arrayBuffer = await response.arrayBuffer();

        // ExcelJS로 엑셀 파일 로드
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        this.workbook = workbook;

      } catch (error) {
        console.error('엑셀 파일 로드 중 오류 발생:', error);
      }
    },
    addDataToExcel(data) {
      try {
        const worksheet = this.workbook.getWorksheet('BACK#1'); // 첫 번째 워크시트

        // 예제: 새로운 데이터 추가
        //worksheet.addRow(['New Name', 'New Age', 'New Country']);
        console.log(data.runInfo);
        // 제품구분
        worksheet.getCell('C1').value = data.runInfo['작업구분'];
        // 고객명
        worksheet.getCell('C3').value = data.runInfo['거래처명'];
        // 두께
        worksheet.getCell('C5').value = data.runInfo['자재두께'];
        
        // Glass BCR
        worksheet.getCell('C7').value = `*${data.runInfo['glassBcr']}*`;
        worksheet.getCell('C8').value = `${data.runInfo['glassBcr']}`;
        //그...빨간거
        worksheet.getCell('G3').value = data.runInfo['runNo'].substring(0,4);
        worksheet.getCell('G5').value = `${data.runInfo['자재재질']}`;
        worksheet.getCell('H1').value = `${data.runInfo['제품inch']}"`;

        // run barcode
        worksheet.getCell('I4').value = `*${data.runInfo['runNo']}*`;
        // run barcode2
        worksheet.getCell('I6').value = data.runInfo['runNo'];
        // 특이사항
        worksheet.getCell('U2').value = data.runInfo['특기사항'];

        // 발행일
        worksheet.getCell('C9').value = data.runInfo['작업지시일자'];
        
        for(let i = 0;i<data.lotList.length; i++){
        let index = i*3;
        worksheet.getCell('B'+(12+index)).value = `*${data.lotList[i]['lotNo']}*`;
        //runCell이 lotCell 보다 작으면 짜투리
        if(data.lotList[i]['runCell']<data.lotList[i]['lotCell'])
          worksheet.getCell('B'+(14+index)).value = `${data.lotList[i]['lotNo']}  ${data.lotList[i]['runPart']}`;
        else
          worksheet.getCell('B'+(14+index)).value = data.lotList[i]['lotNo'];
        worksheet.getCell('G'+(12+index)).value = data.lotList[i]['runCell'];
        worksheet.getCell('H'+(12+index)).value = data.lotList[i]['block'];
        }
        //페이지분리 바로 다음 번호로 하면 어째선지 안됨=>안보이는 행 하나 추가해서 한칸 띄운후 진행
        worksheet.pageSetup.printArea = 'A1:AD42&&A44:AD84';
      } catch (error) {
        console.error('데이터 추가/수정 중 오류 발생:', error);
      }
    },
    async downloadExcel(runNo='') {
      try {
        const worksheet = this.workbook.getWorksheet('BACK#1');
        console.log(worksheet.pageSetup.printArea);
        const buffer = await this.workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download ='RUN_CARD#1-' +runNo+'.xlsx';
        link.click();
        URL.revokeObjectURL(link.href);
        } catch (error) {
        console.error('엑셀 파일 다운로드 중 오류 발생:', error);
      }
    },
    
  },
};
</script>
