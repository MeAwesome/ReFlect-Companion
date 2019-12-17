var CanTools = {
	canvases:{},
	createCanvas:async function(id, hidden){
		if(!(id in CanTools.canvases) && document.getElementById(id) == null){
			var canvas = document.createElement("canvas");
			canvas.setAttribute("id", id);
			if(hidden){
				canvas.setAttribute("class", "hidden");
			}
			document.body.append(canvas);
			var ctc = new CTC(canvas)
			CanTools.canvases[id] = {
				canvas:canvas,
				ctc:ctc
			};
			return ctc;
		}
	}
}

class CTC{
	constructor(canvas){
		this.canvas = canvas;
		this.surface = canvas.getContext("2d");
		this.width = canvas.width;
		this.height = canvas.height;
		this.fullscreenInterval = null;
		this.refreshRate = 60;
		this.region = "full";
		this.objects = {};
		this.groups = {};
		this.regions = {
			"top-bar-full":{
				startX:0,
				startY:0,
				endX:"1W",
				endY:"1/4H"
			},
			"top-bar-left":{
				startX:0,
				startY:0,
				endX:"1/3W",
				endY:"1/4H"
			},
			"top-bar-middle":{
				startX:"1/3W",
				startY:0,
				endX:"2/3W",
				endY:"1/4H"
			},
			"top-bar-right":{
				startX:"2/3W",
				startY:0,
				endX:"1W",
				endY:"1/4H"
			},
			"top-half-full":{
				startX:0,
				startY:0,
				endX:"1W",
				endY:"1/2H"
			}
		};
		this.defaults = {
			text:{
				color:"white",
				size:20,
				font:"felicity",
				name:"[CanTools Text Object]",
				groups:[],
				region:null,
				align:"left",//left,center,right,start,end
				base:"alphabetic",//top,middle,bottom,alphabetic,hanging
				filled:true,
				strokesize:1
			},
			image:{
				name:"[CanTools Image Object]",
				groups:[],
				region:null,
				align:"left",//left,center,right
				base:"top"//top,middle,bottom
			}
		}
	}
	changeSize(width, height){
		this.canvas.width = width;
		this.canvas.height = height;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	}
	fullscreen(){
		this.fullscreenInterval = setInterval(() => {
			if(this.canvas.width != $(window).width() || this.canvas.height != $(window).height()){
				this.changeSize($(window).width(), $(window).height());
				for(var can in CanTools.canvases){
					CanTools.canvases[can].ctc.setRegion(CanTools.canvases[can].ctc.region);
				}
			}
		}, this.refreshRate);
	}
	loadFonts(){
		for(var font = 0;font<Object.keys(this.fonts).length;font++){
			Display.text({
				text:"Render Font",
				x:0,
				y:0,
				color:"black",
				font:Object.keys(this.fonts)[font]
			});
		}
	}
	newObject(descriptions, instantAdd){
		if(typeof(descriptions) != "object"){
			return;
		}
		if(descriptions.name == undefined){
			if(descriptions.type != undefined){
			} else {;
			}
			return;
		}
		if(descriptions.type == undefined){
			return;
		}
		if(descriptions.name in this.objects){
			return;
		}
		if(descriptions.group == undefined){
			descriptions.groups = this.defaults.text.groups;
		}
		if(descriptions.region == undefined){
			descriptions.region = this.defaults.text.region;
		}
		this.objects[descriptions.name] = descriptions;
		if(instantAdd){
			this.drawObject(descriptions.name);
		}
	}
	newGroup(name, objs){
		this.groups[name] = {};
		if(objs != undefined){
			for(var obj = 0;obj<objs.length;obj++){
				if(this.objects[objs[obj]]){
					this.groups[name][this.objects[objs[obj]].name] = this.objects[objs[obj]];
					this.objects[objs[obj]].groups.push(name);
				}
			}
		} else {
		}
	}
	setRegion(name){
		if(name in this.regions){
			this.region = name;
			var coords = [this.regions[name].startX, this.regions[name].startY, this.regions[name].endX, this.regions[name].endY];
			coords.forEach((coord) => {
				if(typeof(coord) != "number"){
					if(coord.indexOf("W") > -1){
						if(coord == "1/4W"){
							coords[coords.indexOf(coord)] = MAIN_DISPLAY.width / 4;
						} else if(coord == "1/3W"){
							coords[coords.indexOf(coord)] = MAIN_DISPLAY.width / 3;
						} else if(coord == "1/2W"){
							coords[coords.indexOf(coord)] = MAIN_DISPLAY.width / 2;
						} else if(coord == "1W"){
							coords[coords.indexOf(coord)] = MAIN_DISPLAY.width;
						}
					} else if(coord.indexOf("H") > -1){
						if(coord == "1/4H"){
							coords[coords.indexOf(coord)] = MAIN_DISPLAY.height / 4;
						} else if(coord == "1/3H"){
							coords[coords.indexOf(coord)] = MAIN_DISPLAY.height / 3;
						} else if(coord == "1/2H"){
							coords[coords.indexOf(coord)] = MAIN_DISPLAY.height / 2;
						} else if(coord == "1H"){
							coords[coords.indexOf(coord)] = MAIN_DISPLAY.height;
						}
					}
				}
			});
			this.changeSize(coords[2] - coords[0], coords[3] - coords[1]);
		}
	}
	drawObject(name){
		if(name in this.objects){
			var obj = this.objects[name];
			switch(obj.type){
				case "text":
					this.text(obj);
					break;
				case "image":
					this.image(obj);
					break;
				default:
			}
	}
}
	drawGroup(name){
		for(var obj = 0;obj<Object.keys(this.groups[name]).length;obj++){
			this.drawObject(Object.keys(this.groups[name])[obj]);
		}
	}
	drawRegion(name){
		for(var grp = 0;grp<this.regions[name].groups;grp++){
			this.drawGroup(this.regions[name].groups[grp]);
		}
	}
	changeObject(name, descriptions){
		if(name in this.objects){
			if(descriptions.type == undefined && descriptions.name == undefined){
				for(var desc in descriptions){
					this.objects[name][desc] = descriptions[desc];
					console.log(desc);
				}
			} else {
			}
		} else {
		}
	}
	getGroupObjects(name){
		return this.groups[name];
	}
	fill(color, transparency){
		this._saveValues();
		if(transparency != undefined){
			this.surface.globalAlpha = transparency;
		}
		if(color in Color){
			this.surface.fillStyle = Color[color];
		} else {
			this.surface.fillStyle = color;
		}
		this.surface.fillRect(0, 0, this.width, this.height);
		this._resetValues();
	}
	text(descriptions){
		this._saveValues();
		if(descriptions.name == undefined){
			descriptions.name = this.defaults.text.name;
		}
		if(descriptions.region == undefined){
			descriptions.region = this.defaults.text.region;
		}
		if(descriptions.text == undefined){
			return;
		}
		if(descriptions.x == undefined){
			return;
		}
		if(descriptions.y == undefined){
			return;
		}
		if(descriptions.align == undefined){
			descriptions.align = this.defaults.text.align;
		}
		if(descriptions.base == undefined){
			descriptions.base = this.defaults.text.base;
		}
		if(descriptions.filled == undefined){
			descriptions.filled = this.defaults.text.filled;
		}
		if(descriptions.strokesize == undefined){
			descriptions.strokesize = this.defaults.text.strokesize;
		}
		if(descriptions.color == undefined){
			descriptions.color = this.defaults.text.color;
		} else if(descriptions.color in Color){
			descriptions.color = Color[descriptions.color];
		}
		if(descriptions.size == undefined){
			descriptions.size = this.defaults.text.size;
		}
		if(descriptions.font == undefined){
			//if(this.defaults.text.font in this.fonts){
				//descriptions.font = descriptions.size + "px " + this.fonts[this.defaults.text.font];
			//} else {
				descriptions.font = descriptions.size + "px " + this.defaults.text.font;
			//}
		/* else if(descriptions.font in this.fonts){
			descriptions.font = descriptions.size + "px " + this.fonts[descriptions.font];
		} else if(descriptions.font.indexOf("px ") == -1){
			descriptions.font = descriptions.size + "px " + descriptions.font;*/
		}
		if(descriptions.region != null){
			descriptions.x += descriptions.region.x;
			descriptions.y += descriptions.region.y;
		}
		this._updateValues({
			color:descriptions.color,
			font:descriptions.font,
			align:descriptions.align,
			base:descriptions.base,
			strokesize:descriptions.strokesize
		});
		if(descriptions.filled){
			this.surface.fillText(descriptions.text, descriptions.x, descriptions.y);
		} else {
			this.surface.strokeText(descriptions.text, descriptions.x, descriptions.y);
		}
		this._resetValues();
	}
	image(descriptions){
		this._saveValues();
		if(descriptions.name == undefined){
			descriptions.name = this.defaults.image.name;
		}
		if(descriptions.region == undefined){
			descriptions.region = this.defaults.image.region;
		}
		if(descriptions.align == undefined){
			descriptions.align = this.defaults.image.align;
		}
		if(descriptions.base == undefined){
			descriptions.base = this.defaults.image.base;
		}
		if(descriptions.image == undefined){
			return;
		}
		if(descriptions.width == undefined){
			descriptions.width = descriptions.image.width;
		}
		if(descriptions.height == undefined){
			descriptions.height = descriptions.image.height;
		}
		if(descriptions.x == undefined){
			return;
		} else if(!descriptions.UpdatedAlign){
			switch(descriptions.align){
				case "center":
					descriptions.x = descriptions.x - (descriptions.width / 2);
					break;
				case "right":
					descriptions.x = descriptions.x - descriptions.width;
					break;
				default:
					break;
			}
			descriptions.UpdatedAlign = true;
		}
		if(descriptions.y == undefined){
			return;
		} else if(!descriptions.UpdatedBase){
			switch(descriptions.base){
				case "middle":
					descriptions.y = descriptions.y - (descriptions.height /2);
					break;
				case "bottom":
					descriptions.y = descriptions.y - descriptions.height;
					break;
				default:
					break;
			}
			descriptions.UpdatedBase = true;
		}
		if(descriptions.region != null){
			descriptions.x += descriptions.region.x;
			descriptions.y += descriptions.region.y;
		}
		this.surface.drawImage(descriptions.image, descriptions.x, descriptions.y, descriptions.width, descriptions.height);
		this._resetValues();
	}
	_updateValues(options){
		if(options.color != undefined){
			this.surface.fillStyle = options.color;
			this.surface.strokeStyle = options.color;
		}
		if(options.font != undefined){
			this.surface.font = options.font;
		}
		if(options.align != undefined){
			this.surface.textAlign = options.align;
		}
		if(options.base != undefined){
			this.surface.textBaseline = options.base;
		}
		if(options.strokesize != undefined){
			this.surface.lineWidth = options.strokesize;
		}
	}
	_saveValues(){
		this.surface.save();
	}
	_resetValues(){
		this.surface.restore();
	}
}
