# Critical Bug Fixes - Action Plan

**Priority**: URGENT - App Cannot Run  
**Est. Time**: 4-8 hours to restore basic functionality

## 🚨 CRITICAL ISSUE #1: Environment Compatibility

### Problem
App fails to start with Node.js TypeScript stripping errors in Expo modules.

### Root Cause Analysis
- Node.js version incompatibility with Expo SDK 53
- TypeScript stripping issues in node_modules
- Potential dependency version conflicts

### Fix Strategy (Choose One)

#### Option A: Update Node.js Version (RECOMMENDED)
```bash
# Check current Node.js version
node --version

# Install Node.js 18 LTS or 20 LTS
# Windows: Download from nodejs.org
# Or use nvm:
nvm install 18.17.0
nvm use 18.17.0

# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Test startup
npx expo start --clear
```

#### Option B: Downgrade Expo SDK
```bash
# Downgrade to more stable Expo SDK
npx expo install --fix
npm install expo@~50.0.0

# Update app.json
# Change "expo": "53.0.22" to "expo": "~50.0.0"

# Reinstall dependencies
rm -rf node_modules
npm install
```

## 🚨 CRITICAL ISSUE #2: TypeScript Compilation Errors

### Problem
JSX syntax errors in `src/lib/errorHandling.ts` lines 302-304

### Fix Implementation
```typescript
// CURRENT BROKEN CODE in errorHandling.ts:
return (
  <ErrorBoundary {...errorBoundaryProps}>
    <WrappedComponent {...props} />
  </ErrorBoundary>
);

// SOLUTION: Extract to separate .tsx file or fix import
```

### Step-by-Step Fix:
1. **Create new file**: `src/lib/ErrorBoundaryHOC.tsx`
2. **Move JSX code** from errorHandling.ts to new file
3. **Export function** from new file
4. **Update imports** in errorHandling.ts

## Implementation Script

Here's the exact fix for the TypeScript issue: