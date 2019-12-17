var Loaded = {
  DEBUG:true,
  images:{},
  saveImage:function(key, src){
    return new Promise((resolve) => {
			var image = new Image();
			image.src = dir;
			image.onload = function(){
				if(typeof(Log) != undefined && Loaded.DEBUG == true){
					Log.debugLog("Loaded Image ''" + key + "'' from '" + src + "'");
				}
        Loaded.images[key] = image;
				resolve();
			}
		});
  },
  setImage:function(key, img){
    Loaded.images[key] = img;
    if(typeof(Log) != undefined && Loaded.DEBUG == true){
      Log.debugLog("Set Image '" + key + "'");
    }
  },
  getImage:function(key){
    return Loaded.images[key];
  }
}
