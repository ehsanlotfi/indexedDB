class indexDB {

    constructor(db) {
        this.DBName = db;
        if (!window.indexedDB) console.error("Your browser doesn't support a stable version of IndexedDB.");
    }

    CreateTable(TBName, primeryKey) {
        let DBName = this.DBName;
        var request = indexedDB.open(DBName);
        request.onsuccess = function(e) {
            var database = e.target.result;
            var version = parseInt(database.version);
            database.close();
            if (!Object.values(database.objectStoreNames).includes(TBName)) {
                var secondRequest = indexedDB.open(DBName, version + 1);
                secondRequest.onupgradeneeded = function(e) {
                    var database = e.target.result;
                    var objectStore = database.createObjectStore(TBName, {
                        keyPath: primeryKey
                    });
                };
                secondRequest.onsuccess = function(e) {
                    e.target.result.close();
                }
            }
        }
    }

    get(primeryKey, TBName) {
        var request = indexedDB.open(this.DBName);
        request.onsuccess = function(e) {
            var database = e.target.result;
            var transaction = database.transaction([TBName]);
            var objectStore = transaction.objectStore(TBName);
            var read = objectStore.get(primeryKey);

            read.onerror = function(event) {
                console.log("Unable to retrieve daa from database!");
            };

            read.onsuccess = function(event) {
                if (read.result) {
                    return read.result;
                } else {
                    console.log("record couldn't be found in your database!");
                }
            };
            database.close();
        }
        request.onerror = event => console.error("Unable to retrieve from database!");
    }

    set(obj, TBName) {
        let DBName = this.DBName;
        let request = indexedDB.open(DBName);
        request.onsuccess = function(e) {
            var database = e.target.result;
            var add = database.transaction([TBName], "readwrite").objectStore(TBName).put(obj);
            add.onsuccess = event => console.log("1 record has been added to your database.");
            add.onerror = event => console.log("Unable to add data records");
            database.close();
        };
    }

    remove(primeryKey, TBName) {
        let DBName = this.DBName;
        let request = indexedDB.open(DBName);
        request.onsuccess = function(e) {
            var database = e.target.result;
            var remove = database.transaction([TBName], "readwrite").objectStore(TBName).delete(primeryKey);
            remove.onsuccess = event => console.log("record entry has been removed from your database.");
            database.close();
        };

    }
}

var db = new indexDB("myDB");
db.CreateTable("product", "id");
db.set({ id: 1, name: "milad" }, "product");
db.get(1, "product");
db.remove(1, "product");