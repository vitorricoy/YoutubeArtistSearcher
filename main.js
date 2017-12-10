
var ids=[];
var player;
var currentId;

function search() {
  ids=[];
  currentId=0;
  player=null;
  let q = $('#query').val();
  let url='https://www.googleapis.com/youtube/v3/search?part=id&maxResults=50&videoCategoryId=10&type=video&key=AIzaSyCtohEkJ6mCItORJn4nSlC3y2LEuHMxyOs';
  let quantity = $('#quantity').val();
  let tokenAtual=null;
  let novosIds;
  while(Number(quantity)>ids.length){
    novosIds=[];
    console.log(ids.length)
    console.log(quantity);
    $.ajax({
    	url: (url + "&q=" + q + ((tokenAtual==null)?(''):("&pageToken=" + tokenAtual))),
    	type: 'GET',
    	async: false,
    	success: function (jsonLoop) {
			jsonLoop.items.forEach(function(item){
				novosIds.push(item.id.videoId);
			});
			let stringIds = "";
			for(let i=0; i<novosIds.length; i++){
				stringIds+=novosIds[i];
				if(i!=novosIds.length-1){
				  	stringIds+=',';
				}
			}
			let urlDuration = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=AIzaSyCtohEkJ6mCItORJn4nSlC3y2LEuHMxyOs'
			$.ajax({
				url: (urlDuration + "&id=" + stringIds),
				type: 'GET',
				async: false,
				success: function (jsonDuration) {
					novosIds=[];
					jsonDuration.items.forEach(function(item){
					    let duracao = item.contentDetails.duration;
					    duracao = convertISO8601ToSeconds(duracao);
					    if(duracao>=60 && duracao<=600){
					    	novosIds.push(item.id);
					    }
					});
					ids=ids.concat(novosIds);
					tokenAtual=jsonLoop.nextPageToken;
				}
			});
		}
	});
  }
  while(ids.length>quantity){
    ids.pop();
  }
  player = new YT.Player('video-container', {height: '360', width: '640', videoId: currentId, playerVars: { 'autoplay': 1, 'controls': 0 }, events: {'onStateChange': stateChanged, 'onReady:':playerReady}});
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
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

function playerReady(){
	player.loadVideoById({'videoId':currentId, 'suggestedQuality': 'tiny'});
}

function stateChanged(event){
	switch (event.data) {
        case YT.PlayerState.UNSTARTED:
            player.playVideo();
            break;
        case YT.PlayerState.ENDED:
            videoFinished();
            break;
    }
}

function videoFinished(){
	currentId++;
	player.loadVideoById({'videoId':currentId, 'suggestedQuality': 'tiny'});
}