var app = require('app'); 
var robot = require('robotjs');
var irc = require("tmi.js");
var options = {
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
};

var client = new irc.client(options);



var BrowserWindow = require('browser-window');  
var mainWindow = null;
app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});
var maxWidth = 800;
var maxHeight = 626;
var movement = 200;
var movementTimer; 
var start = 0;
var current = {x:maxWidth/2,y:maxHeight/2};


var search = function(radius,angle){
	if (!start) return;
	if (current.y > 550||current.y < 30 || current.x > 700 || current.x < 15){
		angle = 0;
		radius = 0;
		current = {x:maxWidth/2,y:maxHeight/2};
	}
	if (angle == 360)
		angle = 0;
	robot.moveMouse(current.x,current.y);
	var mouse = robot.getMousePos();
	var color = robot.getPixelColor(mouse.x,mouse.y);
	var y = current.y;
	var x = current.x;
	if (color =='ffffff'){
		robot.mouseClick();
		robot.mouseToggle("down");
		setTimeout(function(){
			robot.mouseToggle("up");
			search(radius,angle);
		},1000);
		
	}else if(color == '6b393a'||color == '734542'){
		robot.mouseToggle("up");
		robot.mouseToggle("down");
		robot.mouseClick();
		setTimeout(function(){
			search(radius,angle);
		},1);
	}else{
		current.x = current.x + radius*Math.cos(angle);
		current.y = current.y - radius*Math.sin(angle);
		
		setTimeout(function(){
			search(++radius,++angle);
		},1);
	}
};

var go = function(x,y){
	if (start != 0){
		start = 0;
		var started = 1;
	}
	robot.moveMouse(x,y);
	robot.mouseToggle("down");
	movementTimer = setTimeout(function(){
		robot.mouseToggle("up");
		if (started == 1){
			start = 1;
		}
		started = 0;
		search(0,0);
	},3000);
};
app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 800, height: 600});
	mainWindow.loadUrl('file://' + __dirname + '/index.html');
	var globalShortcut = require('global-shortcut');
	var rets = globalShortcut.register('alt+g', function() { 
		robot.mouseClick();
		console.log('ctrl + g triggered');
		start = 1;
		search(0,0);
	});
	var rete = globalShortcut.register('alt+e', function() { 
		console.log('ctrl + e triggered');
		start =0;
		clearTimeout(movementTimer);
	});
	var w = globalShortcut.register('alt+w',function(){
		go(maxWidth/2,maxHeight/2-movement);
	});
	var a = globalShortcut.register('alt+a',function(){
		go(maxWidth/2-movement,maxHeight/2);
	});
	var s = globalShortcut.register('alt+s',function(){
		go(maxWidth/2,maxHeight/2+movement);
	});
	var d = globalShortcut.register('alt+d',function(){
		go(maxWidth/2+movement,maxHeight/2);
	});
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
	client.on("chat", function (channel, user, message, self) {
		console.log(user['display-name'],message);
		if (message == 'up'){
			go(maxWidth/2,maxHeight/2-movement);
		}else if(message == 'left'){
			go(maxWidth/2-movement,maxHeight/2);
		}else if(message == 'right'){
			go(maxWidth/2,maxHeight/2+movement);
		}else if(message == 'down'){
			go(maxWidth/2+movement,maxHeight/2);
		}else if (message == 'attack'){
			robot.mouseClick();
			console.log('ctrl + g triggered');
			start = 1;
			search(0,0);
		}else if (message == 'standdown'){
			start =0;
			clearTimeout(movementTimer);
		}
	});
	client.connect();

});
