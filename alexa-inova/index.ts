import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = JSON.parse(event.body || '{}');
    const requestType = body.request?.type || '';
    
    if (requestType === 'LaunchRequest') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          version: '1.0',
          response: {
            outputSpeech: {
              type: 'PlainText',
              text: 'Olá! Sou o assistente Inova. Você pode pedir para criar tarefas, listar clientes ou ver suas tarefas. O que gostaria de fazer?'
            },
            shouldEndSession: false
          }
        })
      };
    }

    const intentName = body.request?.intent?.name || '';
    let responseText = '';
    let shouldEndSession = true;

    switch (intentName) {
      case 'CriarTarefaIntent': {
        const titulo = body.request?.intent?.slots?.titulo?.value || '';
        const prioridade = body.request?.intent?.slots?.prioridade?.value || 'normal';
        
        if (!titulo) {
          responseText = 'Qual o título da tarefa que você gostaria de criar?';
          shouldEndSession = false;
        } else {
          const { error } = await supabase.from('tasks').insert({
            title: titulo,
            priority: prioridade,
            status: 'Pendente',
            created_at: new Date().toISOString()
          });
          
          if (error) {
            responseText = 'Desculpe, houve um erro ao criar a tarefa. Tente novamente mais tarde.';
          } else {
            responseText = `Tarefa "${titulo}" criada com sucesso! Posso fazer mais alguma coisa?`;
            shouldEndSession = false;
          }
        }
        break;
      }

      case 'ListarTarefasIntent': {
        const { data: tarefas, error } = await supabase
          .from('tasks')
          .select('title, status')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error || !tarefas?.length) {
          responseText = 'Você não tem tarefas cadastradas.';
        } else {
          const lista = tarefas.map((t: any) => `${t.title} - ${t.status}`).join('. ');
          responseText = `Você tem ${tarefas.length} tarefas. As mais recentes são: ${lista}. Posso ajudar com mais alguma coisa?`;
          shouldEndSession = false;
        }
        break;
      }

      case 'ListarClientesIntent': {
        const { data: clientes, error } = await supabase
          .from('clients')
          .select('name')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error || !clientes?.length) {
          responseText = 'Você não tem clientes cadastrados.';
        } else {
          responseText = `Você tem ${clientes.length} clientes. Posso ajudar com mais alguma coisa?`;
          shouldEndSession = false;
        }
        break;
      }

      case 'CriarClienteIntent': {
        const nome = body.request?.intent?.slots?.nome?.value || '';
        
        if (!nome) {
          responseText = 'Qual o nome do cliente que você gostaria de adicionar?';
          shouldEndSession = false;
        } else {
          const { error } = await supabase.from('clients').insert({
            name: nome,
            created_at: new Date().toISOString()
          });
          
          if (error) {
            responseText = 'Desculpe, houve um erro ao criar o cliente.';
          } else {
            responseText = `Cliente "${nome}" criado com sucesso! Posso fazer mais alguma coisa?`;
            shouldEndSession = false;
          }
        }
        break;
      }

      case 'AMAZON.HelpIntent':
        responseText = 'Você pode pedir: criar uma tarefa, listar minhas tarefas, criar cliente ou listar clientes. O que gostaria de fazer?';
        shouldEndSession = false;
        break;

      case 'AMAZON.StopIntent':
        responseText = 'Ok! Quando precisar é só chamar. Até mais!';
        break;

      default:
        responseText = 'Desculpe, não entendi. Você pode pedir ajuda para ver os comandos disponíveis.';
        shouldEndSession = false;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'PlainText',
            text: responseText
          },
          shouldEndSession
        }
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'PlainText',
            text: 'Desculpe, houve um erro interno. Tente novamente.'
          },
          shouldEndSession: false
        }
      })
    };
  }
};