
export type BlockType = 'text' | 'image' | 'quote';
export type FontType = 'font-sans' | 'font-serif' | 'font-mono' | 'font-display';
export type AlignmentType = 'left' | 'center' | 'right';
export type SizeType = 'small' | 'medium' | 'large';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string; // HTML para texto/citação, base64 para imagem
  caption?: string; // Para imagens ou autor da citação
  font?: FontType; // Para blocos de texto
  alignment?: AlignmentType; // Novo: Para imagens
  size?: SizeType; // Novo: Para imagens
}

export interface Author {
  name: string;
  bio: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  mainImage: string;
  tags: string[];
  author: Author;
  blocks: ContentBlock[];
  createdAt: number;
  updatedAt?: number;
}

export type View = 'feed' | 'editor' | 'article';
