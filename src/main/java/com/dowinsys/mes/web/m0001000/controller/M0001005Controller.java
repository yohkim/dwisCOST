/**
*	자재관리 > 부자재 - Tray
*/
package com.dowinsys.mes.web.m0001000.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dowinsys.mes.common.generic.vo.GenericResourceVo;
import com.dowinsys.mes.web.m0001000.service.M0001005Service;

@RestController("com.dowinsys.mes.web.m0001000.controller.M0001005Controller")
@RequestMapping("/api/m0001000/m0001005")
public class M0001005Controller {

	@Autowired
	M0001005Service service;
	
	@PostMapping("/TAB001105/saveInData")
	public ResponseEntity<?> saveInData(@RequestBody GenericResourceVo grv) {
		Map<String, Object> resultData = new HashMap<>();
		resultData = service.saveInData(grv);
		return ResponseEntity.ok(resultData);	
	}	
	
	@PostMapping("/TAB001205/saveOutData")
	public ResponseEntity<?> saveOutData(@RequestBody GenericResourceVo grv) {
		Map<String, Object> resultData = new HashMap<>();
		resultData = service.saveOutData(grv);
		return ResponseEntity.ok(resultData);	
	}
	
	@PostMapping("/TAB001305/saveSummaryData")
	public ResponseEntity<?> saveSummaryData(@RequestBody Map<String, Object> params) {
		return ResponseEntity.ok(service.saveSummaryData(params));
	}	
	
	@PostMapping("/TAB001305/saveStockIdData")
	public ResponseEntity<?> saveStockIdData(@RequestBody GenericResourceVo grv) {
		return ResponseEntity.ok(service.saveStockIdData(grv));
	}
	
	@PostMapping("/TAB001505/saveTrayModelData")
	public ResponseEntity<?> saveTrayModelData(@RequestBody GenericResourceVo grv) {
		return ResponseEntity.ok(service.saveTrayModelData(grv));
	}		
}
