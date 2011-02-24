//Highlight all occurrances of the current selection
//references:  http://javascript.about.com/library/blhilite2.htm

var clearBetweenSelections = true;
var singleSearch = false;
var lastText = "";
var imedBool = false;

//Listener to highlight on selection
document.onmouseup = highlightSelection;

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
}

function updateBooleans(clearBool, highlightOnSelect, singleBool)
{
	clearBetweenSelections = clearBool;
	imedBool = highlightOnSelect;
	singleSearch = singleBool;
}



