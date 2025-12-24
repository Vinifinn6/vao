
import React, { useState, useRef, useMemo } from 'react';
import { Article, ContentBlock, BlockType, FontType, AlignmentType, SizeType } from '../types';
import { 
  X, Image as ImageIcon, Text as TextIcon, Bold, Italic, Underline, Link as LinkIcon,
  Trash2, ArrowUp, ArrowDown, Tag, User, Save, Type, Quote,
  AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

interface ArticleFormProps {
  initialData?: Article | null;
  onPublish: (article: Article) => void;
  onCancel: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ initialData, onPublish, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(', ') || '');
  const [mainImage, setMainImage] = useState(initialData?.mainImage || '');
  const [authorName, setAuthorName] = useState(initialData?.author.name || '');
  const [authorBio, setAuthorBio] = useState(initialData?.author.bio || '');
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialData?.blocks || []);
  const [isPublishing, setIsPublishing] = useState(false);

  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const wordCount = useMemo(() => {
    const text = blocks.filter(b => b.type === 'text' || b.type === 'quote').map(b => b.content).join(' ');
    const cleaned = text.replace(/<[^>]*>/g, '').trim();
    return cleaned ? cleaned.split(/\s+/).length : 0;
  }, [blocks]);

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
      caption: type === 'image' || type === 'quote' ? '' : undefined,
      font: type === 'text' ? 'font-sans' : undefined,
      alignment: type === 'image' ? 'center' : undefined,
      size: type === 'image' ? 'large' : undefined
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(prev => prev.map(block => block.id === id ? { ...block, ...updates } : block));
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateBlock(id, { content: result });
    };
    reader.readAsDataURL(file);
  };

  const handleMainImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setMainImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !authorName) {
      alert('Por favor, preencha pelo menos o título e o autor.');
      return;
    }
    
    setIsPublishing(true);
    
    const article: Article = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      title,
      subtitle,
      mainImage: mainImage || 'https://picsum.photos/1200/600',
      tags: tagsInput.split(',').map(t => t.trim()).filter(t => t !== ''),
      author: {
        name: authorName,
        bio: authorBio
      },
      blocks,
      createdAt: initialData?.createdAt || Date.now()
    };

    setTimeout(() => {
      onPublish(article);
      setIsPublishing(false);
    }, 800);
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value || '');
  };

  // Função robusta para adicionar link preservando a seleção
  const addLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Salva a seleção atual antes que o prompt roube o foco
    const range = selection.getRangeAt(0);

    const url = prompt('Insira o link (URL) para vincular à palavra:');
    
    if (url) {
      // Restaura a seleção
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Executa o comando
      formatText('createLink', url);
    }
  };

  const fonts: { value: FontType; label: string }[] = [
    { value: 'font-sans', label: 'Sans Serif' },
    { value: 'font-serif', label: 'Playfair (Serif)' },
    { value: 'font-mono', label: 'Monospace' },
    { value: 'font-display', label: 'Display' }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-black dark:text-white text-slate-900">{initialData ? 'Editar Matéria' : 'Redação'}</h1>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{wordCount} PALAVRAS</span>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-32">
        {/* Header Section */}
        <section className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Título da Matéria..." 
              className="w-full bg-transparent font-serif text-4xl md:text-6xl font-black border-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-800 dark:text-white text-slate-900 leading-tight"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <textarea 
              placeholder="Subtítulo ou resumo breve da notícia..." 
              className="w-full bg-transparent text-xl md:text-2xl text-slate-500 dark:text-slate-400 border-none focus:ring-0 resize-none h-24 placeholder:text-slate-200 dark:placeholder:text-slate-800 leading-relaxed font-medium italic"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8 pt-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors focus-within:border-slate-300 dark:focus-within:border-slate-600">
                <Tag size={18} />
                <input 
                  type="text" 
                  placeholder="Tags (Ex: Política, Esportes)" 
                  className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest flex-1 dark:text-white text-slate-700"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors focus-within:border-slate-300 dark:focus-within:border-slate-600">
                <User size={18} />
                <div className="flex flex-col flex-1">
                  <input 
                    type="text" 
                    placeholder="Nome do Autor" 
                    className="bg-transparent border-none focus:ring-0 text-sm font-black dark:text-white text-slate-900"
                    value={authorName}
                    onChange={e => setAuthorName(e.target.value)}
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Aposto (Ex: Repórter Internacional)" 
                    className="bg-transparent border-none focus:ring-0 text-[10px] italic font-bold uppercase tracking-widest dark:text-slate-500 text-slate-400"
                    value={authorBio}
                    onChange={e => setAuthorBio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div 
              className="w-full md:w-72 h-48 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center relative overflow-hidden group border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer hover:border-slate-400 transition-all"
              onClick={() => mainImageInputRef.current?.click()}
            >
              {mainImage ? (
                <img src={mainImage} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Principal" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-3 text-slate-300" size={40} />
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Foto de Capa</span>
                </div>
              )}
              <input 
                type="file" 
                ref={mainImageInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={e => e.target.files && handleMainImageUpload(e.target.files[0])}
              />
            </div>
          </div>
        </section>

        {/* Content Blocks */}
        <div className="space-y-10">
          <div className="flex items-center gap-6 text-slate-200 dark:text-slate-800">
            <div className="h-px flex-1 bg-current"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Corpo do Texto</span>
            <div className="h-px flex-1 bg-current"></div>
          </div>

          <div className="space-y-8">
            {blocks.map((block, index) => (
              <div key={block.id} className="group relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 transition-all hover:border-slate-400 dark:hover:border-slate-600 shadow-sm">
                <div className="absolute -right-16 top-0 opacity-0 group-hover:opacity-100 flex flex-col gap-2 transition-opacity hidden lg:flex">
                  <button type="button" onClick={() => moveBlock(index, 'up')} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:scale-110 transition-transform"><ArrowUp size={16}/></button>
                  <button type="button" onClick={() => moveBlock(index, 'down')} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:scale-110 transition-transform"><ArrowDown size={16}/></button>
                  <button type="button" onClick={() => removeBlock(block.id)} className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                </div>

                {block.type === 'text' ? (
                  <div className="space-y-4">
                    {/* Barra de Ferramentas de Texto (Fonts, Bold, Italic, Underline, Link) */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-50 dark:border-slate-800 flex-wrap">
                      <div className="flex gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); formatText('bold'); }} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-white" title="Negrito"><Bold size={18}/></button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); formatText('italic'); }} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-white" title="Itálico"><Italic size={18}/></button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); formatText('underline'); }} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-white" title="Sublinhado"><Underline size={18}/></button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); addLink(); }} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-white text-blue-500" title="Inserir Link"><LinkIcon size={18}/></button>
                      </div>
                      
                      <div className="h-6 w-px bg-slate-100 dark:bg-slate-800"></div>

                      <div className="flex items-center gap-3">
                        <Type size={16} className="text-slate-400" />
                        <select 
                          className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer dark:text-white text-slate-900 border-none focus:ring-0"
                          value={block.font}
                          onChange={(e) => updateBlock(block.id, { font: e.target.value as FontType })}
                        >
                          {fonts.map(f => (
                            <option key={f.value} value={f.value} className="bg-white dark:bg-slate-900">{f.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div 
                      contentEditable
                      className={`min-h-[120px] outline-none prose dark:prose-invert max-w-none text-xl leading-relaxed dark:text-white text-slate-800 ${block.font === 'font-display' ? 'font-serif tracking-tight font-bold' : block.font || 'font-sans'}`}
                      onBlur={e => updateBlock(block.id, { content: e.currentTarget.innerHTML })}
                      dangerouslySetInnerHTML={{ __html: block.content }}
                    />
                    {!block.content && <p className="absolute top-28 left-8 text-slate-200 dark:text-slate-800 pointer-events-none italic font-serif text-2xl">O que aconteceu hoje...</p>}
                  </div>
                ) : block.type === 'quote' ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <Quote size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Destaque de Frase</span>
                    </div>
                    <textarea 
                      placeholder="Insira a frase de impacto aqui..." 
                      className="w-full bg-transparent font-serif text-3xl italic border-none focus:ring-0 resize-none p-0 dark:text-white text-slate-900 leading-tight"
                      value={block.content}
                      onChange={e => updateBlock(block.id, { content: e.target.value })}
                    />
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-slate-300 uppercase">AUTOR:</span>
                       <input 
                        type="text" 
                        placeholder="Nome da pessoa" 
                        className="bg-transparent border-b border-slate-100 dark:border-slate-800 focus:border-slate-400 focus:ring-0 text-sm font-black dark:text-slate-400 text-slate-600 flex-1"
                        value={block.caption || ''}
                        onChange={e => updateBlock(block.id, { caption: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Barra de Ferramentas de Imagem (Alinhamento e Tamanho) */}
                    <div className="flex items-center justify-between mb-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => updateBlock(block.id, { alignment: 'left' })} className={`p-2 rounded-lg transition-colors ${block.alignment === 'left' ? 'bg-slate-900 text-white' : 'hover:bg-slate-200 dark:text-slate-400'}`} title="Alinhar à Esquerda"><AlignLeft size={16}/></button>
                          <button type="button" onClick={() => updateBlock(block.id, { alignment: 'center' })} className={`p-2 rounded-lg transition-colors ${block.alignment === 'center' ? 'bg-slate-900 text-white' : 'hover:bg-slate-200 dark:text-slate-400'}`} title="Centralizar"><AlignCenter size={16}/></button>
                          <button type="button" onClick={() => updateBlock(block.id, { alignment: 'right' })} className={`p-2 rounded-lg transition-colors ${block.alignment === 'right' ? 'bg-slate-900 text-white' : 'hover:bg-slate-200 dark:text-slate-400'}`} title="Alinhar à Direita"><AlignRight size={16}/></button>
                        </div>
                        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => updateBlock(block.id, { size: 'small' })} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${block.size === 'small' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-700 dark:text-slate-300'}`}>P</button>
                          <button type="button" onClick={() => updateBlock(block.id, { size: 'medium' })} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${block.size === 'medium' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-700 dark:text-slate-300'}`}>M</button>
                          <button type="button" onClick={() => updateBlock(block.id, { size: 'large' })} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${block.size === 'large' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-700 dark:text-slate-300'}`}>G</button>
                        </div>
                      </div>

                    <div 
                      className={`relative mx-auto bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden flex items-center justify-center relative group/img cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-slate-400 transition-all
                        ${block.size === 'small' ? 'w-1/3' : block.size === 'medium' ? 'w-2/3' : 'w-full'} 
                        ${block.alignment === 'left' ? 'mr-auto ml-0' : block.alignment === 'right' ? 'ml-auto mr-0' : 'mx-auto'}
                      `}
                      onClick={() => { const input = document.getElementById(`img-input-${block.id}`); input?.click(); }}
                    >
                      {block.content ? (
                        <>
                          <img src={block.content} className="w-full h-auto object-contain" alt="Bloco"/>
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                            <span className="text-white text-[10px] font-black uppercase tracking-widest bg-white/10 px-6 py-3 rounded-full border border-white/20">Trocar Foto</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <ImageIcon className="mx-auto mb-3 text-slate-200" size={50} />
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Inserir Fotografia</span>
                        </div>
                      )}
                      <input 
                        id={`img-input-${block.id}`}
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={e => e.target.files && handleImageUpload(block.id, e.target.files[0])}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-slate-300 uppercase">LEGENDA:</span>
                       <input 
                        type="text" 
                        placeholder="Descreva a imagem..." 
                        className="w-full bg-transparent border-b border-slate-100 dark:border-slate-800 focus:border-slate-400 focus:ring-0 text-sm italic font-medium dark:text-slate-400 text-slate-500"
                        value={block.caption || ''}
                        onChange={e => updateBlock(block.id, { caption: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 py-12">
            <button type="button" onClick={() => addBlock('text')} className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-xl hover:shadow-blue-500/10 active:scale-95">
              <TextIcon size={18} className="text-blue-500 group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Parágrafo</span>
            </button>
            <button type="button" onClick={() => addBlock('quote')} className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all shadow-xl hover:shadow-purple-500/10 active:scale-95">
              <Quote size={18} className="text-purple-500 group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Citação</span>
            </button>
            <button type="button" onClick={() => addBlock('image')} className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-xl hover:shadow-emerald-500/10 active:scale-95">
              <ImageIcon size={18} className="text-emerald-500 group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Imagem</span>
            </button>
          </div>
        </div>

        {/* Floating Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 p-6 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button type="button" onClick={onCancel} className="px-8 py-3 rounded-full text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors">Cancelar</button>
            <button type="submit" disabled={isPublishing} className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all">
              <Save size={20} />
              {isPublishing ? 'Salvando...' : initialData ? 'Salvar Edição' : 'Publicar Matéria'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
