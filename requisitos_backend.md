# Requisitos do Backend — TattooAli

> **Stack:** Node.js + Express 5 · PostgreSQL (Sequelize ORM) · Supabase Auth · AWS S3 (armazenamento de imagens) · Google Gemini / Imagen 4 (IA generativa)  
> **Repositório:** [joaobgoode/TattooAliBackend](https://github.com/joaobgoode/TattooAliBackend)

---

## 1. Requisitos Funcionais

### RF-01 — Autenticação e Gerenciamento de Contas

| ID | Requisito |
|----|-----------|
| RF-01.1 | O sistema deve permitir o cadastro de novos usuários com nome, sobrenome, CPF, e-mail, senha, telefone e papel (`tatuador` ou `cliente`). |
| RF-01.2 | O cadastro deve criar a conta simultaneamente no **Supabase Auth** e no banco PostgreSQL local (dupla persistência). Se uma das etapas falhar, a outra deve ser revertida (rollback). |
| RF-01.3 | O sistema deve autenticar usuários via e-mail e senha, retornando um **JWT de acesso** emitido pelo Supabase Auth. |
| RF-01.4 | O sistema deve permitir a solicitação de **recuperação de senha** por e-mail (redirecionamento para URL configurável via variável de ambiente `FRONTEND_URL`). |
| RF-01.5 | Usuários autenticados devem poder **alterar a própria senha** enviando a nova senha junto ao token JWT atual. |
| RF-01.6 | O sistema deve expor um endpoint para **validar se um token JWT ainda é válido** sem exigir nova autenticação. |
| RF-01.7 | O sistema deve permitir que o usuário autenticado **consulte seus próprios dados** (perfil resumido com papel, CPF, foto, endereço, bio, etc.). |

---

### RF-02 — Gerenciamento de Perfil

| ID | Requisito |
|----|-----------|
| RF-02.1 | O usuário autenticado deve poder **visualizar seu perfil completo**, incluindo estilos de tatuagem cadastrados e dados biográficos. |
| RF-02.2 | O usuário deve poder **atualizar os campos do perfil** (nome, sobrenome, bio, endereço, telefone, WhatsApp, Instagram, cidade, UF, data de nascimento, gênero, estilo favorito). |
| RF-02.3 | O usuário tatuador deve poder **atualizar seus estilos** (especialidades) no mesmo endpoint de atualização de perfil. |
| RF-02.4 | O usuário deve poder **fazer upload de foto de perfil**, com armazenamento em bucket S3 e URL pública retornada automaticamente. |
| RF-02.5 | O usuário deve poder **excluir sua própria conta**, removendo o registro do banco local e do Supabase Auth simultaneamente. |

---

### RF-03 — Gestão de Clientes (agenda do tatuador)

| ID | Requisito |
|----|-----------|
| RF-03.1 | O tatuador deve poder **cadastrar clientes** informando nome, CPF, telefone, descrição e endereço. |
| RF-03.2 | O CPF do cliente deve ser **validado algoritmicamente** (dígitos verificadores) antes do cadastro. |
| RF-03.3 | O tatuador deve poder **listar todos os seus clientes**, filtrar por nome ou telefone. |
| RF-03.4 | O tatuador deve poder **consultar, editar e remover** um cliente específico (apenas os que pertencem a ele). |
| RF-03.5 | O tatuador deve poder **buscar se um CPF já possui conta no app** (cliente mobile), para vinculação. |
| RF-03.6 | O tatuador deve poder **vincular um usuário do app (cliente)** à sua agenda pelo CPF, importando automaticamente os dados do cadastro mobile. |

---

### RF-04 — Sessões / Agendamentos

| ID | Requisito |
|----|-----------|
| RF-04.1 | O tatuador deve poder **criar uma sessão** de atendimento vinculada a um cliente, com data, valor, número da sessão e descrição. |
| RF-04.2 | O tatuador deve poder **listar todas as suas sessões** ou filtrar por cliente ou por data. |
| RF-04.3 | O tatuador deve poder **consultar uma sessão** específica pelo ID. |
| RF-04.4 | O tatuador deve poder **atualizar dados de uma sessão** (data, valor, descrição, cancelamento + motivo). |
| RF-04.5 | O tatuador deve poder **marcar uma sessão como realizada** ou não realizada (mudança de status). |
| RF-04.6 | O tatuador deve poder **excluir uma sessão**. |
| RF-04.7 | O sistema deve permitir filtrar sessões por status: **pendentes, realizadas ou canceladas** (para o tatuador e por cliente). |
| RF-04.8 | O sistema deve permitir filtrar sessões por status **com recorte de data** (dia específico). |
| RF-04.9 | O **cliente mobile** deve poder consultar todas as suas sessões pelo CPF, separadas em: futuras, passadas e do dia. |
| RF-04.10 | O **cliente mobile** deve poder consultar suas sessões segmentadas por status: agendadas, realizadas e canceladas. |
| RF-04.11 | Ao criar uma sessão, o sistema deve **disparar uma notificação automática** para o cliente (se ele tiver conta no app). |
| RF-04.12 | Ao cancelar uma sessão, o sistema deve **notificar automaticamente** o outro participante (tatuador ou cliente). |
| RF-04.13 | Ao marcar uma sessão como realizada, o sistema deve **notificar o cliente** de que a avaliação está disponível. |

---

### RF-05 — Dashboard / Relatórios Financeiros

| ID | Requisito |
|----|-----------|
| RF-05.1 | O tatuador deve poder consultar o **total de sessões (realizadas e pendentes) de um dia** específico ou do dia atual. |
| RF-05.2 | O tatuador deve poder consultar o **total de sessões por mês** (atual ou informado). |
| RF-05.3 | O tatuador deve poder consultar o **total de sessões por ano** (atual ou informado). |
| RF-05.4 | O tatuador deve poder consultar o **valor total movimentado por dia, mês e ano**, separado em realizado e pendente. |

---

### RF-06 — Galeria de Fotos (portfólio)

| ID | Requisito |
|----|-----------|
| RF-06.1 | O tatuador deve poder **fazer upload de fotos de trabalhos** para sua galeria (armazenamento no S3). |
| RF-06.2 | Qualquer usuário deve poder **visualizar as fotos de um tatuador** pelo ID do usuário. |
| RF-06.3 | O tatuador deve poder **consultar as próprias fotos** autenticado. |
| RF-06.4 | O tatuador deve poder **atualizar a descrição de uma foto**. |
| RF-06.5 | O tatuador deve poder **excluir uma foto** (apenas as próprias), removendo o arquivo do S3 e o registro do banco. |
| RF-06.6 | Usuários devem poder **curtir (like) e descurtir fotos** de tatuadores. |

---

### RF-07 — Geração de Imagens por IA

| ID | Requisito |
|----|-----------|
| RF-07.1 | O tatuador autenticado deve poder **gerar imagens de tatuagens por prompt** (texto livre), utilizando o modelo **Google Imagen 4**. |
| RF-07.2 | A imagem gerada deve ser **armazenada automaticamente no S3** e registrada no banco vinculada ao usuário. |
| RF-07.3 | O tatuador deve poder **listar todas as imagens geradas por IA** para sua conta. |
| RF-07.4 | O tatuador deve poder **consultar uma imagem gerada** específica pelo ID. |
| RF-07.5 | O tatuador deve poder **excluir uma imagem gerada por IA**, removendo do S3 e do banco. |

---

### RF-08 — Busca de Tatuadores

| ID | Requisito |
|----|-----------|
| RF-08.1 | Qualquer usuário deve poder **buscar tatuadores** por nome (query livre), estilo de tatuagem e nota mínima de avaliação. |
| RF-08.2 | Deve ser possível **buscar tatuadores por bairro** (ID do bairro). |
| RF-08.3 | O sistema deve expor o **perfil público de um tatuador** (dados básicos, fotos, estilos e avaliações) por ID. |

---

### RF-09 — Avaliações (Reviews)

| ID | Requisito |
|----|-----------|
| RF-09.1 | O cliente deve poder **avaliar um tatuador** após uma sessão realizada (não cancelada), com nota de 1 a 5 e comentário de até 500 caracteres. |
| RF-09.2 | Não deve ser possível avaliar sessões **não concluídas ou canceladas**. |
| RF-09.3 | O cliente deve poder **listar suas próprias avaliações** ou as de um cliente específico (pertencente a ele). |
| RF-09.4 | O cliente deve poder **editar ou excluir** uma avaliação sua. |
| RF-09.5 | O tatuador ou cliente deve poder **responder a uma avaliação** (reply), com texto de até 500 caracteres. |
| RF-09.6 | Respostas de avaliações devem poder ser **listadas, editadas e excluídas** pelo autor. |
| RF-09.7 | As avaliações de um tatuador devem ser acessíveis **publicamente** pelo ID do tatuador. |

---

### RF-10 — Favoritos

| ID | Requisito |
|----|-----------|
| RF-10.1 | O cliente deve poder **favoritar ou desfavoritar** um tatuador (toggle). |
| RF-10.2 | O cliente deve poder **listar todos os tatuadores favoritados** ativos. |
| RF-10.3 | O cliente deve poder **verificar o status de favorito** de um tatuador específico. |

---

### RF-11 — Notificações

| ID | Requisito |
|----|-----------|
| RF-11.1 | O usuário autenticado deve poder **listar suas notificações** (máximo 100 mais recentes). |
| RF-11.2 | O usuário deve poder **marcar todas as notificações como lidas**. |
| RF-11.3 | O usuário deve poder **marcar uma notificação individual como lida**. |
| RF-11.4 | Notificações são geradas automaticamente para eventos de sessão: criação (`SESSION_CREATED`), cancelamento (`SESSION_CANCELED`) e sessão concluída/avaliação disponível (`REVIEW_AVAILABLE`). |

---

### RF-12 — Denúncias (Reports)

| ID | Requisito |
|----|-----------|
| RF-12.1 | Qualquer usuário autenticado deve poder **registrar uma denúncia** contra tatuador ou cliente, informando descrição, ID e nome do denunciado. |
| RF-12.2 | O usuário deve poder **consultar as próprias denúncias** registradas. |
| RF-12.3 | O administrador deve poder **listar todas as denúncias**, consultar por ID, atualizar status/resposta do moderador e excluir. |

---

### RF-13 — Estilos e Bairros (catálogos)

| ID | Requisito |
|----|-----------|
| RF-13.1 | O sistema deve expor um endpoint para **listar todos os estilos de tatuagem** disponíveis. |
| RF-13.2 | O sistema deve expor um endpoint para **listar todos os bairros** cadastrados. |

---

### RF-14 — Health Check

| ID | Requisito |
|----|-----------|
| RF-14.1 | O sistema deve expor um endpoint `/health` para **verificação de disponibilidade** da API (sem autenticação). |

---

## 2. Requisitos Não Funcionais

### RNF-01 — Segurança e Autenticação

| ID | Requisito |
|----|-----------|
| RNF-01.1 | Toda autenticação usa **JWT emitido pelo Supabase Auth**; o backend nunca emite tokens próprios. |
| RNF-01.2 | O middleware `authenticateToken` valida o token contra a API do Supabase a cada requisição protegida. |
| RNF-01.3 | O sistema implementa **controle de acesso baseado em papel (RBAC)** com três níveis: `tatuador`, `cliente` e `admin`. |
| RNF-01.4 | Rotas sensíveis de gestão (clientes, sessões, galeria, IA) são protegidas pelo middleware `requireTatuador` (aceita `tatuador` + `admin`). |
| RNF-01.5 | Rotas exclusivas do cliente mobile são protegidas pelo middleware `requireCliente` (aceita `cliente` + `admin`). |
| RNF-01.6 | Rotas de administração (denúncias, relatórios) são protegidas pelo middleware `requireAdmin`. |
| RNF-01.7 | Senhas são **hasheadas com bcrypt** (salt de 10 rounds) antes do armazenamento (via hook Sequelize `beforeCreate`). |
| RNF-01.8 | O e-mail tem formato validado pelo Sequelize; CPF tem validação algorítmica pela lib `cpf-cnpj-validator`. |
| RNF-01.9 | A exclusão de uma foto ou imagem IA verifica a **propriedade do recurso** antes de prosseguir. |

---

### RNF-02 — Validação de Dados

| ID | Requisito |
|----|-----------|
| RNF-02.1 | Todos os payloads de registro, login, criação/edição de sessão e atualização de perfil são validados com **Zod** (schemas tipados). |
| RNF-02.2 | Erros de validação retornam status **HTTP 400** com mensagem descritiva indicando os campos inválidos. |
| RNF-02.3 | O tamanho dos campos de texto (comentários, respostas, descrições) é limitado a **500 ou 480 caracteres** conforme o contexto. |
| RNF-02.4 | Notas de avaliação devem ser **inteiros de 1 a 5**. |
| RNF-02.5 | Datas de sessão são validadas pelo formato antes do processamento. |

---

### RNF-03 — Arquitetura e Organização

| ID | Requisito |
|----|-----------|
| RNF-03.1 | O projeto adota arquitetura **MVC em camadas**: routes → controllers → services → models. |
| RNF-03.2 | Cada módulo de negócio tem seu próprio controller, service, model e route independentes. |
| RNF-03.3 | O ORM Sequelize gerencia todas as operações de banco de dados com modelos definidos por entidade. |
| RNF-03.4 | A API segue convenções **RESTful** com verbos HTTP adequados (GET, POST, PUT/PATCH, DELETE) e códigos de status semânticos. |
| RNF-03.5 | A documentação da API é gerada automaticamente via **Swagger / OpenAPI** e acessível em `/docs`. |

---

### RNF-04 — Persistência e Armazenamento

| ID | Requisito |
|----|-----------|
| RNF-04.1 | O banco de dados relacional é **PostgreSQL**, gerenciado via Sequelize com migrations versionadas. |
| RNF-04.2 | Imagens de perfil, fotos de galeria e imagens geradas por IA são armazenadas em **bucket S3 compatível** (AWS SDK v2). |
| RNF-04.3 | As URLs das imagens são construídas combinando a variável de ambiente `PUBLIC_BUCKET_URL` com o caminho relativo armazenado no banco. |
| RNF-04.4 | O duplo registro (Supabase Auth + PostgreSQL local) mantém consistência por **rollback automático** em caso de falha parcial no cadastro. |

---

### RNF-05 — CORS e Integração

| ID | Requisito |
|----|-----------|
| RNF-05.1 | O servidor aplica política **CORS restritiva**: em produção, apenas a origin definida em `FRONTEND_URL` é aceita. |
| RNF-05.2 | Em desenvolvimento, uma lista de origens é aceita, incluindo localhost nas portas 5173, 8081, 8082, 19006 (Expo/React Native) e o emulador Android (`10.0.2.2`). |
| RNF-05.3 | Todas as respostas da API estão no formato **JSON**. |

---

### RNF-06 — Configuração por Ambiente

| ID | Requisito |
|----|-----------|
| RNF-06.1 | Todas as credenciais e URLs sensíveis são carregadas via **variáveis de ambiente** (`.env` + `dotenv`): `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `PUBLIC_BUCKET_URL`, `FRONTEND_URL`. |
| RNF-06.2 | O comportamento de CORS e URLs de redirecionamento muda automaticamente conforme `NODE_ENV`. |

---

### RNF-07 — Testes

| ID | Requisito |
|----|-----------|
| RNF-07.1 | O projeto possui suíte de testes automatizados com **Jest + Supertest** para os módulos de cliente, sessão, favorito e schemas de validação. |
| RNF-07.2 | Scripts de teste são configurados individualmente por módulo no `package.json`. |

---

### RNF-08 — Zona de Tempo

| ID | Requisito |
|----|-----------|
| RNF-08.1 | Datas e horários de sessão são armazenados como `TIMESTAMP WITHOUT TIME ZONE` e formatados para **America/Sao_Paulo** nas respostas da API. |

---

## 3. Entidades de Dados Principais

| Entidade | Campos-chave |
|----------|-------------|
| **User** | `user_id`, `nome`, `sobrenome`, `email`, `cpf`, `senha` (hash), `role` (cliente/tatuador/admin), `foto`, `bio`, `telefone`, `whatsapp`, `instagram`, `cidade`, `uf`, `bairro_id`, `data_nascimento`, `genero`, `estilo_favorito` |
| **Client** | `cliente_id`, `nome`, `cpf`, `telefone`, `descricao`, `endereco`, `user_id` (tatuador dono) |
| **Session (Sessao)** | `sessao_id`, `cliente_id`, `usuario_id` (tatuador), `data_atendimento`, `valor_sessao`, `numero_sessao`, `descricao`, `realizado`, `cancelado`, `motivo` |
| **Photo** | `photo_id`, `user_Id`, `url`, `descricao` |
| **GeneratedImage** | `id`, `user_id`, `url` |
| **Review** | `id`, `sessao_id`, `nota` (1-5), `comentario` |
| **ReviewReply** | `id`, `review_id`, `resposta`, `autor` (tatuador/cliente) |
| **Favorito** | `id`, `cliente_id`, `tatuador_id`, `ativo` |
| **Notification** | `notification_id`, `user_id`, `sessao_id`, `tipo`, `titulo`, `mensagem`, `lida` |
| **Report** | `id`, `descricao`, `denuncianteId`, `denunciadoId`, `tipoDenunciado`, `status`, `respostaModerador` |
| **Style** | `id`, `nome` (estilo de tatuagem) |
| **Bairro** | `bairro_id`, `nome` |
