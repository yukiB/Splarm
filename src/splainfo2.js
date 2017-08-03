var https = require('https');
var http = require('http');
var events = require('events');

const areaDict = {'The Reef': "バッテラストリート", 'Musselforge Fitness': "フジツボスポーツクラブ", 
                  'Inkblot Art Academy': "海女美術大学", 'Humpback Pump Track': "コンブトラック", 
                  'Starfish Mainstage': "ガンガゼ野外音楽堂", 'Sturgeon Shipyard': "チョウザメ造船", 'Port Mackerel': "ホッケふ頭", 'Moray Towers': "タチウオパーキング"};

const ruleDict = {'Tower Control': "ガチヤグラ", 'Splat Zones': "ガチエリア", 'Rainmaker': "ガチホコ"};

export const dictComp = (array, keyMaker=null, valueMaker=null) =>
array.reduce((obj, x) => Object.assign(obj, { [(keyMaker==null ? x : keyMaker(x))]: (valueMaker == null ? x : valueMaker(x)) }), {})

module.exports = function () {
  var splainfo = new events.EventEmitter();
  splainfo.ink_url = 'https://splatoon2.ink/data/schedules.json';
  let body = "";
  https.get(splainfo.ink_url, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function (res) {
      let json_info = JSON.parse(body);
      let now_time = (new Date()).getTime();
      let resnum = 0;
      let schedule_num = json_info['regular'].length;
      let schedules = [];
      for (let i = 0; i < schedule_num; i++) {
        let data = dictComp(['regular', 'gachi', 'league'], null, (n) => ['stage_a', 'stage_b'].map((s) => {
          let name = json_info[n][i][s]['name']; 
          let jpName = areaDict[name]; return jpName ? jpName : name;}))
        data['gachiRule'] = ruleDict[json_info['gachi'][i]['rule']['name']];
        data['leagueRule'] = ruleDict[json_info['league'][i]['rule']['name']];
        data['start'] = json_info['regular'][i]['start_time'];
        data['end'] = json_info['regular'][i]['end_time'];
        schedules.push(data);
      }
      splainfo.data = schedules;
      splainfo.emit('done');
    });
  }).on('error', function (e) {
    console.log(e.message);
    splainfo.emit('error');
  });
  return splainfo;
}