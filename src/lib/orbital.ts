/**
 * Orbital calculation utilities for ghost positioning
 * Requirements: 2.2 - Distribute ghosts evenly around orbital path
 */

export interface OrbitValues {
  baseAngle: number;
  startAngle: number;
  orbitRadius: number;
  duration: number;
  direction: number;
}

/**
 * Calculates the base angle for a ghost at a given index
 * Ensures even distribution around the orbit
 * 
 * @param index - The index of the ghost (0-based)
 * @param total - Total number of ghosts
 * @returns The base angle in degrees (0-360)
 */
export function calculateBaseAngle(index: number, total: number): number {
  if (total <= 0) return 0;
  return (360 / total) * index;
}

/**
 * Calculates full orbit values for a ghost
 * 
 * @param taskId - The task ID (used as seed for variation)
 * @param index - The index of the ghost
 * @param total - Total number of ghosts
 * @returns OrbitValues with all positioning data
 */
export function calculateOrbitValues(
  taskId: string,
  index: number,
  total: number
): OrbitValues {
  const seed = parseInt(taskId) || Date.now();
  const baseAngle = calculateBaseAngle(index, total);
  const angleOffset = (seed % 30) - 15; // -15 to +15 degree variation

  return {
    baseAngle,
    startAngle: baseAngle + angleOffset,
    orbitRadius: 250 + (index % 3) * 80,
    duration: 20 + (seed % 15),
    direction: seed % 2 === 0 ? 1 : -1,
  };
}
