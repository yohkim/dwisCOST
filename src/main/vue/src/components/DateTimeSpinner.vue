<template>
  <div class="form-floating">
    <VueDatePicker
      ref="dp"
      v-model="displayValue"
      :enable-time-picker="true"
      :format="'yyyy-MM-dd HH:mm:ss'"
      :teleport="centerFlag ? 'body' : false"
      :teleport-center="centerFlag"
      :position="'center'"
      :locale="koLocale"          
      :id="inputId"          
      @update:model-value="onPickerChange"
      select-text="선택"
      cancel-text="취소"     
      
      :action-row="{ showNow: true }"  
      now-button-label="Now"
    >
      <template #input-icon>
        <label class="custom-date-icon">{{ label }}</label>
      </template>
    </VueDatePicker>
  </div>
</template>

<script>
import moment from "moment";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ko } from 'date-fns/locale';


export default {
  name: "DateTimeSpinner",
  components: { VueDatePicker },
  props: {
    value: String, // '20250204 211211' 형식
    label: { type: String, default: "날짜시간" },
    inputId: { type: String, default: "datetime-input" },
    labelWidth: { type: [String, Number], default: 70 },
    centerFlag: { type: Boolean, default: false },
  },
  data() {
    return {
      displayValue: this.formatDisplay(this.value),
      caretIndex: 0,
      previousValue: ""
    };
  },
  watch: {
    value(newVal) {
        this.displayValue = this.formatDisplay(newVal);
    },
    displayValue(newVal) {
        this.$emit("input", this.formatCompact(newVal)); // emit: '20250204 211211'
    }
  },
  computed: {
    koLocale() {
      return ko;
    },
  },
  mounted() {
    this.$nextTick(() => {
      const wrapper = this.$el.querySelector('.dp__input');
      if (wrapper) {
        wrapper.style.paddingLeft = `${this.labelWidth}px`;
        wrapper.classList.add("form-control");

        wrapper.addEventListener('focus', () => {
          wrapper.style.border = '2px solid #2b94a5';
          wrapper.style.height = '40px';
        });
        wrapper.addEventListener('focusout', () => {
          wrapper.style.border = '2px solid #345881';
          wrapper.style.height = '40px';
        });
      }
    });
  },
  methods: {
    openPicker() {
      const dp = this.$refs.dp;
      if (!dp || !dp.openMenu) return;
      dp.openMenu();
    },
    clearClick(){
        this.displayValue = "";
        this.previousValue = "";
    },
    formatDisplay(raw) {
        if (!raw) return "";

        const cleaned = raw.replace(/\D/g, ""); // 숫자만
        if (cleaned.length !== 14) return ""; // 8자리 날짜 + 6자리 시간 = 14

        const y = cleaned.slice(0, 4).padStart(4, "0");
        const m = cleaned.slice(4, 6).padStart(2, "0");
        const d = cleaned.slice(6, 8).padStart(2, "0");
        const h = cleaned.slice(8, 10).padStart(2, "0");
        const mi = cleaned.slice(10, 12).padStart(2, "0");
        const s = cleaned.slice(12, 14).padStart(2, "0");

        const dt = `${y}-${m}-${d} ${h}:${mi}:${s}`;
        return moment(dt, "YYYY-MM-DD HH:mm:ss", true).isValid() ? dt : "";
    },
    formatCompact(formatted) {
        const dt = moment(formatted, "YYYY-MM-DD HH:mm:ss", true);
        if (!dt.isValid()) return "";

        const y = dt.year().toString();
        const m = String(dt.month() + 1).padStart(2, '0');
        const d = String(dt.date()).padStart(2, '0');
        const h = String(dt.hour()).padStart(2, '0');
        const mi = String(dt.minute()).padStart(2, '0');
        const s = String(dt.second()).padStart(2, '0');

        return `${y}${m}${d} ${h}${mi}${s}`;
    },
    setNow() {
      const now = moment().format("YYYY-MM-DD HH:mm:ss");
      this.displayValue = now;
      this.previousValue = now;
    },
    updateCaret() {
      this.$nextTick(() => {
        this.caretIndex = this.$refs.datetimeInput.selectionStart;
      });
    },
    handleKeydown(event) {
      const allowed = ["ArrowUp", "ArrowDown", "Tab"];
      if (allowed.includes(event.key)) {
        event.preventDefault();
        const dir = event.key === "ArrowUp" ? 1 : -1;
        this.adjustTime(dir);
        this.updateCaret();
      } else {
        event.preventDefault();
      }
    },
    checkValidity() {
        const valid = moment(this.displayValue, "YYYY-MM-DD HH:mm:ss", true).isValid();
        if (valid) {
            this.previousValue = this.displayValue;
        } else {
            this.displayValue = this.previousValue;
        }
    },
    adjustTime(direction) {
      const dt = moment(this.displayValue, "YYYY-MM-DD HH:mm:ss", true);
      if (!dt.isValid()) return;
      const i = this.caretIndex;

      if (i <= 4) dt.add(direction, "year");
      else if (i >= 5 && i <= 7) dt.add(direction, "month");
      else if (i >= 8 && i <= 10) dt.add(direction, "day");
      else if (i >= 11 && i <= 13) dt.add(direction, "hour");
      else if (i >= 14 && i <= 16) dt.add(direction, "minute");
      else dt.add(direction, "second");

      this.displayValue = dt.format("YYYY-MM-DD HH:mm:ss");

      this.$nextTick(() => {
        this.$refs.datetimeInput.setSelectionRange(i, i);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
:deep.search_box {
  border:0!important;
  padding: 0!important;
  background: none;
  background: #fff!important;
}

</style>


<style lang="scss">

/* 전체 팝업 크기 */
.dp__menu {
  font-size: 1.2rem !important;               
  transform: scale(1.3) !important;          
  transform-origin: top left !important;
  z-index: 9999;
}

/* 날짜 셀 크기 */
.dp__calendar_cell {
  padding: 1.2rem !important;                 
  font-size: 1.4rem !important;               
}

/* 월/년도 */
.dp__month_year_row {
  font-size: 1.5rem !important;               
}

/* 시간 선택 */
.dp__time_col {
  font-size: 1.4rem !important;               
}

/* 버튼 */
.dp__action_buttons .dp__button {
  font-size: 1.4rem !important;               
  padding: 0.5rem 1.1rem !important;          
}

/* 시계 아이콘 */
.dp__time_icon {
  width: 1.6rem !important;                   
  height: 1.6rem !important;
}

/* 연도/월 선택 셀 크기 */
.dp__overlay_cell {
  font-size: 1.2rem !important;               
  padding: 0.4rem !important;
  height: 3rem !important;                    
  width: 4.5rem !important;                   
}

.dp__overlay_container,
.dp__overlay_container.dp__container_flex,
.dp__overlay_container.dp__time_picker_overlay_container {
  height: 100% !important;
  max-height: 100% !important;
  box-sizing: border-box;
  overflow-y: auto !important;
}

.dp__overlay_container.dp__container_block {
  height: 85% !important;
  max-height: 85% !important;
  box-sizing: border-box;
  overflow-y: auto !important;
}

.dp__overlay {
  height: 100% !important;
  max-height: 100% !important;
  overflow-y: auto !important;
}

.dp__time_display {
  font-size: 3rem !important;
}
.dp__time_display .dp__arrow {
  font-size: 2.5rem !important;
  width: 2.5rem !important;
  height: 2.5rem !important;
  line-height: 2.5rem !important;
}
.dp__time_col {
  padding: 0 1.2rem !important;
}

</style>
