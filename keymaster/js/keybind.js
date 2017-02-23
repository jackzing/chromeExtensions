jwerty.key('e,e', function() { 
    //Load via Ajax
    var url = chrome.extension.getURL('/template/menu.html');
    //console.log(url);
    //1.get html
    //$.get(url, function(html) {
    //    //$(this).html(html);
    //    console.log(html);
    //});
    //2.use iframe
    if ($("#ee2018circlemenu").length == 1) {
        $("#ee2018circlemenu").toggle();
    } else {
        $("body").append('<iframe id="ee2018circlemenu"style="width: 400px; height: 300px; position: fixed; top: 10%; border: 0px;"src="' + url + '"></iframe>');
    }
});
