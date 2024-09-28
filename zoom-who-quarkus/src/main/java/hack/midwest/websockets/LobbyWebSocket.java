package hack.midwest.websockets;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.server.ServerEndpoint;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.stream.Collectors;

@ServerEndpoint("/lobby")
@ApplicationScoped
public class LobbyWebSocket {

    private Set<Session> sessions = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("User connected: " + session.getId());
        sessions.add(session);
        broadcastLobby();
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("User disconnected: " + session.getId());
        sessions.remove(session);
        broadcastLobby();
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        session.getUserProperties().put("username", message);
        broadcastLobby();
    }

    private void broadcastLobby() {
        String lobby = sessions.stream()
                .map(s -> (String) s.getUserProperties().getOrDefault("username", ""))
                .collect(Collectors.joining(","));

        sessions.forEach(s -> {
            s.getAsyncRemote().sendText(lobby);
        });
    }
}
