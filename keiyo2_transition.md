# 京葉線アプリ（keiyo2）のページ遷移図（10-2）

スライド18ページの図をもとに，自分の実装に合わせて書いた．
削除は詳細ページから行うことにした．どの駅を消すのか中身を見てから消せるので，一覧から直接消すより間違いが少ないと考えた．

```mermaid
flowchart LR
  list["一覧<br>GET /keiyo2"]
  detail["詳細表示<br>GET /keiyo2/:number"]
  edit["編集<br>GET /keiyo2/edit/:number"]
  update["更新処理<br>POST /keiyo2/update/:number"]
  create["新規登録<br>GET /keiyo2/create<br>(keiyo2_new.html)"]
  add["新規登録処理<br>POST /keiyo2"]
  del["削除処理<br>GET /keiyo2/delete/:number"]

  list --> detail
  detail --> list
  detail --> edit
  edit --> update
  edit --> list
  update -- redirect --> list
  list --> create
  create --> add
  create --> list
  add -- 一覧を表示 --> list
  detail --> del
  del -- redirect --> list
```

- `:number` は配列 station2 の添字で，駅の id とは別もの．削除すると後ろの駅の添字がずれるが，一覧から毎回リンクし直すので問題はない．
- 存在しない番号で詳細・編集・更新・削除にアクセスした場合は 404 を返し，一覧へのリンクを出す．
