package hack.midwest.service;

import hack.midwest.dtos.PersonDto;
import hack.midwest.entity.PersonEntity;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

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

    @Transactional
    public List<PersonDto> createPersons(List<PersonDto> persons) {
        return persons.stream()
                .map(this::createPersonEntityFromDto)
                .map(this::convertEntityToDto)
                .toList();
    }

    private PersonEntity createPersonEntityFromDto(PersonDto personDto) {
        PersonEntity personEntity = new PersonEntity();
        personEntity.name = personDto.getName();
        personEntity.cid = personDto.getCid();
        personEntity.persist();
        return personEntity;
    }

    private PersonDto convertEntityToDto(PersonEntity personEntity) {
        PersonDto personDto = new PersonDto();
        personDto.setCid(personEntity.cid);
        personDto.setName(personEntity.name);
        Log.infov("created person: {0}", personDto);
        return personDto;
    }
}
