import Parse from '../parsemi';
import { User } from '../parsemi';

import config from '../../config/front.js';

const SDK_URL = config.sdkURL || "http://localhost:3000";
const APP_ID = config.appId || "IQGR3JRHIFLST86A";

const COLLECTION_NAME = "Sender";
const LIMIT = 5;

const Fetching = {
    url: (path) => {
        return SDK_URL + path;
    },
    option: (method = 'GET', body) => {
        const session = User.current()?.get('sessionToken');
        return {
            method,
            body,
            headers: {
                'X-Parse-Application-Id': APP_ID,
                'X-Parse-Session-Token': session
            },
        }
    }
};

const Sender = {
    get: () => {
        const query = new Parse.Query(COLLECTION_NAME);
        query.select("name", "number", "state", "qrCode");
        query.equalTo("instance", User.instance());
        query.limit(LIMIT);
        return query.find();
    },
    create(obj) {
        const SenderClass = Parse.Object.extend(COLLECTION_NAME);
        const sender = new SenderClass();
        obj.instance = User.instance();
        return sender.save(obj);
    },
    update(objId, name, number) {
        const sender = new Parse.Object(COLLECTION_NAME);
        sender.id = objId;
        sender.set('name', name);
        sender.set('number', number);
        return sender.save();
    },
    updateState(objectId, state) {
        const sender = new Parse.Object(COLLECTION_NAME);
        sender.id = objectId;
        sender.set('state', state);
        return sender.save();
    },
    remove(objId) {
        const sender = new Parse.Object(COLLECTION_NAME);
        sender.id = objId;
        return sender.destroy();
    },
    subscribe() {
        let query = new Parse.Query(COLLECTION_NAME);
        query.select("name", "number", "state", "qrCode");
        query.equalTo("instance", User.instance());
        return query.subscribe();
    },
    initialize(objectId) {
        const path = "/initialize/" + objectId;
        return fetch(Fetching.url(path), Fetching.option());
    },
    state(objectId) {
        const path = "/state/" + objectId;
        return fetch(Fetching.url(path), Fetching.option());
    }
}

export default Sender;