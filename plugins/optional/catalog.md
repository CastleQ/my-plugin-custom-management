# 꺼내 쓰는 도구 목록

평소엔 꺼져 있다가, 작업에 맞을 때만 Claude가 이 목록을 보고 꺼내 쓰는 도구.
입구: session-briefing의 `optional-tools` 스킬. 이 파일이 원본이고, 다른 리포에서는 main 브랜치의 이 파일을 인터넷 주소로 받아 읽는다.

## 규칙 (Claude가 따름)

1. **알리기**: 꺼내 쓸 때 답변 첫 줄에 `📦 꺼내 씀: <스킬>` 한 줄. 어느 세션에서든 같은 모양.
2. **고정 시점만 읽기**: 아래 표의 sha 주소에서 `instruction.md`를 받아 그대로 따른다.
   `SKILL.md`와 `npx @nomadamas/k-skill` 안내는 무시(매번 최신판을 받아 실행 → 고정이 깨지고 자동 승인에서도 막힘).
   주소: `https://raw.githubusercontent.com/NomaDamas/k-skill/<sha>/<스킬>/instruction.md`
3. **실행 방식에 따라**
   - `curl`: 안내서의 `curl` 요청(중계 서버 `k-skill-proxy.nomadamas.org` 경유)을 그대로 보낸다.
   - `스크립트`: 받아온 스크립트 실행은 자동 승인에서 막힌다. 먼저 스크립트를 읽고 같은 요청을 `curl`로 직접 보낸다. 그래도 안 되면 "스크립트 실행 승인이 필요합니다"라고 사용자에게 묻는다.
   - `안내`: 안내서 내용대로 Claude가 직접 처리(실행할 것 없음).
4. **개인정보 금지**: 중계 서버로 이름·전화번호·주민번호 등 개인정보를 보내지 않는다. 사업자등록번호처럼 공개 정보는 괜찮다.
5. **실패 처리**: 안 되면 추측해서 채우지 말고, `⚠ <스킬> 실패: <이유 한 줄>`로 알린 뒤 대신 할 수 있는 방법(웹 검색 등)을 제안.
6. **목록 밖의 일**: 여기에 없는 도구가 필요해 보이면 쓰지 말고 "목록에 추가할까요?"라고 묻는다.

## 목록

출처: [NomaDamas/k-skill](https://github.com/NomaDamas/k-skill) · 고정 sha `9766d20fb1fe1a5eb1d10ef5ff9872c8d6fc4985` (2026-11-06)

| 스킬 | 언제 | 실행 방식 |
| :- | :- | :- |
| parking-lot-search | 도착지 근처 공영주차장 위치·요금·운영시간 | curl |
| seoul-density | 서울 주요 장소 실시간 혼잡도 | curl |
| highway-traffic-status | 고속도로 구간별 속도·정체 | 스크립트 |
| korean-law-search | 법령·조문·판례·유권해석 검색 | curl |
| nts-business-registration | 사업자등록번호 상태(계속·휴업·폐업) 확인 | curl |
| biz-health-check | 사업자 종합 확인(체납·인허가 등, 키 없으면 일부만) | 스크립트 |
| household-waste-info | 시군구별 쓰레기 배출 요일·시간·장소 | curl |
| zipcode-search | 주소로 우편번호·영문 주소 | 스크립트 |
| sharenuri-facility-search | 공공시설(회의실·체육시설 등) 대여 검색 | 스크립트 |
| korean-cinema-search | CGV·메가박스·롯데시네마 상영시간·잔여석 | 스크립트(npm `daiso` 실행 필요) |
| korean-stock-search | 국내 상장 종목 검색·기본정보·일별 시세 | curl |
| korean-humanizer | AI 티 나는 한국어 글을 사람이 쓴 것처럼 다듬기 | 안내 |
| korean-character-count | 한국어 글자 수·줄 수·바이트 수 정확히 세기 | 안내(Claude가 직접 셈) |

## 추가·변경 방법

- 표에 한 줄 추가 → main에 병합하면 모든 세션에 바로 반영(플러그인 재설치 불필요).
- 훅·MCP가 있는 플러그인은 꺼내 쓸 수 없음 → `marketplace.json`에 `category: optional`로 올리고, Claude는 "웹 claude.ai에서 켜고 새 세션 열어주세요"라고 추천만.
- sha를 올릴 땐 바뀐 안내서를 훑어보고 올린다.
