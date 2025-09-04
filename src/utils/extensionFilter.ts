/**
 * Advanced Chrome Extension Filter System
 * Comprehensive detection and blocking for service workers
 */

export interface ExtensionFilterConfig {
  enableLogging?: boolean;
  enableStats?: boolean;
  enableWhitelist?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
  maxLogEntries?: number;
  enablePersistentStats?: boolean;
}

export interface ExtensionDetectionResult {
  isExtension: boolean;
  extensionType?: string;
  extensionId?: string;
  browserType?: string;
  shouldBlock: boolean;
  reason: string;
  confidence: number; // 0-100
}

export interface ExtensionStats {
  totalRequests: number;
  blockedRequests: number;
  allowedRequests: number;
  extensionTypes: Record<string, number>;
  topBlockedIds: Record<string, number>;
  lastReset: string;
  startTime: string;
}

/**
 * Advanced Extension Filter with pattern matching and heuristics
 */
export class ExtensionFilter {
  private config: ExtensionFilterConfig;
  private stats: ExtensionStats;
  private logEntries: Array<{ timestamp: string; level: string; message: string; data?: any }> = [];
  
  // Extension protocol patterns
  private readonly EXTENSION_PROTOCOLS = [
    'chrome-extension:',
    'moz-extension:',
    'safari-extension:', 
    'safari-web-extension:',
    'edge-extension:',
    'ms-browser-extension:',
    'opera-extension:',
    'vivaldi-extension:',
    'brave-extension:'
  ];

  // Known problematic extension ID patterns
  private readonly KNOWN_PROBLEMATIC_IDS = [
    // Ad blockers that interfere with service workers
    'bhhhlbepdkbapadjdnnojkbgioiodbic', // AdBlock
    'dheimbmpmkbepjjcobigjacfepohombn', // Honey
    'dncepekefegjiljlfbihljgogephdhph', // Various extensions
    'gighmmpiobklfepjocnamgkkbiglidom', // AdBlock
    'cjpalhdlnbpafiamejdnhcphjbkeiagm', // uBlock Origin
    'cfhdojbkjhnklbpkdaibdccddilifddb', // AdBlocker Ultimate
    'aapbdbdomjkkjkaonfhkkikfgjllcleb', // Google Translate
    'fhbjgbiflinjbdggehcddcbncdddomop', // Pixel Block
    'eimnjpbdhggeoilljkdhafngpnjalnfg', // HTTPS Everywhere 
    'mlomiejdfkolichcflejclcbmpeaniij', // Ghostery
    'nkfglohiapjngdaeafnmoldddcjphblj', // Web Developer
    'amnkkkogjfcomnndkfmbccgdmahjdggo', // Tab Modifier
    'ogfcmafjalglgifnmanfmnieipoejdcf', // uMatrix
    'nlbjncdgjeocebhnmkbbbdekmmmcbfjd', // RSS Subscription
    'bpconcjcammlapcogcnnelfmaeghhagj', // OneTab
    'iaiomicjabeggjcfkbimgmglanimpnae', // Tab Manager Plus
    'mhkmbldibillhgcpbnjfhdnkghoggcna', // Print Friendly
    'gjljkfbedlhagphdkedapjjgjjbodabh', // Color picker
  ];

  // Heuristic patterns for extension detection
  private readonly EXTENSION_PATTERNS = [
    // Extension resource patterns
    /chrome-extension:\/\/[a-z]{32}(\/|$)/i,
    /moz-extension:\/\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}(\/|$)/i,
    /safari-extension:\/\/[a-zA-Z0-9.-]+(\/|$)/i,
    /edge-extension:\/\/[a-zA-Z0-9.-]+(\/|$)/i,
    
    // Common extension resource paths
    /\/(content_script|background|popup|options|manifest)\.js$/i,
    /\/assets\/(icons?|images?)\/(16|32|48|128)x\1\.(png|svg)$/i,
    /\/_locales\/[a-z]{2}(_[A-Z]{2})?\/messages\.json$/i,
    
    // Extension-specific file patterns
    /\/inject\.js$/i,
    /\/content\.js$/i,
    /\/overlay\.js$/i,
    /\/widget\.js$/i,
    /\/extension\.js$/i
  ];

  // Whitelist for legitimate extension functionality
  private readonly EXTENSION_WHITELIST = [
    'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn', // MetaMask
    'chrome-extension://fhbohimaelbohpjbbldcngcnapndodjp', // Binance Wallet
    'chrome-extension://ejbalbakoplchlghecdalmeeeajnimhm', // TronLink
    'chrome-extension://ibnejdfjmmkpcnlpebklmnkoeoihofec', // TronLink Pro
  ];

  constructor(config: ExtensionFilterConfig = {}) {
    this.config = {
      enableLogging: true,
      enableStats: true,
      enableWhitelist: false,
      logLevel: 'warn',
      maxLogEntries: 1000,
      enablePersistentStats: false,
      ...config
    };

    this.stats = {
      totalRequests: 0,
      blockedRequests: 0,
      allowedRequests: 0,
      extensionTypes: {},
      topBlockedIds: {},
      lastReset: new Date().toISOString(),
      startTime: new Date().toISOString()
    };

    this.loadPersistedStats();
  }

  /**
   * Main extension detection and filtering method
   */
  public analyzeRequest(url: string, requestData?: any): ExtensionDetectionResult {
    try {
      this.stats.totalRequests++;
      
      const parsedUrl = new URL(url);
      const result = this.performDetection(parsedUrl, requestData);
      
      this.updateStats(result);
      this.logDetection(result, url);
      
      return result;
    } catch (error) {
      this.log('error', 'Extension analysis failed', { url, error: error instanceof Error ? error.message : String(error) });
      
      // Fallback detection for malformed URLs
      const isSuspiciousExtension = this.EXTENSION_PROTOCOLS.some(protocol => 
        url.startsWith(protocol)
      );
      
      return {
        isExtension: isSuspiciousExtension,
        shouldBlock: isSuspiciousExtension,
        reason: 'Malformed URL - suspicious extension pattern detected',
        confidence: isSuspiciousExtension ? 85 : 0
      };
    }
  }

  /**
   * Core detection logic with multiple heuristics
   */
  private performDetection(url: URL, requestData?: any): ExtensionDetectionResult {
    const urlString = url.toString();
    
    // 1. Protocol-based detection (highest confidence)
    const protocolMatch = this.detectByProtocol(url);
    if (protocolMatch.isExtension) {
      return protocolMatch;
    }

    // 2. Pattern-based detection
    const patternMatch = this.detectByPattern(urlString);
    if (patternMatch.isExtension) {
      return patternMatch;
    }

    // 3. Heuristic-based detection
    const heuristicMatch = this.detectByHeuristics(url, requestData);
    if (heuristicMatch.isExtension) {
      return heuristicMatch;
    }

    // 4. Whitelist check for false positives
    if (this.config.enableWhitelist && this.isWhitelisted(urlString)) {
      return {
        isExtension: true,
        shouldBlock: false,
        reason: 'Extension whitelisted for legitimate functionality',
        confidence: 100
      };
    }

    return {
      isExtension: false,
      shouldBlock: false,
      reason: 'No extension patterns detected',
      confidence: 0
    };
  }

  /**
   * Detect extensions by protocol
   */
  private detectByProtocol(url: URL): ExtensionDetectionResult {
    const protocol = url.protocol;
    
    for (const extProtocol of this.EXTENSION_PROTOCOLS) {
      if (protocol === extProtocol || url.toString().startsWith(extProtocol)) {
        const extensionId = this.extractExtensionId(url.toString(), extProtocol);
        const browserType = this.getBrowserTypeFromProtocol(extProtocol);
        const isProblematic = this.isKnownProblematicId(extensionId);
        
        return {
          isExtension: true,
          extensionType: 'protocol',
          extensionId,
          browserType,
          shouldBlock: true,
          reason: `Extension detected via ${extProtocol} protocol${isProblematic ? ' (known problematic)' : ''}`,
          confidence: isProblematic ? 100 : 95
        };
      }
    }

    return { isExtension: false, shouldBlock: false, reason: 'No extension protocol detected', confidence: 0 };
  }

  /**
   * Detect extensions by URL patterns
   */
  private detectByPattern(url: string): ExtensionDetectionResult {
    for (const pattern of this.EXTENSION_PATTERNS) {
      if (pattern.test(url)) {
        return {
          isExtension: true,
          extensionType: 'pattern',
          shouldBlock: true,
          reason: `Extension detected via pattern matching: ${pattern.source}`,
          confidence: 80
        };
      }
    }

    return { isExtension: false, shouldBlock: false, reason: 'No extension patterns matched', confidence: 0 };
  }

  /**
   * Detect extensions using heuristics
   */
  private detectByHeuristics(url: URL, requestData?: any): ExtensionDetectionResult {
    const suspiciousIndicators = [];
    let confidence = 0;

    // Check for suspicious hostname patterns
    if (url.hostname && url.hostname.length === 32 && /^[a-z]+$/.test(url.hostname)) {
      suspiciousIndicators.push('chrome extension ID hostname pattern');
      confidence += 30;
    }

    // Check for suspicious paths
    const suspiciousPaths = ['/content_scripts/', '/background/', '/popup/', '/options/'];
    if (suspiciousPaths.some(path => url.pathname.includes(path))) {
      suspiciousIndicators.push('extension-specific path structure');
      confidence += 25;
    }

    // Check for suspicious query parameters
    if (url.search && url.search.includes('extension-id=')) {
      suspiciousIndicators.push('extension ID in query parameters');
      confidence += 20;
    }

    // Check request characteristics if available
    if (requestData) {
      if (requestData.initiator && this.EXTENSION_PROTOCOLS.some(p => requestData.initiator.startsWith(p))) {
        suspiciousIndicators.push('request initiated by extension');
        confidence += 40;
      }
    }

    if (confidence >= 50) {
      return {
        isExtension: true,
        extensionType: 'heuristic',
        shouldBlock: true,
        reason: `Heuristic detection: ${suspiciousIndicators.join(', ')}`,
        confidence
      };
    }

    return { isExtension: false, shouldBlock: false, reason: 'No heuristic indicators found', confidence };
  }

  /**
   * Extract extension ID from URL
   */
  private extractExtensionId(url: string, protocol: string): string | undefined {
    try {
      const urlObj = new URL(url);
      if (protocol === 'chrome-extension:' || protocol === 'edge-extension:') {
        return urlObj.hostname; // Chrome extension ID is the hostname
      } else if (protocol === 'moz-extension:') {
        return urlObj.hostname; // Firefox extension UUID
      }
      return urlObj.hostname;
    } catch {
      // Try to extract via regex as fallback
      const match = url.match(new RegExp(`${protocol.replace(':', '')}://([^/]+)`));
      return match ? match[1] : undefined;
    }
  }

  /**
   * Determine browser type from protocol
   */
  private getBrowserTypeFromProtocol(protocol: string): string {
    const mapping: Record<string, string> = {
      'chrome-extension:': 'chrome',
      'moz-extension:': 'firefox',
      'safari-extension:': 'safari',
      'edge-extension:': 'edge',
      'opera-extension:': 'opera',
      'brave-extension:': 'brave',
      'vivaldi-extension:': 'vivaldi'
    };
    return mapping[protocol] || 'unknown';
  }

  /**
   * Check if extension ID is known to be problematic
   */
  private isKnownProblematicId(extensionId?: string): boolean {
    if (!extensionId) return false;
    return this.KNOWN_PROBLEMATIC_IDS.includes(extensionId);
  }

  /**
   * Check if URL is whitelisted
   */
  private isWhitelisted(url: string): boolean {
    return this.EXTENSION_WHITELIST.some(whitelistedUrl => 
      url.startsWith(whitelistedUrl)
    );
  }

  /**
   * Update statistics
   */
  private updateStats(result: ExtensionDetectionResult): void {
    if (!this.config.enableStats) return;

    if (result.isExtension) {
      if (result.shouldBlock) {
        this.stats.blockedRequests++;
        
        // Track extension types
        if (result.extensionType) {
          this.stats.extensionTypes[result.extensionType] = 
            (this.stats.extensionTypes[result.extensionType] || 0) + 1;
        }
        
        // Track blocked IDs
        if (result.extensionId) {
          this.stats.topBlockedIds[result.extensionId] = 
            (this.stats.topBlockedIds[result.extensionId] || 0) + 1;
        }
      } else {
        this.stats.allowedRequests++;
      }
    }

    if (this.config.enablePersistentStats) {
      this.persistStats();
    }
  }

  /**
   * Log detection results
   */
  private logDetection(result: ExtensionDetectionResult, url: string): void {
    if (!this.config.enableLogging) return;

    if (result.shouldBlock) {
      this.log('warn', 'Extension request blocked', {
        url,
        extensionId: result.extensionId,
        reason: result.reason,
        confidence: result.confidence
      });
    } else if (result.isExtension && this.config.logLevel === 'debug') {
      this.log('debug', 'Extension request allowed', {
        url,
        extensionId: result.extensionId,
        reason: result.reason
      });
    }
  }

  /**
   * Internal logging method
   */
  private log(level: string, message: string, data?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    this.logEntries.push(logEntry);
    
    // Maintain log size limit
    if (this.logEntries.length > (this.config.maxLogEntries || 1000)) {
      this.logEntries.shift();
    }

    // Console output based on log level
    const shouldLog = this.shouldLog(level);
    if (shouldLog) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[ExtensionFilter] ${message}`, data || '');
    }
  }

  /**
   * Check if log level should be output
   */
  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    const configLevel = this.config.logLevel || 'warn';
    return levels.indexOf(level) <= levels.indexOf(configLevel);
  }

  /**
   * Get current statistics
   */
  public getStats(): ExtensionStats {
    return { ...this.stats };
  }

  /**
   * Get recent log entries
   */
  public getLogs(limit: number = 100): Array<{ timestamp: string; level: string; message: string; data?: any }> {
    return this.logEntries.slice(-limit);
  }

  /**
   * Reset statistics
   */
  public resetStats(): void {
    this.stats = {
      totalRequests: 0,
      blockedRequests: 0,
      allowedRequests: 0,
      extensionTypes: {},
      topBlockedIds: {},
      lastReset: new Date().toISOString(),
      startTime: this.stats.startTime
    };
    this.persistStats();
  }

  /**
   * Add custom extension ID to blocklist
   */
  public addToBlocklist(extensionId: string): void {
    if (!this.KNOWN_PROBLEMATIC_IDS.includes(extensionId)) {
      this.KNOWN_PROBLEMATIC_IDS.push(extensionId);
    }
  }

  /**
   * Add custom extension URL to whitelist
   */
  public addToWhitelist(extensionUrl: string): void {
    if (!this.EXTENSION_WHITELIST.includes(extensionUrl)) {
      this.EXTENSION_WHITELIST.push(extensionUrl);
    }
  }

  /**
   * Load persisted statistics (if enabled)
   */
  private loadPersistedStats(): void {
    if (!this.config.enablePersistentStats) return;
    
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('extensionFilter_stats');
        if (stored) {
          const parsed = JSON.parse(stored);
          this.stats = { ...this.stats, ...parsed };
        }
      }
    } catch (error) {
      this.log('warn', 'Failed to load persisted stats', { error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Persist statistics to storage
   */
  private persistStats(): void {
    if (!this.config.enablePersistentStats) return;
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('extensionFilter_stats', JSON.stringify(this.stats));
      }
    } catch (error) {
      this.log('warn', 'Failed to persist stats', { error: error instanceof Error ? error.message : String(error) });
    }
  }
}

/**
 * Service Worker integration helper
 */
export function createServiceWorkerExtensionFilter(config?: ExtensionFilterConfig): ExtensionFilter {
  return new ExtensionFilter({
    enableLogging: true,
    enableStats: true,
    enableWhitelist: false,
    logLevel: 'warn',
    maxLogEntries: 500,
    enablePersistentStats: true,
    ...config
  });
}

/**
 * Quick check for extension URLs
 */
export function isExtensionUrl(url: string): boolean {
  const PROTOCOLS = [
    'chrome-extension:',
    'moz-extension:',
    'safari-extension:', 
    'edge-extension:',
    'ms-browser-extension:'
  ];
  
  return PROTOCOLS.some(protocol => url.startsWith(protocol));
}