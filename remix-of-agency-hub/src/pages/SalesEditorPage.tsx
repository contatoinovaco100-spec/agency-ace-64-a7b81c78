import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Save, Plus, Trash2, Eye, Sparkles, Settings, Check, 
  ArrowRight, BarChart3, Target, Star, Video, Camera, Zap, 
  Lightbulb, Globe, Shield, Play, ArrowUpRight, ChevronRight,
  Edit3, X, MousePointer2, Pencil, GripVertical, Type, Image as ImageIcon,
  Palette, Layout, Monitor, Copy, Layers, PaintBucket, Sun, Moon, Blend,
  Grid3X3, LayoutGrid, LayoutList, Columns, Square, Circle, Triangle,
  Loader2, Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';
import LogoInova from '@/assets/logo-inova.png';

/* ═══════ NICHE TEMPLATES ═══════ */
const NICHE_TEMPLATES: Record<string, any> = {
  restaurant: {
    theme: 'restaurant',
    hero: { title: "Seu restaurante pode estar cheio… mas invisível no digital.", tagline: "Transformamos restaurantes em marcas desejadas nas redes sociais.", badge: "INOVA PRODUÇÕES • 2026", cta: "BORÁ DIGITALIZAR 🚀" },
    strategy: { problem: "Hoje a maioria das pessoas escolhe onde comer pelo Instagram. Se o seu restaurante não aparece com conteúdo profissional, ele simplesmente não entra na decisão do cliente.", solution: "A Inova é uma produtora estratégica que cria conteúdos profissionais e posiciona seu restaurante para atrair mais clientes.", results: "Visibilidade Máxima, Mais Reservas, Autoridade Gastro", steps: "Diagnóstico, Planejamento, Captação, Edição, Entrega" },
    services: [
      { title: "Captação Gourmet", desc: "Filmagem 4K com foco em textura e experiência." }, { title: "Reels & Stories", desc: "Conteúdo otimizado para engajamento." },
      { title: "Copy Estratégica", desc: "Textos que vendem." }, { title: "Tráfego Pago", desc: "Anúncios para clientes locais." },
      { title: "Planejamento Mensal", desc: "Calendário editorial completo." }, { title: "Edição Profissional", desc: "Pós-produção cinematográfica." }
    ],
    plans: [
      { name: "Plano Start", price: "1500", features: ["6 vídeos/mês", "2 captações", "Copy estratégica", "Edição profissional"], popular: false },
      { name: "Plano Growth", price: "3500", features: ["12 vídeos/mês", "4 captações", "Funil de vendas", "Tráfego incluso", "Suporte VIP"], popular: true }
    ], whatsapp: "5562999999999"
  },
  personal: { theme: 'personal', hero: { title: "Seu treino transforma corpos. Nosso conteúdo transforma carreiras.", tagline: "Posicionamos personais como autoridade digital.", badge: "INOVA PRODUÇÕES • 2026", cta: "ESCALAR MINHA MARCA 💪" }, strategy: { problem: "Sem presença digital estratégica, você continua dependendo de indicação.", solution: "Conteúdo cinematográfico que posiciona você como referência.", results: "Autoridade, Mais Alunos, Ticket Maior", steps: "Diagnóstico, Planejamento, Filmagem, Edição, Entrega" }, services: [{ title: "Vídeos de Treino", desc: "Captação profissional." }, { title: "Branding Pessoal", desc: "Posicionamento visual." }, { title: "Funil de Captação", desc: "Converter seguidores em alunos." }, { title: "Stories Diários", desc: "Roteiros que engajam." }, { title: "Tráfego", desc: "Anúncios regionais." }, { title: "Conteúdo Educativo", desc: "Reels de dicas." }], plans: [{ name: "Plano Start", price: "1800", features: ["8 vídeos/mês", "2 captações", "Copy", "Edição"], popular: false }, { name: "Plano Elite", price: "4000", features: ["15 vídeos/mês", "4 captações", "Funil completo", "Tráfego", "Mentoria"], popular: true }], whatsapp: "5562999999999" },
  clinica: { theme: 'clinica', hero: { title: "Sua clínica oferece o melhor. Mas o digital não mostra isso.", tagline: "Posicionamos clínicas como referência premium.", badge: "INOVA PRODUÇÕES • 2026", cta: "POSICIONAR MINHA CLÍNICA ✨" }, strategy: { problem: "Pacientes escolhem clínicas pelo Instagram. Se não transmite confiança, você perde.", solution: "Conteúdos de luxo que atraem pacientes de alto padrão.", results: "Posicionamento Premium, Agendamentos, Ticket Alto", steps: "Diagnóstico, Planejamento, Captação, Edição, Entrega" }, services: [{ title: "Vídeos de Procedimento", desc: "Antes e depois elegante." }, { title: "Branding da Clínica", desc: "Sofisticação visual." }, { title: "Depoimentos", desc: "Prova social cinema." }, { title: "Reels Educativos", desc: "Tratamentos e resultados." }, { title: "Copy Médica", desc: "CFM compliance." }, { title: "Tráfego Premium", desc: "Pacientes qualificados." }], plans: [{ name: "Plano Essencial", price: "2500", features: ["8 vídeos/mês", "2 captações", "Copy", "Edição premium"], popular: false }, { name: "Plano VIP", price: "5500", features: ["16 vídeos/mês", "4 captações", "Funil agendamento", "Tráfego", "Reputação"], popular: true }], whatsapp: "5562999999999" },
  lawyer: { theme: 'lawyer', hero: { title: "Advocacia de excelência merece posicionamento de excelência.", tagline: "Autoridade digital para escritórios que querem dominar.", badge: "INOVA PRODUÇÕES • 2026", cta: "CONSTRUIR AUTORIDADE ⚖️" }, strategy: { problem: "Mercado jurídico saturado. Sem presença digital, você é mais um.", solution: "Posicionamos advogados como referência com conteúdo estratégico.", results: "Prestígio, Mais Clientes, Alto Valor", steps: "Diagnóstico, Planejamento, Captação, Edição, Entrega" }, services: [{ title: "Vídeos Educativos", desc: "Temas jurídicos." }, { title: "Posicionamento", desc: "Branding de autoridade." }, { title: "LinkedIn", desc: "Conteúdo profissional." }, { title: "Reels Informativos", desc: "Dicas que viralizam." }, { title: "Copy Jurídica", desc: "OAB compliance." }, { title: "Tráfego", desc: "Clientes ideais." }], plans: [{ name: "Plano Essencial", price: "2000", features: ["6 vídeos/mês", "2 captações", "Copy", "Edição"], popular: false }, { name: "Plano Autoridade", price: "4500", features: ["12 vídeos/mês", "4 captações", "Funil", "LinkedIn", "Consultoria"], popular: true }], whatsapp: "5562999999999" },
  realestate: { theme: 'realestate', hero: { title: "Imóveis extraordinários merecem apresentação à altura.", tagline: "Vídeos e fotos que vendem antes da visita.", badge: "INOVA PRODUÇÕES • 2026", cta: "VALORIZAR IMÓVEIS 🏠" }, strategy: { problem: "Fotos amadoras desvalorizam imóveis e afastam compradores.", solution: "Apresentações cinematográficas que valorizam e aceleram vendas.", results: "Imóveis Valorizados, Vendas Rápidas, Clientes Premium", steps: "Diagnóstico, Planejamento, Captação, Edição, Entrega" }, services: [{ title: "Tour Virtual", desc: "Vídeos imersivos." }, { title: "Fotos Pro", desc: "Cada ambiente valorizado." }, { title: "Drone", desc: "Captação aérea." }, { title: "Vídeos Ads", desc: "Otimizado para anúncios." }, { title: "Copy Imobiliária", desc: "Descrições que vendem." }, { title: "Tráfego", desc: "Compradores qualificados." }], plans: [{ name: "Plano Start", price: "2000", features: ["6 vídeos/mês", "Fotos pro", "Copy", "Edição"], popular: false }, { name: "Plano Destaque", price: "5000", features: ["12 vídeos/mês", "Drone", "Tour virtual", "Tráfego", "Portfólio"], popular: true }], whatsapp: "5562999999999" },
  studio: { theme: 'studio', hero: { title: "Produção audiovisual de alto impacto para marcas ambiciosas.", tagline: "Do conceito à entrega: narrativas que posicionam.", badge: "INOVA PRODUÇÕES • 2026", cta: "INICIAR PRODUÇÃO 🎬" }, strategy: { problem: "Freelancers geram inconsistência e perda de tempo.", solution: "Departamento criativo completo: planejamento, captação, edição e distribuição.", results: "Consistência, Qualidade Cinema, Escala", steps: "Briefing, Planejamento, Produção, Pós-produção, Entrega" }, services: [{ title: "Captação 4K", desc: "Equipamento cinema." }, { title: "Edição Cinema", desc: "Color grading elite." }, { title: "Motion Graphics", desc: "Animações." }, { title: "Roteirização", desc: "Roteiros estratégicos." }, { title: "Direção de Arte", desc: "Conceito visual." }, { title: "Distribuição", desc: "Multi-plataforma." }], plans: [{ name: "Plano Produção", price: "3000", features: ["8 vídeos/mês", "2 diárias", "Edição cinema", "Roteiros"], popular: false }, { name: "Plano Full Service", price: "6500", features: ["16 vídeos/mês", "4 diárias", "Motion", "Drone", "Direção", "Distribuição"], popular: true }], whatsapp: "5562999999999" },
  ecommerce: { theme: 'ecommerce', hero: { title: "Seu produto é incrível. Mas ninguém vai comprar o que não vê.", tagline: "Conteúdo visual que transforma cliques em compras e seguidores em clientes.", badge: "INOVA PRODUÇÕES • 2026", cta: "ESCALAR MINHAS VENDAS 🛒" }, strategy: { problem: "No e-commerce, a foto é a vitrine. Se seu produto não brilha no feed, ele perde para quem fotografa melhor.", solution: "Criamos conteúdos que fazem seu produto parecer irresistível e convertem visitantes em compradores.", results: "Mais Vendas, Conversão Alta, Marca Desejada", steps: "Diagnóstico, Planejamento, Shooting, Edição, Entrega" }, services: [{ title: "Fotos de Produto", desc: "Still life profissional com iluminação de estúdio." }, { title: "Vídeos Unboxing", desc: "Experiência visual que vende." }, { title: "Reels de Produto", desc: "Conteúdo viral para Instagram e TikTok." }, { title: "Copy de Vendas", desc: "Descrições persuasivas para cada produto." }, { title: "Tráfego para E-commerce", desc: "Anúncios otimizados para conversão." }, { title: "Catálogo Digital", desc: "Material visual para marketplace e site." }], plans: [{ name: "Plano Start", price: "1800", features: ["20 fotos/mês", "4 vídeos produto", "Copy de vendas", "Edição profissional"], popular: false }, { name: "Plano Scale", price: "4200", features: ["50 fotos/mês", "10 vídeos", "Reels virais", "Tráfego pago", "Catálogo digital", "Suporte VIP"], popular: true }], whatsapp: "5562999999999" },
  educacao: { theme: 'educacao', hero: { title: "Seu conhecimento muda vidas. Mas ele precisa alcançar mais pessoas.", tagline: "Posicionamos educadores e infoprodutores como autoridades digitais.", badge: "INOVA PRODUÇÕES • 2026", cta: "ESCALAR MEU CURSO 📚" }, strategy: { problem: "O mercado de cursos online está lotado. Sem conteúdo profissional, seu curso se perde na multidão.", solution: "Criamos uma máquina de conteúdo que posiciona você como a referência do seu nicho.", results: "Autoridade, Mais Alunos, Lançamentos Maiores", steps: "Diagnóstico, Planejamento, Gravação, Edição, Entrega" }, services: [{ title: "Gravação de Aulas", desc: "Captação profissional do seu curso." }, { title: "Conteúdo para Lançamento", desc: "Vídeos de vendas e depoimentos." }, { title: "Reels Educativos", desc: "Conteúdo viral de autoridade." }, { title: "Copy de Launch", desc: "Textos de lançamento que convertem." }, { title: "Tráfego para Infoproduto", desc: "Anúncios que geram inscrições." }, { title: "Design de Materiais", desc: "Thumbnails e criativos profissionais." }], plans: [{ name: "Plano Educador", price: "2200", features: ["8 vídeos/mês", "Gravação de aulas", "Copy estratégica", "Edição profissional"], popular: false }, { name: "Plano Lançamento", price: "5000", features: ["16 vídeos/mês", "Vídeo de vendas", "Funil completo", "Tráfego pago", "Criativos", "Consultoria"], popular: true }], whatsapp: "5562999999999" },
  pet: { theme: 'pet', hero: { title: "Quem ama pets, escolhe pelo coração. E pelo Instagram.", tagline: "Conteúdo que conecta donos de pets ao seu negócio de forma irresistível.", badge: "INOVA PRODUÇÕES • 2026", cta: "ATRAIR MAIS CLIENTES 🐾" }, strategy: { problem: "Donos de pets são apaixonados e exigentes. Se seu petshop ou clínica não transmite cuidado e profissionalismo no digital, eles vão para o concorrente.", solution: "Criamos conteúdos fofos, profissionais e estratégicos que fazem seu negócio ser o preferido dos tutores.", results: "Mais Clientes, Fidelização, Comunidade Engajada", steps: "Diagnóstico, Planejamento, Captação, Edição, Entrega" }, services: [{ title: "Vídeos de Bastidores", desc: "Momentos fofos com os pets." }, { title: "Fotos Profissionais", desc: "Pets e produtos com qualidade." }, { title: "Reels Virais", desc: "Conteúdo de pet que bomba." }, { title: "Copy Emocional", desc: "Textos que tocam o coração dos tutores." }, { title: "Tráfego Local", desc: "Anúncios para donos de pet na sua região." }, { title: "Stories Interativos", desc: "Engajamento diário com a comunidade." }], plans: [{ name: "Plano Básico", price: "1200", features: ["6 vídeos/mês", "Fotos profissionais", "Copy emocional", "Edição"], popular: false }, { name: "Plano Premium", price: "3000", features: ["12 vídeos/mês", "Reels virais", "Tráfego pago", "Stories diários", "Gestão completa"], popular: true }], whatsapp: "5562999999999" },
  barbearia: { theme: 'barbearia', hero: { title: "Corte impecável. Presença digital impecável.", tagline: "Transformamos barbearias e salões em marcas referência da cidade.", badge: "INOVA PRODUÇÕES • 2026", cta: "DOMINAR O DIGITAL ✂️" }, strategy: { problem: "Seu corte é perfeito, mas se o cliente não vê isso no Instagram, ele marca com o concorrente que posta mais.", solution: "Conteúdos que mostram seu trabalho de forma cinematográfica e lotam sua agenda.", results: "Agenda Lotada, Marca Reconhecida, Ticket Maior", steps: "Diagnóstico, Planejamento, Captação, Edição, Entrega" }, services: [{ title: "Vídeos de Transformação", desc: "Antes e depois cinematográfico." }, { title: "Fotos de Corte", desc: "Portfolio profissional do seu trabalho." }, { title: "Reels Satisfatórios", desc: "Conteúdo ASMR e satisfying." }, { title: "Copy Masculina", desc: "Textos que falam a língua do seu público." }, { title: "Tráfego Local", desc: "Anúncios para atrair clientes do bairro." }, { title: "Identidade Visual", desc: "Branding profissional para suas redes." }], plans: [{ name: "Plano Corte", price: "1300", features: ["6 vídeos/mês", "Fotos portfolio", "Copy", "Edição profissional"], popular: false }, { name: "Plano Referência", price: "3200", features: ["12 vídeos/mês", "Reels virais", "Tráfego pago", "Identidade visual", "Gestão redes"], popular: true }], whatsapp: "5562999999999" },
  odonto: { theme: 'odonto', hero: { title: "Sorrisos transformam vidas. Seu marketing precisa mostrar isso.", tagline: "Posicionamos dentistas e clínicas odontológicas como referência premium.", badge: "INOVA PRODUÇÕES • 2026", cta: "POSICIONAR MEU CONSULTÓRIO 😁" }, strategy: { problem: "Pacientes pesquisam dentistas online antes de agendar. Se sua presença digital é fraca, eles escolhem quem comunica melhor.", solution: "Conteúdos que transmitem confiança, expertise e resultados reais do seu trabalho.", results: "Mais Pacientes, Autoridade, Procedimentos de Alto Valor", steps: "Diagnóstico, Planejamento, Captação, Edição, Entrega" }, services: [{ title: "Vídeos de Procedimento", desc: "Captação elegante de tratamentos." }, { title: "Antes e Depois", desc: "Transformações de sorriso em alta qualidade." }, { title: "Reels Educativos", desc: "Dicas odontológicas que viralizam." }, { title: "Copy para Saúde", desc: "Textos que respeitam o CRO e vendem." }, { title: "Tráfego Premium", desc: "Anúncios para pacientes qualificados." }, { title: "Depoimentos", desc: "Prova social de pacientes satisfeitos." }], plans: [{ name: "Plano Essencial", price: "2000", features: ["8 vídeos/mês", "2 captações", "Copy médica", "Edição premium"], popular: false }, { name: "Plano Autoridade", price: "4800", features: ["14 vídeos/mês", "4 captações", "Funil de agendamento", "Tráfego pago", "Gestão reputação"], popular: true }], whatsapp: "5562999999999" },
  contabilidade: { theme: 'contabilidade', hero: { title: "Contabilidade estratégica merece um marketing à altura.", tagline: "Posicionamos escritórios contábeis como parceiros indispensáveis dos empresários.", badge: "INOVA PRODUÇÕES • 2026", cta: "ATRAIR MAIS CLIENTES 📊" }, strategy: { problem: "Empresários veem contabilidade como commodity. Sem posicionamento digital, seu escritório compete só por preço.", solution: "Conteúdo que demonstra sua expertise e transforma seu escritório em referência.", results: "Clientes Melhores, Contratos Maiores, Autoridade", steps: "Diagnóstico, Planejamento, Captação, Edição, Entrega" }, services: [{ title: "Vídeos Educativos", desc: "Dicas fiscais e tributárias para empresários." }, { title: "Conteúdo LinkedIn", desc: "Posicionamento no meio corporativo." }, { title: "Reels de Dicas", desc: "Conteúdo rápido sobre impostos e MEI." }, { title: "Copy Corporativa", desc: "Comunicação profissional e clara." }, { title: "Tráfego B2B", desc: "Anúncios para atrair empresários." }, { title: "Newsletter Visual", desc: "Updates visuais para clientes." }], plans: [{ name: "Plano Básico", price: "1500", features: ["6 vídeos/mês", "2 captações", "Copy profissional", "Edição"], popular: false }, { name: "Plano Estratégico", price: "3800", features: ["12 vídeos/mês", "LinkedIn premium", "Tráfego B2B", "Newsletter", "Consultoria de marca"], popular: true }], whatsapp: "5562999999999" },
  arquitetura: { theme: 'arquitetura', hero: { title: "Projetos extraordinários merecem ser vistos de forma extraordinária.", tagline: "Conteúdo visual que valoriza seus projetos e atrai clientes premium.", badge: "INOVA PRODUÇÕES • 2026", cta: "VALORIZAR MEUS PROJETOS 🏗️" }, strategy: { problem: "Clientes de alto padrão escolhem arquitetos pelo portfólio online. Se seus projetos não são apresentados com excelência, você perde oportunidades.", solution: "Captação cinematográfica que transforma seus projetos em verdadeiras obras de arte visual.", results: "Portfólio Premium, Clientes de Alto Valor, Reconhecimento", steps: "Diagnóstico, Planejamento, Captação, Edição, Entrega" }, services: [{ title: "Tour de Projeto", desc: "Vídeos imersivos de ambientes." }, { title: "Fotos de Arquitetura", desc: "Fotografia profissional de interiores." }, { title: "Timelapse de Obra", desc: "Do projeto à entrega em vídeo." }, { title: "Reels de Inspiração", desc: "Conteúdo aspiracional para redes." }, { title: "Portfólio Digital", desc: "Apresentação visual dos projetos." }, { title: "Drone Aéreo", desc: "Captação aérea de fachadas e terrenos." }], plans: [{ name: "Plano Projeto", price: "2500", features: ["6 vídeos/mês", "Fotos arquitetônicas", "Tour de ambiente", "Edição cinema"], popular: false }, { name: "Plano Portfólio", price: "5500", features: ["12 vídeos/mês", "Drone", "Timelapse", "Portfólio digital", "Tráfego premium", "Consultoria"], popular: true }], whatsapp: "5562999999999" },
  tech: { theme: 'tech', hero: { title: "Seu software é revolucionário. Agora as pessoas precisam entender isso.", tagline: "Conteúdo que traduz tecnologia complexa em valor irresistível para o cliente.", badge: "INOVA PRODUÇÕES • 2026", cta: "ESCALAR MEU SaaS 🚀" }, strategy: { problem: "No mercado tech, vence quem comunica melhor, não quem tem o melhor produto. Se sua comunicação é técnica demais, você perde clientes.", solution: "Traduzimos sua solução em narrativa visual que conecta emocionalmente e converte.", results: "Mais Demos, Conversão de Trials, Marca Tech Forte", steps: "Diagnóstico, Planejamento, Produção, Edição, Entrega" }, services: [{ title: "Vídeo Explicativo", desc: "Animações que explicam seu produto." }, { title: "Demo Profissional", desc: "Captação de tela cinematográfica." }, { title: "Cases de Sucesso", desc: "Depoimentos dos seus clientes." }, { title: "Conteúdo LinkedIn", desc: "Thought leadership para founders." }, { title: "Ads para SaaS", desc: "Criativos otimizados para conversão." }, { title: "Motion Branding", desc: "Identidade visual em movimento." }], plans: [{ name: "Plano Startup", price: "2800", features: ["8 vídeos/mês", "Vídeo explicativo", "Demo profissional", "Edição premium"], popular: false }, { name: "Plano Scale-up", price: "6000", features: ["16 vídeos/mês", "Motion branding", "Cases", "LinkedIn", "Tráfego SaaS", "Consultoria GTM"], popular: true }], whatsapp: "5562999999999" }
};

const NICHE_IMAGES: Record<string, string> = {
  restaurant: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
  personal: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400",
  clinica: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400",
  lawyer: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=400",
  realestate: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
  studio: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=400",
  ecommerce: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400",
  educacao: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=400",
  pet: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400",
  barbearia: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400",
  odonto: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400",
  contabilidade: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400",
  arquitetura: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=400",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
};
const NICHE_LABELS: Record<string, string> = {
  restaurant: "Gastro", personal: "Fitness", clinica: "Clínica", lawyer: "Jurídico",
  realestate: "Imobiliária", studio: "Estúdio", ecommerce: "E-commerce", educacao: "Educação",
  pet: "Pet", barbearia: "Barbearia", odonto: "Odonto", contabilidade: "Contábil",
  arquitetura: "Arquitetura", tech: "Tech / SaaS",
};

/* ═══════ PHOTO GALLERY ═══════ */
const PHOTO_GALLERY = [
  { url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200", label: "Equipe Profissional" },
  { url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200", label: "Gastronomia" },
  { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200", label: "Academia / Fitness" },
  { url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200", label: "Clínica / Saúde" },
  { url: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1200", label: "Escritório / Jurídico" },
  { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200", label: "Imobiliário / Luxo" },
  { url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200", label: "Estúdio / Produção" },
  { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200", label: "Time / Colaboração" },
  { url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200", label: "Edição / Pós-produção" },
  { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200", label: "Analytics / Dados" },
  { url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200", label: "Redes Sociais" },
  { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200", label: "Dashboard" },
  { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200", label: "E-commerce / Loja" },
  { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200", label: "Educação / Curso" },
  { url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=1200", label: "Pet / Veterinário" },
  { url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1200", label: "Barbearia / Salão" },
  { url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200", label: "Odontologia" },
  { url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=1200", label: "Arquitetura" },
  { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200", label: "Tecnologia / SaaS" },
];

/* ═══════ LAYOUT THEMES ═══════ */
const LAYOUT_THEMES = [
  { id: 'light', label: 'Clássico Light', bg: 'bg-white', text: 'text-gray-900', cardBg: 'bg-gray-50', icon: Sun },
  { id: 'dark', label: 'Dark Premium', bg: 'bg-[#050508]', text: 'text-white', cardBg: 'bg-white/5', icon: Moon },
  { id: 'warm', label: 'Warm Elegante', bg: 'bg-[#FDF8F4]', text: 'text-stone-900', cardBg: 'bg-white', icon: Blend },
  { id: 'blue', label: 'Corporate Blue', bg: 'bg-slate-50', text: 'text-slate-900', cardBg: 'bg-white', icon: Square },
];

const ACCENT_PRESETS = [
  { color: '#2563eb', label: 'Azul' }, { color: '#7c3aed', label: 'Roxo' },
  { color: '#059669', label: 'Verde' }, { color: '#dc2626', label: 'Vermelho' },
  { color: '#ea580c', label: 'Laranja' }, { color: '#0891b2', label: 'Cyan' },
  { color: '#bff720', label: 'Neon' }, { color: '#f59e0b', label: 'Dourado' },
  { color: '#ec4899', label: 'Rosa' }, { color: '#000000', label: 'Preto' },
];

/* ═══════ EDITABLE COMPONENT ═══════ */
function Editable({ value, onChange, tag = 'p', className = '', style = {}, multiline = false }: {
  value: string; onChange: (v: string) => void; tag?: string; className?: string; style?: React.CSSProperties; multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  useEffect(() => { setTempValue(value); }, [value]);
  useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); } }, [editing]);

  if (editing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea ref={inputRef as any} value={tempValue} onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => { onChange(tempValue); setEditing(false); }}
            onKeyDown={(e) => { if (e.key === 'Escape') { setTempValue(value); setEditing(false); } }}
            className={`bg-blue-50 border-2 border-blue-400 rounded-lg p-3 outline-none w-full resize-none min-h-[80px] text-gray-900`} style={{ ...style, color: '#111' }} />
        ) : (
          <input ref={inputRef as any} value={tempValue} onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => { onChange(tempValue); setEditing(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { onChange(tempValue); setEditing(false); } if (e.key === 'Escape') { setTempValue(value); setEditing(false); } }}
            className={`bg-blue-50 border-2 border-blue-400 rounded-lg px-3 py-2 outline-none w-full text-gray-900`} style={{ ...style, color: '#111' }} />
        )}
        <div className="absolute -top-7 left-0 bg-blue-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-t-md uppercase tracking-wider flex items-center gap-1 z-30">
          <Pencil size={8} /> Editando
        </div>
      </div>
    );
  }
  const Tag = tag as any;
  return (
    <Tag className={`${className} cursor-pointer relative group/ed`} style={style} onClick={() => setEditing(true)}>
      {value}
      <span className="absolute -top-1.5 -right-1.5 opacity-0 group-hover/ed:opacity-100 bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg z-20 pointer-events-none transition-all"><Pencil size={8} /></span>
      <span className="absolute inset-0 border-2 border-transparent group-hover/ed:border-blue-400 group-hover/ed:border-dashed rounded-lg pointer-events-none transition-all" />
    </Tag>
  );
}

/* ═══════ CLICKABLE IMAGE ═══════ */
function EditableImage({ src, onChangeSrc, className = '', alt = '' }: { src: string; onChangeSrc: (url: string) => void; className?: string; alt?: string }) {
  const [showGallery, setShowGallery] = useState(false);
  return (
    <div className="relative group/img">
      <img src={src} alt={alt} className={className} />
      <button onClick={() => setShowGallery(true)}
        className="absolute top-3 right-3 opacity-0 group-hover/img:opacity-100 bg-white/90 backdrop-blur text-gray-700 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg z-20 hover:bg-blue-500 hover:text-white transition-all">
        <ImageIcon size={16} />
      </button>
      {showGallery && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col rounded-[inherit] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <p className="text-white text-[11px] font-bold uppercase tracking-widest">Trocar Foto</p>
            <button onClick={() => setShowGallery(false)} className="text-white/50 hover:text-white"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 grid grid-cols-3 gap-2" style={{ scrollbarWidth: 'thin' }}>
            {PHOTO_GALLERY.map((photo, i) => (
              <button key={i} onClick={() => { onChangeSrc(photo.url); setShowGallery(false); toast.success('Foto atualizada!'); }}
                className="relative rounded-lg overflow-hidden h-20 group/ph hover:ring-2 hover:ring-blue-400 transition-all">
                <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover/ph:bg-black/20 transition-all" />
                <p className="absolute bottom-1 inset-x-1 text-[7px] text-white font-bold text-center truncate">{photo.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════ BLOCK WRAPPER ═══════ */
function BlockWrapper({ label, onDuplicate, onDelete, children, className = '' }: { label: string; onDuplicate: () => void; onDelete: () => void; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group/block ${className}`}>
      <div className="absolute -left-10 top-4 opacity-0 group-hover/block:opacity-100 transition-all flex flex-col gap-1 z-30">
        <button onClick={onDuplicate} title="Duplicar bloco" className="w-7 h-7 rounded-md bg-blue-500 text-white flex items-center justify-center shadow-md hover:bg-blue-600 transition-all"><Copy size={12} /></button>
        <button onClick={onDelete} title="Remover bloco" className="w-7 h-7 rounded-md bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-all"><Trash2 size={12} /></button>
      </div>
      <div className="absolute -left-10 top-0 opacity-0 group-hover/block:opacity-100 transition-all z-30">
        <span className="bg-gray-800 text-white text-[7px] font-bold px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">{label}</span>
      </div>
      <div className="group-hover/block:ring-2 group-hover/block:ring-blue-400 group-hover/block:ring-offset-2 rounded-[inherit] transition-all">
        {children}
      </div>
    </div>
  );
}

/* ═══════ MAIN EDITOR ═══════ */
export default function SalesEditorPage() {
  const [config, setConfig] = useState<any>(null);
  const [panelTab, setPanelTab] = useState<'template' | 'design' | 'blocks'>('template');
  const [panelOpen, setPanelOpen] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('agency_lp_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const t = NICHE_TEMPLATES[parsed.theme] || NICHE_TEMPLATES.restaurant;
        setConfig({ ...t, ...parsed, styles: { heroTitleSize: "56", accentColor: "#2563eb", layoutTheme: "light", heroImage: "", ...(parsed.styles || {}) }, hero: { ...t.hero, ...(parsed.hero || {}) }, strategy: { ...t.strategy, ...(parsed.strategy || {}) }, services: parsed.services?.length ? parsed.services : t.services, plans: parsed.plans?.length ? parsed.plans : t.plans, extraBlocks: parsed.extraBlocks || [] });
      } catch { loadTemplate('restaurant'); }
    } else { loadTemplate('restaurant'); }

    async function fetchLeads() {
      const { data } = await supabase.from('leads').select('id, name, company').order('name');
      if (data) setLeads(data);
    }
    fetchLeads();
  }, []);

  const loadTemplate = (niche: string) => { setConfig({ ...NICHE_TEMPLATES[niche], styles: { heroTitleSize: "56", accentColor: "#2563eb", layoutTheme: "light", heroImage: "" }, extraBlocks: [] }); };
  const switchNiche = (niche: string) => { setConfig({ ...NICHE_TEMPLATES[niche], styles: config?.styles || { heroTitleSize: "56", accentColor: "#2563eb", layoutTheme: "light" }, extraBlocks: config?.extraBlocks || [] }); toast.success(`Template "${NICHE_LABELS[niche]}" aplicado!`); };
  
  const handleSave = async () => {
    if (!slug) {
      toast.error('Por favor, defina um slug para a URL.');
      setPanelTab('template');
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await (supabase as any).from('sales_proposals').upsert({
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        lead_id: selectedLeadId || null,
        config,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'slug' });

      if (error) throw error;

      localStorage.setItem('agency_lp_config', JSON.stringify(config));
      toast.success('Proposta publicada com sucesso! 🚀');
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addTextBlock = () => { setConfig({ ...config, extraBlocks: [...(config.extraBlocks || []), { type: 'text', title: 'Novo Título', body: 'Escreva seu texto aqui. Clique para editar.' }] }); toast.success('Bloco de texto adicionado!'); };
  const addImageBlock = () => { setConfig({ ...config, extraBlocks: [...(config.extraBlocks || []), { type: 'image', url: PHOTO_GALLERY[0].url, caption: 'Legenda da imagem' }] }); toast.success('Bloco de imagem adicionado!'); };
  const duplicateExtra = (i: number) => { const blocks = [...(config.extraBlocks || [])]; blocks.splice(i + 1, 0, { ...blocks[i] }); setConfig({ ...config, extraBlocks: blocks }); toast.success('Bloco duplicado!'); };
  const deleteExtra = (i: number) => { setConfig({ ...config, extraBlocks: (config.extraBlocks || []).filter((_: any, idx: number) => idx !== i) }); toast.success('Bloco removido!'); };

  if (!config) return null;
  const accent = config.styles?.accentColor || "#2563eb";
  const heroSize = config.styles?.heroTitleSize || "56";
  const layoutTheme = LAYOUT_THEMES.find(t => t.id === (config.styles?.layoutTheme || 'light')) || LAYOUT_THEMES[0];
  const isDark = layoutTheme.id === 'dark';
  const heroImage = config.styles?.heroImage || NICHE_IMAGES[config.theme] || PHOTO_GALLERY[0].url;
  const h = config.hero || {}; const s = config.strategy || {};
  const services = config.services || []; const plans = (config.plans || []).slice(0, 2);
  const results = (s.results || '').split(',').map((r: string) => r.trim());
  const steps = (s.steps || '').split(',').map((r: string) => r.trim());
  const extraBlocks = config.extraBlocks || [];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* TOOLBAR */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-12 bg-white border-b border-gray-200 flex items-center justify-between px-5 shadow-sm">
        <div className="flex items-center gap-3">
          <img src={LogoInova} alt="Inova" className="h-5" />
          <div className="h-5 w-px bg-gray-200" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Editor Visual</span>
          <Badge className="bg-green-50 text-green-600 border-green-200 text-[8px] font-bold"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 inline-block animate-pulse" />Ao vivo</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold gap-1.5 border-gray-200" onClick={() => setPanelOpen(!panelOpen)}>
            <Settings size={12} /> {panelOpen ? 'Fechar' : 'Painel'}
          </Button>
          <a href="/proposta" target="_blank"><Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold gap-1.5 border-gray-200"><Eye size={12} /> Ver Site</Button></a>
          <Button size="sm" className="h-8 rounded-lg text-[10px] font-bold gap-1.5 shadow-md active:scale-95 min-w-[100px]" 
            disabled={isSaving}
            style={{ backgroundColor: accent, color: isDark && accent === '#bff720' ? '#000' : '#fff' }} 
            onClick={handleSave}>
            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {isSaving ? 'Salvando...' : 'Publicar'}
          </Button>
        </div>
      </div>

      {/* SIDE PANEL */}
      {panelOpen && (
        <aside className="w-[280px] h-full pt-12 bg-white border-r border-gray-200 flex flex-col z-40 shrink-0">
          {/* Panel Tabs */}
          <div className="flex border-b border-gray-100 shrink-0">
            {[{ id: 'template' as const, label: 'Nichos', icon: Grid3X3 }, { id: 'design' as const, label: 'Design', icon: Palette }, { id: 'blocks' as const, label: 'Blocos', icon: Layers }].map(tab => (
              <button key={tab.id} onClick={() => setPanelTab(tab.id)}
                className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-widest flex flex-col items-center gap-1 transition-all ${panelTab === tab.id ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-600'}`}>
                <tab.icon size={14} />{tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5" style={{ scrollbarWidth: 'thin' }}>
            {/* ── NICHOS ── */}
            {panelTab === 'template' && (<>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Template do Nicho</p>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.keys(NICHE_TEMPLATES).map(niche => (
                  <button key={niche} onClick={() => switchNiche(niche)}
                    className={`relative w-full h-14 rounded-lg overflow-hidden border-2 transition-all ${config.theme === niche ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-100 hover:border-gray-300'}`}>
                    <img src={NICHE_IMAGES[niche]} alt="" className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 ${config.theme === niche ? 'bg-blue-500/20' : 'bg-black/50'}`} />
                    <p className="absolute bottom-1 inset-x-0 text-center text-[6px] font-bold text-white uppercase">{NICHE_LABELS[niche]}</p>
                  </button>
                ))}
              </div>
              <div className="h-px bg-gray-100" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Publicação</p>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[8px] font-bold text-gray-400 uppercase">Slug da URL (ex: cliente-x)</Label>
                  <div className="relative">
                    <Input className="h-8 text-[11px] rounded-lg border-gray-200 pl-7" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="minha-proposta" />
                    <LinkIcon size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {slug && <p className="text-[8px] text-blue-500 font-medium truncate">/proposta/{slug.toLowerCase().replace(/\s+/g, '-')}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-[8px] font-bold text-gray-400 uppercase">Associar Lead</Label>
                  <Select value={selectedLeadId} onValueChange={(v) => setSelectedLeadId(v)}>
                    <SelectTrigger className="h-8 text-[11px] rounded-lg border-gray-200">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {leads.map(lead => (
                        <SelectItem key={lead.id} value={lead.id}>{lead.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="h-px bg-gray-100" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Ajustes Rápidos</p>
              <MiniField label="WhatsApp" val={config.whatsapp || ''} set={(v) => setConfig({...config, whatsapp: v})} />
              <MiniField label="Tamanho Título (px)" val={heroSize} set={(v) => setConfig({...config, styles: {...config.styles, heroTitleSize: v}})} />
              <div className="h-px bg-gray-100" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Serviços ({services.length})</p>
              {services.map((svc: any, i: number) => (
                <div key={i} className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-lg group text-[10px]">
                  <span className="font-bold text-gray-700 flex-1 truncate">{svc.title}</span>
                  <button onClick={() => { const n = [...services]; n.splice(i+1, 0, {...svc}); setConfig({...config, services: n}); }} className="opacity-0 group-hover:opacity-100 text-blue-400"><Copy size={10} /></button>
                  <button onClick={() => setConfig({...config, services: services.filter((_: any, idx: number) => idx !== i)})} className="opacity-0 group-hover:opacity-100 text-red-400"><Trash2 size={10} /></button>
                </div>
              ))}
              <button onClick={() => setConfig({...config, services: [...services, {title: "Novo Serviço", desc: "Clique para editar."}]})} className="flex items-center gap-1.5 p-2 w-full rounded-lg border border-dashed border-gray-200 text-[10px] font-bold text-gray-400 hover:text-blue-500 hover:border-blue-300 transition-all"><Plus size={10} /> Adicionar</button>
              <div className="h-px bg-gray-100" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Planos (2)</p>
              {plans.map((p: any, i: number) => (
                <div key={i} className="p-2.5 bg-gray-50 rounded-lg space-y-1.5">
                  <Input className="h-7 text-[10px] rounded border-gray-200 font-bold" value={p.name} onChange={(e) => { const n=[...(config.plans||[])];n[i]={...p,name:e.target.value};setConfig({...config,plans:n});}} />
                  <div className="flex gap-1.5">
                    <Input className="h-7 text-[10px] rounded border-gray-200 font-bold flex-1" value={p.price} onChange={(e) => { const n=[...(config.plans||[])];n[i]={...p,price:e.target.value};setConfig({...config,plans:n});}} />
                    <label className="flex items-center gap-1 text-[8px] font-bold text-gray-400 shrink-0"><input type="checkbox" checked={p.popular} className="accent-blue-500 w-3 h-3" onChange={(e) => { const n=[...(config.plans||[])];n[i]={...p,popular:e.target.checked};setConfig({...config,plans:n});}} />Top</label>
                  </div>
                </div>
              ))}
            </>)}

            {/* ── DESIGN ── */}
            {panelTab === 'design' && (<>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tema de Fundo</p>
              <div className="grid grid-cols-2 gap-2">
                {LAYOUT_THEMES.map(t => (
                  <button key={t.id} onClick={() => setConfig({...config, styles: {...config.styles, layoutTheme: t.id}})}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${config.styles?.layoutTheme === t.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className={`w-full h-8 rounded-lg ${t.bg} border border-gray-200`} />
                    <span className="text-[8px] font-bold text-gray-500 uppercase">{t.label}</span>
                  </button>
                ))}
              </div>
              <div className="h-px bg-gray-100" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Cor de Destaque</p>
              <div className="grid grid-cols-5 gap-2">
                {ACCENT_PRESETS.map(a => (
                  <button key={a.color} onClick={() => setConfig({...config, styles: {...config.styles, accentColor: a.color}})}
                    className={`w-full aspect-square rounded-xl border-2 transition-all ${accent === a.color ? 'border-gray-800 ring-2 ring-gray-300 scale-110' : 'border-gray-200 hover:scale-105'}`}
                    style={{ backgroundColor: a.color }} title={a.label} />
                ))}
              </div>
              <MiniField label="Cor Personalizada (HEX)" val={accent} set={(v) => setConfig({...config, styles: {...config.styles, accentColor: v}})} />
              <div className="h-px bg-gray-100" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Foto do Hero</p>
              <div className="grid grid-cols-3 gap-1.5">
                {PHOTO_GALLERY.slice(0, 9).map((photo, i) => (
                  <button key={i} onClick={() => setConfig({...config, styles: {...config.styles, heroImage: photo.url}})}
                    className={`h-14 rounded-lg overflow-hidden border-2 transition-all ${heroImage === photo.url ? 'border-blue-500' : 'border-gray-100 hover:border-gray-300'}`}>
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>)}

            {/* ── BLOCOS ── */}
            {panelTab === 'blocks' && (<>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Adicionar Bloco</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={addTextBlock} className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center gap-2">
                  <Type size={20} className="text-gray-400" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase">Texto</span>
                </button>
                <button onClick={addImageBlock} className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center gap-2">
                  <ImageIcon size={20} className="text-gray-400" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase">Imagem</span>
                </button>
              </div>
              <div className="h-px bg-gray-100" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Blocos Personalizados ({extraBlocks.length})</p>
              {extraBlocks.length === 0 && <p className="text-[10px] text-gray-300 italic">Nenhum bloco adicionado. Use os botões acima.</p>}
              {extraBlocks.map((block: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg group text-[10px]">
                  {block.type === 'text' ? <Type size={12} className="text-blue-400" /> : <ImageIcon size={12} className="text-green-400" />}
                  <span className="font-bold text-gray-700 flex-1 truncate">{block.type === 'text' ? block.title : 'Imagem'}</span>
                  <button onClick={() => duplicateExtra(i)} className="opacity-0 group-hover:opacity-100 text-blue-400"><Copy size={10} /></button>
                  <button onClick={() => deleteExtra(i)} className="opacity-0 group-hover:opacity-100 text-red-400"><Trash2 size={10} /></button>
                </div>
              ))}
            </>)}
          </div>
          <div className="p-3 border-t border-gray-100 bg-blue-50/50 shrink-0">
            <p className="text-[9px] text-blue-600 font-semibold flex items-center gap-1.5"><MousePointer2 size={10} /> Clique no texto para editar. Passe o mouse nos blocos para opções.</p>
          </div>
        </aside>
      )}

      {/* ═══════ CANVAS ═══════ */}
      <main className="flex-1 h-full pt-12 overflow-y-auto bg-gray-200" style={{ scrollbarWidth: 'thin' }}>
        <div className="max-w-[1300px] mx-auto py-6 px-6">
          <div className={`${layoutTheme.bg} ${layoutTheme.text} rounded-2xl shadow-2xl shadow-gray-300/50 overflow-hidden border border-gray-200`}>

            {/* Nav */}
            <div className={`${isDark ? 'bg-black/40 border-white/5' : 'bg-white/80 border-gray-100'} backdrop-blur-xl border-b px-8 h-12 flex items-center justify-between`}>
              <img src={LogoInova} alt="Inova" className={`h-5 ${isDark ? 'brightness-200' : ''}`} />
              <Button size="sm" className="rounded-full h-8 px-5 text-[10px] font-bold" style={{ backgroundColor: accent, color: isDark && accent!=='#000000' ? '#000' : '#fff' }}>Falar Conosco</Button>
            </div>

            {/* HERO */}
            <BlockWrapper label="Capa" onDuplicate={() => toast('A capa é fixa.')} onDelete={() => toast('A capa não pode ser removida.')}>
              <section className="px-10 py-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[150px] opacity-[0.07]" style={{ backgroundColor: accent }} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                  <div>
                    <Editable value={h.badge||''} onChange={v=>setConfig({...config,hero:{...h,badge:v}})} className={`inline-block ${isDark?'bg-white/5 text-white/40 border-white/10':'bg-gray-50 text-gray-500 border-gray-200'} border px-3 py-1 text-[10px] font-semibold rounded-full mb-6`} />
                    <Editable value={h.title||''} onChange={v=>setConfig({...config,hero:{...h,title:v}})} tag="h1" multiline className="font-black tracking-tight leading-[1.1] mb-6" style={{fontSize:`${heroSize}px`}} />
                    <Editable value={h.tagline||''} onChange={v=>setConfig({...config,hero:{...h,tagline:v}})} multiline className={`text-base ${isDark?'text-white/40':'text-gray-500'} leading-relaxed mb-8 max-w-md`} />
                    <Editable value={h.cta||''} onChange={v=>setConfig({...config,hero:{...h,cta:v}})} className="inline-block rounded-full px-7 py-3 text-[14px] font-bold text-white" style={{backgroundColor:accent}} />
                  </div>
                  <EditableImage src={heroImage} onChangeSrc={url=>setConfig({...config,styles:{...config.styles,heroImage:url}})}
                    className="w-full h-[360px] object-cover rounded-[1.5rem] shadow-xl" alt="Hero" />
                </div>
              </section>
            </BlockWrapper>

            {/* STRATEGY */}
            <BlockWrapper label="Estratégia" onDuplicate={() => toast('Use blocos extras para duplicar.')} onDelete={() => toast('Use blocos extras.')}>
              <section className="px-10 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${isDark?'bg-white/5 border-white/5':'bg-gray-50 border-gray-100'} rounded-[1.5rem] p-8 border`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark?'text-white/20':'text-gray-300'} mb-4`}>O Desafio</p>
                    <Editable value={s.problem||''} onChange={v=>setConfig({...config,strategy:{...s,problem:v}})} multiline className="text-lg font-bold leading-relaxed" />
                  </div>
                  <div className="rounded-[1.5rem] p-8 border border-transparent text-white" style={{backgroundColor:accent}}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">A Solução</p>
                    <Editable value={s.solution||''} onChange={v=>setConfig({...config,strategy:{...s,solution:v}})} multiline className="text-lg font-bold text-white leading-relaxed" />
                  </div>
                </div>
              </section>
            </BlockWrapper>

            {/* SERVICES */}
            <BlockWrapper label="Serviços" onDuplicate={() => toast('Use blocos extras.')} onDelete={() => toast('Use blocos extras.')}>
              <section className={`px-10 py-16 ${isDark?'bg-white/[0.02]':'bg-gray-50/50'}`}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-black tracking-tight">Tudo que você precisa em <span className="italic" style={{fontFamily:"'Georgia',serif",color:accent}}>um só lugar</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {services.map((svc:any,i:number)=>{
                    const icons=[Video,Camera,Zap,Lightbulb,Globe,Shield];const Icon=icons[i%icons.length];
                    return(
                      <div key={i} className={`flex items-start gap-4 p-5 rounded-xl ${isDark?'hover:bg-white/5':'hover:bg-white hover:shadow-md'} transition-all border border-transparent ${isDark?'hover:border-white/5':'hover:border-gray-100'} group/svc`}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor:`${accent}15`,color:accent}}><Icon size={18}/></div>
                        <div className="flex-1 min-w-0">
                          <Editable value={svc.title} onChange={v=>{const n=[...services];n[i]={...n[i],title:v};setConfig({...config,services:n});}} className="text-[13px] font-bold mb-0.5" />
                          <Editable value={svc.desc} onChange={v=>{const n=[...services];n[i]={...n[i],desc:v};setConfig({...config,services:n});}} className={`text-[11px] ${isDark?'text-white/30':'text-gray-400'} leading-relaxed`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </BlockWrapper>

            {/* PROCESS */}
            <BlockWrapper label="Processo" onDuplicate={() => toast('Use blocos extras.')} onDelete={() => toast('Use blocos extras.')}>
              <section className="px-10 py-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-black tracking-tight">Processo <span className="italic" style={{fontFamily:"'Georgia',serif",color:accent}}>simples</span></h2>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {steps.map((step:string,i:number)=>(
                    <div key={i} className={`${isDark?'bg-white/5 border-white/5':'bg-gray-50 border-gray-100'} rounded-xl p-5 border text-center relative`}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-black text-xs" style={{backgroundColor:accent}}>{i+1}</div>
                      <p className="text-[12px] font-bold">{step}</p>
                    </div>
                  ))}
                </div>
              </section>
            </BlockWrapper>

            {/* PRICING */}
            <BlockWrapper label="Investimento" onDuplicate={() => toast('Use blocos extras.')} onDelete={() => toast('Use blocos extras.')}>
              <section className={`px-10 py-16 ${isDark?'bg-white/[0.02]':'bg-gray-50/50'}`}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-black tracking-tight">Investimento <span className="italic" style={{fontFamily:"'Georgia',serif",color:accent}}>transparente</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
                  {plans.map((p:any,i:number)=>(
                    <div key={i} className={`rounded-[1.5rem] p-8 flex flex-col min-h-[380px] border-2 ${p.popular?(isDark?'bg-white/10':'bg-gray-900 text-white'):(isDark?'bg-white/5 border-white/5':'bg-white border-gray-100')}`} style={{borderColor:p.popular?'transparent':undefined}}>
                      <div className="flex justify-between items-start mb-5">
                        <Editable value={p.name} onChange={v=>{const n=[...(config.plans||[])];n[i]={...p,name:v};setConfig({...config,plans:n});}} className={`text-[11px] font-bold uppercase tracking-widest ${p.popular?'text-white/40':(isDark?'text-white/30':'text-gray-300')}`} />
                        {p.popular && <Badge className="text-[8px] font-bold px-3 py-1 rounded-full" style={{backgroundColor:accent,color:'#fff'}}>Popular</Badge>}
                      </div>
                      <div className="mb-6">
                        <span className="text-sm font-bold opacity-30">R$</span>
                        <Editable value={p.price} onChange={v=>{const n=[...(config.plans||[])];n[i]={...p,price:v};setConfig({...config,plans:n});}} tag="span" className="text-5xl font-black tracking-tighter" />
                        <span className="text-sm font-semibold opacity-30">/mês</span>
                      </div>
                      <div className="space-y-2.5 flex-1">
                        {(p.features||[]).map((f:string,j:number)=>(
                          <div key={j} className={`flex items-center gap-2.5 text-[12px] font-medium ${p.popular?'text-white/60':(isDark?'text-white/40':'text-gray-500')}`}><Check className="w-4 h-4 shrink-0" style={{color:accent}} />{f}</div>
                        ))}
                      </div>
                      <Button className={`w-full h-11 rounded-full font-bold text-[13px] mt-6 ${p.popular?'':`border-2 ${isDark?'border-white/10 bg-transparent hover:bg-white/5':'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'}`}`} style={p.popular?{backgroundColor:accent,color:'#fff'}:{}}>Iniciar Projeto</Button>
                    </div>
                  ))}
                </div>
              </section>
            </BlockWrapper>

            {/* EXTRA BLOCKS */}
            {extraBlocks.map((block: any, i: number) => (
              <BlockWrapper key={i} label={block.type === 'text' ? 'Bloco de Texto' : 'Bloco de Imagem'} onDuplicate={() => duplicateExtra(i)} onDelete={() => deleteExtra(i)}>
                {block.type === 'text' ? (
                  <section className="px-10 py-16">
                    <Editable value={block.title} onChange={v=>{const n=[...extraBlocks];n[i]={...n[i],title:v};setConfig({...config,extraBlocks:n});}} tag="h2" className="text-3xl font-black tracking-tight mb-6" />
                    <Editable value={block.body} onChange={v=>{const n=[...extraBlocks];n[i]={...n[i],body:v};setConfig({...config,extraBlocks:n});}} multiline className={`text-base ${isDark?'text-white/50':'text-gray-500'} leading-relaxed max-w-3xl`} />
                  </section>
                ) : (
                  <section className="px-10 py-8">
                    <EditableImage src={block.url} onChangeSrc={url=>{const n=[...extraBlocks];n[i]={...n[i],url};setConfig({...config,extraBlocks:n});}}
                      className="w-full h-[300px] object-cover rounded-[1.5rem]" alt="Bloco" />
                    <Editable value={block.caption||''} onChange={v=>{const n=[...extraBlocks];n[i]={...n[i],caption:v};setConfig({...config,extraBlocks:n});}} className={`text-center text-sm ${isDark?'text-white/30':'text-gray-400'} mt-4 font-medium italic`} />
                  </section>
                )}
              </BlockWrapper>
            ))}

            {/* CTA Final */}
            <BlockWrapper label="CTA Final" onDuplicate={() => toast('Use blocos extras.')} onDelete={() => toast('CTA é fixo.')}>
              <section className="px-10 py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{background:`linear-gradient(135deg,${accent},#f59e0b)`}} />
                <h2 className="text-4xl font-black tracking-tight mb-5 relative z-10">Pronto para <span className="italic" style={{fontFamily:"'Georgia',serif",color:accent}}>escalar?</span></h2>
                <Editable value={h.cta||'Agendar'} onChange={v=>setConfig({...config,hero:{...h,cta:v}})} className="inline-block rounded-full px-8 py-3.5 text-[15px] font-bold text-white relative z-10" style={{backgroundColor:accent}} />
              </section>
            </BlockWrapper>

            {/* Footer */}
            <div className={`px-10 py-6 ${isDark?'border-white/5':'border-gray-100'} border-t flex items-center justify-between`}>
              <div className="flex items-center gap-2"><img src={LogoInova} alt="Inova" className={`h-4 ${isDark?'brightness-200':''}`}/><span className={`text-[10px] ${isDark?'text-white/20':'text-gray-300'} font-semibold`}>© 2026 Inova Produções</span></div>
              <div className={`flex gap-5 text-[11px] font-semibold ${isDark?'text-white/30':'text-gray-400'}`}><span>Serviços</span><span>Investimento</span><span>Contato</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MiniField({label,val,set}:{label:string;val:string;set:(v:string)=>void}) {
  return (
    <div className="space-y-1">
      <Label className="text-[8px] font-bold text-gray-400 uppercase">{label}</Label>
      <Input className="h-8 text-[11px] rounded-lg border-gray-200" value={val} onChange={(e)=>set(e.target.value)} />
    </div>
  );
}
