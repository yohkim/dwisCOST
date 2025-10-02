/**
*	Dialog 공통 팝업
*/
package com.dowinsys.mes.common.dialog.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dowinsys.mes.common.dialog.mapper.DialogMapper;
import com.dowinsys.mes.common.dialog.service.DialogService;

@Service("com.dowinsys.mes.common.dialog.service.DialogService")
public class DialogServiceImpl implements DialogService {

	@Autowired
	DialogMapper mapper;
}
