/**
 * User-Friendly Error Messages System
 * Multilingual support and recovery guidance
 */

import { ErrorType, ErrorSeverity, AppError } from './errorHandling';

// Supported languages
export type SupportedLanguage = 'ko' | 'en' | 'ja' | 'zh';

// Current language (could be from app settings)
let currentLanguage: SupportedLanguage = 'ko';

// Error message translations
const ERROR_MESSAGES: Record<ErrorType, Record<SupportedLanguage, {
  title: string;
  message: string;
  action: string;
  recovery?: string[];
}>> = {
  [ErrorType.NETWORK]: {
    ko: {
      title: '네트워크 연결 오류',
      message: '인터넷 연결을 확인해 주세요. 네트워크 연결이 불안정할 수 있습니다.',
      action: '다시 시도',
      recovery: [
        'Wi-Fi 또는 모바일 데이터 연결을 확인해 주세요',
        '잠시 후 다시 시도해 주세요',
        '네트워크 설정을 확인해 주세요',
        '문제가 지속되면 관리자에게 문의해 주세요'
      ]
    },
    en: {
      title: 'Network Connection Error',
      message: 'Please check your internet connection. The network connection may be unstable.',
      action: 'Retry',
      recovery: [
        'Check your Wi-Fi or mobile data connection',
        'Please try again in a moment',
        'Check your network settings',
        'Contact administrator if the problem persists'
      ]
    },
    ja: {
      title: 'ネットワーク接続エラー',
      message: 'インターネット接続を確認してください。ネットワーク接続が不安定な可能性があります。',
      action: '再試行',
      recovery: [
        'Wi-Fiまたはモバイルデータ接続を確認してください',
        'しばらく待ってから再度お試しください',
        'ネットワーク設定を確認してください',
        '問題が続く場合は管理者にお問い合わせください'
      ]
    },
    zh: {
      title: '网络连接错误',
      message: '请检查您的互联网连接。网络连接可能不稳定。',
      action: '重试',
      recovery: [
        '检查您的Wi-Fi或移动数据连接',
        '请稍后再试',
        '检查您的网络设置',
        '如果问题持续存在，请联系管理员'
      ]
    }
  },

  [ErrorType.DATABASE]: {
    ko: {
      title: '데이터 처리 오류',
      message: '데이터를 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      action: '다시 시도',
      recovery: [
        '앱을 완전히 종료 후 다시 실행해 보세요',
        '데이터 동기화를 확인해 주세요',
        '저장 공간이 충분한지 확인해 주세요',
        '문제가 지속되면 앱을 재설치해 보세요'
      ]
    },
    en: {
      title: 'Data Processing Error',
      message: 'An error occurred while processing data. Please try again later.',
      action: 'Retry',
      recovery: [
        'Close the app completely and restart it',
        'Check data synchronization',
        'Make sure you have enough storage space',
        'Try reinstalling the app if the problem persists'
      ]
    },
    ja: {
      title: 'データ処理エラー',
      message: 'データの処理中にエラーが発生しました。しばらく待ってから再度お試しください。',
      action: '再試行',
      recovery: [
        'アプリを完全に終了してから再起動してください',
        'データ同期を確認してください',
        '十分なストレージ容量があることを確認してください',
        '問題が続く場合はアプリを再インストールしてみてください'
      ]
    },
    zh: {
      title: '数据处理错误',
      message: '处理数据时发生错误。请稍后再试。',
      action: '重试',
      recovery: [
        '完全关闭应用程序后重新启动',
        '检查数据同步',
        '确保有足够的存储空间',
        '如果问题持续存在，请尝试重新安装应用程序'
      ]
    }
  },

  [ErrorType.VALIDATION]: {
    ko: {
      title: '입력 오류',
      message: '입력하신 정보를 확인해 주세요.',
      action: '수정하기',
      recovery: [
        '필수 입력 항목을 모두 작성했는지 확인해 주세요',
        '입력 형식이 올바른지 확인해 주세요',
        '특수 문자나 공백이 포함되어 있지 않은지 확인해 주세요',
        '도움말을 참조해 주세요'
      ]
    },
    en: {
      title: 'Input Error',
      message: 'Please check the information you entered.',
      action: 'Correct',
      recovery: [
        'Make sure all required fields are filled',
        'Check if the input format is correct',
        'Make sure no special characters or spaces are included',
        'Please refer to the help guide'
      ]
    },
    ja: {
      title: '入力エラー',
      message: '入力した情報を確認してください。',
      action: '修正',
      recovery: [
        'すべての必須入力項目が記入されているか確認してください',
        '入力形式が正しいか確認してください',
        '特殊文字やスペースが含まれていないか確認してください',
        'ヘルプガイドを参照してください'
      ]
    },
    zh: {
      title: '输入错误',
      message: '请检查您输入的信息。',
      action: '修正',
      recovery: [
        '确保所有必填字段都已填写',
        '检查输入格式是否正确',
        '确保不包含特殊字符或空格',
        '请参考帮助指南'
      ]
    }
  },

  [ErrorType.AUTHENTICATION]: {
    ko: {
      title: '인증 오류',
      message: '인증에 문제가 발생했습니다. 다시 로그인해 주세요.',
      action: '로그인',
      recovery: [
        '아이디와 비밀번호를 다시 확인해 주세요',
        '로그아웃 후 다시 로그인해 주세요',
        '비밀번호 재설정을 시도해 보세요',
        '계정 상태를 확인해 주세요'
      ]
    },
    en: {
      title: 'Authentication Error',
      message: 'Authentication failed. Please log in again.',
      action: 'Login',
      recovery: [
        'Please recheck your ID and password',
        'Log out and log in again',
        'Try resetting your password',
        'Check your account status'
      ]
    },
    ja: {
      title: '認証エラー',
      message: '認証に問題が発生しました。再度ログインしてください。',
      action: 'ログイン',
      recovery: [
        'IDとパスワードを再確認してください',
        'ログアウト後、再度ログインしてください',
        'パスワードリセットを試してください',
        'アカウント状態を確認してください'
      ]
    },
    zh: {
      title: '身份验证错误',
      message: '身份验证出现问题。请重新登录。',
      action: '登录',
      recovery: [
        '请重新检查您的用户名和密码',
        '注销后重新登录',
        '尝试重置密码',
        '检查您的账户状态'
      ]
    }
  },

  [ErrorType.PERMISSION]: {
    ko: {
      title: '권한 오류',
      message: '이 기능을 사용하기 위한 권한이 필요합니다.',
      action: '권한 설정',
      recovery: [
        '앱 설정에서 필요한 권한을 허용해 주세요',
        '디바이스 설정 > 앱 권한을 확인해 주세요',
        '앱을 재시작해 주세요',
        '권한이 거부된 경우 수동으로 허용해 주세요'
      ]
    },
    en: {
      title: 'Permission Error',
      message: 'Permission is required to use this feature.',
      action: 'Grant Permission',
      recovery: [
        'Please allow the necessary permissions in app settings',
        'Check Device Settings > App Permissions',
        'Restart the app',
        'Manually allow if permissions were denied'
      ]
    },
    ja: {
      title: '権限エラー',
      message: 'この機能を使用するための権限が必要です。',
      action: '権限設定',
      recovery: [
        'アプリ設定で必要な権限を許可してください',
        'デバイス設定 > アプリ権限を確認してください',
        'アプリを再起動してください',
        '権限が拒否された場合は手動で許可してください'
      ]
    },
    zh: {
      title: '权限错误',
      message: '使用此功能需要权限。',
      action: '授予权限',
      recovery: [
        '请在应用设置中允许必要的权限',
        '检查设备设置 > 应用权限',
        '重新启动应用程序',
        '如果权限被拒绝，请手动允许'
      ]
    }
  },

  [ErrorType.USER_ACTION]: {
    ko: {
      title: '작업 오류',
      message: '작업을 완료할 수 없습니다. 다시 시도해 주세요.',
      action: '다시 시도',
      recovery: [
        '잠시 후 다시 시도해 주세요',
        '다른 방법으로 시도해 보세요',
        '필요한 조건이 충족되었는지 확인해 주세요',
        '앱을 재시작해 보세요'
      ]
    },
    en: {
      title: 'Action Error',
      message: 'Unable to complete the action. Please try again.',
      action: 'Retry',
      recovery: [
        'Please try again in a moment',
        'Try a different approach',
        'Check if necessary conditions are met',
        'Try restarting the app'
      ]
    },
    ja: {
      title: 'アクションエラー',
      message: 'アクションを完了できません。再度お試しください。',
      action: '再試行',
      recovery: [
        'しばらく待ってから再度お試しください',
        '別の方法で試してみてください',
        '必要な条件が満たされているか確認してください',
        'アプリを再起動してみてください'
      ]
    },
    zh: {
      title: '操作错误',
      message: '无法完成操作。请重试。',
      action: '重试',
      recovery: [
        '请稍后再试',
        '尝试不同的方法',
        '检查是否满足必要条件',
        '尝试重新启动应用程序'
      ]
    }
  },

  [ErrorType.SYSTEM]: {
    ko: {
      title: '시스템 오류',
      message: '시스템 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      action: '다시 시도',
      recovery: [
        '앱을 완전히 종료 후 다시 실행해 주세요',
        '디바이스를 재시작해 보세요',
        '앱을 최신 버전으로 업데이트해 주세요',
        '문제가 지속되면 고객지원에 문의해 주세요'
      ]
    },
    en: {
      title: 'System Error',
      message: 'A system error occurred. Please try again later.',
      action: 'Retry',
      recovery: [
        'Close the app completely and restart it',
        'Try restarting your device',
        'Update the app to the latest version',
        'Contact customer support if the problem persists'
      ]
    },
    ja: {
      title: 'システムエラー',
      message: 'システムエラーが発生しました。しばらく待ってから再度お試しください。',
      action: '再試行',
      recovery: [
        'アプリを完全に終了してから再起動してください',
        'デバイスを再起動してみてください',
        'アプリを最新バージョンに更新してください',
        '問題が続く場合はカスタマーサポートにお問い合わせください'
      ]
    },
    zh: {
      title: '系统错误',
      message: '发生系统错误。请稍后再试。',
      action: '重试',
      recovery: [
        '完全关闭应用程序后重新启动',
        '尝试重新启动设备',
        '将应用程序更新到最新版本',
        '如果问题持续存在，请联系客户支持'
      ]
    }
  },

  [ErrorType.UNKNOWN]: {
    ko: {
      title: '알 수 없는 오류',
      message: '예상치 못한 오류가 발생했습니다. 문제가 지속되면 고객지원에 문의해 주세요.',
      action: '다시 시도',
      recovery: [
        '앱을 재시작해 보세요',
        '잠시 후 다시 시도해 주세요',
        '앱을 최신 버전으로 업데이트해 주세요',
        '에러 코드를 기록하고 고객지원에 문의해 주세요'
      ]
    },
    en: {
      title: 'Unknown Error',
      message: 'An unexpected error occurred. Contact customer support if the problem persists.',
      action: 'Retry',
      recovery: [
        'Try restarting the app',
        'Please try again in a moment',
        'Update the app to the latest version',
        'Record the error code and contact customer support'
      ]
    },
    ja: {
      title: '不明なエラー',
      message: '予期しないエラーが発生しました。問題が続く場合はカスタマーサポートにお問い合わせください。',
      action: '再試行',
      recovery: [
        'アプリを再起動してみてください',
        'しばらく待ってから再度お試しください',
        'アプリを最新バージョンに更新してください',
        'エラーコードを記録してカスタマーサポートにお問い合わせください'
      ]
    },
    zh: {
      title: '未知错误',
      message: '发生意外错误。如果问题持续存在，请联系客户支持。',
      action: '重试',
      recovery: [
        '尝试重新启动应用程序',
        '请稍后再试',
        '将应用程序更新到最新版本',
        '记录错误代码并联系客户支持'
      ]
    }
  }
};

// Severity-based styling and behavior
const SEVERITY_CONFIG: Record<ErrorSeverity, {
  priority: number;
  showRecovery: boolean;
  autoRetry: boolean;
  requiresAttention: boolean;
}> = {
  [ErrorSeverity.LOW]: {
    priority: 1,
    showRecovery: false,
    autoRetry: true,
    requiresAttention: false,
  },
  [ErrorSeverity.MEDIUM]: {
    priority: 2,
    showRecovery: true,
    autoRetry: false,
    requiresAttention: true,
  },
  [ErrorSeverity.HIGH]: {
    priority: 3,
    showRecovery: true,
    autoRetry: false,
    requiresAttention: true,
  },
  [ErrorSeverity.CRITICAL]: {
    priority: 4,
    showRecovery: true,
    autoRetry: false,
    requiresAttention: true,
  },
};

// Language management
export function setLanguage(language: SupportedLanguage): void {
  currentLanguage = language;
}

export function getCurrentLanguage(): SupportedLanguage {
  return currentLanguage;
}

export function getSupportedLanguages(): SupportedLanguage[] {
  return ['ko', 'en', 'ja', 'zh'];
}

// Get user-friendly error message
export function getUserFriendlyError(error: AppError) {
  const lang = currentLanguage;
  const errorMessages = ERROR_MESSAGES[error.type] || ERROR_MESSAGES[ErrorType.UNKNOWN];
  const messages = errorMessages[lang] || errorMessages['ko']; // Fallback to Korean
  const severityConfig = SEVERITY_CONFIG[error.severity];

  return {
    title: messages.title,
    message: messages.message,
    action: messages.action,
    recovery: severityConfig.showRecovery ? messages.recovery : undefined,
    priority: severityConfig.priority,
    requiresAttention: severityConfig.requiresAttention,
    autoRetry: severityConfig.autoRetry,
    errorId: error.id,
    timestamp: error.timestamp,
    debugInfo: __DEV__ ? {
      type: error.type,
      severity: error.severity,
      stack: error.stack,
      context: error.context,
    } : undefined,
  };
}

// Recovery guidance generator
export function getRecoveryGuidance(errorType: ErrorType, context?: Record<string, any>) {
  const lang = currentLanguage;
  const errorMessages = ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ErrorType.UNKNOWN];
  const messages = errorMessages[lang] || errorMessages['ko'];

  // Add context-specific recovery steps
  const contextualSteps: string[] = [];
  
  if (context) {
    if (context.feature) {
      const featureGuidance = getFeatureSpecificGuidance(context.feature, lang);
      contextualSteps.push(...featureGuidance);
    }
    
    if (context.action) {
      const actionGuidance = getActionSpecificGuidance(context.action, lang);
      contextualSteps.push(...actionGuidance);
    }
  }

  return {
    basicSteps: messages.recovery || [],
    contextualSteps,
    combinedSteps: [
      ...(messages.recovery || []),
      ...contextualSteps
    ].filter((step, index, array) => array.indexOf(step) === index), // Remove duplicates
  };
}

// Feature-specific guidance
function getFeatureSpecificGuidance(feature: string, lang: SupportedLanguage): string[] {
  const featureGuidance: Record<string, Record<SupportedLanguage, string[]>> = {
    'spreads': {
      ko: [
        '스프레드 보드가 완전히 로드되었는지 확인해 주세요',
        '카드를 천천히 선택해 보세요',
        '스프레드를 다시 시작해 보세요'
      ],
      en: [
        'Make sure the spread board is fully loaded',
        'Try selecting cards slowly',
        'Try restarting the spread'
      ],
      ja: [
        'スプレッドボードが完全にロードされていることを確認してください',
        'カードをゆっくり選択してみてください',
        'スプレッドを再開してみてください'
      ],
      zh: [
        '确保牌阵完全加载',
        '尝试慢慢选择卡片',
        '尝试重新开始牌阵'
      ]
    },
    'daily-tarot': {
      ko: [
        '시간대별 카드가 정상적으로 생성되었는지 확인해 주세요',
        '현재 시간을 확인해 주세요',
        '일일 세션을 재시작해 보세요'
      ],
      en: [
        'Check if hourly cards are generated normally',
        'Check the current time',
        'Try restarting the daily session'
      ],
      ja: [
        '時間別カードが正常に生成されているか確認してください',
        '現在時刻を確認してください',
        '日次セッションを再開してみてください'
      ],
      zh: [
        '检查小时卡片是否正常生成',
        '检查当前时间',
        '尝试重新启动每日会话'
      ]
    }
  };

  return featureGuidance[feature]?.[lang] || featureGuidance[feature]?.['ko'] || [];
}

// Action-specific guidance
function getActionSpecificGuidance(action: string, lang: SupportedLanguage): string[] {
  const actionGuidance: Record<string, Record<SupportedLanguage, string[]>> = {
    'save': {
      ko: [
        '저장 공간이 충분한지 확인해 주세요',
        '파일 권한을 확인해 주세요'
      ],
      en: [
        'Make sure you have enough storage space',
        'Check file permissions'
      ],
      ja: [
        '十分なストレージ容量があることを確認してください',
        'ファイル権限を確認してください'
      ],
      zh: [
        '确保有足够的存储空间',
        '检查文件权限'
      ]
    },
    'load': {
      ko: [
        '데이터가 손상되지 않았는지 확인해 주세요',
        '네트워크 연결을 확인해 주세요'
      ],
      en: [
        'Make sure the data is not corrupted',
        'Check your network connection'
      ],
      ja: [
        'データが破損していないことを確認してください',
        'ネットワーク接続を確認してください'
      ],
      zh: [
        '确保数据未损坏',
        '检查您的网络连接'
      ]
    }
  };

  return actionGuidance[action]?.[lang] || actionGuidance[action]?.['ko'] || [];
}

// Error message formatter for display
export function formatErrorForDisplay(error: AppError) {
  const userError = getUserFriendlyError(error);
  
  return {
    title: userError.title,
    message: userError.message,
    actionLabel: userError.action,
    showRecovery: !!userError.recovery,
    recoverySteps: userError.recovery || [],
    severity: error.severity,
    timestamp: error.timestamp.toLocaleString(),
    errorId: error.id,
    isDebugMode: __DEV__,
    debugInfo: userError.debugInfo,
  };
}

// Check if error should be shown to user
export function shouldShowErrorToUser(error: AppError): boolean {
  const config = SEVERITY_CONFIG[error.severity];
  return config.requiresAttention;
}

// Auto-retry decision
export function shouldAutoRetry(error: AppError): boolean {
  const config = SEVERITY_CONFIG[error.severity];
  return config.autoRetry;
}

// Priority sorting for multiple errors
export function sortErrorsByPriority(errors: AppError[]): AppError[] {
  return errors.sort((a, b) => {
    const priorityA = SEVERITY_CONFIG[a.severity].priority;
    const priorityB = SEVERITY_CONFIG[b.severity].priority;
    return priorityB - priorityA; // Higher priority first
  });
}