var lamps = [
    ['Teras', '8dd09566-1d14-11e6-8001-005056805279', '409']
    , ['Ruang Tamu', '9de16156-1d14-11e6-8001-005056805279', '410']
    , ['Ruang Keluarga', 'b1659da0-1d14-11e6-8001-005056805279', '411']
    , ['Dapur', 'c1e1c172-1d14-11e6-8001-005056805279', '412']
    , ['Kamar Tidur', 'da9400f4-1d14-11e6-8001-005056805279', '413']
    , ['Kamar Mandi', 'e78ef2c8-1d14-11e6-8001-005056805279', '414']
    ];

$(document).ready(function(){
    $('.modal-trigger').leanModal();
    $(".button-collapse").sideNav();
    loadPage('electric');
    console.log("Warning: Messy Code!");
})


function loadPage(page, pageNav) {
    console.log("load ../" + page + ".html")
    $("#content").load("../" + page + ".html", function () {
        $('.page-nav').removeClass('active');
        if (page == "temperature") {
            initTemperature();
        } else if (page == "gallon") {
            initGallon();
        } else if (page == "electric") {
            initCons();
            initLamp();
        }
        $('#button-refresh').click(function(){
               loadPage(page,pageNav); 
            });
        $(pageNav).addClass('active');
    });
    $(".button-collapse").sideNav();
}

function initLamp() {
    $.each(lamps, function (i) {
        var li = $("<div class='col s12 m6 l4' ><div class='card card-lamp'><div class='card-content'><h6>" + lamps[i][0] + "<div class='preloader-wrapper small active' id='preload-lamp" + i + "'><div class='spinner-layer spinner-green-only'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div><div class='switch' id='switch-lamp" + i + "'><label><input type='checkbox' id='lamp" + i + "' onchange='updateLamp(" + i + ", this)'><span class='lever'></span></label></div></h6></div>")
            .appendTo($('#lamp-list'));
        $('#switch-lamp' + i).hide();
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "http://agnosthings.com/" + lamps[i][1] + "/field/last/feed/" + lamps[i][2] + "/active");
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.status == 200) {
                $('#preload-lamp' + i).hide();
                $('#switch-lamp' + i).show();

                var data = JSON.parse(xmlhttp.responseText);
                if (data.value == 1) {
                    $('#lamp' + i).prop("checked", true);
                }
            }
        }
        xmlhttp.send();
    })
}

function initCons(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://agnosthings.com/6f525b4c-1eb3-11e6-8001-005056805279/channel/last/feed/427/1");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            var vArray = [];
            var value = data.cValue[0];
            vArray.push(value.split(','));
            $('.preloader-wrapper').hide();
            var price = parseInt((vArray[0][1]/1000)*13000);
            $('#total-cons').text(vArray[0][1]+" Wh");
            $('#avg-cons').text((vArray[0][1]/parseInt(vArray[0][2].substr(8,2)))+" Wh/Hari");
            $('#price-cons').text("Rp " + price+",-");
            $('#avg-price').text("Rp " + price/vArray[0][2].substr(8, 2)+",-/Hari");
            $('#update-elec').text(timeConvert(vArray[0][2].substr(0, 11)));
        } else {}
    }
    xmlhttp.send();
}

function updateLamp(id, active) {
    var xmlhttp = new XMLHttpRequest();
    console.log(id + " " + active.checked);
    xmlhttp.open("GET", "http://agnosthings.com/" + lamps[id][1] + "/feed?push=active=" + ((active.checked) ? 1 : 0));
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
            console.log('lalalaa')
            var data = JSON.parse(xmlhttp.responseText);
            console.log(data.value);
            Materialize.toast('Lampu ' + lamps[id][0] + " telah " + ((active.checked) ? "dinyalakan" : "dimatikan"), 4000)
        } else if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status < 0) {
            Materialize.toast('Lampu ' + lamps[id][0] + " tidak bisa " + ((active.checked) ? "dinyalakan" : "dimatikan" + ". Periksa koneksi internet dan coba lagi."), 4000)
        }
    }
    xmlhttp.send();
}

function initTemperature() {
    console.log("Init temperature page");
    var ctxKel = document.getElementById("kelChart");
    var ctxKam = document.getElementById("kamChart");
    var kelChart = new Chart(ctxKel, {
        type: 'line',
        data: {
            labels: ["", "", "", "", "", "", "", "", "", ""],
            datasets: [{
                label: 'Celsius',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: "rgba(75,192,192,1)",
                pointBorderColor: "rgba(75,192,192,1)",
                pointRadius: 5
        }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
            }],
            },
            legend: {
                display: false
            }
        }
    });
    var kamChart = new Chart(ctxKam, {
        type: 'line',
        data: {
            labels: ["", "", "", "", "", "", "", "", "", ""],
            datasets: [{
                label: 'Celsius',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: "rgba(75,192,200,1)",
                pointBorderColor: "rgba(75,200,192,1)",
                pointRadius: 5
        }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    display: false,
                    barPercentage: 1.2
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
            }],
            },
            legend: {
                display: false
            }
        }
    });
    getTemp('5ea45d62-1ce3-11e6-8001-005056805279', '404', kelChart);
    getTemp('69dbfd52-1ce3-11e6-8001-005056805279', '405', kamChart);

    window.setInterval(function () {
        getTemp('5ea45d62-1ce3-11e6-8001-005056805279', '404', kelChart);
        getTemp('69dbfd52-1ce3-11e6-8001-005056805279', '405', kamChart);
    }, 60000);
}

function getTemp(guid, id, chart) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://agnosthings.com/" + guid + "/channel/last/feed/" + id + "/10");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status == 200) {
            $('.preloader-wrapper').hide();
            var data = JSON.parse(xmlhttp.responseText);
            var vArray = [];
            data.cValue.reverse();
            chart.data.labels = [];
            chart.data.datasets[0].data = [];
            for (i = 0; i < 10; i++) {
                var value = data.cValue[i];;
                vArray.push(value.split(','));
                chart.data.datasets[0].data.push(vArray[i][1]);
                chart.data.labels.push(vArray[i][2].substr(11, 5));
            }
            if (id == '404') {
                $('#update-kel').text(timeConvert(vArray[0][2].substr(0, 11)));
            } else {
                $('#update-kam').text(timeConvert(vArray[0][2].substr(0, 11)));
            }
            chart.update();
        } else {}
    }
    xmlhttp.send();

}

function initGallon() {
    Materialize.fadeInImage('#gallon-card');
    $('.preloader-wrapper').show();
    var ctxGal = document.getElementById("galonChart");
    var galonChart = new Chart(ctxGal, {
        type: 'doughnut',
        data: {
            labels: ["Sisa", "Habis"],
            datasets: [{
                label: 'Celsius',
                data: [0, 0],
                backgroundColor: [
                    "#40c4ff"
                    , "#e0e0e0"
                ],
                borderWidth: [0, 8]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            }
        }
    });
    updateGallon("f67edfc2-1ce3-11e6-8001-005056805279", galonChart);
}

function updateGallon(guid, chart) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://agnosthings.com/" + guid + "/channel/last/feed/406/1");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
             var vArray = [];
            var value = data.cValue[0];
            vArray.push(value.split(','));
            $('.preloader-wrapper').hide();
            chart.data.datasets[0].data = [vArray[0][1], 19 - vArray[0][1]];
            console.log(timeConvert(vArray[0][2].substr(0, 11)));
            chart.update();
            $('#percentage').text(parseInt((vArray[0][1]/19)*100)+"%");
            $('#progg').text(vArray[0][1] +" / " + 19 +" Liter");
            $('#update-gal').text(timeConvert(vArray[0][2].substr(0, 11)));
        } else {}
    }
    xmlhttp.send();
}

function timeConvert(date) {
    var m = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var d = date.split('-');
    date = new Date(d[0], d[1] - 1, d[2]);
    stringDate = date.getDate() + " " + m[date.getMonth()] + " " + date.getFullYear();
    return stringDate;
}