
var ids=[];
var names=[];
var player=null;
var currentId;

function search() {
  ids=[];
  names=[];
  currentId=0;
  if(player!=null){
    player.destroy();
  }
  let q = $('#query').val();
  let url='https://www.googleapis.com/youtube/v3/search?part=id&maxResults=50&videoCategoryId=10&type=video&key=AIzaSyCtohEkJ6mCItORJn4nSlC3y2LEuHMxyOs';
  let quantity = $('#quantity').val();
  let tokenAtual=null;
  let newIds=[];
  let newNames=[];
  while(Number(quantity)>ids.length){
    $.ajax({
    	url: (url + "&q=" + q + ((tokenAtual==null)?(''):("&pageToken=" + tokenAtual))),
    	type: 'GET',
    	async: false,
    	success: function (jsonLoop) {
  			jsonLoop.items.forEach(function(item){
  				newIds.push(item.id.videoId);
  			});
  			let stringIds = "";
  			for(let i=0; i<newIds.length; i++){
  				stringIds+=newIds[i];
  				if(i!=newIds.length-1){
  				  	stringIds+=',';
  				}
  			}
  			let urlDuration = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&key=AIzaSyCtohEkJ6mCItORJn4nSlC3y2LEuHMxyOs'
  			$.ajax({
  				url: (urlDuration + "&id=" + stringIds),
  				type: 'GET',
  				async: false,
  				success: function (jsonDuration) {
  					newIds=[];
            newNames=[];
  					jsonDuration.items.forEach(function(item){
  					    let duracao = item.contentDetails.duration;
  					    duracao = convertISO8601ToSeconds(duracao);
  					    if(duracao>=60 && duracao<=600){
  					    	newIds.push(item.id);
                  newNames.push(item.snippet.title);
  					    }
  					});
  					ids=ids.concat(newIds);
            names=names.concat(newNames);
  					tokenAtual=jsonLoop.nextPageToken;
  				}
  			});
  		}
	  });
  }
  while(ids.length>quantity){
    ids.pop();
  }
  names.forEach(function(item, index){
    $('#playlist').append(`<li class="list-group-item" id="item${index}"><a href="javascript:changeVideo(${index})">${item}</a></li>`);
  });
  $(`item0`).addClass('active');
  $('#playlist').removeClass('invisible');
  player = new YT.Player('video-container', {host: 'https://www.youtube.com', videoId: ids[currentId], playerVars: { 'autoplay': 1, 'controls': 1}, events: {'onStateChange': stateChanged, 'onReady:':playerReady}});
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
	player.loadVideoById({'videoId':ids[currentId], 'suggestedQuality': 'tiny'});
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
  if(currentId==ids.length){
    currentId=0;
  }
	player.loadVideoById({'videoId':ids[currentId], 'suggestedQuality': 'tiny'});
}