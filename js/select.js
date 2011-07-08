// Loaded by each tab, communicates with background.htm, makes calls to searchhi_slim.js
//
//references:  http://javascript.about.com/library/blhilite2.htm

var clearBetweenSelections = true;
var singleSearch = false;
var lastText = "";
var imedBool = false;
var cssstr = "";

//Listener to highlight on selection
document.onmouseup = highlightSelection;

//Listener for incoming requests
chrome.extension.onRequest.addListener(processRequest)

// Handle incoming requests
function processRequest(request, sender, sendResponse)
{
	switch(request.command)
	{
		case "highlight":
			highlightSelection();
			break;
			
		case "clearHighlights":
			clearHighlightsOnPage();
			break;
			
		case "updateBooleans":
			var value = request.value;
			updateBooleans(value[0], value[1], value[2])
			break;
	}
	
}

// Insert str into stylenode; create style node if it does not exist
function updateStyleNode(str) 
{
    stylenode = typeof(stylenode) != 'undefined' ? stylenode : document.getElementsByTagName('head')[0].appendChild(document.createElement('style'));
    stylenode.innerHTML = str;
}

//Highlight all occurances of the current selection
function highlightSelection(e) 
{

	//Skip this section if mouse event is undefined
	if (e != undefined)
	{
	
		//Ignore right clicks; avoids odd behavior with CTRL key
		if (e.button == 2)
		{
			return;
		}

		//Exit if CTRL key is held while auto highlight is checked on
		if(imedBool && e.ctrlKey)
		{
			return;
		}
		
		//Exit if CTRL key not held and auto highlight is checked off
		if(!imedBool && !e.ctrlKey)
		{
			return;
		}
	}
	
	var selectedText = window.getSelection().toString().replace(/^\s+|\s+$/g, "");
	var testText = selectedText.toLowerCase();
	
	//Exit if selection is whitespace or what was previously selected
	if (selectedText == '' || lastText == testText)
	{
		return;
	}
	
	// Clear all highlights if requested
	if (clearBetweenSelections)
	{
		clearHighlightsOnPage();
	}
	
	//Perform highlighting
	localSearchHighlight(selectedText, singleSearch);
	
	//Store processed selection for next time this method is called
	lastText = testText;
}


// Clears all highlights on the page
function clearHighlightsOnPage()
{
	unhighlight(document.getElementsByTagName('body')[0]);
	cssstr = "";
	updateStyleNode(cssstr);
	lastText = "";
}

function updateBooleans(clearBool, highlightOnSelect, singleBool)
{
	clearBetweenSelections = clearBool;
	imedBool = highlightOnSelect;
	singleSearch = singleBool;
}

// Update settings
function processGetSettings(response)
{
	updateBooleans(response.clearBetweenSelect, response.highlightOnSelect, response.singleWordSearch);
}

chrome.extension.sendRequest({command:"getSettings"},processGetSettings);


