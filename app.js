"use strict";
class App{
	constructor(robot){
		this.robot = robot;
	}
	findGameOffset(){
		const robot = this.robot; 
		const maxHeight = robot.getScreenSize().height;
		let counter = 0;
		let color = robot.getPixelColor(0,0);
		do{color = robot.getPixelColor(0,++counter);}
		while(color == 'ffffff' && counter < maxHeight)
		this.yoffset = counter-1;
	}
	y(){
		return 600;
	}
	x(){
		return 800;
	}
	center(offset){
		return {
			x:this.x()/2,
			y:(this.y()/2)+offset
		};
	}
	click(xPercent, yPercent){
		const x = (xPercent / 100 * this.x() ) ;
		const y = (yPercent / 100 * this.y())+this.yoffset ;
		console.log(x,y);
		const robot = this.robot;
		robot.moveMouse(x,y);
		robot.mouseToggle('down');
		robot.mouseClick();
		robot.mouseToggle('up');

	}
}
module.exports = App;