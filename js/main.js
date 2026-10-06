/**
 * ==============================================================================
 * RutaAduana - Lógica de Calculadora de Importación (Landed Cost) & Navegación
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCookieBanner();
  initLandedCostCalculator();
});

function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }
}

function initCookieBanner() {
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (!cookieBanner) return;

  if (!localStorage.getItem('rutaaduana_cookie_consent')) {
    cookieBanner.style.display = 'block';
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('rutaaduana_cookie_consent', 'accepted');
      cookieBanner.style.display = 'none';
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('rutaaduana_cookie_consent', 'declined');
      cookieBanner.style.display = 'none';
    });
  }
}

/* ==============================================================================
   Calculadora de Landed Cost (Coste en Destino de Importación)
   Fórmula de Comercio Exterior:
   Valor en Aduana (CIF) = Valor Mercancía (FOB) + Flete Internacional + Seguro
   Arancel = CIF * % Arancel (TARIC / HS)
   Base Imponible IVA = CIF + Arancel + Gastos Portuarios Terminales (THC)
   IVA Aduana = Base Imponible IVA * % IVA
   Coste Total en Almacén = CIF + Arancel + Gastos Despacho (+ IVA si no deducible)
   ============================================================================== */
function initLandedCostCalculator() {
  const form = document.getElementById('landed-calc-form');
  if (!form) return;

  const unitsInput = document.getElementById('calc-units');
  const fobUnitInput = document.getElementById('calc-fob-unit');
  const freightInput = document.getElementById('calc-freight');
  const insuranceInput = document.getElementById('calc-insurance');
  const tariffPercentInput = document.getElementById('calc-tariff-pct');
  const vatPercentInput = document.getElementById('calc-vat-pct');
  const customsFeeInput = document.getElementById('calc-customs-fee');
  const markupPercentInput = document.getElementById('calc-target-margin');

  // Outputs
  const outCifTotal = document.getElementById('res-cif-total');
  const outTariff = document.getElementById('res-duty-amount');
  const outVat = document.getElementById('res-vat-amount');
  const outTotalImport = document.getElementById('res-total-landed');
  const outUnitCost = document.getElementById('res-unit-cost');
  const outSuggestedPvp = document.getElementById('res-suggested-pvp');

  function calculate() {
    const units = Math.max(1, parseInt(unitsInput.value, 10) || 500);
    const unitFob = parseFloat(fobUnitInput.value) || 5;
    const totalFob = units * unitFob;

    const freight = parseFloat(freightInput.value) || 800;
    const insurance = parseFloat(insuranceInput.value) || 50;
    const tariffPct = (parseFloat(tariffPercentInput.value) || 4.5) / 100;
    const vatPct = (parseFloat(vatPercentInput.value) || 21) / 100;
    const customsFees = parseFloat(customsFeeInput.value) || 180;
    const marginPct = (parseFloat(markupPercentInput.value) || 50) / 100;

    // 1. Valor CIF (Base en aduana)
    const cifTotal = totalFob + freight + insurance;

    // 2. Arancel de importación
    const dutyAmount = cifTotal * tariffPct;

    // 3. Base Imponible IVA
    const vatBase = cifTotal + dutyAmount + customsFees;
    const vatAmount = vatBase * vatPct;

    // 4. Coste Total en Almacén (Para empresa que desgrava IVA: CIF + Arancel + Gastos)
    const totalCostWithoutVat = cifTotal + dutyAmount + customsFees;
    const costPerUnit = totalCostWithoutVat / units;

    // 5. PVP Recomendado con Margen Bruto
    // PVP sin IVA = Coste / (1 - Margen)
    const pvpWithoutVat = costPerUnit / (1 - marginPct);
    const pvpWithVat = pvpWithoutVat * (1 + vatPct);

    if (outCifTotal) outCifTotal.textContent = cifTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $ / €';
    if (outTariff) outTariff.textContent = dutyAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $ / €';
    if (outVat) outVat.textContent = vatAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $ / €';
    if (outTotalImport) outTotalImport.textContent = totalCostWithoutVat.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $ / €';
    if (outUnitCost) outUnitCost.textContent = costPerUnit.toFixed(2) + ' €/ud.';
    if (outSuggestedPvp) outSuggestedPvp.textContent = pvpWithVat.toFixed(2) + ' € (IVA inc.)';
  }

  form.addEventListener('input', calculate);
  calculate();
}
