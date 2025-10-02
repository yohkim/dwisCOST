package com.dowinsys.mes.common.auth.service;

import java.util.Map;

import com.dowinsys.mes.common.auth.LoginReq;
import com.dowinsys.mes.common.auth.UserAuthInfo;

public interface AuthService {
	UserAuthInfo login(LoginReq loginReq);
	
	boolean validateToken(String token);
	
	UserAuthInfo getAuthMenuTab(LoginReq loginReq);
	
	String changePw(Map<String, Object> params);
}
