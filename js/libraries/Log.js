var Log = {
  DEBUG:true,
  intervals:{},
  log:function(message, color){
    if(color == undefined){
      color = Color.white;
    } else if(color in Color){
      color = Color[color];
    } else if(color.indexOf("#") == -1){
      color = "#" + Color.toHex(color);
    }
    console.log("%c" + message, "color:" + color);
  },
  debugLog:function(message, color){
    if(Log.DEBUG == true){
      if(color == undefined){
        color = Color.white;
      } else if(color in Color){
        color = Color[color];
      } else if(color.indexOf("#") == -1){
        color = "#" + Color.toHex(color);
      }
      console.log("%c" + message, "color:" + color);
    }
  },
  warn:function(message){
    console.warn(message);
  },
  error:function(message){
    console.error(message);
  },
  whenEqualsLog:function(variable, value, run){
    var id = Math.random();
	  var interval = setInterval(() => {
      try{
        if(eval(variable) == eval(value)){
		      clearInterval(interval);
		        run();
		    }
		  } catch{

		  }
	  }, 100, id, interval, variable, value, run);
	},
  whenNotEqualsLog:function(variable, value, run){
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
}
