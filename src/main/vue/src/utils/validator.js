import showToast from "@/utils/toast";
import _ from "lodash";

/**
 * 객체와 속성명을 받아 속성값이 유효한지 확인하는 함수
 */
export function isValidProperty(object, propertyName) {
  if (object === null || object === undefined) {
    return false;
  }
  const value = object[propertyName];
  return value !== null && value !== undefined && !_.isEmpty(_.trim(value));
}

/**
 * params 체크후 toast 처리.
 */
export function validateFields(params, keys, conditions = []) {
  for (let i = 0; i < keys.length; i++) {
    const [prefix, label, key] = keys[i].split(":");
    const value = params[key];

    if (!isValidProperty(params, key)) {
      const message = `${label}(을)를 ${prefix === "T" ? "입력하세요" : (prefix === "C" || prefix === "S" ? "선택하세요" : "빈값입니다.")}`;
      showToast("info", message);
      return false;
    }

    const condition = conditions.find((cond) => cond.chk === label);
    if (condition && typeof condition.callback === "function") {
      const callbackResult = condition.callback(value);

      if (callbackResult !== true) {
        // callbackResult가 true가 아니면 메시지 반환
        const message = typeof callbackResult === "string" ? callbackResult : `${label}` + condition.msg;
        showToast("info", message);
        return false;
      }
    }
  }
  return true;
}

/**
 * number 처리시 이전값 셋팅.
 */
export function handleNumberInputPreValueSave(params, previousKey, currentKey) {
  params[previousKey] = params[currentKey];
}

/**
 * number 처리
 */
export function handleNumberInput(event, params, previousKey, currentKey) {
  const value = event.target.value;
  const onlyNumbers = value.replace(/\D/g, "");
  const numValue = parseInt(onlyNumbers, 10) || 0;

  params[currentKey] = numValue;
}

/**
 * 변경되면 안되는경우 차이를 비교
 */
export function compareAndNotify(obj1, obj2, keysToCheck) {
  let hasDifferences = false;
  keysToCheck.forEach((item) => {
    const [label, key] = item.split(":");
    if (obj1[key] !== obj2[key]) {
      hasDifferences = true;
      showToast("info", `${label}가 변경되었습니다.\n다시 확인하시기 바랍니다.`);
    }
  });

  return hasDifferences;
}

/**
 *  rows 필수 입력한 전체 건수
 */
export function validateRowsCount(columns, rows, cnt, excludedFields = []) {
  const requiredFields = columns.filter((col) => !excludedFields.includes(col.fieldName)).map((col) => col.fieldName);

  const validRowsCount = rows.filter((row) => {
    const hasAnyValue = requiredFields.some((field) => row[field] !== undefined && row[field] !== null && row[field] !== "");
    if (!hasAnyValue) {
      return false;
    }
    const isRowValid = requiredFields.every((field) => row[field] !== undefined && row[field] !== null && row[field] !== "");
    return isRowValid;
  }).length;

  return validRowsCount < cnt;
}

/**
 * rows 필수 체크
 */
export function validateRows(columns, rows, excludedFields = []) {
  const requiredFields = columns.filter((col) => !excludedFields.includes(col.fieldName)).map((col) => col.fieldName);

  const isRowValid = rows.some((row) => {
    const hasAnyValue = requiredFields.some((field) => row[field] !== undefined && row[field] !== null && row[field] !== "");
    if (!hasAnyValue) {
      return false;
    }
    const isRowValid = requiredFields.every((field) => row[field] !== undefined && row[field] !== null && row[field] !== "");
    return !isRowValid;
  });

  return isRowValid;
}

/**
 * 특정값 빼고 입력되었는지 체크.
 */
export function isAllRequiredFieldsFilled(columns, dataObject, excludedFields = []) {
  const requiredFields = columns.filter((col) => !excludedFields.includes(col.fieldName)).map((col) => col.fieldName);

  const allFieldsFilled = requiredFields.every((field) => {
    const value = dataObject[field];
    return value !== undefined && value !== null && value !== "";
  });

  return allFieldsFilled;
}

/**
 * 특정값 빼고 입력이 된 row를 배열에 담아 return
 */
export function getCheckedRows(rows, columns, excludedFields = []) {
  const requiredFields = columns.filter((col) => !excludedFields.includes(col.fieldName)).map((col) => col.fieldName);

  const checkedRows = rows.filter((row) => {
    return requiredFields.every((field) => {
      const value = row[field];
      return value !== undefined && value !== null && value !== "";
    });
  });

  return checkedRows;
}

/**
 * 배열에 존재하는지 체크
 */
export function containsValue(arr, value) {
  return Array.isArray(arr) && arr.includes(value);
}

/**
 * 조건에 맞는 값이 있는지 확인
 */
export function hasMatchingValue(arr, predicate) {
  return Array.isArray(arr) && arr.some(predicate);
}

/**
 * 시작일 종료일 체크
 */
export function validateStartDateEndDate(startDate, endDate, period = null) {
  let message = "";
  let ret = true;

  if (startDate == null || startDate == "") {
    message += "시작일을 입력하세요.";
    ret = false;
  }

  if (endDate == null || endDate == "") {
    if (message != "") message += "\n";
    message += "종료일을 입력하세요.";
    ret = false;
  }

  if (!ret) {
    showToast("info", message);
    return ret;
  }

  if (startDate > endDate) {
    message = `종료일이 시작일보다 클 수 없습니다.`;
    showToast("info", message);
    ret = false;
  }

  if (period != null) {
    let diffTime = new Date(endDate).getTime() - new Date(startDate).getTime();
    let diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (diffDays >= period) {
      message = `시작일과 종료일은 ${period}일을 초과하여 설정할 수 없습니다.`;
      showToast("info", message);
      ret = false;
    }
  }

  return ret;
}

/**
 * 특정값이 입력되었는지 체크.
 */
export function isRequiredFieldsFilled(dataObject, fields = []) {
  return fields.every((field) => {
    const value = dataObject[field];
    return value !== null && value !== undefined && value !== "";
  });
}

/**
 * 특정값이 하나라도 존재하면 true
 */
export function hasAnyValue(obj, keys = []) {
  return keys.some((key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== "");
}

/**
 * 중복 인덱스를 찾는 함수
 */
export function findDuplicateIndices(duplicateKey, rows) {
  let keyMap = new Map(); // 중복 체크용 Map
  let duplicateIndices = new Set(); // 중복 인덱스를 저장할 Set (중복 제거)

  rows.forEach((row, index) => {
    // duplicateKey에 해당하는 값을 추출하여 문자열로 만듦
    let keyString = duplicateKey.map((key) => row[key]).join("|");

    if (keyMap.has(keyString)) {
      // 이미 있는 경우, 중복으로 처리
      duplicateIndices.add(keyMap.get(keyString)); // 기존 인덱스 추가
      duplicateIndices.add(index); // 현재 인덱스 추가
    } else {
      // 없는 경우 Map에 추가
      keyMap.set(keyString, index);
    }
  });

  return Array.from(duplicateIndices).sort((a, b) => a - b); // 정렬하여 반환
}

/**
 *  비교
 */
export function compareFirstFourCharsWithoutSpaces(str1, str2, length = null) {
  // 문자열에서 공백 제거
  const trimmedStr1 = str1.replace(/\s+/g, "");
  const trimmedStr2 = str2.replace(/\s+/g, "");

  if (length) {
      // 자리수가 주어진 경우 앞 n자리 비교
      const prefix1 = trimmedStr1.slice(0, length);
      const prefix2 = trimmedStr2.slice(0, length);
      return prefix1 === prefix2;
  } else {
      // 자리수가 주어지지 않은 경우 전체 문자열 비교
      return trimmedStr1 === trimmedStr2;
  }
}

/**
 * object1, object2의 key가 되는 값을 서로 비교
 */
export function compareObjectValues(obj1, obj2, keys1, keys2) {
  if (keys1.length !== keys2.length) return false;

  for (let i = 0; i < keys1.length; i++) {
    const val1 = obj1[keys1[i]];
    const val2 = obj2[keys2[i]];
    if (val1 !== val2) {
      return false;
    }
  }

  return true;
}

export function isValidTimeRange(startDate, startTime, endDate, endTime) {
  // '20250514' + '122531' => '20250514122531'
  const start = new Date(
    startDate.slice(0, 4),        // year
    parseInt(startDate.slice(4, 6)) - 1, // month (0-based)
    startDate.slice(6, 8),        // day
    startTime.slice(0, 2),        // hour
    startTime.slice(2, 4),        // minute
    startTime.slice(4, 6)         // second
  );

  const end = new Date(
    endDate.slice(0, 4),
    parseInt(endDate.slice(4, 6)) - 1,
    endDate.slice(6, 8),
    endTime.slice(0, 2),
    endTime.slice(2, 4),
    endTime.slice(4, 6)
  );

  return start <= end;
}