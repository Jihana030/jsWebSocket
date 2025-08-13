package com.jihana.jswebsocket.server;

import com.google.gson.Gson;
import com.jihana.jswebsocket.domain.Message;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import org.springframework.web.socket.*;

import java.io.Reader;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

public class MyWebSocketHandler implements WebSocketHandler {
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    private final Map<WebSocketSession, String> sessionNames = new ConcurrentHashMap<>();

    private final Map<WebSocketSession, Message> userMessages = new ConcurrentHashMap<>();


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

//        참가자 명단
        List<String> currentParticipants = new ArrayList<>();
        for(WebSocketSession s : sessions){
            String userName = sessionNames.get(s);
            if(userName != null){
                currentParticipants.add(userName);
            }
        }
        Message participant = new Message();
        participant.setCode("0"); //명단업데이트
        participant.setContent(new Gson().toJson(currentParticipants));

        session.sendMessage(new TextMessage(new Gson().toJson(participant)));

        Message joinMessage = new Message();
        joinMessage.setCode("1");
        joinMessage.setSender(session.getId());

    }

//    클라이언트로부터 메시지 받았을 때
    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        Gson gson = new Gson(); //json해석
        String payload = (String) message.getPayload();
        Message msg = gson.fromJson(payload, Message.class);

//        입장 시 유저명, 썸네일 숫자
        if(msg.getCode().equals("1")){
//            중복검사
            boolean isDuplicateName = userMessages.values().stream().anyMatch(userMsg -> userMsg.getSender().equals(msg.getSender()));
            if(isDuplicateName){ // 이름이 중복이라면
                Message error = new Message();
                error.setCode("9"); //에러용 코드 9
                error.setContent("이미 사용 중인 이름입니다.");
                session.sendMessage(new TextMessage(gson.toJson(error)));
                return;
            }

            Set<Integer> usedNumbers = userMessages.values().stream().map(Message::getThumb).collect(Collectors.toSet());
            Random random = new Random();
            int uniqueNumber;
            do {
                uniqueNumber = random.nextInt(100) + 1;
            } while (usedNumbers.contains(uniqueNumber));

            msg.setThumb(uniqueNumber);
            sessionNames.put(session, msg.getSender());
            userMessages.put(session, msg);
        } else {
            Message userMessage = userMessages.get(session);
            if(userMessage != null){
                msg.setThumb(userMessage.getThumb());
            }
        }

        String jsonMessage = gson.toJson(msg);
        TextMessage textMessage = new TextMessage(jsonMessage);

        for (WebSocketSession s : sessions) {
            try {
                s.sendMessage(textMessage);
            } catch (Exception e) {
                e.getStackTrace();
            }
        }
        if(msg.getCode().equals("2")){
            sessions.remove(session);
            userMessages.remove(session);
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
        sessionNames.remove(session);
        clearSessionList();
    }

//    얘는 또 뭐지
    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
