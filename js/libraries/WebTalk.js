var WebTalk = {
	DEBUG:true,
	socket:null,
	socketData:{
		connected:null,
		connectedToRoom:"global",
		connectedAs:"user",
		helpers:{
			roomChanged:false,
			nameChanged:false,
			receivedFile:false,
			receivedFileData:null
		}
	},
	getCallback:function(file, callback){
		var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function(){
			if (rawFile.readyState == 4 && rawFile.status == "200"){
				callback(rawFile.responseText);
			}
    }
    rawFile.send(null);
	},
	getPromise:function(file){
		return new Promise((resolve) => {
			var rawFile = new XMLHttpRequest();
	    rawFile.open("GET", file, true);
	    rawFile.onreadystatechange = function(){
				if (rawFile.readyState == 4 && rawFile.status == "200"){
					resolve(rawFile.responseText);
				}
	    }
	    rawFile.send(null);
		});
	},
	loadImage:function(key, src){
		return new Promise((resolve, reject) => {
			var image = new Image();
			image.src = src;
			image.onload = function(){
				if(typeof(Log) != undefined && WebTalk.DEBUG == true){
					Log.debugLog("Loaded Image '" + key + "' from '" + src + "'");
				}
				if(typeof(Loaded) != undefined && WebTalk.DEBUG == true){
					Loaded.setImage(key, image);
				}
				resolve(image);
			}
			image.onerror = function(){
				reject("Image Could Not Be Obtained");
			}
		});
	},
	loadScript:function(src){
		return new Promise((resolve, reject) =>{
			var file = document.createElement("script");
			file.setAttribute("src", src);
			document.getElementsByTagName("body")[0].appendChild(file);
			file.onload = function(){
				resolve(200);
			}
			file.onerror = function(err){
				reject(err);
			}
		});
	},
	createConnection:async function(){
		WebTalk.socket = await io.connect();
		await WebTalk.bindSocketOnEvents();
		await WebTalk.connectTo(WebTalk.socketData.connectedToRoom);
		await WebTalk.connectAs(WebTalk.socketData.connectedAs);
	},
	connectAs:function(name){
		WebTalk.socket.emit("CONNECT_AS", name);
		return new Promise((resolve) => {
			whenNotEquals("WebTalk.socketData.helpers.nameChanged", "false", () => {
				WebTalk.socketData.helpers.nameChanged = false;
				resolve(200);
			});
		});
	},
	connectTo:function(room){
		WebTalk.socket.emit("CONNECT_TO_ROOM", room);
		return new Promise((resolve) => {
			whenNotEquals("WebTalk.socketData.helpers.roomChanged", "false", () => {
				WebTalk.socketData.helpers.roomChanged = false;
				resolve(200);
			});
		});
	},
	requestFileFromServer:function(file){
		WebTalk.socket.emit("REQUEST_FILE", file);
		return new Promise((resolve) => {
			whenNotEquals("WebTalk.socketData.helpers.receivedFile", "false", () => {
				WebTalk.socketData.helpers.receivedFile = false;
				var data = WebTalk.socketData.helpers.receivedFileData;
				WebTalk.socketData.helpers.receivedFileData = null;
				resolve(data);
			});
		});
	},
	bindSocketOnEvents:function(){
		var soc = WebTalk.socket;
		soc.on("connect", async () => {
			if(WebTalk.socketData.connected == false){
				await WebTalk._onSocketReconnect();
			}
		});
		soc.on("disconnect", () => {
			WebTalk.socketData.connected = false;
		});
		soc.on("CONNECTED_TO_ROOM", (room) => {
			WebTalk.socketData.connectedToRoom = room;
			WebTalk.socketData.helpers.roomChanged = true;
		});
		soc.on("CONNECTED_AS", (name) => {
			WebTalk.socketData.connectedAs = name;
			WebTalk.socketData.helpers.nameChanged = true;
		});
		soc.on("REQUESTED_FILE", (file) => {
			WebTalk.socketData.helpers.receivedFileData = file;
			WebTalk.socketData.helpers.receivedFile = true;
		});
	},
	_onSocketReconnect:async function(){
		WebTalk.socketData.connected = true;
		await WebTalk.connectTo(WebTalk.socketData.connectedToRoom);
		await WebTalk.connectAs(WebTalk.socketData.connectedAs);
	}
}

function loadAudio(dir, key, callback){
	var audio = new Audio(dir);
	audio.setAttribute("id", key);
	audio.setAttribute("src", dir);
	audio.setAttribute("allow", "autoplay");
	audio.autoplay = true;
	audio.setAttribute("volume", "1.0");
	LoadedAudio[key] = audio;
	audio.oncanplaythrough = function(){
		webTalkDebugLogging("Loaded Audio (" + dir + ") as '" + key + "'");
		audio.load();
		callback();
		audio.oncanplaythrough = null;
	};
	document.getElementsByTagName("head")[0].appendChild(audio);
}

function playAudio(key, callback, onstart){
	LoadedAudio[key].play();
	LoadedAudio[key].onplay = function(){
		if(onstart){
			LoadedAudio[key].onplay = null;
			LoadedAudio[key].onended = null;
			callback();
		}
	}
	LoadedAudio[key].onended = function(){
		if(!onstart){
			LoadedAudio[key].onplay = null;
			LoadedAudio[key].onended = null;
			callback();
		}
	}
}

function loadFont(dir, callback){
	var font = document.createElement("link");
	font.setAttribute("rel", "stylesheet");
	font.setAttribute("href", dir);
	font.onload = function(){
		webTalkDebugLogging("Loaded Font (" + dir + ")");
		callback();
	};
	document.getElementsByTagName("head")[0].appendChild(font);
}
