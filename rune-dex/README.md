# RuneDex 🎮

Uma calculadora online para ajudar jogadores de **PXG** a gerenciar e planejar o progresso no sistema de runas.

## 🎯 Objetivo

O **RuneDex** permite que jogadores de PXG possam:
- Pesquisar Pokémon e visualizar suas imagens
- Calcular automaticamente quantos **pokelog** já possuem
- Planejar quanto falta para atingir suas metas de runas
- Gerenciar seu progresso de forma organizada

## 🛠️ Tecnologias

- **Framework**: Next.js 15 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Linting**: ESLint
- **Deploy**: Vercel
- **APIs**: 
  - PokeAPI para imagens dos Pokémon
  - API customizada para dados de pokelog

## 🚀 Como executar

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📁 Estrutura do Projeto

```
src/
├── app/                 # App Router do Next.js
├── components/          # Componentes reutilizáveis
├── lib/                # Utilitários e configurações
├── types/              # Definições TypeScript
└── api/                # Rotas da API
```

## 🔧 Funcionalidades Planejadas

- [x] Configuração inicial do projeto
- [ ] Interface de pesquisa de Pokémon
- [ ] Integração com PokeAPI
- [ ] Sistema de cálculo de pokelog
- [ ] API de dados de runas
- [ ] Dashboard de progresso
- [ ] Sistema de metas

## 📝 Como contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
