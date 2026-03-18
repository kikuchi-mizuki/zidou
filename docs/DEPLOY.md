# GitHub Pagesへのデプロイ方法

このドキュメントは、GitHub Pagesを使ってプロジェクトの仕様書を公開する方法を説明します。

## 前提条件

- GitHubアカウントを持っている
- このリポジトリをGitHubにプッシュしている

## デプロイ手順

### 1. GitHubリポジトリの作成とプッシュ

まだGitHubリポジトリを作成していない場合：

```bash
# Gitリポジトリの初期化
git init

# すべてのファイルを追加
git add .

# 初回コミット
git commit -m "Initial commit: チョコレート卸向け納品計画WEBアプリ"

# GitHubリポジトリをリモートとして追加（URLは自分のリポジトリに変更）
git remote add origin https://github.com/YOUR_USERNAME/chocolate-delivery-app.git

# プッシュ
git branch -M main
git push -u origin main
```

### 2. GitHub Pagesの有効化

1. GitHubでリポジトリページを開く
2. 「Settings」タブをクリック
3. 左サイドバーから「Pages」を選択
4. 「Source」セクションで以下を設定：
   - **Source**: Deploy from a branch
   - **Branch**: `main` (または `master`)
   - **Folder**: `/docs`
5. 「Save」をクリック

### 3. 公開確認

数分後、以下のURLでドキュメントサイトが公開されます：

```
https://YOUR_USERNAME.github.io/chocolate-delivery-app/
```

## ドキュメント構成

公開されるページ：

- **トップページ**: https://YOUR_USERNAME.github.io/chocolate-delivery-app/
- **要件定義書**: https://YOUR_USERNAME.github.io/chocolate-delivery-app/requirements
- **業務フロー設計**: https://YOUR_USERNAME.github.io/chocolate-delivery-app/business-flow
- **使い方ガイド**: https://YOUR_USERNAME.github.io/chocolate-delivery-app/user-guide
- **README**: https://YOUR_USERNAME.github.io/chocolate-delivery-app/readme

## カスタマイズ

### テーマの変更

`docs/_config.yml` でテーマを変更できます：

```yaml
theme: jekyll-theme-cayman  # 他のテーマに変更可能
```

利用可能なテーマ：
- `jekyll-theme-cayman`
- `jekyll-theme-minimal`
- `jekyll-theme-slate`
- `jekyll-theme-architect`
- `jekyll-theme-dinky`
- `jekyll-theme-hacker`
- `jekyll-theme-leap-day`
- `jekyll-theme-merlot`
- `jekyll-theme-midnight`
- `jekyll-theme-modernist`
- `jekyll-theme-tactile`
- `jekyll-theme-time-machine`

### サイトタイトルと説明の変更

`docs/_config.yml` を編集：

```yaml
title: あなたのタイトル
description: あなたの説明
```

### カスタムドメインの設定

独自ドメインを使用する場合：

1. `docs/CNAME` ファイルを作成
2. ドメイン名を記入（例: `docs.example.com`）
3. DNSプロバイダーでCNAMEレコードを設定

## トラブルシューティング

### ページが表示されない

- GitHub Pagesの設定が正しいか確認
- `main` ブランチに `docs` フォルダが含まれているか確認
- 数分待ってから再度アクセス

### スタイルが適用されない

- `_config.yml` のテーマ設定を確認
- ブラウザのキャッシュをクリアして再読み込み

### 404 エラー

- ファイル名が正しいか確認（大文字小文字を区別）
- リンクが正しいか確認

## ローカルでのプレビュー

Jekyllをローカルにインストールしてプレビューできます：

```bash
# Rubyがインストールされている必要があります
gem install bundler jekyll

# docsディレクトリに移動
cd docs

# Gemfileを作成
echo "source 'https://rubygems.org'" > Gemfile
echo "gem 'github-pages', group: :jekyll_plugins" >> Gemfile

# 依存関係をインストール
bundle install

# ローカルサーバーを起動
bundle exec jekyll serve

# ブラウザで http://localhost:4000 にアクセス
```

## 更新方法

ドキュメントを更新する場合：

```bash
# ファイルを編集後
git add docs/
git commit -m "Update documentation"
git push origin main
```

GitHub Pagesは自動的に更新されます（数分かかる場合があります）。

---

**注意**: GitHub Pagesは静的サイトのみをホストします。このプロジェクトのNext.jsアプリケーション本体をデプロイする場合は、Vercel、Netlify、またはGitHub Actionsを使用した静的エクスポートが必要です。
