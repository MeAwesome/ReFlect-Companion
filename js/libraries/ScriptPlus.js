//Developer: Isaac Robbins
//Last Update: 11/1/2019
//For Use With: ReFlect - A Clearer View At Your Day

var ScriptPlus = {
	config:{
		debug:false,
		version:"1.1.0"
	}
}

window.screenWidth = $(window).width();
window.screenHeight = $(window).height();
window.centerX = window.screenWidth / 2;
window.centerY = window.screenHeight / 2;

function getKeyByValue(object, val){
	if(typeof(object) != "object"){
		scriptPlusGiveErrorMessage("The Object Given Was Not Recognized");
		return;
	}
	for(var prop in object){
		if(object.hasOwnProperty(prop)){
			if(object[prop] == val){
				scriptPlusDebugLogging("Found Key (" + prop + ") From Object (" + object.constructor.name + ") Using Value (" + val + ")");
				return prop;
			}
		}
	}
}

function randomNumber(min, max){
	if(typeof(min) != "number" || typeof(max) != "number"){
		scriptPlusGiveErrorMessage("The Values Given Are Not Numbers");
		return;
	}
	var rand = Math.floor(Math.random() * (max - min + 1)) + min;
	scriptPlusDebugLogging("Picked Random Value (" + rand + ") From Range (" + min + " - " + max + ")");
	return rand;
}

function whenNotEquals(variable, value, run){
	var id = Math.random();
	var interval = setInterval(() => {
		try{
			if(eval(variable) != eval(value)){
				clearInterval(interval);
					run();
			}
		} catch{

		}
	}, 100, id, interval, variable, value, run);
}

function getDeviceType(){
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
		return "mobile";
	} else {
		return "computer";
	}
}

Array.prototype.pickValue = function(){
	var randomValue = Math.floor(Math.random()*this.length);
	return this[randomValue];
}

Array.prototype.contains = function(thing){
	return this.indexOf(thing) > -1;
}

Date.prototype.getWeek = function() {
  var d = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - d) / 86400000) + d.getDay()+1)/7) - 1;
}

String.prototype.capitalize = function(){
  return this.charAt(0).toUpperCase() + this.slice(1)
}
