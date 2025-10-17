// src/pages/tarot-result.page.tsx
import { FC, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Page } from "@/components/Page";
import { imageUrl, TarotDrawResponse } from "@/config/api";

export const TarotResultPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<TarotDrawResponse["result"] | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    // Получаем результат из state роутера
    const state = location.state as { 
      result?: TarotDrawResponse["result"];
      category?: string | null;
    } | null;
    if (state?.result) {
      setResult(state.result);
      setCategory(state.category || null);
    } else {
      // Если нет результата, редиректим обратно
      navigate("/tarot", { replace: true });
    }
  }, [location, navigate]);

  if (!result) {
    return (
      <Page>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Загрузка...</div>
        </div>
      </Page>
    );
  }

  const imgSrc = imageUrl(result.card.image_key || result.card.image);

  return (
    <Page>
      <div className="page tarot-result-page fixed inset-0 bg-gradient-to-b from-[#301d42] via-[#2a1838] to-[#1f0f2e] text-white overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
          {/* Кнопка "Назад" */}
          <button
            onClick={() => navigate("/tarot")}
            className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Вернуться к колесу
          </button>

          {/* Карта и основная информация */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Изображение карты */}
              {imgSrc && (
                <div className="flex-shrink-0">
                  <div
                    className="w-[200px] h-[353px] rounded-xl overflow-hidden shadow-2xl border border-white/20"
                    style={{
                      transform: result.orientation === 'reversed' ? 'rotate(180deg)' : 'none',
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={result.card.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Информация о карте */}
              <div className="flex-1">
                <div className="text-sm uppercase tracking-wider text-purple-300 mb-2">
                  Ваша карта
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {result.card.name}
                </h1>
                {result.orientation === "reversed" && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-300 mb-4">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Перевёрнутая позиция
                  </div>
                )}

                {/* Yes/No Score */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="text-sm text-white/60">Да/Нет:</div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                    result.yesno_score > 0
                      ? 'bg-green-500/20 text-green-300'
                      : result.yesno_score < 0
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {result.yesno_score > 0 ? '✓ Скорее Да' : result.yesno_score < 0 ? '✗ Скорее Нет' : '~ Нейтрально'}
                    <span className="text-xs opacity-70">({result.yesno_score})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Общее значение */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3 text-purple-300">
              Общее значение
            </h2>
            <p className="text-white/90 leading-relaxed text-lg">
              {result.text.general}
            </p>
          </div>

          {/* Значение по категории */}
          {result.text.by_category && category && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-3 text-purple-300">
                {category === 'love' && '💖 Значение для любви и отношений'}
                {category === 'finance' && '💰 Значение для финансов и работы'}
                {category === 'health' && '🌿 Значение для здоровья'}
                {category === 'future' && '🔮 Значение для будущего'}
                {category === 'yesno' && 'Ответ на ваш вопрос'}
              </h2>
              <p className="text-white/90 leading-relaxed text-lg">
                {result.text.by_category}
              </p>
            </div>
          )}

          {/* Кнопка "Вытянуть ещё карту" */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate("/tarot")}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Вытянуть ещё карту
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
};

