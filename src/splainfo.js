var https = require('https');
var http = require('http');
var events = require('events')


module.exports = function () {
  
	var splainfo = new events.EventEmitter();

	splainfo.fes_url = 'http://s3-ap-northeast-1.amazonaws.com/splatoon-data.nintendo.net/fes_info.json';
	splainfo.ink_url = 'https://splatoon.ink/schedule.json';
	splainfo.fes_state = -1;
	splainfo.fes = {};
	splainfo.regular = new Array();
	splainfo.ranked = new Array();
	splainfo.ranked_rule = "";
	splainfo.next_regular = new Array();
	splainfo.next_ranked = new Array();
	splainfo.next_ranked_rule = "";

  let body = "";
	http.get(splainfo.fes_url, function(res){
		res.setEncoding('utf8');
		res.on('data', function(chunk){
			body += chunk;
		});


		res.on('end', function(res){
      
      let t = typeof body
			let ret = JSON.parse(body);
			splainfo.fes_state = ret.fes_state;
			splainfo.fes["begin"] = ret.datetime_fes_begin;
			splainfo.fes["end"] = ret.datetime_fes_end;
			splainfo.fes["alpha"] = ret.team_alpha_name;
			splainfo.fes["bravo"] = ret.team_bravo_name;
			if (splainfo.fes_state > 0) {
				splainfo.regular.push(ret["fes_stage"][0]["name"]);
				splainfo.regular.push(ret["fes_stage"][1]["name"]);
				splainfo.regular.push(ret["fes_stage"][2]["name"]);
			}
			if(splainfo.fes_state != 1) {
				https.get(splainfo.ink_url, function(res){
					var body = '';
					res.setEncoding('utf8');

					res.on('data', function(chunk){
						body += chunk;
					});

					res.on('end', function(res){
						let json_info = JSON.parse(body);
						let now_time = (new Date()).getTime();
						let resnum = 0;
						for(var i=0; i<json_info.schedule.length; i++) {
							if (json_info.schedule[i].startTime <= now_time && json_info.schedule[i].endTime >= now_time)
								resnum = i;
						}

						let result = json_info.schedule[resnum];
						let regular = result.regular;
						let ranked = result.ranked;

						splainfo.starttime = result.startTime;
						splainfo.endtime = result.endTime;
						splainfo.regular.push(regular.maps[0]["nameJP"]);
						splainfo.regular.push(regular.maps[1]["nameJP"]);
						splainfo.ranked.push(ranked.maps[0]["nameJP"]);
						splainfo.ranked.push(ranked.maps[1]["nameJP"]);
						splainfo.ranked_rule = ranked.rulesJP;

						if(resnum + 1 < json_info.schedule.length) {

						  result = json_info.schedule[resnum + 1];
							regular = result.regular;
							ranked = result.ranked;
							splainfo.next_starttime = result.startTime;
							splainfo.next_endtime = result.endTime;
							splainfo.next_regular.push(regular.maps[0]["nameJP"]);
							splainfo.next_regular.push(regular.maps[1]["nameJP"]);
							splainfo.next_ranked.push(ranked.maps[0]["nameJP"]);
							splainfo.next_ranked.push(ranked.maps[1]["nameJP"]);
							splainfo.next_ranked_rule = ranked.rulesJP;

						}
						splainfo.emit('done');

					});
				}).on('error', function(e){
					console.log(e.message); 
					splainfo.emit('error');
				});
			}


		});
  }).on('error', function(e){
	  console.log(e.message); 
	  splainfo.emit('error');
  });

  return splainfo;
}

