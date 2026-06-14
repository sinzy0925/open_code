/**
 * スライド描画ユーティリティ
 */

function hexToRgb_(hex) {
  var h = hex.replace('#', '');
  return {
    red: parseInt(h.substring(0, 2), 16) / 255,
    green: parseInt(h.substring(2, 4), 16) / 255,
    blue: parseInt(h.substring(4, 6), 16) / 255,
  };
}

function color_(name) {
  return THEME[name] || THEME.text;
}

/** Fill / PageBackground 用: hex 文字列で塗りつぶす */
function setFillHex_(fill, hex) {
  fill.setSolidFill(hex);
}

function applyBackground_(slide) {
  slide.getBackground().setSolidFill(THEME.background);
}

function applyLeftAccent_(slide, accentName) {
  var accent = color_(accentName || 'teal');
  var bar = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, 0, 0, 6, PAGE.height);
  setFillHex_(bar.getFill(), accent);
  bar.getBorder().setTransparent();
}

function addFooter_(slide, pageNum, total) {
  var left = slide.insertTextBox(THEME.footer, PAGE.margin, PAGE.footerY, 400, 20);
  styleText_(left.getText(), 9, THEME.gray, false);

  var right = slide.insertTextBox(
    String(pageNum).padStart(2, '0') + ' / ' + String(total).padStart(2, '0'),
    PAGE.width - PAGE.margin - 60,
    PAGE.footerY,
    60,
    20
  );
  right.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.END);
  styleText_(right.getText(), 9, THEME.gray, false);
}

function styleText_(textRange, size, hex, bold) {
  if (!textRange) return;
  try {
    applyTextStyle_(textRange, size, hex, bold);
  } catch (e) {
    // 空セル等で getTextStyle() が失敗する場合のフォールバック
    if (String(e.message).indexOf('no text') !== -1) {
      textRange.appendText(' ');
      applyTextStyle_(textRange, size, hex, bold);
      return;
    }
    throw e;
  }
}

function applyTextStyle_(textRange, size, hex, bold) {
  var style = textRange.getTextStyle();
  style.setFontFamily(THEME.fontFamily);
  style.setFontSize(size);
  var rgb = hexToRgb_(hex);
  style.setForegroundColor(rgb.red, rgb.green, rgb.blue);
  style.setBold(!!bold);
}

function addTitleText_(slide, text, top, size) {
  var box = slide.insertTextBox(text, PAGE.margin + 8, top, PAGE.width - PAGE.margin * 2 - 8, 50);
  var tr = box.getText();
  tr.setText(text);
  styleText_(tr, size || 24, THEME.text, true);
  return box;
}

function addBodyBullets_(slide, items, top, left, width, height, size) {
  if (!items || !items.length) return;
  var text = items.map(function (item) {
    return '• ' + item;
  }).join('\n');
  var box = slide.insertTextBox(text, left || PAGE.margin + 8, top, width || PAGE.width - PAGE.margin * 2, height || 200);
  styleText_(box.getText(), size || 14, THEME.text, false);
  return box;
}

function addCallout_(slide, text, top, accentName) {
  var accent = color_(accentName || 'orange');
  var box = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, PAGE.margin + 8, top, PAGE.width - PAGE.margin * 2 - 16, 36);
  setFillHex_(box.getFill(), accent);
  box.getBorder().setTransparent();
  var tb = slide.insertTextBox(text, PAGE.margin + 20, top + 8, PAGE.width - PAGE.margin * 2 - 40, 24);
  styleText_(tb.getText(), 13, '#FFFFFF', true);
  tb.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
}

function addFlowBoxes_(slide, boxes, top) {
  var count = boxes.length;
  var gap = 16;
  var boxW = (PAGE.width - PAGE.margin * 2 - gap * (count - 1)) / count;
  var boxH = 72;

  boxes.forEach(function (box, i) {
    var x = PAGE.margin + 8 + i * (boxW + gap);
    var y = top;
    var fill = color_(box.color || 'teal');
    var shape = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, y, boxW, boxH);
    setFillHex_(shape.getFill(), fill);
    shape.getBorder().setTransparent();
    if (box.emphasis) {
      shape.getBorder().setWeight(2);
      setFillHex_(shape.getBorder().getLineFill(), THEME.indigo);
    }

    var label = box.label || '';
    var lines = (box.lines || [box.text || '']).join('\n');
    var badge = box.badge ? '\n[' + box.badge + ']' : '';

    var tb = slide.insertTextBox(label + '\n' + lines + badge, x + 8, y + 8, boxW - 16, boxH - 16);
    styleText_(tb.getText(), 11, '#FFFFFF', true);
    tb.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

    if (i < count - 1) {
      var ax = x + boxW + 2;
      var arrow = slide.insertTextBox('→', ax, y + 24, gap, 24);
      styleText_(arrow.getText(), 18, THEME.gray, true);
    }
  });
}

function addTwoColumns_(slide, def, top) {
  var colW = (PAGE.width - PAGE.margin * 2 - 24) / 2;
  var colH = 140;

  [
    { title: def.leftTitle, bullets: def.leftBullets, accent: def.leftAccent, x: PAGE.margin + 8 },
    { title: def.rightTitle, bullets: def.rightBullets, accent: def.rightAccent, x: PAGE.margin + 8 + colW + 24 },
  ].forEach(function (col) {
    var shape = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, col.x, top, colW, colH);
    setFillHex_(shape.getFill(), THEME.lightGray);
    shape.getBorder().setWeight(2);
    setFillHex_(shape.getBorder().getLineFill(), color_(col.accent));

    var titleBox = slide.insertTextBox(col.title, col.x + 12, top + 10, colW - 24, 24);
    styleText_(titleBox.getText(), 14, color_(col.accent), true);

    addBodyBullets_(slide, col.bullets, top + 38, col.x + 12, colW - 24, colH - 50, 12);
  });

  if (def.footerFlow) {
    var flow = slide.insertTextBox(def.footerFlow, PAGE.margin + 8, top + colH + 12, PAGE.width - PAGE.margin * 2, 24);
    styleText_(flow.getText(), 13, THEME.text, true);
    flow.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  }
}

function addTable_(slide, headers, rows, top) {
  var table = slide.insertTable(rows.length + 1, headers.length, PAGE.margin + 8, top, PAGE.width - PAGE.margin * 2 - 16, 24 * (rows.length + 1));

  headers.forEach(function (header, c) {
    var cell = table.getCell(0, c);
    var headerText = header || ' ';
    cell.getText().setText(headerText);
    styleText_(cell.getText(), 11, '#FFFFFF', true);
    setFillHex_(cell.getFill(), THEME.teal);
  });

  rows.forEach(function (row, r) {
    row.forEach(function (cellText, c) {
      var cell = table.getCell(r + 1, c);
      var value = cellText || ' ';
      cell.getText().setText(value);
      styleText_(cell.getText(), 10, THEME.text, false);
      if (r % 2 === 0) {
        setFillHex_(cell.getFill(), '#FFFFFF');
      } else {
        setFillHex_(cell.getFill(), THEME.background);
      }
    });
  });
}

function addCodeBlock_(slide, lines, top, height) {
  var bg = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, PAGE.margin + 8, top, PAGE.width - PAGE.margin * 2 - 16, height || 90);
  setFillHex_(bg.getFill(), THEME.codeBg);
  bg.getBorder().setTransparent();

  var tb = slide.insertTextBox(lines.join('\n'), PAGE.margin + 20, top + 12, PAGE.width - PAGE.margin * 2 - 40, height - 24 || 66);
  var tr = tb.getText();
  tr.setText(lines.join('\n'));
  var style = tr.getTextStyle();
  style.setFontFamily(THEME.fontFamilyCode);
  style.setFontSize(11);
  var codeRgb = hexToRgb_(THEME.codeText);
  style.setForegroundColor(codeRgb.red, codeRgb.green, codeRgb.blue);
}

function addBadge_(slide, text, colorName, x, y) {
  var badge = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, y, 72, 22);
  setFillHex_(badge.getFill(), color_(colorName));
  badge.getBorder().setTransparent();
  var tb = slide.insertTextBox(text, x, y + 2, 72, 20);
  styleText_(tb.getText(), 9, '#FFFFFF', true);
  tb.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
}

function setSpeakerNotes_(slide, narration) {
  if (!narration) return;
  try {
    var shape = slide.getNotesPage().getSpeakerNotesShape();
    var textRange = shape.getText();
    textRange.clear();
    textRange.appendText(narration);
  } catch (e) {
    Logger.log('Speaker notes fallback: ' + e.message);
    try {
      slide.getNotesPage().insertTextBox(narration, 10, 10, 400, 300);
    } catch (e2) {
      Logger.log('Speaker notes skipped: ' + e2.message);
    }
  }
}

function buildSlide_(presentation, def, index, total) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  applyBackground_(slide);
  applyLeftAccent_(slide, def.accent || 'teal');
  addFooter_(slide, index, total);

  switch (def.layout) {
    case 'title':
      buildTitleSlide_(slide, def);
      break;
    case 'two-column':
      buildTwoColumnSlide_(slide, def);
      break;
    case 'table':
      buildTableSlide_(slide, def);
      break;
    case 'content':
      buildContentSlide_(slide, def);
      break;
    case 'flow':
      buildFlowSlide_(slide, def);
      break;
    case 'decision':
      buildDecisionSlide_(slide, def);
      break;
    case 'scripts-overview':
      buildScriptsOverviewSlide_(slide, def);
      break;
    case 'steps':
      buildStepsSlide_(slide, def);
      break;
    case 'split':
      buildSplitSlide_(slide, def);
      break;
    case 'steps-horizontal':
      buildStepsHorizontalSlide_(slide, def);
      break;
    case 'conclusion':
      buildConclusionSlide_(slide, def);
      break;
    default:
      addTitleText_(slide, def.title || 'Slide', 40, 24);
      addBodyBullets_(slide, def.bullets || [], 100);
  }

  setSpeakerNotes_(slide, def.narration);
  return slide;
}

function buildTitleSlide_(slide, def) {
  addTitleText_(slide, def.title, 80, 32);
  var sub = slide.insertTextBox(def.subtitle, PAGE.margin + 8, 125, PAGE.width - PAGE.margin * 2, 40);
  styleText_(sub.getText(), 20, THEME.text, false);

  var tag = slide.insertTextBox(def.tagline, PAGE.margin + 8, 168, PAGE.width - PAGE.margin * 2, 30);
  styleText_(tag.getText(), 14, THEME.gray, false);

  if (def.flowBoxes) {
    addFlowBoxes_(slide, def.flowBoxes, 230);
  }
}

function buildTwoColumnSlide_(slide, def) {
  addTitleText_(slide, def.title, 28, 22);
  addTwoColumns_(slide, def, 88);
  if (def.bullets) {
    addBodyBullets_(slide, def.bullets, 280, PAGE.margin + 8, PAGE.width - PAGE.margin * 2, 80, 11);
  }
}

function buildTableSlide_(slide, def) {
  addTitleText_(slide, def.title, 28, 22);
  addTable_(slide, def.tableHeaders, def.tableRows, 78);
  if (def.callout) {
    addCallout_(slide, def.callout, 300, 'orange');
  }
}

function buildContentSlide_(slide, def) {
  addTitleText_(slide, def.title, 28, 22);
  addBodyBullets_(slide, def.bullets, 78, PAGE.margin + 8, 380, 200, 12);

  if (def.flowVertical) {
    var x = 420;
    def.flowVertical.forEach(function (line, i) {
      var tb = slide.insertTextBox(line, x, 90 + i * 28, 260, 24);
      styleText_(tb.getText(), 12, THEME.text, line.indexOf('🏭') >= 0 || line.indexOf('❄') >= 0);
    });
  }

  if (def.footnote) {
    var fn = slide.insertTextBox(def.footnote, PAGE.margin + 8, 330, PAGE.width - PAGE.margin * 2, 20);
    styleText_(fn.getText(), 10, THEME.gray, false);
  }
}

function buildFlowSlide_(slide, def) {
  addTitleText_(slide, def.title, 28, 22);
  addFlowBoxes_(slide, def.flowBoxes, 120);
}

function buildDecisionSlide_(slide, def) {
  addTitleText_(slide, def.title, 28, 22);
  var decisions = def.decisions || [];
  var boxW = (PAGE.width - PAGE.margin * 2 - 32) / 3;
  decisions.forEach(function (d, i) {
    var x = PAGE.margin + 8 + i * (boxW + 16);
    var shape = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, 90, boxW, 100);
    setFillHex_(shape.getFill(), color_(d.color));
    shape.getBorder().setTransparent();

    var tb = slide.insertTextBox(d.question + '\n↓\n' + d.answer, x + 8, 100, boxW - 16, 80);
    styleText_(tb.getText(), 12, '#FFFFFF', true);
    tb.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  });

  if (def.callout) {
    addCallout_(slide, def.callout, 230, 'indigo');
  }
}

function buildScriptsOverviewSlide_(slide, def) {
  addTitleText_(slide, def.title, 28, 24);
  if (def.intro) {
    var intro = slide.insertTextBox(def.intro, PAGE.margin + 8, 68, PAGE.width - PAGE.margin * 2, 24);
    styleText_(intro.getText(), 13, THEME.text, false);
  }
  addCodeBlock_(slide, def.codeLines, 98, 78);

  var cards = def.cards || [];
  var cardW = (PAGE.width - PAGE.margin * 2 - 32) / 3;
  cards.forEach(function (card, i) {
    var x = PAGE.margin + 8 + i * (cardW + 16);
    var y = 190;
    var shape = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, y, cardW, 70);
    setFillHex_(shape.getFill(), THEME.lightGray);
    shape.getBorder().setWeight(2);
    setFillHex_(shape.getBorder().getLineFill(), color_(card.color));

    var tb = slide.insertTextBox(card.num + ' ' + card.label + '\n' + card.file, x + 8, y + 12, cardW - 16, 50);
    styleText_(tb.getText(), 11, THEME.text, true);
    tb.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  });

  if (def.footnote) {
    var fn = slide.insertTextBox(def.footnote, PAGE.margin + 8, 280, PAGE.width - PAGE.margin * 2, 20);
    styleText_(fn.getText(), 11, THEME.gray, false);
  }
}

function buildStepsSlide_(slide, def) {
  if (def.badge) addBadge_(slide, def.badge, def.badgeColor, PAGE.margin + 8, 24);
  addTitleText_(slide, def.title, 24, 20);

  var steps = def.steps || [];
  var stepW = (PAGE.width - PAGE.margin * 2 - 32) / 3;
  steps.forEach(function (step, i) {
    var x = PAGE.margin + 8 + i * (stepW + 16);
    var shape = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, 72, stepW, 80);
    setFillHex_(shape.getFill(), THEME.lightGray);
    shape.getBorder().setTransparent();
    var tb = slide.insertTextBox(step.label + '\n' + step.text, x + 8, 80, stepW - 16, 64);
    styleText_(tb.getText(), 10, THEME.text, true);
    tb.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    if (i < steps.length - 1) {
      var arrow = slide.insertTextBox('→', x + stepW, 100, 24, 20);
      styleText_(arrow.getText(), 14, THEME.gray, true);
    }
  });

  if (def.numberedSteps) {
    addBodyBullets_(slide, def.numberedSteps.map(function (s, i) { return (i + 1) + '. ' + s; }), 168, PAGE.margin + 8, PAGE.width - PAGE.margin * 2, 80, 12);
  }

  if (def.warning) {
    var warn = slide.insertTextBox(def.warning, PAGE.margin + 8, 300, PAGE.width - PAGE.margin * 2, 24);
    styleText_(warn.getText(), 11, THEME.orange, true);
  }
}

function buildSplitSlide_(slide, def) {
  if (def.badge) addBadge_(slide, def.badge, def.badgeColor, PAGE.margin + 8, 24);
  addTitleText_(slide, def.title, 24, 20);

  var colW = (PAGE.width - PAGE.margin * 2 - 24) / 2;
  [def.left, def.right].forEach(function (col, i) {
    if (!col) return;
    var x = PAGE.margin + 8 + i * (colW + 24);
    var shape = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, 72, colW, 180);
    setFillHex_(shape.getFill(), THEME.lightGray);
    shape.getBorder().setWeight(2);
    setFillHex_(shape.getBorder().getLineFill(), color_(col.color));

    var titleBox = slide.insertTextBox(col.title, x + 12, 82, colW - 24, 24);
    styleText_(titleBox.getText(), 13, color_(col.color), true);

    if (col.code) {
      var codeBox = slide.insertTextBox(col.code, x + 12, 108, colW - 24, 24);
      var style = codeBox.getText().getTextStyle();
      style.setFontFamily(THEME.fontFamilyCode);
      style.setFontSize(9);
      var codeRgb = hexToRgb_(THEME.codeText);
  style.setForegroundColor(codeRgb.red, codeRgb.green, codeRgb.blue);
      setFillHex_(codeBox.getFill(), THEME.codeBg);
    }

    addBodyBullets_(slide, col.bullets, 140, x + 12, colW - 24, 100, 10);
  });

  if (def.callout) {
    addCallout_(slide, def.callout, 270, 'indigo');
  }
}

function buildStepsHorizontalSlide_(slide, def) {
  if (def.badge) addBadge_(slide, def.badge, def.badgeColor, PAGE.margin + 8, 24);
  addTitleText_(slide, def.title, 24, 20);

  var steps = def.horizontalSteps || [];
  var stepW = (PAGE.width - PAGE.margin * 2 - 48) / 4;
  steps.forEach(function (step, i) {
    var x = PAGE.margin + 8 + i * (stepW + 16);
    var shape = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, 80, stepW, 70);
    setFillHex_(shape.getFill(), THEME.indigo);
    shape.getBorder().setTransparent();
    var tb = slide.insertTextBox(step.num + ' ' + step.title + '\n' + step.text, x + 6, 88, stepW - 12, 54);
    styleText_(tb.getText(), 10, '#FFFFFF', true);
    tb.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    if (i < steps.length - 1) {
      var arrow = slide.insertTextBox('→', x + stepW, 105, 24, 20);
      styleText_(arrow.getText(), 14, THEME.gray, true);
    }
  });

  if (def.callout) {
    addCallout_(slide, def.callout, 175, 'indigo');
  }
}

function buildConclusionSlide_(slide, def) {
  addTitleText_(slide, def.title, 60, 26);

  var lines = def.summaryLines || [];
  lines.forEach(function (line, i) {
    var y = 120 + i * 44;
    var bar = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, PAGE.margin + 8, y, 6, 32);
    setFillHex_(bar.getFill(), color_(line.color));
    bar.getBorder().setTransparent();
    var tb = slide.insertTextBox((i + 1) + '. ' + line.text, PAGE.margin + 24, y + 4, PAGE.width - PAGE.margin * 2, 28);
    styleText_(tb.getText(), 15, THEME.text, true);
  });

  if (def.distribution) {
    var dist = slide.insertTextBox(def.distribution, PAGE.margin + 8, 260, 400, 30);
    styleText_(dist.getText(), 13, THEME.teal, true);
  }

  if (def.cta) {
    var cta = slide.insertTextBox(def.cta, PAGE.margin + 8, 295, PAGE.width - PAGE.margin * 2, 24);
    styleText_(cta.getText(), 12, THEME.gray, false);
  }

  if (def.closing) {
    var close = slide.insertTextBox(def.closing, PAGE.margin + 8, 340, PAGE.width - PAGE.margin * 2, 30);
    styleText_(close.getText(), 16, THEME.text, true);
    close.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  }
}
