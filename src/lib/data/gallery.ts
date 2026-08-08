export interface GalleryItem {
  title: string;
  category: string;
  src: string;
  description: string;
}

// Placeholder art — see public/images/gallery/README.md to swap in real photos.
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    title: "Training Sessions",
    category: "On the pitch",
    src: "/images/gallery/training.svg",
    description:
      "Structured, age-appropriate training every week — building technique, fitness, and confidence.",
  },
  {
    title: "Match Days",
    category: "Game time",
    src: "/images/gallery/matchday.svg",
    description:
      "Competitive matches across Western Victoria, coached with a focus on development over results.",
  },
  {
    title: "Team Spirit",
    category: "One academy",
    src: "/images/gallery/team-spirit.svg",
    description: "A culture built on respect, effort, and looking out for your teammates.",
  },
  {
    title: "Recovery & Rest",
    category: "Off the pitch",
    src: "/images/gallery/recovery.svg",
    description:
      "We track sleep and training load so every player gets the recovery they need to keep improving.",
  },
  {
    title: "Community & Family",
    category: "Beyond football",
    src: "/images/gallery/community.svg",
    description: "Parents, players, and coaches — a community that shows up for each other.",
  },
];
