/**
 * Service Worker Extension Filter Module
 * Standalone implementation for service worker environment
 * This is a simplified version of the TypeScript ExtensionFilter for SW usage
 */

/**
 * Extension Filter Configuration
 */
const DEFAULT_CONFIG = {
  enableLogging: true,
  enableStats: true,
  enableWhitelist: false,
  logLevel: 'warn',
  maxLogEntries: 500,
  enablePersistentStats: false // Disabled in SW for performance
};

/**
 * Extension Detection Patterns and Data
 */
const EXTENSION_PROTOCOLS = [
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

const KNOWN_PROBLEMATIC_IDS = [
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

const EXTENSION_PATTERNS = [
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

const EXTENSION_WHITELIST = [
  'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn', // MetaMask
  'chrome-extension://fhbohimaelbohpjbbldcngcnapndodjp', // Binance Wallet
  'chrome-extension://ejbalbakoplchlghecdalmeeeajnimhm', // TronLink
  'chrome-extension://ibnejdfjmmkpcnlpebklmnkoeoihofec', // TronLink Pro
];

/**
 * Service Worker Extension Filter Class
 */
class ServiceWorkerExtensionFilter {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.stats = {
      totalRequests: 0,
      blockedRequests: 0,
      allowedRequests: 0,
      extensionTypes: {},
      topBlockedIds: {},
      lastReset: new Date().toISOString(),
      startTime: new Date().toISOString()
    };
    this.logEntries = [];
  }

  /**
   * Main extension analysis method
   */
  analyzeRequest(url, requestData = null) {
    try {
      this.stats.totalRequests++;
      
      const result = this.performDetection(url, requestData);
      
      this.updateStats(result);
      this.logDetection(result, url);
      
      return result;
    } catch (error) {
      this.log('error', 'Extension analysis failed', { url, error: error.message });
      
      // Fallback detection for malformed URLs
      const isSuspiciousExtension = EXTENSION_PROTOCOLS.some(protocol => 
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
   * Core detection logic
   */
  performDetection(url, requestData = null) {
    // 1. Protocol-based detection (highest confidence)
    const protocolMatch = this.detectByProtocol(url);
    if (protocolMatch.isExtension) {
      return protocolMatch;
    }

    // 2. Pattern-based detection
    const patternMatch = this.detectByPattern(url);
    if (patternMatch.isExtension) {
      return patternMatch;
    }

    // 3. Heuristic-based detection
    const heuristicMatch = this.detectByHeuristics(url, requestData);
    if (heuristicMatch.isExtension) {
      return heuristicMatch;
    }

    // 4. Whitelist check for false positives
    if (this.config.enableWhitelist && this.isWhitelisted(url)) {
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
  detectByProtocol(url) {
    for (const protocol of EXTENSION_PROTOCOLS) {
      if (url.startsWith(protocol)) {
        const extensionId = this.extractExtensionId(url, protocol);
        const browserType = this.getBrowserTypeFromProtocol(protocol);
        const isProblematic = this.isKnownProblematicId(extensionId);
        
        return {
          isExtension: true,
          extensionType: 'protocol',
          extensionId,
          browserType,
          shouldBlock: true,
          reason: `Extension detected via ${protocol} protocol${isProblematic ? ' (known problematic)' : ''}`,
          confidence: isProblematic ? 100 : 95
        };
      }
    }

    return { 
      isExtension: false, 
      shouldBlock: false, 
      reason: 'No extension protocol detected', 
      confidence: 0 
    };
  }

  /**
   * Detect extensions by URL patterns
   */
  detectByPattern(url) {
    for (const pattern of EXTENSION_PATTERNS) {
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

    return { 
      isExtension: false, 
      shouldBlock: false, 
      reason: 'No extension patterns matched', 
      confidence: 0 
    };
  }

  /**
   * Detect extensions using heuristics
   */
  detectByHeuristics(url, requestData = null) {
    const suspiciousIndicators = [];
    let confidence = 0;

    try {
      const urlObj = new URL(url);

      // Check for suspicious hostname patterns (Chrome extension ID pattern)
      if (urlObj.hostname && urlObj.hostname.length === 32 && /^[a-z]+$/.test(urlObj.hostname)) {
        suspiciousIndicators.push('chrome extension ID hostname pattern');
        confidence += 30;
      }

      // Check for suspicious paths
      const suspiciousPaths = ['/content_scripts/', '/background/', '/popup/', '/options/'];
      if (suspiciousPaths.some(path => urlObj.pathname.includes(path))) {
        suspiciousIndicators.push('extension-specific path structure');
        confidence += 25;
      }

      // Check for suspicious query parameters
      if (urlObj.search && urlObj.search.includes('extension-id=')) {
        suspiciousIndicators.push('extension ID in query parameters');
        confidence += 20;
      }

      // Check request characteristics if available
      if (requestData) {
        if (requestData.initiator && EXTENSION_PROTOCOLS.some(p => requestData.initiator.startsWith(p))) {
          suspiciousIndicators.push('request initiated by extension');
          confidence += 40;
        }
      }

    } catch (urlError) {
      // URL parsing failed, but we can still do basic string checks
      if (url.includes('extension-id=') || url.includes('/content_scripts/')) {
        suspiciousIndicators.push('suspicious URL structure');
        confidence += 15;
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

    return { 
      isExtension: false, 
      shouldBlock: false, 
      reason: 'No heuristic indicators found', 
      confidence 
    };
  }

  /**
   * Extract extension ID from URL
   */
  extractExtensionId(url, protocol) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname; // Works for Chrome, Firefox, etc.
    } catch {
      // Fallback regex extraction
      const match = url.match(new RegExp(`${protocol.replace(':', '')}://([^/]+)`));
      return match ? match[1] : undefined;
    }
  }

  /**
   * Determine browser type from protocol
   */
  getBrowserTypeFromProtocol(protocol) {
    const mapping = {
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
  isKnownProblematicId(extensionId) {
    if (!extensionId) return false;
    return KNOWN_PROBLEMATIC_IDS.includes(extensionId);
  }

  /**
   * Check if URL is whitelisted
   */
  isWhitelisted(url) {
    return EXTENSION_WHITELIST.some(whitelistedUrl => 
      url.startsWith(whitelistedUrl)
    );
  }

  /**
   * Update statistics
   */
  updateStats(result) {
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
  }

  /**
   * Log detection results
   */
  logDetection(result, url) {
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
  log(level, message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    this.logEntries.push(logEntry);
    
    // Maintain log size limit
    if (this.logEntries.length > (this.config.maxLogEntries || 500)) {
      this.logEntries.shift();
    }

    // Console output based on log level
    const shouldLog = this.shouldLog(level);
    if (shouldLog) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[SW-ExtensionFilter] ${message}`, data || '');
    }
  }

  /**
   * Check if log level should be output
   */
  shouldLog(level) {
    const levels = ['error', 'warn', 'info', 'debug'];
    const configLevel = this.config.logLevel || 'warn';
    return levels.indexOf(level) <= levels.indexOf(configLevel);
  }

  /**
   * Get current statistics
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Get recent log entries
   */
  getLogs(limit = 100) {
    return this.logEntries.slice(-limit);
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalRequests: 0,
      blockedRequests: 0,
      allowedRequests: 0,
      extensionTypes: {},
      topBlockedIds: {},
      lastReset: new Date().toISOString(),
      startTime: this.stats.startTime
    };
  }

  /**
   * Get filtering summary for debugging
   */
  getSummary() {
    const stats = this.getStats();
    const blockRate = stats.totalRequests > 0 ? 
      ((stats.blockedRequests / stats.totalRequests) * 100).toFixed(1) : '0.0';
    
    return {
      ...stats,
      blockRate: `${blockRate}%`,
      uptime: this.calculateUptime(),
      topExtensionTypes: Object.entries(stats.extensionTypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      topBlockedExtensions: Object.entries(stats.topBlockedIds)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
    };
  }

  /**
   * Calculate uptime
   */
  calculateUptime() {
    const start = new Date(this.stats.startTime);
    const now = new Date();
    const uptimeMs = now - start;
    
    const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }
}

/**
 * Quick utility functions for simple checks
 */
function isExtensionUrl(url) {
  return EXTENSION_PROTOCOLS.some(protocol => url.startsWith(protocol));
}

function isKnownProblematicExtension(url) {
  try {
    const urlObj = new URL(url);
    return KNOWN_PROBLEMATIC_IDS.includes(urlObj.hostname);
  } catch {
    return false;
  }
}

// Export for service worker usage
if (typeof self !== 'undefined' && typeof self.importScripts !== 'undefined') {
  // Service Worker environment
  self.ServiceWorkerExtensionFilter = ServiceWorkerExtensionFilter;
  self.isExtensionUrl = isExtensionUrl;
  self.isKnownProblematicExtension = isKnownProblematicExtension;
} else if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    ServiceWorkerExtensionFilter,
    isExtensionUrl,
    isKnownProblematicExtension
  };
}