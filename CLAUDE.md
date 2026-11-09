# 이 리포 작업 규칙

## main 병합은 알아서, 후보고 (사용자 결정 2026-11-09)
개인 지침의 "배포 여부는 따로 묻는다"보다 이 규칙이 우선한다.
- 아래 검사가 모두 통과하면 묻지 않고 PR을 만들어 main에 병합하고, 끝난 뒤 무엇을 올렸는지 보고한다.
  - `claude plugin validate .`
  - `claude plugin validate plugins/common/session-briefing`
  - `node plugins/common/session-briefing/scripts/briefing.mjs --selftest`
- 예외(병합 전에 묻는다): `guidelines/CLAUDE.md`(개인 지침 원본)를 바꿀 때, 진열장에서 플러그인을 빼거나 고정 버전(sha)을 올릴 때.
  main이 곧 모든 세션·모든 리포에 적용되는 실제 설정이라, 잘못되면 다음 세션부터 전부 영향을 받기 때문.
