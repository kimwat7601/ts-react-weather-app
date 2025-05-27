# Error Handling Implementation Plan

## 🎯 目標

現在のAPI呼び出しでアプリがクラッシュする問題を解決

## 🚨 現在の問題

\`\`\`typescript
// api.ts - 危険なコード
const fetchApi = async <T>(url: string): Promise<T> => {
const response = await fetch(url); // ❌ エラーハンドリングなし
return response.json() as T; // ❌ 型安全性なし
};
\`\`\`

## ✅ 実装項目

- [○] fetchApi関数のtry-catch実装
- [○] HTTPステータスコードのチェック
- [○] ネットワークエラーの処理
- [○] API レスポンス形式の検証
- [ ] Error Boundaryの実装
- [ ] ユーザーフレンドリーなエラーUI

## 🧪 テスト計画

- [○] 存在しない都市名での検索
- [○] ネットワーク切断時の動作
- [○] 無効なAPIキーでの動作
- [○] API サーバーダウン時の動作

## 📊 成功基準

- エラー発生時にアプリがクラッシュしない
- ユーザーに分かりやすいエラーメッセージが表示される
- エラー後に正常な検索に復帰可能
