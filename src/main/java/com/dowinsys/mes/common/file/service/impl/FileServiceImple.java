package com.dowinsys.mes.common.file.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dowinsys.mes.common.file.mapper.FileMapper;
import com.dowinsys.mes.common.file.service.FileService;
import com.dowinsys.mes.common.file.vo.FileVo;

@Service("com.dowinsys.mes.common.file.service.FileService")
public class FileServiceImple implements FileService {

	@Autowired
    private FileMapper mapper;
	
	@Override
	public List<FileVo> getFilesByGroupId(String groupId) {
		return mapper.findByGroupIdAndIsDeleted(groupId, false);
	}

	@Override
	public FileVo readFile(String id) {
		return mapper.readFile(id);
	}

	@Override
	public void removeFile(FileVo vo) {
		mapper.removeFile(vo);
	}

	@Override
	public void insertFile(FileVo vo) {
		mapper.insertFile(vo);
	}

}
