
  var gmap = document.querySelector('google-map');
  gmap.addEventListener('api-load', function(e) {
    document.querySelector('google-map-directions').map = this.map;
  });
