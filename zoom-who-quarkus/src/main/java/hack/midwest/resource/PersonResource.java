package hack.midwest.resource;

import hack.midwest.dtos.PersonDto;
import hack.midwest.entity.PersonEntity;
import hack.midwest.service.PersonService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.ArrayList;
import java.util.List;

@Path("/persons")
@Consumes({MediaType.APPLICATION_JSON})
@Produces({MediaType.APPLICATION_JSON})
public class PersonResource {

    @Inject
    PersonService personService;

    @GET
    public List<PersonEntity> getAll() {
        return PersonEntity.listAll();
    }

    @GET
    @Path("/board")
    public List<PersonEntity> getBoard() {
        List<PersonEntity> filteredList = personService.getBoard(null);
        //Can delete all of this logic when data is valid
        List<PersonEntity> duplicatedList = new ArrayList<>();
        while (duplicatedList.size() < 24) {
            for (PersonEntity element : filteredList) {
                if (duplicatedList.size() < 24) {
                    duplicatedList.add(element);
                } else {
                    break; // Break the loop if we reach 24 elements
                }
            }
        }
        return duplicatedList;
    }

    @POST
    public List<PersonDto> createPersons(List<PersonDto> persons) {
        return personService.createPersons(persons);
    }
}
