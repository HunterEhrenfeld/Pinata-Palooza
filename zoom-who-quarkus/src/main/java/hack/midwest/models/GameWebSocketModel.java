package hack.midwest.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import hack.midwest.entity.PersonEntity;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GameWebSocketModel {
    Boolean yourTurn;
    Boolean isReady;
    List<PersonEntity> personList;
    PersonEntity yourPerson;
    String messageType;
    String question;
    String lobbyId;
    String answer;
}
