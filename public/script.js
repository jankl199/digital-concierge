const i18n = {
  de: {
    solutions:'Lösungen',support:'Support',customers:'Customers',pricing:'Pricing',cta:'Demo buchen',
    arrivals:'Arrivals',duringstay:'During Stay',departures:'Departures',contactless:'Contactless Check-in',idverify:'ID Verification',prearrival:'Pre-arrival Messaging',conciergeAi:'AI Concierge',serviceReq:'Service Requests',upsell:'Upsell Automation',checkout:'Express Check-out',invoice:'Digital Invoice',review:'Review Requests',
    heroTitle:'Der digitale Concierge für moderne Hotels & Ferienunterkünfte',
    heroLead:'Automatisiere Gästeanfragen in Sekunden: von Contactless Check-in über lokale Empfehlungen bis zum digitalen Check-out.',
    heroCta1:'Kostenlose Demo',heroCta2:'Produkt ansehen',kpi1:'Zusatzumsatz',kpi2:'Frontdesk-Last',kpi3:'Guest Rating',
    secSolutions:'Lösungen für den gesamten Guest Journey Flow',
    s1t:'Contactless Check-in',s1d:'Digitales Pre-Check-in, Dokumenten-Upload und sichere Anreiseinfos.',
    s2t:'AI Guest Messaging',s2d:'24/7 Antworten via WhatsApp in DE, EN und ES mit Übergabe an Staff.',
    s3t:'Upsell Engine',s3d:'Automatische Angebote für Late Checkout, Transfers, Surfkurse und Add-ons.',
    s4t:'Departure & Reviews',s4d:'Automatisierter Checkout, Rechnungen und Bewertungsanfragen.',
    secGM:'See Results with ConciergeFlow',secGMd:'Von Boutique-Hotel bis Resort: Teams reduzieren operative Last und verbessern gleichzeitig die Guest Experience.',
    g1:'Schnellere Antworten auf häufige Gästeanfragen',g2:'Mehr Direktumsatz durch personalisierte Angebote',g3:'Nahtlose Übergabe an Rezeption / Guest Relations',
    caseTitle:'Case Studies',cs1:'+22% Upsell-Umsatz in 60 Tagen mit WhatsApp Journeys.',cs2:'-37% Frontdesk-Tickets durch automatisierte Concierge-Antworten.',cs3:'4.8★ Gästebewertung nach Einführung digitaler Check-in-Flows.',
    pricingTitle:'Pricing',p1:'1 Property · WhatsApp Concierge · FAQ Automation',p2:'Bis 5 Properties · Upsells · Multi-language · Basic Analytics',p3:'Unlimitierte Properties · PMS Integration · SLA & Onboarding',
    faqTitle:'FAQ',q1:'Kann der Concierge auf Deutsch, Englisch und Spanisch antworten?',a1:'Ja, Sprache wird automatisch erkannt und die Antwort entsprechend geliefert.',q2:'Ist eine Übergabe an Mitarbeiter möglich?',a2:'Ja, bei Sonderfällen eskaliert der Bot direkt an dein Team.',q3:'Welche Kanäle werden unterstützt?',a3:'WhatsApp, SMS und Webchat. Weitere Kanäle sind auf Anfrage möglich.'
  },
  en: {
    solutions:'Solutions',support:'Support',customers:'Customers',pricing:'Pricing',cta:'Book Demo',
    arrivals:'Arrivals',duringstay:'During Stay',departures:'Departures',contactless:'Contactless Check-in',idverify:'ID Verification',prearrival:'Pre-arrival Messaging',conciergeAi:'AI Concierge',serviceReq:'Service Requests',upsell:'Upsell Automation',checkout:'Express Check-out',invoice:'Digital Invoice',review:'Review Requests',
    heroTitle:'Digital concierge for modern hotels & vacation rentals',
    heroLead:'Automate guest requests in seconds: from contactless check-in to local recommendations and digital check-out.',
    heroCta1:'Get Demo',heroCta2:'See Product',kpi1:'Ancillary Revenue',kpi2:'Front Desk Load',kpi3:'Guest Rating',
    secSolutions:'Solutions across the entire guest journey',
    s1t:'Contactless Check-in',s1d:'Digital pre-check-in, document upload, and secure arrival instructions.',
    s2t:'AI Guest Messaging',s2d:'24/7 answers in WhatsApp across DE, EN, ES with escalation to staff.',
    s3t:'Upsell Engine',s3d:'Automated offers for late check-out, transfers, surf classes, and add-ons.',
    s4t:'Departure & Reviews',s4d:'Automated check-out, invoices, and review requests.',
    secGM:'See Results with ConciergeFlow',secGMd:'From boutique hotels to resorts, teams reduce operational load while improving guest experience.',
    g1:'Faster answers for repetitive guest requests',g2:'More direct revenue via personalized offers',g3:'Seamless handover to front desk / guest relations',
    caseTitle:'Case Studies',cs1:'+22% upsell revenue in 60 days with WhatsApp journeys.',cs2:'-37% front desk tickets through automated concierge responses.',cs3:'4.8★ guest rating after digital check-in roll-out.',
    pricingTitle:'Pricing',p1:'1 property · WhatsApp concierge · FAQ automation',p2:'Up to 5 properties · Upsells · Multi-language · Basic analytics',p3:'Unlimited properties · PMS integrations · SLA & onboarding',
    faqTitle:'FAQ',q1:'Can the concierge reply in German, English, and Spanish?',a1:'Yes, language is detected automatically and responses match the guest language.',q2:'Can requests be handed over to staff?',a2:'Yes, special cases are escalated to your team instantly.',q3:'Which channels are supported?',a3:'WhatsApp, SMS, and webchat. Additional channels are available on request.'
  }
};

let lang='de';
const btn=document.getElementById('langBtn');
const solutionsMenu=document.getElementById('solutionsMenu');

function render(){document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n; if(i18n[lang][k]) el.textContent=i18n[lang][k];});btn.textContent=lang==='de'?'EN':'DE';}
btn.addEventListener('click',()=>{lang=lang==='de'?'en':'de';render();});

if(solutionsMenu){
  const trigger=solutionsMenu.querySelector('.menu-btn');
  trigger.addEventListener('click',()=>solutionsMenu.classList.toggle('open'));
  document.addEventListener('click',(e)=>{if(!solutionsMenu.contains(e.target)) solutionsMenu.classList.remove('open');});
}

const leadForm = document.getElementById('leadForm');
if (leadForm) {
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = leadForm.querySelector('button[type="submit"]');
    const old = btn.textContent;
    btn.textContent = lang === 'de' ? 'Danke! Wir melden uns.' : 'Thanks! We will contact you.';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = old;
      btn.disabled = false;
      leadForm.reset();
    }, 1800);
  });
}

render();
