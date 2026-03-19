import { Link } from "react-router";
import { Search, BookOpen, Plus, ArrowRight, Star, Heart } from "lucide-react";
import { categories, mockBooks } from "../data/mockData";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function HomePage() {
  const featuredBooks = mockBooks.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F5] to-[#FFF0F3]">
      {/* Hero Section - Candy Gradient */}
      <div className="relative candy-gradient px-4 pt-6 pb-28 overflow-hidden">
        {/* Decorative Floating Elements */}
        <div className="absolute top-8 left-4 floating-element text-3xl opacity-60 select-none">✨</div>
        <div className="absolute top-16 right-8 floating-element-slow text-2xl opacity-50 select-none">🌸</div>
        <div className="absolute top-32 left-8 floating-element-slow text-2xl opacity-40 select-none">⭐</div>
        <div className="absolute top-24 right-4 floating-element text-3xl opacity-50 select-none">💖</div>
        <div className="absolute bottom-20 left-4 sparkle text-xl select-none">🌟</div>
        <div className="absolute bottom-32 right-12 floating-element text-2xl opacity-40 select-none">☁️</div>

        {/* Status Bar */}
        <div className="flex justify-between items-center mb-6 text-white text-sm relative z-10">
          <div className="drop-shadow-md">9:41</div>
          <div className="flex gap-3">
            <div className="w-4 h-4 bg-white/30 rounded-full"></div>
            <div className="w-4 h-4 bg-white/30 rounded-full"></div>
            <div className="w-4 h-4 bg-white/40 rounded-full"></div>
          </div>
        </div>

        {/* Large Bold Title */}
        <h1 className="text-5xl font-black text-white mb-2 tracking-tight leading-tight drop-shadow-lg candy-font">
          CAMPUS
          <br />
          BOOK SWAP
        </h1>
        <p className="text-white/90 text-lg mb-6 font-medium">二手教材交易平台</p>

        {/* Search Bar - Candy Style */}
        <div className="candy-search rounded-3xl px-5 py-4 flex items-center gap-3 relative z-10">
          <Search className="w-5 h-5 text-[#FF8FA3]" />
          <input
            type="text"
            placeholder="搜索书名、作者、科目..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-pink-300 font-medium"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
          <Link
            to="/books"
            className="candy-button-pink rounded-3xl p-5 flex items-center justify-between transform hover:scale-105 transition-all duration-300"
          >
            <div>
              <div className="text-white font-bold text-base">浏览</div>
              <div className="text-white font-bold text-base">书籍</div>
            </div>
            <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </Link>
          <Link
            to="/publish"
            className="candy-button-mint rounded-3xl p-5 flex items-center justify-between transform hover:scale-105 transition-all duration-300"
          >
            <div>
              <div className="text-white font-bold text-base">上架</div>
              <div className="text-white font-bold text-base">书籍</div>
            </div>
            <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </Link>
        </div>
      </div>

      {/* Category Grid - Candy Card Style */}
      <div className="px-4 py-6 -mt-16 relative z-20">
        <div className="candy-card rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-5 text-gray-800 candy-font">分类浏览</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/books?category=${category.id}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md border-2 border-white/50`}>
                  {category.emoji}
                </div>
                <span className="text-xs text-gray-700 text-center font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800 candy-font">推荐书籍</h2>
          <Link to="/books" className="text-[#FF8FA3] text-sm flex items-center gap-1 font-medium hover:gap-2 transition-all">
            查看更多 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {featuredBooks.map((book, index) => {
            const imageUrls = [
              "https://images.unsplash.com/photo-1511629091441-ee46146481b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMHRleHRib29rJTIwdW5pdmVyc2l0eXxlbnwxfHx8fDE3NzE5NDEyMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
              "https://images.unsplash.com/photo-1646495785840-7ff6be438d63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGFuZ3VhZ2UlMjB0ZXh0Ym9va3xlbnwxfHx8fDE3NzE5NDEyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
              "https://images.unsplash.com/photo-1732304722020-be33345c00c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwYm9va3xlbnwxfHx8fDE3NzE4ODUwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
            ];
            return (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="block candy-book-card rounded-3xl overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <ImageWithFallback
                    src={imageUrls[index]}
                    alt={book.title}
                    className="w-24 h-32 object-cover rounded-2xl shadow-md"
                  />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-gray-800 line-clamp-1 text-base">{book.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="candy-tag text-xs text-[#FF758F] px-3 py-1.5 rounded-full font-medium">
                          {book.condition}
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">
                          {book.subject}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#FF8FA3]">¥{book.price}</span>
                        <span className="text-sm text-gray-400 line-through">¥{book.originalPrice}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{book.seller.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA Banner - Candy Style */}
      <div className="px-4 pb-8">
        <div className="candy-cta rounded-3xl p-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full"></div>
          <div className="absolute right-8 top-8 w-8 h-8 bg-white/10 rounded-full"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white mb-2 candy-font">
              15分钟搞定
              <br />
              你的需求
            </h2>
            <p className="text-white/90 text-sm font-medium">快速上架，轻松交易</p>
          </div>

          {/* Heart decoration */}
          <Heart className="absolute right-6 bottom-6 w-8 h-8 text-white/30 fill-white/20" />
        </div>
      </div>
    </div>
  );
}
