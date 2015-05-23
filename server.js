var http = require("http");
var fs = require("fs");
var ips = {};
var players = {};

function RandomMap()
{
	var layers = [];
	layers[0] = [];
	layers[1] = [];
	var pt = [];
	var num = 10;
	for(var i = 0; i < num; i++) pt[i] = {x: Math.random() * 640, y: Math.random() * 480};
	for(var i = 0; i < 20; i++)
	{
		layers[0][i] = [];
		layers[1][i] = [];
		for(var j = 0; j < 15; j++)
		{
			var td = 0;
			for(var k = 0; k < num; k++)
			{
				var d = Math.sqrt((pt[k].y - 16 - i * 32) * (pt[k].y - 16 - i * 32) + (pt[k].x - 16 - j * 32) * (pt[k].x - 16 - j * 32));
				if(d < 240) td += d;
			}
			if(td > 240) layers[0][i][j] = 0;
			else layers[0][i][j] = 2;
			layers[1][i][j] = 1;
		}
	}
	return {layers: layers};
}

function IsTSolid(t)
{
	if(t < 32) return false;
	if(t >= 56) return false;
	return true;
}

function GetFreePos()
{
	for(var k = 0; true; k++)
	{
		var i = Math.floor(Math.random() * theMap.length);
		var j = Math.floor(Math.random() * theMap[0].length);
			if(!IsTSolid(theMap[i][j])) return {x: i , y: j};
	}
}

function IsMapS(x,y)
{
	if(x <0) return true;
	if(x >= theMap[0].length) return true;
	if(y <0) return true;
	if(y >= theMap.length) return true;
	if(IsTSolid(theMap[x][y])) return true;
	return false;
}

var server = http.createServer(function(request, response)
{
	console.log("aaa");
	if(request.url == "/server.js")
	{
		
		request.contentstr = "";
		request.on("data", function(data)
		{
			this.contentstr += data.toString();
		});
		request.on("end", function(data)
		{
			console.log(this.contentstr);
			var inJson = JSON.parse(this.contentstr);
			var outJson = {};
			if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(inJson.name) == false)
			{
				response.write(JSON.stringify({error: "badname"}));
				response.end();
				return;
			}
			if((inJson.requests) && (inJson.requests.map))
			{
				outJson.map = theMap;
			}
			
			if(!ips.hasOwnProperty(this.socket.remoteAddress))
			{
			if(!players.hasOwnProperty(inJson.name))
			{
				ips[this.socket.remoteAddress] = inJson.name;
				var p = GetFreePos();
				players[inJson.name] =
				{
					x: p.x,
					y: p.y,
					spr: Math.floor(Math.random() * 3),
					name: inJson.name
				};
			}
			}
			
			console.log(this.socket.remoteAddress, ips[this.socket.remoteAddress], players);
			var p = players[ips[this.socket.remoteAddress]];
			console.log(p);
			if(inJson.moveLeft) if(!IsMapS(p.x - 1, p.y)) p.x--;
			if(inJson.moveRight) if(!IsMapS(p.x + 1, p.y)) p.x++;
			if(inJson.moveUp) if(!IsMapS(p.x, p.y-1)) p.y--;
			if(inJson.moveDown) if(!IsMapS(p.x, p.y+1)) p.y++;
			
			outJson.yourName = ips[this.socket.remoteAddress];
			outJson.players = players;
			response.write(JSON.stringify(outJson));
			response.end();
			console.log("bbb");
		});
	}
	else if(request.url == "/")
	{
		response.write("<html><body>File not found</body></html>");
		response.end();
	}
	else
	{
		console.log(request.url);
		if(fs.existsSync("." + request.url)) response.write(fs.readFileSync("." + request.url));
		else
		{
			response.write("<html><body>File not found</body></html>");
		response.end();
		}
		response.end();
	}
});

mapJson = JSON.parse(fs.readFileSync("untitled.json"));
mapArray = mapJson.layers[0].data.map(function(n){return n - 1});
mapW =mapJson.layers[0].width;
mapH =mapJson.layers[0].height;
theMap = [];
for(var x = 0; x < mapW; x++)
{
	theMap[x] = [];
	for(var y = 0; y < mapH; y++)
	{
		theMap[x][y] = mapArray[x + y * mapW];
	}
}

server.listen(8888);
console.log("Server is listening");

