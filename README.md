# GiftLoop prototype

シンプルなギフト体験プロトタイプ（静的サイト）。GitHub Pagesでホストできます。

## デプロイ手順（簡単）
1. 新しい GitHub リポジトリを作成
2. ここにあるファイル（index.html, styles.css, app.js, manifest.json, README.md）を push
3. リポジトリの Settings → Pages で `main` ブランチの `/(root)` を選択し保存
4. 数分で `https://<your-username>.github.io/<repo>/` に公開されます
5. QRコードを作る場合は公開URLに対してQRを生成して配布してください

## 使い方
- URLに `?session=xxx&theme=yyy` を付けるとページ内のタイトル・テーマが変更できます
  例: `https://.../index.html?session=縁のギフト&theme=小さな親切の共有`
- ギフト・フィードはローカルストレージに保存され、ダウンロードも可能です（CSV）
