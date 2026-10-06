/**
 * ==============================================================================
 * RutaAduana - Configuración Centralizada de Google AdSense
 * ==============================================================================
 */

const ADS_CONFIG = {
  client: "ca-pub-XXXXXXXXXXXXXXXX",
  enabled: false,
  slots: {
    header: "3000000001",
    inArticle: "3000000002",
    sidebar: "3000000003",
    footer: "3000000004"
  }
};

function initAdSense() {
  const adContainers = document.querySelectorAll('.ad-box[data-ad-slot]');

  if (!ADS_CONFIG.enabled || ADS_CONFIG.client.includes('XXXXXXXX')) {
    adContainers.forEach(container => {
      const slotType = container.getAttribute('data-ad-slot');
      let sizeText = "Banner Responsivo Aduanal";
      if (slotType === 'header') sizeText = "Banner Superior (728x90)";
      if (slotType === 'sidebar') sizeText = "Banner Lateral (300x250 / 300x600)";
      if (slotType === 'inArticle') sizeText = "Anuncio en Artículo";
      if (slotType === 'footer') sizeText = "Banner Inferior (970x90)";

      container.innerHTML = `
        <div style="font-size:0.85rem; line-height:1.4; padding:10px; text-align:center;">
          <strong>Espacio Publicitario AdSense</strong><br>
          <small>${sizeText}</small><br>
          <span style="font-size:0.72rem; color:#94a3b8; display:inline-block; margin-top:4px;">
            Configurar en js/ads-config.js
          </span>
        </div>
      `;
    });
    return;
  }

  if (!document.getElementById('adsense-script')) {
    const script = document.createElement('script');
    script.id = 'adsense-script';
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.client}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }

  adContainers.forEach(container => {
    const slotType = container.getAttribute('data-ad-slot');
    const slotId = ADS_CONFIG.slots[slotType] || '';
    if (!slotId) return;

    container.innerHTML = `
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="${ADS_CONFIG.client}"
           data-ad-slot="${slotId}"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    `;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense no inicializado:", e);
    }
  });
}

document.addEventListener('DOMContentLoaded', initAdSense);
