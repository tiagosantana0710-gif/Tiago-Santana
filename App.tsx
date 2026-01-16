
import React, { useState, useEffect, useRef } from 'react';
import { AppView, Prayer, Rosary, JournalEntry } from './types';
import { PRAYERS, ROSARIES, getLiturgicalColorInfo } from './constants';
import { getDailyLiturgyInfo, getPrayerReflection, generateAppIcon, generateSupportIcon, generatePrayerAudio } from './services/geminiService';
import Navigation from './components/Navigation';
import { 
  ChevronRight, ChevronLeft, Quote, Sparkles, BookOpen, 
  Star, User, Calendar as CalendarIcon, Plus, Trash2, Save, History, 
  NotebookPen, Heart, Shield, Church, Menu, X, Info, Share2, Settings,
  Download, Rocket, Image as ImageIcon, CheckCircle, Share, Award,
  Gift, HandHeart, Volume2, VolumeX, PlayCircle, Loader2, Copy, Check
} from 'lucide-react';

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

// Helper functions for audio decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [selectedRosary, setSelectedRosary] = useState<Rosary | null>(null);
  const [dailyLiturgy, setDailyLiturgy] = useState<any>(null);
  const [calendarDateInfo, setCalendarDateInfo] = useState<any>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(new Date().getDate());
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);
  const [isLoadingLiturgy, setIsLoadingLiturgy] = useState(true);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Icon States
  const [appIcon, setAppIcon] = useState<string | null>(localStorage.getItem('app_icon'));
  const [supportIcon, setSupportIcon] = useState<string | null>(localStorage.getItem('support_icon'));
  const [isGeneratingIcon, setIsGeneratingIcon] = useState(false);

  // Journal State
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchLiturgy = async () => {
      setIsLoadingLiturgy(true);
      const info = await getDailyLiturgyInfo();
      setDailyLiturgy(info);
      setCalendarDateInfo(info);
      setIsLoadingLiturgy(false);
    };
    fetchLiturgy();

    const loadSupportIcon = async () => {
      if (!supportIcon) {
        const icon = await generateSupportIcon();
        if (icon) {
          setSupportIcon(icon);
          localStorage.setItem('support_icon', icon);
        }
      }
    };
    loadSupportIcon();

    const savedEntries = localStorage.getItem('prayer_journal');
    if (savedEntries) {
      setJournalEntries(JSON.parse(savedEntries));
    }

    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const playPrayerAudio = async () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    if (!selectedPrayer) return;

    setIsLoadingAudio(true);
    const base64Audio = await generatePrayerAudio(selectedPrayer.content);
    
    if (!base64Audio) {
      setIsLoadingAudio(false);
      alert("Desculpe, não foi possível gerar o áudio no momento.");
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        setIsPlayingAudio(false);
        audioSourceRef.current = null;
      };

      audioSourceRef.current = source;
      source.start();
      setIsPlayingAudio(true);
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleNavigate = (view: AppView) => {
    stopAudio();
    setCurrentView(view);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = async () => {
    if (!selectedPrayer) return;
    try {
      await navigator.clipboard.writeText(`${selectedPrayer.title}\n\n${selectedPrayer.content}\n\nEnviado por Fé e Oração (Tiago Santana)`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const handleShare = async () => {
    let shareData = {
      title: 'Fé e Oração - Por Tiago Santana',
      text: 'Confira este conteúdo inspirador do app Fé e Oração, desenvolvido por Tiago Santana.',
      url: window.location.href
    };

    if (currentView === AppView.PRAYER_DETAIL && selectedPrayer) {
      shareData = {
        title: selectedPrayer.title,
        text: `🙏 *${selectedPrayer.title}*\n\n${selectedPrayer.content}\n\n_Enviado pelo app Fé e Oração (Tiago Santana)_`,
        url: window.location.href
      };
    } else if (currentView === AppView.ROSARY_GUIDE && selectedRosary) {
      shareData = {
        title: selectedRosary.title,
        text: `📿 *${selectedRosary.title}*\n\n${selectedRosary.description}\n\nVamos rezar juntos? _App Fé e Oração - Por Tiago Santana_`,
        url: window.location.href
      };
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        alert('Conteúdo copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  };

  const handleCreateIcon = async () => {
    setIsGeneratingIcon(true);
    const icon = await generateAppIcon();
    if (icon) {
      setAppIcon(icon);
      localStorage.setItem('app_icon', icon);
    }
    setIsGeneratingIcon(false);
  };

  const handleSupportClick = () => {
    alert("Obrigado pelo seu interesse em apoiar! Esta funcionalidade de doação está sendo preparada com muito carinho por Tiago Santana. Em breve você poderá contribuir para a manutenção desta obra.");
  };

  const handleDateClick = async (day: number) => {
    setSelectedCalendarDate(day);
    setIsLoadingCalendar(true);
    const date = new Date();
    date.setDate(day);
    const info = await getDailyLiturgyInfo(date.toLocaleDateString('pt-BR'));
    setCalendarDateInfo(info);
    setIsLoadingCalendar(false);
  };

  const openPrayer = async (prayer: Prayer) => {
    setSelectedPrayer(prayer);
    setCurrentView(AppView.PRAYER_DETAIL);
    setIsLoadingReflection(true);
    setAiReflection(null);
    const reflection = await getPrayerReflection(prayer.title);
    setAiReflection(reflection);
    setIsLoadingReflection(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRosary = (rosary: Rosary) => {
    setSelectedRosary(rosary);
    setCurrentView(AppView.ROSARY_GUIDE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveEntry = () => {
    if (!newEntry.content.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      title: newEntry.title || 'Reflexão Espiritual',
      content: newEntry.content,
    };
    const updated = [entry, ...journalEntries];
    setJournalEntries(updated);
    localStorage.setItem('prayer_journal', JSON.stringify(updated));
    setNewEntry({ title: '', content: '' });
    setIsAddingEntry(false);
  };

  const deleteEntry = (id: string) => {
    const updated = journalEntries.filter(e => e.id !== id);
    setJournalEntries(updated);
    localStorage.setItem('prayer_journal', JSON.stringify(updated));
  };

  const categories = Array.from(new Set(PRAYERS.map(p => p.category)));

  const renderTopBar = (title: string, showBack = false, backTo = AppView.HOME, showShare = false) => (
    <div className="px-6 py-5 flex items-center justify-between sticky top-0 z-30 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-amber-50/50">
      <div className="w-10">
        {showBack ? (
          <button onClick={() => handleNavigate(backTo)} className="p-2 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <ChevronLeft size={20} className="text-gray-800" />
          </button>
        ) : (
          <button onClick={() => setIsDrawerOpen(true)} className="p-2 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <Menu size={20} className="text-gray-800" />
          </button>
        )}
      </div>
      <h2 className="font-cinzel text-xs font-bold tracking-[0.2em] text-gray-500 uppercase flex-1 text-center truncate px-2">{title}</h2>
      <div className="w-10 flex justify-end">
        {showShare && (
          <button onClick={handleShare} className="p-2 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform text-purple-700">
            <Share2 size={20} />
          </button>
        )}
      </div>
    </div>
  );

  const renderSupportCard = (isMini = false) => (
    <div className={`bg-gradient-to-br from-white to-amber-50 rounded-3xl border border-amber-100 shadow-sm overflow-hidden ${isMini ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center gap-4">
        <div className={`${isMini ? 'w-12 h-12' : 'w-16 h-16'} rounded-2xl overflow-hidden bg-white shadow-md border border-amber-100 flex-shrink-0`}>
          {supportIcon ? (
            <img src={supportIcon} className="w-full h-full object-cover" alt="Gratitude" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-amber-300">
              <Gift size={isMini ? 20 : 24} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className={`${isMini ? 'text-[10px]' : 'text-xs'} font-bold text-amber-700 uppercase tracking-widest mb-1`}>Apoie o Projeto</p>
          <p className={`${isMini ? 'text-[11px]' : 'text-[13px]'} text-gray-500 leading-snug italic font-serif`}>
            Ajude Tiago Santana a manter esta obra ativa e gratuita.
          </p>
        </div>
      </div>
      <button 
        onClick={handleSupportClick}
        className={`w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-200 active:scale-95 flex items-center justify-center gap-2 ${isMini ? 'py-2.5 text-[10px]' : 'py-3.5 text-xs'}`}
      >
        <HandHeart size={isMini ? 14 : 16} /> Contribuir com a Missão
      </button>
    </div>
  );

  const renderDrawer = () => (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsDrawerOpen(false)}
      />
      <div className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] shadow-2xl transition-transform duration-500 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} rounded-r-[3rem] overflow-hidden`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <Church className="text-purple-700" size={24} />
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-400">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6">
            <div className="mb-8">
              <h3 className="font-cinzel text-xl font-bold text-gray-800 leading-none">Fé e Oração</h3>
              <p className="text-[10px] text-purple-700 font-bold uppercase tracking-widest mt-1">Por Tiago Santana</p>
            </div>

            <button onClick={() => handleNavigate(AppView.HOME)} className="w-full flex items-center gap-4 text-gray-600 font-medium hover:text-purple-700 transition-colors p-2 rounded-xl hover:bg-purple-50 text-left">
              <User size={20} /> Perfil do Fiel
            </button>
            <button onClick={() => handleNavigate(AppView.ABOUT)} className="w-full flex items-center gap-4 text-gray-600 font-medium hover:text-purple-700 transition-colors p-2 rounded-xl hover:bg-purple-50 text-left">
              <Rocket size={20} /> Painel de Lançamento
            </button>
            <button onClick={handleShare} className="w-full flex items-center gap-4 text-gray-600 font-medium hover:text-purple-700 transition-colors p-2 rounded-xl hover:bg-purple-50 text-left">
              <Share2 size={20} /> Compartilhar App
            </button>

            <div className="pt-4">
              {renderSupportCard()}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 mt-auto">
            <div className="bg-amber-50 p-6 rounded-3xl mb-4">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2">Mensagem do Dia</p>
              <p className="text-xs text-amber-900/70 italic font-serif leading-relaxed">
                "A oração é a chave que abre o coração de Deus."
              </p>
            </div>
            <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest text-center">
              © 2025 • Tiago Santana Dev
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const renderAbout = () => (
    <div className="animate-fade-in pb-32">
      {renderTopBar("Lançamento")}
      <div className="px-6 space-y-8 mt-6">
        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-amber-50 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-purple-600 to-amber-400" />
          <div className="w-40 h-40 mx-auto bg-gray-100 rounded-[2.5rem] mb-6 overflow-hidden flex items-center justify-center shadow-inner relative group border-4 border-amber-50">
            {isGeneratingIcon ? (
              <div className="flex flex-col items-center gap-2">
                <Sparkles className="text-purple-500 animate-pulse" size={32} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">IA Criando...</span>
              </div>
            ) : appIcon ? (
              <img src={appIcon} className="w-full h-full object-cover animate-fade-in" alt="App Icon" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="text-gray-200" size={64} />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Nenhum Ícone</span>
              </div>
            )}
          </div>
          
          <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">Fé e Oração</h3>
          <p className="text-gray-500 text-sm mb-2 leading-relaxed px-4">
            A identidade visual sagrada representa a essência de nossa jornada espiritual.
          </p>
          <div className="flex flex-col items-center gap-1 mb-8">
            <span className="text-purple-700 text-[10px] font-bold uppercase tracking-[0.3em]">Versão 1.0.0 "Gold"</span>
            <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Autor: Tiago Santana</span>
          </div>
          
          <button 
            onClick={handleCreateIcon}
            disabled={isGeneratingIcon}
            className="w-full bg-[#4c1d95] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-95 transition-transform"
          >
            <Sparkles size={18} /> {appIcon ? "Gerar Novo Ícone Sagrado" : "Gerar Ícone Oficial com IA"}
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="font-cinzel text-xs text-gray-400 font-bold uppercase tracking-[0.2em] px-2">Monitor de Publicação</h4>
          <div className="space-y-3">
            {[
              { label: 'Google Play Store', status: 'Build Verificada', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { label: 'Apple App Store', status: 'Aguardando Revisão', icon: History, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Website PWA', status: 'Publicado e Ativo', icon: Rocket, color: 'text-purple-500', bg: 'bg-purple-50' }
            ].map((store, i) => (
              <div key={i} className="bg-white p-5 rounded-[2rem] flex items-center justify-between border border-gray-50 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${store.bg} ${store.color}`}>
                    <store.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{store.label}</p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{store.status}</p>
                  </div>
                </div>
                {appIcon && (
                  <button className="text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors">
                    <Download size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-900 text-white p-8 rounded-[2.5rem] border border-indigo-100 flex items-center gap-6 shadow-xl relative overflow-hidden">
          <Award className="absolute -right-4 -top-4 text-white/5" size={120} />
          <div className="p-3 bg-white/10 rounded-2xl text-white shadow-sm relative z-10">
            <Award size={24} />
          </div>
          <div className="relative z-10">
            <h5 className="font-bold text-sm mb-1">Nota do Desenvolvedor</h5>
            <p className="text-xs text-indigo-100/80 leading-relaxed italic">
              "Que este aplicativo seja uma ferramenta de luz na sua vida. Desenvolvido com dedicação por Tiago Santana."
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="animate-fade-in space-y-8 pb-32">
      {renderTopBar("Bem-vindo")}
      
      <div className="px-6 relative">
        <div className="relative h-64 flex items-center justify-center overflow-hidden rounded-[3rem] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6]" />
          <img 
            src="https://images.unsplash.com/photo-1548625361-195fe61a55c3?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
            alt="Altar background"
          />
          <div className="relative text-center px-8">
            <h1 className="font-cinzel text-3xl text-white font-bold tracking-tight mb-2">Fé e Oração</h1>
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.3em] mb-4">Por Tiago Santana</p>
            <div className="h-px w-12 bg-amber-400/50 mx-auto mb-4" />
            <p className="text-amber-100 font-serif italic text-lg leading-tight">"Jesus, eu confio em Vós"</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-purple-900/5 border border-amber-50 active:scale-[0.98] transition-transform cursor-pointer" onClick={() => handleNavigate(AppView.CALENDAR)}>
          {isLoadingLiturgy ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-24 h-5 rounded-full" />
                <Skeleton className="w-20 h-4" />
              </div>
              <Skeleton className="w-3/4 h-8" />
              <div className="space-y-2 border-l-2 border-gray-100 pl-4 py-1">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${dailyLiturgy ? getLiturgicalColorInfo(dailyLiturgy.cor).bg + ' ' + getLiturgicalColorInfo(dailyLiturgy.cor).text : 'bg-emerald-100 text-emerald-800'}`}>
                  {dailyLiturgy?.tempo || 'Tempo Comum'}
                </div>
                <span className="text-[10px] font-bold text-gray-300">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
              <h2 className="font-serif text-2xl text-gray-800 mb-2 leading-tight">{dailyLiturgy?.santo || 'Santo do Dia'}</h2>
              <p className="text-gray-500 text-sm leading-relaxed italic border-l-2 border-amber-200 pl-4 py-1">
                "{dailyLiturgy?.mensagem || 'A oração é o alimento da alma e o motor da vida cristã.'}"
              </p>
            </>
          )}
        </div>
      </div>

      <div className="px-6 grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleNavigate(AppView.JOURNAL)}
          className="bg-white p-6 rounded-[2.5rem] flex flex-col items-center gap-3 text-emerald-700 shadow-sm border border-emerald-50 hover:bg-emerald-50 transition-all active:scale-95"
        >
          <div className="p-3 bg-emerald-100 rounded-2xl">
            <History size={24} />
          </div>
          <span className="font-bold text-[10px] uppercase tracking-wider">Meu Diário</span>
        </button>
        <button 
           onClick={() => handleNavigate(AppView.PRAYERS)}
          className="bg-white p-6 rounded-[2.5rem] flex flex-col items-center gap-3 text-amber-700 shadow-sm border border-amber-50 hover:bg-amber-50 transition-all active:scale-95"
        >
          <div className="p-3 bg-amber-100 rounded-2xl">
            <BookOpen size={24} />
          </div>
          <span className="font-bold text-[10px] uppercase tracking-wider">Orações</span>
        </button>
      </div>

      <div className="px-6 space-y-4">
        <h3 className="font-cinzel text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">Destaque da Fé</h3>
        <div 
          onClick={() => openPrayer(PRAYERS.find(p => p.id === 'sao-miguel')!)}
          className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] text-white rounded-[2.5rem] p-8 shadow-xl shadow-indigo-900/20 cursor-pointer flex items-center justify-between group overflow-hidden relative active:scale-[0.98] transition-transform"
        >
          <div className="relative z-10">
            <Shield className="text-amber-500 mb-3" size={32} />
            <h4 className="font-serif text-2xl mb-1">São Miguel Arcanjo</h4>
            <p className="text-indigo-200 text-xs font-medium">Defesa e Proteção Espiritual</p>
          </div>
          <ChevronRight size={24} className="text-white/30" />
        </div>
      </div>

      {/* Footer Support Section */}
      <div className="px-6 pt-4 pb-12">
        {renderSupportCard(true)}
        <div className="flex flex-col items-center gap-2 opacity-40 mt-8">
          <div className="h-px w-8 bg-gray-300" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Desenvolvido por Tiago Santana</p>
        </div>
      </div>
    </div>
  );

  const renderPrayers = () => (
    <div className="animate-fade-in pb-32">
      {renderTopBar("Oratório")}
      <div className="px-6 mt-4 space-y-10">
        {categories.map(cat => (
          <div key={cat} className="space-y-4">
            <h3 className="font-cinzel text-[10px] text-amber-600 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="h-px w-6 bg-amber-200" /> {cat}
            </h3>
            <div className="space-y-3">
              {PRAYERS.filter(p => p.category === cat).map(prayer => (
                <button
                  key={prayer.id}
                  onClick={() => openPrayer(prayer)}
                  className="w-full bg-white px-6 py-5 rounded-[2rem] flex items-center justify-between shadow-sm border border-amber-50/50 hover:shadow-md active:translate-x-1 transition-all text-left"
                >
                  <h4 className="font-serif text-lg text-gray-800 font-medium">{prayer.title}</h4>
                  <ChevronRight size={18} className="text-amber-300" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrayerDetail = () => (
    <div className="animate-fade-in pb-32">
      {renderTopBar(selectedPrayer?.title || "Oração", true, AppView.PRAYERS, true)}
      
      <div className="p-6 space-y-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-purple-900/5 border border-amber-50 relative">
          <Quote className="absolute top-4 left-6 opacity-5 text-purple-900" size={60} />
          
          <div className="absolute top-4 right-6 flex gap-2">
            <button 
              onClick={handleCopy}
              className={`p-3 rounded-2xl shadow-sm border transition-all active:scale-90 ${isCopied ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
              title="Copiar Texto"
            >
              {isCopied ? <Check size={20} /> : <Copy size={20} />}
            </button>
            <button 
              onClick={playPrayerAudio}
              disabled={isLoadingAudio}
              className={`p-3 rounded-2xl shadow-sm border transition-all active:scale-90 ${isPlayingAudio ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-amber-50 border-amber-100 text-amber-700'}`}
              title={isPlayingAudio ? "Parar" : "Ouvir Oração"}
            >
              {isLoadingAudio ? <Loader2 className="animate-spin" size={20} /> : (isPlayingAudio ? <VolumeX size={20} /> : <Volume2 size={20} />)}
            </button>
          </div>

          <p className="font-serif text-2xl leading-relaxed text-gray-800 italic text-center relative z-10 mt-10">
            {selectedPrayer?.content}
          </p>
          
          {isPlayingAudio && (
            <div className="mt-8 flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className={`w-1.5 bg-purple-300 rounded-full animate-pulse`} style={{ height: `${Math.random() * 25 + 10}px`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-[2.5rem] border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-blue-600" />
            <h4 className="font-cinzel text-[10px] font-bold text-blue-800 uppercase tracking-[0.2em]">Luz do Espírito</h4>
          </div>
          {isLoadingReflection ? (
            <div className="space-y-2 py-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-5/6 h-4" />
              <Skeleton className="w-4/5 h-4" />
            </div>
          ) : (
            <p className="text-[15px] text-blue-900/80 leading-relaxed italic font-serif">{aiReflection}</p>
          )}
        </div>
        
        <div className="flex flex-col items-center gap-2 pt-4 opacity-30">
          <div className="h-px w-12 bg-gray-300" />
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em]">Fé e Oração • Tiago Santana</p>
        </div>
      </div>
    </div>
  );

  const renderJournal = () => (
    <div className="animate-fade-in p-6 pb-32">
      {renderTopBar("Meu Diário")}
      <div className="flex justify-between items-center mb-10 mt-6 px-2">
        <div>
          <h2 className="font-cinzel text-2xl text-gray-800 font-bold">Reflexões</h2>
          <p className="text-purple-700 text-[10px] font-bold uppercase tracking-[0.3em]">Por Tiago Santana</p>
        </div>
        {!isAddingEntry && (
          <button onClick={() => setIsAddingEntry(true)} className="bg-[#4c1d95] text-white p-4 rounded-[2rem] shadow-xl shadow-purple-200 active:scale-90 transition-transform">
            <Plus size={24} />
          </button>
        )}
      </div>

      {isAddingEntry && (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-purple-100 mb-10 scale-up">
          <input 
            type="text"
            placeholder="Título da sua reflexão..."
            className="w-full mb-6 font-serif text-xl border-b border-gray-100 focus:border-purple-400 outline-none pb-2 transition-colors"
            value={newEntry.title}
            onChange={e => setNewEntry({...newEntry, title: e.target.value})}
          />
          <textarea 
            placeholder="Abra seu coração a Deus..."
            className="w-full min-h-[150px] font-serif italic text-gray-600 focus:outline-none mb-8 text-lg"
            value={newEntry.content}
            onChange={e => setNewEntry({...newEntry, content: e.target.value})}
          />
          <div className="flex gap-3">
            <button onClick={saveEntry} className="flex-1 bg-[#4c1d95] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
              <Save size={18} /> Guardar Reflexão
            </button>
            <button onClick={() => setIsAddingEntry(false)} className="px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold active:scale-95">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {journalEntries.length === 0 && !isAddingEntry && (
          <div className="text-center py-20 opacity-30 italic font-serif">Nenhuma reflexão guardada ainda...</div>
        )}
        {journalEntries.map(entry => (
          <div key={entry.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-amber-50 relative group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{entry.date}</span>
              <button onClick={() => deleteEntry(entry.id)} className="p-2 text-gray-200 hover:text-rose-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <h4 className="font-serif font-bold text-gray-800 text-xl mb-3 leading-tight">{entry.title}</h4>
            <p className="text-[15px] text-gray-500 italic leading-relaxed whitespace-pre-line">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRosaries = () => (
    <div className="animate-fade-in pb-32">
      {renderTopBar("Terços")}
      <div className="px-6 space-y-8 mt-6">
        {ROSARIES.map((rosary) => (
          <div 
            key={rosary.id}
            onClick={() => openRosary(rosary)}
            className="group relative overflow-hidden rounded-[2.5rem] shadow-lg cursor-pointer aspect-[1.5/1] bg-white active:scale-[0.98] transition-all"
          >
            <img src={rosary.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={rosary.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-8 flex flex-col justify-end">
              <h3 className="font-serif text-2xl text-white font-bold mb-1">{rosary.title}</h3>
              <p className="text-white/70 text-xs font-medium">{rosary.description}</p>
            </div>
          </div>
        ))}
        
        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pt-6 pb-12">
          Guia Ilustrado • Tiago Santana Dev
        </p>
      </div>
    </div>
  );

  const renderRosaryGuide = () => (
    <div className="animate-fade-in pb-32">
      {renderTopBar(selectedRosary?.title || "Guia do Terço", true, AppView.ROSARIES, true)}
      <div className="relative h-64 overflow-hidden rounded-b-[3rem] shadow-2xl">
        <img src={selectedRosary?.image} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-black/40 to-black/20" />
        <div className="absolute bottom-6 left-8">
           <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Guia Autor: Tiago Santana</p>
        </div>
      </div>

      <div className="px-6 space-y-8 mt-6">
        {selectedRosary?.steps.map((step, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex gap-6 relative">
            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-bold text-lg shadow-lg">
              {idx + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-serif text-lg font-bold text-gray-800 mb-2">{step.title}</h4>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{step.description}</p>
              {step.prayer && (
                <div className="p-6 bg-amber-50 rounded-3xl text-gray-700 font-serif italic text-lg border-l-4 border-amber-400">
                  {step.prayer}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalendar = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentMonthName = today.toLocaleDateString('pt-BR', { month: 'long' });
    
    return (
      <div className="animate-fade-in pb-32">
        {renderTopBar("Liturgia Diária")}
        <div className="px-6 mt-6">
          <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-purple-900/5 border border-amber-50 mb-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-serif font-bold text-gray-800 capitalize">{currentMonthName}</h3>
              <CalendarIcon className="text-amber-600 opacity-20" size={32} />
            </div>
            <div className="grid grid-cols-7 gap-3 mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-gray-300 uppercase">{d}</div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = day === selectedCalendarDate;
                const isToday = day === today.getDate();
                return (
                  <button 
                    key={i} 
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-bold transition-all relative ${
                      isSelected ? 'bg-purple-700 text-white shadow-xl scale-110' : 'text-gray-400 hover:bg-gray-50'
                    } ${isToday && !isSelected ? 'border-2 border-purple-200' : ''}`}
                  >
                    {day}
                    {isToday && !isSelected && <div className="absolute bottom-1 w-1 h-1 bg-purple-400 rounded-full" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`transition-all duration-300`}>
            <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-amber-50 relative overflow-hidden">
              {isLoadingCalendar ? (
                <div className="space-y-4">
                  <Skeleton className="w-24 h-5 rounded-full" />
                  <Skeleton className="w-3/4 h-8" />
                  <Skeleton className="w-full h-16" />
                </div>
              ) : (
                <>
                  {calendarDateInfo && (
                    <div className={`absolute top-0 right-0 w-2 h-full ${getLiturgicalColorInfo(calendarDateInfo.cor).bg}`} />
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${calendarDateInfo ? getLiturgicalColorInfo(calendarDateInfo.cor).bg + ' ' + getLiturgicalColorInfo(calendarDateInfo.cor).text : 'bg-gray-100'}`}>
                      {calendarDateInfo?.tempo || 'Carregando...'}
                    </div>
                  </div>

                  <h4 className="font-serif text-2xl font-bold text-gray-800 mb-2 leading-tight">
                    {calendarDateInfo?.santo}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed italic mb-6">
                    "{calendarDateInfo?.mensagem}"
                  </p>
                </>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                  <Sparkles size={14} /> Guia Gemini
                </div>
                <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Dev: Tiago Santana</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders the current view content based on state.
   */
  const renderContent = () => {
    switch (currentView) {
      case AppView.HOME:
        return renderHome();
      case AppView.PRAYERS:
        return renderPrayers();
      case AppView.PRAYER_DETAIL:
        return renderPrayerDetail();
      case AppView.ROSARIES:
        return renderRosaries();
      case AppView.ROSARY_GUIDE:
        return renderRosaryGuide();
      case AppView.CALENDAR:
        return renderCalendar();
      case AppView.JOURNAL:
        return renderJournal();
      case AppView.ABOUT:
        return renderAbout();
      default:
        return renderHome();
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDFBF7] relative shadow-2xl overflow-x-hidden no-scrollbar">
      {renderDrawer()}
      <main className="transition-all duration-300">
        {renderContent()}
      </main>
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scale-up {
          animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        body {
          overscroll-behavior-y: contain;
          -webkit-tap-highlight-color: transparent;
        }
        .shadow-purple-200 {
          box-shadow: 0 10px 25px -5px rgba(126, 34, 206, 0.2);
        }
        .shadow-amber-200 {
          box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.3);
        }
      `}</style>
    </div>
  );
};

export default App;
