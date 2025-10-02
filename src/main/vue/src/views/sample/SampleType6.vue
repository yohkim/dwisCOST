<template>
<div style="overflow-y:scroll">
        <div class="lot-card-container page-section">
              <table class="lot-card-table">
                <tr>
                  <td class="header">MODEL</td>
                  <td class="model-info">
                   LOT.model <br />
                   LOT.inchLOT.revision
                  </td>
                  <td rowspan="5" class="lot-card-details">
                    <div>*LOT.fullLotNumber</div>
                    <div class="lot-card-title">UTG LOT CARD</div>
                    <div class="production-run">LOT.workTypeLabel</div>
                  </td>
                  <td rowspan="5" class="size-info">
                   LOT.inch"<br />
                   LOT.lotNumber
                  </td>
                </tr>
                <tr>
                  <td class="header">Fab Out Date</td>
                  <td class="header">Fab In Date</td>
                </tr>
                <tr>
                  <td>LOT.fabInDate</td>
                  <td>LOT.fabOutDate</td>
                </tr>
                <tr>
                  <td class="header">스케줄</td>
                  <td>LOT.schedulePublisher</td>
                </tr>
                <tr>
                  <td class="header">스케줄 승인</td>
                  <td>LOT.scheduleApprover</td>
                </tr>
              </table>
              <table class="lot-card-table">
                <tr>
                  <td colspan="2">Raw Glass 재질</td>
                  <td>LOT.rawGlassMaterial</td>
                  <td colspan="2">Raw Glass Size</td>
                  <td colspan="2">LOT.rawGlassSize</td>
                  <td>적층수</td>
                  <td>LOT.layers</td>
                  <td>Cell수량</td>
                  <td>LOT.cells</td>
                </tr>
                <tr>
                  <td colspan="2">Glass Type</td>
                  <td colspan="3">LOT.glassType </td>
                  <td colspan="2">LOT-NO</td>
                  <td colspan="4"> LOT.fullLotNumber</td>
                </tr>
                <tr>
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
                  <td>LOT.fabInDate</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>LOT.inputCount</td>
                  <td></td>
                  <td></td>
                  <td colspan="2"></td>
                </tr>
                <tr>
                  <th rowspan="2">자주검사<br />(적층)</th>
                  <td colspan="2">Crack</td>
                  <td colspan="2">기포</td>
                  <td>Scratch</td>
                  <td>이물</td>
                  <td>Others</td>
                  <td colspan="3">특이사항</td>
                </tr>
                <tr>
                  <td colspan="2"><br /></td>
                  <td colspan="2"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colspan="3"></td>
                </tr>
                <tr>
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
                <tr>
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
                <tr>
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
                <tr>
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
                  <td colspan="2">조사량(mj/cm²)</td>
                  <td>전면</td>
                  <td></td>
                  <td>시작<br />스테이지온도</td>
                  <td style="text-align: right">°C</td>
                  <td>후면</td>
                  <td></td>
                  <td>중심<br />스테이지 온도</td>
                  <td style="text-align: right">°C</td>
                </tr>
              </table>
        </div>
        <!-- 페이지 나누기 -->
        <div class="page-break"></div>
        <!-- 아래는 임시로 넣어둔건데 불량표시카드 들어갈 예정입니다 -->
        <div class="lot-card-container page-section" >
            <table class="lot-card-table">
            <colgroup>
            <col span="2" style="width:5.25% "/>
            <col style="width:12.5% "/>
            <col span="2" style="width:5.25% "/>
            <col style="width:12.5% "/>
            <col span="2" style="width:5.25% "/>
            <col style="width:12.5% "/>
            <col span="2" style="width:5.25% "/>
            <col style="width:12.5% "/>
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
</div>
</template>
<style scoped>
.lot-card-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px;
}

.lot-card-table {
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  width:100%;
  text-align: center;
  border: 2px solid black;
  margin-bottom: 20px;
}

.lot-card-table td,
.lot-card-table th {
  border: 1px solid black;
  padding: 10px;
  font-size: 12px;
}
.lot-card-table th{
     background-color: #f0f0f0;
}
.header {
  font-weight: bold;
  background-color: #f0f0f0;
  width: 20%;
  font-size: 12px;
}

.model-info {
  font-weight: bold;
  text-align: center;
  padding-left: 10px;
  font-size: 12px;
}

.size-info {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.5;
}

.lot-card-details {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.8;
  padding: 10px;
}

.lot-card-title {
  text-decoration: underline;
  margin-top: 10px;
  font-size: 16px;
}

.production-run {
  color: red;
  margin-top: 10px;
  font-weight: bold;
  font-size: 16px;
}

.page-break {
  page-break-after: always; /* 페이지 나누기 */
}

.page-section {
  padding: 10px; /* 섹션 내 여백 */
}
.lot_card{
    border:1px solid #000;
    border-radius: 5px;
    width:90px;
    height: 160px;
    margin: auto;
}
.brd_b_bold{  border-bottom: 2px solid #000;}
.brd_r_bold{  border-bottom: 2px solid #000;}
.title{height: 60px;}
</style>