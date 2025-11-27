export interface Celebrity {
  name: string;
  birth_date: string;
  description: string;
  image_url: string;
}

export interface CelebrityCardProps {
  celebrity: Celebrity;
}

export const CelebrityCard = ({ celebrity }: CelebrityCardProps) => {
  return (
    <div className="bg-gradient-to-br from-purple-500/15 to-indigo-500/10 p-5 rounded-xl border border-violet-300/30">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={`/prediction_mini_app/${celebrity.image_url}`}
            alt={celebrity.name}
            className="w-16 h-16 rounded-2xl object-cover shadow-md"
            onError={(e) => {
              e.currentTarget.src = "/assets/application.png";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-purple-100 font-bold text-base mb-1 group-hover:text-purple-50 transition-colors duration-200">
            {celebrity.name}
          </h4>
          <p className="text-violet-200/80 text-sm mb-2 font-medium">
            {celebrity.birth_date}
          </p>
          <p className="text-violet-100 text-sm leading-relaxed line-clamp-2 group-hover:text-violet-50 transition-colors duration-200">
            {celebrity.description}
          </p>
        </div>
      </div>
    </div>
  );
};
