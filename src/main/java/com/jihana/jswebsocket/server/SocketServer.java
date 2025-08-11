package com.jihana.jswebsocket.server;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint("/testserver.do")
public class SocketServer {
    @OnOpen
    public void handleOpen() {
        System.out.println("open");
    }
    @OnClose
    public void handleClose() {
        System.out.println("close");
    }
    @OnMessage
    public String handleMessage(String message) {
        System.out.println("message: " + message);
        return message;
    }
    @OnError
    public void handleError(Throwable t) {
        System.out.println("error: " + t.getMessage());
    }
}
