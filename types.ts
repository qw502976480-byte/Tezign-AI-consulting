export type ContentBlock = 
  | { type: 'h2'; content: string }
  | { type: 'h3'; content: string }
  | { type: 'p'; content: string }
  | { type: 'image'; src: string; caption?: string; alt: string }
  | { type: 'quote'; content: string; author?: string }
  | { type: 'metrics'; items: { label: string; value: string; sub?: string }[] };

export type LibraryItemType = 'case' | 'report' | 'methodology' | 'announcement';

export interface LibraryItem {
  slug: string;
  type: LibraryItemType;
  title: string;
  subtitle: string;
  readTime: string;
  updatedAt: string;
  coverImageUrl: string;
  contentBlocks: ContentBlock[];
  tags: string[];
  // Optional specific fields
  clientIntro?: string; // For cases
  audioData?: { // For pre-generated audio
    en: string;
    cn: string;
  };
}

export interface UserAccess {
  hasAccess: boolean;
  name?: string;
  email?: string;
  interests?: string[];
}