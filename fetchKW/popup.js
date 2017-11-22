// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Search the bookmarks when entering the search keyword.
$(function() {
    $(".fetch-kw-container #generate").click(function(){
       var rs = [];
       var sql = "INSERT INTO `custom_search_setting` (`keywords`, `priority`, `filter`, `num`, `enable`, `month_of_year`, `created_time`, `lastupdated_time`) VALUES";
       console.log("start to fetch keywords");
       var fetch = function(rs) {
           if (rs.length > 0) {
               rs = rs[0];
           } else {
               return;
           }
           console.log("fetc " + rs.length + " records.")
           for(var r in rs) {
               if (rs[r].indexOf('site:') === -1) {
                   sql = sql + "('" + rs[r]+ "', 880, '',20, 1, '',now(),now()),"
               }
           }
           $(".fetch-kw-container #content").val(sql);
       }
       chrome.tabs.query({active: true}, function(tabs) {
         var tab = tabs[0];
         chrome.tabs.executeScript(tab.id, {
             file: 'getText.js' 
         }, fetch);
       });
    });
    document.addEventListener('DOMContentLoaded', function () {
        //  dumpBookmarks();
    });
});
