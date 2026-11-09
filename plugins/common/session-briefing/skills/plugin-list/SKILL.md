---
name: plugin-list
description: 사용자가 설치된/켜진/적용된 플러그인 목록을 보여달라고 할 때 사용 (예: "설치된 플러그인 보여줘", "플러그인 목록").
allowed-tools: Bash(node:*)
---

아래 내용을 그대로 보여준다. 방금 새로 조회한 결과다(덧붙일 설명 없음).

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/briefing.mjs" --full 2>/dev/null || echo "플러그인 목록을 가져오지 못함"`
