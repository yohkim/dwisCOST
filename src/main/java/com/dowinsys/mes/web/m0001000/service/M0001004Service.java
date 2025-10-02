/**
*	자재관리 > 부자재 - 필름
*/
package com.dowinsys.mes.web.m0001000.service;

import java.util.Map;

import com.dowinsys.mes.common.generic.vo.GenericResourceVo;

public interface M0001004Service {
	
	Map<String, Object> saveInData(GenericResourceVo vo);
	Map<String, Object> saveOutData(GenericResourceVo vo);
	//Map<String, Object> saveErrorData(GenericResourceVo vo);
	
	Map<String, Object> saveSummaryData(Map<String, Object> params);
	Map<String, Object> saveStockIdData(GenericResourceVo grv);		
	Map<String, Object> saveModelFilmData(GenericResourceVo grv);

}
