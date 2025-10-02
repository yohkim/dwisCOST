/**
 * 데이터를 특정 key로 그룹화하고 값을 JSON 형식으로 변환
 */
export function groupByDynamicKeysToJson(data, groupKeys, valueKeys, valueKeyName = 'values') {
	return data.reduce((acc, current) => {
		const groupKeyValues = groupKeys.map(key => current[key]).join('|');
		let existing = acc.find(item => item._groupKey === groupKeyValues);

		if (!existing) {
			existing = { _groupKey: groupKeyValues };
			groupKeys.forEach(key => {
				existing[key] = current[key];
			});
			existing[valueKeyName] = [];
			acc.push(existing);
		}

		const valueObject = {};
		valueKeys.forEach(key => {
			valueObject[key] = current[key];
		});
		existing[valueKeyName].push(valueObject);

		return acc;
	}, []).map(({ _groupKey, ...rest }) => {
		if (rest[valueKeyName]) {
			rest[valueKeyName] = JSON.stringify(rest[valueKeyName]);
		}
		return rest;
	});
}

/**
 * localStorage 에 itemNm 기준으로 target을 merge
 */
export function updateLocalStorage(localStorage, key, target, removeTarget = false) {
	try {
		let existingData = localStorage.getItem(key);
		let parsedData;
	
		// Parse existing data or initialize as array
		if (existingData) {
		  parsedData = JSON.parse(existingData);
		} else {
		  parsedData = Array.isArray(target) ? [] : {};
		}
	
		if (Array.isArray(parsedData) && Array.isArray(target)) {
		  if (removeTarget) {
			// Remove target from existing data
			const targetSet = new Set(target.map(item => JSON.stringify(item)));
			parsedData = parsedData.filter(
			  item => !targetSet.has(JSON.stringify(item))
			);
		  } else {
			// Add target to existing data if not already present
			const targetSet = new Set(parsedData.map(item => JSON.stringify(item)));
			const newItems = target.filter(
			  item => !targetSet.has(JSON.stringify(item))
			);
			parsedData = [...parsedData, ...newItems];
		  }
		} else if (!Array.isArray(parsedData) && typeof parsedData === "object" && typeof target === "object") {
		  if (removeTarget) {
			// Remove keys in target from existing data
			for (const key in target) {
			  if (parsedData.hasOwnProperty(key)) {
				delete parsedData[key];
			  }
			}
		  } else {
			// Add or update keys in the object
			parsedData = { ...parsedData, ...target };
		  }
		} else {
		  // Handle type mismatch
		  parsedData = target;
		}
	
		// Save updated data back to localStorage
		localStorage.setItem(key, JSON.stringify(parsedData));
	  } catch (error) {
		console.error("Error handling localStorage data:", error);
	  }
}

/**
 * localStorage 에 itemNm 기준으로 item data를 return
 */
export function getLocalStorageData(localStorage, key) {
	try {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.error(`Error parsing data for key "${key}":`, error);
		return null;
	}
}

/**
 * localStorage 에 itemNm 기준으로 item data를 return
 */
export function removeLocalStorage(localStorage, key) {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(`Error parsing data for key "${key}":`, error);		
	}
}

/**
 * menu data 생성
 */
export function createMenuData(menu, subMenu = null, childMenu = null) {
	if (!menu) return null;

	const items = [menu, subMenu].filter(Boolean);
	const lastItem = items[items.length - 1];
	const menuFullPath = items.map(item => item.sysResourceName).join(' > ');

	return {
		menuId: childMenu ? lastItem.sysResourceId : (items.length === 3 ? subMenu.sysResourceId : lastItem.sysResourceId),
		menuFullPath,
		menuNm: lastItem.sysResourceName,
		url: childMenu ? childMenu.url : lastItem.url,
	};
	
}

/**
 * data를 원하는 필드로 target에 배열로 담기.
 */
export function handleDataField(data, field, target) {
  if (data && Array.isArray(data)) {
    target.splice(0, target.length);
    data.forEach((elem) => {
      target.push(elem[field]);
    });
  } else {
    console.warn("Invalid data or field:", { data, field });
  }
}


/**
 * data를 ['lineId','lineNm'], ['value','text'] 로원하는 필드로 target에 배열로 담기.
 */
export function transformData(dataList, targetKeys, sourceKeys, resultContainer) {
	if (!Array.isArray(dataList) || !Array.isArray(targetKeys) || !Array.isArray(sourceKeys)) {
		throw new Error('dataList, targetKeys, and sourceKeys must be arrays.');
	}
	if (targetKeys.length !== sourceKeys.length) {
		throw new Error('targetKeys and sourceKeys must have the same length.');
	}
	if (typeof resultContainer !== 'object' || resultContainer === null) {
		throw new Error('resultContainer must be an object or an array.');
	}

	const transformedData = dataList.map(item => {
	const transformedItem = {};
	for (let i = 0; i < targetKeys.length; i++) {
		transformedItem[targetKeys[i]] = item[sourceKeys[i]];
	}
		return transformedItem;
	});

	if (Array.isArray(resultContainer)) {
		resultContainer.splice(0, resultContainer.length, ...transformedData);
	} else {
		Object.assign(resultContainer, transformedData[0] || {});
	}
}

export function getGridSaveData(pDataProvider){
	const deleted = [];
	const created = [];
	const updated = [];

	let stateRows = pDataProvider.getAllStateRows();
	let jsonRows = pDataProvider.getJsonRows(0, -1);

	stateRows.deleted.forEach(dataRow => {				
		deleted.push(jsonRows[dataRow]);
	});
	stateRows.created.forEach(dataRow => {				
		created.push(jsonRows[dataRow]);
	});
	stateRows.updated.forEach(dataRow => {				
		updated.push(jsonRows[dataRow]);
	});
	return {
		count: deleted.length+created.length+updated.length,
		delete: deleted,
		insert: created,
		update: updated,
	};
}

export function getGridTreeSaveData(pDataProvider){
	const deleted = [];
	const created = [];
	const updated = [];

	let stateRows = pDataProvider.getAllStateRows();			

	stateRows.deleted.forEach(dataRow => {				
		deleted.push(pDataProvider.getJsonRow(dataRow));
	});
	stateRows.created.forEach(dataRow => {				
		created.push(pDataProvider.getJsonRow(dataRow));
	});
	stateRows.updated.forEach(dataRow => {				
		updated.push(pDataProvider.getJsonRow(dataRow));
	});

	return {
		count: deleted.length+created.length+updated.length,
		delete: deleted,
		insert: created,
		update: updated,
	};
}


/**
 * 특정 column.name의 options 값을 업데이트하는 함수
 */
export function updateColumnOptions(columns, columnNames, optionsArray) {
    if (columnNames.length !== optionsArray.length) {
        throw new Error("columnNames와 optionsArray의 길이가 같아야 합니다.");
    }

    columnNames.forEach((columnName, index) => {
        const options = optionsArray[index];
        columns.forEach((column) => {
            if (column.name === columnName) {
                column.edit = {
                    ...column.edit,
                    options: options,
                };
            }
        });
    });
}

/**
 * 2lv 메뉴의 권한있는 공정코드 value, text 를 배열로 만듬.
 */
export function fetchAuthorizedMenuProcesses(data, targetId) {   
    for (const item of data) {
        if (item.sysResourceId === targetId) {
            return item.childSysResc.map(child => ({
                value: child.sysResourceId,
                text: child.sysResourceName
            }));
        }
        if (item.childSysResc && item.childSysResc.length > 0) {
            const result = fetchAuthorizedMenuProcesses(item.childSysResc, targetId);
            if (result) {
                return result;
            }
        }
    }	
    return [];
}

/**
 *  임시로 만듬. ['010','013','015','017','020'] 
 *  value로 변경하려고...
 */
export function mapValuesToText(stringArray, mappingArray) {
    const minLength = Math.min(stringArray.length, mappingArray.length);
    const result = [];

    for (let i = 0; i < minLength; i++) {
        result.push({
            value: stringArray[i],
            text: mappingArray[i].text
        });
    }

    return result;
}

export function parseQueryParams(url) {
	const urlObj = new URL(url, window.location.origin);  // URL 객체로 파싱
	const queryParams = new URLSearchParams(urlObj.search);  // 쿼리 스트링 파싱

	const queryObj = {};  // 쿼리 파라미터를 저장할 객체

	// 쿼리 파라미터를 객체로 변환
	queryParams.forEach((value, key) => {
		queryObj[key] = value;
	});

	return queryObj;
}

/**
 * params, rows 값이 있는경우 대체해서 값을 셋팅.
 */
export function updateParamsFromRows(params, rows, keys, isValidProperty) {
	if (!rows || rows.length === 0) {
		console.warn("No rows available to update params.");
		return;
	}
  
	const source = rows[0]; // Take the first row as the source
	keys.forEach((key) => {
		if (isValidProperty(source, key)) {
			params[key] = source[key];
		}
	});
}

/**
 * 

 */
export function initializeParamsInPlace(params, excludeKeys=[]) {
    Object.keys(params).forEach(key => {
        if (!excludeKeys.includes(key)) {
            const value = params[key];
            // 데이터 타입에 따라 초기화
            if (value === null) {
                // null은 그대로 유지
                params[key] = null;
            } else if (typeof value === "number") {
                // 숫자는 0으로 초기화
                params[key] = 0;
            } else if (typeof value === "string") {
                // 문자열은 null로 초기화
                params[key] = null;
            } else if (Array.isArray(value)) {
                // 배열은 빈 배열로 초기화
                params[key] = [];
            } else if (typeof value === "object") {
                // 객체는 빈 객체로 초기화
                params[key] = {};
            } else {
                // 기타 값은 null로 초기화
                params[key] = null;
            }
        }
    });
}

/**
 * 다이나믹 컬럼, 필드 
 */
export function generateSeparatedFieldsAndColumns(defectList, filed, filedName, valueType, gubun = "", options = {}, options1 = {}) {
	if (!Array.isArray(defectList)) {
	  throw new Error("Input must be an array of defect objects");
	}
  
	const columns = [];
	const fields = [];
	
	defectList.forEach((defect) => {
		const name = gubun+defect[filed];
		const text = defect[filedName];
		const calculatedWidth = text.length * 10 + 50; // +20은 패딩 추가를 고려
	  //console.log("text", text);
	  columns.push({
		name,
		fieldName: name,
		header: { text, ...options1 },
		width: calculatedWidth, // width 추가
		...options
	  });
  
	  fields.push({
		fieldName: name,
		dataType: valueType,
	  });
	});
  
	return { columns, fields };
}

/**
 * 리얼그리드 textCategoryCallback
 */
/*export function textCategoryCallback(column, values) {
	let categories = [];
  values.forEach(item => categories.push({ text: item, value: item }))
  return categories;
}*/

/**
 * 평균 계산, 평균 편차 계산
 */
export function calculateMeanAndDeviation(values) {
  // 평균 계산
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  // 편차 계산
  const deviations = values.map(value => Math.abs(value - mean));
  // 평균 편차 계산
  const meanDeviation = deviations.reduce((sum, deviation) => sum + deviation, 0) / deviations.length;
  return { mean, meanDeviation };
}

/** 
 * number 값이 없으면 0으로 return
*/
export function numberValueOrDefault(value, value1 = 0) {
	return (value == null || value == undefined || isNaN(value)) ? value1 : value;
}

/** 
 * 범위안에 존재하는지 체크크
*/
export function isInRange(range, rangeOut) {
	// 양수와 음수 범위 계산
	const lowerBound = Math.min(-Math.abs(rangeOut), Math.abs(rangeOut));
	const upperBound = Math.max(-Math.abs(rangeOut), Math.abs(rangeOut));

	// 범위 체크
	return range >= lowerBound && range <= upperBound;
}

/**
 * 문자열 배열을 파싱하여 동적으로 this 객체에 속성을 설정하는 함수
 */
export function assignDynamicProperties(params, context) {
	params.forEach((param) => {
	  const [key, value] = param.split('=');
  
	  if (key && value) {
			try {
				context[key.trim()] = eval(value);
			} catch (e) {
				console.error(`Error parsing value for ${key.trim()}: ${value}`, e);
			}
	  }
	});
}

/**
 * Object 객체의 값을 null로 전환해서 return, 특정 제외변수 추가.
 */
export function createObjectWithNullValues(obj, excludeKeys = []) {
	return Object.keys(obj).reduce((newObj, key) => {
	  // 제외할 키는 값 유지
	  if (excludeKeys.includes(key)) {
			newObj[key] = obj[key];
	  } else {
			newObj[key] = null;
	  }
	  return newObj;
	}, {});
}

/**
 * Object 객체의 값을 제외하는 것만 빼고 return
 */
export function createObjectWithCopyValues(obj1, obj2, excludeKeys = []) {
	return Object.keys(obj1).reduce((newObj, key) => {
	  // 제외할 키는 값 유지
	  if(excludeKeys.includes(key)) {
		newObj[key] = _.cloneDeep(obj1[key]);
	  }else{
		newObj[key] = _.cloneDeep(obj2[key]);
	  } 
	  return newObj;
	}, {});
}

/**
 * 공정코드로 다음 공정의 value-text 객체 배열 찾기
 */
export function getNextProcessNamesFromCode(currentCode, processData = []) {
	const currentProcess = processData.find(
	  (process) => process["value"] === currentCode
	);
  
	if (!currentProcess) {
	  console.error("해당 공정코드를 찾을 수 없습니다.");
	  return [];
	}
  
	// 다음 공정코드를 가져옴
	const nextCodes = currentProcess["다음공정"].includes(",")
    ? currentProcess["다음공정"].split(",").map((code) => code.trim())
    : [currentProcess["다음공정"]];
  
	// 다음 공정코드 배열로 공정명 찾기
	const valueTextArray = nextCodes.map((nextCode) => {
	  const nextProcess = processData.find(
		(process) => process["value"] === nextCode
	  );
	  return nextProcess
      ? { value: nextProcess["value"], text: nextProcess["text"] }
      : null;
  	});
  
	// null 값을 제거하고 결과 반환
	return valueTextArray .filter((name) => name !== null);
}


/**
 * 정수아니면 소수점 내가 원하는 자리수만큼.
 */
export function formatNumber(num, digits= 2) {
    // 소수점이 있는지 확인
    if (num % 1 === 0) {
        return num;
    } else {
        return num.toFixed(digits);
    }
}

/**
 * URL 찾기
 */
export function findMenu(data, prodCategory, sysResourceName) {
    let result = null;
    data.some(item => {
        const currentProdCategory = item.prodCategory?.toUpperCase();
        const currentSysResourceName = item.sysResourceName?.toUpperCase();

        if (currentProdCategory === prodCategory && currentSysResourceName === sysResourceName) {
            result = item;
            return true; // Stop iteration when a match is found
        }
        if (item.childSysResc && item.childSysResc.length > 0) {
            result = findMenu(item.childSysResc, prodCategory, sysResourceName);
            return result !== null; // Stop iteration if a match is found in childSysResc
        }
        return false;
    });
    return result;
}

/**
 * 숫자와 소수점 허용
 */
export function validateTemperatureInput(value, target) {
    // 숫자와 소수점만 허용
	const filteredValue = value.replace(/[^0-9.]/g, '');
  	// 소수점이 여러 번 입력되지 않도록 제한
  	const dotIndex = filteredValue.indexOf('.');
  	const finalValue = dotIndex !== -1
    ? filteredValue.slice(0, dotIndex + 1) + filteredValue.slice(dotIndex + 1).replace(/\./g, '')
    : filteredValue;
  	return finalValue;
}

/**
 * 숫자만 허용
 */
export function validateTemperatureInput1(value, target) {
    // 숫자만 허용
	const filteredValue = value.replace(/[^0-9]/g, '');
  	return filteredValue;
}

export function textCategoryCallback(column, gridView) {
    let rows = gridView.getJsonRows();
	let values1 = [];
	for(let row of rows){
		values1.push(row[column.fieldName]);
	}
	const set = new Set(values1);
	if (!set) {
		return null;
	}
	let rtn1 = [...set];

	let rtn  = rtn1.filter((item)=> !_.isNil(item)).map(item1 => ({
		text: ""+item1,
		value: item1
	}));;   
	
	let chk = rtn1.some((el)=> _.isNil(el));
	let chk1 = rtn1.some((el)=> el == '');
	if(chk1) rtn.unshift({ value: "", text: "(빈값)"});
	if(chk) rtn.unshift({ value: null, text: "(값 없음)"});

	return rtn;     
}