package com.dowinsys.mes.common.file.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.dowinsys.mes.common.file.vo.FileVo;

@Repository("com.dowinsys.mes.common.file.mapper.FileMapper")
@Mapper
public interface FileMapper {

	List<FileVo> findByGroupIdAndIsDeleted(String groupId, boolean isDeleted);
	
	FileVo readFile(String id);
	void removeFile(FileVo vo);
	void insertFile(FileVo vo);

}
