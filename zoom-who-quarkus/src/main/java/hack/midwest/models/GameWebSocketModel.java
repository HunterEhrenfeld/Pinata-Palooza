package hack.midwest.models;

import hack.midwest.entity.PersonEntity;
import lombok.Data;

import java.util.List;

@Data
public class GameWebSocketModel {
    Boolean yourTurn;
    Boolean isReady;
    List<PersonEntity> personList;
    PersonEntity yourPerson;
    String messageType;
}
