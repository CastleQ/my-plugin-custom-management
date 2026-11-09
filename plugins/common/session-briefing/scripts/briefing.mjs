// 세션 시작 시 플러그인 목록을 짧은 표로 출력한다. 출력은 매 세션 맥락(토큰)에 들어가므로 최소한으로 유지.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const LABEL = {
  synced: '계정 연동',
  session: '환경 자동설치',
  project: '이 리포 전용',
  local: '이 리포(나만)',
  user: '내 PC 설정',
  managed: '관리자 지정',
};
const FAIL = '[세션 브리핑] 첫 답변 맨 위에 "플러그인 목록을 가져오지 못함" 한 줄만 쓸 것.';

// "Always-on: ~641 tok" / "~1.2k tok" → 숫자. 못 읽으면 null(표에는 "?").
export function parseCost(text) {
  const m = /Always-on:\s*~?([\d.]+)(k?)\s*tok/.exec(text);
  return m ? Math.round(parseFloat(m[1]) * (m[2] ? 1000 : 1)) : null;
}

async function cost(name) {
  try {
    const { stdout } = await run('claude', ['plugin', 'details', name], { encoding: 'utf8', timeout: 10000 });
    return parseCost(stdout);
  } catch {
    return null;
  }
}

async function main() {
  const { stdout } = await run('claude', ['plugin', 'list', '--json'], { encoding: 'utf8', timeout: 15000 });
  const list = JSON.parse(stdout);
  if (!Array.isArray(list)) throw new Error('not an array');
  const names = list.map(p => String(p.id).split('@')[0]);
  const costs = await Promise.all(names.map(cost));
  const rows = list.map((p, i) => {
    const off = p.enabled === false ? ' (꺼짐)' : '';
    return `|${names[i]}${off}|${LABEL[p.scope] ?? p.scope}|${costs[i] ?? '?'}|`;
  });
  const total = costs.reduce((s, c, i) => s + (list[i].enabled === false ? 0 : c ?? 0), 0);
  console.log([
    '[세션 브리핑] 첫 답변 맨 위에 아래 표를 그대로 보여줄 것(이후 답변엔 반복 금지).',
    '|플러그인|출처|상시 토큰|',
    '|:-|:-|-:|',
    ...(rows.length ? rows : ['|(없음)|-|-|']),
    `|합계(켜진 것)||${total}|`,
  ].join('\n'));
}

if (process.argv[2] === '--selftest') {
  const assert = (await import('node:assert')).strict;
  assert.equal(parseCost('  Always-on:   ~641 tok   added'), 641);
  assert.equal(parseCost('Always-on: ~1.2k tok'), 1200);
  assert.equal(parseCost('nothing'), null);
  console.log('selftest ok');
} else {
  main().catch(() => console.log(FAIL));
}
