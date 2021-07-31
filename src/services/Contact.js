import Parse from '../parsemi';
import { User } from '../parsemi';

const COLLECTION_NAME = "Contact";
const LIMIT = 5;

const Contact = {
    get: (lmt = LIMIT) => {
        const query = new Parse.Query(COLLECTION_NAME);
        query.select("name", "number", "gender", "city");
        query.equalTo("instance", User.instance());
        query.limit(lmt);
        return query.find();
    },
    // getByNumber: (objectId, num) => {
    //     const path = "/contact/" + objectId + "/" + num;
    //     return fetch(Fetching.url(path), Fetching.option());
    // },
    create(obj) {
        const ContactClass = Parse.Object.extend(COLLECTION_NAME);
        const contact = new ContactClass();
        // bypass number type and uid
        obj.number = obj.number + '';
        obj.uid = '62' + obj.number + '@c.us';
        obj.instance = User.instance();
        return contact.save(obj);
    },
    update(objId, name, number) {
        const contact = new Parse.Object(COLLECTION_NAME);
        contact.id = objId;
        contact.set('name', name);
        contact.set('number', number + '');
        contact.set('uid', '62' + number + '@c.us');
        return contact.save();
    },
    remove(objId) {
        const contact = new Parse.Object(COLLECTION_NAME);
        contact.id = objId;
        return contact.destroy();
    }
}

export default Contact;