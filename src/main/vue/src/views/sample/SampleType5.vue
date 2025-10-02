<template>
	<div>
        <b-tabs b-model="tab" class="three_depth_tab">
            <b-tab title="LOT CARD 발행"></b-tab>
            <b-tab title="RUN CARD #1 발행"></b-tab>
            <b-tab title="RUN CARD #2 발행"></b-tab>
        </b-tabs>
        <div class="search_box" >
            <b-row class="search_area">
                 <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" >
                            <option value="1">옵션 1</option>
                            <option value="2">옵션 2</option>
                            <option value="3">옵션 3</option>
                        </select>
                        <label for="floatingSelect" class="select">제품유형</label>
                    </div>
                </b-col>
                 <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" >
                            <option value="1">옵션 1</option>
                            <option value="2">옵션 2</option>
                            <option value="3">옵션 3</option>
                        </select>
                        <label for="floatingSelect" class="select">작업구분</label>
                    </div>
                </b-col>                
                 <b-col cols="2">
                    <div class="form-floating">
                        <input type="text" class="form-control label-60" id="floating" placeholder="LotNo">
                        <label for="floating">LotNo</label>
                    </div>              
                </b-col>
                <!-- <b-col cols="2">                           
                     <label for="datepicker">날짜 선택:</label>
                     <b-form-datepicker/>
               </b-col> -->
               <b-col cols="1">  
                 <div class="form-floating ">
                     <label for="datepicker" >날짜</label>
                     <date-picker placeholder="선택하세요" v-model="params.date1"/>
                 </div>
               </b-col>
               <b-col cols="1"> 
                   <div class="form-floating">                          
                     <label for="datepicker"  >월</label>
                     <date-picker mode="month" placeholder="선택하세요" v-model="params.date2"/>
                   </div>
               </b-col>
               <b-col cols="1">   
                 <div class="form-floating year">
                     <label for="datepicker" >년도</label>
                     <date-picker mode="year" placeholder="선택하세요" v-model="params.date3"/>
                </div>                        
               </b-col>
            </b-row>
            <div class="btn_area">
                <b-button>
                     <span class="ico_search"></span>
                    조회
                </b-button>         
            </div>                 
        </div>
        <div class="grid_box search_onerow">
			<div class="left_box">
                <div class="btn_wrap ms-auto">
                        <b-button class="second">미리보기</b-button>
						<b-button class="second">인쇄</b-button>
						<b-button class="sub"> 추가</b-button>
						<b-button >삭제</b-button>

                </div>            
            </div>
            <div class="add_lot" style="display:"> <!--추가시 display:block-->
                <div class="left_box">
                    <div class="title">Lot 추가</div>
                    <div class="btn_wrap ms-auto">  
                        <b-button class="sub">생성</b-button>                       
                        <b-button class="main"> 저장</b-button>                       
                    </div> 
                </div>           
                <div class="title">Lot구성&amp;정보</div>
                <table>
                    <thead>
                        <tr>
                            <th colspan="4">PO현황</th>
                            <th rowspan="2">당일 <br/>투입량</th>
                            <th colspan="3">Lot Size</th>
                            <th colspan="3">Lot 생성</th>
                        </tr>
                        <tr>
                            <th>PO_NO</th>
                            <th>PO_DATE</th>
                            <th>총수량</th>
                            <th>잔량</th>
                            <th>Cell</th>
                            <th>Block</th>
                            <th>Sheet(층)</th>
                            <th>시작</th>
                            <th>생성수</th>
                            <th>잔여량</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                           <td><b-form-input size="sm"/></td>
                           <td><b-form-input size="sm"/></td>
                           <td><b-form-input size="sm"/></td>
                           <td><b-form-input size="sm"/></td>
                           <td><b-form-input size="sm"/></td>
                           <td><b-form-input size="sm"/></td>
                           <td><b-form-input size="sm"/></td>
                           <td><b-form-input size="sm"/></td>
                           <td><b-form-input size="sm"/></td>
                           <td><b-form-input size="sm"/></td>
                           <td><b-form-input size="sm"/></td>
                        </tr>
                    </tbody>
                </table> 
                <div class="title">제품,원자재 및 기타정보</div>
                <table>
                    <thead>
                        <tr>
                            <th colspan="5">제품현황</th>
                            <th colspan="7">원자재정보</th>
                            <th colspan="8">Fab #1 Schedule</th>
                            <th>특이사항</th>                       
                        </tr>
                        <tr>
                            <th rowspan="2">고객사</th>
                            <th rowspan="2">모델</th>
                            <th rowspan="2">Inch</th>
                            <th rowspan="2">버전</th>
                            <th rowspan="2">규격</th>
                            <th rowspan="2">품명</th>
                            <th rowspan="2">재질</th>
                            <th rowspan="2">두께</th>
                            <th rowspan="2">규격</th>
                            <th rowspan="2">공급사</th>  
                            <th colspan="2">TYPE</th>    
                            <th colspan="2">In</th> 
                            <th colspan="2">OUT</th> 
                            <th colspan="2">발행</th> 
                            <th colspan="2" class="brd_r">승인</th> 
                        </tr>
                        <tr>
                            <th>Raw</th>
                            <th>Etch</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>담당자</th>
                            <th>서명</th>
                            <th>담당자</th>
                            <th class="brd_r">서명</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>삼성디스플레이</td>
                            <td>8901</td>
                            <td>8.12</td>
                            <td>Raw#O</td>
                            <td>154.83 x 140.35 MM</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="no-label"><b-form-checkbox /></td>
                            <td>2024-11-21</td>
                            <td>18:10:31</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- <RealGrid class="grid-border-none"   ref="grid" :uid="'grid'" :step="3" :rows="rows"/> -->
        </div>
    </div>
</template>
<script>

export default {
    components: { },
    name: "SampleType5",
    watch: {
        // modelValue가 외부에서 변경되었을 때 datepicker 업데이트
        "params.date1"(newVal) {
            console.log("date1", newVal);
        },
        "params.date2"(newVal) {
            console.log("date2", newVal);
        },
        "params.date3"(newVal) {
            console.log("date3", newVal);
        },
    },
    data() {
        return {
            params: {
                date1:"2026-01-02",
                date2:"2027-02",
                date3:"2027",
            }
        };
    },
}
</script>
<style lang="scss" scoped>
::v-deep table{
  border:1px solid #cacaca;
  th,td{
    padding: 2px 4px!important;
    border-right: 1px solid #dcdcdc;
    text-align: center!important;
    &:last-child{
      border-right: 0;
    }
    &.brd_r{
      border-right: 1px solid #dcdcdc!important;
    }
    &.head{
     background: #f0f8ff;
    }
    }
  thead{
    background: #f0f8ff;
    th{
      border-bottom: 1px solid #dcdcdc;
    }
  }
  td{
    border-bottom: 1px solid #dcdcdc;
  }
}
::v-deep .table-responsive{
  margin-bottom: 0;
  table{
    thead th {
      position: sticky;
      top: -1px;
      z-index: 1; /* 헤더가 다른 요소 위에 표시되도록 설정 */
      background-color: #f0f8ff; /* 헤더의 배경색 (부트스트랩 기본 배경색과 동일) */
    }
    .form-control-sm{
      min-height: 24px;
      height: 24px;
    }
  }
}
::v-deep .three_depth_tab{
    height: unset;
}
</style>