package com.dowinsys.mes.common.log.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.dowinsys.mes.common.log.vo.SysLog;

@Mapper
public interface LogMapper {
	int insertSysLog(SysLog sysLog);
}
