# Google Slides 自動生成（clasp）

`slides-narration.md` をもとに Google スライドを生成する GAS プロジェクトです。

## 初回セットアップ（必須）

### 1. Node.js と clasp を入れる

```bash
npm install -g @google/clasp
```

### 2. Google アカウントでログイン（初回のみ）

```bash
clasp login
```

ブラウザが開くので、スライドと GAS を編集する Google アカウントで認証してください。

### 3. `.gas_env` に URL を書く

```bash
cd gas
cp .gas_env.example .gas_env
```

`.gas_env` を編集し、自分の URL を貼り付けます。

```ini
googleslide_url=https://docs.google.com/presentation/d/xxxxxxxx/edit
googleslide_gaseditor_url=https://script.google.com/home/projects/yyyyyyyy/edit
```

| 項目 | どこからコピーするか |
|------|---------------------|
| `googleslide_url` | Google スライドを開いたときのブラウザ URL |
| `googleslide_gaseditor_url` | スライドの **拡張機能 → Apps Script** で開いた GAS エディタの URL |

`sync-env.js` が URL から ID を自動抽出し、以下を更新します。

- `.clasp.json` → `scriptId`
- `Config.gs` → `PRESENTATION_ID`

## push 手順

### 方法 A: npm スクリプト（推奨）

```bash
cd gas
npm run sync    # .gas_env → .clasp.json / Config.gs に反映のみ
npm run push    # sync + clasp push
```

### 方法 B: シェルスクリプト

```bash
cd gas
bash push.sh        # Git Bash / macOS / Linux
# または
.\push.ps1          # PowerShell
```

## スライド生成（GAS 側）

1. GAS エディタを開く（`.gas_env` の `googleslide_gaseditor_url`）
2. 関数 **`buildPresentation`** を選択
3. **実行** をクリック
4. 初回は Google Slides へのアクセス権限を承認

> **注意**: `buildPresentation` は既存スライドを**すべて削除**してから 12 枚を再生成します。

スライド画面から実行する場合: **プレゼン生成 → スライドを再生成**

## ファイル構成

| ファイル | 役割 |
|---------|------|
| `.gas_env` | 自分のスライド URL / GAS URL（**git 管理外**） |
| `.gas_env.example` | `.gas_env` のテンプレート |
| `sync-env.js` | `.gas_env` から ID を抽出して設定反映（**GAS には push されない**） |
| `.claspignore` | push 対象外ファイルの指定 |
| `push.sh` / `push.ps1` | sync + clasp push |
| `package.json` | `npm run sync` / `npm run push` |
| `Code.gs` | エントリポイント |
| `Config.gs` | プレゼン ID・テーマ色 |
| `SlideData.gs` | 12 枚分のスライド定義 |
| `SlideBuilder.gs` | レイアウト描画 |
| `.clasp.json` | clasp 設定（`sync` で自動更新） |
| `appsscript.json` | GAS マニフェスト |

## 主な関数（GAS）

| 関数 | 説明 |
|------|------|
| `buildPresentation` | 全スライド再生成（本番用） |
| `appendSlidesOnly` | 既存スライドを残して末尾に追加 |
| `buildTestSlide` | タイトル 1 枚だけ追加 |
| `showConfig` | 設定をログ出力 |

## カスタマイズ

- スライド文言: `SlideData.gs`
- 色・フォント: `Config.gs` の `THEME`
- 別のスライドに切り替え: `.gas_env` の URL を変更 → `npm run push`

## トラブルシュート

### `Syntax error: sync-env.gs` などが出る

`sync-env.js` が誤って GAS に push された状態です。

1. `.claspignore` が存在することを確認（リポジトリに含まれています）
2. GAS エディタで **sync-env** ファイルがあれば手動で削除
3. 再度 `npm run push` または `.\push.ps1`

push 対象は `Code.gs`, `Config.gs`, `SlideData.gs`, `SlideBuilder.gs`, `appsscript.json` のみです。

### `clasp push` が失敗する

```bash
clasp login
clasp status
npm run sync
npm run push
```

### `.gas_env がありません`

```bash
cp .gas_env.example .gas_env
# URL を編集
```

### URL から ID を取得できない

URL が途中で切れていないか確認してください。  
スライド: `/presentation/d/【ここがID】/edit`  
GAS: `/projects/【ここがID】/edit`

### 権限エラー（GAS 実行時）

実行時に「承認が必要」と出たら、自分の Google アカウントで承認。

### フォントが崩れる

`Config.gs` の `fontFamily` を `Arial` や `Meiryo` に変更。
