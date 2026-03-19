export interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  condition: "全新" | "几乎全新" | "良好" | "一般";
  originalPrice: number;
  price: number;
  description: string;
  images: string[];
  seller: {
    name: string;
    avatar: string;
    rating: number;
  };
  publishedAt: Date;
}

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "高等数学（上册）",
    author: "同济大学数学系",
    subject: "数学",
    condition: "良好",
    originalPrice: 45,
    price: 25,
    description: "考研必备！书籍保存完好，笔记清晰。适合数学专业和工科学生。",
    images: ["math-book"],
    seller: {
      name: "张同学",
      avatar: "student-1",
      rating: 4.8,
    },
    publishedAt: new Date(2026, 1, 20),
  },
  {
    id: "2",
    title: "大学英语综合教程2",
    author: "何兆熊",
    subject: "英语",
    condition: "几乎全新",
    originalPrice: 38,
    price: 20,
    description: "闲置教材，95成新，无笔记无划线。",
    images: ["english-book"],
    seller: {
      name: "李同学",
      avatar: "student-2",
      rating: 5.0,
    },
    publishedAt: new Date(2026, 1, 19),
  },
  {
    id: "3",
    title: "C程序设计（第5版）",
    author: "谭浩强",
    subject: "计算机",
    condition: "良好",
    originalPrice: 52,
    price: 30,
    description: "经典C语言教材，适合初学者。有少量笔记标注重点内容。",
    images: ["c-programming"],
    seller: {
      name: "王同学",
      avatar: "student-3",
      rating: 4.9,
    },
    publishedAt: new Date(2026, 1, 18),
  },
  {
    id: "4",
    title: "大学物理（上）",
    author: "张三慧",
    subject: "物理",
    condition: "一般",
    originalPrice: 42,
    price: 18,
    description: "有使用痕迹，但不影响阅读。价格实惠，适合自学使用。",
    images: ["physics-book"],
    seller: {
      name: "赵同学",
      avatar: "student-4",
      rating: 4.5,
    },
    publishedAt: new Date(2026, 1, 17),
  },
  {
    id: "5",
    title: "线性代数",
    author: "同济大学应用数学系",
    subject: "数学",
    condition: "全新",
    originalPrice: 36,
    price: 28,
    description: "全新未拆封，多买了一本，低价转让。",
    images: ["linear-algebra"],
    seller: {
      name: "钱同学",
      avatar: "student-5",
      rating: 5.0,
    },
    publishedAt: new Date(2026, 1, 16),
  },
  {
    id: "6",
    title: "概率论与数理统计",
    author: "盛骤",
    subject: "数学",
    condition: "几乎全新",
    originalPrice: 40,
    price: 26,
    description: "无笔记，干净整洁，适合备考期末和考研。",
    images: ["probability"],
    seller: {
      name: "孙同学",
      avatar: "student-6",
      rating: 4.7,
    },
    publishedAt: new Date(2026, 1, 15),
  },
];

export const categories = [
  { id: "math", name: "数学", emoji: "📐", color: "bg-blue-100" },
  { id: "english", name: "英语", emoji: "📚", color: "bg-green-100" },
  { id: "computer", name: "计算机", emoji: "💻", color: "bg-purple-100" },
  { id: "physics", name: "物理", emoji: "⚡", color: "bg-yellow-100" },
  { id: "chemistry", name: "化学", emoji: "🧪", color: "bg-pink-100" },
  { id: "economics", name: "经济", emoji: "💰", color: "bg-orange-100" },
  { id: "literature", name: "文学", emoji: "📖", color: "bg-red-100" },
  { id: "other", name: "其他", emoji: "📦", color: "bg-gray-100" },
];
