var Mirror = {
  running:"Home Page",
  homeLayout:CONFIGURATION.homeLayout,
  status:{
    attemptingToOpen:null,
    attemptingToClose:null
  },
  sendRequest:async function(type, data){
    switch(type){
      case "OPEN":
        if(data.module in MODULES){
          Mirror.status.attemptingToOpen = data.module;
          if(Mirror.running == "Home Page"){
            for(var mod = 0; mod < Mirror.homeLayout.length; mod++){
              Mirror.status.attemptingToClose = MODULES[Mirror.homeLayout[mod]];
              await MODULES[Mirror.homeLayout[mod]].program.close();
            }
            Mirror.status.attemptingToClose = null;
          } else {
            Mirror.status.attemptingToClose = MODULES[Mirror.running];
            await MODULES[Mirror.running].program.close();
            Mirror.status.attemptingToClose = null;
          }
          await MODULES[data.module].program.open();
          Mirror.running = data.module;
          Mirror.status.attemptingToOpen = null;
        }
        break;
      case "CLOSE":
        break;
    }
  },
  start:async function(){
    for(var mod in MODULES){
      if(await MODULES[mod].program.init() != 200){
        return 404;
      }
    }
    window.requestAnimationFrame(Mirror.run);
  },
  run:function(){
    for(var mod in MODULES){
      if(Mirror.running == "Home Page"){
        if(Mirror.homeLayout.contains(mod)){
          MODULES[mod].program.runner();
        }
      } else if(Mirror.running == mod){
        MODULES[mod].program.runner();
      }
      var x = MODULES[mod].program.canvas.regions[MODULES[mod].program.canvas.region].startX;
      var y = MODULES[mod].program.canvas.regions[MODULES[mod].program.canvas.region].startY;
      MAIN_DISPLAY.surface.drawImage(MODULES[mod].program.canvas.canvas, x, y);
    }
    window.requestAnimationFrame(Mirror.run);
  }
}
