/**
 * Store Logic Test - Tests store structure and types without React Native dependencies
 */

const fs = require('fs');
const path = require('path');

/**
 * Test store file structure and imports
 */
function testStoreStructure() {
  console.log('🧪 Testing Store Structure...\n');
  
  const storesDir = path.join(process.cwd(), 'src', 'stores');
  const expectedFiles = [
    'index.ts',
    'types.ts',
    'settingsStore.ts',
    'dailyTarotStore.ts',
    'spreadStore.ts',
    'diaryStore.ts',
    'deckStore.ts',
    'middleware/persistence.ts',
    'middleware/database.ts'
  ];
  
  let passed = 0;
  let failed = 0;
  
  expectedFiles.forEach(file => {
    const filePath = path.join(storesDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
      passed++;
    } else {
      console.log(`❌ ${file} missing`);
      failed++;
    }
  });
  
  return { passed, failed };
}

/**
 * Test store type definitions
 */
function testStoreTypes() {
  console.log('\n🧪 Testing Store Types...\n');
  
  const typesPath = path.join(process.cwd(), 'src', 'stores', 'types.ts');
  
  if (!fs.existsSync(typesPath)) {
    console.log('❌ types.ts not found');
    return { passed: 0, failed: 1 };
  }
  
  const content = fs.readFileSync(typesPath, 'utf8');
  const expectedInterfaces = [
    'BaseStoreState',
    'DailyTarotState', 
    'SpreadState',
    'DiaryState',
    'SettingsState',
    'DeckState',
    'RootStore'
  ];
  
  let passed = 0;
  let failed = 0;
  
  expectedInterfaces.forEach(interfaceName => {
    if (content.includes(`interface ${interfaceName}`)) {
      console.log(`✅ ${interfaceName} interface defined`);
      passed++;
    } else {
      console.log(`❌ ${interfaceName} interface missing`);
      failed++;
    }
  });
  
  // Test for essential properties
  const essentialChecks = [
    { name: 'SettingsState has selectedDeckId', check: content.includes('selectedDeckId: string') },
    { name: 'SettingsState has notificationsEnabled', check: content.includes('notificationsEnabled: boolean') },
    { name: 'DailyTarotState has currentSession', check: content.includes('currentSession:') },
    { name: 'BaseStoreState has error handling', check: content.includes('error: string | null') },
    { name: 'StoreError class defined', check: content.includes('class StoreError') }
  ];
  
  essentialChecks.forEach(({ name, check }) => {
    if (check) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  });
  
  return { passed, failed };
}

/**
 * Test store implementation structure
 */
function testStoreImplementations() {
  console.log('\n🧪 Testing Store Implementations...\n');
  
  const stores = [
    { name: 'settingsStore.ts', expectedExports: ['useSettingsStore', 'settingsActions'] },
    { name: 'dailyTarotStore.ts', expectedExports: ['useDailyTarotStore', 'dailyTarotActions'] },
    { name: 'index.ts', expectedExports: ['useRootStore', 'rootStoreActions'] }
  ];
  
  let passed = 0;
  let failed = 0;
  
  stores.forEach(({ name, expectedExports }) => {
    const filePath = path.join(process.cwd(), 'src', 'stores', name);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ ${name} not found`);
      failed++;
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Test for Zustand create usage
    if (content.includes('create<') && content.includes('devtools')) {
      console.log(`✅ ${name} uses Zustand with devtools`);
      passed++;
    } else {
      console.log(`❌ ${name} missing proper Zustand setup`);
      failed++;
    }
    
    // Test for persistence middleware
    if (content.includes('persist(')) {
      console.log(`✅ ${name} has persistence middleware`);
      passed++;
    } else {
      console.log(`❌ ${name} missing persistence`);
      failed++;
    }
    
    // Test for expected exports
    expectedExports.forEach(exportName => {
      if (content.includes(`export const ${exportName}`) || content.includes(`export { ${exportName}`)) {
        console.log(`✅ ${name} exports ${exportName}`);
        passed++;
      } else {
        console.log(`❌ ${name} missing export ${exportName}`);
        failed++;
      }
    });
  });
  
  return { passed, failed };
}

/**
 * Test middleware implementation
 */
function testMiddleware() {
  console.log('\n🧪 Testing Middleware...\n');
  
  const middlewareFiles = [
    { name: 'persistence.ts', expectedClasses: ['StorePersistence'], expectedFunctions: ['createMMKVStorage'] },
    { name: 'database.ts', expectedClasses: ['DatabaseSyncStrategies', 'DatabaseSyncUtils'], expectedFunctions: ['databaseSync'] }
  ];
  
  let passed = 0;
  let failed = 0;
  
  middlewareFiles.forEach(({ name, expectedClasses, expectedFunctions }) => {
    const filePath = path.join(process.cwd(), 'src', 'stores', 'middleware', name);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ middleware/${name} not found`);
      failed++;
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    expectedClasses.forEach(className => {
      if (content.includes(`class ${className}`) || content.includes(`export class ${className}`)) {
        console.log(`✅ ${name} has ${className} class`);
        passed++;
      } else {
        console.log(`❌ ${name} missing ${className} class`);
        failed++;
      }
    });
    
    expectedFunctions.forEach(functionName => {
      if (content.includes(`function ${functionName}`) || content.includes(`export const ${functionName}`)) {
        console.log(`✅ ${name} has ${functionName} function`);
        passed++;
      } else {
        console.log(`❌ ${name} missing ${functionName} function`);
        failed++;
      }
    });
  });
  
  return { passed, failed };
}

/**
 * Test store configuration and setup
 */
function testStoreConfiguration() {
  console.log('\n🧪 Testing Store Configuration...\n');
  
  const settingsPath = path.join(process.cwd(), 'src', 'stores', 'settingsStore.ts');
  
  if (!fs.existsSync(settingsPath)) {
    console.log('❌ settingsStore.ts not found');
    return { passed: 0, failed: 1 };
  }
  
  const content = fs.readFileSync(settingsPath, 'utf8');
  
  let passed = 0;
  let failed = 0;
  
  const configChecks = [
    { name: 'Has DEFAULT_SETTINGS', check: content.includes('DEFAULT_SETTINGS') },
    { name: 'Uses immer middleware', check: content.includes('immer(') },
    { name: 'Has database sync', check: content.includes('databaseSync(') },
    { name: 'Has partialize config', check: content.includes('partialize:') },
    { name: 'Has onRehydrateStorage', check: content.includes('onRehydrateStorage') },
    { name: 'Exports action creators', check: content.includes('settingsActions') },
    { name: 'Has error handling', check: content.includes('catch (error)') },
    { name: 'Has async actions', check: content.includes('async ') }
  ];
  
  configChecks.forEach(({ name, check }) => {
    if (check) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  });
  
  return { passed, failed };
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('🧪 Starting Store Logic Tests...\n');
  
  const results = [
    testStoreStructure(),
    testStoreTypes(),
    testStoreImplementations(), 
    testMiddleware(),
    testStoreConfiguration()
  ];
  
  const totalPassed = results.reduce((sum, result) => sum + result.passed, 0);
  const totalFailed = results.reduce((sum, result) => sum + result.failed, 0);
  const total = totalPassed + totalFailed;
  
  console.log(`\n📊 Final Test Results:`);
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`📋 Total: ${total}`);
  console.log(`📈 Success Rate: ${Math.round((totalPassed / total) * 100)}%`);
  
  if (totalFailed === 0) {
    console.log(`\n🎉 All store logic tests passed! Stores are properly structured.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Review the failures above.`);
  }
  
  return { totalPassed, totalFailed, total };
}

// Run the tests
runAllTests();