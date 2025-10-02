<template>
<div>
  <b-tabs b-model="tab" class="three_depth_tab">
      <b-tab title="라인 /AREA 마스터">
        <div class="search_box" >
    <b-row class="search_area">
      <b-col cols="2">
        <div class="form-floating">
            <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" >
                <option value="1">옵션 1</option>
                <option value="2">옵션 2</option>
                <option value="3">옵션 3</option>
            </select>
            <label for="floatingSelect" class="select">라인</label>
        </div>
    </b-col>   
    <b-col cols="2">
        <div class="form-floating">
            <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" >
                <option value="1">옵션 1</option>
                <option value="2">옵션 2</option>
                <option value="3">옵션 3</option>
            </select>
            <label for="floatingSelect" class="select">공정구분</label>
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
          <b-button class="second">엑셀</b-button>
          <b-button class="sub"> 추가</b-button>
          <b-button >삭제</b-button>
          <b-button class="main"> 저장</b-button>                       
        </div>            
    </div>
    <div class="grid-border-none">grid</div>
  </div>
      </b-tab>
      <b-tab title="설비마스터"></b-tab>
  </b-tabs>
</div>
</template>
    
<script>

export default {
    name: "SampleType3",
    data () {
		return {

		}
	},
}
</script>

<style>
.dw-input .v-field__input {
  height:30px !important;
  line-height: 30px!important;
}
</style>
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