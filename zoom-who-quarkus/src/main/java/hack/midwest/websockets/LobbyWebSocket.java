package hack.midwest.websockets;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import jakarta.ws.rs.QueryParam;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.stream.Collectors;

@ServerEndpoint("/lobby/{lobbyId}")
@ApplicationScoped
public class LobbyWebSocket {

    private final Map<String, Set<Session>> lobbies = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("lobbyId") String lobbyId) {
        System.out.println("User connected: " + session.getId() + " to lobby: " + lobbyId);

        // Create a new lobby if it doesn't exist
        lobbies.putIfAbsent(lobbyId, new HashSet<>());

        Set<Session> lobby = lobbies.get(lobbyId);

        // Check if the lobby is full (2 players max)
        if (lobby.size() >= 2) {
            session.getAsyncRemote().sendText("error:Lobby full");
            try {
                session.close(); // Close the connection if the lobby is full
            } catch (Exception e) {
                e.printStackTrace();
            }
            return;
        }

        // Add the player to the lobby
        lobby.add(session);
        session.getUserProperties().put("lobbyId", lobbyId);

        broadcastLobby(lobbyId);
        checkForStart(lobbyId);
    }

    @OnClose
    public void onClose(Session session) {
        String lobbyId = (String) session.getUserProperties().get("lobbyId");

        if (lobbyId != null) {
            Set<Session> lobby = lobbies.get(lobbyId);
            lobby.remove(session);

            // Clean up the lobby if no one is left
            if (lobby.isEmpty()) {
                lobbies.remove(lobbyId);
            } else {
                broadcastLobby(lobbyId);
            }
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        String lobbyId = (String) session.getUserProperties().get("lobbyId");
        session.getUserProperties().put("username", message);
        broadcastLobby(lobbyId);
    }

    private void broadcastLobby(String lobbyId) {
        Set<Session> lobby = lobbies.get(lobbyId);
        if (lobby == null) return;

        String lobbyInfo = lobby.stream()
                .map(s -> (String) s.getUserProperties().getOrDefault("username", "Unknown"))
                .collect(Collectors.joining(","));

        for (Session s : lobby) {
            s.getAsyncRemote().sendText("lobby:" + lobbyInfo);
        }
    }

    private void checkForStart(String lobbyId) {
        Set<Session> lobby = lobbies.get(lobbyId);
        if (lobby.size() == 2) {
            // Notify both players that the game is starting
            for (Session s : lobby) {
                s.getAsyncRemote().sendText("start");
            }
        }
    }
}
