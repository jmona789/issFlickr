$(document).ready(function() {
  $(".btn-default").on("click", function(e){
    e.preventDefault();
    var userAddress = $("#userAddress").val();
    var googleApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?";
    googleApiUrl += "key=AIzaSyB2GSm2xmpapNi7O6xAE2mMpb1PSWNiNFA";
    googleApiUrl += "&address=" + userAddress;

    $.ajax({
      type: "GET",
      url: googleApiUrl,
      success: googleApiSuccessHandler
    });
  });

  function buildThumbnail(photoData) {
    var photoUrl = "https://farm" + photoData.farm;
    photoUrl += ".staticflickr.com/" + photoData.server;
    photoUrl += "/" + photoData.id;
    photoUrl += "_" + photoData.secret + ".jpg";

    var colDiv = $("<div>").addClass("col-md-3");
    var thumbnailDiv = $("<div>").addClass("thumbnail");
    var photoImg = $("<img>").attr("src", photoUrl);
    var captionDiv = $("<div>").addClass("caption");
    var picTitle = $("<p>").append(photoData.title);

    colDiv.append(thumbnailDiv
      .append(photoImg)
      .append(captionDiv
        .append(picTitle)
      )
    );

    return colDiv;

  }

  function googleApiSuccessHandler(response) {

    var geoLocation = response.results[0].geometry.location;
    var flickrApiUrl = "https://api.flickr.com/services/rest/?";
    var flickrApiParams = {
      api_key: "5d0b99b598780adb1ce7f682110a03e6",
      method: "flickr.photos.search",
      format: "json",
      nojsoncallback: 1,
      lat: geoLocation.lat,
      lon: geoLocation.lng
    }
    
    $.ajax({
      type: "GET",
      url: flickrApiUrl + $.param(flickrApiParams),
      success: flickrSuccessHandler
    });

    var lat = geoLocation.lat
    var lng = geoLocation.lng

    $.getJSON("http://api.open-notify.org/iss-pass.json?lat=" + lat + "&lon=" + lng + "&alt=20&n=5&callback=?", function(data) {
      data["response"].forEach(function (d) {
      var date = new Date(d['risetime']*1000);
      $("#isspass").append("<li>" + date.toString() + "</li>");
    });
  })

  function flickrSuccessHandler(response) {
    var locationPhotos = response.photos.photo;
    for(var i = 0; i < locationPhotos.length; i++) {
      var newCol = buildThumbnail(locationPhotos[i]);
      $("#photosRow").append(newCol);
    }
  }
});