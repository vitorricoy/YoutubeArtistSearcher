
var ids=[];

function search() {
  let q = $('#query').val();
  let url='https://www.googleapis.com/youtube/v3/search?part=id&maxResults=50&videoCategoryId=10&type=video&key=AIzaSyCtohEkJ6mCItORJn4nSlC3y2LEuHMxyOs';
  let quantity = $('#quantity').val();
  $.getJSON(url + "&q=" + q, function (json) {
  	json.items.forEach(function(item){
  		ids.push(item.id.videoId);
  	});
  	let stringIds = ""
  	for(let i=0; i<ids.length; i++){
  		stringIds+=ids[i];
  		if(i!=ids.length-1){
  			stringIds+=',';
  		}
  	}
    console.log(stringIds);
  });
}