# API de Apostadores

Esta é uma API desenvolvida com FastAPI para o gerenciamento de apostadores. O projeto foi estruturado para ser implantado no Render, utilizando PostgreSQL em produção e SQLite para desenvolvimento local, contando com uma camada de segurança via criptografia assimétrica RSA.

---

## Tecnologias

*   **Linguagem:** Python 3.10+
*   **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
*   **Banco de Dados:** PostgreSQL (Produção) / SQLite (Dev)
*   **ORM:** SQLAlchemy
*   **Segurança:** Cryptography (RSA-2048) + Fail-Fast Design
*   **Ambiente:** `python-dotenv` para variáveis de ambiente locais
*   **Servidor:** Uvicorn

---

## Medidas de Segurança (Criptografia Assimétrica RSA)

Para proteger os dados sensíveis dos usuários (como a Chave PIX), implementamos criptografia em repouso com um sistema de Fail-Fast:
*   **Criptografia Assimétrica (RSA):** Os dados são criptografados com uma Chave Pública antes de serem salvos no banco de dados. A leitura só é possível através da Chave Privada correspondente, mantida em segredo no servidor.
*   **Fail-Fast Design:** A API não inicia se não detectar as variáveis de ambiente `PRIVATE_KEY` e `PUBLIC_KEY`. Isso garante a integridade do sistema desde o primeiro segundo de execução.
*   **Isolamento de Segredos:** As chaves criptográficas nunca são expostas no código-fonte, sendo gerenciadas exclusivamente via `.env` (localmente) ou Painel do Render (produção).

---

## Acesso Online

*   **API Base:** https://api-sd-df8o.onrender.com
*   **Documentação Interativa (Swagger):** https://api-sd-df8o.onrender.com/docs

---

## Endpoints Principais

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/apostadores/` | Lista todos os apostadores cadastrados (PIX descriptografado). |
| **POST** | `/apostadores/` | Cria um novo registro (Chave PIX é criptografada no banco). |
| **PUT** | `/apostadores/{id}` | Atualiza os dados de um apostador. |
| **DELETE** | `/apostadores/{id}` | Remove um apostador do sistema. |

### Exemplo de JSON para Criação (POST):
```json
{
  "nome": "João Silva",
  "idade": 25,
  "chave_pix": "joao@email.com"
}
```

## Instalação e Execução Local
1. Clone o repositório:
```bash
git clone [https://github.com/m-valentim/api-sd.git](https://github.com/m-valentim/api-sd.git)
cd api-sd
```

2. Crie um ambiente virtual e instale as dependências:

```bash
python -m venv venv
venv\Scripts\activate  # No linux ou  macOS: venv/bin/activate
pip install -r requirements.txt
```

3. Gere o par de chaves RSA:
Para o funcionamento da criptografia, você precisa gerar as chaves em formato compatível. Execute o arquivo script.py para obtê-las:

```bash
python script.py
```

4. Configure o arquivo .env:

Crie um arquivo chamado .env na raiz do projeto e cole exatamente o conteúdo gerado pelo passo anterior:

```bash
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."
```

5. Inicie o servidor:
```bash
uvicorn main:app --reload
```

A API estará disponível em http://127.0.0.1:8000.