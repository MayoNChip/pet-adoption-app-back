const http = require("http");
const DB = require("./db");

http
  .createServer((req, res) => {
    const users = new DB("users");
    if (req.url === "/getUsers") {
      res.write(JSON.stringify(users.get()));
      res.end();
    } else {
      res.write("I dont know what do to");
      res.end();
    }
  })
  .listen(4000, () => {
    console.log(`Server is listening on 4000`);
  });
