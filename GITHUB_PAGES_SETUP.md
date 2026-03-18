# GitHub Pagesセットアップガイド

このプロジェクトの仕様書をGitHub Pagesで公開するための簡単なガイドです。

## 📦 準備完了

`docs/` フォルダには、以下のドキュメントがすでに準備されています：

- ✅ トップページ (`index.md`)
- ✅ 要件定義書 (`requirements.md`)
- ✅ 業務フロー設計 (`business-flow.md`)
- ✅ 使い方ガイド (`user-guide.md`)
- ✅ README (`readme.md`)
- ✅ Jekyll設定 (`_config.yml`)
- ✅ カスタムレイアウト (`_layouts/default.html`)

## 🚀 3ステップで公開

### ステップ1: GitHubリポジトリにプッシュ

```bash
# まだGitリポジトリを初期化していない場合
git init

# すべてのファイルを追加
git add .

# コミット
git commit -m "Add documentation site for GitHub Pages"

# GitHubリポジトリをリモートとして追加
# ⚠️ YOUR_USERNAME と chocolate-delivery-app を実際の値に変更してください
git remote add origin https://github.com/YOUR_USERNAME/chocolate-delivery-app.git

# プッシュ
git branch -M main
git push -u origin main
```

### ステップ2: GitHub Pagesを有効化

1. GitHubでリポジトリページを開く
2. 「Settings」タブをクリック
3. 左サイドバーの「Pages」をクリック
4. 「Source」で以下を選択：
   - **Branch**: `main`
   - **Folder**: `/docs`
5. 「Save」をクリック

### ステップ3: 公開されたサイトを確認

数分後、以下のURLでアクセスできます：

```
https://YOUR_USERNAME.github.io/chocolate-delivery-app/
```

## 📝 公開後にURLを更新

公開が完了したら、以下のファイル内の `YOUR_USERNAME` を実際のGitHubユーザー名に変更してください：

1. **README.md** - ドキュメントセクションのリンク
2. **docs/_config.yml** - baseurl と url
3. **docs/DEPLOY.md** - デプロイガイドのURL例

例：
```bash
# READMEのリンクを更新
sed -i '' 's/YOUR_USERNAME/your-actual-username/g' README.md

# docs内のリンクを更新
sed -i '' 's/YOUR_USERNAME/your-actual-username/g' docs/index.md
```

## 🎨 カスタマイズ

### テーマを変更する

`docs/_config.yml` を編集：

```yaml
theme: jekyll-theme-cayman  # 他のテーマに変更可能
```

**利用可能なテーマ:**
- `jekyll-theme-cayman` (現在のテーマ)
- `jekyll-theme-slate`
- `jekyll-theme-minimal`
- `jekyll-theme-architect`

### サイトタイトルを変更する

`docs/_config.yml` を編集：

```yaml
title: あなたのタイトル
description: あなたの説明
```

### ナビゲーションメニューを変更する

`docs/_layouts/default.html` の `<nav>` セクションを編集

## ❓ トラブルシューティング

### ページが404エラーになる

- GitHub Pagesの設定で `/docs` フォルダが選択されているか確認
- 数分待ってから再度アクセス
- ブラウザのキャッシュをクリア

### スタイルが適用されない

- `_config.yml` のテーマ設定を確認
- ブラウザの開発者ツールでCSSファイルの読み込みを確認

### GitHubで設定が見つからない

- リポジトリがパブリックになっているか確認
- GitHubアカウントがGitHub Pagesを利用できるか確認

## 📚 詳細情報

さらに詳しい情報は [docs/DEPLOY.md](./docs/DEPLOY.md) を参照してください。

---

**サポートが必要な場合**: GitHubの Issues を作成してください
