/**
*	기준정보 > 일반코드
*/
package com.dowinsys.mes.web.m0006000.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dowinsys.mes.common.CamelMap;
import com.dowinsys.mes.common.generic.service.GenericResourceService;
import com.dowinsys.mes.common.generic.vo.GenericResourceVo;
import com.dowinsys.mes.common.generic.vo.QueryData;
import com.dowinsys.mes.web.m0006000.mapper.M0006002Mapper;
import com.dowinsys.mes.web.m0006000.service.M0006002Service;

@Service("com.dowinsys.mes.web.m0006000.service.M0006002")
public class M0006002ServiceImpl implements M0006002Service {

	@Autowired
	M0006002Mapper mapper;
	
	@Autowired
	GenericResourceService genericService;

	@Override
	public List<CamelMap<String, Object>> getMajCdList() {
		return mapper.getMajCodeList();
	}

	@Override
	public Map<String, Object> saveData(GenericResourceVo grv) {
		Map<String, Object> resultData = new HashMap<>();
		
		List<Map<String, Object>> checkData = null;
		
		try {
			if ( grv.getInsert() != null ) {
				for (QueryData insertData : grv.getInsert()) {
					
					if ( insertData.getData() != null && !insertData.getData().isEmpty()) {
						 checkData =  mapper.checkInsertCommCode(insertData.getData());
					
						if ( checkData != null && !checkData.isEmpty() ) {
							
							resultData.put("resultCode", "CHECK_INSERT");
							resultData.put("resultData", checkData.get(0).get("code"));
							
							return resultData;
						}	
					}
				}
			}			
			
			if ( resultData.isEmpty() ) {
				// 정상 데이터 변경 저장 처리	
				genericService.saveData(grv);
				resultData.put("resultCode", "SUCCESS");
			}
		}
		catch ( Exception e ) {
			throw new RuntimeException("saveData error", e);
		}
		
		return resultData;
	}
}
