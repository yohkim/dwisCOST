/**
*	기준정보 > 불량사유 코드
*/
package com.dowinsys.mes.web.m0006000.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dowinsys.mes.common.generic.vo.GenericResourceVo;
import com.dowinsys.mes.web.m0006000.service.M0006005Service;

@RestController("com.dowinsys.mes.web.m0006000.controller.M0006005Controller")
@RequestMapping("/api/m0006000/m0006005")
public class M0006005Controller {

	@Autowired
	M0006005Service service;
	
	@PostMapping("/saveData")
	public ResponseEntity<?> saveData(@RequestBody GenericResourceVo grv) {
		return ResponseEntity.ok(service.saveData(grv));		
	}
}
