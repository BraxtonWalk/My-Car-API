window.onload = function(){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            var json = JSON.parse(this.responseText);
            var years = json['years'];
            var yearDropdown = document.getElementById("year_dropdown");
            yearDropdown.innerHTML = "";

            for(var i=0; i<years.length; i++){
                var option = document.createElement("option");
                option.value = years[i];
                option.innerHTML = years[i];
                yearDropdown.options[i] = option;
            }
        }
    };

    xhttp.open("GET", "/api/years", true);
    xhttp.send();
}


function onSelectYear(select){
    year = select.value;

    resetDropdowns();

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            var json = JSON.parse(this.responseText);
            var makes = json['makes'];

            var makeDropdown = document.getElementById('make_dropdown');
            makeDropdown.innerHTML = "";

            for(var i=0; i<makes.length; i++){
                var option = document.createElement("option");
                option.value = makes[i];
                option.innerHTML = makes[i];
                makeDropdown.options[i] = option;
            }
        }
    };

    xhttp.open("POST", "/api/makes", true);
    xhttp.setRequestHeader("Content-Type", "application/json"); //need this for it to work (i looked it up)
    xhttp.send(JSON.stringify({year: year}));
}


function onSelectMake(select){
    year = document.getElementById('year_dropdown').value;
    make = select.value;

    var single_value = false;

    carInfo = document.getElementById('car_info');
    carInfo.innerHTML = "";
    QRCode = document.getElementById('QR_code');
    QRCode.src = "";

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            var json = JSON.parse(this.responseText);
            var models = json['models'];

            var modelDropdown = document.getElementById('model_dropdown');
            modelDropdown.innerHTML = "";

            for(var i=0; i<models.length; i++){
                var option = document.createElement("option");
                option.value = models[i];
                option.innerHTML = models[i];
                modelDropdown.options[i] = option;
            }

            if(modelDropdown.options.length == 1){
                var model = modelDropdown.options[0];
                single_value = true;
                onSelectModel(model);
            }
        }
    };

    xhttp.open("POST", "/api/models", true);
    xhttp.setRequestHeader("Content-Type", "application/json"); //need this to run
    xhttp.send(JSON.stringify({year: year, make: make}));
}


function onSelectModel(select){
    year = document.getElementById('year_dropdown').value;
    make = document.getElementById('make_dropdown').value;
    model = select.value;

    carInfo = year + ": " + make + " -> " + model;
    document.getElementById('car_info').innerHTML = carInfo;

    var request = "https://image-charts.com/chart?chs=150x150&cht=qr&chl=" + carInfo + "&choe=UTF-8"

    var img = document.getElementById("QR_code");
    img.src = request;
}


function resetDropdowns(){
    makeDropdown = document.getElementById('make_dropdown');
    makeDropdown.innerHTML = "";

    modelDropdown = document.getElementById('model_dropdown');
    modelDropdown.innerHTML = "";

    carInfo = document.getElementById('car_info');
    carInfo.innerHTML = "";

    QRCode = document.getElementById('QR_code');
    QRCode.src = "";
}