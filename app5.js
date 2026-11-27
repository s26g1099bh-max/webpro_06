const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

app.get("/keiyo", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('db1', { data: station });
});

app.get("/keiyo_add", (req, res) => {
  let id = req.query.id;
  let code = req.query.code;
  let name = req.query.name;
  let newdata = { id: id, code: code, name: name };
  station.push( newdata );
  // 【確認結果】登録後は redirect(入力画面へ) ではなく render(一覧へ) を採用した．
  // 理由: 追加できたかをその場で確認でき，連続登録でなければ一覧を見たい場面が多いため．
  // 注意: render だとURLが /keiyo_add?... のまま残り，再読み込みで二重登録される．
  //       redirect なら再読み込みしても入力画面を再取得するだけで二重登録されない．
  res.render('db1', { data: station });
});

let music = [
  { id:1, title:"Lemon", artist:"米津玄師", year:2018 },
  { id:2, title:"夜に駆ける", artist:"YOASOBI", year:2019 },
  { id:3, title:"小さな恋のうた", artist:"MONGOL800", year:2001 },
  { id:4, title:"粉雪", artist:"レミオロメン", year:2005 },
];

app.get("/music", (req, res) => {
  res.render('music', { data: music });
});

app.get("/music_add", (req, res) => {
  // id は入力させず，既存の最大値+1 を自動採番する（重複入力を防ぐため）
  const id = music.reduce( (max, m) => Math.max( max, m.id ), 0 ) + 1;
  const newdata = {
    id: id,
    title: req.query.title,
    artist: req.query.artist,
    year: Number( req.query.year )
  };
  music.push( newdata );
  // 8-1 で選んだ方針と同じく，登録後は一覧を表示する
  res.render('music', { data: music });
});

let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:0 },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:1.2 },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:7.4 },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:12.7 },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:28.3 },
  { id:6, code:"JE17", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:39.0 },
  { id:7, code:"JE18", name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:43.0 },
];

app.get("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('keiyo2', {data: station2} );
});

// Create
app.get("/keiyo2/create", (req, res) => {
  res.redirect('/public/keiyo2_new.html');
});

// Read
app.get("/keiyo2/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  // 範囲外や数字以外だと detail が undefined になり，テンプレートで例外(500)になるため先に弾く
  if( detail === undefined ) {
    return res.status(404).send( '該当する駅がありません．<a href="/keiyo2">駅一覧に戻る</a>' );
  }
  res.render('keiyo2_detail', {id: number, data: detail} );
});

// Create
app.post("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  // スライドは length+1 だが，削除後に id が重複するので 9-3 と同じく最大値+1 にした
  const id = station2.reduce( (max, s) => Math.max( max, s.id ), 0 ) + 1;
  const code = req.body.code;
  const name = req.body.name;
  const change = req.body.change || "";
  const passengers = Number( req.body.passengers );
  const distance = Number( req.body.distance );
  station2.push( { id: id, code: code, name: name, change: change, passengers: passengers, distance: distance } );
  console.log( station2 );
  res.render('keiyo2', {data: station2} );
});

// Edit
app.get("/keiyo2/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  if( detail === undefined ) {
    return res.status(404).send( '該当する駅がありません．<a href="/keiyo2">駅一覧に戻る</a>' );
  }
  res.render('keiyo2_edit', {id: number, data: detail} );
});

// Update
app.post("/keiyo2/update/:number", (req, res) => {
  // 本来は各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  if( station2[number] === undefined ) {
    return res.status(404).send( '該当する駅がありません．<a href="/keiyo2">駅一覧に戻る</a>' );
  }
  station2[number].code = req.body.code;
  station2[number].name = req.body.name;
  station2[number].change = req.body.change;
  station2[number].passengers = Number( req.body.passengers );
  station2[number].distance = Number( req.body.distance );
  console.log( station2 );
  res.redirect('/keiyo2' );
});

// Delete
app.get("/keiyo2/delete/:number", (req, res) => {
  // 本来は削除の確認ページを表示する
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  // 数字以外だと splice が 0 番目を消してしまうので，存在しない番号は弾く
  if( station2[number] === undefined ) {
    return res.status(404).send( '該当する駅がありません．<a href="/keiyo2">駅一覧に戻る</a>' );
  }
  station2.splice( number, 1 );
  res.redirect('/keiyo2' );
});

app.get("/keiyo2_add", (req, res) => {
  // 数値項目は query では文字列で届くので Number に変換して保存する
  // id は一覧の並び（URLの番号は配列の添字）と無関係に，最大値+1 を自動採番する
  const id = station2.reduce( (max, s) => Math.max( max, s.id ), 0 ) + 1;
  const newdata = {
    id: id,
    code: req.query.code,
    name: req.query.name,
    change: req.query.change || "",
    passengers: Number( req.query.passengers ),
    distance: Number( req.query.distance )
  };
  station2.push( newdata );
  // 8-1 で選んだ方針と同じく，登録後は一覧を表示する
  res.render('keiyo2', {data: station2} );
});

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.render( 'omikuji2', {result:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  let judgement = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 以下の数行は人間の勝ちの場合の処理なので，
  // 判定に沿ってあいこと負けの処理を追加する
  judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

// ラジオボタン版のじゃんけん（/janken は課題条件により変更しない）
app.get("/janken2", (req, res) => {
  const hands = ['グー', 'チョキ', 'パー'];
  const hand = req.query.hand;
  const yourIndex = hands.indexOf( hand );
  if( yourIndex < 0 ) {
    // ラジオボタン未選択や手動入力の不正値
    return res.status(400).send( '手を選んでください．<a href="/public/janken2.html">戻る</a>' );
  }
  // 直接URLを叩かれて win / total が無い場合は NaN になるので 0 とみなす
  let win = Number( req.query.win ) || 0;
  let total = Number( req.query.total ) || 0;
  const cpuIndex = Math.floor( Math.random() * 3 );
  // グー(0)<チョキ(1)<パー(2)<グー の循環なので，差を3で割った余りで判定できる
  const diff = ( yourIndex - cpuIndex + 3 ) % 3;
  let judgement = '';
  if( diff === 0 ) judgement = 'あいこ';
  else if( diff === 2 ) { judgement = '勝ち'; win += 1; }  // グーに対してチョキ: 0-1+3=2
  else judgement = '負け';
  total += 1;
  res.render( 'janken2', { your: hand, cpu: hands[cpuIndex], judgement, win, total } );
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
