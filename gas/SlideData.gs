/**
 * slides-narration.md から生成したスライド定義
 */
function getSlideDefinitions_() {
  return [
    {
      layout: 'title',
      title: '業務改善は固定費で。',
      subtitle: 'Cursor だけじゃない、OpenCode という第二の選択肢',
      tagline: '無料で始めて、固定費で育て、固まったらアプリにする',
      flowBoxes: [
        { label: 'Stage 0', text: '無料試作', color: 'green' },
        { label: 'Stage 1', text: '固定費', color: 'teal' },
        { label: 'Stage 2', text: 'アプリ化', color: 'indigo' },
      ],
      narration:
        '前回まで、流行りの AI エージェントに業務を丸投げすることの危険さをお話ししてきました。従量課金の爆発、手順の忘却、ノウハウがチャットに埋もれる——このあたりの話です。\n\n' +
        'ただ、振り返ってみると、私の話はどうしても Cursor に寄りすぎていたと気づきました。Cursor は優秀です。でも、無料で試したい人、モデルを選びたい人、個人情報を外に出せない人にとっては、Cursor だけでは足りない場面があります。\n\n' +
        'なので今回は、OpenCode を使った第二のルートを整理します。そして今日から動けるように、インストールスクリプトまで用意してきました。ただし最終的なゴールは変わりません。繰り返す仕事は、小さなアプリに凍結する。そこだけはブレません。',
    },
    {
      layout: 'two-column',
      title: '変わらない原則：固定費で設計し、アプリに残す',
      leftTitle: '⚠ やめること',
      leftBullets: ['毎回エージェントに丸投げ', '従量課金依存'],
      leftAccent: 'orange',
      rightTitle: '✦ やること',
      rightBullets: ['🏭 定額環境で作る', '❄ アプリに凍結', '📦 Gitに資産化'],
      rightAccent: 'teal',
      footerFlow: '作る（固定費） → 回す（ほぼゼロ円） → 残す（資産）',
      bullets: [
        '敵は「AIそのもの」ではなく、従量課金の丸投げ',
        '作る段階は定額の開発環境で試行錯誤する',
        '回す段階は凍結した自前アプリで実行する',
        '残すものはチャット履歴ではなく、Git 上の資産',
      ],
      narration:
        'まず、前回の核心だけ確認させてください。私が本当に危ないと言っているのは、AI そのものではありません。同じ仕事を毎回、従量課金のブラックボックスに預けるやり方です。\n\n' +
        'だから原則はシンプルです。作るときは固定費の環境で試す。回すときは、検証済みのコードを動かす。そして、できあがったものを README 付きでリポジトリに残す。3年後も困らない形にする——この考え方は、今日も変わりません。',
    },
    {
      layout: 'table',
      title: '反省：対策を Cursor だけに寄せすぎていた',
      tableHeaders: ['Cursor の強み', '足りない場面'],
      tableRows: [
        ['定額 IDE で作りやすい', '無料で試す入口が弱い'],
        ['実績と安定感がある', 'モデル選択の自由度が限られる'],
        ['日常開発に強い', '個人情報を外に出せない現場がある'],
        ['個人の生産性向上に最適', 'ベンダー1社に寄るリスクがある'],
      ],
      callout: '唯一の正解ではない',
      narration:
        'ここが今回の「反省」です。前回の話を聞いた人には、「結局 Cursor を使えばいいのね」と感じたかもしれません。私も無意識にそう伝えていた部分があります。\n\n' +
        'でも現場はもっと多様です。まず無料で触ってみたい人がいる。どのモデルを使うか自分で選びたい人がいる。顧客データや個人情報を絶対に外に出したくない人もいる。こういう場合、Cursor だけを勧めるのは不親切でした。\n\n' +
        'Cursor は引き続き強い選択肢です。ただし、唯一の正解ではないというのが、今回の出発点です。',
    },
    {
      layout: 'content',
      title: '第二の作業台：OpenCode',
      accent: 'teal',
      bullets: [
        'オープンソースのターミナル型コーディングエージェント（MIT）',
        '75以上のモデルに接続可能',
        'NVIDIA 無料 / OpenCode Go / ローカル LLM と相性がよい',
        '使うのは「資産を作る工場」。毎日の業務本体ではない',
        '各 AI サービスの利用規約を守れば、通常利用で法的心配はほぼない',
      ],
      flowVertical: ['🏭 OpenCode（工場）', '↓', '❄ 凍結アプリ（製品）', 'python app.py ← 日常実行'],
      footnote: '規約を守って使えば OK ｜ MIT ライセンス',
      narration:
        'そこで持ってきたのが OpenCode です。OpenCode は、オープンソースの AI コーディングエージェントで、ターミナルや IDE から使えます。Claude Code の代替として語られることが多いですが、私が見ているのは「コピー品」ではなく、固定費化を進めるためのもう一つの作業台です。\n\n' +
        '大事なのは位置づけです。OpenCode は、毎日の業務を丸投げするための道具ではありません。アプリを作るための工場です。工場で試行錯誤し、固まったらアプリに凍結し、日常の実行はエージェントなしで回す——この流れに OpenCode はきれいにハマります。\n\n' +
        '法務の話も一言だけ。Anthropic との揉め事は開発側の話で、ユーザーが訴えられるような構図ではありません。気をつけるのは、接続先の規約と、データの扱い方だけです。',
    },
    {
      layout: 'flow',
      title: '進め方は3段階：無料 → 固定費 → アプリ化',
      flowBoxes: [
        {
          label: 'STAGE 0',
          lines: ['OpenCode +', 'NVIDIA無料'],
          color: 'green',
          badge: '$0',
        },
        {
          label: 'STAGE 1',
          lines: ['A) Go $10/mo', 'B) ローカル LLM'],
          color: 'teal',
          badge: '固定費',
        },
        {
          label: 'STAGE 2',
          lines: ['1仕事1アプリ', 'エージェント不要で実行'],
          color: 'indigo',
          badge: '本丸',
          emphasis: true,
        },
      ],
      narration:
        'では、具体的な進め方です。3段階で考えてください。\n\n' +
        'まず Stage 0。OpenCode と NVIDIA の無料 LLM を組み合わせて、ゼロ円で「作る練習」を始めます。ここは工場の見学コースです。毎日の業務実行には使いません。\n\n' +
        '次に Stage 1。同じ種類の作業を3回以上、ほぼ一人で再現できるようになったら、本番の作業環境に移ります。手軽にいくなら OpenCode Go。月額固定で、何度失敗しても追加課金の心配が少ない。個人情報や機密データが絡むなら、OpenCode とローカル LLM の組み合わせです。\n\n' +
        'そして Stage 2。ここが本丸です。手順が固まった仕事は、小さなアプリに凍結します。日常の実行は python app.py のように、エージェントなしで回します。OpenCode は工場、製品はコード——この区別を忘れないでください。',
    },
    {
      layout: 'decision',
      title: 'どのルートを選ぶ？ 3つの質問',
      decisions: [
        { question: '初めて？', answer: 'NVIDIA 無料', color: 'green' },
        { question: '続けたい？手軽に', answer: 'Go $10/mo', color: 'teal' },
        { question: '機密データ？', answer: 'ローカル LLM', color: 'indigo' },
      ],
      callout: '共通ゴール：❄ アプリ化',
      narration:
        '「結局、自分はどれを選べばいいの？」——ここだけは迷わせないようにします。\n\n' +
        'まだ触ったことがないなら、NVIDIA 無料ルート。今日から始められます。継続して作業する環境が欲しいが、手軽さを優先するなら OpenCode Go。月額固定でわかりやすいです。\n\n' +
        '一方で、顧客データ、個人情報、社内機密を扱うなら、ローカル LLM ルートを選んでください。そして3つに共通するゴールがあります。どのルートを通っても、最後はアプリ化です。',
    },
    {
      layout: 'table',
      title: '対立ではなく、使い分け',
      tableHeaders: ['項目', 'Cursor', 'OpenCode'],
      tableRows: [
        ['役割', '定額 IDE（慣れているならこれで十分）', 'モデル選択肢を広げる第二の作業台'],
        ['強み', '安定・UX・実績', '無料入口・マルチモデル・ローカル対応'],
        ['向く人', 'すでに Cursor に慣れた人', '無料で試したい／機密重視の人'],
      ],
      callout: '共通の設計原則：固定費で作る → アプリ化',
      narration:
        '「じゃあ Cursor は不要になるの？」——なりません。Cursor と OpenCode は敵ではありません。\n\n' +
        'すでに Cursor に慣れていて、それで十分快適なら、Cursor を使い続けて構いません。大事なのはツールの名前ではなく、固定費で作り、固まったらアプリにするという設計です。\n\n' +
        'OpenCode は、Cursor ではカバーしにくい入口を補う存在です。無料で試したい人、モデルを自分で選びたい人、ローカルで閉じたい人——そういう聴衆のために、第二の選択肢として持ってきました。',
    },
    {
      layout: 'scripts-overview',
      title: 'では具体的にどうするの？',
      intro: '今日から動ける 3つのセットアップスクリプトを用意しました。',
      codeLines: [
        '$ bash setup-opencode-nvidia.sh',
        '$ bash setup-opencode-go.sh',
        '$ bash setup-opencode-local-llm.sh',
      ],
      cards: [
        { num: '①', label: '無料', file: 'nvidia.sh', color: 'green' },
        { num: '②', label: '月額固定', file: 'go.sh', color: 'teal' },
        { num: '③', label: 'ローカル', file: 'local-llm.sh', color: 'indigo' },
      ],
      footnote: '対応：macOS / Linux / Git Bash / WSL',
      narration:
        'ここからが、今回いちばん持ち帰ってほしい部分です。思想だけで終わらせません。実際に動かすためのセットアップスクリプトを3本用意しました。\n\n' +
        '1本目は、OpenCode と NVIDIA 無料 LLM のセットアップ。2本目は OpenCode Go。3本目は OpenCode とローカル LLM。いずれも .sh 形式なので、macOS、Linux、Windows の Git Bash や WSL で実行できます。API キーはスクリプトに埋め込みません。',
    },
    {
      layout: 'steps',
      title: 'Stage 0：OpenCode + NVIDIA 無料 LLM',
      badge: 'STAGE 0',
      badgeColor: 'green',
      steps: [
        { label: 'BEFORE', text: 'APIキー取得\nbuild.nvidia.com' },
        { label: 'SCRIPT', text: 'bash setup-opencode-nvidia.sh' },
        { label: 'AFTER', text: 'opencode → /init' },
      ],
      numberedSteps: [
        'build.nvidia.com で API キー',
        'bash setup-opencode-nvidia.sh',
        'opencode → /init',
      ],
      warning: '⚠ 毎日の業務実行には使わない。作る練習用。',
      narration:
        '1本目、NVIDIA 無料ルートです。スクリプトが OpenCode のインストールと設定ファイルの作成まで行います。事前に必要なのは、build.nvidia.com で NVIDIA の API キーを取得することだけです。クレジットカード不要で始められるのが魅力です。\n\n' +
        '実行後は、自分のプロジェクトディレクトリで opencode を起動し、初回だけ /init を実行してください。ここからが「作る練習」です。',
    },
    {
      layout: 'split',
      title: 'Stage 1：OpenCode Go または ローカル LLM',
      badge: 'STAGE 1',
      badgeColor: 'teal',
      left: {
        title: 'A) OpenCode Go',
        code: 'bash setup-opencode-go.sh',
        bullets: ['💰 $10/mo 固定', '手軽さ優先', 'opencode.ai/go で購読'],
        color: 'teal',
      },
      right: {
        title: 'B) ローカル LLM',
        code: 'bash setup-opencode-local-llm.sh',
        bullets: ['🔒 データ外に出さない', 'GPU/RAM 必要', 'Ollama + qwen3-coder'],
        color: 'indigo',
      },
      callout: 'どちらも → 固まったら ❄ アプリ化',
      narration:
        '2本目と3本目です。OpenCode Go は、月額固定で続けたい人向けです。ローカル LLM ルートは、機密データを扱う人向けです。Ollama を使い、推論を自分のマシン内で完結させます。どちらのルートでも、最後にやることは同じです。手順が固まったら、アプリに凍結する。',
    },
    {
      layout: 'steps-horizontal',
      title: 'Stage 2：固まったらアプリ化（本丸）',
      badge: 'STAGE 2',
      badgeColor: 'indigo',
      horizontalSteps: [
        { num: '①', title: '問い', text: '1行で定義' },
        { num: '②', title: '分割', text: '5〜7ステップ' },
        { num: '③', title: '実装', text: 'テスト確認' },
        { num: '④', title: 'Git', text: 'README資産化' },
      ],
      callout: '🏭 OpenCode（工場） ──→ ❄ app.py（製品）｜日常はエージェント不要',
      narration:
        'ここが、前回から一貫して伝えたい本丸です。OpenCode も Cursor も NVIDIA もローカル LLM も、すべて作るための手段です。最終的に会社に残すべきなのは、エージェントとのチャット履歴ではありません。\n\n' +
        '作り方は4ステップです。問いの設計、5〜7分割、実装とテスト、リポジトリ化。この小さな積み重ねが、3年後も動き続ける資産になります。',
    },
    {
      layout: 'conclusion',
      title: '結論：固定費で作り、自分たちの道具を残す',
      summaryLines: [
        { text: '丸投げエージェントに業務を預けるな', color: 'orange' },
        { text: 'OpenCode で無料→固定費→ローカル の道がある', color: 'teal' },
        { text: '固まった仕事は小さなアプリにする', color: 'indigo' },
      ],
      distribution: '📦 scripts/ フォルダの 3本の .sh をお持ち帰りください',
      closing: 'ご清聴ありがとうございました',
      cta: '帰ってから1本だけ試してみてください',
      narration:
        '最後にまとめます。前回お話しした警告は変わりません。流行りの自律エージェントに、会社の命運を預けるな。\n\n' +
        'ただ、前回より反省したのは、対策を Cursor だけに寄せすぎていたことです。だから今回、OpenCode を使った第二のルートを示しました。NVIDIA 無料で始め、OpenCode Go かローカル LLM で固定費化し、最後はアプリに凍結する。\n\n' +
        '今日から動けるスクリプトも配布します。ぜひ帰ってから1本だけ試してみてください。ご清聴ありがとうございました。',
    },
  ];
}
