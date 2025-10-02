/**
 * 카세트 관리 > 카세트 반출
 */
package com.dowinsys.mes.web.m0007000.controller;

import com.dowinsys.mes.web.m0007000.service.M0007004Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("com.dowinsys.mes.web.m0007000.controller.M0007004Controller")
@RequestMapping("/api/m0007000/m0007004")
public class M0007004Controller {

    @Autowired
    M0007004Service service;
}
