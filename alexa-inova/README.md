# Alexa Skill - Inova Assistente

## Como configurar

### 1. Criar a Alexa Skill
1. Acesse o [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Clique em **Create Skill**
3. Nome: **Inova Assistente**
4. Modelo: **Custom**
5. Método de hospedagem: **Alexa-hosted (Node.js)** ou **Provision your own** (AWS Lambda)

### 2. Se usar Alexa-hosted (mais fácil):
- Copie o conteúdo do `skill.json` para a seção **Interaction Model** > **JSON Editor**
- Copie o código do `index.ts` para o arquivo `index.js` na aba **Code**

### 3. Se usar AWS Lambda:
1. Crie uma função Lambda em https://console.aws.amazon.com/lambda
2. Configure as variáveis de ambiente:
   - `SUPABASE_URL`: Sua URL do Supabase
   - `SUPABASE_ANON_KEY`: Sua chave anônima do Supabase
3. Copie o ARN da função para o `skill.json` no campo `endpoint.uri`
4. Deploy o código do `index.ts`

### 4. Testar
- Use o **Test** tab no Alexa Developer Console
- Ative "Skill testing is enabled"
- Fale: "Abrir Inova" ou "Pedir para Inova criar tarefa"

## Comandos disponíveis
- "Criar uma tarefa [titulo]"
- "Listar minhas tarefas"
- "Criar cliente [nome]"
- "Listar clientes"
- "Ajuda"

## Vídeo tutorial
Em breve link do YouTube com passo a passo.