/**
 * メインエントリポイント
 *
 * 使い方:
 * 1. clasp login && clasp push
 * 2. GAS エディタで buildPresentation を実行
 * 3. 対象の Google スライドを開いて確認
 */

/**
 * プレゼン全体を再生成する（既存スライドはすべて削除）
 */
function buildPresentation() {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  clearAllSlides_(presentation);

  var definitions = getSlideDefinitions_();
  definitions.forEach(function (def, i) {
    buildSlide_(presentation, def, i + 1, definitions.length);
  });

  Logger.log('Created ' + definitions.length + ' slides.');
  Logger.log('Open: https://docs.google.com/presentation/d/' + PRESENTATION_ID + '/edit');
}

/**
 * スライドを追加のみ（既存を残す）— テスト用
 */
function appendSlidesOnly() {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var definitions = getSlideDefinitions_();
  var start = presentation.getSlides().length;

  definitions.forEach(function (def, i) {
    buildSlide_(presentation, def, start + i + 1, start + definitions.length);
  });
}

/**
 * 1枚だけテスト生成（先頭に追加）
 */
function buildTestSlide() {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var def = getSlideDefinitions_()[0];
  buildSlide_(presentation, def, 1, 1);
}

/**
 * 設定確認
 */
function showConfig() {
  Logger.log('Presentation ID: ' + PRESENTATION_ID);
  Logger.log('Slides URL: https://docs.google.com/presentation/d/' + PRESENTATION_ID + '/edit');
}

function clearAllSlides_(presentation) {
  var slides = presentation.getSlides();
  for (var i = slides.length - 1; i >= 0; i--) {
    slides[i].remove();
  }
}

/**
 * カスタムメニュー（スプレッドシートにバインドした場合用）
 * スタンドアロンでも GAS エディタから直接実行可能
 */
function onOpen() {
  try {
    SlidesApp.getUi()
      .createMenu('プレゼン生成')
      .addItem('スライドを再生成', 'buildPresentation')
      .addItem('設定確認', 'showConfig')
      .addToUi();
  } catch (e) {
    // スタンドアロンスクリプトでは UI が無い場合がある
    Logger.log('onOpen skipped: ' + e.message);
  }
}
