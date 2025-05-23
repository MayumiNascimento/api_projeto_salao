# API REST do sistema de gerenciamento para salão de beleza.

## ✅ Requisitos

- Node.js **v22.13**
- Banco de dados relacional (**MySQL**)

## Como rodar o projeto

1. **Clone o repositório**

   ```bash
   git clone https://github.com/MayumiNascimento/api_projeto_salao.git
   ```
1.5 **se der tudo certo:** 
  
  ```bash
  cd api_projeto_salao
   ````

2. **Instale as dependências utilizando:**
   ```bash
   npm install
   ```

3. **configure o ambiente**
   <ul>
     <li>Crie um arquivo .env na raiz do projeto.</li>
     <li>Utilize o arquivo .env.example como base.</li>
     <li>Preencha os campos necessários, como as credenciais do banco de dados e a porta da aplicação.</li>
   </ul>

4. **Inicie o servidor**
     ```bash
       node src/server.js

O servidor será iniciado e a API estará disponível no endereço definido no seu arquivo .env (por exemplo, http://localhost:3000).
