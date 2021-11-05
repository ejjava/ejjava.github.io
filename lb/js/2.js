function search() {
    if (document.getElementById("search_input").value != "") {
        window.location.href = "https://ejjava.github.io/lb/#"+ document.getElementById("search_input").value;
        document.getElementById("search_input").value = "";
    }
    return false;
}

