<template>
  <div>
  <div class="lot-card-container">
    <table class="lot-card-table">
      <tr style="height: 45px;">
        <td class="header">MODEL</td>
        <td class="model-info">
          {{ LOT.model }}<br />
          {{ LOT.inch }} {{ LOT.revision }}
        </td>
        <td rowspan="3" class="lot-card-details">
          <div class="barcode-text">*{{ LOT.fullLotNumber }}*</div>
          <div class="lot-card-title">UTG LOT CARD</div>
          <div class="production-run">{{ LOT.workTypeLabel }}</div>
        </td>
        <td rowspan="3" class="size-info">
          <div style="text-decoration: underline">{{ LOT.inch }}"</div>
          <div style="font-size: 30px; text-decoration: underline">
            {{ LOT.lotNumber }}
          </div>
          <div style="font-size: 18px; margin-top: 10px">㈜도우인시스</div>
          <div v-show="LOT.printCount>0" style="color: #000; font-size: 12px">재발행</div>
        </td>
      </tr>
      <tr style="height: 45px;">  <!-- 원하는 높이(px) 지정 -->
        <td class="header">Fab In Date</td>
        <td style="vertical-align: middle;">{{ LOT.fabInDate }}</td>
      </tr>
      <tr>
        <td class="header">발행자</td>
        <td>{{ LOT.schedulePublisher }}</td>
      </tr>
    </table>
    <table class="lot-card-table">
      <colgroup>
        <col span="9" style="width: 9%" />
        <col style="width: 10%" />
      </colgroup>
      <tr>
        <th colspan="2">Raw Glass 재질</th>
        <td>{{ LOT.rawGlassMaterial }}</td>
        <th colspan="2">Raw Glass Size</th>
        <td colspan="2">{{ LOT.rawGlassSize }}</td>
        <th>적층수</th>
        <td>{{ LOT.layers }}</td>
        <th>Cell수량</th>
        <td>{{ LOT.cells }}</td>
      </tr>
      <tr>
        <th colspan="2">Glass Type</th>
        <td colspan="3">{{ LOT.glassType }}</td>
        <th colspan="2">LOT-NO</th>
        <td colspan="4" class="lot-num">{{ LOT.fullLotNumber }}</td>
      </tr>
      <tr>
        <th colspan="2">Lot 특이사항</th>
        <td colspan="9" class="lot-remarks">{{ LOT.remarks }}</td>
      </tr>
      <tr class="head_01">
        <th rowspan="2">적층</th>
        <td>입고일</td>
        <td>작업일</td>
        <td>완료시간</td>
        <td>M/C(RL#)</td>
        <td>작업자</td>
        <td>투입수(SH)</td>
        <td>양품수(BK)</td>
        <td>불량수(SH)</td>
        <td colspan="2">Templock Lot No(Tank#)</td>
      </tr>
      <tr>
        <td>{{ LOT.fabInDate }}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>{{ LOT.layers }}</td>
        <td>1</td>
        <th rowspan="2" style="border: 2px solid red; background-color: transparent;"></th>
        <td colspan="2" style="border-left: 2px solid red;"></td>
      </tr>
      <tr>
        <th rowspan="2">자주검사<br />(적층)</th>
        <td colspan="2">Crack</td>
        <td colspan="2">기포</td>
        <td>Scratch</td>
        <td>이물</td>
        <td style="border-right: 2px solid red;">Others</td>
        <td colspan="2" style="border-left: 2px solid red;">특이사항</td>
      </tr>
      <tr>
        <td colspan="2"><br /></td>
        <td colspan="2"></td>
        <td></td>
        <td></td>
        <td></td>
        <td style="border-top: 1px solid red; border-right: none;"></td>
        <td colspan="2"  style="border-left: none;"></td>
      </tr>
      <tr class="head_01">
        <th rowspan="3">가공</th>
        <td>입고일</td>
        <td>작업일</td>
        <td>완료시간</td>
        <td>M/C(CN#)</td>
        <td>작업자</td>
        <td>투입수(BK)</td>
        <td>양품수(BL)</td>
        <td>불량수(BL)</td>
        <td colspan="2">특이사항</td>
      </tr>
      <tr>
        <td><br /></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2"></td>
      </tr>
      <tr class="head_01">
        <td>컷팅</td>
        <td></td>
        <td>증삭</td>
        <td></td>
        <td>정삭</td>
        <td></td>
        <td>진공</td>
        <td>/</td>
        <td colspan="2"></td>
      </tr>
      <tr class="head_01">
        <th rowspan="2">WP</th>
        <td>입고일</td>
        <td>작업일</td>
        <td>완료시간</td>
        <td>M/C(WP#)</td>
        <td>작업자</td>
        <td>투입수(BL)</td>
        <td>양품수(BL)</td>
        <td>불량수(BL)</td>
        <td colspan="2">특이사항</td>
      </tr>
      <tr>
        <td><br /></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2"></td>
      </tr>
      <tr class="head_01">
        <th rowspan="3">UV 박리</th>
        <td>입고일</td>
        <td>작업일</td>
        <td>완료시간</td>
        <td>M/C(DUV#)</td>
        <td>작업자</td>
        <td>투입수(BL)</td>
        <td>양품수(BL)</td>
        <td>불량수(BL)</td>
        <td colspan="2">특이사항</td>
      </tr>
      <tr>
        <td><br /></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td colspan="2" class="head_01">조사량(mj/cm²)</td>
        <td>전면</td>
        <td></td>
        <td class="head_02">시작<br />스테이지온도</td>
        <td style="text-align: right">°C</td>
        <td class="head_01">후면</td>
        <td></td>
        <td class="head_02">중심<br />스테이지 온도</td>
        <td style="text-align: right">°C</td>
      </tr>
    </table>
  </div>
  <div class="lot-card-container">
    <table class="lot-card-table">
      <colgroup>
        <col span="2" style="width: 5.25%" />
        <col style="width: 12.5%" />
        <col span="2" style="width: 5.25%" />
        <col style="width: 12.5%" />
        <col span="2" style="width: 5.25%" />
        <col style="width: 12.5%" />
        <col span="2" style="width: 5.25%" />
        <col style="width: 12.5%" />
      </colgroup>
      <thead>
        <tr>
          <th colspan="12" class="title">형상가공/ 박리 UV 자주검사현황</th>
        </tr>
        <tr>
          <th>BL</th>
          <th>Q'ty</th>
          <th>Mapping</th>
          <th>BL</th>
          <th>Q'ty</th>
          <th>Mapping</th>
          <th>BL</th>
          <th>Q'ty</th>
          <th>Mapping</th>
          <th>BL</th>
          <th>Q'ty</th>
          <th>Mapping</th>
        </tr>
        <tr>
          <th colspan="2">입고일</th>
          <th>검사일</th>
          <th colspan="2">완료시간</th>
          <th>작업자</th>
          <th colspan="2">검사수</th>
          <th>양품수</th>
          <th colspan="2">불량수</th>
          <th>특이사항</th>
        </tr>
        <tr>
          <th colspan="2">/</th>
          <th>/</th>
          <th colspan="2">:</th>
          <th></th>
          <th colspan="2"></th>
          <th></th>
          <th colspan="2"></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
          <td>2</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
          <td>3</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
          <td>4</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
        </tr>
        <tr>
          <td>5</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
          <td>6</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
          <td>7</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
          <td>8</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
        </tr>
        <tr>
          <td>9</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
          <td>10</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
          <td>11</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
          <td>12</td>
          <td></td>
          <td>
            <div class="lot_card"></div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2">입고일</td>
          <td>검사일</td>
          <td colspan="2">완료시간</td>
          <td>작업자</td>
          <td colspan="2">검사수</td>
          <td>양품수</td>
          <td colspan="2">불량수</td>
          <td>특이사항</td>
        </tr>
        <tr>
          <td colspan="2">/</td>
          <td>/</td>
          <td colspan="2">:</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
  <div style="text-align: left; padding-left:5px;">DW-PD-C-003</div>
</div>
</template>

<script>
export default {
  name: "LotCard",
  props: {
    LOT: {
      type: Object,
      default: {
        model: "7073",
        inch: "7.56",
        revision: "Rev#O",
        fabInDate: "2024-11-01",
        fabOutDate: "2024-11-01",
        schedulePublisher: "권동희",
        scheduleApprover: "김현미",
        lotNumber: "7073F",
        workTypeLabel: "11월(P) Production Run_정규",
        rawGlassMaterial: "AS90",
        glassType: "Raw Glass",
        rawGlassSize: "370×570×0.03T",
        fullLotNumber: "7073F2411-P0001",
        layers: "20",
        cells: "160",
        inputCount: "20",
        printCount:"1"
      },
    },
  },
  data() {
    return {
      //팝업 관련정보
      params: {
        dialogTitle: "인쇄 미리보기",
        step: 0,
        height: 300,
        width: 500,
        //lot card 정보
      },
    };
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
.lot-num{
  font-size: 14px;
  font-weight: 600;
  background-color: #9FFCFD;
}
.lot-remarks{
  font-size: 14px;
  font-weight: 600;
}
.lot-card-table {
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  width: 100%;
  text-align: center;
  border: 2px solid black;
  margin-bottom: 20px;
}

.lot-card-table td,
.lot-card-table th {
  border: 1px solid black;
  padding: 2px 1px;
  font-size: 12px;
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
  height: 90px;
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
</style>
