# Conversa: Bug do Vídeo na Plataforma Inova Lab
# Data: 2026-04-05

## Contexto
- Projeto: `agency-ace-main` (React + Vite + Supabase)
- Local: `/Users/lucassoares/Desktop/Inova Lab/agency-ace-main`

## Problema Principal
O upload de vídeo funciona, mas o vídeo "some logo em seguida". 

## Causa Identificada
A coluna `video_url` **NÃO EXISTE** na tabela `tasks` do Supabase.
- O código (`TaskDetailPanel.tsx`, `AgencyContext.tsx`) tenta salvar e ler `video_url`
- O TypeScript types (`supabase/types.ts`) também não tem `video_url` na tabela `tasks`
- O banco rejeita o save silenciosamente, causando o comportamento de "sumir"

## Arquivo de Migration Pronto
Já existe: `supabase/migrations/20260405_add_video_url_to_tasks.sql`

## O QUE PRECISA SER FEITO
1. Rodar no Supabase Dashboard > SQL Editor:
   ```sql
   ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS video_url TEXT;
   ```

2. OU rodar o migration completo (cria bucket 'videos' + policies):
   ```sql
   ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS video_url TEXT;

   INSERT INTO storage.buckets (id, name, public)
   VALUES ('videos', 'videos', true)
   ON CONFLICT (id) DO NOTHING;

   CREATE POLICY "Leitura pública de vídeos"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'videos');

   CREATE POLICY "Upload de vídeos para admins e equipe"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

   CREATE POLICY "Deleção de vídeos para admins e equipe"
   ON storage.objects FOR DELETE
   USING (bucket_id = 'videos' AND auth.role() = 'authenticated');
   ```

## Status
- Build: OK
- TypeScript: OK (sem erros)
- Git: branch main, com mudanças locais em TaskDetailPanel.tsx
- Aguardando execução do SQL no Supabase

## Observação
O usuário mencionou que a tela estava "toda bugada" no Antigravity, mas o build e TS estão ok. Provavelmente era cache ou erro de runtime causado pela coluna faltando.
