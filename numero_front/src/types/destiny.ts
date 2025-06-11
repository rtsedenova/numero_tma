export interface FamousPerson {
  name: string;
  birth_date: string;
  image_url: string;
  description: string;
}

export interface DestinyNumberData {
  title: string;
  description: string;
  strong_points: string[];
  weak_points: string[];
  recommendations: string[];
  famous_people: FamousPerson[];
}

export interface DestinyNumberCalculation {
  destinyNumber: string;
  steps: string[];
}

export interface DestinyNumberResponse {
  [key: string]: DestinyNumberData;
} 