import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Independent editorial oracle: reads authoring artifacts, not runtime helpers or network.
const read = (name) => readFileSync(new URL(`../src/data/${name}`, import.meta.url), 'utf8')
const notes = JSON.parse(read('golfCourseNotes.json'))
const sources = JSON.parse(read('golfSources.json'))
const review = JSON.parse(read('golfCourseReview.json'))
const note = (id, month) => {
  const matches = notes.filter(n => n.courseId === id && n.month === month)
  assert.equal(matches.length, 1)
  return matches[0]
}
const text = n => `${n.why} ${n.tradeoff}`
const cited = n => sources.filter(s => n.sourceIds.includes(s.id))
const hasSource = (n, url) => {
  const source = cited(n).find(s => s.url === url)
  assert.ok(source, `${n.courseId}/${n.month} must cite ${url}`)
  assert.match(source.checkedAt, /^\d{4}-\d{2}-\d{2}$/)
  return source
}

test('preserve 37 courses, 72 distinct slots, six per month and all twelve leads', () => {
  assert.equal([...read('golfCourses.ts').matchAll(/^    id: '/gm)].length, 37)
  assert.equal(notes.length, 72)
  assert.equal(new Set(notes.map(n => `${n.month}/${n.courseId}`)).size, 72)
  assert.deepEqual(review.months.map(m => m.lead), [
    'emirates-golf-club-majlis-course', 'tpc-scottsdale-stadium-course',
    'royal-cape-golf-club', 'the-royal-melbourne-golf-club-west',
    'portmarnock-golf-club', 'muirfield', 'keilir-golf-club',
    'capilano-golf-and-country-club', 'bethpage-black', 'oitavos-dunes',
    'steenberg-golf-club', 'new-south-wales-golf-club',
  ])
  for (const m of review.months) {
    const selected = notes.filter(n => n.month === m.month)
    assert.equal(selected.length, 6)
    assert.deepEqual(selected.map(n => n.courseId), m.slots.map(s => s.courseId))
    assert.equal(selected[0].courseId, m.lead)
  }
})

test('G2: Muirfield July keeps Colt and summer benefit, never invents total acreage', () => {
  const n = note('muirfield', 7)
  assert.doesNotMatch(text(n), /\bacres?\b|\bhectares?\b/i)
  assert.match(n.why, /Colt.*1925/)
  assert.match(n.why, /July.*(?:warm|highest temperatures)/)
  assert.match(n.why, /evenings|daylight/)
  const history = hasSource(n, 'https://www.muirfield.org.uk/the-course/')
  assert.match(history.evidence, /additional 50 acres/i)
})

test('G3: Kytäjä July uses regional air/rain caveat, not sea-to-lake/turf inference', () => {
  const n = note('kyt-j-golf-south-east', 7)
  assert.doesNotMatch(text(n), /sea temperature|seawater|water and greens|greens stay|15\s*°?C/i)
  assert.match(n.tradeoff, /rain.*12.*63\s*mm/i)
  assert.match(n.tradeoff, /cool|layers/i)
  assert.match(n.tradeoff, /Helsinki|regional/i)
})

test('G3: Cog Hill August does not predict greens from regional humidity', () => {
  const n = note('cog-hill-no-4-dubsdread', 8)
  assert.doesNotMatch(text(n), /soft greens|soft turf|soggy|firm greens/i)
  assert.match(n.tradeoff, /humid.*76%.*rain.*17/i)
})

test('G3: NSW December warmth is not a firm-turf guarantee', () => {
  const n = note('new-south-wales-golf-club', 12)
  assert.doesNotMatch(text(n), /firm|fast.running|turf condition/i)
  assert.match(n.why, /December|summer/i)
  assert.match(n.why, /warm/i)
  assert.doesNotMatch(n.tradeoff, /crowds|afternoon|storms/i)
  assert.match(n.tradeoff, /rain/i)
  const s = hasSource(n, 'https://worldweather.wmo.int/en/json/300_en.json')
  assert.match(s.evidence, /Sydney/)
  assert.match(s.evidence, /1981.*2010/)
})

for (const month of [5, 6]) {
  test(`G3: Bro Hof month ${month} cites checked Stockholm climate and a seasonal benefit`, () => {
    const n = note('bro-hof-slott-stadium', month)
    assert.doesNotMatch(text(n), /peak condition|perfect condition|season in full swing/i)
    assert.match(n.why, /Stockholm/)
    assert.match(n.why, /warm|milder/i)
    const s = hasSource(n, 'https://worldweather.wmo.int/en/json/187_en.json')
    assert.match(s.publisher, /WMO|World Meteorological Organization/)
    assert.match(s.evidence, /cityName=Stockholm/)
    assert.match(s.evidence, /1991.*2020/)
    assert.match(s.evidence, /May.*16\.5.*7\.1/)
    assert.match(s.evidence, /June.*20\.8.*11\.6/)
    assert.match(s.evidence, /regional|proxy/i)
  })
}

test('G3: Muirfield April cites genuine spring warming, not an opening boundary', () => {
  const n = note('muirfield', 4)
  assert.doesNotMatch(text(n), /opens?.*(?:links|golf) season|season open/i)
  assert.match(n.why, /April.*(?:warm|milder)/)
  const s = hasSource(n, 'https://www.metoffice.gov.uk/research/climate/maps-and-data/location-specific-long-term-averages/gcvw5vmsn')
  assert.match(s.evidence, /Gogarbank/)
  assert.match(s.evidence, /1991.*2020/)
  assert.match(s.evidence, /March.*9\.32.*2\.71/)
  assert.match(s.evidence, /April.*12\.01.*4\.34/)
  hasSource(n, 'https://www.muirfield.org.uk/visitors-notes-guidance/')
})

test('G4: Bali June retains dry-season appeal without recurring Eid or course-fee inference', () => {
  const n = note('bali-national-golf-club', 6)
  assert.match(n.why, /dry.season/i)
  assert.doesNotMatch(text(n), /Eid|Idul|Fitri|green fees|course fees|golf fees/i)
  assert.match(n.tradeoff, /mid.June/i)
  assert.match(n.tradeoff, /accommodation|resorts|guest houses/i)
  assert.match(n.tradeoff, /busy|demand|packed/i)
})

test('all eight corrected slots are explicitly revised with G2/G3/G4 rationale', () => {
  for (const [id, month, gap] of [
    ['muirfield', 7, 'G2'], ['kyt-j-golf-south-east', 7, 'G3'],
    ['cog-hill-no-4-dubsdread', 8, 'G3'], ['new-south-wales-golf-club', 12, 'G3'],
    ['bro-hof-slott-stadium', 5, 'G3'], ['bro-hof-slott-stadium', 6, 'G3'],
    ['muirfield', 4, 'G3'], ['bali-national-golf-club', 6, 'G4'],
  ]) {
    const slot = review.months.find(m => m.month === month).slots.find(s => s.courseId === id)
    assert.equal(slot.decision, 'revised', `${id}/${month}`)
    assert.ok(slot.rationale.includes(gap), `${id}/${month} rationale needs ${gap}`)
    if (!['muirfield'].includes(id)) assert.match(slot.rationale, /retained.*revised/i)
  }
})

test('citation catalog has no dangling or orphan source records', () => {
  const ids = sources.map(s => s.id)
  assert.equal(new Set(ids).size, ids.length)
  const used = new Set(notes.flatMap(n => n.sourceIds))
  assert.deepEqual([...used].sort(), [...ids].sort())
})
