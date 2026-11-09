# 이 리포 작업 규칙

## main 병합은 알아서, 후보고 (사용자 결정 2026-11-09)
개인 지침의 "배포 여부는 따로 묻는다"보다 이 규칙이 우선한다.
- 아래 검사가 모두 통과하면 묻지 않고 PR을 만들어 main에 병합하고, 끝난 뒤 무엇을 올렸는지 보고한다.
  - `claude plugin validate .`
  - `claude plugin validate plugins/common/session-briefing`
  - `node plugins/common/session-briefing/scripts/briefing.mjs --selftest`
- 예외(병합 전에 묻는다): `guidelines/CLAUDE.md`(개인 지침 원본)를 바꿀 때, 진열장에서 플러그인을 빼거나 고정 버전(sha)을 올릴 때.
  main이 곧 모든 세션·모든 리포에 적용되는 실제 설정이라, 잘못되면 다음 세션부터 전부 영향을 받기 때문.

## 알아둘 함정
- 계정 연동 플러그인은 claude.ai 일반 대화(폰·웹)에도 따라오지만, 거기선 **명령을 실행할 때만** 실행 환경이 켜져 SessionStart 훅(브리핑)이 돈다. "안녕"엔 브리핑이 안 나오는 게 정상.
- 일반 대화에도 `CLAUDE_CODE_REMOTE=true`가 있다 → 클라우드 세션 판별에 못 씀. 준비 스크립트가 쓰는 `~/.claude/settings.json`(언어) 유무로 판별.
- `CLAUDE_CODE_PLUGIN_DIRS` 같은 예약 환경 변수는 세션에서 못 바꿈(update_environment 거부) → 사용자에게 웹 환경 설정에서 지우게 안내.
- 자동 승인 모드에서 `npx 외부패키지`와 내려받은 스크립트 실행은 막힌다. k-skill은 `SKILL.md`(npx 껍데기) 말고 sha 고정 `instruction.md`를 읽고 curl로 처리.
- `codeload.github.com` 압축 파일은 403. 특정 sha 일부만 필요하면 `raw.githubusercontent.com/<소유자>/<리포>/<sha>/<경로>` 또는 `git fetch --depth 1 --filter=blob:none <url> <sha>` + sparse-checkout.
- 상시 토큰은 한국어 설명이 비싸다(입구 스킬 설명 한 줄 ≈ 180토큰) → 스킬 설명은 짧게, 바꾼 뒤 브리핑 숫자로 확인.
