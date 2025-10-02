/**
*	Dialog 공통 팝업
*/
package com.dowinsys.mes.common.dialog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dowinsys.mes.common.dialog.service.DialogService;

@RestController("com.dowinsys.mes.common.dialog.controller.DialogController")
@RequestMapping("/api/dialog")
public class DialogController {

	@Autowired
	DialogService service;
}
