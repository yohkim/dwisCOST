/**
 * 자재관리 > 원자재
 */
package com.dowinsys.mes.web.r0000000.service.impl;

import com.dowinsys.mes.web.r0000000.mapper.R0003005Mapper;
import com.dowinsys.mes.web.r0000000.service.R0000000Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("com.dowinsys.mes.web.r0000000.service.R0000000")
public class R0000000ServiceImpl implements R0000000Service {

    @Autowired
    R0003005Mapper mapper;
}
