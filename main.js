
var ids=[];

function search() {
  let q = $('#query').val();
  let url='https://www.googleapis.com/youtube/v3/search?part=id&maxResults=50&videoCategoryId=10&type=video&key=AIzaSyCtohEkJ6mCItORJn4nSlC3y2LEuHMxyOs';
  let quantity = $('#quantity').val();
  $.getJSON(url + "&q=" + q, function (json) {
  	json.items.forEach(function(item){
  		ids.push(item.id.videoId);
  	});
  	console.log(ids);
  	refreshBasedInDurations();
  	SetTimeout(function(){
  		console.log(ids);
  	}, 500);
  	
  });
}

function refreshBasedInDurations(){
  	let stringIds = "";
  	for(let i=0; i<ids.length; i++){
  		stringIds+=ids[i];
  		if(i!=ids.length-1){
  			stringIds+=',';
  		}
  	}
  	let urlDuration = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=AIzaSyCtohEkJ6mCItORJn4nSlC3y2LEuHMxyOs'
    $.getJSON(urlDuration + "&id=" + stringIds, function (jsonDuration) {
    	ids=[];
    	jsonDuration.items.forEach(function(item){
    		let duracao = item.contentDetails.duration;
    		duracao = convertISO8601ToSeconds(duracao);
    		if(duracao>=60 && duracao<=600){
    			ids.push(item.id);
    		}
    	});
    });
}

function convertISO8601ToSeconds(input) {
    let reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    let hours = 0, minutes = 0, seconds = 0, totalseconds;
    if (reptms.test(input)) {
        let matches = reptms.exec(input);
        if (matches[1]) hours = Number(matches[1]);
        if (matches[2]) minutes = Number(matches[2]);
        if (matches[3]) seconds = Number(matches[3]);
        totalseconds = hours * 3600  + minutes * 60 + seconds;
    }
    return totalseconds;
}