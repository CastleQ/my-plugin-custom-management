---
name: optional-tools
description: 한국 생활·공공정보 조회(주차장, 서울 혼잡도, 고속도로 교통, 법령·판례, 사업자 상태, 주식 시세, 쓰레기 배출, 우편번호, 공공시설 대여, 영화 상영시간)나 한국어 글을 사람이 쓴 것처럼 다듬기·글자 수 세기가 필요할 때, 또는 "쓸 만한 도구 있어?"라고 물을 때 사용.
allowed-tools: Bash(curl:*)
---

꺼내 쓰는 도구 목록을 읽고, 그 안의 **규칙**대로 맞는 도구를 꺼내 쓴다.

- 지금 리포에 `plugins/optional/catalog.md`가 있으면 그 파일을 읽는다(이 진열장 리포에서 작업 중).
- 없으면: `curl -fsSL https://raw.githubusercontent.com/CastleQ/my-plugin-custom-management/main/plugins/optional/catalog.md`
- 목록을 못 받으면 `⚠ 꺼내 쓰는 도구 목록을 가져오지 못함` 한 줄로 알리고 평소대로 처리한다.
