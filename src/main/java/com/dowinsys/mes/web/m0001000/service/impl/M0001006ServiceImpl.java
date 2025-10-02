/**
*	자재관리 > 부자재 - 약액
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
import com.dowinsys.mes.web.m0001000.mapper.M0001006Mapper;
import com.dowinsys.mes.web.m0001000.service.M0001006Service;

@Service("com.dowinsys.mes.web.m0001000.service.M0001006")
public class M0001006ServiceImpl implements M0001006Service {

	@Autowired
	M0001006Mapper mapper;
	
	@Autowired
	M0001001Mapper m0001001Mapper;		

	@Autowired
	GenericResourceService genericService;
	
	@Autowired
	JwtUtil jwUtil;
	
	@Transactional
	public Map<String, Object> saveInData(GenericResourceVo grv) {

		Map<String, Object> resultData = new HashMap<>();

		// Check if the item can be deleted
		try {
			List<Map<String, Object>> checkData;

			if (grv.getDelete() != null) {
				for (QueryData deleteData : grv.getDelete()) {

					if (deleteData.getData() != null && !deleteData.getData().isEmpty()) {
						checkData = mapper.checkUseInData(deleteData.getData());

						if (checkData != null && !checkData.isEmpty()
								&& !"NoData".equals(checkData.get(0).get("materialId"))) {

							resultData.put("resultCode", "CHECK_USED");
							resultData.put("resultData", checkData.get(0).get("materialId"));

							return resultData;
						}
					}
				}
			}

			if (grv.getInsert() != null) {
				for (QueryData insertData : grv.getInsert()) {

					if (insertData.getData() != null && !insertData.getData().isEmpty()) {
						checkData = mapper.checkInsertInData(insertData.getData());

						if (checkData != null && !checkData.isEmpty()
								&& !"NoData".equals(checkData.get(0).get("materialId"))) {

							resultData.put("resultCode", "CHECK_DUP");
							resultData.put("resultData", checkData.get(0).get("materialId"));

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
			
			if (grv.getUpdate() != null) {
				for (QueryData updateData : grv.getUpdate()) {

					if (updateData.getData() != null && !updateData.getData().isEmpty()) {
						checkData = mapper.checkUseInData(updateData.getData());

						if (checkData != null && !checkData.isEmpty()
								&& !"NoData".equals(checkData.get(0).get("materialId"))) {

							resultData.put("resultCode", "CHECK_USED");
							resultData.put("resultData", checkData.get(0).get("materialId"));

							return resultData;
						}
					}
				}
			}			

			if (resultData.isEmpty()) {
				// 정상 데이터 변경 저장 처리
				genericService.saveData(grv);
				resultData.put("resultCode", "SUCCESS");
			}
		} catch (Exception e) {
			throw new RuntimeException("saveData error", e);
		}

		return resultData;
	}
	
	@Transactional
	public Map<String, Object> saveOutData(GenericResourceVo grv) {

		Map<String, Object> resultData = new HashMap<>();

		// Check if the item can be deleted
		try {
			List<CamelMap<String, Object>> checkData;

			if (grv.getDelete() != null) {
				for (QueryData deleteData : grv.getDelete()) {

					if (deleteData.getData() != null && !deleteData.getData().isEmpty()) {
						
/*						checkData = mapper.checkDeleteInData(deleteData.getData());
						if (checkData != null && !checkData.isEmpty() && !"NoData".equals(checkData.get(0).get("materialId"))) {

							resultData.put("resultCode", "CHECK_DELETE");
							resultData.put("resultData", checkData.get(0).get("materialId"));

							return resultData;
						}
						else {*/
							for (Map<String, Object> data : deleteData.getData()) {
								mapper.deleteOutData(data); 		// 투입취소
								mapper.updateRemainQtyPlus(data); 	// 잔량 플러스 처리
							}							
							
						//}
					}
				}
			}
			
			if (grv.getInsert() != null) {
				for (QueryData insertData : grv.getInsert()) {

					if (insertData.getData() != null && !insertData.getData().isEmpty()) {
						
						LocalTime curTime = LocalTime.now();
						String formatedTime = curTime.format(DateTimeFormatter.ofPattern("HH:mm"));
						
						for (Map<String, Object> data : insertData.getData()) {
							//잔량 확인
							CamelMap<String, Object> chkData = mapper.checkRemainQty(data);
							
							if( chkData != null && !chkData.isEmpty() ) {
								TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
								resultData.put("resultCode", chkData.get("checkCode"));
								resultData.put("resultData", chkData.get("materialId"));
								return resultData;								
							}
							else {
								data.put("outTime", formatedTime);
								mapper.insertOutData(data); 		// 투입처리
								mapper.updateRemainQtyMinus(data);	// 잔량 마이너스 처리
							}						
						}
					}
				}
			}			

			if (grv.getUpdate() != null) {
				for (QueryData updateData : grv.getUpdate()) {
					if (updateData.getData() != null && !updateData.getData().isEmpty()) {
							for (Map<String, Object> data : updateData.getData()) {
								//잔량 확인
								CamelMap<String, Object> chkData = mapper.checkRemainDiffQty(data);
								
								if( chkData != null && !chkData.isEmpty() ) {
									TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
									resultData.put("resultCode", "LACK_QTY");
									resultData.put("resultData", chkData.get("materialId"));
									return resultData;								
								}
								else {								
									mapper.updateOutData(data);	
									mapper.updateRemainDiffQty(data);	// 투입수량 전/후 차이값에 따른 잔량 처리
								}
							}	
					}
				}
			}			

			resultData.put("resultCode", "SUCCESS");
			
		} catch (Exception e) {
			throw new RuntimeException("saveData error", e);
		}

		return resultData;
	}		
	
	@Transactional
	public Map<String, Object> saveReturnData(GenericResourceVo grv) {

		Map<String, Object> resultData = new HashMap<>();

		// Check if the item can be deleted
		try {
			List<CamelMap<String, Object>> checkData;

			if (grv.getDelete() != null) {
				for (QueryData deleteData : grv.getDelete()) {

					if (deleteData.getData() != null && !deleteData.getData().isEmpty()) {
						
							for (Map<String, Object> data : deleteData.getData()) {
								mapper.deleteReturnData(data); 		// 반납취소
								mapper.updateReturnQtyZeroForOuData(data); 	// 공정투입 반납수량 update
								mapper.updateRemainQtyMinusForReturn(data); 	// 잔량 마이너스 처리
							}
					}
				}
			}
			
			if (grv.getInsert() != null) {
				for (QueryData insertData : grv.getInsert()) {

					if (insertData.getData() != null && !insertData.getData().isEmpty()) {
						
						LocalTime curTime = LocalTime.now();
						String formatedTime = curTime.format(DateTimeFormatter.ofPattern("HH:mm"));
						
						for (Map<String, Object> data : insertData.getData()) {
							//이미 반납되었는지 확인
							CamelMap<String, Object> chkData = mapper.checkExistsReturnData(data);
							
							if( chkData != null && !chkData.isEmpty()) {
								TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
								resultData.put("resultCode", "CHECK_DUP");
								resultData.put("resultData", chkData);
								return resultData;								
							}
							else {
								data.put("returnTime", formatedTime);
								mapper.insertReturnData(data); 			// 반납처리
								mapper.updateReturnQtyForOuData(data); 	// 공정투입 반납수량 update
								mapper.updateRemainQtyPlusForReturn(data);	// 잔량 플러스 처리
							}						
						}
					}
				}
			}			

			if (grv.getUpdate() != null) {
				for (QueryData updateData : grv.getUpdate()) {
					if (updateData.getData() != null && !updateData.getData().isEmpty()) {
							for (Map<String, Object> data : updateData.getData()) {
								//잔량 확인
								int orgReturnQty = mapper.checkOrgReturnQty(data);
								
								if( orgReturnQty != Integer.parseInt(data.get("orgReturnQty").toString()) ) {
									TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
									resultData.put("resultCode", "DIFF_QTY");
									resultData.put("resultData", data.get("materialId"));
									return resultData;								
								}
								else {								
									mapper.updateReturnData(data);	
									mapper.updateReturnQtyForOuData(data); 	// 공정투입 반납수량 update
									mapper.updateRemainDiffQtyForReturn(data);	// 투입수량 전/후 차이값에 따른 잔량 처리
								}
							}	
					}
				}
			}			

			resultData.put("resultCode", "SUCCESS");
			
		} catch (Exception e) {
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
			preStockStatus = m0001001Mapper.selectPreStockStatus(params);
			
			if ( preStockStatus == null || preStockStatus.isEmpty() ) {
				resultData.put("resultCode", "NOT_EXISTS_PRE");				
			}
			else { 
				
				String tempTableName = "temp_sub_mat_chemical_id_stock_" + params.get("stockDate") + "_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
				params.put("tempTableName", tempTableName);
				
				mapper.createTempMatStockTable(params);				
			
				mapper.deleteSubMatChemicalIdStock(params);
				mapper.insertSubMatChemicalIdStock(params);
				mapper.deleteSubMatChemicalStock(params);
				mapper.insertSubMatChemicalStock(params);
				
				m0001001Mapper.insertMatCloseInfo(params);	
				
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
							mapper.updateSubMatChemicalIdStock(data); 				
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
								mapper.updateSubMatChemicalIdStock(data); 	
							}	
					}
				}
			}
			
			if ( reSummary ) {			
				mapper.deleteSubMatChemicalStock(grv.getQueryParams());
				mapper.insertSubMatChemicalStock(grv.getQueryParams());
			}
			
			if ( "COMPLETE".equals(grv.getQueryParams().get("status")) || "CLOSE".equals(grv.getQueryParams().get("status"))) {
				
				Integer confirmNCnt = Optional.ofNullable(mapper.selectConfirmN(grv.getQueryParams())).orElse(0);
				
				if ( confirmNCnt != null && ((Number)confirmNCnt).intValue() > 0 ) {
					resultData.put("resultCode", "CHECK_N");
					return resultData;
				}
				
			}
			
			m0001001Mapper.updatetMatCloseInfo(grv.getQueryParams());

			resultData.put("resultCode", "SUCCESS");
			
		} catch (Exception e) {
			throw new RuntimeException("saveData error", e);
		}

		return resultData;
	}		

}
