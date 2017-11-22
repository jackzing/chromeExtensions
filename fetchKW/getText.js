function le2017ExtractText() {
    var tr = document.querySelectorAll("table tbody tr"); 
    var list = [];
    for(var t in tr) { 
        if (tr[t].childNodes && tr[t].childNodes.length && tr[t].childNodes.length > 0) {
            var td = tr[t].querySelectorAll("td");
            if (td.length && td.length > 1) {
                list.push(td[1].innerText);
            }
        }
    }
    // console.log(list);
    return list;
}
le2017ExtractText();
