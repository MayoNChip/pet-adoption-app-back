const fs = require("fs");
const { nanoid } = require("nanoid");

const path = `${__dirname}/db`;

class DB {
  constructor(dbName) {
    this.dbName = dbName;
    this.dbPath = `${path}/${dbName}.json`;
  }

  //   create = () => {
  //     this.save([]);
  //     console.log(`${this.dbName} Created!`);
  //   };

  save = (data) => {
    fs.writeFileSync(this.dbPath, JSON.stringify(data));
  };

  get = () => {
    const data = fs.readFileSync(this.dbPath, "utf-8");
    return JSON.parse(data);
  };

  getById = (id) => {
    const data = this.get();
    const item = data.find((item) => item.id === id);
    return item;
  };

  add = (item) => {
    const data = this.get();
    const newId = nanoid();

    data.push({ ...item, id: newId });
    this.save(data);
    return newId;
  };

  update = (id, item) => {
    const data = this.get();
    const index = data.findIndex((i) => i.id == id);
    const curr = data[index];
    data[index] = { ...item, id: curr.id };
    this.save(data);
  };

  updateCol = (id, key, value) => {
    const data = this.get();
    const index = data.findIndex((i) => i.id == id);
    const curr = data[index];
    data[index][key] = value;
    this.save(data);
  };

  delete = (id) => {
    const data = this.get();
    const filteredData = data.filter((i) => i.id !== id);
    this.save(filteredData);
  };

  find = (query) => {
    const data = this.get();
    const user = data.find((i) => query(i));
    return user;
  };
}

module.exports = DB;
