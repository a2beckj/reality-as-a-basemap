var latitude, longitude, scene = null;
var buslinesLayer = new L.FeatureGroup();

function initBuslines(lat, lon) {
    latitude = lat;
    longitude = lon;
    scene = $('a-scene')[0];
}

function getBusLineOfBusStop(busStop) {
    console.log(busStop);
    var nr = busstop.properties.nr;
    var conterra_url = "https://rest.busradar.conterra.de/prod/haltestellen" + "/" + nr + "/abfahrten?sekunden=" + 1600;

    $.ajax({
        dataType: "json",
        url: conterra_url,
        data: {},
        success: function (data) {
            if (data.length > 0) {
                var fahrtbezeichner = data[0].fahrtbezeichner;
                getLineString(fahrtbezeichner);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function getLineString(fahrtbezeichner) {
    var busLines = [];
    var url = "https://rest.busradar.conterra.de/prod/fahrten/" + fahrtbezeichner;
    $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: function (data) {
            busLineToMap(data);
            busLines.push(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
    filterBusLine(busLines[0]);
}

function filterBusLine(busLine) {
    console.log(busLine);
}

function busLineToMap(busLine) {
    const lineStyle = {
        "color": "green",
        "weight": 5,
        "opacity": 0.9
    }

    var popup = busLineToPopup(busLine);

    buslinesLayer.addLayer(L.geoJSON(busLine, {
        onEachFeature: (feature, line) => {
            line.bindPopup(popup);
        },
        style: lineStyle
    }));
    map.addLayer(buslinesLayer);
}

/**
 * This function takes a single bus line and creates the html content to show within the marker's popup
 * @param {GeoJSON} busStop - A single bus stop in GeoJSON format
 */
function busLineToPopup(busLine) {
    var id = busLine.properties.linienid;
    var direction = busLine.properties.richtungstext;
    var delay = busLine.properties.delay;

    var html = '<i class="fas fa-bus fa-3x"></i><br><br><h4>Linie ' + id
        + '</h4><br><i class="fas fa-map-signs fa-2x"></i><h7>' + direction
        + '</h7><br><i class="far fa-clock fa-2x"></i><h7>' + delay + ' </h7>';

    return html;
}
