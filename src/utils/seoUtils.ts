/**
 * SEO Utilities
 * Helper functions for generating optimized metadata and structured data
 */

import { MetadataConfig, StructuredData } from '../hooks/useMetadata';

export interface TarotCardData {
  id: number;
  name: string;
  nameKo: string;
  type: 'major' | 'minor';
  suit?: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  imageUrl: string;
}

export interface SpreadData {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  positions: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const seoUtils = {
  /**
   * Generate page metadata for home/landing page
   */
  generateHomeMetadata(): MetadataConfig {
    return {
      title: '타로 타이머 - 개인 맞춤형 타로 카드 리딩 앱',
      description: '🔮 시간별 타로 카드와 함께하는 의미있는 하루를 시작하세요. AI 기반 개인 맞춤형 타로 리딩, 다양한 스프레드, 일기 기능을 제공하는 현대적인 타로 앱입니다.',
      keywords: [
        '타로', '타로카드', '타로리딩', '온라인타로', '무료타로',
        '타이머', '명상', '점술', '운세', '카드점',
        'tarot', 'tarot cards', 'tarot reading', 'online tarot', 'free tarot',
        'timer', 'meditation', 'divination', 'fortune telling'
      ],
      canonical: '/',
      ogTitle: '타로 타이머 - 개인 맞춤형 타로 카드 리딩',
      ogDescription: '🔮 AI 기반 개인 맞춤형 타로 리딩으로 의미있는 하루를 시작하세요',
      ogImage: '/og-image-home.png',
      ogType: 'website',
      twitterTitle: '타로 타이머 - 개인 맞춤형 타로 카드 리딩',
      twitterDescription: '🔮 AI 기반 개인 맞춤형 타로 리딩으로 의미있는 하루를 시작하세요',
      twitterImage: '/twitter-card-home.png',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: '타로 타이머',
          alternateName: 'Tarot Timer',
          description: '개인 맞춤형 타로 카드 리딩과 타이머 기능을 제공하는 모바일 앱',
          url: 'https://tarot-timer.app',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'KRW'
          },
          featureList: [
            '개인 맞춤형 타로 리딩',
            '다양한 타로 스프레드',
            '타로 일기 기능',
            '명상 타이머',
            '카드별 상세 해석'
          ],
          author: {
            '@type': 'Person',
            name: 'therearenorules'
          },
          inLanguage: 'ko-KR',
          datePublished: '2024-01-01',
          dateModified: new Date().toISOString().split('T')[0]
        }
      ]
    };
  },

  /**
   * Generate metadata for tarot card detail pages
   */
  generateCardMetadata(card: TarotCardData): MetadataConfig {
    const cardType = card.type === 'major' ? '메이저 아르카나' : '마이너 아르카나';
    const suitText = card.suit ? ` - ${card.suit}` : '';
    
    return {
      title: `${card.nameKo} (${card.name}) - ${cardType}${suitText} | 타로 타이머`,
      description: `${card.nameKo} 타로 카드의 의미와 해석을 알아보세요. 정방향: ${card.uprightMeaning}. 역방향: ${card.reversedMeaning}. 키워드: ${card.keywords.join(', ')}.`,
      keywords: [
        card.nameKo,
        card.name,
        cardType,
        ...card.keywords,
        '타로카드',
        '타로의미',
        '카드해석',
        'tarot meaning',
        'tarot card interpretation'
      ],
      canonical: `/cards/${card.id}`,
      
      ogTitle: `${card.nameKo} (${card.name}) - ${cardType} 타로 카드`,
      ogDescription: `${card.nameKo} 타로 카드의 의미: ${card.uprightMeaning}`,
      ogImage: card.imageUrl || '/og-image-card-default.png',
      ogImageAlt: `${card.nameKo} 타로 카드 이미지`,
      ogType: 'article',
      
      twitterCard: 'summary_large_image',
      twitterTitle: `${card.nameKo} - ${cardType}`,
      twitterDescription: `${card.uprightMeaning}`,
      twitterImage: card.imageUrl || '/twitter-card-default.png',
      twitterImageAlt: `${card.nameKo} 타로 카드`,
      
      articleSection: 'Tarot Cards',
      articleTags: [cardType, ...card.keywords],
      
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${card.nameKo} (${card.name}) - ${cardType} 타로 카드`,
          description: `${card.nameKo} 타로 카드의 의미와 해석`,
          image: card.imageUrl,
          author: {
            '@type': 'Organization',
            name: '타로 타이머'
          },
          publisher: {
            '@type': 'Organization',
            name: '타로 타이머',
            logo: {
              '@type': 'ImageObject',
              url: '/logo.png'
            }
          },
          datePublished: '2024-01-01',
          dateModified: new Date().toISOString().split('T')[0],
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://tarot-timer.app/cards/${card.id}`
          },
          keywords: card.keywords.join(', '),
          articleSection: 'Tarot Cards',
          inLanguage: 'ko-KR'
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `${card.nameKo} 타로 카드`,
          description: `${cardType} ${card.nameKo}의 의미와 해석`,
          image: card.imageUrl,
          category: cardType,
          keywords: card.keywords.join(', '),
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'KRW',
            availability: 'https://schema.org/InStock'
          }
        }
      ]
    };
  },

  /**
   * Generate metadata for tarot spread pages
   */
  generateSpreadMetadata(spread: SpreadData): MetadataConfig {
    const difficultyText = {
      beginner: '초급',
      intermediate: '중급',
      advanced: '고급'
    }[spread.difficulty];

    return {
      title: `${spread.nameKo} (${spread.name}) - ${difficultyText} 타로 스프레드 | 타로 타이머`,
      description: `${spread.nameKo} 타로 스프레드로 운세를 확인해보세요. ${spread.description} ${spread.positions}장의 카드를 사용하는 ${difficultyText} 스프레드입니다.`,
      keywords: [
        spread.nameKo,
        spread.name,
        '타로스프레드',
        '타로배치',
        difficultyText,
        `${spread.positions}카드`,
        'tarot spread',
        'tarot layout',
        'fortune telling'
      ],
      canonical: `/spreads/${spread.id}`,
      
      ogTitle: `${spread.nameKo} - ${difficultyText} 타로 스프레드`,
      ogDescription: spread.description,
      ogImage: `/spreads/${spread.id}/og-image.png`,
      ogImageAlt: `${spread.nameKo} 타로 스프레드 레이아웃`,
      ogType: 'article',
      
      twitterTitle: `${spread.nameKo} 타로 스프레드`,
      twitterDescription: spread.description,
      twitterImage: `/spreads/${spread.id}/twitter-card.png`,
      
      articleSection: 'Tarot Spreads',
      articleTags: [difficultyText, `${spread.positions}카드`, '타로스프레드'],
      
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: `${spread.nameKo} 타로 스프레드 방법`,
          description: spread.description,
          image: `/spreads/${spread.id}/og-image.png`,
          totalTime: 'PT10M',
          supply: [
            {
              '@type': 'HowToSupply',
              name: '타로 카드 덱'
            }
          ],
          tool: [
            {
              '@type': 'HowToTool',
              name: '타로 타이머 앱'
            }
          ],
          step: [
            {
              '@type': 'HowToStep',
              name: '카드 섞기',
              text: '타로 카드를 충분히 섞어주세요.'
            },
            {
              '@type': 'HowToStep',
              name: '질문 집중',
              text: '알고 싶은 질문에 집중하며 카드를 선택하세요.'
            },
            {
              '@type': 'HowToStep',
              name: '카드 배치',
              text: `${spread.positions}장의 카드를 ${spread.nameKo} 레이아웃에 따라 배치하세요.`
            },
            {
              '@type': 'HowToStep',
              name: '해석',
              text: '각 카드의 위치와 의미를 해석하여 답을 찾아보세요.'
            }
          ],
          author: {
            '@type': 'Organization',
            name: '타로 타이머'
          },
          datePublished: '2024-01-01',
          dateModified: new Date().toISOString().split('T')[0]
        }
      ]
    };
  },

  /**
   * Generate metadata for daily reading pages
   */
  generateDailyReadingMetadata(date: string): MetadataConfig {
    const formattedDate = new Date(date).toLocaleDateString('ko-KR');
    
    return {
      title: `${formattedDate} 오늘의 타로 - 데일리 타로 리딩 | 타로 타이머`,
      description: `${formattedDate} 오늘의 운세를 타로 카드로 확인해보세요. 개인 맞춤형 데일리 타로 리딩으로 하루를 시작하세요.`,
      keywords: [
        '오늘의타로',
        '데일리타로',
        '일일운세',
        '타로리딩',
        formattedDate,
        'daily tarot',
        'today tarot',
        'daily reading'
      ],
      canonical: `/daily/${date}`,
      
      ogTitle: `${formattedDate} 오늘의 타로`,
      ogDescription: `${formattedDate} 개인 맞춤형 데일리 타로 리딩`,
      ogImage: `/daily/${date}/og-image.png`,
      ogType: 'article',
      
      twitterTitle: `${formattedDate} 오늘의 타로`,
      twitterDescription: `개인 맞춤형 데일리 타로 리딩`,
      
      articlePublishedTime: date,
      articleSection: 'Daily Reading',
      articleTags: ['데일리타로', '오늘의운세', formattedDate],
      
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${formattedDate} 오늘의 타로 리딩`,
          description: `${formattedDate} 개인 맞춤형 데일리 타로 리딩`,
          datePublished: date,
          dateModified: date,
          author: {
            '@type': 'Organization',
            name: '타로 타이머'
          },
          publisher: {
            '@type': 'Organization',
            name: '타로 타이머',
            logo: {
              '@type': 'ImageObject',
              url: '/logo.png'
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://tarot-timer.app/daily/${date}`
          },
          articleSection: 'Daily Reading',
          keywords: '오늘의타로, 데일리타로, 일일운세',
          inLanguage: 'ko-KR'
        }
      ]
    };
  },

  /**
   * Generate metadata for settings/about pages
   */
  generateSettingsMetadata(): MetadataConfig {
    return {
      title: '설정 - 타로 타이머',
      description: '타로 타이머 앱의 설정을 변경하고 개인화하세요. 알림, 테마, 언어 등 다양한 옵션을 조정할 수 있습니다.',
      robots: 'noindex, follow', // Settings pages don't need to be indexed
      canonical: '/settings',
      
      ogTitle: '타로 타이머 설정',
      ogDescription: '개인 맞춤 타로 앱 설정',
      ogType: 'website'
    };
  },

  /**
   * Generate generic article metadata
   */
  generateArticleMetadata({
    title,
    description,
    keywords = [],
    publishDate,
    modifiedDate,
    author = '타로 타이머',
    section = 'Article',
    tags = [],
    imageUrl,
    canonicalPath
  }: {
    title: string;
    description: string;
    keywords?: string[];
    publishDate?: string;
    modifiedDate?: string;
    author?: string;
    section?: string;
    tags?: string[];
    imageUrl?: string;
    canonicalPath?: string;
  }): MetadataConfig {
    return {
      title: `${title} | 타로 타이머`,
      description,
      keywords: [...keywords, '타로', '타로카드', 'tarot'],
      canonical: canonicalPath,
      
      ogTitle: title,
      ogDescription: description,
      ogImage: imageUrl,
      ogType: 'article',
      
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: imageUrl,
      
      articleAuthor: author,
      articlePublishedTime: publishDate,
      articleModifiedTime: modifiedDate,
      articleSection: section,
      articleTags: tags,
      
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: description,
          author: {
            '@type': 'Organization',
            name: author
          },
          publisher: {
            '@type': 'Organization',
            name: '타로 타이머',
            logo: {
              '@type': 'ImageObject',
              url: '/logo.png'
            }
          },
          datePublished: publishDate || new Date().toISOString(),
          dateModified: modifiedDate || new Date().toISOString(),
          image: imageUrl,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalPath ? `https://tarot-timer.app${canonicalPath}` : undefined
          },
          articleSection: section,
          keywords: keywords.join(', '),
          inLanguage: 'ko-KR'
        }
      ]
    };
  },

  /**
   * Generate FAQ structured data
   */
  generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  },

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    };
  },

  /**
   * Generate organization structured data
   */
  generateOrganizationStructuredData(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: '타로 타이머',
      alternateName: 'Tarot Timer',
      url: 'https://tarot-timer.app',
      logo: 'https://tarot-timer.app/logo.png',
      description: '개인 맞춤형 타로 카드 리딩과 타이머 기능을 제공하는 모바일 앱',
      foundingDate: '2024',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Korean', 'English']
      },
      sameAs: [
        'https://github.com/therearenorules/tarot-timer-app'
      ]
    };
  }
};

export default seoUtils;