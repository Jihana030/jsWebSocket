package com.jihana.jswebsocket.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SocketController {
    @GetMapping(value = "/test.do")
    public String test(Model model) {
        return "test";
    }
}
