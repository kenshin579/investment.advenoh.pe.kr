import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

interface Category {
  category: string;
  count: number;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  // Fetch categories from API
  const { data: apiCategories } = useQuery<Category[]>({
    queryKey: ['/data/categories'],
    queryFn: async () => {
      const response = await fetch('/data/categories.json');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    },
  });

  // Generate categories dynamically
  const categories = [
    { id: "all", label: "전체" },
    ...(apiCategories?.map(({ category }) => ({
      id: category,
      label: category
    })) || [])
  ];

  return (
    <section className="bg-white dark:bg-gray-800 py-8 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`category-filter px-6 py-3 rounded-full font-medium ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
