/**
*	설비관리 > 설비 기준정보
*/
package com.dowinsys.mes.web.m0009000.service;

import java.util.List;
import java.util.Map;

import com.dowinsys.mes.common.CamelMap;
import com.dowinsys.mes.common.generic.vo.GenericResourceVo;

public interface M0009001Service {
	
	Map<String, Object> saveEquipProdBase(GenericResourceVo grv);
	Map<String, Object> saveEquipOffCode(GenericResourceVo grv);


}
