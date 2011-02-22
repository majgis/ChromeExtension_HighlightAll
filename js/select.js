//Highlight all occurrances of the current selection
//references:  http://javascript.about.com/library/blhilite2.htm

var clearBetweenSelections = true;
var singleSearch = false;
var lastText = "";
var disable = false;


//Toggle mouseup listener to highlight on selection
function immediateHighlighting(imedBool)
{

	if (imedBool)
	{
		document.onmouseup = highlightSelection;
	}
	else
	{
		document.onmouseup = '';
	}
}


//Highlight all occurances of the current selection
function highlightSelection(e) 
{	
	if(e.ctrlKey)
	{
		return;
	}
	
	var selectedText = getSelectedText().replace(/^\s+|\s+$/g, "");
	var testText = selectedText.toLowerCase();
	
	if (disable || selectedText == '' || lastText == testText)
	{
		return;
	}
	
	if (clearBetweenSelections)
	{
		clearHighlightsOnPage();
	}
	
	localSearchHighlight(selectedText, singleSearch);
	lastText = testText;
}


// Clears all highlights on the page
function clearHighlightsOnPage()
{
	unhighlight(document.getElementsByTagName('body')[0])
	return;
	
}

//Returns text currently selected in document
//Reference: http://www.codetoad.com/javascript_get_selected_text.asp
function getSelectedText()
{
	var txt;
	
	if (window.getSelection)
	{
		txt = window.getSelection();
	}
	else if (document.getSelection)
	{
		txt = document.getSelection();
	}
	else if (document.selection)
	{
		txt = document.selection.createRange().text;
	}
	
	return '' + txt;
}

function updateBooleans(clearBool, imedBool, singleBool)
{
	clearBetweenSelections = clearBool;
	immediateHighlighting(imedBool);
	singleSearch = singleBool;
}



