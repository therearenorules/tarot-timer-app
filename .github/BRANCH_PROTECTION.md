# Branch Protection Configuration Guide

This document outlines the recommended branch protection settings for the Tarot Timer App repository.

## 🛡️ Main Branch Protection

### Required Settings for `main` branch:

1. **Require pull request reviews before merging**
   - Required number of reviewers: 1
   - Dismiss stale reviews when new commits are pushed: ✅
   - Require review from code owners: ✅ (if CODEOWNERS exists)

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging: ✅
   - Required status checks:
     - `test (18.x)`
     - `test (20.x)`  
     - `build`
     - `security`

3. **Require conversation resolution before merging**: ✅

4. **Require linear history**: ✅

5. **Require deployments to succeed before merging**: ❌

6. **Lock branch**: ❌

7. **Do not allow bypassing the above settings**: ✅

8. **Restrict pushes that create files**: ❌

## 🔧 Development Branch Protection  

### Settings for `develop` branch:

1. **Require pull request reviews before merging**
   - Required number of reviewers: 1
   - Dismiss stale reviews: ✅

2. **Require status checks to pass before merging**
   - Require branches to be up to date: ✅
   - Required status checks:
     - `test (20.x)`
     - `build`

3. **Require conversation resolution before merging**: ✅

## 🏷️ Release Branch Protection

### Settings for `release/*` branches:

1. **Require pull request reviews before merging**
   - Required number of reviewers: 2
   - Dismiss stale reviews: ✅

2. **Require status checks to pass before merging**
   - All CI checks must pass
   - Security audit must pass

## 📋 Implementation Steps

### 1. GitHub Repository Settings
Navigate to: Repository Settings → Branches → Add rule

### 2. Configure Main Branch
```yaml
Branch name pattern: main
Settings:
  - Require pull request reviews: 1 reviewer
  - Require status checks: test, build, security
  - Require conversation resolution: true
  - Require linear history: true
  - Do not allow bypassing: true
```

### 3. Configure Development Branch
```yaml
Branch name pattern: develop  
Settings:
  - Require pull request reviews: 1 reviewer
  - Require status checks: test, build
  - Require conversation resolution: true
```

### 4. Configure Feature Branch Pattern
```yaml
Branch name pattern: feature/*
Settings:
  - No restrictions (allow direct push for development)
```

## 🎯 Workflow Integration

### CI/CD Requirements
The following GitHub Actions workflows must pass:

1. **Continuous Integration** (`.github/workflows/ci.yml`)
   - TypeScript compilation
   - Asset validation
   - Security audit
   - Multi-platform build

2. **Pull Request Validation**
   - Automated testing
   - Code quality checks
   - Security scanning

### Pre-commit Hooks
Local hooks enforce quality before push:

1. **TypeScript Validation**
   - `npm run typecheck` must pass
   - No compilation errors allowed

2. **Asset Validation**
   - `npm run assets:validate` 
   - All required assets present

3. **Commit Message Validation**
   - Conventional commit format
   - Subject line length limits

## 👥 Team Permissions

### Repository Roles
- **Maintainers**: Can bypass branch protection (emergency only)
- **Contributors**: Must follow full PR workflow
- **Reviewers**: Can approve/request changes

### Review Requirements
- At least 1 approval for feature PRs
- At least 2 approvals for release PRs
- Code owner approval for critical changes

## 🚨 Emergency Procedures

### Hotfix Process
1. Create `hotfix/issue-description` branch from `main`
2. Implement critical fix
3. Create PR to `main` with expedited review
4. Merge after minimal CI checks
5. Create backport PR to `develop`

### Bypass Procedures
Repository maintainers can bypass protections for:
- Critical security fixes
- System outages
- Build system failures

**Note**: All bypasses must be documented with reason and follow-up PR.

## 📊 Monitoring and Metrics

### Branch Protection Effectiveness
Monitor these metrics:
- PR merge time
- CI failure rate
- Security issue detection
- Code review participation

### Continuous Improvement
Quarterly review of:
- Branch protection effectiveness
- Developer experience impact
- Security incident correlation
- Process bottlenecks

---

**Implementation Priority**: High
**Update Frequency**: Quarterly review
**Owner**: Repository maintainers