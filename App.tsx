
import React, { useState, useEffect, useCallback } from 'react';
import { Article, View } from './types';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import ArticleForm from './components/ArticleForm';
import ArticleView from './components/ArticleView';

const App: React.FC = () => {
  const [view, setView] = useState<View>('feed');
  // Inicialização preguiçosa (Lazy init) para garantir leitura correta
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('vao_articles');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erro ao carregar artigos", e);
      return [];
    }
  });
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('vao_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vao_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Remover o useEffect de sync automático para evitar condições de corrida na deleção
  // A persistência será manual nas funções de ação (HandlePublish, HandleDelete)

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const navigateTo = useCallback((newView: View, articleId?: string) => {
    setView(newView);
    if (articleId) {
      setSelectedArticleId(articleId);
    } else {
      if (newView === 'feed') setSelectedArticleId(null);
      setEditingArticle(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setView('editor');
  };

  const handleDelete = (id: string) => {
    // 1. Confirmação
    if (!window.confirm('ATENÇÃO: Deseja apagar esta publicação permanentemente?')) {
      return;
    }

    // 2. Cálculo da nova lista
    const newArticlesList = articles.filter(a => a.id !== id);

    // 3. Persistência IMEDIATA (Crítico para funcionar)
    localStorage.setItem('vao_articles', JSON.stringify(newArticlesList));
    
    // 4. Atualização do Estado
    setArticles(newArticlesList);

    // 5. Redirecionamento forçado
    if (selectedArticleId === id || view === 'article') {
      setSelectedArticleId(null);
      setEditingArticle(null);
      setView('feed');
    }
    
    // 6. Feedback visual (scroll para topo)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublish = (article: Article) => {
    let newArticlesList: Article[];
    
    const existingIndex = articles.findIndex(a => a.id === article.id);
    if (existingIndex !== -1) {
      newArticlesList = [...articles];
      newArticlesList[existingIndex] = { ...article, updatedAt: Date.now() };
    } else {
      newArticlesList = [article, ...articles];
    }

    // Persistência Imediata
    localStorage.setItem('vao_articles', JSON.stringify(newArticlesList));
    setArticles(newArticlesList);
    
    setEditingArticle(null);
    setView('feed');
  };

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500 selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900">
      <Navbar 
        onNavigate={navigateTo} 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={toggleDarkMode} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        {view === 'feed' && (
          <Feed 
            articles={articles} 
            onArticleClick={(id) => navigateTo('article', id)} 
            onNewArticle={() => navigateTo('editor')}
            onDeleteArticle={handleDelete}
          />
        )}
        
        {view === 'editor' && (
          <ArticleForm 
            initialData={editingArticle}
            onPublish={handlePublish} 
            onCancel={() => navigateTo('feed')} 
          />
        )}
        
        {view === 'article' && selectedArticle && (
          <ArticleView 
            article={selectedArticle} 
            onBack={() => navigateTo('feed')} 
            onEdit={() => handleEdit(selectedArticle)}
            onDelete={() => handleDelete(selectedArticle.id)}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-900 py-20 mt-20 bg-white dark:bg-slate-950 print:hidden transition-colors">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-[1px] w-16 bg-slate-200 dark:bg-slate-800"></div>
            <h2 className="font-serif text-5xl font-black tracking-tighter dark:text-white text-slate-900">VAO</h2>
            <div className="h-[1px] w-16 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-12 font-medium leading-relaxed italic">
            "Explorando os vácuos da notícia." Plataforma editorial independente.
          </p>
          <div className="flex justify-center flex-wrap gap-10 mb-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-all">Redação</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-all">Arquivo</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-all">Termos</a>
          </div>
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black opacity-50">
            &copy; {new Date().getFullYear()} VAO • DIGITAL NEWS ARCHIVE
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
