"use strict";
class Player{
	constructor(robot, queue, app){
		this.queue = queue;
		this.robot = robot;
		this.app = app;
		this.travelOffset = 200;
	}
	hunt(cb){
		const robot = this.robot;
		const app = this.app;
		const center = app.center(app.yoffset);
		const yoffset = app.yoffset;
		
		console.log('hunting');
		setImmediate(()=>{
		this.isAttackMode(robot,app);
		this.setAttack(robot,app);
			
		});
		robot.moveMouse(center.x,center.y);
		let pos = robot.getMousePos();
		let x = center.x;
		let y = center.y;
		let angle = 0;
		let radius = 0;
		let color = '';
		robot.mouseClick();
		this.targetFound = 0;

		const recursiveHunt = (app,robot,x,y,radius,angle,color,yoffset,center)=>{
			robot.moveMouse(x,y);
			color = robot.getPixelColor(x,y);
			if (color == 'ffffff')
				this.attack(robot,x,y);
			else if(color == '734542')
				this.loot(robot,x,y);
			x += radius*Math.cos(angle);
			y += radius*Math.sin(angle);
			radius++;
			angle++;
			if (y < (600 + yoffset) && x < 800 && x > 0 && y > (yoffset)){
				setImmediate(recursiveHunt.bind(recursiveHunt),app,robot,x,y,radius,angle,'',yoffset,center);
			}else{
				robot.moveMouse(center.x,center.y);
				robot.mouseToggle("up");
				cb();
			}
		}
		recursiveHunt(app,robot,x,y,radius,angle,color,yoffset,center);

	}
	isAttackMode(robot,app){
		let color = robot.getPixelColor(783,323+app.yoffset);
		this.inAttackMode = (color =='bdebf7')?true:false;
		return this.inAttackMode;
	}
	setAttack(robot,app){
		if(!this.isAttackMode(robot,app)){
			robot.keyTap("tab");
		}
	}
	setPassive(robot,app){
		if(this.isAttackMode(robot,app))
			robot.keyTap("tab");
	}
	attack(robot,x,y){
		let color;
		do{ robot.mouseToggle('down'); color = robot.getPixelColor(x,y); this.targetFound = 1; }
		while (color == 'ffffff')
			//
		robot.mouseToggle('up');
	}
	loot(robot,x,y){
		let color;
		do{ robot.mouseToggle('down'); color = robot.getPixelColor(x,y); }
		while (color == '734542')
			//
		robot.mouseToggle('up');
	} 
	roam(cb){
		const robot = this.robot;
		const app = this.app;
		const actions = [
		this.n,
		this.e,
		this.s,
		this.w,
		this.ne,
		this.nw,
		this.se,
		this.sw,
		this.hunt];
		const min = 0;
		const max = actions.length-1;

		let rand = Math.floor(Math.random() * (max - min + 1)) + min;
		if (this.targetFound)
			this.hunt(cb);
		else{
			if (rand <8){
				console.log('movement');
				this.setPassive(robot,app);
			}
			actions[rand].call(this,cb);
		}
	}

	move(cb,xy){
		const robot = this.robot;
		const center = this.app.center(this.app.yoffset);
		robot.moveMouse(
			center.x+xy.x,
			center.y+xy.y);
		robot.mouseToggle('down');
		robot.mouseToggle('up');
		robot.moveMouse(center.x,center.y);
		setTimeout(cb,1000);
	}
	n(cb){
		this.move(cb,{x:0,y:-this.travelOffset});
	}
	e(cb){
		this.move(cb,{x:this.travelOffset,y:0});
	}
	s(cb){
		this.move(cb,{x:0,y:this.travelOffset});
	}
	w(cb){
		this.move(cb,{x:-this.travelOffset,y:0});
	}
	ne(cb){
		this.move(cb,{x:this.travelOffset,y:-this.travelOffset});
	}
	se(cb){
		this.move(cb,{x:this.travelOffset,y:this.travelOffset});
	}
	sw(cb){
		this.move(cb,{x:-this.travelOffset,y:this.travelOffset});
	}
	nw(cb){
		this.move(cb,{x:-this.travelOffset,y:-this.travelOffset});
	}
}
module.exports = Player;