
import React from 'react';
import { Article } from '../types';
import { Clock, Trash2, ArrowUpRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, onDelete }) => {
  const calculateReadTime = () => {
    const text = article.blocks.filter(b => b.type === 'text' || b.type === 'quote').map(b => b.content).join(' ');
    const words = text.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  return (
    <article 
      className="group relative cursor-pointer flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-3 hover:border-slate-300 dark:hover:border-slate-700 shadow-xl shadow-slate-100 dark:shadow-none"
      onClick={onClick}
    >
      {onDelete && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Previne que o card seja clicado
            onDelete(e);
          }}
          className="absolute top-5 right-5 z-30 p-3 rounded-full bg-white/95 dark:bg-slate-800/95 text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl hover:bg-red-600 hover:text-white active:scale-90 border border-slate-100 dark:border-slate-700"
          title="Apagar Matéria"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      )}

      <div className="h-64 overflow-hidden relative">
        <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors z-10"></div>
        <img 
          src={article.mainImage} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white/30 backdrop-blur-xl p-3 rounded-2xl border border-white/40 text-white translate-y-4 group-hover:translate-y-0">
          <ArrowUpRight size={24} strokeWidth={3} />
        </div>
      </div>
      
      <div className="p-10 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] uppercase font-black tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-500 border border-slate-100 dark:border-slate-700">
                {tag}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
            <Clock size={12} className="text-slate-300" /> {calculateReadTime()} MIN
          </span>
        </div>
        
        <h3 className="font-serif text-2xl font-black mb-4 leading-tight group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors line-clamp-2 dark:text-white text-slate-900">
          {article.title}
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 text-base mb-8 line-clamp-2 italic font-medium leading-relaxed">
          {article.subtitle}
        </p>
        
        <div className="mt-auto pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-sm font-black shadow-lg">
              {article.author.name.charAt(0)}
            </div>
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">{article.author.name}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">
            {new Date(article.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
