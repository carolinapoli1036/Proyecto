// Calcula el CO2 mitigado al finalizar un viaje
// Fórmula: distancia (km) × 0.143 × pasajeros que abordaron

export interface ViajeFinalizado {
  distanciaKm: number;
  pasajerosConfirmados: number; // COUNT de abordaje_confirmado = 1
}

export const calcularCO2 = (viaje: ViajeFinalizado): number => {
  const FACTOR_EMISION = 0.143; // kg CO2 por km en Colombia
  if (viaje.pasajerosConfirmados === 0) return 0;
  return Math.round(viaje.distanciaKm * FACTOR_EMISION * viaje.pasajerosConfirmados * 100) / 100;
};