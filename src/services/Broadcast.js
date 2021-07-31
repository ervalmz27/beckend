import Parse from '../parsemi';
import {Datemi, User} from '../parsemi';

const LIMIT = 5;


const Broadcast = {
    save: (obj) => {
        const BroadcastClass = Parse.Object.extend("Broadcast");
        const broadcast = new BroadcastClass();
        obj.instance = User.instance();
        return broadcast.save(obj);
    },
    remove(objId) {
        const contact = new Parse.Object("Broadcast");
        contact.id = objId;
        return contact.destroy();
    },
    getTitle: (limit) => {
        const query = new Parse.Query("Broadcast");
        query.select("title", "message", "hashtag", "labels");
        // query.equalTo("instance", User.instance());
        query.limit(limit ? limit : LIMI);
        return query.find();
    },
    get: (startDate, endDate, limit) => {
        const query = new Parse.Query("Broadcast");
        query.select("receiveCount", "hashtag", "title", "message", "labels");
        query.equalTo("instance", User.instance());
        query.greaterThanOrEqualTo("createdAt", startDate);
        query.lessThan("createdAt", endDate);
        query.limit(limit ? limit : LIMIT);
        query.ascending("UpdatedAt");
        return query.find();
    },
    message: (startDate, endDate, limit, hashtag) => {
        const query = new Parse.Query("Message");
        query.select("to", "ack", "isReplied");
        query.equalTo("hashtag", hashtag);
        query.equalTo("instance", User.instance());
        query.greaterThanOrEqualTo("createdAt", startDate);
        query.lessThan("createdAt", endDate);
        query.limit(limit ? limit : LIMIT);
        query.descending("ack");
        return query.find();
    },
    checkHashtag: (hashtag) => {
        const startDate = Datemi.todayFirst();
        const endDate = Datemi.todayLast();
        const query = new Parse.Query("Broadcast");
        query.select("receiveCount", "hashtag", "title", "message", "labels");
        query.equalTo("instance", User.instance());
        query.greaterThanOrEqualTo("createdAt", startDate);
        query.lessThan("createdAt", endDate);
        query.equalTo('hashtag', hashtag);
        return query.first();
    }
}

export default Broadcast;