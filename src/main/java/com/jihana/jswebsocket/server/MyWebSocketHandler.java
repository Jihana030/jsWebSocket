package com.jihana.jswebsocket.server;

import com.google.gson.Gson;
import com.jihana.jswebsocket.domain.Message;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.Reader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class MyWebSocketHandler implements WebSocketHandler {
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

//    접속자 확인
    private void checkSessionList(){
        System.out.println();
        System.out.println("[Session List]");
        for (WebSocketSession session : sessions) {
            System.out.println(session.getId());
        }
        System.out.println();
    }

//    //    안정성을 위한 메서드 : 웹소켓이 열렸을 때, 연결이 끊어진 세션이 있으면 리스트에서 제거
    private void clearSessionList(){
        Iterator<WebSocketSession> iterator = sessions.iterator();
        while(iterator.hasNext()){
            if(!(iterator.next()).isOpen()){
                iterator.remove();
            }
        }
    }

//    연결 성공일 때
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        checkSessionList();
        System.out.println(sessions);
    }

//    클라이언트로부터 메시지 받았을 때
    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        System.out.println(message);
        Gson gson = new Gson(); //json해석
        String payload = (String) message.getPayload();
        Message msg = gson.fromJson(payload, Message.class);

        // 모든 접속자 중에서 방금 메시지를 보낸 세션 제외 나머지 검색
        if(msg.getCode().equals("1")){ //상대방 입장
            for(WebSocketSession s : sessions){
                if(s != session){
                    try {
                        s.sendMessage(message);
                    } catch (Exception e) {
                        e.getStackTrace();
                    }
                }
            }
        } else if(msg.getCode().equals("2")){
            for(WebSocketSession s : sessions){
                try {
                    s.sendMessage(message);
                } catch (Exception e) {
                    e.getStackTrace();
                }
            }
        } else if(msg.getCode().equals("3")){ //보낸 사람 빼고 나머지에게 전달
            for(WebSocketSession s : sessions){
                if(s != session){
                    try {
                        s.sendMessage(message);
                    } catch (Exception e){
                        e.getStackTrace();
                    }
                }
            }
        }
    }

//    통신오류발생
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.out.println("통신오류");
    }

//    연결이 끊어졌을 때
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        sessions.remove(session);
        clearSessionList();
    }

//    얘는 또 뭐지
    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
