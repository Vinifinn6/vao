
import React, { useState, useMemo } from 'react';
import { Article } from '../types';
import ArticleCard from './ArticleCard';
import { PlusCircle, Search, X, TrendingUp, Newspaper } from 'lucide-react';

interface FeedProps {
  articles: Article[];
  onArticleClick: (id: string) => void;
  onNewArticle: () => void;
  onDeleteArticle?: (id: string) => void;
}

const Feed: React.FC<FeedProps> = ({ articles, onArticleClick, onNewArticle, onDeleteArticle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(a => a.tags.forEach(t => tags.add(t)));
    return Array.from(tags).slice(0, 10);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    let filtered = [...articles]; // Cópia para garantir estabilidade
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.subtitle.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    if (activeTag) {
      filtered = filtered.filter(a => a.tags.includes(activeTag));
    }
    return filtered;
  }, [articles, searchQuery, activeTag]);

  // Função interna para lidar com a exclusão e impedir que o card seja clicado
  const handleInternalDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteArticle) {
      onDeleteArticle(id);
    }
  };

  const breakingNewsContent = articles.slice(0, 5).map(a => `• ${a.title} • `).join(' ') + ` BEM-VINDO AO VAO: O SEU JORNAL INDEPENDENTE • EDIÇÃO ${new Date().getFullYear()} • `;

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex items-center justify-center mb-10 text-slate-100 dark:text-slate-800 shadow-2xl">
          <Newspaper size={48} />
        </div>
        <h2 className="font-serif text-4xl font-black mb-6 dark:text-white tracking-tighter">O jornal aguarda sua voz.</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-12 font-medium leading-relaxed italic">
          Nenhuma matéria no arquivo. O VAO é um espaço em branco pronto para ser preenchido por você.
        </p>
        <button
          onClick={onNewArticle}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-none"
        >
          <PlusCircle size={20} />
          Começar uma matéria
        </button>
      </div>
    );
  }

  const featured = filteredArticles[0];
  const others = filteredArticles.slice(1);

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Premium Breaking News Ticker */}
      <div className="relative h-12 bg-slate-900 dark:bg-slate-900 rounded-2xl overflow-hidden flex items-center shadow-2xl border border-slate-800">
        <div className="absolute left-0 top-0 bottom-0 z-10 bg-red-600 px-6 flex items-center gap-3 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
          <TrendingUp size={16} className="text-white animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-tighter text-white">Plantão</span>
        </div>
        
        <div className="flex-1 overflow-hidden ml-32 relative">
          <div className="flex w-max animate-[marquee_40s_linear_infinite]">
            <p className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.1em] text-slate-300 px-4">
              {breakingNewsContent}
            </p>
            {/* Duplicate content for seamless loop */}
            <p className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.1em] text-slate-300 px-4">
              {breakingNewsContent}
            </p>
          </div>
        </div>
      </div>

      <header className="border-b border-slate-200 dark:border-slate-800 pb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-5xl md:text-7xl font-black tracking-tighter mb-4 dark:text-white">
              Edição de Hoje
            </h1>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
              <p className="text-slate-400 uppercase tracking-[0.5em] text-[10px] font-black">
                {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTag(null)}
              className={`text-[10px] px-5 py-2 rounded-full border transition-all font-black tracking-widest ${!activeTag ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xl scale-105' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-400 dark:hover:border-slate-600'}`}
            >
              TODAS
            </button>
            {allTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`text-[10px] px-5 py-2 rounded-full border transition-all font-black tracking-widest ${tag === activeTag ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xl scale-105' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-400 dark:hover:border-slate-600'}`}
              >
                {tag.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Pesquisar no arquivo VAO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-14 py-5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] text-xs font-bold focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 outline-none transition-all shadow-sm placeholder:text-slate-300 dark:text-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      {filteredArticles.length === 0 ? (
        <div className="py-32 text-center bg-white dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-900/50 animate-in fade-in">
          <p className="text-slate-400 font-serif italic text-2xl">Nada foi encontrado nos vácuos do arquivo.</p>
          <button onClick={() => {setSearchQuery(''); setActiveTag(null)}} className="mt-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white pb-1 hover:opacity-70 transition-opacity">Limpar busca</button>
        </div>
      ) : (
        <>
          {featured && (
            <section 
              className="relative group cursor-pointer overflow-hidden rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-none hover:border-slate-300 dark:hover:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-none"
              onClick={() => onArticleClick(featured.id)}
            >
              {/* Botão de Excluir Robusto para Featured */}
              <button 
                onClick={(e) => handleInternalDelete(e, featured.id)}
                className="absolute top-8 right-8 z-40 p-4 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-90 border-4 border-white dark:border-slate-900"
                title="Apagar Matéria"
              >
                <X size={24} strokeWidth={3} />
              </button>

              <div className="grid lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 h-[400px] md:h-[600px] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={featured.mainImage} alt={featured.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                </div>
                <div className="lg:col-span-5 p-12 md:p-16 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-8">
                    {featured.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase font-black tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-1.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tighter dark:text-white text-slate-900 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xl mb-10 line-clamp-3 italic font-medium leading-relaxed">
                    {featured.subtitle}
                  </p>
                  <div className="mt-auto flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-2xl shadow-xl">
                      {featured.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-base font-black dark:text-white uppercase tracking-tighter">{featured.author.name}</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest italic">{featured.author.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {others.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  onClick={() => onArticleClick(article.id)} 
                  onDelete={(e) => handleInternalDelete(e, article.id)}
                />
              ))}
            </section>
          )}
        </>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Feed;
