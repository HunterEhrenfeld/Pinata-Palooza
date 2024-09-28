package hack.midwest.entity;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "person")
public class PersonEntity extends PanacheMongoEntity {
    public String name;
    public String imageUrl;
    public String type;
}
