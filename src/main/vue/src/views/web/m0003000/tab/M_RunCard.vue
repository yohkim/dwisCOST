<template>
  <div>
  </div>
</template>

<script>
import ExcelJS from '@plugins/exceljs.js';
import mRunCardExcel from '@/assets/excel/M_RunCardTemplate.xlsx';

//import ISM from '@/assets/excel/ISM.PNG'; 

export default {
  data() {
    return {
      workbook:null,
      // 색상 매핑 데이터 분리
      colorMap: {
        'Blue': 'FF0000FF',
        'Green': 'FF008000',
        'Red': 'FFFF0000',
        'Black': 'FF000000',
        'Yellow': 'FFFFFF00',
        'Purple': 'FF800080',
        'Pink': 'FFFFC0CB',
        'White': 'FFFFFFFF',
        'Violet': 'FF8A2BE2'
      },
      //라이브러리 버그인지 특정 컬럼에서 오작동함
      //그나마 문제 안일으키는 컬럼으로 수정
      colorMappings : [
          { cell: 'M77', key: 'film전면색1' },
          { cell: 'Q77', key: 'film전면색2' },
          { cell: 'Q83', key: 'film전면색3' },
          { cell: 'M83', key: 'film전면색4' },
          { cell: 'R77', key: 'film배면색1' },
          { cell: 'V77', key: 'film배면색2' },
          { cell: 'V83', key: 'film배면색3' },
          { cell: 'R83', key: 'film배면색4' }
      ],
    };
  },
  mounted() {
    //this.loadExcel();
  },
  methods: {
    async loadExcel() {
      try {
        const response = await fetch(mRunCardExcel);
        const arrayBuffer = await response.arrayBuffer();

        /*const res = await this.$axios.post('/api/excel/getExcelTemplate',{ filePath: 'static/excel/M_RunCardTemplate.xlsx' },{ responseType: "blob" });
        if (res.status !== 200) {
          throw new Error(`HTTP 오류: ${res.status}`);
        }
        const arrayBuffer = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        */
        // ExcelJS로 엑셀 파일 로드
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        this.workbook = workbook;

      } catch (error) {
        console.error('엑셀 파일 로드 중 오류 발생:', error);
      }
    },
    // 색상 설정을 위한 공통 함수
    setCellColor(worksheet, cellAddress, colorKey, data) {
      if (!worksheet || !worksheet.getCell) {
      console.error('유효하지 않은 worksheet 객체');
      return;
      }
      try {
        const colorName = data[colorKey];
        
      console.log('info:',cellAddress+'-'+colorKey +'-' +colorName);
        if (!colorName) return; // 값이 없으면 처리하지 않음
        const cell = worksheet.getCell(cellAddress);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.getColorCode(colorName) }
        };
        return true;
      } catch (error) {
        console.error(`셀 ${cellAddress} 색상 설정 실패:`, error);
        return false;
      }
    },
    async getFilmImage(model){
      const res = await this.$axios.post('/api/m0003000/m0003007/getFilmImage',{ model: model},{ responseType: "arraybuffer" });
      if (res.status !== 200) {
        this.$toast("error", "Film Image를 불러오는데 실패했습니다.");
        return;
      }

      const arrayBuffer = res.data;

      return arrayBuffer;
    },
    async addDataToExcel(data) {
      try {
        const worksheet = this.workbook.getWorksheet('BACK#2'); // 첫 번째 워크시트
        
        // 예제: 새로운 데이터 추가
        //worksheet.addRow(['New Name', 'New Age', 'New Country']);
        //console.log(data);
        
        // 제품구분
        worksheet.getCell('D2').value = data['작업구분'];
        // 고객명
        worksheet.getCell('D4').value = data['고객명'];
        //그...빨간거
        worksheet.getCell('J2').value = `${data['모델명']}"`;
        worksheet.getCell('I4').value = data['runNo'].substring(0,4);
        worksheet.getCell('I6').value = data['glass재질'];
        
        // 두께
        worksheet.getCell('D6').value = data['두께'];

        // glass bcr
        worksheet.getCell('D8').value = `*${data['glassBcr']}*`;
        worksheet.getCell('D9').value = `${data['glassBcr']}`;

        //발행일
        worksheet.getCell('D10').value = data['발행일'];
        
        worksheet.getCell('K5').value = `*${data['runNo']}*`;
        worksheet.getCell('K10').value = `${data['runNo']}`;

        // 특이사항
        worksheet.getCell('AC5').value = data['특이사항'];
        //페이지분리 바로 다음 번호로 하면 어째선지 안됨=>안보이는 행 하나 추가해서 한칸 띄운후 진행
        worksheet.pageSetup.printArea = 'A1:AN45&&A47:AN87';
        /*
        this.colorMappings.forEach(mapping => {
          this.setCellColor(worksheet, mapping.cell, mapping.key, data);
        });
        */
        let imageBuffer = await this.getFilmImage(data['runNo'].substring(0,4));
        // 이미지 등록: filename 대신 buffer를 사용, 확장자는 파일에 맞게 'jpeg', 'png' 등 설정
        const imageId = this.workbook.addImage({
          buffer: imageBuffer,
          extension: 'jpeg',  // 파일에 맞게 확장자 지정 (예: png)
        });
        
        // 워크시트에 이미지 삽입
        // 방법 1: 좌표와 크기를 직접 지정하는 방법
        /*
        worksheet.addImage(imageId, {
          tl: { col: 1, row: 1 },          // 왼쪽 상단 위치 (col과 row는 0 또는 1부터 시작할 수 있으니 주의)
          ext: { width: 500, height: 200 },  // 이미지 크기 (픽셀 단위)
        });
        */
        // 또는 방법 2: 셀 범위를 지정하는 방법 (예: A1:B5)
        worksheet.addImage(imageId, 'AH75:AM85');
      } catch (error) {
        console.error('데이터 추가/수정 중 오류 발생:', error);
      }
    },
    async downloadExcel(runNo='') {
      try {
        const buffer = await this.workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download ='RUN_CARD#2-' +runNo+'.xlsx';
        link.click();
        URL.revokeObjectURL(link.href);
        } catch (error) {
        console.error('엑셀 파일 다운로드 중 오류 발생:', error);
      }
    },
    // 색상 코드 가져오기
    getColorCode(colorName) {
      try {
        return this.colorMap[colorName] || 'FFFFFFFF'; // 기본값 흰색
      } catch (error) {
        console.error('색상 코드 변환 오류:', error);
        return 'FFFFFFFF';
      }
    },

    getColorCode(colorName) {
      const colorMap = {
          'Blue': 'FF0000FF',
          'Green': 'FF008000',
          'Red': 'FFFF0000',
          'Black': 'FF000000',
          'Yellow': 'FFFFFF00',
          'Purple': 'FF800080',
          'Pink': 'FFFFC0CB',
          'White': 'FFFFFFFF',
          'Violet': 'FF8A2BE2'
      };
      // 색상 이름이 색상 맵에 있는지 확인
      if (colorMap[colorName]) {
          return colorMap[colorName];
      } else {
          return 'FFFFFFFF';
      }
    }
  },
};
</script>
