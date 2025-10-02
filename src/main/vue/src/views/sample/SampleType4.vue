<template>
	<div>
        <b-tabs b-model="tab" class="three_depth_tab">
            <b-tab title="생산실적입력"></b-tab>
            <b-tab title="작업이력조회"></b-tab>
            <b-tab title="설비로그조회"></b-tab>
        </b-tabs>
        <div class="search_box" >
            <b-row class="row search_area">
                 <b-col cols="2">
                    <div class="form-floating prc_name">
                        <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" >
                            <option value="1">옵션 1</option>
                            <option value="2">옵션 2</option>
                            <option value="3">옵션 3</option>
                        </select>
                        <label for="floatingSelect" class="select">공정명</label>
                    </div>
                </b-col>
                 <b-col cols="2">
                    <div class="form-floating">
                        <input type="text" class="form-control label-60" id="floating" placeholder="LotNo">
                        <label for="floating">LotNo</label>
                    </div>              
                </b-col>
                <b-col cols="3">                           
                    <div class="form-floating">
                        <input type="text" class="form-control label-80" id="floating" placeholder="LotNo">
                        <label for="floating">P-CODE</label>
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
        <div class="worker_wrap">
            <div class="title mr-4">작업자 정보</div>
            <div class="row worker_info">
                 <div class="col-2">
                    <div class="form-floating">
                        <input type="text" class="form-control label-60" id="floating" placeholder="LotNo">
                        <label for="floating">작업자</label>
                    </div>              
                </div>
                 <div class="col-2">
                    <div class="form-floating">
                        <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" >
                            <option value="1">옵션 1</option>
                            <option value="2">옵션 2</option>
                            <option value="3">옵션 3</option>
                        </select>
                        <label for="floatingSelect" class="select">Shift</label>
                    </div>
                </div>
                 <div class="col-2">
                    <div class="form-floating prc_name">
                        <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" >
                            <option value="1">옵션 1</option>
                            <option value="2">옵션 2</option>
                            <option value="3">옵션 3</option>
                        </select>
                        <label for="floatingSelect" class="select">작업조</label>
                    </div>
                </div>
                 <div class="col-2">
                    <div class="form-floating prc_name">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" >
                            <option value="1">옵션 1</option>
                            <option value="2">옵션 2</option>
                            <option value="3">옵션 3</option>
                        </select>
                        <label for="floatingSelect" class="select">M/C No</label>
                    </div>
                </div>
                 <div class="col-2">
                    <div class="form-floating ">
                        <input type="text" class="form-control label-60" id="floating"  disabled placeholder="LotNo">
                        <label for="floating">M/C Line(축)</label>
                    </div>              
                </div>
                 <div class="col-2">
                    <div class="form-floating ">
                        <input type="text" class="form-control label-60" id="floating"  placeholder="LotNo">
                        <label for="floating">수량</label>
                    </div>              
                </div>
            </div>
        </div>
        <div class="accordion mt-2" id="accordionExample">
            <!-- 첫 번째 패널 -->
            <div class="accordion-item mt-2">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                작업현황
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
                    <div class="accordion-body">
                        <div class="btn_wrap">
                            <b-button  class="sub">특이사항</b-button>
                                <b-button-group class="toggle_btn">
                                    <b-button class="on">작업시작</b-button><!--add class="on-->
                                    <b-button class="">작업종료</b-button>
                            </b-button-group>
                        </div>
                        <table class="mt-2 mb-2">
                            <colgroup>
                            <col span="9" style="width:calc(85% /9)"/>
                            <col style="width:15%"/>
                            </colgroup>
                        <thead>
                            <tr>
                                <th rowspan="2">작업자</th>
                                <th rowspan="2">Shift</th>
                                <th rowspan="2">작업조</th>
                                <th colspan="2">M/C</th>
                                <th colspan="2">작업시작</th>
                                <th colspan="2">작업종료</th>
                                <th rowspan="2">Lot-CARD 특이사항 및 작업시 주의사항</th>
                            </tr>
                            <tr>
                                <th>No</th>
                                <th>Line(축)</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Date</th>
                                <th class="brd_r">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>이재현</td>
                                <td>A조</td>
                                <td>야간</td>
                                <td>CN#4 L</td>
                                <td>L</td>
                                <td>2021-03-30</td>
                                <td>22:37:56</td>
                                <td>2021-03-30</td>
                                <td>22:37:56</td>
                                <td></td>
                            </tr>
                        </tbody>
                        </table> 
                        <div class="row">
                            <div class="col">
                                <div class="etc">
                                    <div class="title">특이사항</div>
                                    <b-form-textarea rows="2" no-resize />
                                </div>
                                <div class="etc mt-1">
                                    <div class="title">TANK_NO</div>
                                    <b-form-input size="sm"/>
                                </div> 
                                <div class="etc mt-1">
                                    <div class="title">PANEL_ID</div>
                                    <b-form-input size="sm"/>
                                </div>                    
                            </div>
                            <div class="col">
                                <div class="table-responsive" style="height: 200px; overflow-y: auto;">
                                    <table>
                                        <colgroup>
                                            <col span="2" style="width:50% "/>
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>불량명</th>
                                                <th>수량</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>CR</td>
                                                <td> <b-form-input size="sm"/></td>
                                            </tr>
                                            <tr>
                                                <td>깨짐(원불)</td>
                                                <td> <b-form-input size="sm"/></td>
                                            </tr>
                                            <tr>
                                                <td>깨짐(직불)</td>
                                                <td> <b-form-input size="sm"/></td>
                                            </tr>
                                            <tr>
                                                <td>기포</td>
                                                <td><b-form-input size="sm"/></td>                                    
                                            </tr>
                                            <tr>
                                                <td>SC</td>
                                                <td> <b-form-input size="sm"/></td>                                    
                                            </tr>
                                            <tr>
                                                <td>기타</td>
                                                <td> <b-form-input size="sm"/></td>                                    
                                            </tr>
                                            <tr>
                                                <td>이물</td>
                                                <td> <b-form-input size="sm"/></td>                                    
                                            </tr>
                                            <tr>
                                                <td>IT깨짐</td>
                                                <td> <b-form-input size="sm"/></td>                                    
                                            </tr>
                                            <tr>
                                                <td>IT코팅이상</td>
                                                <td> <b-form-input size="sm"/></td>                                    
                                            </tr>
                                            <tr>
                                                <td>IT이물</td>
                                                <td> <b-form-input size="sm"/></td>                                    
                                            </tr>
                                            <tr>
                                                <td>회수</td>
                                                <td> <b-form-input size="sm"/></td>                                    
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 두 번째 패널 -->
            <div class="accordion-item mt-2">
            <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                제품현황
                </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse show" aria-labelledby="headingTwo">
                <div class="accordion-body">
                    <table >
                        <thead>
                            <tr>
                                <th colspan="6">제품현황</th>
                                <th colspan="4">In</th>
                                <th colspan="4">Out</th>
                                <th rowspan="3">Fab</th>
                                <th colspan="4">Schedule</th>
                            </tr>
                            <tr>
                                <th rowspan="2">고객사</th>
                                <th rowspan="2">Model</th>
                                <th rowspan="2">Inch</th>
                                <th rowspan="2">Ver</th>
                                <th rowspan="2">Glass</th>
                                <th rowspan="2">Cell Size</th>
                                <th rowspan="2">Date</th>
                                <th colspan="3">Q'ty</th>
                                <th rowspan="2">Date</th>
                                <th colspan="3">Q'ty</th>
                                <th rowspan="2" colspan="2">발행</th>
                                <th rowspan="2" colspan="2">승인</th>
                            </tr>
                            <tr>
                                <th>Cell</th>
                                <th>Block</th>
                                <th>Sheet</th>
                                <th>Cell</th>
                                <th>Block</th>
                                <th class="brd_r">Sheet</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>삼성디스플레이</td>
                                <td>8020</td>
                                <td>8.03</td>
                                <td>Rev#1</td>
                                <td>RAW GLASS</td>
                                <td>155.0±0.1 x 137.77</td>
                                <td>2021-03-30</td>
                                <td>60</td>
                                <td>6</td>
                                <td>10</td>
                                <td>2021-04-02</td>
                                <td>60</td>
                                <td>6</td>
                                <td>10</td>
                                <td>100.00</td>  
                                <td>2021-03-30</td>   
                                <td>한초희</td>   
                                <td>2021-03-30</td>   
                                <td>김현미</td>                       
                            </tr>
                        </tbody>
                    </table>         
                </div>
            </div>
            </div>
        </div>
        <div class="prc_summary mt-4">
            <div class="legend">
                <div class="finish">완료공정</div>
                <div class="ongoing">현공정</div>
                <div class="next">인계공정</div>
            </div>
            <div class="row">
                <div class="col finish">
                    <b-card>
                        <b-card-title>적층
                            <span>
                                수율 : 100%
                            </span>
                        </b-card-title>
                        <b-card-text>
                            <div>투입수량 : <span>20</span></div>
                            <div>양품수량 : <span>18</span></div>
                            <div>불량수량 : <span>2</span></div>
                        </b-card-text>
                    </b-card>
                </div>
                <div class="col ongoing">
                    <b-card>
                        <b-card-title>형상가공
                            <span>
                                수율 : 100%
                            </span>
                        </b-card-title>
                        <b-card-text>
                            <div>투입수량 : <span>20</span></div>
                            <div>양품수량 : <span>18</span></div>
                            <div>불량수량 : <span>2</span></div>
                        </b-card-text>
                    </b-card>
                </div>
                <div class="col next">
                    <b-card>
                        <b-card-title>치수측정
                            <span>
                                수율 : 100%
                            </span>
                        </b-card-title>
                        <b-card-text>
                            <div>투입수량 : <span>20</span></div>
                            <div>양품수량 : <span>18</span></div>
                            <div>불량수량 : <span>2</span></div>
                        </b-card-text>
                    </b-card>
                </div>
                <div class="col next">
                    <b-card>
                        <b-card-title>WP
                            <span>
                                수율 : 100%
                            </span>
                        </b-card-title>
                        <b-card-text>
                            <div>투입수량 : <span>20</span></div>
                            <div>양품수량 : <span>18</span></div>
                            <div>불량수량 : <span>2</span></div>
                        </b-card-text>
                    </b-card>
                </div>
                <div class="col next">
                    <b-card>
                        <b-card-title>DUV
                            <span>
                                수율 : 100%
                            </span>
                        </b-card-title>
                        <b-card-text>
                            <div>투입수량 : <span>20</span></div>
                            <div>양품수량 : <span>18</span></div>
                            <div>불량수량 : <span>2</span></div>
                        </b-card-text>
                    </b-card>
                </div>
            </div>
        </div>	

 </div>
</template>

<script>

export default {
	name: "SampleType4",
     data() {
    return {
      activePanel: [0], // 기본 열릴 패널의 인덱스 설정
    };
  },
}
</script>
