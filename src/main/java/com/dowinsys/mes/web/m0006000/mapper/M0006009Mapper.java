/**
*	기준정보 > 사용자-메뉴 권한 관리
*/
package com.dowinsys.mes.web.m0006000.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.dowinsys.mes.common.auth.SysResource;

@Repository("com.dowinsys.mes.web.m0006000.mapper.M0006009Mapper")
@Mapper
public interface M0006009Mapper {
	List<SysResource> selectRoleMenuTabList(Map<String,Object> params);
	int deleteRoleSysResc(Map<String,Object> params);
	int insertRoleSysResc(Map<String,Object> params);
	int insertUserRole(Map<String,Object> params);
	int deleteUserRole(Map<String,Object> params);
	int deleteRole(Map<String,Object> params);
	String checkRoleId(Map<String,Object> params);
	int insertRole(Map<String,Object> params);
	int updateRole(Map<String,Object> params);
}
