function init() {

  var url = "https://bikeshare.metro.net/stations/json/"

  d3.json(url).then(function(responds) {

      //console.log(data.features)

      var names = responds.features.map(d => d.properties.name)

      for (var i=0; i< names.length; i++) {

        //var arr = data.features.name

        // console.log(names[i]);
        var nameSelect = document.getElementById("station_dropdownSelect")
        var nameOpt = names[i]
        var elemNames = document.createElement("option");
        elemNames.textContent = nameOpt;
        elemNames.value = nameOpt;
        nameSelect.appendChild(elemNames);

      }

    })
}

// // Dashboard stations live status info panel

// function buildLiveStatus(name) {
//   document.getElementById("station_dropdownSelect").value = name

//   d3.json(url).then((data) => {
//     var $data = d3.select("#panel-status");
//     $data.html("");
//     Object.entries(data[0]).forEach(([key,value]) =>{
//     $data.append("h6").text(`${key}: ${value}`);

//     });
//   });
// }

// function changeStation(newStation) {
//   buildLiveStatus(newStation);
// }

init();
