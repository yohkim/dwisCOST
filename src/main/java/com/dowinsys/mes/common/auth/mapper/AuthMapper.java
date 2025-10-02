package com.dowinsys.mes.common.auth.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.dowinsys.mes.common.auth.LoginReq;
import com.dowinsys.mes.common.auth.SysResource;
import com.dowinsys.mes.common.auth.UserInfo;

@Mapper
public interface AuthMapper {
	UserInfo selectCheckUser(LoginReq loginReq);
	List<SysResource> selectAuthMenuTabList(LoginReq loginReq);
	List<Map<String,Object>> selectProdCtg();
	List<Map<String,Object>> selectProdCtgByUser(LoginReq loginReq);
	String selectHasWorkStatusYn(LoginReq loginReq);
	String selectPwByUserId(Map<String,Object> params);
	int updateUserPw(Map<String,Object> params);
	List<String> selectUserRoleList(LoginReq loginReq);
}
