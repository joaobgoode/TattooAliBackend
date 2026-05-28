===========================================================================
TATTOOALI - DOCUMENTAÇÃO DA API E GUIA DE IMPLANTAÇÃO (BACKEND)
===========================================================================

Este documento descreve os requisitos, configurações e o passo a passo 
necessários para configurar e rodar a API do TattooAli em ambiente de 
desenvolvimento.

---------------------------------------------------------------------------
1. REQUISITOS DO AMBIENTE
---------------------------------------------------------------------------
* Node.js: Versão 24 (ou outra versão compatível com as bibliotecas)
* NPM: Versão 11 (ou outra versão compatível com as bibliotecas)
* Banco de Dados: PostgreSQL (local ou em nuvem com portas de acesso liberadas)

---------------------------------------------------------------------------
2. REQUISITOS EXTERNOS
---------------------------------------------------------------------------
* Supabase: Configurado e ativo para ser utilizado na camada de autenticação.
* Armazenamento de Mídia: Bucket compatível com a API do S3 (Ex: AWS S3 ou Cloudflare R2).

---------------------------------------------------------------------------
3. PASSO A PASSO PARA CONFIGURAÇÃO
---------------------------------------------------------------------------

PASSO 1: CLONAR O REPOSITÓRIO
Execute o comando abaixo para clonar o projeto do backend diretamente do GitHub:
git clone https://github.com/joaobgoode/TattooAliBackend.git

PASSO 2: CONFIGURAR VARIÁVEIS DE AMBIENTE
Crie um arquivo chamado `.env` na raiz do projeto backend e preencha-o com as 
suas credenciais e chaves correspondentes:

DATABASE_URL=          # URL de conexão com o banco de dados PostgreSQL
SECRET_JWT=            # Segredo para assinatura/validação de tokens adicionais
ID_S3=                 # ID da chave de acesso do provedor S3
KEY_S3=                # Chave de acesso secreta do provedor S3
BUCKET_NAME=           # Nome do bucket criado para armazenamento das imagens
SECRET_S3=             # Token/Secret complementar do provedor S3 (se aplicável)
PUBLIC_BUCKET_URL=     # URL pública para a resolução e exibição das imagens enviadas
GEMINI_API_KEY=        # Chave de API do Google Gemini / Imagen 4
SUPABASE_URL=          # URL base do seu projeto no Supabase
SUPABASE_ANON_KEY=     # Chave pública anônima (Anon Key) do Supabase
SUPABASE_SERVICE_KEY=  # Chave de serviço (Service Role Key) do Supabase para bypass de RLS

PASSO 3: INSTALAR AS DEPENDÊNCIAS
Navegue até a pasta do projeto clonado no terminal e execute o comando abaixo para 
instalar todos os pacotes e módulos do ecossistema Node.js:
npm install

PASSO 4: INICIAR O SERVIDOR
Após a conclusão da instalação e a correta configuração do arquivo .env, inicie 
o servidor de desenvolvimento executando:
npm start

O servidor estará ativo e pronto para receber e responder às requisições da 
aplicação mobile TattooAli.
===========================================================================
