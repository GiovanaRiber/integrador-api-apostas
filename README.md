# Integrador de APIs - Sistema de Apostas em Lutas

## Sobre o Projeto

Este projeto é um painel integrador desenvolvido em Next.js para unificar e gerenciar quatro APIs independentes que compõem um ecossistema de apostas em lutas. 

A aplicacao atua como um hub central, permitindo a gestão de apostadores, lutadores, lutas e as apostas financeiras em uma interface única, abstraindo as diferentes camadas de segurança e os protocolos exigidos por cada microsserviço externo.

## APIs Integradas e Protocolos de Segurança

O painel se comunica simultaneamente com os seguintes serviços:

1. **Apostadores** (`/api/apostadores`)
   - Objetivo: Gerenciar o cadastro e a listagem de apostadores (nome, idade, chave PIX).
   - Segurança: Criptografia RSA nativa e transparente aplicada pelo servidor destino.

2. **Lutadores** (`/api/lutadores`)
   - Objetivo: Gerenciar os dados e categorias dos atletas.
   - Segurança: Implementa criptografia bidirecional RSA-OAEP. O sistema realiza um handshake automático na primeira requisição para troca de chaves públicas com o servidor. Requisições e respostas são criptografadas localmente pelo Node.js.

3. **Lutas** (`/api/lutas`)
   - Objetivo: Gerenciar a marcação de embates (data, horário e os IDs dos lutadores envolvidos).
   - Segurança: Requer validação via chave de API estática (`X-API-KEY`) embutida nos cabeçalhos das requisições pelo backend.

4. **Apostas** (`/api/apostas`)
   - Objetivo: Registrar e listar transações financeiras e o vínculo entre o apostador, o lutador escolhido e a luta.
   - Segurança: Autenticação baseada em token JWT. As credenciais do usuário são solicitadas na interface e enviadas para validar a sessão global.

## Requisitos e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- NPM ou Yarn

### Passos para executar localmente

1. Navegue até o diretório raiz do projeto no terminal.
2. Instale as dependências requeridas:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse a aplicação no navegador através do endereço: `http://localhost:3000`.

## Guia de Uso

1. **Autenticação Inicial**: Ao acessar a interface, o sistema exige uma autenticação para liberar o dashboard. O usuário e a senha fornecidos são autenticados na API de Apostas para obtenção do token JWT. Contas novas são registradas automaticamente.
2. **Navegação**: Após o login, o painel disponibiliza quatro módulos principais de gerência representados por abas no topo da tela.
3. **Gestão de Registros**:
   - Para inserir dados, utilize o botão de criação em cada painel. Um formulário estruturado será apresentado.
   - A exclusão de registros pode ser feita individualmente na tabela de listagem de cada entidade.
4. **Dependências Lógicas**: Ao registrar "Lutas" ou "Apostas", é imprescindível informar as chaves primárias (IDs) válidas referentes aos Lutadores ou Apostadores criados previamente nas outras seções.

## Arquitetura Básica

- `/src/app/page.jsx`: Interface de usuário, componentes React e regras de renderização (Client-side).
- `/src/app/api/...`: Controladores backend que isolam a aplicação das APIs externas, atuando como proxy reverso para aplicar cabeçalhos e chaves de segurança.
- `/src/lib/...`: Módulos de serviço responsáveis pela criptografia, decodificação e gerenciamento de estados sensíveis (como os tokens RSA e JWT).
