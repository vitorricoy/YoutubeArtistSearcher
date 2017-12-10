
var ids=[];

function search() {
  ids=[];
  let q = $('#query').val();
  let url='https://www.googleapis.com/youtube/v3/search?part=id&maxResults=50&videoCategoryId=10&type=video&key=AIzaSyCtohEkJ6mCItORJn4nSlC3y2LEuHMxyOs';
  let quantity = $('#quantity').val();
  $.getJSON(url + "&q=" + q, function (json) {
  	json.items.forEach(function(item){
  		ids.push(item.id.videoId);
  	});
  	console.log(ids);
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
    	console.log(ids);
    	let tokenAtual=json.nextPageToken;
    	let novosIds;
    	while(quantity>ids.length){
    		console.log(ids);
    		novosIds=[];
    		$.getJSON(url + "&q=" + q + "&pageToken=" + tokenAtual, function (jsonLoop) {
			  	jsonLoop.items.forEach(function(item){
			  		novosIds.push(item.id.videoId);
			  	});
			  	console.log(novosIds);
			  	let stringIds = "";
			  	for(let i=0; i<ids.length; i++){
			  		stringIds+=ids[i];
			  		if(i!=ids.length-1){
			  			stringIds+=',';
			  		}
			  	}
			  	let urlDuration = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=AIzaSyCtohEkJ6mCItORJn4nSlC3y2LEuHMxyOs'
			    $.getJSON(urlDuration + "&id=" + stringIds, function (jsonDuration) {
			    	novosIds=[];
			    	jsonDuration.items.forEach(function(item){
			    		let duracao = item.contentDetails.duration;
			    		duracao = convertISO8601ToSeconds(duracao);
			    		if(duracao>=60 && duracao<=600){
			    			novosIds.push(item.id);
			    		}
			    	});
			    	console.log(novosIds);
			    	ids.concat(novosIds);
			    	tokenAtual=jsonLoop.nextPageToken;
			    });
			});
			sleep(1000);
			console.log('fim sleep');
    	}
    	while(ids.length>quantity){
    		ids.pop();
    	}
    });
  });
  console.log(ids);
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