import { ResultsDerivedCardItem } from "@/components/site/parts/ResultsDerivedCard/types";

export interface MainSectionContent {
  title: {
    lineDecoration: string;
    line: string;
  };
  buttonText?: string;
  description?: string;
  imageUrl: string;
  imageBrand?: string;
}

export interface FeaturesSectionContent {
  title: string;
  description: string;
  imageUrl: string;
  featuresSection?: {
    title?: string;
    description?: string;
    features?: FeaturesContent[];
  };
}

export interface FeaturesContent {
  title: string;
  icon: string;
}

export interface CoachingSectionContent {
  title: string;
  description: string;
  features?: FeaturesContent[];
}

export interface ResultsDerivedCardProps {
  card: ResultsDerivedCardItem;
}

export interface CultureOfWellnessSectionContent {
  title: string;
  description: string;
  cardsTitle: string;
  features?: FeaturesContent[];
}
