/**
*	자재관리 > 원자재
*/
package com.dowinsys.mes.web.r0000000.controller;

import com.dowinsys.mes.web.m0001000.service.M0001001Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("com.dowinsys.mes.web.r0000000.controller.R0000000Controller")
@RequestMapping("/api/r0000000/r0000000")
public class R0000000Controller {

	@Autowired
	M0001001Service service;
}
