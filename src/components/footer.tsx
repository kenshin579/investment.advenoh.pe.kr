'use client';

import Link from "next/link";
import { ChartLine, Twitter, Linkedin, Youtube, Instagram, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllCategoriesClient } from "@/lib/blog-client";

interface Category {
  category: string;
  count: number;
}

export function Footer() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  
  // Debug logging
  console.log('Footer render - categories:', categories, 'type:', typeof categories, 'isArray:', Array.isArray(categories));

  useEffect(() => {
    getAllCategoriesClient().then(setCategories);
  }, []);
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ChartLine className="text-primary text-2xl" />
              <span className="text-xl font-bold">투자 인사이트</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              국내외 주식, ETF, 채권, 펀드에 대한 전문적인 분석과 투자 인사이트를 제공하는 개인 블로그입니다.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/frank.photosnap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Frank Photo"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/frank.coffeetime"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Frank Coffee"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://blog.advenoh.pe.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="IT Blog"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">카테고리</h3>
            <ul className="space-y-2">
              {(() => {
                try {
                  if (categories === null) {
                    return <li className="text-gray-400">카테고리를 불러오는 중...</li>;
                  }
                  
                  if (!Array.isArray(categories)) {
                    console.error('Categories is not an array:', categories);
                    return <li className="text-gray-400">카테고리를 불러오는 중...</li>;
                  }
                  
                  if (categories.length === 0) {
                    return <li className="text-gray-400">카테고리가 없습니다.</li>;
                  }
                  
                  return categories.map(({ category, count }) => (
                    <li key={category}>
                      <Link 
                        href={`/?category=${category}`} 
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {category} ({count})
                      </Link>
                    </li>
                  ));
                } catch (error) {
                  console.error('Error rendering categories:', error);
                  return <li className="text-gray-400">카테고리를 불러오는 중...</li>;
                }
              })()}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">정보</h3>
            <ul className="space-y-2">

              <li>
                <a href="/rss.xml" className="text-gray-400 hover:text-white transition-colors">
                  RSS
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" className="text-gray-400 hover:text-white transition-colors">
                  사이트맵
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} 투자 인사이트 블로그. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}