import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static Export 모드 활성화
  output: 'export',

  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'investment.advenoh.pe.kr',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      'react-icons',
      '@radix-ui/react-slot',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
    ],
  },
  // Turbopack 설정 (Next.js 16 기본)
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  // 성능 최적화
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // NOTE: headers는 static export (output: 'export')에서 적용되지 않음
  // 보안 헤더 및 캐싱은 호스팅 서비스 (Netlify 등)에서 설정해야 함
  // Netlify의 경우 netlify.toml 또는 _headers 파일에서 설정
};

export default nextConfig;
