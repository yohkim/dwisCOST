/**
*	제조 실적 관리 > 제조 실적 관리 > HOLD 관리
*/
package com.dowinsys.mes.web.m0004000.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dowinsys.mes.web.m0004000.service.M0004003Service;

@RestController("com.dowinsys.mes.web.m0004000.controller.M0004003Controller")
@RequestMapping("/api/m0004000/m0004003")
public class M0004003Controller {

	@Autowired
	M0004003Service service;
}
