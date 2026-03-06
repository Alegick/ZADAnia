console.log("Node.js работает в Docker!");
const http = require("http");
const server = http.createServer((req, res) => {
  res.end("<h1>Hello from Node.js in Docker!</h1>");
});
server.listen(3000, () => console.log("Сервер запущен: http://localhost:3000"));