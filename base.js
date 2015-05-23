var pressed = [];
var entities = [];
var mouse = {};
var preventDefault = true;
var freeze;
var TimeObject;
var frameTime;
var gameTime;
var objects;

function KeyDownEvent(event)
{
	pressed[event.keyCode] = true;
	//if((!event.shiftKey) && (!event.ctrlKey) && (!event.altKey) && (!event.metaKey) && (preventDefault)) event.preventDefault();
}

function KeyUpEvent(event)
{
	pressed[event.keyCode] = false;
}

function MouseMoveEvent(event)
{
	mouse.x = event.x - canvas.offsetLeft;
	mouse.y = event.y - canvas.offsetTop;
}

function MouseUpEvent(event)
{
	mouse.pressed[event.button] = false;
}

function MouseDownEvent(event)
{
	mouse.pressed[event.button] = true;
}

function InitGame()
{
}

function Start()
{
	canvas = document.createElement("canvas");
	canvas.width = 640;
	canvas.height = 480;
	context = canvas.getContext("2d");
	document.body.appendChild(canvas);
	
	window.addEventListener("keyup", KeyUpEvent);
	window.addEventListener("keydown", KeyDownEvent);
	mouse.pressed = [];
	canvas.addEventListener("mousemove", MouseMoveEvent);
	canvas.addEventListener("mousedown", MouseDownEvent);
	canvas.addEventListener("mouseup", MouseUpEvent);
	InitGame();
	gameTime = 0;
	freeze=true;
	scrollX = 0;
	scrollY = 0;
	
	tileset = new Image();
	tileset.onload = function(){ 
	freeze = false; _tileset = Img2Imgs(tileset, 16, 16);}
	tileset.src = "tileset.png";
	frame = 0;
	if(performance) TimeObject = performance;
	else TimeObject = Date;
	frameTime = TimeObject.now();
	window.requestAnimationFrame(DoFrame);
}

function NewEntity()
{
	for(var i = 0; i < entities.length; i++)
	{
		if(!entities[i].alive)
		{
			entities[i] = {};
			entities[i].alive = true;
			return entities[i];
		}
	}
	entities[entities.length] = {};
	entities[entities.length - 1].alive = true;
	return entities[entities.length - 1];
}

function AddEntity(e)
{
	e.alive = true;
	for(var i = 0; i < entities.length; i++)
	{
		if(!entities[i].alive)
		{
			entities[i] = e;
			return;
		}
	}
	entities[entities.length] = e;
}

function RemoveDeadEntities()
{
	entities = entities.filter(function(e){return e.alive});
}

function ClearEntities()
{
	entities = [];
}

function DoFrame()
{
	var newFrameTime = TimeObject.now();
	var dt = newFrameTime - frameTime;
	frameTime = newFrameTime;
	dt /= 1000;
	if(!freeze)
	{
		gameTime += dt;
		Update(dt);
	}
	frame++;
	Draw();
	window.requestAnimationFrame(DoFrame);
}

function Update(dt)
{
	if(!freeze) UpdateEntities(dt);
	UpdateKeys();
}

function UpdateEntities(dt)
{
	for(var i = 0; i < entities.length; i++)
	{
		var entity = entities[i];
		if(!entity.alive) continue;
		if(entity.Update) entity.Update(dt);
	}
	RemoveDeadEntities()
}

function Draw()
{
	MapDraw();
	var p;
	if(window.hasOwnProperty("players"))
	{
	for(p in players)
	{
		context.drawImage(_tileset[players[p].spr * 9 + (Math.floor(frame / 5) % 3)], players[p].x * 16, players[p].y * 16);
		context.fillText(p, players[p].x * 16, players[p].y * 16 - 8);
	}
	}
}

function Img2Imgs(img, w, h)
{
	var c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	var ctx = c.getContext("2d");
	var imgs = [];
	for(var y = 0; y < (img.height / h) >> 0; y++)
	{
		
		for(var x = 0; x < (img.width / w) >> 0; x++)
		{
			ctx.drawImage(img, x * w, y * h, w, h, 0, 0, w, h);
			var i = new Image();
			i.src = c.toDataURL();
			imgs.push(i);
		}
	}
	return imgs;
}

function MapDraw()
{
	if(!window.hasOwnProperty("theMap")) return;
		for(var i = 0; i < theMap.length; i++)
		{
			for(var j = 0; j < theMap[i].length; j++)
			{
				context.drawImage(_tileset[theMap[i][j]], i * 16, j * 16);
			}
		}
}