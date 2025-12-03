/**
 * Soul Scale calculation utilities
 * Requirements: 8.2, 8.3, 8.4 - Scale tilt based on soul balance
 */

/**
 * Maximum tilt angle in degrees
 */
export const MAX_TILT_ANGLE = 15;

/**
 * Calculates the tilt angle for the soul scale based on saved vs lost souls.
 * 
 * @param savedSouls - Number of saved souls
 * @param lostSouls - Number of lost souls
 * @returns Tilt angle in degrees:
 *   - Negative: saved side (left) tips down
 *   - Positive: lost side (right) tips down
 *   - Zero: balanced
 */
export function calculateScaleTilt(savedSouls: number, lostSouls: number): number {
  const total = savedSouls + lostSouls;
  
  // If no souls, scale is balanced
  if (total === 0) {
    return 0;
  }
  
  // Calculate the difference ratio (-1 to 1)
  // Negative when saved > lost, positive when lost > saved
  const ratio = (lostSouls - savedSouls) / total;
  
  // Scale to max tilt angle
  return ratio * MAX_TILT_ANGLE;
}

/**
 * Returns the balance state as a string for styling purposes
 */
export function getScaleState(savedSouls: number, lostSouls: number): 'saved' | 'lost' | 'balanced' {
  if (savedSouls > lostSouls) return 'saved';
  if (lostSouls > savedSouls) return 'lost';
  return 'balanced';
}
