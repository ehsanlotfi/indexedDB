#  CURD of indexedDB
### set dataBase name
    var db = new indexDB("myDB");
### create new table
    db.CreateTable("product", "id");
### insert and update command
    db.set({ id: 1, name: "milad" }, "product");
### get data
    db.get(1, "product");
### remove data
    db.remove(1, "product");

