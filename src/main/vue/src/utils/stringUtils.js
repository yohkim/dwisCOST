// 특정 키의 값을 대문자로 변환
export function toUpperCaseInParamsByRegex(params, key, regex) {
    if (!params || typeof params[key] !== 'string') return;
    const originalValue = params[key];
    const filteredValue = originalValue.replace(regex, '');
    params[key] = filteredValue.toUpperCase();
}


export function formatPCode(value, position = 10, separator = "/") {
    if (!value) return "";
  
    // 1. 지정된 자리수에 특수문자 추가
    if (value.length > position && value[position] !== separator) {
      value = value.slice(0, position) + separator + value.slice(position);
    }
  
    // 2. 최대 입력 길이 제한 (separator 포함)
    const maxLength = position + separator.length + 10; // 기본적으로 최대 10자리 추가
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }
  
    return value;
  }

  export function getAlignStyleGridField(fieldName){

      let styleName = "";

      if ( fieldName.includes("Qty") || fieldName.includes("Rate") || fieldName.includes("횟수")) {
        styleName = "tr";
      }
      else if ( fieldName === "comments" ) {
        styleName = "tl";
      }
      else {
        styleName = "tc";
      }

      return styleName;
  }

  export function korToEng(text) {

    // 초성, 중성, 종성 매핑 테이블
    const CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    const JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
    const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

    // 초성, 중성, 종성 → 영문 키보드 매핑
    const CHO_MAP = ["r", "R", "s", "e", "E", "f", "a", "q", "Q", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g"];
    const JUNG_MAP = ["k", "o", "i", "O", "j", "p", "u", "P", "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m", "ml", "l"];
    const JONG_MAP = ["", "r", "R", "rt", "s", "sw", "sg", "e", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q", "qt", "t", "T", "d", "w", "c", "z", "x", "v", "g"];
   
    let result = "";
    text = text.replace(/\s+/g, '');
    for (let char of text) {
      const code = char.charCodeAt(0);
  
      // 한글인지 확인 (유니코드 범위: 0xAC00 ~ 0xD7A3)
      if (code >= 0xAC00 && code <= 0xD7A3) {
        const index = code - 0xAC00;
        const choIndex = Math.floor(index / (21 * 28)); // 초성 인덱스
        const jungIndex = Math.floor((index % (21 * 28)) / 28); // 중성 인덱스
        const jongIndex = index % 28; // 종성 인덱스
  
        result += CHO_MAP[choIndex] + JUNG_MAP[jungIndex] + (JONG_MAP[jongIndex] || "");
      } 
      // 단독 모음 처리 (ㅒ, ㅖ 등)
      else if (CHO.includes(char)) {
        result += CHO_MAP[CHO.indexOf(char)];
      }else if(JUNG.includes(char)){
        result += JUNG_MAP[JUNG.indexOf(char)];
      }else if(JONG.includes(char)){
        result += JONG_MAP[JONG.indexOf(char)];
      }
      // 한글이 아니면 그대로 유지
      else {
        result += char;
      }
    }
    return result.toUpperCase(); // 대문자로 변환
  }

  export function convertToUpperEng(event, targetVar, vueInstance) {
      vueInstance[targetVar] = korToEng(event.target.value);
  }

  export function findMappedValue(keys, values, target) {
    const index = keys.indexOf(target);
    return index !== -1 ? values[index] : null;
  }
  