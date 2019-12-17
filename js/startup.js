async function startReFlect(){
  if(await connectToServer(getDeviceType()) != 200){
    return 404;
  }
  if(await loadConfiguration() != 200){
    return 404;
  }
  if(await createCanvas() != 200){
    return 404;
  }
  if(await createMirrorObject() != 200){
    return 404;
  }
  if(await loadModules() != 200){
    return 404;
  }
  setLoadingProgressText("Starting ReFlect");
  setTimeout(async () => {
    document.getElementById("CenteredImageHolder").style.display = "none";
    await Mirror.start();
  }, 1000);
  return 200;
}

async function connectToServer(room){
  setLoadingProgressText("Connecting To Server");
  await WebTalk.createConnection();
  await WebTalk.connectTo(room);
  return 200;
}

async function loadConfiguration(){
  setLoadingProgressText("Loading Configuration File");
  CONFIGURATION = JSON.parse(await WebTalk.getPromise("/configuration.json"));
  return 200;
}

async function createCanvas(){
  setLoadingProgressText("Initializing The Canvas");
  MAIN_DISPLAY = await CanTools.createCanvas("mirrorDisplay", false);
  MAIN_DISPLAY.fullscreen();
  return 200;
}

async function createMirrorObject(){
  setLoadingProgressText("Initializing The Mirror");
  await WebTalk.loadScript("/js/mirror.js");
  return 200;
}

async function loadModules(){
  if(CONFIGURATION.modules == undefined){
    setLoadingProgressText("Error 404 - CONFIGURATION Missing Data", true);
    Log.error("Error 404 - CONFIGURATION.modules is undefined");
    return 404;
  }
  MODULES = {};
  for(var mod = 0; mod < CONFIGURATION.modules.length; mod++){
    setLoadingProgressText("Loading Modules [" + mod + "/" + CONFIGURATION.modules.length + "]");
    var modPath = CONFIGURATION.modules[mod];
    var modName = modPath.replace("default/", "");
    try{
      await WebTalk.loadScript("/modules/" + modPath + "/" + modName + ".js");
      MODULES[modName.capitalize()] = {
        "program":await eval(modName.capitalize()),
        "data":JSON.parse(await WebTalk.getPromise("/modules/" + modPath + "/data.json")),
        "themes":{}
      };
      for(var theme = 0; theme < MODULES[modName.capitalize()].data.config.themes.length; theme++){
        var themeName = MODULES[modName.capitalize()].data.config.themes[theme];
        MODULES[modName.capitalize()].themes[themeName.capitalize()] = {
          "styling":JSON.parse(await WebTalk.getPromise("/modules/" + modPath + "/themes/" + themeName + "/" + themeName + ".json")),
          "logo":await WebTalk.loadImage(themeName.capitalize() + " Icon", "/modules/" + modPath + "/themes/" + themeName + "/icon.svg")
        };
      }
    } catch {
      setLoadingProgressText("Error 404 - Module Not Found", true);
      Log.error(modName.capitalize() + " does not contain " + modName + ".js, the object " + modName.capitalize() + ", or another required file");
      return 404;
    }
  }
  return 200;
}

function setLoadingProgressText(message, error){
  document.getElementById("CenteredText").innerHTML = message;
  if(error){
    document.getElementById("CenteredImage").src = "/images/logos/ReFlectErrorBlack.svg";
  }
}
