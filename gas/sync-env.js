#!/usr/bin/env node
/**
 * .gas_env の URL から ID を抽出し、.clasp.json / Config.gs を更新する
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ENV_FILE = path.join(ROOT, '.gas_env');
const CLASP_FILE = path.join(ROOT, '.clasp.json');
const CONFIG_FILE = path.join(ROOT, 'Config.gs');

function log(msg) {
  console.log(`[sync-env] ${msg}`);
}

function fail(msg) {
  console.error(`[sync-env] ERROR: ${msg}`);
  process.exit(1);
}

function parseEnvFile(content) {
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function extractPresentationId(url) {
  const m = url.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

function extractScriptId(url) {
  const m = url.match(/\/projects\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

function updateClaspJson(scriptId) {
  let clasp = { scriptId, rootDir: '.' };
  if (fs.existsSync(CLASP_FILE)) {
    try {
      clasp = { ...JSON.parse(fs.readFileSync(CLASP_FILE, 'utf8')), scriptId };
    } catch {
      // 壊れていれば上書き
    }
  }
  fs.writeFileSync(CLASP_FILE, JSON.stringify(clasp, null, 2) + '\n', 'utf8');
  log(`updated .clasp.json (scriptId: ${scriptId})`);
}

function updateConfigGs(presentationId, slidesUrl) {
  if (!fs.existsSync(CONFIG_FILE)) {
    fail(`Config.gs が見つかりません: ${CONFIG_FILE}`);
  }

  let content = fs.readFileSync(CONFIG_FILE, 'utf8');

  content = content.replace(
    /\/\*\*[\s\S]*?Google Slides:.*?\*\/\n/,
    `/**\n * プレゼン設定\n * Google Slides: ${slidesUrl}\n */\n`
  );

  if (!content.includes('PRESENTATION_ID')) {
    fail('Config.gs に PRESENTATION_ID が見つかりません');
  }

  content = content.replace(
    /var PRESENTATION_ID = '[^']*';/,
    `var PRESENTATION_ID = '${presentationId}';`
  );

  fs.writeFileSync(CONFIG_FILE, content, 'utf8');
  log(`updated Config.gs (PRESENTATION_ID: ${presentationId})`);
}

function main() {
  if (!fs.existsSync(ENV_FILE)) {
    fail(
      '.gas_env がありません。\n' +
        '  cp .gas_env.example .gas_env\n' +
        '  # URL を編集してから再実行'
    );
  }

  const env = parseEnvFile(fs.readFileSync(ENV_FILE, 'utf8'));
  const slidesUrl = env.googleslide_url || env.GOOGLESLIDE_URL || '';
  const gasUrl = env.googleslide_gaseditor_url || env.GOOGLESLIDE_GASEDITOR_URL || '';

  if (!slidesUrl) {
    fail('googleslide_url が未設定です (.gas_env)');
  }
  if (!gasUrl) {
    fail('googleslide_gaseditor_url が未設定です (.gas_env)');
  }

  const presentationId = extractPresentationId(slidesUrl);
  const scriptId = extractScriptId(gasUrl);

  if (!presentationId) {
    fail(`googleslide_url から Presentation ID を取得できません:\n  ${slidesUrl}`);
  }
  if (!scriptId) {
    fail(`googleslide_gaseditor_url から Script ID を取得できません:\n  ${gasUrl}`);
  }

  updateClaspJson(scriptId);
  updateConfigGs(presentationId, slidesUrl);

  log('完了');
  log(`Slides: https://docs.google.com/presentation/d/${presentationId}/edit`);
  log(`GAS:    https://script.google.com/home/projects/${scriptId}/edit`);
}

main();
