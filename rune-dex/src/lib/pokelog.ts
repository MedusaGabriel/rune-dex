import { RuneGoal } from '@/types/pokemon';

/**
 * Calcula o pokelog necessário para atingir determinado nível de runa
 */
export function calculateRequiredPokelog(targetLevel: number): number {
  // Esta é uma função placeholder - você precisará implementar
  // a lógica real baseada no sistema de runas do PXG
  
  // Exemplo de cálculo progressivo (substitua pela lógica real)
  let total = 0;
  for (let level = 1; level <= targetLevel; level++) {
    total += level * 100; // Placeholder: 100 pokelog base * nível
  }
  return total;
}

/**
 * Calcula o progresso atual em direção a uma meta
 */
export function calculateProgress(currentPokelog: number, requiredPokelog: number): number {
  if (requiredPokelog === 0) return 100;
  return Math.min((currentPokelog / requiredPokelog) * 100, 100);
}

/**
 * Calcula quantos pokelog faltam para a meta
 */
export function calculateRemainingPokelog(currentPokelog: number, requiredPokelog: number): number {
  return Math.max(requiredPokelog - currentPokelog, 0);
}

/**
 * Formata número de pokelog para exibição
 */
export function formatPokelog(pokelog: number): string {
  if (pokelog >= 1000000) {
    return `${(pokelog / 1000000).toFixed(1)}M`;
  }
  if (pokelog >= 1000) {
    return `${(pokelog / 1000).toFixed(1)}K`;
  }
  return pokelog.toString();
}

/**
 * Calcula estimativa de tempo para completar meta
 * baseado na taxa de farm diária
 */
export function estimateTimeToComplete(
  remainingPokelog: number, 
  dailyFarmRate: number
): { days: number; weeks: number; months: number } {
  if (dailyFarmRate === 0) {
    return { days: Infinity, weeks: Infinity, months: Infinity };
  }
  
  const days = Math.ceil(remainingPokelog / dailyFarmRate);
  const weeks = Math.ceil(days / 7);
  const months = Math.ceil(days / 30);
  
  return { days, weeks, months };
}

/**
 * Cria uma nova meta de runa
 */
export function createRuneGoal(
  pokemonId: number,
  pokemonName: string,
  targetLevel: number,
  currentPokelog: number = 0
): RuneGoal {
  const requiredPokelog = calculateRequiredPokelog(targetLevel);
  const progress = calculateProgress(currentPokelog, requiredPokelog);
  
  return {
    id: `${pokemonId}-${targetLevel}-${Date.now()}`,
    pokemonId,
    pokemonName,
    targetLevel,
    currentPokelog,
    requiredPokelog,
    progress
  };
}

/**
 * Atualiza o progresso de uma meta existente
 */
export function updateRuneGoalProgress(goal: RuneGoal, newPokelog: number): RuneGoal {
  const progress = calculateProgress(newPokelog, goal.requiredPokelog);
  
  return {
    ...goal,
    currentPokelog: newPokelog,
    progress
  };
}
