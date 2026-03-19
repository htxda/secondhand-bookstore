import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, Filter, SlidersHorizontal } from "lucide-react";
import { mockBooks, categories } from "../data/mockData";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function BookListPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [sortBy, setSortBy] = useState<"latest" | "price-low" | "price-high">("latest");

  const imageUrls = [
    "https://images.unsplash.com/photo-1511629091441-ee46146481b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMHRleHRib29rJTIwdW5pdmVyc2l0eXxlbnwxfHx8fDE3NzE5NDEyMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1646495785840-7ff6be438d63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGFuZ3VhZ2UlMjB0ZXh0Ym9va3xlbnwxfHx8fDE3NzE5NDEyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1732304722020-be33345c00c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwYm9va3xlbnwxfHx8fDE3NzE4ODUwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1626885228113-0ac4b52e6cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwdGV4dGJvb2slMjBjb2xsZWdlfGVufDF8fHx8MTc3MTk0MTIzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1569997851406-472ce7b75c6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW5lYXIlMjBhbGdlYnJhJTIwYm9va3xlbnwxfHx8fDE3NzE5NDEyMzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1764096535068-0e9f652e03f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGF0aXN0aWNzJTIwdGV4dGJvb2slMjBhY2FkZW1pY3xlbnwxfHx8fDE3NzE5NDEyMzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  ];

  const filteredBooks = mockBooks.filter(book => {
    if (selectedCategory === "all") return true;
    const category = categories.find(c => c.id === selectedCategory);
    return book.subject === category?.name;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "latest") {
      return b.publishedAt.getTime() - a.publishedAt.getTime();
    } else if (sortBy === "price-low") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-violet-600 px-4 pt-8 pb-6 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-black text-lime-400">书籍市场</h1>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-lime-400 text-purple-900 font-bold"
                : "bg-white/20 text-white"
            }`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? "bg-lime-400 text-purple-900 font-bold"
                  : "bg-white/20 text-white"
              }`}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 sticky top-36 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">排序：</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("latest")}
              className={`px-3 py-1 rounded-full text-sm ${
                sortBy === "latest"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              最新
            </button>
            <button
              onClick={() => setSortBy("price-low")}
              className={`px-3 py-1 rounded-full text-sm ${
                sortBy === "price-low"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              价格↑
            </button>
            <button
              onClick={() => setSortBy("price-high")}
              className={`px-3 py-1 rounded-full text-sm ${
                sortBy === "price-high"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              价格↓
            </button>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {sortedBooks.map((book, index) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <ImageWithFallback
              src={imageUrls[index % imageUrls.length]}
              alt={book.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1 h-10">
                {book.title}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{book.author}</p>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  {book.condition}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-purple-600">¥{book.price}</span>
                  <span className="text-xs text-gray-400 line-through">¥{book.originalPrice}</span>
                </div>
                <div className="flex items-center gap-0.5 text-xs text-gray-500">
                  <span className="text-yellow-500">⭐</span>
                  <span>{book.seller.rating}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {sortedBooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-600 text-center">暂无相关书籍</p>
          <Link
            to="/publish"
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full font-bold"
          >
            去上架书籍
          </Link>
        </div>
      )}
    </div>
  );
}
