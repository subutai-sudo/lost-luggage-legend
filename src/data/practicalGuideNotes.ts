export interface PracticalGuideSource {
  id: string
  label: string
  url: string
  checkedOn: string
}

export interface PracticalGuideSection {
  kind: 'short-visit' | 'getting-around' | 'respect-and-access' | 'before-booking'
  title: string
  body: string
  sourceIds: string[]
}

export interface PracticalGuideNote {
  guideId: string
  sections: PracticalGuideSection[]
  sources: PracticalGuideSource[]
}

// First editorial batch only. Source dates apply to these notes, not inherited article estimates.
export const PRACTICAL_GUIDE_NOTES: Record<string, PracticalGuideNote> = {
  'mexico-city': {
    guideId: 'mexico-city',
    sections: [
      {
        kind: 'short-visit',
        title: 'Give Coyoacán its own visit',
        body: 'For a short visit built around Frida Kahlo’s Casa Azul, make Coyoacán the focus rather than adding a cross-city checklist. Start with an available museum entry, then leave space for a neighbourhood meal. If you only have an evening, check the museum’s dated booking calendar first: extended evening sessions are specific programmes, not a promise that ordinary admission runs late every day.',
        sourceIds: ['frida-visit', 'frida-tickets'],
      },
      {
        kind: 'getting-around',
        title: 'Plan the journey to the actual entrance',
        body: 'Map your journey to Londres 247 in Colonia Del Carmen, Coyoacán, using your hotel as the starting point. Compare the whole transit journey, including its walking leg, with a prearranged ride; leave a buffer before your entry. The museum’s ticket page says it has no parking facilities, so a rental car is not a parking solution you can assume at the door.',
        sourceIds: ['frida-visit', 'frida-tickets'],
      },
      {
        kind: 'respect-and-access',
        title: 'Travel light for Casa Azul',
        body: 'Read the museum’s bag and visitor rules before setting out. Suitcases are not allowed, and larger bags and several other items must be left at the coat check. This is a preserved house, not a purpose-built gallery: the ticket page describes only some areas as wheelchair accessible. Ask the museum about the particular spaces and assistance you need before choosing an entry.',
        sourceIds: ['frida-visit', 'frida-tickets'],
      },
      {
        kind: 'before-booking',
        title: 'Secure the museum before the rest of the day',
        body: 'There are no in-person ticket sales according to the museum’s visit page. Follow its official booking link, check the selected date and admission category, and keep the confirmation available offline. Check holiday closures and temporary exhibition notices separately from ordinary weekly hours. If no suitable entry is available, keep a neighbourhood visit optional rather than buying transport on the assumption that a museum ticket can be found on arrival.',
        sourceIds: ['frida-visit', 'frida-tickets'],
      },
    ],
    sources: [
      { id: 'frida-visit', label: 'Museo Frida Kahlo — visits and house rules', url: 'https://www.museofridakahlo.org.mx/visit/?lang=en', checkedOn: '2026-11-20' },
      { id: 'frida-tickets', label: 'Museo Frida Kahlo — official ticket calendar', url: 'https://boletos.museofridakahlo.org.mx/en/tickets/museo-frida-kahlo-cdmx', checkedOn: '2026-11-20' },
    ],
  },
  kyoto: {
    guideId: 'kyoto',
    sections: [
      {
        kind: 'short-visit',
        title: 'Choose one part of Kyoto',
        body: 'For a short central-city visit, pair Nishiki Market with the surrounding shopping streets rather than trying to add Arashiyama and the eastern temples. For an evening, consider Gion’s public streets and a meal instead, checking individual businesses before leaving. A street walk is not admission to a temple garden or a private lane; only add a night opening when that venue advertises it for your date.',
        sourceIds: ['kyoto-access', 'kyoto-manners'],
      },
      {
        kind: 'getting-around',
        title: 'Use rail for the main leg',
        body: 'Kyoto’s tourism association recommends the Karasuma subway from Kyoto Station to Shijo for Nishiki Market, followed by a walk. It discourages taking the city bus to this central area because of congestion at stops, on board and on the roads. Store large luggage before sightseeing instead of carrying it onto a crowded bus, and check the return route before committing to a distant dinner.',
        sourceIds: ['kyoto-access', 'kyoto-manners'],
      },
      {
        kind: 'respect-and-access',
        title: 'Eat at the stall, not while walking',
        body: 'At Nishiki Market, do not eat while walking: use the shop’s eating space or the area it designates, and return rubbish to the shop where you bought the food. In Gion, follow private-property and no-photography signs. Do not stop, follow or photograph maiko or geiko without permission. Keep your voice down around homes and leave room for residents and other pedestrians to pass.',
        sourceIds: ['kyoto-manners', 'kyoto-responsible'],
      },
      {
        kind: 'before-booking',
        title: 'Check access, not just a famous name',
        body: 'Check the specific temple, tea experience or restaurant’s own reservation and access rules before arranging the day around it. Use Kyoto’s sightseeing comfort map to help choose an area, not as a guarantee of an empty street. For autumn illuminations, confirm the exact dates, ticket type and last admission; ordinary daytime access does not establish an evening visit. Keep a simpler central walk as your fallback.',
        sourceIds: ['kyoto-manners', 'kyoto-responsible'],
      },
    ],
    sources: [
      { id: 'kyoto-access', label: 'Kyoto Travel — rail access to Nishiki Market', url: 'https://kyoto.travel/en/getting-around/comfortable-access-to-central-kyoto-city-nishiki-market', checkedOn: '2026-11-20' },
      { id: 'kyoto-manners', label: 'Kyoto Travel — Nishiki, Gion and sightseeing manners', url: 'https://kyoto.travel/en/travel-inspiration/things-to-keep-in-mind-while-exploring-kyoto-and-its-kiyomizu-arashiyama-and-gion-areas', checkedOn: '2026-11-20' },
      { id: 'kyoto-responsible', label: 'Kyoto Travel — responsible travel guidance', url: 'https://kyoto.travel/en/responsible-travel', checkedOn: '2026-11-20' },
    ],
  },
  marrakech: {
    guideId: 'marrakech',
    sections: [
      {
        kind: 'short-visit',
        title: 'A medina evening, a separate garden visit',
        body: 'For an evening, keep your plan around Jemaa el-Fna and the medina rather than trying to fit in a garden visit as well. Morocco’s tourist board describes the square, souks and riads as the heart of this part of Marrakech. Put Jardin Majorelle in a separate booked daytime slot, with room for the journey there. Its garden and museums have distinct admission arrangements; one ticket should not be assumed to cover everything.',
        sourceIds: ['morocco-city', 'majorelle', 'majorelle-terms'],
      },
      {
        kind: 'getting-around',
        title: 'Arrange a clear return to your riad',
        body: 'Ask your accommodation for the exact meeting point and the final route to its entrance before heading into the medina. If you hire a guide there, check for an official badge and local-authority permission. For a taxi, agree the fare in advance or check that the meter is being used. Do not assume an app booking establishes licensing: UK travel advice warns that some app-arranged taxis are unregulated.',
        sourceIds: ['morocco-safety'],
      },
      {
        kind: 'respect-and-access',
        title: 'Ask before photographing people',
        body: 'Ask permission before photographing people, especially children, rather than treating the square as a stage set. Keep religious-site visits separate from a general sightseeing walk and check access with the site itself. During Ramadan, check local advice and actual restaurant service before planning a daytime meal; opening and service arrangements can change. Ask your host what is appropriate for the particular place and date, rather than applying a restaurant’s practice to every setting.',
        sourceIds: ['morocco-safety'],
      },
      {
        kind: 'before-booking',
        title: 'Read Majorelle’s timed-ticket conditions',
        body: 'Reach the ticket shop through Jardin Majorelle’s own website. The terms tie admission to the named site, date and time, and describe tickets as non-refundable and non-exchangeable. A combined visit must begin at the garden; the printed time is the garden arrival time. Check each museum’s opening day and the Ramadan schedule before paying, and leave enough flexibility that a delayed transfer will not determine the whole day.',
        sourceIds: ['majorelle', 'majorelle-terms'],
      },
    ],
    sources: [
      { id: 'morocco-city', label: 'Moroccan National Tourist Office — Marrakech', url: 'https://www.visitmorocco.com/en/travel/marrakesh', checkedOn: '2026-11-20' },
      { id: 'majorelle', label: 'Jardin Majorelle — official visits and ticket link', url: 'https://www.jardinmajorelle.com/en/', checkedOn: '2026-11-20' },
      { id: 'majorelle-terms', label: 'Jardin Majorelle — timed-ticket conditions', url: 'https://tickets.jardinmajorelle.com/CGU', checkedOn: '2026-11-20' },
      { id: 'morocco-safety', label: 'UK FCDO — Morocco safety and local customs', url: 'https://www.gov.uk/foreign-travel-advice/morocco/safety-and-security', checkedOn: '2026-11-20' },
    ],
  },
  tokyo: {
    guideId: 'tokyo',
    sections: [
      {
        kind: 'short-visit',
        title: 'Keep a short visit in Asakusa',
        body: 'Build a compact visit around Kaminarimon, the Nakamise approach to Sensoji, and the Sumida River near Azuma-bashi. GO TOKYO places these sights together in Asakusa, so this is a more coherent starting point than a cross-city checklist. If arriving in the evening, treat it as a neighbourhood walk and meal unless you have checked the particular temple interior and shops; an outdoor view does not establish late opening.',
        sourceIds: ['tokyo-asakusa'],
      },
      {
        kind: 'getting-around',
        title: 'Check the last train before dinner',
        body: 'Tokyo Metro and Toei are separate subway operators. Check which lines your journey actually uses before buying a pass, and compare it with using a rechargeable Suica or PASMO card. For an evening out, look up the last train for the full journey back to your hotel, including connections. Do not use a general network closing time as the departure time of your own last useful service.',
        sourceIds: ['tokyo-subway'],
      },
      {
        kind: 'respect-and-access',
        title: 'Leave room on trains and at food stalls',
        body: 'Queue at the marked boarding positions and let passengers off first. Keep a backpack in front of you or between your legs, avoid phone conversations and offer priority seats to those who need them. At Tsukiji Outer Market, eat purchases in the shop or designated eating area rather than while walking, and use the shop’s rubbish bins. Busy working and shopping spaces are not places to stop the flow for a photograph.',
        sourceIds: ['tokyo-subway', 'tokyo-tsukiji'],
      },
      {
        kind: 'before-booking',
        title: 'Choose the right market visit',
        body: 'Tsukiji Outer Market remains a food-shopping and dining destination; the former wholesale market moved to Toyosu. Choose the experience you actually want rather than treating the names as interchangeable. Tsukiji shop hours and closing days vary, so check the intended shop before arranging breakfast there. Keep this as a separate daytime option from an Asakusa evening, and confirm any attraction reservation before paying for a transport pass around it.',
        sourceIds: ['tokyo-tsukiji'],
      },
    ],
    sources: [
      { id: 'tokyo-asakusa', label: 'GO TOKYO — Asakusa neighbourhood guide', url: 'https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/index.html', checkedOn: '2026-11-20' },
      { id: 'tokyo-subway', label: 'GO TOKYO — subway operators, tickets and etiquette', url: 'https://www.gotokyo.org/en/plan/getting-around/subways/index.html', checkedOn: '2026-11-20' },
      { id: 'tokyo-tsukiji', label: 'GO TOKYO — Tsukiji Outer Market visitor guidance', url: 'https://www.gotokyo.org/en/spot/65/index.html', checkedOn: '2026-11-20' },
    ],
  },
  seville: {
    guideId: 'seville',
    sections: [
      {
        kind: 'short-visit',
        title: 'Separate the palace from an evening in Triana',
        body: 'If the Real Alcázar is the priority, anchor your short visit to an available admission and leave the evening for Triana. With only an evening free, start with a neighbourhood walk rather than assuming the palace is still admitting visitors. The official Alcázar site publishes a shorter winter visiting schedule. Special out-of-hours visits are separate arrangements, not an extension automatically included with ordinary entry.',
        sourceIds: ['seville-alcazar', 'seville-triana'],
      },
      {
        kind: 'getting-around',
        title: 'Use the river as your walking route',
        body: 'The tourism board’s Triana route links the area around the market with San Jacinto, Pureza and Betis, with the Guadalquivir as its reference point. The Isabel II bridge is also known as Triana Bridge. Pick a portion that suits your starting point and walking needs; map the return to your accommodation before setting out. A pleasant river walk need not become an attempt to cross the whole city after dinner.',
        sourceIds: ['seville-triana'],
      },
      {
        kind: 'respect-and-access',
        title: 'Distinguish a neighbourhood walk from a booking',
        body: 'Triana’s streets and riverfront can be the framework for your visit, but they do not establish that a particular market stall, restaurant or performance is open. Choose one meal or show and verify its own service, seating and access arrangements. For reduced Alcázar admission, carry the documentation proving eligibility: the palace requires it at entry. Do not choose a discounted category simply because the booking form offers it.',
        sourceIds: ['seville-triana', 'seville-alcazar'],
      },
      {
        kind: 'before-booking',
        title: 'Confirm the palace ticket and season',
        body: 'Use the ticket link on the Real Alcázar’s own website and check the date, visiting schedule and spaces included before paying. The upper royal apartments have a separate admission charge, so decide whether you want that visit rather than assuming every ticket includes it. Review the refund rules before fixing other plans around the purchase. For a late arrival, keep Triana as an alternative instead of relying on a palace slot you have not secured.',
        sourceIds: ['seville-alcazar', 'seville-triana'],
      },
    ],
    sources: [
      { id: 'seville-alcazar', label: 'Real Alcázar of Seville — visit planning and conditions', url: 'https://alcazarsevilla.org/prepara-la-visita', checkedOn: '2026-11-20' },
      { id: 'seville-triana', label: 'Visita Sevilla — Triana neighbourhood and walking route', url: 'https://visitasevilla.es/en/barrio-de-triana/', checkedOn: '2026-11-20' },
    ],
  },
  'cape-town': {
    guideId: 'cape-town',
    sections: [
      {
        kind: 'short-visit',
        title: 'A Sea Point walk before dinner',
        body: 'For a short coastal visit, consider a daylight walk on the paved Sea Point Promenade, then a meal in the neighbourhood. Cape Town Tourism places the promenade on the Atlantic shore and identifies Main and Regent roads as dining areas. Choose a manageable stretch near your starting point. If you have only an evening, get advice from your host about the route and return transport rather than assuming a long coastal walk is suitable after dark.',
        sourceIds: ['cape-sea-point', 'cape-safety'],
      },
      {
        kind: 'getting-around',
        title: 'Plan the ride home as well as the outing',
        body: 'Arrange an accredited taxi or other transport recommended by your accommodation for a late return, with a clear pickup point. Tourism guidance advises avoiding deserted and dark places at night and keeping belongings out of sight. Do not extend the promenade outing into an unfamiliar after-dark walk just to avoid a transfer. For Table Mountain, confirm transport to and from the lower station separately from the cableway ticket.',
        sourceIds: ['cape-safety', 'cape-cableway'],
      },
      {
        kind: 'respect-and-access',
        title: 'Do not turn a cancelled cable car into an improvised hike',
        body: 'The cableway may close in bad weather. If it is not operating, choose a different plan rather than treating a mountain ascent as an automatic substitute. Cape Town Tourism recommends taking companions, a map, proper walking shoes and a charged phone into Table Mountain National Park. Choose a route suited to your experience and seek current local advice; a sightseeing timetable is not a hiking safety assessment.',
        sourceIds: ['cape-cableway', 'cape-safety'],
      },
      {
        kind: 'before-booking',
        title: 'Keep the mountain weather-dependent',
        body: 'Check the cableway operator’s current operating status, weather information and ticket conditions before leaving, then check again on the day. Read the selected ticket’s validity and cancellation terms instead of assuming a purchase fixes the weather or a departure time. Keep the Sea Point outing as a separate option, with its own weather and safety check, so a mountain closure does not force a rushed replacement or an unsafe walk.',
        sourceIds: ['cape-cableway', 'cape-tickets', 'cape-sea-point', 'cape-safety'],
      },
    ],
    sources: [
      { id: 'cape-sea-point', label: 'Cape Town Tourism — Sea Point neighbourhood', url: 'https://www.capetown.travel/neighbourhood/sea-point/', checkedOn: '2026-11-20' },
      { id: 'cape-safety', label: 'Cape Town Tourism — visitor and mountain safety', url: 'https://www.capetown.travel/travelwise/safety-in-cape-town/', checkedOn: '2026-11-20' },
      { id: 'cape-cableway', label: 'Table Mountain Cableway — operating and weather advice', url: 'https://www.tablemountain.net/', checkedOn: '2026-11-20' },
      { id: 'cape-tickets', label: 'Table Mountain Cableway — official ticket route', url: 'https://www.tablemountain.net/plan-your-visit/buy-tickets', checkedOn: '2026-11-20' },
    ],
  },
  maldives: {
    guideId: 'maldives',
    sections: [
      {
        kind: 'short-visit',
        title: 'Choose an island around the transfer',
        body: 'For a short Maldives stay, compare the complete arrival-to-island journey before choosing a room. Visit Maldives describes speedboats for resorts near the international airport, with seaplanes or domestic flights serving others. A late arrival and a remote resort can be a poor match: ask the property whether you can reach it that day. With only an evening free, do not build a resort excursion around an unconfirmed transfer.',
        sourceIds: ['maldives-travel', 'maldives-tma'],
      },
      {
        kind: 'getting-around',
        title: 'TMA seaplanes are a daylight connection',
        body: 'Trans Maldivian Airways says its seaplanes operate from sunrise to sunset and that resort-transfer reservations are made through partner resorts. Send your international flight details to the property and obtain its connection advice before buying a non-changeable flight. Ask about baggage limits, excess and oversized equipment, and the handling of delays. Carry medication and essential items in your hand luggage in case the main bag travels separately.',
        sourceIds: ['maldives-tma'],
      },
      {
        kind: 'respect-and-access',
        title: 'Local islands are not the resort beach',
        body: 'Visit Maldives asks travellers to dress modestly when visiting or staying on inhabited islands. Pack something suitable for a local-island outing rather than assuming resort swimwear is appropriate everywhere. Ask your host where swimming is permitted and what any excursion includes. Treat reef access, equipment and guided activities as property-specific questions; the room description alone does not establish an included snorkelling trip or a reef you can safely enter.',
        sourceIds: ['maldives-travel'],
      },
      {
        kind: 'before-booking',
        title: 'Compare the full written offer',
        body: 'Request an itemised offer showing the room, meal plan, taxes, service charges and both directions of the transfer, with the currency and whether charges are per person or per room. Check the resort’s cancellation and missed-connection terms alongside the airline’s. TMA’s published connection guidance is not a confirmation for your booking: have the property approve your actual arrival and departure flights, and ask whether an airport-area overnight stay is needed.',
        sourceIds: ['maldives-travel', 'maldives-tma'],
      },
    ],
    sources: [
      { id: 'maldives-travel', label: 'Visit Maldives — transfers and local-island dress', url: 'https://visitmaldives.com/en/maldives/travel-information', checkedOn: '2026-11-20' },
      { id: 'maldives-tma', label: 'Trans Maldivian Airways — transfers and baggage FAQ', url: 'https://transmaldivian.com/faq', checkedOn: '2026-11-20' },
    ],
  },
}

export function getPracticalGuideNotes(guideId: string): PracticalGuideNote | undefined {
  return Object.hasOwn(PRACTICAL_GUIDE_NOTES, guideId) ? PRACTICAL_GUIDE_NOTES[guideId] : undefined
}
