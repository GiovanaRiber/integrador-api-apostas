# Bet3m

## Tecnologias

- Java 25
- Spring Boot

---

## Endpoints

Base URL rodando localmente: `http://localhost:8080/lutas`

Acessar remotamente: `https://bet3m-production.up.railway.app/lutas`

### Header

```
Key: X-API-KEY
Value: bet3M-UENP
```

---

### POST `/lutas` — Criar luta

**Body:**
```json
{
  "horario": "20:00:00",
  "data": "2025-06-15",
  "lutador1": 1,
  "lutador2": 2
}
```

**Resposta `201 Created`:**
```json
{
  "id": 1,
  "horario": "20:00:00",
  "data": "2025-06-15",
  "lutador1": 1,
  "lutador2": 2
}
```

---

### GET `/lutas` — Listar todas as lutas

**Resposta `200 OK`:**
```json
[
  {
    "id": 1,
    "horario": "20:00:00",
    "data": "2025-06-15",
    "lutador1": 1,
    "lutador2": 2
  }
]
```

---

### GET `/lutas/{id}` — Buscar luta por ID

**Resposta `200 OK`:**
```json
{
  "id": 1,
  "horario": "20:00:00",
  "data": "2025-06-15",
  "lutador1": 1,
  "lutador2": 2
}
```

---

### PUT `/lutas/{id}` — Atualizar luta

**Body:**
```json
{
  "horario": "21:00:00",
  "data": "2025-06-15",
  "lutador1": 1,
  "lutador2": 2
}
```

**Resposta `200 OK`:**
```json
{
  "id": 1,
  "horario": "21:00:00",
  "data": "2025-06-15",
  "lutador1": 1,
  "lutador2": 2
}
```

---

### DELETE `/lutas/{id}` — Deletar luta

**Resposta `204 No Content`**

---

## Erros

| Status | Descrição |
|--------|-----------|
| `400`  | Campo obrigatório ausente ou lutador1 igual a lutador2 |
| `404`  | Luta não encontrada para o ID informado |

**Exemplo de erro `400`:**
```json
{
  "status": "BAD_REQUEST",
  "message": "Lutador 1 e Lutador 2 não podem ser o mesmo"
}
```

**Exemplo de erro `404`:**
```json
{
  "status": "NOT_FOUND",
  "message": "Luta não encontrada para o id: 99"
}
```
