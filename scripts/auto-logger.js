#!/usr/bin/env node

/**
 * 자동 작업 기록 시스템
 * 작업 완료시 자동으로 진행상황을 기록하고 다음 단계를 제안
 */

const fs = require('fs');
const path = require('path');

class AutoLogger {
    constructor() {
        this.projectRoot = process.cwd();
        this.today = new Date().toISOString().split('T')[0].replace(/-/g, '_');
        this.logFile = `WORK_LOG_${this.today}.md`;
        this.planFile = 'HYBRID_DEVELOPMENT_PLAN.md';
        this.statusFile = 'PROJECT_STATUS.json';
    }

    // 현재 작업 상태 읽기
    readCurrentStatus() {
        try {
            const statusPath = path.join(this.projectRoot, this.statusFile);
            if (fs.existsSync(statusPath)) {
                return JSON.parse(fs.readFileSync(statusPath, 'utf8'));
            }
        } catch (error) {
            console.log('기존 상태 파일이 없어 새로 생성합니다.');
        }
        
        return {
            currentPhase: 1,
            currentStep: 1,
            completedTasks: [],
            currentTasks: [],
            nextTasks: [],
            lastUpdate: new Date().toISOString(),
            totalProgress: 0
        };
    }

    // 작업 상태 저장
    saveStatus(status) {
        const statusPath = path.join(this.projectRoot, this.statusFile);
        fs.writeFileSync(statusPath, JSON.stringify(status, null, 2), 'utf8');
    }

    // 오늘 작업 로그 읽기 또는 생성
    getTodayLog() {
        const logPath = path.join(this.projectRoot, this.logFile);
        
        if (fs.existsSync(logPath)) {
            return fs.readFileSync(logPath, 'utf8');
        }
        
        // 새 로그 파일 생성
        const template = this.generateLogTemplate();
        fs.writeFileSync(logPath, template, 'utf8');
        return template;
    }

    // 로그 파일 템플릿 생성
    generateLogTemplate() {
        const date = new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });

        return `# 작업 기록 - ${date}

## 📋 오늘의 목표
- [ ] 목표 1 (자동 생성됨)
- [ ] 목표 2 (자동 생성됨)
- [ ] 목표 3 (자동 생성됨)

## 🔧 수행한 작업

### 시작 시간: ${new Date().toLocaleTimeString('ko-KR')}

## 🎯 완료된 작업
<!-- 자동 기록 영역 -->

## 🐛 발견한 이슈
<!-- 이슈가 있다면 여기에 기록 -->

## 📚 다음 작업 계획
<!-- 자동 생성 영역 -->

## 💡 메모
<!-- 중요한 발견사항이나 아이디어 -->

---
**자동 생성**: ${new Date().toISOString()}
`;
    }

    // 작업 완료 기록
    logTaskCompletion(taskTitle, description, changedFiles = []) {
        const status = this.readCurrentStatus();
        const timestamp = new Date().toLocaleTimeString('ko-KR');
        
        // 완료된 작업 추가
        const completedTask = {
            title: taskTitle,
            description: description,
            completedAt: timestamp,
            changedFiles: changedFiles
        };
        
        status.completedTasks.push(completedTask);
        status.lastUpdate = new Date().toISOString();
        
        // 로그 파일 업데이트
        this.updateLogFile(completedTask);
        
        // 다음 작업 제안
        const nextTasks = this.suggestNextTasks(status);
        status.nextTasks = nextTasks;
        
        // 진행률 업데이트
        status.totalProgress = this.calculateProgress(status);
        
        // 상태 저장
        this.saveStatus(status);
        
        // 결과 출력
        this.printSummary(completedTask, nextTasks, status.totalProgress);
        
        return status;
    }

    // 로그 파일 업데이트
    updateLogFile(completedTask) {
        const logPath = path.join(this.projectRoot, this.logFile);
        let logContent = this.getTodayLog();
        
        const completedSection = `
### ✅ ${completedTask.title} (${completedTask.completedAt})
${completedTask.description}

**변경된 파일들:**
${completedTask.changedFiles.map(file => `- ${file}`).join('\n')}

`;
        
        // "## 🎯 완료된 작업" 섹션에 추가
        const completedSectionRegex = /(## 🎯 완료된 작업\s*(?:<!--[\s\S]*?-->)?)/;
        if (completedSectionRegex.test(logContent)) {
            logContent = logContent.replace(completedSectionRegex, `$1${completedSection}`);
        } else {
            logContent += completedSection;
        }
        
        fs.writeFileSync(logPath, logContent, 'utf8');
    }

    // 다음 작업 제안
    suggestNextTasks(status) {
        const phase = status.currentPhase;
        const step = status.currentStep;
        
        const phaseTasks = {
            1: { // Phase 1: HTML → React Native Web
                1: [
                    'HTML 구조 상세 분석 및 컴포넌트 목록 작성',
                    'CSS 스타일 추출 및 디자인 토큰 생성',
                    '핵심 TarotCard 컴포넌트 React Native 버전 생성'
                ],
                2: [
                    'TimeDisplay 컴포넌트 React Native Web 구현',
                    'SpreadLayout 컴포넌트 변환',
                    '웹에서 기본 레이아웃 테스트'
                ],
                3: [
                    '전체 홈 화면 React Native Web 완성',
                    '스프레드 화면 레이아웃 변환',
                    '디자인 일치도 95% 달성 확인'
                ]
            },
            2: { // Phase 2: 백엔드 연동
                1: [
                    'dailyTarotStore와 홈 화면 연결',
                    '시간별 카드 생성 로직 연동',
                    '웹에서 카드 표시 테스트'
                ],
                2: [
                    'spreadStore와 스프레드 화면 연결',
                    '카드 뽑기 기능 구현',
                    '스프레드 저장 기능 테스트'
                ],
                3: [
                    '일기 화면 diaryStore 연동',
                    '설정 화면 settingsStore 연동',
                    '웹에서 전체 기능 테스트'
                ]
            },
            3: { // Phase 3: 네이티브 전환
                1: [
                    '기본 컴포넌트 네이티브 변환',
                    'React Navigation 설정',
                    'iOS/Android 기본 빌드 테스트'
                ],
                2: [
                    '카드 애니메이션 네이티브 구현',
                    '터치 인터랙션 최적화',
                    '성능 최적화'
                ],
                3: [
                    '푸시 알림 구현',
                    '위젯 기능 추가',
                    '네이티브 기능 완성'
                ]
            },
            4: { // Phase 4: 배포 준비
                1: [
                    '앱 아이콘 및 스플래시 스크린',
                    '앱스토어 메타데이터 준비',
                    '최종 테스트'
                ],
                2: [
                    'iOS 앱스토어 빌드',
                    'Android 플레이스토어 빌드',
                    '심사 제출'
                ]
            }
        };
        
        return phaseTasks[phase] && phaseTasks[phase][step] 
            ? phaseTasks[phase][step] 
            : ['다음 단계 계획 수립 필요'];
    }

    // 진행률 계산
    calculateProgress(status) {
        const totalTasks = 20; // 전체 예상 작업 수
        const completed = status.completedTasks.length;
        return Math.min(Math.round((completed / totalTasks) * 100), 100);
    }

    // 결과 요약 출력
    printSummary(completedTask, nextTasks, progress) {
        console.log('\n🎉 작업 완료 기록됨!');
        console.log('='.repeat(50));
        console.log(`✅ 완료: ${completedTask.title}`);
        console.log(`⏰ 시간: ${completedTask.completedAt}`);
        console.log(`📊 전체 진행률: ${progress}%`);
        console.log('\n🎯 다음 추천 작업:');
        nextTasks.forEach((task, index) => {
            console.log(`   ${index + 1}. ${task}`);
        });
        console.log('\n📝 작업 기록이 업데이트되었습니다:');
        console.log(`   - WORK_LOG_${this.today}.md`);
        console.log(`   - PROJECT_STATUS.json`);
        console.log('='.repeat(50));
    }

    // Git 변경사항 감지
    getChangedFiles() {
        try {
            const { execSync } = require('child_process');
            const output = execSync('git diff --name-only HEAD~1 2>/dev/null || echo ""', { encoding: 'utf8' });
            return output.trim().split('\n').filter(line => line.length > 0);
        } catch (error) {
            return ['변경사항 감지 실패'];
        }
    }

    // 프로젝트 상태 요약
    getProjectSummary() {
        const status = this.readCurrentStatus();
        
        return {
            currentPhase: `Phase ${status.currentPhase}`,
            totalProgress: `${status.totalProgress}%`,
            completedToday: status.completedTasks.filter(task => {
                const today = new Date().toDateString();
                const taskDate = new Date(status.lastUpdate).toDateString();
                return today === taskDate;
            }).length,
            nextTasks: status.nextTasks.slice(0, 3)
        };
    }
}

// CLI 인터페이스
if (require.main === module) {
    const logger = new AutoLogger();
    const args = process.argv.slice(2);
    
    if (args[0] === 'complete') {
        const taskTitle = args[1] || '작업 완료';
        const description = args[2] || '작업이 성공적으로 완료되었습니다.';
        const changedFiles = logger.getChangedFiles();
        
        logger.logTaskCompletion(taskTitle, description, changedFiles);
    } else if (args[0] === 'status') {
        const summary = logger.getProjectSummary();
        console.log('\n📊 프로젝트 현재 상황');
        console.log('='.repeat(30));
        console.log(`현재 단계: ${summary.currentPhase}`);
        console.log(`전체 진행률: ${summary.totalProgress}`);
        console.log(`오늘 완료: ${summary.completedToday}개 작업`);
        console.log('\n다음 작업:');
        summary.nextTasks.forEach((task, i) => {
            console.log(`  ${i + 1}. ${task}`);
        });
        console.log('='.repeat(30));
    } else {
        console.log(`
🔮 자동 작업 기록 시스템

사용법:
  node scripts/auto-logger.js complete "작업제목" "작업설명"
  node scripts/auto-logger.js status

예시:
  node scripts/auto-logger.js complete "HTML 분석 완료" "홈 화면 HTML 구조 완전 분석"
  node scripts/auto-logger.js status
        `);
    }
}

module.exports = AutoLogger;