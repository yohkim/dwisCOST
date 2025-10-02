/**
 * 카세트 관리 > 카세트 점검
 */
package com.dowinsys.mes.web.m0007000.controller;

import com.dowinsys.mes.web.m0007000.service.M0007002Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("com.dowinsys.mes.web.m0007000.controller.M0007002Controller")
@RequestMapping("/api/m0007000/m0007002")
public class M0007002Controller {

    @Autowired
    M0007002Service service;
}
