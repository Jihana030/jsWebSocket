package com.jihana.jswebsocket.domain;

import lombok.Getter;
import lombok.Setter;

public class Message {
    @Getter
    @Setter
    private String code;

    @Getter
    @Setter
    private String sender;

    @Getter
    @Setter
    private String receiver;

    @Getter
    @Setter
    private String content;

    @Getter
    @Setter
    private String regdate;

    @Override
    public String toString() {
        return "Message [code=" + code + ", sender=" + sender + ", receiver=" + receiver + ", content=" + content
                + ", regdate=" + regdate + "]";
    }
}
