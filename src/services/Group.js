import Parse from '../parsemi';
import { User } from '../parsemi';

const COLLECTION_NAME = "Group";

const Group = {
    get: (lmt = 5) => {
        const query = new Parse.Query(COLLECTION_NAME);
        query.select("name", "desc");
        query.equalTo("instance", User.instance());
        query.limit(lmt);
        return query.find();
    },
    getMembers: (objId) => {
        const query = new Parse.Query(COLLECTION_NAME);
        query.select("members");
        query.equalTo("instance", User.instance());
        query.equalTo("objectId", objId);
        query.include("members");
        return query.first();
    },
    create(obj) {
        const ParseClass = Parse.Object.extend(COLLECTION_NAME);
        const pc = new ParseClass();
        obj.instance = User.instance();
        return pc.save(obj);
    },
    update(objId, name, number) {
        const po = new Parse.Object(COLLECTION_NAME);
        po.id = objId;
        po.set('name', name);
        po.set('desc', number + '');
        return po.save();
    },
    remove(objId) {
        const po = new Parse.Object(COLLECTION_NAME);
        po.id = objId;
        return po.destroy();
    }
}

export default Group;