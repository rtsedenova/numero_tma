import { FC, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { backButton } from "@telegram-apps/sdk-react";
import { Page } from "@/components/Page";
import type { TarotDrawResponse, TarotCategory } from "@/types/tarot";

export const TarotResultPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<TarotDrawResponse["result"] | null>(null);
  const [category, setCategory] = useState<TarotCategory | null>(null);

  useEffect(() => {
    const state = location.state as {
      result?: TarotDrawResponse["result"];
      category?: TarotCategory | null;
    } | null;

    if (state?.result) {
      setResult(state.result);
      setCategory(state.category || null);
    } else {
      navigate("/tarot", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    backButton.show();
    return backButton.onClick(() => {
      navigate("/tarot", { replace: true });
    });
  }, [navigate]);

  if (!result) {
    return (
      <Page back={false}>
        <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
          <div style={{ color: 'var(--text)' }}>Загрузка...</div>
        </div>
      </Page>
    );
  }

  const imgSrc = result.card.image_key || result.card.image;

  const getYesNoStyles = () => {
    if (result.yesno_score > 0) {
      return {
        background: 'var(--yesno-yes-bg)',
        color: 'var(--yesno-yes-text)',
      };
    } else if (result.yesno_score < 0) {
      return {
        background: 'var(--yesno-no-bg)',
        color: 'var(--yesno-no-text)',
      };
    } else {
      return {
        background: 'var(--yesno-neutral-bg)',
        color: 'var(--yesno-neutral-text)',
      };
    }
  };

  return (
    <Page back={false}>
      <div 
        className="page tarot-result-page fixed inset-0 overflow-y-auto"
        style={{ background: 'var(--bg)', color: 'var(--text)' }}
      >
        <div className="max-w-3xl mx-auto px-4 md:px-6 pb-20 pt-6">

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {imgSrc && (
              <div className="flex-shrink-0">
                <div
                  className="w-[200px] h-[353px] rounded-xl overflow-hidden shadow-2xl"
                  style={{
                    transform: result.orientation === "reversed" ? "rotate(180deg)" : "none",
                    borderColor: 'var(--border)',
                    borderWidth: '3px',
                    borderStyle: 'solid',
                  }}
                >
                  <img
                    src={`/prediction_mini_app/${imgSrc}`}
                    alt={result.card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="flex-1">
              <div 
                className="text-lg md:text-xl font-medium uppercase tracking-wider mb-2"
                style={{ color: 'var(--text-subtle)' }}
              >
                Ваша карта
              </div>

              <h1 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: 'var(--text)' }}
              >
                {result.card.name}
              </h1>

              {result.orientation === "reversed" && (
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-4"
                  style={{
                    background: 'var(--infobox-bg)',
                    color: 'var(--text-subtle)',
                  }}
                >
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

              <div className="flex items-center gap-3 mt-4">
                <div 
                  className="text-md md:text-lg font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Да/Нет:
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                  style={getYesNoStyles()}
                >
                  {result.yesno_score > 0
                    ? "✓ Скорее Да"
                    : result.yesno_score < 0
                    ? "✗ Скорее Нет"
                    : "~ Нейтрально"}
                  <span className="text-xs opacity-70">({result.yesno_score})</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="mt-8 rounded-2xl p-6 md:p-8"
            style={{
              background: 'var(--el-bg)',
              borderColor: 'var(--border)',
              borderWidth: '1px',
              borderStyle: 'solid',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--border)',
            }}
          >
            <h2 
              className="text-xl md:text-2xl font-semibold mb-4"
              style={{ color: 'var(--text)' }}
            >
              Общее значение
            </h2>
            <p 
              className="leading-relaxed text-base md:text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              {result.text.general}
            </p>
          </div>

          {result.text.by_category && category && (
            <div 
              className="mt-6 rounded-2xl p-6 md:p-8"
              style={{
                background: 'var(--infobox-bg)',
                borderColor: 'var(--border)',
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--border)',
              }}
            >
              <h2 
                className="text-xl md:text-2xl font-semibold mb-4"
                style={{ color: 'var(--text)' }}
              >
                {category === "love" && "💖 Значение для любви и отношений"}
                {category === "finance" && "💸 Значение для финансов и работы"}
                {category === "health" && "🌿 Значение для здоровья"}
                {category === "future" && "🔮 Значение для будущего"}
                {category === "yesno" && "Ответ на ваш вопрос"}
              </h2>
              <p 
                className="leading-relaxed text-base md:text-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                {result.text.by_category}
              </p>
            </div>
          )}

          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate("/tarot", { replace: true })}
              className="
                inline-flex items-center gap-2 px-6 py-2 rounded-full
                [background-image:var(--gradient-bg)]
                transition-all duration-300 ease-out
                hover:[background-image:var(--gradient-bg-hover)]
                whitespace-nowrap
              "
            >
              <span className="text-sm md:text-base font-medium text-[var(--button-text)]">
                Вытянуть ещё карту
              </span>
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
};
