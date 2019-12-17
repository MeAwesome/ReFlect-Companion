const express = require("express");
const os = require("os");
const fs = require("fs");
const app = express();
const serv = require("http").Server(app);
const io = require("socket.io")(serv,{});
const chalk = require("chalk");
const port = 51000;

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});
app.use("/", express.static(__dirname + "/"));

const __ConnectTo__ = os.networkInterfaces()["Wi-Fi"][1].address + ":" + port;

serv.listen(port);
console.clear();
Log("> ReFlect Started" +
		"\n\t|> " + __ConnectTo__
, "greenBright");

const Sockets = {};

io.on("connection", (socket) => {
	socket.id = Math.random();
	Sockets[socket.id] = socket;
	Log("> New Device Connection" +
			"\n\t|-ip: " + socket.request.connection.remoteAddress.replace("::ffff:", "")
	, "greenBright");

	socket.on("CONNECT_TO_ROOM", (room) => {
		Sockets[socket.id].room = room;
		Log("Room: " + room);
		Sockets[socket.id].emit("CONNECTED_TO_ROOM", room);
	});

	socket.on("CONNECT_AS", (name) => {
		Sockets[socket.id].name = name;
		Log("Name: " + name);
		Sockets[socket.id].emit("CONNECTED_AS", name);
	});

});

function Log(message, color){
	if(color == undefined){
		color = "white";
	}
	console.log(chalk[color](message));
}
