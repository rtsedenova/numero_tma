import { type FC } from 'react';
import { type DestinyNumberData } from '@/types/destiny';

interface DestinyResultProps {
  result: DestinyNumberData;
}

export const DestinyResult: FC<DestinyResultProps> = ({ result }) => {
  if (!result?.title) {
    return null;
  }

  return (
    <div className="result-content">
      <h1>{result.title}</h1>
      <p>{result.description}</p>

      <div className="strong-weak-points">
        <h2>Сильные стороны:</h2>
        <ul>
          {result.strong_points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>

        <h2>Слабые стороны:</h2>
        <ul>
          {result.weak_points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      <div className="recommendations">
        <h2>Рекомендации:</h2>
        <ul>
          {result.recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>

      <div className="famous-people">
        <h2>Известные личности:</h2>
        <ul>
          {result.famous_people.map((person, index) => (
            <li key={index}>
              <img
                src={`/prediction_mini_app/${person.image_url}`}
                alt={person.name}
              />
              <div>
                <h3>{person.name}</h3>
                <p>{person.birth_date}</p>
                <p>{person.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 