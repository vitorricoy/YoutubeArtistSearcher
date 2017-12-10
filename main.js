
function search() {
  let q = $('#query').val();
  let url='https://www.googleapis.com/youtube/v3/search?part=snippet&videoCategoryId=10&type=video&key=AIzaSyCtohEkJ6mCItORJn4nSlC3y2LEuHMxyOs'
  $.getJSON(url + "&q=" + q, function (json) {
  	var str = JSON.stringify(response.result);
    $('#search-container').html('<pre>' + str + '</pre>');
  }
}