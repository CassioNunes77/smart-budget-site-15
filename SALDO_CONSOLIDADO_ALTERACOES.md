# Alterações no Saldo Consolidado

## Resumo das Mudanças

Implementei a lógica cumulativa para o card de saldo consolidado conforme solicitado. As mudanças foram aplicadas nos seguintes arquivos:

### 1. `src/pages/Index.tsx`

**Nova função adicionada:**
- `getCumulativeConsolidatedBalance()`: Calcula o saldo consolidado de forma cumulativa

**Lógica implementada:**
- **Para filtros de período (semana, mês, trimestre)**: O saldo é cumulativo, incluindo TODAS as transações anteriores até o final do período selecionado
- **Para filtro de ano**: O saldo soma apenas as transações dentro daquele ano específico (não cumulativo)
- **Para "todos"**: Inclui todas as transações

**Alterações no dashboard:**
- Card de saldo consolidado agora usa `cumulativeConsolidatedBalance` em vez de `financialSummary.consolidatedBalance`
- Texto descritivo atualizado para indicar se é cumulativo ou apenas do ano
- Seção de relatórios também atualizada para usar o saldo cumulativo

### 2. `src/components/Dashboard.tsx`

**Função atualizada:**
- `consolidatedBalance` (useMemo): Implementada a mesma lógica cumulativa do Index.tsx

**Lógica implementada:**
- **Para período ano**: Soma apenas transações do ano selecionado
- **Para outros períodos**: Saldo cumulativo incluindo todas as transações até o final do período
- Texto descritivo atualizado para refletir a natureza cumulativa vs anual

## Comportamento Esperado

### Quando filtro está em "Ano" (ex: 2024):
- Saldo consolidado = receitas confirmadas - despesas pagas APENAS de 2024
- Texto: "Total de 2024"

### Quando filtro está em "Mês" (ex: Dezembro):
- Saldo consolidado = receitas confirmadas - despesas pagas de TODAS as transações até 31/12
- Texto: "Cumulativo até este mês"

### Quando filtro está em "Semana":
- Saldo consolidado = receitas confirmadas - despesas pagas de TODAS as transações até o final da semana atual
- Texto: "Cumulativo até esta semana"

### Quando filtro está em "Trimestre":
- Saldo consolidado = receitas confirmadas - despesas pagas de TODAS as transações até o final do trimestre atual
- Texto: "Cumulativo até este trimestre"

## Detalhes Técnicos

### Status das Transações Considerados:
- **Receitas**: Apenas com status 'received' ou sem status definido
- **Despesas**: Apenas com status 'paid' ou sem status definido

### Data Base para Filtros:
- **Index.tsx**: Usa `transaction.date` para filtrar períodos
- **Dashboard.tsx**: Usa `transaction.createdAt` como fallback para `new Date()` se não existir

### Diferenciação entre Períodos:
- A lógica especial para "ano" garante que apenas transações daquele ano sejam consideradas
- Para outros períodos, todas as transações anteriores são incluídas no cálculo cumulativo

## Validação

✅ Card de saldo consolidado agora funciona de forma cumulativa para períodos menores que ano
✅ Para filtro de ano, soma apenas transações daquele ano específico
✅ Textos descritivos atualizados para indicar o comportamento
✅ Alterações aplicadas tanto no dashboard principal quanto no componente Dashboard separado
✅ Mantida compatibilidade com o restante do sistema