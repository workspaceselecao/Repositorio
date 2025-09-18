# 🤖 Regras para o Desenvolvimento com IA (AI_RULES.md)

Este documento estabelece as diretrizes e a stack tecnológica para o desenvolvimento e manutenção da aplicação "Repositório de Vagas". Ele serve como um guia para garantir consistência, performance e segurança no código.

## 🚀 Stack Tecnológica

A aplicação "Repositório de Vagas" é construída com as seguintes tecnologias principais:

*   **Frontend Framework**: Next.js 14 (com App Router) para renderização de componentes React e roteamento.
*   **Linguagem**: TypeScript para tipagem estática e melhor manutenibilidade do código.
*   **Estilização**: Tailwind CSS para um desenvolvimento rápido e consistente da interface do usuário.
*   **Componentes UI**: React 18 e componentes da biblioteca shadcn/ui para elementos de interface pré-construídos e acessíveis.
*   **Ícones**: Heroicons para uma coleção de ícones vetoriais limpos e consistentes.
*   **Backend & Banco de Dados**: Supabase (PostgreSQL) como Backend-as-a-Service (BaaS) para banco de dados, autenticação e APIs.
*   **Autenticação**: Supabase Auth para gerenciamento de usuários e sessões.
*   **Implantação**: Vercel para hospedagem e deploy contínuo da aplicação.
*   **PWA**: Implementação de Progressive Web App (PWA) com Service Workers e Web App Manifest para funcionalidades offline e instalabilidade.
*   **Manipulação de Excel**: Biblioteca `xlsx` para importação e exportação de dados em formato Excel.

## 📚 Regras de Uso de Bibliotecas e Ferramentas

Para manter a consistência e a qualidade do código, siga as seguintes regras ao desenvolver ou modificar a aplicação:

1.  **UI e Estilização**:
    *   **Tailwind CSS**: **Sempre** utilize classes do Tailwind CSS para toda a estilização. Evite CSS inline ou arquivos CSS personalizados, exceto para `src/app/globals.css` para estilos globais.
    *   **shadcn/ui**: **Priorize** o uso de componentes do shadcn/ui sempre que houver uma necessidade de UI que possa ser atendida por eles. Se um componente shadcn/ui não existir ou precisar de modificações significativas, crie um novo componente em `src/components/`.

2.  **Componentes e Estrutura**:
    *   **React Components**: Crie novos componentes em `src/components/`. Mantenha os componentes pequenos e focados em uma única responsabilidade.
    *   **Páginas**: As páginas da aplicação devem ser criadas em `src/app/` seguindo a estrutura do App Router do Next.js (ex: `src/app/dashboard/page.tsx`).
    *   **Hooks**: Crie hooks personalizados em `src/hooks/` para lógica reutilizável e separação de preocupações.

3.  **Dados e Backend**:
    *   **Supabase**: Todas as interações com o banco de dados e autenticação devem ser feitas através do cliente Supabase (`@supabase/supabase-js`).
    *   **RLS**: Confie na Row Level Security (RLS) do Supabase para controle de acesso a dados. Não tente reimplementar a lógica de permissões no frontend.

4.  **Roteamento**:
    *   **Next.js App Router**: Utilize o sistema de roteamento baseado em arquivos do Next.js 14 (`src/app/`).

5.  **Ícones**:
    *   **Heroicons**: Use ícones da biblioteca `@heroicons/react` para todos os elementos visuais de ícones.

6.  **Manipulação de Arquivos (Excel)**:
    *   **XLSX**: Para qualquer funcionalidade de importação ou exportação de dados em formato Excel, utilize a biblioteca `xlsx`.

7.  **PWA**:
    *   **Service Worker**: O arquivo `public/sw.js` gerencia o cache e o comportamento offline. Modifique-o com cautela.
    *   **Manifest**: O arquivo `public/manifest.json` define as propriedades do PWA.

8.  **Performance**:
    *   Utilize os hooks de performance (`useDebounce`, `usePagination`, `usePerformanceMetrics`, `useVirtualization`, `useCache`) para otimizar a experiência do usuário e monitorar o desempenho.

9.  **Tipagem**:
    *   **TypeScript**: Todos os novos arquivos e modificações devem ser escritos em TypeScript, utilizando as interfaces e tipos definidos em `src/types/index.ts` ou criando novos quando necessário.

Ao seguir estas regras, garantimos um desenvolvimento coeso, eficiente e de alta qualidade para o Repositório de Vagas.