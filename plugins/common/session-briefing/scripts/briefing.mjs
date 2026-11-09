// 세션 시작 시 플러그인 목록을 짧은 표로 출력한다. 출력은 매 세션 맥락(토큰)에 들어가므로 최소한으로 유지.
import { execFileSync } from 'node:child_process';

const LABEL = {
  synced: '계정 연동',
  session: '환경 자동설치',
  project: '이 리포 전용',
  local: '이 리포(나만)',
  user: '내 PC 설정',
  managed: '관리자 지정',
};
const FAIL = '[세션 브리핑] 첫 답변 맨 위에 "플러그인 목록을 가져오지 못함" 한 줄만 쓸 것.';

let rows;
try {
  const list = JSON.parse(execFileSync('claude', ['plugin', 'list', '--json'], { encoding: 'utf8', timeout: 15000 }));
  if (!Array.isArray(list)) throw new Error('not an array');
  rows = list.map(p => {
    const name = String(p.id).split('@')[0];
    const off = p.enabled === false ? ' (꺼짐)' : '';
    return `|${name}${off}|${LABEL[p.scope] ?? p.scope}|`;
  });
} catch {
  console.log(FAIL);
  process.exit(0);
}

console.log([
  '[세션 브리핑] 첫 답변 맨 위에 아래 표를 그대로 보여줄 것(이후 답변엔 반복 금지).',
  '|플러그인|출처|',
  '|:-|:-|',
  ...(rows.length ? rows : ['|(없음)|-|']),
].join('\n'));
