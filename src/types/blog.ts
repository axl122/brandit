export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  category: 'Strategy' | 'Design' | 'Digital' | 'Personal Branding';
  publishedAt: string;
  readingTime: string;
  coverImage?: string;
  gradient: string; // CSS gradient string
  tags: string[];
  featured?: boolean;
  reference?: {
    name: string;
    url?: string;
  };
}

export interface BlogCategory {
  name: string;
  slug: string;
  description: string;
}
