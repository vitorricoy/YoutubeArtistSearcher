
function search() {
  let q = $('#query').val();
  let url='https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&videoCategoryId=10&type=video&key=AIzaSyCtohEkJ6mCItORJn4nSlC3y2LEuHMxyOs';
  let quantity = $('#quantity').val();
  $.getJSON(url + "&q=" + q, function (json) {
  	console.log(json);
    
  });
}