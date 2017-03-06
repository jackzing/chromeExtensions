// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Search the bookmarks when entering the search keyword.
$(function() {

  $("#search").keypress(function(e) {
          if(e.which == 13) {
             generateJsLinks();
          }
  });

  $('#search-btn').click(function(){
      generateJsLinks();
  });

  function saveStorage(key, val) {
     if (!key || !val) {
         console.log("key or value error.");
         return;
     }
     val = JSON.stringify(val)
     localStorage[key] = val;

    // Save it using the Chrome extension storage API.
    //chrome.storage.local.set({key: val}, function() {
    //  // Notify that we saved.
    //  alert('Settings saved');
    //});
  }
  
  function getStorageByKey(key) {
    if (localStorage && localStorage[key]) {
        return JSON.parse(localStorage[key]);
    }
    return null;
    //return chrome.storage.local.get(key, function(){
    //});
  }


  function init() {
        var url = searchConfig["url"] ;
        var items = searchConfig["items"];
        $("select#website").val(url);
        var html = "";
        for (var it in items) {
            html +=   '<span class="recent-use-item" style="text-decoration: underline;margin-left:10px">' + items[it]+ '</span>'
        }
        $("div#recent-items").html(html);

        //add click event
        $("span.recent-use-item").click(function(){
            var txt = $(this).text();
            $("input#search").val(txt);
            $('#search-btn').click();
        });
  }

  var searchConfig = {
    "url": "https://www.jjshouse.com/",
    "items":["g918", "c7", "g20", "g956", "c22"]
  };

  var localConfig = getStorageByKey("jjs_search_config");
  if (localConfig && localConfig["url"] && localConfig["items"]) {
      searchConfig = localConfig;
      //console.dir(searchConfig);
  }

  //init data
  init();

  function saveConfig() {
        var url = $("select#website").val();
        var item = $("#search").val();
        var save = false;
        if (searchConfig["url"] != url) {
              searchConfig["url"] = url; 
              save = true;
        }
        if (searchConfig["items"].indexOf(item) == -1 ) {
               searchConfig["items"].shift();
               searchConfig["items"].push(item);
               save = true;
        }
        if (save) {
            saveStorage("jjs_search_config", searchConfig);
            //console.log(searchConfig);
        }
  }

  function generateJsLinks() {
       var id = $('#search').val();
       var catPattern = /c\d+/gi;
       var goodsPattern = /g\d+/gi;
       var url = null;
       var cls = null;
       var origin = "https://www.jjshouse.com/";
       origin = $("select#website").val();
       var params = {
        "isGoodsId": false,
        "isCatId": false
       };
       if (id.match(catPattern)) {
          url = origin + "-c";
          url = url + id.substr(1);
          cls = ".breadcrumb .curr-category a";
          params.isCatId = true;
       } else if (id.match(goodsPattern)) {
          url = origin + "search.php?q="
          url = url + id.substr(1);
          cls = ".cat-prod-list .catpl-prod .pic a";
          params.isGoodsId = true;
       }       
       else {
         //do nothing 
         console.log("id error");
         $("#content").val("id error");
       }
       if (url) {
            //console.log("load page");
            loadJJsPage(url, cls, origin, params);
       }
  }

    function copyToClipboard(elem) {
    	  // create hidden text element, if it doesn't already exist
        var targetId = "_hiddenCopyText_";
        var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        if (isInput) {
            // can just use the original source element for the selection and copy
            target = elem;
            origSelectionStart = elem.selectionStart;
            origSelectionEnd = elem.selectionEnd;
        } else {
            // must use a temporary form element for the selection and copy
            target = document.getElementById(targetId);
            if (!target) {
                var target = document.createElement("textarea");
                target.style.position = "absolute";
                target.style.left = "-9999px";
                target.style.top = "0";
                target.id = targetId;
                document.body.appendChild(target);
            }
            target.textContent = elem.textContent;
        }
        // select the content
        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);
        
        // copy the selection
        var succeed;
        try {
        	  succeed = document.execCommand("copy");
        } catch(e) {
            succeed = false;
        }
        // restore original focus
        if (currentFocus && typeof currentFocus.focus === "function") {
            currentFocus.focus();
        }
        
        if (isInput) {
            // restore prior selection
            elem.setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
            // clear temporary content
            target.textContent = "";
        }
        return succeed;
    }
    
    function loadJJsPage(url, cls, origin, context) {
        var goodsPattern = /-g\d+/gi;
        var isFetchPrice = context && context.isGoodsId ? true : false;
        $.ajax({
            url: url,  //Pass URL here 
            type: "GET", //Also use GET method
            timeout:5000, //timeout
            beforeSend: function() {
                $("#content").val("load...");
                $("#extra-content").html("");
            },
            error: function() {
                $("#content").val("something errror, please try again.");
            },
            fail: function() {
                $("#content").val("load error.");
            },
            success: function(data) {
                //console.log(data);
                var links = $(data).find(cls).attr("href");
                var copy = false;
                if (links) {
                    copy = true;
                } else {
                    $("#content").val("please check id, cat't get url.");
                    return false;
                }
    
                //fetch origin price
                var priceCls = ".cat-prod-list .catpl-prod .p_price a";
                var orgPriceCls = ".cat-prod-list .catpl-prod .p_price p";
                var priceHtml = "";
                var orgPriceHtml = "";
                if (isFetchPrice) {
                    priceHtml =  $(data).find(priceCls).html();
                    orgPriceHtml =  $(data).find(orgPriceCls).html();
                    $("#extra-content").html(priceHtml ? orgPriceHtml + "&nbsp;&nbsp;" + priceHtml : "");
                }
                console.log(links);
                links = origin + links;
                $("#content").val(links);
                if (copy) {
                    copyToClipboard($("#content")[0]);
                    //save config
                    saveConfig();
                }
    
            }
        });
    }
    
    document.addEventListener('DOMContentLoaded', function () {
        //  dumpBookmarks();
    });

});
