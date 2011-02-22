/* New from Rob Nitti, who credits 
 * http://bytes.com/groups/javascript/145532-replace-french-characters-form-inp
 * The code finds accented vowels and replaces them with their unaccented version. */
function stripVowelAccent(str)
{
	var rExps=[ /[\xC0-\xC2]/g, /[\xE0-\xE2]/g,
		/[\xC8-\xCA]/g, /[\xE8-\xEB]/g,
		/[\xCC-\xCE]/g, /[\xEC-\xEE]/g,
		/[\xD2-\xD4]/g, /[\xF2-\xF4]/g,
		/[\xD9-\xDB]/g, /[\xF9-\xFB]/g ];

	var repChar=['A','a','E','e','I','i','O','o','U','u'];

	for(var i=0; i<rExps.length; ++i)
		str=str.replace(rExps[i],repChar[i]);

	return str;
}

/* Modification of */
/* http://www.kryogenix.org/code/browser/searchhi/ */
/* See: */
/*   http://www.tedpavlic.com/post_highlighting_search_results_with_ted_searchhi_javascript.php */    
/*   http://www.tedpavlic.com/post_inpage_highlighting_example.php */
/* for additional modifications of this base code. */
function highlightWord(node,word,doc) {
     doc = typeof(doc) != 'undefined' ? doc : document;
	// Iterate into this nodes childNodes
	if (node.hasChildNodes) {
		var hi_cn;
		for (hi_cn=0;hi_cn<node.childNodes.length;hi_cn++) {
			highlightWord(node.childNodes[hi_cn],word,doc);
		}
	}

	// And do this node itself
	if (node.nodeType == 3) { // text node
		tempNodeVal = stripVowelAccent(node.nodeValue.toLowerCase());
		tempWordVal = stripVowelAccent(word.toLowerCase());
		if (tempNodeVal.indexOf(tempWordVal) != -1) {
			pn = node.parentNode;
			if (pn.className != "searchword") {
				// word has not already been highlighted!
				nv = node.nodeValue;
				ni = tempNodeVal.indexOf(tempWordVal);
				// Create a load of replacement nodes
				before = doc.createTextNode(nv.substr(0,ni));
				docWordVal = nv.substr(ni,word.length);
				after = doc.createTextNode(nv.substr(ni+word.length));
				hiwordtext = doc.createTextNode(docWordVal);
				hiword = doc.createElement("span");
				hiword.className = "searchword";
				hiword.appendChild(hiwordtext);
				pn.insertBefore(before,node);
				pn.insertBefore(hiword,node);
				pn.insertBefore(after,node);
				pn.removeChild(node);
			}
		}
	}
}

function unhighlight(node) {
	// Iterate into this nodes childNodes
	if (node.hasChildNodes) {
		var hi_cn;
		for (hi_cn=0;hi_cn<node.childNodes.length;hi_cn++) {
			unhighlight(node.childNodes[hi_cn]);
		}
	}

	// And do this node itself
	if (node.nodeType == 3) { // text node
		pn = node.parentNode;
		if( pn.className == "searchword" ) {
			prevSib = pn.previousSibling;
			nextSib = pn.nextSibling;
			nextSib.nodeValue = prevSib.nodeValue + node.nodeValue + nextSib.nodeValue;
			prevSib.nodeValue = '';
			node.nodeValue = '';
		}
	}
}

//majgis:  added singleSearch option
function localSearchHighlight(searchStr, singleWordSearch, doc) 
{
    doc = typeof(doc) != 'undefined' ? doc : document;
	
	if (!doc.createElement) return;
	
	// Trim leading and trailing spaces after unescaping
	searchstr = unescape(searchStr).replace(/^\s+|\s+$/g, "");
	
	if( searchStr == '' ) return;
	
	//majgis: Single search option
	if(singleWordSearch)
	{
		phrases = searchStr.replace(/\+/g,' ').split(/\"/);
		
		//limit length to prevent crashing browser
		max=25
		if (phrases.length > max)
		{
			phrases.splice(0,phrases.length - 100);
		}
	}
	else
	{
		phrases = ["",searchStr];
	}
	
	for(p=0;p<phrases.length;p++) {
	        phrases[p] = unescape(phrases[p]).replace(/^\s+|\s+$/g, "");
		if( phrases[p] == '' ) continue;
		if( p % 2 == 0 ) words = phrases[p].replace(/([+,()]|%(29|28)|\W+(AND|OR)\W+)/g,' ').split(/\s+/);
		else { words=Array(1); words[0] = phrases[p]; }
               	for (w=0;w<words.length;w++) {
			if( words[w] == '' ) continue;
			highlightWord(doc.getElementsByTagName("body")[0],words[w],doc);
        	}
	}
}
