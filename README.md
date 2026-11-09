# my-plugin-custom-management

CastleQ 개인용 **Claude 플러그인·스킬 공통 관리 리포**입니다.

## 이 리포는 왜 있나

- 어떤 작업(바이브코딩 리포, 일반 대화)을 하든 **항상 공통으로 쓰는 플러그인과 스킬**을 한 곳에서 관리하기 위해 만들었습니다.
- 작업은 전부 **Claude Code 클라우드 세션**(GitHub 리포 연결)에서 하고, 여러 PC와 폰을 오가며 이어서 합니다. 로컬 세션은 쓰지 않습니다.
- 클라우드 세션은 **각 작업 리포의 `.claude/settings.json`에 적어둔 플러그인을 설치하지 않습니다.** 그래서 리포마다 설정하는 대신, 이 리포를 **개인 플러그인 마켓(진열장)** 으로 만들어 **claude.ai 계정에 연결**하는 방식으로 관리합니다. 계정에서 켠 플러그인은 `이름@synced`로 일반 대화와 Claude Code 양쪽에 따라옵니다.

## 구성

```
my-plugin-custom-management/
├── .claude-plugin/
│   └── marketplace.json        # 진열장 목록: 이 리포가 제공하는 플러그인 목록
├── plugins/
│   ├── common/                 # 항상 켜두는 공통 플러그인 (모든 세션에 적용)
│   │   └── session-briefing/   # 세션 시작 시 적용된 플러그인 목록을 첫 답변에 표로 보여주는 플러그인
│   └── optional/
│       └── catalog.md          # 꺼내 쓰는 도구 목록과 규칙 (평소엔 꺼짐, 필요할 때만 Claude가 꺼내 씀)
├── docs/
│   └── handoff-2026-11-09.md   # 이 리포를 만든 배경과 다음 할 일 (작업 인계 문서)
└── README.md
```

- **common / optional 분리 이유**: 항상 켜지는 플러그인은 매 세션 토큰을 소모하므로, 정말 공통인 것만 `common`에 둡니다.
- 남이 만든 플러그인도 `marketplace.json`에 GitHub 주소로 적어 함께 묶을 수 있습니다.

## 세션 시작 브리핑 (session-briefing)

목표: 어느 기기·어느 리포에서든 **같은 도구 세트**인지, 신경 쓰지 않아도 눈에 들어오게 하기.

- **평소**: 첫 답변 맨 위에 한 줄 — `🧰 공통 도구 5개 정상 · 개인 지침 ✓ · 상시 약 2011토큰`
- **기준과 다를 때만** 문제 줄 + 표를 펼침: ⚠ 빠짐 / ⏸ 꺼짐 / 🔁 중복 / 🔄 버전 다름 / ➕ 기준에 없음 / 📄 개인 지침 다름·없음
- **요청할 때**: "설치된 플러그인 보여줘" 또는 `/session-briefing:plugin-list` → 하는 일까지 들어간 전체 표
- 기준 목록: `plugins/common/session-briefing/expected.json` (플러그인을 추가·삭제·버전 변경할 때 같이 고침)
- 개인 지침 원본: `plugins/common/session-briefing/guidelines/CLAUDE.md` (실제 `~/.claude/CLAUDE.md`와 같은지 확인). 일반 대화(claude.ai)엔 이 파일이 없으므로 "개인 지침 대화 설정"으로 표시하고 문제로 치지 않음 — 그쪽 지침은 claude.ai 설정의 개인 선호에 넣음
- 출처 표시: 계정 연동(`synced`) / 환경 자동설치(`session`) / 이 리포 전용(`project`) / 이 리포(나만)(`local`) / 내 PC 설정(`user`) / 관리자 지정(`managed`)
- 상시 토큰: `claude plugin details`의 Always-on 추정치. 세션 시작 훅이 끼워 넣는 글은 포함되지 않아 실제 부담은 더 큼.
- 세션 **처음 시작할 때만** 실행(이어하기 제외). 실패하면 "플러그인 목록을 가져오지 못함" 한 줄.

## 꺼내 쓰는 도구 (optional)

평소엔 토큰을 쓰지 않다가, 작업에 맞을 때만 Claude가 꺼내 쓰는 도구.

- 목록·규칙: `plugins/optional/catalog.md` (main에 병합하면 모든 세션에 바로 반영)
- 입구: session-briefing의 `optional-tools` 스킬(상시 약 70토큰)이 관련 요청 때 목록을 읽게 함
- 스킬만 있는 것은 고정 시점(sha)의 안내서를 읽고 따름. 훅·MCP가 있는 것은 "켜고 새 세션 열어주세요"라고 추천만
- 꺼내 쓸 때 답변 첫 줄에 `📦 꺼내 씀: 스킬이름`이 붙음
- 현재: k-skill 13개 (주차장·혼잡도·고속도로·법령·사업자·주식·쓰레기·우편번호·공공시설·영화관·글 다듬기·글자 수)

## 공통 도구 세트 (어디서 켜나)

| 플러그인 | 켜는 곳 | 버전 |
| :- | :- | :- |
| session-briefing, superpowers, ponytail | 이 진열장 → 웹 claude.ai에서 켬 | 진열장에 커밋(sha)으로 고정 |
| claude-md-management | 웹 claude.ai "탐색"(Anthropic 공식 목록)에서 켬 — 공식 이름이라 개인 진열장에 못 올림 | 고정 불가, 바뀌면 브리핑이 알림 |
| cowork-plugin-management | 계정 기본 제공 | 따지지 않음 |
| 개인 지침(CLAUDE.md) | 클라우드 환경 준비 스크립트가 이 리포의 원본을 받아 씀 | main 기준 |

## 연결 방법

**웹 claude.ai**(데스크톱 앱 설정 말고) → 설정 → 플러그인 → "+ 추가" → 마켓플레이스 추가 → `CastleQ/my-plugin-custom-management` → `session-briefing` 켜기 → "내 항목"에 보이면 완료. 새 플러그인은 진열장에 추가·병합한 뒤 같은 화면에서 켠다.

## 플러그인 추가 방법

`.claude-plugin/marketplace.json`의 `plugins` 목록에 한 항목을 추가하고 커밋·푸시 → claude.ai에서 해당 플러그인 켜기.

- 직접 만든 것: 폴더를 `plugins/common/이름/` 또는 `plugins/optional/이름/`에 두고 `"source": "./plugins/common/이름"`
- 남이 만든 것(GitHub): `"source": { "source": "github", "repo": "소유자/리포" }` — 보통은 Claude에게 GitHub 주소만 주면 리포 구조를 확인해 알맞은 형태로 넣음
  - 리포 맨 위에 플러그인이 있으면 위 형태, 한 리포에 여러 플러그인이 든 "진열장형" 리포면 그 안의 하위 폴더를 지정
  - 갑작스러운 변경을 막기 위해 특정 시점(커밋, `sha`)으로 고정
- 추가 후 `expected.json`(기준 목록)에도 넣기
- 추가 후 `claude plugin validate .` 로 검사

## 상태

- 2026-11-09: 리포 생성, README 작성. 이후 작업은 `docs/handoff-2026-11-09.md` 참고.
- 2026-11-09: 진열장(`marketplace.json`)과 `session-briefing` 0.1.0 작성. `claude plugin validate` 통과. 클라우드 세션 안에서 `--plugin-dir`로 띄운 시험 세션에서 첫 답변 맨 위에 표가 나오는 것 확인. **다음: claude.ai 계정 연결 후 새 세션에서 확인.**
- 2026-11-09: 주문형 보기 스킬(`plugin-list`) 추가. 시험 세션에서 "설치된 플러그인 보여줘"로 표가 나오는 것 확인.
- 2026-11-09: claude.ai 계정 연결 완료(공개 리포 OK). 새 클라우드 세션 첫 답변 표와 "설치된 플러그인 보여줘" 모두 동작 확인. **1차 목표 완료.**
- 2026-11-09: 0.3.0 — 표에 플러그인별 상시 토큰과 합계 추가. headroom은 클라우드 세션에서 효과가 없어 보류(필요하면 재검토).
- 2026-11-09: 0.4.0 — 기준 목록 비교(평소 한 줄, 다를 때만 펼침), 요청 시 "하는 일" 칸, 개인 지침 점검. superpowers·ponytail을 sha 고정으로 진열장에 등록.
- 2026-11-09 (점검): 계정 연동 5개(session-briefing 0.4.0, superpowers 7.0.2, ponytail 5.3.3, claude-md-management 1.0.0, cowork-plugin-management 0.2.2) 모두 켜짐·기준과 일치. 단, 환경 변수 `CLAUDE_CODE_PLUGIN_DIRS`가 Default 환경에 **아직 남아** 있어 빈 경로 3개(`inline[0~2]`, 꺼짐)가 생기고 브리핑이 펼쳐짐. 세션 안에서는 지울 수 없는 예약 변수 → **웹 claude.ai 환경 설정에서 직접 지우고 저장**해야 함.
- 2026-11-09: 0.5.0 — "꺼내 쓰는 도구" 구조(`plugins/optional/catalog.md` + 입구 스킬 `optional-tools`). k-skill 13개 등록(sha 고정). 주차장 스킬로 중계 서버 조회 실제 동작 확인. **main 병합 후 새 세션에서 "서울시청 근처 공영주차장"으로 확인 필요.**
- 2026-11-09: 0.5.1 — 일반 대화(폰)에서 꺼내 쓰기 동작 확인(주차장). 일반 대화에선 지침 파일이 없는 게 정상이라 문제로 표시하지 않음. 입구 스킬 설명 축약(상시 토큰이 예상 70이 아니라 약 180 늘었음).
