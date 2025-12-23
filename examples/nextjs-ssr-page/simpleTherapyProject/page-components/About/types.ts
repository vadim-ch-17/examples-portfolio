export interface AboutProps {
  sudTitle?: string;
  "title-desk": {
    "lineDecoration-1": string;
    "lineDecoration-2": string;
  };
  "description-1-desk": string;
  "description-2-desk": string;
  "title-mob": {
    "lineDecoration-1": string;
    "lineDecoration-2": string;
  };
  "description-1-mob": string;
  "description-2-mob": string;
  imageUrl: string;
}

export interface OurStoryProps {
  title: string;
  "description-line-1": string;
  "description-line-2": string;
  imageUrl: string;
}

export interface OurApproachProps {
  title: string;
  description: string;
  items: OurApproachItems[];
}

export interface OurApproachItems {
  icon: string;
  title: string;
  description: string;
}

export interface OurTeamProps {
  title: string;
  titleDecor: string;
  description: string;
  teamMembers: OurTeamMembers[];
}

export interface OurTeamMembers {
  title: string;
  members: Members[];
}

export interface Members {
  name: string;
  position: string;
  avatar: string;
}

export interface CaringSectionProps {
  title: string;
  description: string;
  imageUrl: string;
}
