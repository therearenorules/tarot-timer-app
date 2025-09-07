#!/bin/bash

# 작업 추적 자동화 스크립트
# 작업 완료시 자동으로 기록하고 다음 단계 제안

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 프로젝트 루트로 이동
cd "$(dirname "$0")/.."

# 함수: 작업 완료 기록
log_completion() {
    local task_title="$1"
    local description="$2"
    
    if [[ -z "$task_title" ]]; then
        echo -e "${RED}❌ 작업 제목을 입력해주세요.${NC}"
        echo "사용법: ./scripts/work-tracker.sh complete '작업제목' '작업설명'"
        exit 1
    fi
    
    if [[ -z "$description" ]]; then
        description="작업이 완료되었습니다."
    fi
    
    echo -e "${BLUE}📝 작업 완료를 기록하는 중...${NC}"
    
    # Node.js 스크립트 실행
    node scripts/auto-logger.js complete "$task_title" "$description"
    
    echo -e "${GREEN}✅ 작업 기록 완료!${NC}"
}

# 함수: 현재 상태 확인
check_status() {
    echo -e "${BLUE}📊 현재 프로젝트 상태 확인 중...${NC}"
    node scripts/auto-logger.js status
}

# 함수: Git 자동 커밋
auto_commit() {
    local task_title="$1"
    
    if [[ -z "$task_title" ]]; then
        task_title="작업 진행 상황 업데이트"
    fi
    
    echo -e "${BLUE}📚 Git 변경사항 확인 중...${NC}"
    
    # 변경사항이 있는지 확인
    if [[ -n $(git status --porcelain) ]]; then
        git add .
        
        # 커밋 메시지 생성
        local commit_msg="feat: ${task_title}

자동 작업 기록 시스템에 의한 진행상황 업데이트

🔮 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
        
        git commit -m "$commit_msg"
        echo -e "${GREEN}✅ Git 커밋 완료!${NC}"
        
        # 원격 저장소 푸시 여부 확인
        read -p "$(echo -e ${YELLOW}원격 저장소에 푸시하시겠습니까? [y/N]: ${NC})" -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push
            echo -e "${GREEN}✅ 원격 저장소 푸시 완료!${NC}"
        fi
    else
        echo -e "${YELLOW}ℹ️  커밋할 변경사항이 없습니다.${NC}"
    fi
}

# 함수: 작업 세션 시작
start_session() {
    echo -e "${BLUE}🚀 새로운 작업 세션을 시작합니다...${NC}"
    
    # 현재 상태 확인
    check_status
    
    echo -e "\n${YELLOW}📋 작업을 시작하기 전에 확인사항:${NC}"
    echo "1. 개발 계획서: cat HYBRID_DEVELOPMENT_PLAN.md"
    echo "2. 오늘 작업 로그: cat WORK_LOG_$(date +%Y_%m_%d).md"
    echo "3. HTML 디자인: open 'figma UI/full-app-demo.html'"
    echo "4. 웹 서버 시작: npm run web"
    
    echo -e "\n${GREEN}💡 작업 완료 시 다음 명령어로 기록하세요:${NC}"
    echo "./scripts/work-tracker.sh complete '작업제목' '작업설명'"
}

# 함수: 일일 요약 생성
daily_summary() {
    echo -e "${BLUE}📊 오늘 작업 요약을 생성하는 중...${NC}"
    
    local today=$(date +%Y_%m_%d)
    local log_file="WORK_LOG_${today}.md"
    
    if [[ -f "$log_file" ]]; then
        echo -e "${GREEN}📋 오늘의 작업 기록:${NC}"
        echo "========================================"
        
        # 완료된 작업 섹션 추출
        sed -n '/## 🎯 완료된 작업/,/## /p' "$log_file" | head -n -1
        
        echo "========================================"
        echo -e "${BLUE}📁 파일 위치: $log_file${NC}"
    else
        echo -e "${YELLOW}ℹ️  오늘 작업 로그가 없습니다.${NC}"
    fi
    
    # Git 통계
    echo -e "\n${BLUE}📈 Git 통계 (오늘):${NC}"
    git log --since="$(date '+%Y-%m-%d 00:00:00')" --pretty=format:"- %h: %s" 2>/dev/null || echo "커밋 없음"
}

# 함수: 빠른 도움말
show_help() {
    echo -e "${BLUE}🔮 작업 추적 자동화 도구${NC}"
    echo "========================================"
    echo "사용법:"
    echo "  start                     - 작업 세션 시작"
    echo "  complete 'title' 'desc'   - 작업 완료 기록"
    echo "  status                   - 현재 상태 확인"
    echo "  commit 'title'           - Git 자동 커밋"
    echo "  summary                  - 일일 작업 요약"
    echo "  help                     - 이 도움말"
    echo ""
    echo "예시:"
    echo "  ./scripts/work-tracker.sh start"
    echo "  ./scripts/work-tracker.sh complete 'HTML 분석' '홈 화면 구조 분석 완료'"
    echo "  ./scripts/work-tracker.sh commit '첫 번째 컴포넌트 완성'"
    echo "========================================"
}

# 메인 실행 로직
case "${1:-help}" in
    "complete")
        log_completion "$2" "$3"
        auto_commit "$2"
        ;;
    "status")
        check_status
        ;;
    "start")
        start_session
        ;;
    "commit")
        auto_commit "$2"
        ;;
    "summary")
        daily_summary
        ;;
    "help"|*)
        show_help
        ;;
esac