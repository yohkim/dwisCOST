/**
 * 카세트 관리 > 카세트 반출
 */
package com.dowinsys.mes.web.m0007000.service.impl;

import com.dowinsys.mes.web.m0007000.mapper.M0007004Mapper;
import com.dowinsys.mes.web.m0007000.service.M0007004Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("com.dowinsys.mes.web.m0007000.service.M0007004")
public class M0007004ServiceImpl implements M0007004Service {

    @Autowired
    M0007004Mapper mapper;
}
