import Parse from '../parsemi';
import { User } from '../parsemi';

const COLLECTION_NAME = "Label";

const Label = {
    get: (limit = 5) => {
        const query = new Parse.Query(COLLECTION_NAME);
        query.select("name", "desc");
        query.equalTo("instance", User.instance());
        query.limit(limit);
        return query.find();
    },
    create(obj) {
        const LabelClass = Parse.Object.extend(COLLECTION_NAME);
        const label = new LabelClass();
        obj.instance = User.instance();
        return label.save(obj);
    },
    update(objId, name, desc) {
        const label = new Parse.Object(COLLECTION_NAME);
        label.id = objId;
        label.set('name', name);
        label.set('desc', desc);
        return label.save();
    },
    remove(objId) {
        const label = new Parse.Object(COLLECTION_NAME);
        label.id = objId;
        return label.destroy();
    }
}

export default Label;