import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Camera, X } from "lucide-react";
import { categories } from "../data/mockData";

export function PublishPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    subject: "",
    condition: "",
    originalPrice: "",
    price: "",
    description: "",
  });

  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    alert("书籍上架成功！");
    navigate("/books");
  };

  const handleImageUpload = () => {
    // Mock image upload
    alert("请选择图片");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-violet-600 px-4 pt-8 pb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-black text-lime-400">上架书籍</h1>
          <div className="w-6" />
        </div>
        <p className="text-white/90 text-sm">填写书籍信息，快速上架交易</p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-4">
        {/* Image Upload */}
        <div className="bg-white rounded-2xl p-4">
          <label className="block text-sm font-bold text-gray-800 mb-3">
            书籍照片 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square">
                <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {images.length < 6 && (
              <button
                type="button"
                onClick={handleImageUpload}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-colors"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs">添加</span>
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">最多上传6张照片</p>
        </div>

        {/* Book Title */}
        <div className="bg-white rounded-2xl p-4">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            书名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="请输入书名"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Author */}
        <div className="bg-white rounded-2xl p-4">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            作者 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="请输入作者"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Subject */}
        <div className="bg-white rounded-2xl p-4">
          <label className="block text-sm font-bold text-gray-800 mb-3">
            科目分类 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setFormData({ ...formData, subject: category.name })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.subject === category.name
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className="text-2xl mb-1">{category.emoji}</div>
                <div className="text-xs text-gray-700">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div className="bg-white rounded-2xl p-4">
          <label className="block text-sm font-bold text-gray-800 mb-3">
            新旧程度 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["全新", "几乎全新", "良好", "一般"].map((condition) => (
              <button
                key={condition}
                type="button"
                onClick={() => setFormData({ ...formData, condition })}
                className={`py-3 rounded-xl border-2 font-medium transition-all ${
                  formData.condition === condition
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 text-gray-700 hover:border-purple-300"
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>

        {/* Prices */}
        <div className="bg-white rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                原价 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  required
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                出售价 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            描述信息 <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="请描述书籍的使用情况、是否有笔记等..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-20">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            立即上架
          </button>
          <p className="text-center text-sm text-gray-500 mt-3">
            上架后将在审核通过后展示给其他同学
          </p>
        </div>
      </form>
    </div>
  );
}
