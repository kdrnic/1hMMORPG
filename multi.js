function SendMessage(m, c)
{
	var msg = new XMLHttpRequest();
	msg.open("POST", "/server.js", true);
	if(c != null) msg.onload = c;
	msg.send(m);
}
connected = false;
function Connect()
{
	if(connected)
	{
		window.alert("alreadyconnected");
		return;
	}
	var inJson = {};
	myName = document.getElementById("nametext").value;
	if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(myName) == false)
	{
		alert("badname");
		return;
	}
	inJson.name = myName;
	inJson.requests = {map: true};
	SendMessage(JSON.stringify(inJson), RcvMsg);
}

function IsTSolid(t)
{
	if(t < 32) return false;
	if(t >= 56) return false;
	return true;
}

function RcvMsg(msg)
{
	msg = msg.target.responseText;
	connected = true;
	var json = JSON.parse(msg);
	if(json.map){
		theMap = json.map;
		canvas.width = json.map.length * 16;
		canvas.height = json.map[0].length * 16;
	}
	if(json.yourName)
	{
		myName = json.yourName;
		document.getElementById("nametext").value = myName;
	}
	players = json.players;
	setTimeout(DoMessage, 20);
}

function DoMessage()
{
	var json = {};
	if(keys["keyLeft"].state) json.moveLeft = true;
	if(keys["keyRight"].state) json.moveRight = true;
	if(keys["keyUp"].state) json.moveUp = true;
	if(keys["keyDown"].state) json.moveDown = true;
	SendMessage(JSON.stringify(json), RcvMsg);
}