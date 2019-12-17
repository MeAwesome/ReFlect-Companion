//Developed By: Isaac Robbins
//For Use With: ReFlect

var Clock = {
	canvas:null,
	Date:{
		days:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		months:["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		getCurrentDate:function(){
			var d = new Date();
			return {
				year:d.getFullYear(),
				month:d.getMonth(),
				weekOfYear:d.getWeek(),
				dayOfWeek:d.getDay(),
				dayOfMonth:d.getDate(),
				monthName:this.Date.months[d.getMonth()],
				dayName:this.Date.days[d.getDay()]
			};
		},
		getDateString:function(){
			return new Date();
		}
	},
	Time:{
		getCurrentTime:function(){
			var d = new Date();
			return {
				hour:d.getHours(),
				minute:d.getMinutes(),
				second:d.getSeconds(),
				millisecond:d.getMilliseconds()
			};
		}
	},
	init:async function(){
		if(window.Date != undefined){
			this.canvas = await CanTools.createCanvas("clock", true);
			this.canvas.setRegion("top-bar-left");
			return 200;
		}
		return 404;
	},
	runner:function(){
		var surface = this.canvas;
		surface.fill("red");
		surface.text({
			text:JSON.stringify(this.Time.getCurrentTime()),
			x:0,
			y:20,
			color:"white"
		});
		//console.log(this.Time.getCurrentTime());
	},
	open:function(){
		return;
	},
	close:function(){
		return;
	}
}
