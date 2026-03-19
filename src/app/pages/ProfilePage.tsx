import { Link } from "react-router";
import { ChevronRight, BookOpen, Heart, Settings, HelpCircle, LogOut } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { mockBooks } from "../data/mockData";

export function ProfilePage() {
  const avatarUrl = "https://images.unsplash.com/photo-1758270705555-015de348a48a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGNvbGxlZ2UlMjBzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODk5MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080";
  const myBooks = mockBooks.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-violet-600 px-4 pt-8 pb-20">
        <h1 className="text-2xl font-black text-lime-400 mb-8">我的</h1>

        {/* User Profile Card */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={avatarUrl}
              alt="用户头像"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 text-lg">张同学</h2>
              <p className="text-sm text-gray-500">校园认证用户</p>
            </div>
            <Link
              to="/profile/edit"
              className="text-purple-600 text-sm font-medium"
            >
              编辑
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">12</div>
              <div className="text-xs text-gray-600 mt-1">在售</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">8</div>
              <div className="text-xs text-gray-600 mt-1">已售</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">4.8</div>
              <div className="text-xs text-gray-600 mt-1">评分</div>
            </div>
          </div>
        </div>
      </div>

      {/* My Books */}
      <div className="px-4 -mt-12 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              我的上架
            </h3>
            <Link to="/books" className="text-sm text-purple-600">
              查看全部 →
            </Link>
          </div>
          <div className="space-y-3">
            {myBooks.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-16 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                  📚
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 line-clamp-1">{book.title}</h4>
                  <p className="text-sm text-gray-500">{book.subject}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600">¥{book.price}</div>
                  <div className="text-xs text-gray-500">{book.condition}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="px-4 space-y-3 pb-20">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-medium text-gray-800">我的收藏</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <div className="h-px bg-gray-100" />
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800">设置</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <div className="h-px bg-gray-100" />
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-medium text-gray-800">帮助与反馈</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <span className="font-medium text-gray-800">退出登录</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Version Info */}
        <div className="text-center text-sm text-gray-400 py-4">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
}
