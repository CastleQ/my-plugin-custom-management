// 세션 시작 브리핑. 출력은 매 세션 맥락(토큰)에 들어가므로 평소엔 한 줄, 기준과 다를 때만 펼친다.
// 사용: node briefing.mjs          → 세션 시작용(요약/펼침)
//       node briefing.mjs --full   → 요청 시 전체 표(하는 일 포함)
//       node briefing.mjs --selftest
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LABEL = {
  synced: '계정 연동', session: '환경 자동설치', project: '이 리포 전용',
  local: '이 리포(나만)', user: '내 PC 설정', managed: '관리자 지정',
};
const FAIL = '[세션 브리핑] 첫 답변 맨 위에 "플러그인 목록을 가져오지 못함" 한 줄만 쓸 것.';

export function parseCost(text) {
  const m = /Always-on:\s*~?([\d.]+)(k?)\s*tok/.exec(text);
  return m ? Math.round(parseFloat(m[1]) * (m[2] ? 1000 : 1)) : null;
}

// 실제 목록(list)과 기준(expected.plugins)을 비교해 문제 줄 목록을 돌려준다.
export function diagnose(list, expected) {
  const byName = {};
  for (const p of list) (byName[String(p.id).split('@')[0]] ??= []).push(p);
  const issues = [];
  for (const [name, want] of Object.entries(expected)) {
    const got = byName[name] ?? [];
    const on = got.filter(p => p.enabled !== false);
    if (!got.length) issues.push(`⚠ 빠짐: ${name}`);
    else if (!on.length) issues.push(`⏸ 꺼짐: ${name}`);
    if (got.length > 1) issues.push(`🔁 중복: ${name} (${got.map(p => LABEL[p.scope] ?? p.scope).join(' + ')})`);
    for (const p of on) if (want.version && p.version !== want.version)
      issues.push(`🔄 버전 다름: ${name} 기준 ${want.version} → 실제 ${p.version}`);
  }
  for (const name of Object.keys(byName)) if (!(name in expected)) issues.push(`➕ 기준에 없음: ${name}`);
  return issues;
}

function guidelineStatus() {
  const want = readFileSync(join(ROOT, 'guidelines', 'CLAUDE.md'), 'utf8').trimEnd();
  let have;
  try { have = readFileSync(join(homedir(), '.claude', 'CLAUDE.md'), 'utf8').trimEnd(); } catch { return '없음'; }
  return have === want ? '✓' : '다름';
}

async function cost(name) {
  try {
    const { stdout } = await run('claude', ['plugin', 'details', name], { encoding: 'utf8', timeout: 10000 });
    return parseCost(stdout);
  } catch { return null; }
}

async function main(full) {
  const expected = JSON.parse(readFileSync(join(ROOT, 'expected.json'), 'utf8')).plugins;
  const { stdout } = await run('claude', ['plugin', 'list', '--json'], { encoding: 'utf8', timeout: 15000 });
  const list = JSON.parse(stdout);
  if (!Array.isArray(list)) throw new Error('not an array');
  const names = list.map(p => String(p.id).split('@')[0]);
  const costs = await Promise.all(names.map(cost));
  const total = costs.reduce((s, c, i) => s + (list[i].enabled === false ? 0 : c ?? 0), 0);
  const issues = diagnose(list, expected);
  const guide = guidelineStatus();
  if (guide !== '✓') issues.push(`📄 개인 지침: ${guide}`);
  const head = full ? '' : '[세션 브리핑] 첫 답변 맨 위에 아래 내용을 그대로 보여줄 것(이후 답변엔 반복 금지).\n';

  if (!issues.length && !full) {
    console.log(`${head}🧰 공통 도구 ${list.length}개 정상 · 개인 지침 ✓ · 상시 약 ${total}토큰`);
    return;
  }
  const rows = list.map((p, i) => {
    const off = p.enabled === false ? ' (꺼짐)' : '';
    const why = full ? `|${expected[names[i]]?.why ?? '-'}` : '';
    return `|${names[i]}${off}|${LABEL[p.scope] ?? p.scope}|${costs[i] ?? '?'}${why}|`;
  });
  console.log([
    head + (issues.length ? `🧰 기준과 다른 점 ${issues.length}개 · 개인 지침 ${guide}` : `🧰 공통 도구 ${list.length}개 정상 · 개인 지침 ✓`),
    ...issues.map(s => `- ${s}`),
    '',
    full ? '|플러그인|출처|상시 토큰|하는 일|' : '|플러그인|출처|상시 토큰|',
    full ? '|:-|:-|-:|:-|' : '|:-|:-|-:|',
    ...rows,
    `|합계(켜진 것)||${total}|${full ? '|' : ''}`,
  ].join('\n'));
}

if (process.argv[2] === '--selftest') {
  const assert = (await import('node:assert')).strict;
  assert.equal(parseCost('  Always-on:   ~641 tok   added'), 641);
  assert.equal(parseCost('Always-on: ~1.2k tok'), 1200);
  assert.equal(parseCost('nothing'), null);
  const exp = { a: { version: '1.0' }, b: { version: null }, c: { version: null } };
  assert.deepEqual(diagnose([
    { id: 'a@x', scope: 'synced', version: '1.0' }, { id: 'b@x', scope: 'synced' }, { id: 'c@y', scope: 'session' },
  ], exp), []);
  assert.deepEqual(diagnose([
    { id: 'a@inline', scope: 'session', version: '2.0' }, { id: 'a@synced', scope: 'synced', version: '1.0' },
    { id: 'b@x', scope: 'synced', enabled: false }, { id: 'z@x', scope: 'synced' },
  ], exp), ['🔁 중복: a (환경 자동설치 + 계정 연동)', '🔄 버전 다름: a 기준 1.0 → 실제 2.0', '⏸ 꺼짐: b', '⚠ 빠짐: c', '➕ 기준에 없음: z']);
  console.log('selftest ok');
} else {
  main(process.argv[2] === '--full').catch(() => console.log(FAIL));
}
