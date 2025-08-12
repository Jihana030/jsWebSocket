package com.jihana.jswebsocket.server;

import com.google.gson.Gson;
import com.jihana.jswebsocket.domain.Message;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@ServerEndpoint("/chatserver.do")
public class ChatServer {

    @Configuration
    @EnableWebSocket
    public static class WebSocketConfig implements WebSocketConfigurer {

        @Override
        public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
            registry.addHandler(new MyWebSocketHandler(), "/chatserver.do");
        }
    }



}
