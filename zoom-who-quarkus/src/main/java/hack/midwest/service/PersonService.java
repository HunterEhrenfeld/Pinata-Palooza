package hack.midwest.service;

import hack.midwest.entity.PersonEntity;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class PersonService {
    public List<PersonEntity> getBoard(String type) {
        List<PersonEntity> personEntities = PersonEntity.listAll();
        List<PersonEntity> filteredPersons = new ArrayList<>();
        int count = 0;
        for (PersonEntity person: personEntities) {
            if (count == 24) {
                break;
            }
            if (type != null) {
                   if (person.type != null && type.equals(person.type)) {
                       filteredPersons.add(person);
                       count++;
                   }
            } else {
                filteredPersons.add(person);
                count++;
            }
        }
        return filteredPersons;
    }
}
