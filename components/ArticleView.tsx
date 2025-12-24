
import React, { useState, useMemo, useEffect } from 'react';
import { Article } from '../types';
import { ArrowLeft, Share2, Bookmark, MoreHorizontal, Edit3, Check, Trash2, Printer, Eye, Quote } from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack, onEdit, onDelete }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareFeedback, setShowShareFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simula um carregamento de dados para efeito visual
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [article.id]);

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.subtitle,
      url: window.location.origin + window.location.pathname,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else throw new Error();
    } catch {
      navigator.clipboard.writeText(shareData.url);
      setShowShareFeedback(true);
      setTimeout(() => setShowShareFeedback(false), 2000);
    }
  };

  const handleInternalDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  const readTime = useMemo(() => {
    const text = article.blocks.filter(b => b.type === 'text' || b.type === 'quote').map(b => b.content).join(' ');
    const words = text.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [article.blocks]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-16 flex justify-between">
          <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>
        <div className="space-y-6 mb-12">
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-16 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-16 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-24 w-full bg-slate-100 dark:bg-slate-900 rounded-2xl mt-8"></div>
        </div>
        
        {/* Author Skeleton */}
        <div className="flex items-center gap-4 mb-16 py-8 border-y border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-3xl bg-slate-200 dark:bg-slate-800"></div>
          <div className="space-y-2 flex-1">
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 rounded-[3rem] mb-12"></div>

        {/* Text Skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 print:max-w-none">
      <div className="flex items-center justify-between mb-16 print:hidden">
        <button onClick={onBack} className="flex items-center gap-3 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all group">
          <div className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:scale-110 transition-transform"><ArrowLeft size={18} /></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Retornar</span>
        </button>
        
        <div className="flex items-center gap-3">
          <button onClick={onEdit} className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-105 transition-all tracking-widest shadow-xl">
            <Edit3 size={14} /> EDITAR
          </button>
          
          <button 
            onClick={handleInternalDelete}
            className="p-2.5 rounded-full text-red-500 bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 hover:bg-red-500 hover:text-white transition-all shadow-lg"
            title="Excluir Matéria"
          >
            <Trash2 size={18} />
          </button>
          
          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-2"></div>

          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><Printer size={20}/></button>
            <button onClick={handleShare} className={`p-2 rounded-xl transition-colors ${showShareFeedback ? 'text-green-500 bg-green-50' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{showShareFeedback ? <Check size={20}/> : <Share2 size={20}/>}</button>
            <button onClick={() => setIsBookmarked(!isBookmarked)} className={`p-2 rounded-xl transition-colors ${isBookmarked ? 'text-blue-500 bg-blue-50' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} /></button>
          </div>
        </div>
      </div>

      <header className="mb-20">
        <div className="flex flex-wrap gap-3 mb-10">
          {article.tags.map(tag => (
            <span key={tag} className="text-[10px] font-black uppercase tracking-[0.3em] bg-red-600 text-white px-3 py-1 rounded-sm">{tag}</span>
          ))}
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl font-black mb-8 leading-[1.05] tracking-tighter dark:text-white text-slate-900">
          {article.title}
        </h1>
        
        <p className="text-2xl md:text-3xl text-slate-500 dark:text-slate-400 font-medium mb-12 leading-relaxed italic border-l-4 border-slate-200 dark:border-slate-800 pl-8">
          {article.subtitle}
        </p>

        <div className="flex flex-col md:flex-row md:items-center justify-between py-10 border-y border-slate-100 dark:border-slate-900 mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-2xl shadow-2xl">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Redigido por</p>
              <p className="text-xl font-black dark:text-white uppercase tracking-tighter">{article.author.name}</p>
              <p className="text-sm text-slate-500 italic">{article.author.bio}</p>
            </div>
          </div>
          <div className="flex flex-col md:items-end">
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
               <span className="flex items-center gap-1.5"><Eye size={12}/> {Math.floor(Math.random() * 1000) + 100}</span>
               <span>•</span>
               <span>{readTime} MIN LEITURA</span>
            </div>
            <p className="text-sm font-bold dark:text-slate-400">
              {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(article.updatedAt || article.createdAt))}
            </p>
          </div>
        </div>
      </header>

      {/* Main Image */}
      <div className="mb-20 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] bg-slate-100 dark:bg-slate-900">
        <img src={article.mainImage} className="w-full h-auto object-cover max-h-[700px] hover:scale-105 transition-transform duration-1000" alt={article.title} />
      </div>

      {/* Article Content with Alignment support */}
      <div className="space-y-12 pb-32">
        {article.blocks.map((block) => (
          <div key={block.id} className="clearfix">
            {block.type === 'text' ? (
              <div 
                className={`prose prose-slate dark:prose-invert max-w-none text-xl md:text-2xl leading-[1.7] text-slate-800 dark:text-slate-200 ${block.font || 'font-sans'} 
                  first-letter:text-7xl first-letter:font-serif first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-slate-900 dark:first-letter:text-white
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-bold
                `}
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            ) : block.type === 'quote' ? (
              <div className="py-16 border-y-2 border-slate-900 dark:border-white my-16 text-center">
                <blockquote className="font-serif text-4xl md:text-5xl font-black italic text-slate-900 dark:text-white mb-6 leading-tight">
                  "{block.content}"
                </blockquote>
                {block.caption && (
                  <cite className="text-xs font-black uppercase tracking-[0.5em] text-slate-400 block">— {block.caption}</cite>
                )}
              </div>
            ) : (
              <figure 
                className={`my-12 transition-all overflow-hidden ${
                  block.size === 'small' ? 'w-full md:w-1/3' : 
                  block.size === 'medium' ? 'w-full md:w-2/3' : 
                  'w-full'
                } ${
                  block.alignment === 'left' ? 'md:float-left md:mr-10 md:mb-8' : 
                  block.alignment === 'right' ? 'md:float-right md:ml-10 md:mb-8' : 
                  'mx-auto block clear-both'
                }`}
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-50 dark:bg-slate-800">
                  <img src={block.content} className="w-full h-auto" alt={block.caption} />
                </div>
                {block.caption && (
                  <figcaption className="mt-4 text-center text-xs font-black uppercase tracking-widest text-slate-400 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        ))}
      </div>

      <div className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="inline-block p-6 rounded-[2rem] bg-slate-100 dark:bg-slate-900 mb-6 group cursor-pointer hover:bg-slate-200 transition-colors">
          <MoreHorizontal className="text-slate-400 group-hover:rotate-90 transition-transform" />
        </div>
        <p className="text-slate-300 dark:text-slate-700 text-[11px] font-black italic tracking-[0.8em] uppercase">FIM DA EDIÇÃO • VAO ARCHIVE</p>
      </div>

      <style>{`
        .clearfix::after {
          content: "";
          clear: both;
          display: table;
        }
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </article>
  );
};

export default ArticleView;
