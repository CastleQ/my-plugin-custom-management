---
name: plugin-list
description: 사용자가 설치된/켜진/적용된 플러그인 목록을 보여달라고 할 때 사용 (예: "설치된 플러그인 보여줘", "플러그인 목록").
allowed-tools: Bash(node:*)
---

아래 표를 그대로 보여준다. 첫 줄의 지시문은 빼고 표만.

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/briefing.mjs" 2>/dev/null || echo "플러그인 목록을 가져오지 못함"`
