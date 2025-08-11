package com.jihana.jswebsocket.server;

import com.google.gson.Gson;
import com.jihana.jswebsocket.domain.Message;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@ServerEndpoint("/chatserver.do")
public class ChatServer {
    private static final List<Session> sessionList = new ArrayList<Session>();

    @OnOpen
    public void handleOpen(Session session) {
        sessionList.add(session);
        checkSessionList();
        clearSessionList();
    }
    @OnMessage
    public void handleMessage(String message, Session session) {
        System.out.println(message);
        Gson gson = new Gson(); //json해석
        Message msg = gson.fromJson(message, Message.class);

        // 모든 접속자 중에서 방금 메시지를 보낸 세션 제외 나머지 검색
        if(msg.getCode().equals("1")){ //상대방 입장
            for(Session s : sessionList){
                if(s != session){
                    try {
                        s.getBasicRemote().sendText(message);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        } else if(msg.getCode().equals("2")){
            sessionList.remove(session);
            for(Session s : sessionList){
                try {
                    s.getBasicRemote().sendText(message);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } else if(msg.getCode().equals("3")){ //보낸 사람 빼고 나머지에게 전달
            for(Session s : sessionList){
                if(s != session){
                    try {
                        s.getBasicRemote().sendText(message);
                    } catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
        }
    }

//    접속자 확인
    private void checkSessionList(){
        System.out.println();
        System.out.println("[Session List]");
        for (Session session : sessionList) {
            System.out.println(session.getId());
        }
        System.out.println();
    }

//    안정성을 위한 메서드 : 웹소켓이 열렸을 때, 연결이 끊어진 세션이 있으면 리스트에서 제거
    private void clearSessionList(){
        Iterator<Session> iterator = sessionList.iterator();
        while(iterator.hasNext()){
            if(!(iterator.next()).isOpen()){
                iterator.remove();
            }
        }
    }

}
