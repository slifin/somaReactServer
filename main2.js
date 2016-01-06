"use strict";
const electron = require('app'); 
electron.on('ready', ()=>{
	const queue = require('queue')({concurrency:1});
	queue.on('timeout',(next,job)=> next());
	// queue.add = (f)=>{ queue.push(f); queue.start(); };
	const robot = require('robotjs');
	const http = require('http');
	const fs = require('fs');
	const qs = require('querystring');
	const shortcut = require('global-shortcut');
	const browser = require('browser-window');
	const irc = require('tmi.js').client({
		options: {
			debug: true
		},
		connection: {
			random: "chat",
			reconnect: true
		},
		identity: {
			username: "mythofsomabot",
			password: "oauth:zc338shaxs09ttyhbhb3iytgv3t3sf"
		},
		channels: ["#slifin"]
	});

	const app = require('./app.js');
	const player = require('./player.js');


	const somaReact = new app(robot);
	const garry = new player(robot,queue,somaReact);

	somaReact.findGameOffset();
	shortcut.register('alt+g',()=>{
		queue.push(garry.hunt.bind(garry));
		queue.start();
	});
	shortcut.register('alt+e',()=>{
		queue.stop();
		queue.end();
	});
	shortcut.register('alt+w',()=>{
		queue.push(garry.n.bind(garry));
		queue.start();
	});
	shortcut.register('alt+d',()=>{
		queue.push(garry.e.bind(garry));
		queue.start();
	});
	shortcut.register('alt+a',()=>{
		queue.push(garry.w.bind(garry));
		queue.start();
	});
	shortcut.register('alt+s',()=>{
		queue.push(garry.s.bind(garry));
		queue.start();
	});
	shortcut.register('alt+r',()=>{
		somaReact.roamModeEnabled ^= 1;
		queue.push(garry.roam.bind(garry));
		queue.start();
	});
	shortcut.register('up+right',()=>{
		queue.push(garry.ne.bind(garry));
		queue.start();
	});
	shortcut.register('up+left',()=>{
		queue.push(garry.nw.bind(garry));
		queue.start();
	});
	shortcut.register('down+left',()=>{
		queue.push(garry.sw.bind(garry));
		queue.start();
	});
	shortcut.register('down+right',()=>{
		queue.push(garry.se.bind(garry));
		queue.start();
	});
	irc.on("chat", function (channel, user, message, self) {
		if(message.length && message[0]=='!'){
			robot.typeString(message.substr(1));
			robot.keyTap('enter');
		}
		if (message == 'n'){
			queue.push(garry.n.bind(garry));
			queue.start();
		}else if(message == 'w'){
			queue.push(garry.w.bind(garry));
			queue.start();
		}else if(message == 'e'){
			queue.push(garry.e.bind(garry));
			queue.start();
		}else if(message == 's'){
			queue.push(garry.s.bind(garry));
			queue.start();
		}else if(message == 'ne'){
			queue.push(garry.ne.bind(garry));
			queue.start();
		}else if(message == 'nw'){
			queue.push(garry.nw.bind(garry));
			queue.start();
		}else if(message == 'se'){
			queue.push(garry.se.bind(garry));
			queue.start();
		}else if(message == 'sw'){
			queue.push(garry.sw.bind(garry));
			queue.start();
		}else if (message == 'attack'){
			queue.push(garry.hunt.bind(garry));
			queue.start();
		}else if (message == 'roam'){
			somaReact.roamModeEnabled ^= 1;
			queue.push(garry.roam.bind(garry));
			queue.start();
		}
	});
	queue.on('success', (result, job)=> {
		if (somaReact.roamModeEnabled){
			queue.push(garry.roam.bind(garry));
			queue.start();
		}
	});
	irc.connect();
	
	http.createServer(function (request, response) {
		if (request.url == '/' && request.method == 'POST'){
			let body='';
			request.on('data', function (data) {
				body +=data;
			});
			request.on('end',function(){
				const POST = body;
				response.writeHead(200,{
					'Access-Control-Allow-Origin':'http://www.twitch.tv',
					'Access-Control-Allow-Methods':'POST',
					'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
				});
				response.end('', 'utf-8');
				var data = qs.parse(POST);
				console.log(data);
				somaReact.click(data.x,data.y);
			});
		}
		if (request.url.substr(0,9) == '/index.js'){
			fs.readFile('./client/index.js',function(err,content){
				response.writeHead(200, {'Content-Type': 'application/javascript'});
				response.end(content, 'utf-8');
			});
		}

	}).listen(8080);
});

