// JSON-LD 스키마 검증 및 생성 유틸리티
export interface ArticleSchema {
  '@context': string;
  '@type': 'Article';
  headline: string;
  description: string;
  image: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  articleSection?: string;
  keywords?: string[];
}

export interface WebSiteSchema {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  description: string;
  url: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
}

export interface OrganizationSchema {
  '@context': string;
  '@type': 'Organization';
  name: string;
  description: string;
  url: string;
  logo: {
    '@type': 'ImageObject';
    url: string;
  };
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
    url?: string;
  };
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

class JSONLDSchemaGenerator {
  private static instance: JSONLDSchemaGenerator;
  private baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr';
  private organizationName = 'Stock Advenoh';
  private organizationDescription = '주식 투자 정보와 ETF 분석을 제공하는 웹사이트';

  private constructor() {}

  static getInstance(): JSONLDSchemaGenerator {
    if (!JSONLDSchemaGenerator.instance) {
      JSONLDSchemaGenerator.instance = new JSONLDSchemaGenerator();
    }
    return JSONLDSchemaGenerator.instance;
  }

  // 블로그 포스트용 Article 스키마 생성
  generateArticleSchema(
    title: string,
    description: string,
    image: string,
    author: string,
    datePublished: string,
    dateModified?: string,
    category?: string,
    keywords?: string[]
  ): ArticleSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      image,
      author: {
        '@type': 'Person',
        name: author,
        url: `${this.baseUrl}/about`,
      },
      publisher: {
        '@type': 'Organization',
        name: this.organizationName,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`,
        },
      },
      datePublished,
      dateModified: dateModified || datePublished,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': this.getCurrentUrl(),
      },
      articleSection: category,
      keywords: keywords || ['주식', '투자', 'ETF', '금융'],
    };
  }

  // 웹사이트용 WebSite 스키마 생성
  generateWebSiteSchema(): WebSiteSchema & { alternateName?: string } {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: "Frank's Investment Blog",
      alternateName: "Frank's Investment Insights",
      description: '투자에 대한 인사이트 - 주식, ETF, 재테크 정보 블로그',
      url: this.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
      publisher: {
        '@type': 'Organization',
        name: "Frank's Investment Blog",
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`,
        },
      },
    };
  }

  // 조직용 Organization 스키마 생성
  generateOrganizationSchema(): OrganizationSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.organizationName,
      description: this.organizationDescription,
      url: this.baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${this.baseUrl}/logo.png`,
      },
      sameAs: [
        'https://github.com/advenoh',
        'https://twitter.com/advenoh',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'contact@advenoh.pe.kr',
        url: `${this.baseUrl}/contact`,
      },
    };
  }

  // 브레드크럼용 Breadcrumb 스키마 생성
  generateBreadcrumbSchema(paths: Array<{ name: string; url: string }>): BreadcrumbSchema {
    const itemListElement = paths.map((path, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: path.name,
      item: path.url,
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    };
  }

  // 블로그 포스트용 브레드크럼 생성
  generateBlogPostBreadcrumb(category: string, title: string): BreadcrumbSchema {
    const paths = [
      { name: '홈', url: this.baseUrl },
      { name: '블로그', url: `${this.baseUrl}/blog` },
      { name: category, url: `${this.baseUrl}/blog?category=${encodeURIComponent(category)}` },
      { name: title, url: this.getCurrentUrl() },
    ];

    return this.generateBreadcrumbSchema(paths);
  }

  // 시리즈용 브레드크럼 생성
  generateSeriesBreadcrumb(seriesTitle: string): BreadcrumbSchema {
    const paths = [
      { name: '홈', url: this.baseUrl },
      { name: '시리즈', url: `${this.baseUrl}/series` },
      { name: seriesTitle, url: this.getCurrentUrl() },
    ];

    return this.generateBreadcrumbSchema(paths);
  }

  // FAQ 스키마 생성
  generateFAQSchema(questions: Array<{ question: string; answer: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer,
        },
      })),
    };
  }

  // HowTo 스키마 생성
  generateHowToSchema(
    title: string,
    description: string,
    steps: Array<{ name: string; text: string; image?: string }>,
    totalTime?: string,
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  ) {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: title,
      description,
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        ...(step.image && { image: step.image }),
      })),
      ...(totalTime && { totalTime }),
      ...(difficulty && { difficulty }),
    };
  }

  // JSON-LD 스크립트 태그 생성
  generateJSONLDScript(schema: any): string {
    return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
  }

  // 여러 스키마를 하나의 스크립트로 결합
  generateCombinedJSONLDScript(schemas: any[]): string {
    const combinedSchema = schemas.length === 1 ? schemas[0] : schemas;
    return this.generateJSONLDScript(combinedSchema);
  }

  // 스키마 유효성 검사
  validateSchema(schema: any): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 기본 구조 검사
    if (!schema['@context']) {
      errors.push('Missing @context property');
    }

    if (!schema['@type']) {
      errors.push('Missing @type property');
    }

    // Article 스키마 검사
    if (schema['@type'] === 'Article') {
      if (!schema.headline) {
        errors.push('Article schema missing headline');
      }
      if (!schema.description) {
        errors.push('Article schema missing description');
      }
      if (!schema.author) {
        errors.push('Article schema missing author');
      }
      if (!schema.datePublished) {
        errors.push('Article schema missing datePublished');
      }
      if (!schema.publisher) {
        errors.push('Article schema missing publisher');
      }
    }

    // WebSite 스키마 검사
    if (schema['@type'] === 'WebSite') {
      if (!schema.name) {
        errors.push('WebSite schema missing name');
      }
      if (!schema.url) {
        errors.push('WebSite schema missing url');
      }
      if (!schema.potentialAction) {
        warnings.push('WebSite schema missing potentialAction (search)');
      }
    }

    // Breadcrumb 스키마 검사
    if (schema['@type'] === 'BreadcrumbList') {
      if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
        errors.push('BreadcrumbList schema missing or invalid itemListElement');
      }
    }

    // URL 유효성 검사
    if (schema.url && !this.isValidUrl(schema.url)) {
      warnings.push('URL may not be valid');
    }

    if (schema.image && !this.isValidUrl(schema.image)) {
      warnings.push('Image URL may not be valid');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Google Rich Results 테스트 URL 생성
  generateRichResultsTestUrl(): string {
    const currentUrl = this.getCurrentUrl();
    return `https://search.google.com/test/rich-results?url=${encodeURIComponent(currentUrl)}`;
  }

  // 구조화된 데이터 테스트 도구 URL 생성
  generateStructuredDataTestUrl(): string {
    const currentUrl = this.getCurrentUrl();
    return `https://search.google.com/structured-data/testing-tool?url=${encodeURIComponent(currentUrl)}`;
  }

  // URL 유효성 검사
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // 현재 URL 가져오기
  private getCurrentUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return this.baseUrl;
  }
}

// 편의 함수들
export const jsonLDSchemaGenerator = JSONLDSchemaGenerator.getInstance();

export function generateArticleSchema(
  title: string,
  description: string,
  image: string,
  author: string,
  datePublished: string,
  dateModified?: string,
  category?: string,
  keywords?: string[]
): ArticleSchema {
  return jsonLDSchemaGenerator.generateArticleSchema(
    title,
    description,
    image,
    author,
    datePublished,
    dateModified,
    category,
    keywords
  );
}

export function generateWebSiteSchema(): WebSiteSchema {
  return jsonLDSchemaGenerator.generateWebSiteSchema();
}

export function generateOrganizationSchema(): OrganizationSchema {
  return jsonLDSchemaGenerator.generateOrganizationSchema();
}

export function generateBreadcrumbSchema(
  paths: Array<{ name: string; url: string }>
): BreadcrumbSchema {
  return jsonLDSchemaGenerator.generateBreadcrumbSchema(paths);
}

export function generateBlogPostBreadcrumb(
  category: string,
  title: string
): BreadcrumbSchema {
  return jsonLDSchemaGenerator.generateBlogPostBreadcrumb(category, title);
}

export function generateSeriesBreadcrumb(seriesTitle: string): BreadcrumbSchema {
  return jsonLDSchemaGenerator.generateSeriesBreadcrumb(seriesTitle);
}

export function generateFAQSchema(questions: Array<{ question: string; answer: string }>) {
  return jsonLDSchemaGenerator.generateFAQSchema(questions);
}

export function generateHowToSchema(
  title: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>,
  totalTime?: string,
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
) {
  return jsonLDSchemaGenerator.generateHowToSchema(title, description, steps, totalTime, difficulty);
}

export function generateJSONLDScript(schema: any): string {
  return jsonLDSchemaGenerator.generateJSONLDScript(schema);
}

export function generateCombinedJSONLDScript(schemas: any[]): string {
  return jsonLDSchemaGenerator.generateCombinedJSONLDScript(schemas);
}

export function validateSchema(schema: any): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  return jsonLDSchemaGenerator.validateSchema(schema);
}

export function generateRichResultsTestUrl(): string {
  return jsonLDSchemaGenerator.generateRichResultsTestUrl();
}

export function generateStructuredDataTestUrl(): string {
  return jsonLDSchemaGenerator.generateStructuredDataTestUrl();
} 