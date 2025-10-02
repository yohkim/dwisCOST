<template>
    <div>
        <b-tabs b-model="tab" class="three_depth_tab">
            <b-tab title="공정 전 원자재 현황">
                <div>
                    <div class="search_box">
                        <b-row class="search_area">
                            <b-col cols="3" class="period">
                                <div class="label_title">입고 일자</div>
                                <div class=" form-floating me-1"> 
                                <date-picker label="시작일"  v-model="startDate" />
                                <label for="floatingPicker">시작일</label>
                                </div>
                                ~
                                <div class=" form-floating  ms-1 "> 
                                <date-picker label="종료일"  v-model="endDate" />
                                    <label for="floatingPicker">종료일</label>
                                </div>
                            </b-col>
                            <b-col cols="2">
                                <div class="form-floating">
                                    <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" >
                                        <option value="1">옵션 1</option>
                                        <option value="2">옵션 2</option>
                                        <option value="3">옵션 3</option>
                                    </select>
                                    <label for="floatingSelect" class="select">투입구분</label>
                                </div>
                            </b-col>
                            <b-col cols="2">
                                <div class="form-floating">
                                    <input type="text" class="form-control label-60" id="floating" placeholder="담당자">
                                    <label for="floating">담당자</label>
                                </div>              
                            </b-col>
                        </b-row>
                        <div class="btn_area">
                            <b-button @click="searchClick">
                            <span class="ico_search"></span>
                            조회
                            </b-button>
                        </div>
                    </div>
                     <div class="worker_wrap">
                        <div class="title">입고 작업</div>
                        <div class="in_time"><span>입고시간</span> <span>2024-12 20:13:10</span></div>
                        <div class="row worker_info">
                            <b-col cols="2">
                                <div class="form-floating">
                                    <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" >
                                        <option value="1">옵션 1</option>
                                        <option value="2">옵션 2</option>
                                        <option value="3">옵션 3</option>
                                    </select>
                                    <label for="floatingSelect" class="select">투입구분</label>
                                </div>
                            </b-col>
                            <b-col cols="2">
                                <div class="form-floating">
                                    <input type="text" class="form-control label-60" id="floating" placeholder="담당자">
                                    <label for="floating">담당자</label>
                                </div>              
                            </b-col>
                            <b-col cols="3">
                                <div class="form-floating">
                                    <input type="text" class="form-control label-60" id="floating" placeholder="담당자">
                                    <label for="floating">바코드</label>
                                </div>              
                            </b-col>
                        </div>
                    </div>
                    <div class="grid_box material_box">
                        <div class="left_box">
                            <div class="btn_wrap ms-auto">
                                <b-button >삭제</b-button>
                                <b-button class="main">입고처리</b-button>
                                </div>            
                            </div> 
                        <div class="grid-border-none">grid</div>
                    </div>
                </div>
            </b-tab>
            <b-tab title="공정 전 원자재 입고"></b-tab>
            <b-tab title="공정 전 원자재 출고"></b-tab>
           
        </b-tabs>
    </div>
</template>
<script>
export default {

}
</script>
