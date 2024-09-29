package hack.midwest.websockets;

import hack.midwest.entity.PersonEntity;
import hack.midwest.models.GameWebSocketModel;
import hack.midwest.service.PersonService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
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

    private Map<String, Set<Session>> gameList = new ConcurrentHashMap<>();
    private Map<String, Session> playerTurn = new ConcurrentHashMap<>();
    private Map<String, List<PersonEntity>> gamePersons = new ConcurrentHashMap<>();
    private Map<Session, PersonEntity> selectedCharacter = new HashMap<>();

    @Inject
    PersonService personService;

    @OnOpen
    public void onOpen(Session session, @PathParam("gameId") String lobbyId) {
        System.out.println("here");
        gameList.putIfAbsent(lobbyId, new HashSet<>());
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
        Boolean yourTurn = session.equals(playerTurn.get(lobbyId));
        GameWebSocketModel payload = new GameWebSocketModel();
        payload.setPersonList(gameCharacters);
        payload.setYourPerson(personEntity);
        payload.setYourTurn(yourTurn);
        payload.setIsReady(gameSessions.size() == 2);
        payload.setMessageType("init");
        initBroadcast(payload, gameSessions);
    }

//    @OnClose
//    public void onClose(Session session) {
//        sessions.remove(session);
//        playerSessions.values().remove(session);
//        broadcast("A player has left the game.");
//    }
//
//    @OnMessage
//    public void onMessage(String message, Session session) {
//        handleGameLogic(message, session);
//    }
//
//    private void broadcast(String message) {
//        for (Session session : sessions) {
//            session.getAsyncRemote().sendText(message);
//        }
//    }

    private void initBroadcast(GameWebSocketModel payload, Set<Session> sessions) {
        for (Session session : sessions) {
            session.getAsyncRemote().sendObject(payload);
        }
    }

//    private void handleGameLogic(String message, Session session) {
//        try {
//            // Parse message from JSON to extract the type and content
//            Map<String, Object> messageMap = new ObjectMapper().readValue(message, Map.class);
//            String type = (String) messageMap.get("type");
//
//            if (type.equals("askQuestion")) {
//                String question = (String) messageMap.get("question");
//                handleQuestion(question, session);
//            } else if (type.equals("guessCharacter")) {
//                String guess = (String) messageMap.get("guess");
//                handleGuess(guess, session);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
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
