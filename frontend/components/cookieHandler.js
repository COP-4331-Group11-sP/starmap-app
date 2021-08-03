function saveCookie(userId)
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "userId=" + userId + ";expires=" + date.toGMTString() + ";path=/" + ";samesite=lax";
}

function readCookie()
{
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "userId" )
		{
			return parseInt( tokens[1].trim() );
		}
	}
	return null;
}

export {saveCookie, readCookie};