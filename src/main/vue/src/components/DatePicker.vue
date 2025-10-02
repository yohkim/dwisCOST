<template>
    <input
      type="text"
      ref="datepicker"
      autocomplete="off"
      :placeholder="placeholder"
      class="form-datepicker"
      id="floatingPicker"
    />
</template>

<script>
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';

export default {
  name: 'Datepicker',
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: '선택하세요',
    },
    mode: {
      type: String,
      default: 'day', // 'day', 'month', 'week'
    },
    format: {
      type: String,
      default: 'Y-m-d', // 기본 날짜 형식
    },
  },
  data() {
    return {
      datepicker:null
    };
  },
   mounted() {
    this.initializeDatepicker();
    /*// Flatpickr 초기화
    this.datepicker = flatpickr(this.$refs.datepicker, {
      dateFormat: this.format,
      defaultDate: this.modelValue, // 초기값 설정
      onChange: (selectedDates, dateStr) => {
        // 날짜 선택 시 modelValue 업데이트
        this.$emit('update:modelValue', dateStr);
      },
    });*/
  },
  watch: {
    // modelValue가 외부에서 변경되었을 때 datepicker 업데이트
    modelValue(newVal) {
      if (newVal !== this.datepicker.input.value) {
        this.datepicker.setDate(newVal, false);
      }
    },
  },
  beforeUnmount() {
    // Flatpickr 인스턴스 정리
    if (this.datepicker) {
      this.datepicker.destroy();
    }
  },
  methods: {

    initializeDatepicker() {
      const options = {
        dateFormat: this.getDateFormat(),
        defaultDate: this.modelValue,
        plugins: this.getPlugins(),
        locale: this.getLocale(),
        onChange: (selectedDates, dateStr, instance) => {
          this.$emit('update:modelValue', dateStr);
          this.adjustDayContainerHeight(instance);
        },
        onMonthChange: (selectedDates, dateStr, instance) => {
          this.handleMonthChange(instance);
        },
        onReady: (selectedDates, dateStr, instance) => {
          if (this.mode === 'year') {
            this.setupYearSelection(instance);
          }
          this.adjustDayContainerHeight(instance);
        },
        onOpen: (selectedDates, dateStr, instance) => {          
          const inputValue = this.modelValue || new Date();
          const currentDate = new Date(inputValue);

          // 팝업이 열릴 때 연/월/일 초기화
          instance.currentYear = currentDate.getFullYear();
          instance.currentMonth = currentDate.getMonth();
          instance.jumpToDate(currentDate, true); // 강제로 지정된 날짜로 이동

          // 모드에 따라 초기화
          if (this.mode === 'year') {
            this.setupYearSelection(instance);
          } else if (this.mode === 'month') {
            this.setupMonthSelection(instance);
            this.adjustDayContainerHeight(instance);
          } else if (this.mode === 'day') {
            this.setupDaySelection(instance);
          }
        },
      };

      this.datepicker = flatpickr(this.$refs.datepicker, options);
    },

    handleMonthChange(instance) {
      this.$nextTick(() => {
        this.adjustDayContainerHeight(instance);
      });
    },

    adjustDayContainerHeight(instance) {
      this.$nextTick(() => {
        const dayContainer = instance.calendarContainer.querySelector('.dayContainer');
        if (dayContainer) {
          const totalWeeks = this.getWeeksInMonth(instance.currentYear, instance.currentMonth);
          if (totalWeeks === 6) {
            dayContainer.style.height = '204px'; // 6주인 경우
          } else {
            dayContainer.style.height = '170px'; // 5주 이하
          }
        }
      });
    },

    getWeeksInMonth(year, month) {
      const firstDayOfMonth = new Date(year, month, 1); // 해당 월의 1일
      const lastDayOfMonth = new Date(year, month + 1, 0); // 해당 월의 마지막 날짜

      const firstDayWeekday = firstDayOfMonth.getDay(); // 0(일) ~ 6(토)
      const totalDays = lastDayOfMonth.getDate();

      // 첫째 주를 포함한 전체 주 개수 계산
      const totalWeeks = Math.ceil((firstDayWeekday + totalDays) / 7);

      return totalWeeks;
    },

    setupYearSelection(instance) {
      instance.calendarContainer.innerHTML = ''; // 기존 UI 제거

      const yearContainer = document.createElement('div');
      yearContainer.className = 'flatpickr-year-selector';

      const inputValue = instance.input.value || this.modelValue;
      const currentYear = inputValue
        ? parseInt(inputValue.split('-')[0], 10)
        : new Date().getFullYear();

      const startYear = currentYear - 50; // 시작 연도
      const endYear = currentYear + 50; // 종료 연도

      for (let year = startYear; year <= endYear; year++) {
        const yearElem = document.createElement('div');
        yearElem.textContent = `${year}년`;
        yearElem.className = 'flatpickr-year-option';

        if (year === currentYear) {
          yearElem.classList.add('selected-year'); // 선택된 연도 강조
        }

        yearElem.addEventListener('click', () => {
          // 기존 선택된 연도에서 `selected-year` 클래스 제거
          const previouslySelected = yearContainer.querySelector('.selected-year');
          if (previouslySelected) {
            previouslySelected.classList.remove('selected-year');
          }

          // 현재 선택된 연도에 `selected-year` 클래스 추가
          yearElem.classList.add('selected-year');

          instance.setDate(new Date(year, 0, 1));
          this.$emit('update:modelValue', year.toString());
          instance.input.value = year.toString();
          instance.close();
        });

        yearContainer.appendChild(yearElem);
      }

      instance.calendarContainer.appendChild(yearContainer);

      const selectedElem = yearContainer.querySelector('.selected-year');
      if (selectedElem) {
        yearContainer.scrollTop = selectedElem.offsetTop - 100; // 선택된 연도로 스크롤
      }
    },

    setupMonthSelection(instance) {
      const inputValue = instance.input.value || this.modelValue;
      const currentDate = inputValue ? new Date(inputValue) : new Date();

      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // 월은 0부터 시작

      // 연도를 업데이트
      if (instance.currentYearElement) {
        instance.currentYearElement.value = currentYear;
      }

      const monthElements = instance.calendarContainer.querySelectorAll('.flatpickr-monthSelect-month');
      monthElements.forEach((monthElem, index) => {
        monthElem.classList.remove('selected'); // 이전 선택된 상태 제거
        if (index === currentMonth) {
          monthElem.classList.add('selected'); // 현재 선택된 월 강조
        }
      });
    },

    setupDaySelection(instance) {
      const inputValue = instance.input.value || this.modelValue;
      const currentDate = inputValue ? new Date(inputValue) : new Date();

      const dayElements = instance.calendarContainer.querySelectorAll('.flatpickr-day');
      dayElements.forEach((dayElem) => {
        const dayDate = new Date(dayElem.dateObj);

        // 모든 날짜에서 기존 선택된 클래스 제거
        dayElem.classList.remove('selected-day');

        // 입력된 값과 일치하는 날짜에만 클래스 추가
        if (
          currentDate.getFullYear() === dayDate.getFullYear() &&
          currentDate.getMonth() === dayDate.getMonth() &&
          currentDate.getDate() === dayDate.getDate()
        ) {
          dayElem.classList.add('selected-day'); // 선택된 날짜 강조
        }
      });
    },

    getLocale() {
      if (this.mode === 'month') {
        return {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ['일', '월', '화', '수', '목', '금', '토'],
            longhand: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
          },
          months: {
            shorthand: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            longhand: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
          },
        };
      }
      return null; // 기본 locale 사용
    },

    getDateFormat() {
      if (this.mode === 'month') {
        return 'Y-m';
      } else if (this.mode === 'year') {
        return 'Y';
      }
      return this.format; // 기본 포맷
    },

    getPlugins() {
      if (this.mode === 'month') {
        return [
          monthSelectPlugin({
            shorthand: true, // 월 이름 대신 숫자 사용
            dateFormat: 'Y-m',
            altFormat: 'Y년 m월'            
          }),
        ];
      }
      return []; // 기본 모드 (day)
    },
  }
};
</script>

<style lang="scss">
/* Flatpickr 스타일 조정 가능 */
.flatpickr-input[readonly] {
    padding-left:50px !important;
    max-width: 160px;
    width: 140px;
}
.flatpickr-calendar{
  width: 257.975px;
  .flatpickr-months{
      padding: 10px;
      background: #2b94a5;
      border-radius: 3px 3px 0 0;
    .flatpickr-prev-month, .flatpickr-next-month{
      height: 24px;
      padding: 10px;
      svg path{
        fill: #fff;
      }
    }
    .flatpickr-month{
      height: 24px;
      .flatpickr-current-month{
      height: 24px;
      padding: 0;
      color: #fff;
        .flatpickr-monthDropdown-months{
          font-size: 14px;
          option{
            color: #000;
          }
        }
        .numInputWrapper{
            .cur-year{
            font-size: 14px;
                }
            .arrowUp:after{
                  border-bottom-color: rgb(255 255 255 / 90%);
                  }
            .arrowDown:after {
                  border-top-color: rgba(255, 255, 255, 0.9);
                  }
              }
      }
    }
    
  }
  .flatpickr-innerContainer{
        padding:0  10px 10px;
        .flatpickr-weekdays{
              width: 238px;
        }
        .flatpickr-days{
              width: 238px;
              .dayContainer{
                  width: 238px;
                    min-width: 238px;
                    max-width: 238px ;
                    height: 170px;
                    max-height: 204px;
                    .flatpickr-day{
                      max-width: 34px;
                      height: 34px;
                      line-height: 34px;
                      &.selected{
                      background: #2b94a5;
                      border-color: #2b94a5;
                      }
                    }

              }
        }
        .flatpickr-rContainer{
          margin-top: 10px;
          .flatpickr-monthSelect-month{
                height: 58px;
                width: 58px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                border-left: 1px solid #cdd7e4;
                border-bottom: 1px solid  #cdd7e4;
                &:nth-child(4n){
                border-right: 1px solid #cdd7e4;
                }
                &:nth-child(-n+4){
                border-top: 1px solid  #cdd7e4;
                }
                &:hover{
                  border:1px solid #2b94a5;
                }
                &.today{
                   border:1px solid #959ea9;
                }
                &.selected{
                  background: #2b94a5;
                  border-color: #2b94a5;
                  color: #fff;
                  }
          }
        }

  }
  .flatpickr-year-selector{
    width:100%;
    height: 234px;
    overflow: auto;
     border-top:10px solid #2b94a5;
     border-radius: 3px;
     margin-bottom: 5px;
      .flatpickr-year-option{
        display: inline-flex;
        align-items: center;
        width: 110px;
        height: 30px;
        justify-content: space-evenly;
        margin: 5px 0;
        border: 1px solid #cdd7e4;
        border-right: 0;
        &:nth-child(2n){
           border-right: 1px solid #cdd7e4;
        }
                &:hover{
                  border:1px solid #2b94a5;
                }
                &.this-year{
                   border:1px solid #959ea9;
                }
                &.selected-year{
                  background: #2b94a5;
                  border-color: #2b94a5;
                  color: #fff;
                  }
      }
    }
  &.arrowTop{
    &::after{
    border-bottom-color: #2b94a5;
    }
  }

}

</style>