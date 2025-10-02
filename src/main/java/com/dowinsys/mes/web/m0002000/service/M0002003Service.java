/**
*	프로세스 플래닝 > 제품 모델 관리
*/
package com.dowinsys.mes.web.m0002000.service;

import java.util.List;
import java.util.Map;

import com.dowinsys.mes.common.CamelMap;
import com.dowinsys.mes.common.generic.vo.GenericResourceVo;

public interface M0002003Service {
	
	Map<String, Object> saveProdProcData(GenericResourceVo vo);	
	Map<String, Object> saveProcessData(GenericResourceVo vo);
	Map<String, Object> saveProcessPlanData(GenericResourceVo vo);
	Map<String, Object> saveStepData(GenericResourceVo vo);
}
