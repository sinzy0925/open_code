# OpenCode Setup Scripts

固定費で業務改善を進めるための、OpenCode セットアップ用スクリプトです。

## 対応環境

- macOS
- Linux
- Windows Git Bash
- Windows WSL

## 使い方

```bash
# Stage 0: 無料で始める（NVIDIA NIM）
bash setup-opencode-nvidia.sh

# Stage 1-A: 月額固定（OpenCode Go）
bash setup-opencode-go.sh

# Stage 1-B: ローカルLLM（Ollama + OpenCode）
bash setup-opencode-local-llm.sh
```

## 各ルートの概要

| スクリプト | 向いている人 | 事前準備 |
|-----------|-------------|---------|
| `setup-opencode-nvidia.sh` | まず無料で試したい | [build.nvidia.com](https://build.nvidia.com/models) で API キー取得 |
| `setup-opencode-go.sh` | 月額固定で続けたい | [opencode.ai/go](https://opencode.ai/go) で購読 |
| `setup-opencode-local-llm.sh` | 個人情報を外に出したくない | 十分な RAM/VRAM、Ollama インストール |

## 注意

- API キーはスクリプトに埋め込みません。環境変数として設定します。
- 各 AI サービスの利用規約を守って使ってください。
- Claude Pro/Max の OAuth トークンを第三者ツールに流用しないでください。
- 繰り返す仕事は最終的に小さなアプリへ凍結し、日常実行はエージェントなしで行うのが原則です。

## 実行後の共通手順

```bash
cd /path/to/your-project
opencode
/init
```

## トラブルシュート

- `opencode: command not found`
  - 新しいターミナルを開く
  - `export PATH="$HOME/.local/bin:$PATH"` を shell の設定ファイルに追加
- NVIDIA / Go のモデルが出ない
  - OpenCode 内で `/connect` を試す
  - API キーが環境変数に入っているか確認
- ローカル LLM で tool call が不安定
  - `OLLAMA_NUM_CTX=32768 bash setup-opencode-local-llm.sh` を再実行
  - より軽いモデルに変更
