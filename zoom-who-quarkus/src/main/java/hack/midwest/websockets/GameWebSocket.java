package hack.midwest.websockets;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import hack.midwest.entity.PersonEntity;
import hack.midwest.models.GameWebSocketModel;
import hack.midwest.service.PersonService;
import io.vertx.core.impl.ConcurrentHashSet;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import jakarta.ws.rs.QueryParam;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.stream.Collectors;

@ApplicationScoped
@ServerEndpoint("/game/{gameId}")
public class GameWebSocket {

//    private static final Set<Session> sessions = new CopyOnWriteArraySet<>();

    // Game data: set of characters and game state
//    private Map<String, Map<String, String>> characterAttributes = new HashMap<>(); // Store character attributes
//    private Map<String, Session> playerSessions = new LinkedHashMap<>(); // Map player IDs to sessions
//    private Map<Session, String> playerGuesses = new HashMap<>(); // Player guesses
//    private Map<String, Session> currentPlayer = new HashMap<>(); // Track whose turn it is
//    private Map<Session, String> selectedCharacter = new HashMap<>(); // The character to guess

    ObjectMapper objectMapper = new ObjectMapper();
    private Map<String, ConcurrentHashSet<Session>> gameList = new ConcurrentHashMap<>();
    private Map<String, Session> playerTurn = new ConcurrentHashMap<>();
    private Map<String, List<PersonEntity>> gamePersons = new ConcurrentHashMap<>();
    private Map<Session, PersonEntity> selectedCharacter = new ConcurrentHashMap<>();

    @Inject
    PersonService personService;

    @OnOpen
    public void onOpen(Session session, @PathParam("gameId") String lobbyId) throws JsonProcessingException {
        System.out.println("here");
        gameList.putIfAbsent(lobbyId, new ConcurrentHashSet<>());
        Set<Session> gameSessions = gameList.get(lobbyId);
        if (gameSessions.isEmpty()) {
            playerTurn.put(lobbyId, session);
            gamePersons.put(lobbyId, personService.getBoard(null));
        }
        gameSessions.add(session);
        //Fetch characters and pick out random character to be your selected character
        List<PersonEntity> gameCharacters = gamePersons.get(lobbyId);
        PersonEntity personEntity = gameCharacters.get((int) Math.floor(Math.random() * 24));
        selectedCharacter.put(session, personEntity);
        GameWebSocketModel payload = new GameWebSocketModel();
        payload.setPersonList(gameCharacters);
        payload.setYourPerson(personEntity);
        payload.setIsReady(gameSessions.size() == 2);
        payload.setMessageType("init");
        initBroadcast(payload, gameSessions, lobbyId);
    }

//    @OnClose
//    public void onClose(Session session) {
//        sessions.remove(session);
//        playerSessions.values().remove(session);
//        broadcast("A player has left the game.");
//    }
//
    @OnMessage
    public void onMessage(String message, Session session) throws JsonProcessingException {
        System.out.println(message);
        JsonObject jsonPayload = objectMapper.convertValue(message, JsonObject.class);
        GameWebSocketModel payload = new GameWebSocketModel();
        payload.setQuestion(jsonPayload.getString("question"));
        payload.setLobbyId(jsonPayload.getString("lobbyId"));
        payload.setMessageType(jsonPayload.getString("messageType"));
        System.out.println("Message: " + objectMapper.writeValueAsString(payload));
        handleGameLogic(payload, session);
    }
//
//    private void broadcast(String message) {
//        for (Session session : sessions) {
//            session.getAsyncRemote().sendText(message);
//        }
//    }

    private void initBroadcast(GameWebSocketModel payload, Set<Session> sessions, String lobbyId) throws JsonProcessingException {
        for (Session session : sessions) {
            Boolean yourTurn = session.equals(playerTurn.get(lobbyId));
            payload.setYourTurn(yourTurn);
            session.getAsyncRemote().sendText(objectMapper.writeValueAsString(payload));
        }
    }

    private void handleGameLogic(GameWebSocketModel payload, Session session) throws JsonProcessingException {
        Set<Session> sessionList = gameList.get(payload.getLobbyId());
        Session userSession = sessionList.stream().filter(session1 -> session1.equals(session)).findFirst().get();
        Session opponentSession = sessionList.stream().filter(session1 -> !session1.equals(session)).findFirst().get();
        if (payload.getMessageType().equals("question")) {
            GameWebSocketModel opponentPayload = new GameWebSocketModel();
            opponentPayload.setQuestion(payload.getQuestion());
            opponentPayload.setIsReady(true);
            opponentPayload.setYourTurn(true);
            opponentPayload.setMessageType("question");
            opponentSession.getAsyncRemote().sendText(objectMapper.writeValueAsString(opponentPayload));
            GameWebSocketModel userPayload = new GameWebSocketModel();
            userPayload.setQuestion(payload.getQuestion());
            userPayload.setIsReady(true);
            userPayload.setYourTurn(false);
            userPayload.setMessageType("question");
            userSession.getAsyncRemote().sendText(objectMapper.writeValueAsString(userPayload));
        }
    }
//
//    private void handleQuestion(String question, Session session) {
//        if (!playerSessions.get(currentPlayer).equals(session)) {
//            session.getAsyncRemote().sendText("It's not your turn!");
//            return;
//        }
//
//        // Example question: "Does the character wear glasses?"
//        String[] parts = question.split(" ");
//        String attribute = parts[2]; // e.g., "glasses"
//        String response = "no"; // Default response
//
//        // Check if the selected character has the specified attribute
//        if (characterAttributes.get(selectedCharacter).get(attribute).equals("yes")) {
//            response = "yes";
//        }
//
//        broadcast(currentPlayer + " asked: " + question + ". Answer: " + response);
//
//        // Move to the next player's turn
//        moveToNextPlayer();
//    }
//
//    private void handleGuess(String guess, Session session) {
//        if (!playerSessions.get(currentPlayer).equals(session)) {
//            session.getAsyncRemote().sendText("It's not your turn!");
//            return;
//        }
//
//        if (guess.equalsIgnoreCase(selectedCharacter)) {
//            broadcast(currentPlayer + " guessed the character correctly! The character was " + selectedCharacter + ".");
//            resetGame();
//        } else {
//            broadcast(currentPlayer + " guessed " + guess + " and was incorrect.");
//            moveToNextPlayer();
//        }
//    }
//
//    private void moveToNextPlayer() {
//        List<String> playerKeys = new ArrayList<>(playerSessions.keySet());
//        int currentPlayerIndex = playerKeys.indexOf(currentPlayer);
//        currentPlayer = playerKeys.get((currentPlayerIndex + 1) % playerKeys.size());
//        broadcast("It's now " + currentPlayer + "'s turn.");
//    }
//
//    private void resetGame() {
//        // Reset the game or start a new round
//        selectedCharacter = "John"; // Pick a new character randomly
//        broadcast("A new round begins! Guess the new character.");
//    }
}
