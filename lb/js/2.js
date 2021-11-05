function search() {
    if (document.getElementById("search_input").value != "") {
        window.location.href = "http://159.75.66.60:802/lb/#"+ document.getElementById("search_input").value;
        document.getElementById("search_input").value = "";
    }
    return false;
}

