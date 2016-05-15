var profiles = {};
var colors;
var r;
var g;
var b;
var yiq;
var status = $(".status");

$(document).ready(function () {
    loadColorWheel();
})

function loadColorWheel() {
    var cw = Raphael.colorwheel($(".colorwheel")[0], 300, 250)
        .color("#006eff")
        .ondrag(startDrag, stopDrag);

    cw.input($("body")[0]);

    function startDrag() {
        $(".status").text("").fadeIn();
    }

    function stopDrag() {
        console.log(r, g, b)
        sendAPI(r, g, b);
    }

    cw.onchange(function (color) {
        r = parseInt(color.r);
        g = parseInt(color.g);
        b = parseInt(color.b);
        yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        $(".textcontrast").css("color", (yiq >= 128) ? 'black' : 'white');
        $("button").css("border-color", (yiq >= 128) ? 'black' : 'white');
        $(".svg-icon").css("fill", (yiq >= 128) ? 'black' : 'white');
        $(".hexcolor").text(color.hex);
    })
}

function sendAPI(r, g, b) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://agnosthings.com/d0733d1a-08b0-11e6-8001-005056805279/feed?push=red=" + r + ",blue=" + b + ",green=" + g + ",active=" + 1);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            console.log(data.value);
            $(".status").text("color updated!").fadeOut(2000);
        } else {
            $(".status").text("error! check your internet connection.").fadeOut(2000);
        }
    }
    xmlhttp.send();
}

function showGuid() {
    alert("AgnosThings GUID : \n0733d1a-08b0-11e6-8001-005056805279");
}

function shareFacebook(){
    window.open("https://www.facebook.com/sharer/sharer.php?u=rgbledguru.droppages.com");
}