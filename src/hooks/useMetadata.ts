/**
 * Dynamic Metadata Management Hook
 * Provides comprehensive HTML metadata optimization for SEO and social sharing
 */

import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  key?: string;
}

export interface LinkTag {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
  media?: string;
  crossorigin?: string;
  key?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface MetadataConfig {
  // Basic SEO
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  canonical?: string;
  language?: string;
  
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  ogSiteName?: string;
  ogLocale?: string;
  ogVideo?: string;
  
  // Twitter Cards
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  
  // Article specific (for blog posts, etc.)
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];
  
  // App specific
  appName?: string;
  appVersion?: string;
  appPlatform?: string;
  
  // Custom meta tags
  customMeta?: MetaTag[];
  customLinks?: LinkTag[];
  structuredData?: StructuredData[];
  
  // Performance hints
  preconnect?: string[];
  prefetch?: string[];
  preload?: Array<{ href: string; as: string; type?: string }>;
  
  // Security
  csp?: string;
  
  // Theme
  themeColor?: string;
  msapplicationTileColor?: string;
}

interface UseMetadataOptions {
  fallbackToDefault?: boolean;
  merge?: boolean;
  immediate?: boolean;
}

const DEFAULT_METADATA: MetadataConfig = {
  title: '타로 타이머 - Tarot Timer',
  description: '🔮 시간별 타로 카드와 함께하는 의미있는 하루. 개인 맞춤형 타로 리딩과 타이머 기능을 제공합니다.',
  keywords: ['타로', '타로카드', '타이머', '명상', '점술', 'tarot', 'tarot cards', 'timer', 'meditation'],
  author: 'therearenorules',
  robots: 'index, follow',
  language: 'ko',
  
  ogTitle: '타로 타이머 - Tarot Timer',
  ogDescription: '🔮 시간별 타로 카드와 함께하는 의미있는 하루',
  ogImage: '/og-image.png',
  ogType: 'website',
  ogSiteName: '타로 타이머',
  ogLocale: 'ko_KR',
  
  twitterCard: 'summary_large_image',
  twitterTitle: '타로 타이머 - Tarot Timer',
  twitterDescription: '🔮 시간별 타로 카드와 함께하는 의미있는 하루',
  twitterImage: '/twitter-card.png',
  
  appName: '타로 타이머',
  appPlatform: 'web',
  
  themeColor: '#6366f1',
  msapplicationTileColor: '#1a1f3a'
};

export const useMetadata = (
  metadata: MetadataConfig = {},
  options: UseMetadataOptions = {}
) => {
  const {
    fallbackToDefault = true,
    merge = true,
    immediate = false
  } = options;
  
  const metaElementsRef = useRef<HTMLElement[]>([]);
  const linkElementsRef = useRef<HTMLElement[]>([]);
  const structuredDataRef = useRef<HTMLElement[]>([]);
  const isAppliedRef = useRef(false);

  const cleanupPreviousMetadata = () => {
    if (Platform.OS !== 'web') return;
    
    // Remove previously added meta tags
    metaElementsRef.current.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    metaElementsRef.current = [];
    
    // Remove previously added link tags
    linkElementsRef.current.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    linkElementsRef.current = [];
    
    // Remove previously added structured data
    structuredDataRef.current.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    structuredDataRef.current = [];
  };

  const createMetaElement = (tag: MetaTag): HTMLMetaElement => {
    const meta = document.createElement('meta');
    
    if (tag.name) meta.setAttribute('name', tag.name);
    if (tag.property) meta.setAttribute('property', tag.property);
    meta.setAttribute('content', tag.content);
    
    if (tag.key) meta.setAttribute('data-key', tag.key);
    meta.setAttribute('data-dynamic', 'true');
    
    return meta;
  };

  const createLinkElement = (tag: LinkTag): HTMLLinkElement => {
    const link = document.createElement('link');
    
    link.setAttribute('rel', tag.rel);
    link.setAttribute('href', tag.href);
    
    if (tag.type) link.setAttribute('type', tag.type);
    if (tag.sizes) link.setAttribute('sizes', tag.sizes);
    if (tag.media) link.setAttribute('media', tag.media);
    if (tag.crossorigin) link.setAttribute('crossorigin', tag.crossorigin);
    
    if (tag.key) link.setAttribute('data-key', tag.key);
    link.setAttribute('data-dynamic', 'true');
    
    return link;
  };

  const createStructuredDataElement = (data: StructuredData): HTMLScriptElement => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    script.setAttribute('data-dynamic', 'true');
    return script;
  };

  const updateDocumentTitle = (title: string) => {
    if (Platform.OS === 'web' && title) {
      document.title = title;
    }
  };

  const generateMetaTags = (config: MetadataConfig): MetaTag[] => {
    const tags: MetaTag[] = [];

    // Basic SEO tags
    if (config.description) {
      tags.push({ name: 'description', content: config.description });
    }
    if (config.keywords && config.keywords.length > 0) {
      tags.push({ name: 'keywords', content: config.keywords.join(', ') });
    }
    if (config.author) {
      tags.push({ name: 'author', content: config.author });
    }
    if (config.robots) {
      tags.push({ name: 'robots', content: config.robots });
    }

    // Open Graph tags
    if (config.ogTitle) {
      tags.push({ property: 'og:title', content: config.ogTitle });
    }
    if (config.ogDescription) {
      tags.push({ property: 'og:description', content: config.ogDescription });
    }
    if (config.ogImage) {
      tags.push({ property: 'og:image', content: config.ogImage });
    }
    if (config.ogImageAlt) {
      tags.push({ property: 'og:image:alt', content: config.ogImageAlt });
    }
    if (config.ogUrl) {
      tags.push({ property: 'og:url', content: config.ogUrl });
    }
    if (config.ogType) {
      tags.push({ property: 'og:type', content: config.ogType });
    }
    if (config.ogSiteName) {
      tags.push({ property: 'og:site_name', content: config.ogSiteName });
    }
    if (config.ogLocale) {
      tags.push({ property: 'og:locale', content: config.ogLocale });
    }
    if (config.ogVideo) {
      tags.push({ property: 'og:video', content: config.ogVideo });
    }

    // Twitter Card tags
    if (config.twitterCard) {
      tags.push({ name: 'twitter:card', content: config.twitterCard });
    }
    if (config.twitterSite) {
      tags.push({ name: 'twitter:site', content: config.twitterSite });
    }
    if (config.twitterCreator) {
      tags.push({ name: 'twitter:creator', content: config.twitterCreator });
    }
    if (config.twitterTitle) {
      tags.push({ name: 'twitter:title', content: config.twitterTitle });
    }
    if (config.twitterDescription) {
      tags.push({ name: 'twitter:description', content: config.twitterDescription });
    }
    if (config.twitterImage) {
      tags.push({ name: 'twitter:image', content: config.twitterImage });
    }
    if (config.twitterImageAlt) {
      tags.push({ name: 'twitter:image:alt', content: config.twitterImageAlt });
    }

    // Article tags
    if (config.articleAuthor) {
      tags.push({ property: 'article:author', content: config.articleAuthor });
    }
    if (config.articlePublishedTime) {
      tags.push({ property: 'article:published_time', content: config.articlePublishedTime });
    }
    if (config.articleModifiedTime) {
      tags.push({ property: 'article:modified_time', content: config.articleModifiedTime });
    }
    if (config.articleSection) {
      tags.push({ property: 'article:section', content: config.articleSection });
    }
    if (config.articleTags && config.articleTags.length > 0) {
      config.articleTags.forEach(tag => {
        tags.push({ property: 'article:tag', content: tag });
      });
    }

    // App tags
    if (config.appName) {
      tags.push({ name: 'application-name', content: config.appName });
    }

    // Theme tags
    if (config.themeColor) {
      tags.push({ name: 'theme-color', content: config.themeColor });
    }
    if (config.msapplicationTileColor) {
      tags.push({ name: 'msapplication-TileColor', content: config.msapplicationTileColor });
    }

    // Security tags
    if (config.csp) {
      tags.push({ 
        property: 'http-equiv',
        name: 'Content-Security-Policy',
        content: config.csp 
      });
    }

    // Custom meta tags
    if (config.customMeta) {
      tags.push(...config.customMeta);
    }

    return tags;
  };

  const generateLinkTags = (config: MetadataConfig): LinkTag[] => {
    const links: LinkTag[] = [];

    // Canonical URL
    if (config.canonical) {
      links.push({ rel: 'canonical', href: config.canonical });
    }

    // Preconnect hints
    if (config.preconnect) {
      config.preconnect.forEach(url => {
        links.push({ rel: 'preconnect', href: url, crossorigin: 'anonymous' });
      });
    }

    // Prefetch hints
    if (config.prefetch) {
      config.prefetch.forEach(url => {
        links.push({ rel: 'prefetch', href: url });
      });
    }

    // Preload hints
    if (config.preload) {
      config.preload.forEach(resource => {
        links.push({
          rel: 'preload',
          href: resource.href,
          type: resource.type,
          ...resource
        });
      });
    }

    // Custom links
    if (config.customLinks) {
      links.push(...config.customLinks);
    }

    return links;
  };

  const applyMetadata = (config: MetadataConfig) => {
    if (Platform.OS !== 'web') return;

    try {
      const head = document.head;
      if (!head) return;

      // Update document title
      if (config.title) {
        updateDocumentTitle(config.title);
      }

      // Generate and apply meta tags
      const metaTags = generateMetaTags(config);
      metaTags.forEach(tag => {
        const metaElement = createMetaElement(tag);
        head.appendChild(metaElement);
        metaElementsRef.current.push(metaElement);
      });

      // Generate and apply link tags
      const linkTags = generateLinkTags(config);
      linkTags.forEach(tag => {
        const linkElement = createLinkElement(tag);
        head.appendChild(linkElement);
        linkElementsRef.current.push(linkElement);
      });

      // Apply structured data
      if (config.structuredData) {
        config.structuredData.forEach(data => {
          const scriptElement = createStructuredDataElement(data);
          head.appendChild(scriptElement);
          structuredDataRef.current.push(scriptElement);
        });
      }

      isAppliedRef.current = true;
    } catch (error) {
      console.error('Failed to apply metadata:', error);
    }
  };

  const finalMetadata = merge && fallbackToDefault
    ? { ...DEFAULT_METADATA, ...metadata }
    : fallbackToDefault && Object.keys(metadata).length === 0
    ? DEFAULT_METADATA
    : metadata;

  useEffect(() => {
    if (immediate || !isAppliedRef.current) {
      cleanupPreviousMetadata();
      applyMetadata(finalMetadata);
    }

    // Cleanup on unmount
    return () => {
      cleanupPreviousMetadata();
      isAppliedRef.current = false;
    };
  }, [
    JSON.stringify(finalMetadata), // Re-run when metadata changes
    immediate
  ]);

  return {
    appliedMetadata: finalMetadata,
    updateMetadata: (newMetadata: Partial<MetadataConfig>) => {
      cleanupPreviousMetadata();
      const updatedMetadata = merge 
        ? { ...finalMetadata, ...newMetadata }
        : newMetadata;
      applyMetadata(updatedMetadata);
    },
    resetToDefault: () => {
      cleanupPreviousMetadata();
      applyMetadata(DEFAULT_METADATA);
    }
  };
};

export default useMetadata;