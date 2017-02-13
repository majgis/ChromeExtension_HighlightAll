document.addEventListener('DOMContentLoaded', function() {
    //Fetch initial settings
	chrome.runtime.sendMessage({command:"getSettings"}, loadSettings);
	
	var x = document.getElementsByClassName("selection-button");
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].addEventListener("click", buttonClicked);
	}
	
	x = document.getElementsByClassName("setting-checkbox");
	for (i = 0; i < x.length; i++) {
		x[i].addEventListener("click", checkboxClicked);
	}
});

//Fetch settings from background.htm
function loadSettings(result)
{
	document.getElementById("highlightOnSelect").checked = result.highlightOnSelect;
	document.getElementById("clearBetweenSelect").checked = result.clearBetweenSelect;
	document.getElementById("singleWordSearch").checked = result.singleWordSearch;
}

//Send request to background.htm when button clicked
function buttonClicked(event) 
{
	chrome.runtime.sendMessage({command: event.target.id});
}

//Send request to background.htm when checkbox clicked
function checkboxClicked(event)
{
	chrome.runtime.sendMessage({command: event.target.id,value: event.target.checked});	
}
	
	