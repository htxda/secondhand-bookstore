import { Link, useParams } from "react-router";
import { ArrowLeft, Heart, Share2, MessageCircle, Star } from "lucide-react";
import { mockBooks } from "../data/mockData";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function BookDetailPage() {
  const { id } = useParams();
  const book = mockBooks.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-600 mb-4">书籍不存在</p>
          <Link to="/books" className="text-purple-600">
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  const imageUrls = {
    "1": "https://images.unsplash.com/photo-1511629091441-ee46146481b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMHRleHRib29rJTIwdW5pdmVyc2l0eXxlbnwxfHx8fDE3NzE5NDEyMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "2": "https://images.unsplash.com/photo-1646495785840-7ff6be438d63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGFuZ3VhZ2UlMjB0ZXh0Ym9va3xlbnwxfHx8fDE3NzE5NDEyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "3": "https://images.unsplash.com/photo-1732304722020-be33345c00c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwYm9va3xlbnwxfHx8fDE3NzE4ODUwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "4": "https://images.unsplash.com/photo-1626885228113-0ac4b52e6cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwdGV4dGJvb2slMjBjb2xsZWdlfGVufDF8fHx8MTc3MTk0MTIzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    "5": "https://images.unsplash.com/photo-1569997851406-472ce7b75c6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW5lYXIlMjBhbGdlYnJhJTIwYm9va3xlbnwxfHx8fDE3NzE5NDEyMzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "6": "https://images.unsplash.com/photo-1764096535068-0e9f652e03f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGF0aXN0aWNzJTIwdGV4dGJvb2slMjBhY2FkZW1pY3xlbnwxfHx8fDE3NzE5NDEyMzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  };

  const avatarUrl = "https://images.unsplash.com/photo-1758270705555-015de348a48a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGNvbGxlZ2UlMjBzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODk5MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link to="/books" className="text-gray-800">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-bold text-gray-800">书籍详情</h1>
        <div className="flex items-center gap-3">
          <button className="text-gray-600">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="text-gray-600">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Book Image */}
      <div className="bg-white">
        <ImageWithFallback
          src={imageUrls[book.id as keyof typeof imageUrls]}
          alt={book.title}
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Book Info */}
      <div className="bg-white px-4 py-6 mb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h2>
            <p className="text-gray-600 mb-3">{book.author}</p>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {book.condition}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {book.subject}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-black text-purple-600">¥{book.price}</span>
          <span className="text-lg text-gray-400 line-through">¥{book.originalPrice}</span>
          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% OFF
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white px-4 py-6 mb-3">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>📝</span>
          <span>书籍描述</span>
        </h3>
        <p className="text-gray-700 leading-relaxed">{book.description}</p>
      </div>

      {/* Seller Info */}
      <div className="bg-white px-4 py-6 mb-3">
        <h3 className="font-bold text-gray-800 mb-4">卖家信息</h3>
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src={avatarUrl}
            alt={book.seller.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800">{book.seller.name}</span>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="text-gray-600">{book.seller.rating}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">校园认证用户</p>
          </div>
          <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors">
            查看主页
          </button>
        </div>
      </div>

      {/* Similar Books */}
      <div className="bg-white px-4 py-6 mb-20">
        <h3 className="font-bold text-gray-800 mb-4">相似推荐</h3>
        <div className="grid grid-cols-3 gap-3">
          {mockBooks.slice(0, 3).map((similarBook, index) => (
            <Link
              key={similarBook.id}
              to={`/books/${similarBook.id}`}
              className="block"
            >
              <ImageWithFallback
                src={Object.values(imageUrls)[index]}
                alt={similarBook.title}
                className="w-full h-32 object-cover rounded-xl mb-2"
              />
              <p className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">
                {similarBook.title}
              </p>
              <p className="text-sm font-bold text-purple-600">¥{similarBook.price}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button className="flex-1 bg-purple-100 text-purple-700 py-3 rounded-full font-bold hover:bg-purple-200 transition-colors flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            联系卖家
          </button>
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 rounded-full font-bold hover:shadow-lg transition-shadow">
            立即购买
          </button>
        </div>
      </div>
    </div>
  );
}
