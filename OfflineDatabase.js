// node-persist will be used for easy data persistence offline
const storage = require('node-persist');
const uuid = require('uuid/v4');

module.exports = class OfflineDatabase {
    constructor(path) {
        this.dir = path;
        this.path = path;
        this.init();
    }

    // node-persist default set up
    async init(dir) {
        await storage.init({
            dir: `relative/path/to/persist/${dir}`,
            stringify: JSON.stringify,
            parse: JSON.parse,
            encoding: 'utf8',
            logging: false, // can also be custom logging function
            ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
            expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
            // in some cases, you (or some other service) might add non-valid storage files to your
            // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
            forgiveParseErrors: false,
        });
    }

    // Wrapping each functions with async, and await them.
    // This allows us to keep the functions asynchronous.
    async ref(path) {
        if (path) {
            const paths = path.split('/');
            this.dir = paths[0];
            this.path = path;
            await this.init(this.dir);
        }

        return this;
    }

    async push(obj) {
        const id = uuid();
        try {
            await this.init(this.dir);
            await storage.setItem(id, obj);
        } catch (error) {
            console.log(error);
        }
        return id;
    }

    async once(cb) {
        await this.init(this.dir);
        const res = await storage.getItem(key);
        cb(res);
    }  
};
