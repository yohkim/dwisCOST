<template>
  <select ref="selectElement" autocomplete="off">
    <option
      v-for="item in itemList"
      :key="item.text"
      :value="item.value"
    >
      {{ item.text }}
    </option>
  </select>
</template>

<script>
import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.css';

export default {
  name: 'SearchSelect',
  props: {
    modelValue: {
      type: Object,
      default: ''
    },
    itemList: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '선택하세요'
    }
  },
  data() {
    return {
      selectedValue: this.modelValue.value, // 내부 상태
      tsInstance: null,
    };
  },
  mounted() {
    this.tsInstance = new TomSelect(this.$refs.selectElement, {
      searchEnabled: true,
      create: false,
      sortField: 'text',
      placeholder: this.placeholder,
      onChange: (value) => {
        // Tom Select의 onChange 이벤트로 내부 상태와 부모 컴포넌트에 값 전달
        if (value !== this.selectedValue) {
          this.selectedValue = value;
          let selectedObject = this.itemList.find(elem=>{return elem.value==value});
          this.$emit('update:modelValue', selectedObject);
        }
      }
    });
    // 컴포넌트가 마운트될 때 초기 옵션 추가
    //this.tsInstance.addOptions(this.itemList);
  },
  beforeUnmount() {
    if (this.tsInstance) {
      this.tsInstance.destroy();
    }
  },
  updated(){
    this.tsInstance.sync();
  },
  watch: {
    // itemList가 변경될 경우 Tom Select 옵션 업데이트
    itemList: {
      handler(newList) {
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
/* Tom Select 화살표 스타일 */
.ts-control .ts-arrow {
  display: block !important;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.ts-control .ts-arrow::after {
  content: "\25BC"; /* 아래쪽 화살표 */
  font-size: 12px;
}
</style>
