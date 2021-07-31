import Parse from '../parsemi';
import { User } from '../parsemi';

const LIMIT = 5;

const Dashboard = {
   
    
    get: (limit = 5) => {
        const query = new Parse.Query('Message');
        query.select("body", "from", "to", "ack", "isReplied");
        // query.equalTo("instance", User.instance());
        query.limit(limit);
        return query.find();
      },
      
    getSent: (startDate, endDate, lmt) => {
        const query = new Parse.Query("Message");
        query.select("body", "from", "to", "ack", "isReplied");
        query.equalTo("instance", User.instance());
        query.greaterThan("ack", 0);
        query.greaterThanOrEqualTo("createdAt", startDate);
        query.lessThan("createdAt", endDate);
        query.limit(lmt ? lmt : LIMIT);
        query.descending("UpdatedAt"); // ascending
        query.withCount();
        return query.find();
    },
    getDelivery: (startDate, endDate) => {
        const query = new Parse.Query("Message");
        query.select("body", "from", "to");
        query.equalTo("instance", User.instance());
        query.greaterThan("ack", 1);
        query.greaterThanOrEqualTo("createdAt", startDate);
        query.lessThan("createdAt", endDate);
        query.limit(LIMIT);
        query.descending("UpdatedAt"); // ascending
        query.withCount();
        return query.find();
    },
    getAnswered: (startDate, endDate) => {
        const query = new Parse.Query("Message");
        query.select("body", "from", "to");
        query.equalTo("instance", User.instance());
        query.equalTo("isReplied", true);
        query.greaterThanOrEqualTo("createdAt", startDate);
        query.lessThan("createdAt", endDate);
        query.limit(LIMIT);
        query.descending("UpdatedAt");
        query.withCount();
        return query.find();
    },
    getUnAnswered: (startDate, endDate) => {
        const query = new Parse.Query("Message");
        query.select("body", "from", "to");
        query.equalTo("instance", User.instance());
        query.equalTo("isReplied", false);
        query.greaterThanOrEqualTo("createdAt", startDate);
        query.lessThan("createdAt", endDate);
        query.limit(LIMIT);
        query.ascending("UpdatedAt");
        query.withCount();
        return query.find();
    },
    getBroadcast: (startDate, endDate) => {
        const query = new Parse.Query("Broadcast");
        query.select("receiveCount");
        query.equalTo("instance", User.instance());
        query.greaterThanOrEqualTo("createdAt", startDate);
        query.lessThan("createdAt", endDate);
        query.ascending("UpdatedAt");
        return query.find();
    },
    subscribe() {
        let query = new Parse.Query('Message');
        query.select("body", "from", "to");
        query.equalTo("instance", User.instance());
        return query.subscribe();
    }
}

export default Dashboard;