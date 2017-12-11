
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
                  let repetida=false;
                  names.forEach(function(itemName){
                    if(Math.round(similarity(item.snippet.title,itemName)*10000)/100>=50){
                      repetida=true;
                    }
                  });
                  newNames.forEach(function(itemName){
                    if(Math.round(similarity(item.snippet.title,itemName)*10000)/100>=50){
                      repetida=true;
                    }
                  });
                  if(!repetida){
                    newIds.push(item.id);
                    newNames.push(item.snippet.title);
                  }
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
    names.pop();
  }
  $('#playlist').html('');
  names.forEach(function(item, index){
    $('#playlist').append(`<li class="list-group-item" id="item${index}"><a href="javascript:changeVideo(${index})">${item}</a></li>`);
  });
  $(`#item0`).addClass('active');
  $('#playlist').removeClass('invisible');
  player = new YT.Player('video-container', {host: 'https://www.youtube.com', videoId: ids[currentId], playerVars: { 'autoplay': 1, 'controls': 1}, events: {'onStateChange': stateChanged, 'onReady:':playerReady}});
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

function similarity(s1, s2) {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  let longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  let costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
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
  next();
}

function changeVideo(n){
  $(`#item${currentId}`).removeClass('active');
  $(`#item${n}`).addClass('active');
  currentId=n;
  player.loadVideoById({'videoId':ids[currentId], 'suggestedQuality': 'tiny'});
}

function next(){
  $(`#item${currentId}`).removeClass('active');
  currentId++;
  if(currentId==ids.length){
    currentId=0;
  }
  $(`#item${currentId}`).addClass('active');
  player.loadVideoById({'videoId':ids[currentId], 'suggestedQuality': 'tiny'});
}

function previous(){
  $(`#item${currentId}`).removeClass('active');
  currentId--;
  if(currentId==-1){
    currentId=ids.length-1;
  }
  $(`#item${currentId}`).addClass('active');
  player.loadVideoById({'videoId':ids[currentId], 'suggestedQuality': 'tiny'});
}

function shuffle(){
  shuffleIdsAndNames();
}

function shuffleIdsAndNames() {
    currentId=0;
    for(let i = ids.length-1; i>0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        let temp = ids[i];
        ids[i] = ids[j];
        ids[j] = temp;
        temp = names[i];
        names[i] = names[j];
        names[j] = temp;
    }
    $('#playlist').html('');
    names.forEach(function(item, index){
      $('#playlist').append(`<li class="list-group-item" id="item${index}"><a href="javascript:changeVideo(${index})">${item}</a></li>`);
    });
    $(`#item0`).addClass('active');
    $('#playlist').removeClass('invisible');
    player.loadVideoById({'videoId':ids[currentId], 'suggestedQuality': 'tiny'});
}