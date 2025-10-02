import axios from '@plugins/axios.js';
/**
 * 공통 코드가져오기 [코드, 내용] [value, text]
 */
export async function getCommonCodeValueText(code=[], target=[]) {
    if (!Array.isArray(code) || !Array.isArray(target)) {
      throw new Error("Both `code` and `target` must be arrays.");
    }
    if (code.length !== target.length) {
      throw new Error("The `code` and `target` arrays must have the same length.");
    }
    const paramsList = code.map((c, index) => ({
      menuId: "COMCODE",      
      queryId: "selectComCode1",
      queryParams: { "code": c },
      target: target[index]      
    }));
    await axios.api.searchAll(paramsList);
}

/**
 * 공통 코드가져오기 [내용, 내용] [value, text]
 */
export async function getCommonContentValueText(code=[], target=[]) {
    if (!Array.isArray(code) || !Array.isArray(target)) {
      throw new Error("Both `code` and `target` must be arrays.");
    }
    if (code.length !== target.length) {
      throw new Error("The `code` and `target` arrays must have the same length.");
    }
    const paramsList = code.map((c, index) => ({
        menuId: "COMCODE",      
        queryId: "selectComCode2",
        queryParams: { "code": c },
        target: target[index]   
    }));
    await axios.api.searchAll(paramsList);
}