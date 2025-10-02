/**
*	자재관리 > 원자재
*/
package com.dowinsys.mes.web.m0001000.service.impl;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.dowinsys.mes.common.CamelMap;
import com.dowinsys.mes.common.generic.service.GenericResourceService;
import com.dowinsys.mes.common.generic.vo.GenericResourceVo;
import com.dowinsys.mes.common.generic.vo.QueryData;
import com.dowinsys.mes.component.JwtUtil;
import com.dowinsys.mes.web.m0001000.mapper.M0001001Mapper;
import com.dowinsys.mes.web.m0001000.service.M0001001Service;

@Service("com.dowinsys.mes.web.m0001000.service.M0001001")
public class M0001001ServiceImpl implements M0001001Service {

	@Autowired
	M0001001Mapper mapper;
	
	@Autowired
	GenericResourceService genericService;
	
	@Autowired
	JwtUtil jwUtil;

	@Override
	public Map<String, Object> getInBaseInfo(Map<String, Object> params) {
		Map<String, Object> rtnMap = new HashMap<>();
		
		int dupCnt = mapper.dupGlassId(params);
		
		if( dupCnt < 1 ) {
			rtnMap.put("dupYn", "N");
			rtnMap.put("glassInfo", mapper.getGlassInfo(params));
			rtnMap.put("dateInfo", mapper.getCutDateInfo(params));
			rtnMap.put("unitInfo", mapper.getUnitInfo(params));
		}else {
			rtnMap.put("dupYn", "Y");
		}
		
		return rtnMap;
	}

	@Override
	@Transactional
	public Map<String, Object> saveInData(GenericResourceVo grv) {
		Map<String, Object> resultData = new HashMap<>();
		
		List<Map<String, Object>> checkData = null;
		
		try {
			
			if (grv.getDelete() != null) {
				for (QueryData deleteData : grv.getDelete()) {

					if (deleteData.getData() != null && !deleteData.getData().isEmpty()) {
						checkData = mapper.checkUseInData(deleteData.getData());

						if (checkData != null && !checkData.isEmpty()
								&& !"NoData".equals(checkData.get(0).get("glassId"))) {

							resultData.put("resultCode", "CHECK_USED");
							resultData.put("resultData", checkData.get(0).get("glassId"));

							return resultData;
						}
					}
				}
			}			
			
			if ( grv.getInsert() != null ) {
				for (QueryData insertData : grv.getInsert()) {
					
					if ( insertData.getData() != null && !insertData.getData().isEmpty()) {
						 checkData =  mapper.checkDupGlassId(insertData.getData());
					
						if ( checkData != null && !checkData.isEmpty() ) {
							
							resultData.put("resultCode", "DUP_ERR");
							resultData.put("resultData", checkData);
							
							return resultData;
						}
						else {
							LocalTime curTime = LocalTime.now();
							String formatedTime = curTime.format(DateTimeFormatter.ofPattern("HH:mm"));
							for (Map<String, Object> row : insertData.getData()) {
								row.put("inTime", formatedTime);
							}
						}
					}
				}
			}	
				
			/*
			 * if (grv.getUpdate() != null) { for (QueryData updateData : grv.getUpdate()) {
			 * 
			 * if (updateData.getData() != null && !updateData.getData().isEmpty()) {
			 * checkData = mapper.checkUseInData(updateData.getData());
			 * 
			 * if (checkData != null && !checkData.isEmpty() &&
			 * !"NoData".equals(checkData.get(0).get("glassId"))) {
			 * 
			 * resultData.put("resultCode", "CHECK_USED"); resultData.put("resultData",
			 * checkData.get(0).get("glassId"));
			 * 
			 * return resultData; } } } }
			 */					
			
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

	@Override
	public Map<String, Object> getOutBaseInfo(Map<String, Object> params) {
		Map<String, Object> rtnMap = new HashMap<>();
		
		rtnMap.put("inDataInfo", mapper.getRawMatInInfo(params));
		
		return rtnMap;
	}

	@Override
	@Transactional
	public Map<String, Object> saveOutData(GenericResourceVo grv) {
		Map<String, Object> resultData = new HashMap<>();
		
		try {
			//삭제처리
			if ( grv.getDelete() != null ) {
				for (QueryData deleteData : grv.getDelete()) {
                	if(deleteData.getData() != null && !deleteData.getData().isEmpty()) {
                		for (Map<String, Object> data : deleteData.getData()) {
                			//투입취소
                			mapper.deleteRawMatOut(data);
                			//잔량 플러스 처리
                			mapper.updateRemainQtyPlus(data);
                		}
                	}
                }
			}
			
			if ( grv.getInsert() != null ) {
				for (QueryData insertData : grv.getInsert()) {
					
					if ( insertData.getData() != null && !insertData.getData().isEmpty()) {
						LocalTime curTime = LocalTime.now();
						String formatedTime = curTime.format(DateTimeFormatter.ofPattern("HH:mm"));						
						
						for (Map<String, Object> data : insertData.getData()) {
							
							//등록전 입고 잔량 수량 확인
                			CamelMap<String, Object> chkMap = mapper.checkRemainQty(data);
                			
                			if(chkMap != null && !chkMap.isEmpty()) {
                				TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                				resultData.put("resultCode", "LACK_QTY");
                				resultData.put("resultMsg", "["+chkMap.get("glassId")+"]재고 수량이 부족합니다!");
                				return resultData;
                			}else {
                				data.put("dowInsysUserId",jwUtil.getUserId());
                				data.put("outTime", formatedTime);
                				//출고 등록
                				mapper.insertRawMatOut(data);
                				//입고 잔량 및 사용수량 처리
                				mapper.updateRemainQtyMinus(data);
                			}
                		}
					}
				}
			}			
			
			if (grv.getUpdate() != null) {
                for (QueryData updateData : grv.getUpdate()) {
                	if(updateData.getData() != null && !updateData.getData().isEmpty()) {
                		for (Map<String, Object> data : updateData.getData()) {
							//잔량 확인
							CamelMap<String, Object> chkData = mapper.checkRemainDiffQty(data);
							if( chkData != null && !chkData.isEmpty() ) {
								TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
								resultData.put("resultCode", "LACK_QTY");
								resultData.put("resultMsg", "["+chkData.get("glassId")+"]재고 수량이 부족합니다!");
								return resultData;								
							}
							else {
								mapper.updateRawMatOut(data);         
								mapper.updateRemainDiffQty(data);	// 투입수량 전/후 차이값에 따른 잔량 처리								
							}                			     		
                		}
                	}
                }
            }
			resultData.put("resultCode", "SUCCESS");
		}
		catch ( Exception e ) {
			throw new RuntimeException("saveData error", e);
		}
		
		return resultData;
	}
	
	@Transactional
	public Map<String, Object> saveSummaryData(Map<String, Object> params) {

		Map<String, Object> resultData = new HashMap<>();
		String preStockStatus = "";

		try 
		{
			preStockStatus = mapper.selectPreStockStatus(params);
			
			if ( preStockStatus == null || preStockStatus.isEmpty() ) {
				resultData.put("resultCode", "NOT_EXISTS_PRE");				
			}
			else { 
				
				String tempTableName = "temp_raw_mat_proc_id_stock_" + params.get("stockDate") + "_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
				params.put("tempTableName", tempTableName);				
			
				mapper.createTempMatStockTable(params);
				
				mapper.deleteRawMatIdStock(params);
				mapper.insertRawMatIdStock(params);
				mapper.deleteRawMatStock(params);
				mapper.insertRawMatStock(params);
				
				mapper.insertMatCloseInfo(params);	
				
				mapper.dropTempMatStockTable(params);
	
				resultData.put("resultCode", "SUCCESS");
			}
			
		} catch (Exception e) {
			throw new RuntimeException("saveSummaryData error", e);
		}

		return resultData;
	}	
	
	@Transactional
	public Map<String, Object> saveStockIdData(GenericResourceVo grv) {

		Map<String, Object> resultData = new HashMap<>();
		
		boolean reSummary = false;

		try {
			List<CamelMap<String, Object>> checkData;
			
			if (grv.getInsert() != null) {
				for (QueryData insertData : grv.getInsert()) {

					if (insertData.getData() != null && !insertData.getData().isEmpty()) {
						
						reSummary = true;						
						for (Map<String, Object> data : insertData.getData()) {
							data.put("workerName", grv.getQueryParams().get("workerName"));
							mapper.updateRawMatIdStock(data); 				
						}
					}
				}
			}			

			if (grv.getUpdate() != null) {
				for (QueryData updateData : grv.getUpdate()) {
					if (updateData.getData() != null && !updateData.getData().isEmpty()) {
						
							reSummary = true;
							for (Map<String, Object> data : updateData.getData()) {
								data.put("workerName", grv.getQueryParams().get("workerName"));
								mapper.updateRawMatIdStock(data); 	
							}	
					}
				}
			}
			
			if ( reSummary ) {			
				mapper.deleteRawMatStock(grv.getQueryParams());
				mapper.insertRawMatStock(grv.getQueryParams());
			}
			
			if ( "COMPLETE".equals(grv.getQueryParams().get("status")) || "CLOSE".equals(grv.getQueryParams().get("status"))) {
				
				Integer confirmNCnt = Optional.ofNullable(mapper.selectConfirmN(grv.getQueryParams())).orElse(0);
				
				if ( confirmNCnt != null && ((Number)confirmNCnt).intValue() > 0 ) {
					resultData.put("resultCode", "CHECK_N");
					return resultData;
				}
				
			}
			
			mapper.updatetMatCloseInfo(grv.getQueryParams());

			resultData.put("resultCode", "SUCCESS");
			
		} catch (Exception e) {
			throw new RuntimeException("saveData error", e);
		}

		return resultData;
	}	

	@Override
	public Map<String, Object> saveMstData(GenericResourceVo grv) {
		Map<String, Object> resultData = new HashMap<>();
		
		List<Map<String, Object>> checkData = null;
		
		try {
			if ( grv.getInsert() != null ) {
				for (QueryData insertData : grv.getInsert()) {
					
					if ( insertData.getData() != null && !insertData.getData().isEmpty()) {
						 checkData =  mapper.checkDupGlassMst(insertData.getData());
					
						 if (checkData != null && !checkData.isEmpty()
									&& !"NoData".equals(checkData.get(0).get("glassCode"))) {
							
							resultData.put("resultCode", "DUP_ERR");
							resultData.put("resultData",  checkData.get(0).get("glassCode"));
							
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
