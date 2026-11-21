import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'

// Candidate acceptance overlay: awaiting independent review. This is an exact
// inverse patch, never a permissive exemption or a replacement legacy baseline.
export const publishedBase = '3d4af2cfa1abaee97d3cd883ff251bef7b497af0'
export const changedPaths = [
  "src/app/explore/page.tsx",
  "src/app/golf/[slug]/page.tsx",
  "src/app/guides/GuideIndex.module.css",
  "src/app/guides/[slug]/GuideArticle.module.css",
  "src/app/guides/[slug]/page.tsx",
  "src/app/guides/page.tsx",
  "src/app/plan/page.tsx",
  "src/app/privacy-policy/page.tsx",
  "src/components/ComparePricesSection.tsx",
  "src/components/GoldilockZone.tsx",
  "src/components/GoldilocksHome.module.css",
  "src/components/GoldilocksHome.tsx",
  "src/components/GolfGuide.module.css",
  "src/components/GolfZone.module.css",
  "src/components/GolfZone.tsx",
  "src/components/PriceComparison.tsx",
  "src/components/guides/GuideShell.tsx",
  "src/components/guides/GuideTheme.module.css",
  "src/data/destinationGuides.ts",
  "tests/accessibility-plan.browser.test.mjs",
  "tests/accessibility-surfaces.browser.test.mjs",
  "tests/booking.browser.test.mjs",
  "tests/goldilocks.browser.test.mjs",
  "tests/guide-accuracy.browser.test.mjs",
  "tests/guides-theme.browser.test.mjs",
  "tests/hero-layout.browser.test.mjs",
  "tests/performance.test.mjs",
  "tests/performance.browser.test.mjs",
  "tests/seasonal-shortlist.test.mjs",
  "tests/golf-visuals-fragment.browser.test.mjs",
  "tests/golf-zone.browser.test.mjs",
  "tests/golf-finder-media.browser.test.mjs",
  "tests/golf-finder-media.test.mjs",
  "tests/golf-image-relevance.test.mjs",
  "tests/golf-photo-attribution.test.mjs",
  "tests/helpers/golf-guide-render.mjs"
]
export const addedPaths = [
  "docs/editorial/travel-claims-review.md",
  "src/components/AviationMark.tsx",
  "src/components/GoldilockZone.module.css",
  "src/components/GolfEmblem.tsx",
  "src/components/PracticalGuideNotes.module.css",
  "src/components/PracticalGuideNotes.tsx",
  "src/components/SavedDestinations.module.css",
  "src/components/SavedDestinations.tsx",
  "src/components/TravelEditionStrip.module.css",
  "src/components/TravelEditionStrip.tsx",
  "src/components/TravelTheme.module.css",
  "src/components/TravelTheme.tsx",
  "src/components/TripContextLink.tsx",
  "src/components/TripContextNote.tsx",
  "src/data/practicalGuideNotes.ts",
  "src/lib/savedDestinations.ts",
  "src/lib/tripContext.ts",
  "tests/design-editions.browser.test.mjs",
  "tests/golf-design.test.mjs",
  "tests/golf-overflow.browser.test.mjs",
  "tests/guide-claims.test.mjs",
  "tests/inflight-explore.browser.test.mjs",
  "tests/helpers/trip-planning-approval.mjs",
  "tests/practical-guide-notes.test.mjs",
  "tests/saved-destinations-concurrency.test.mjs",
  "tests/saved-destinations.test.mjs",
  "tests/travel-design.test.mjs",
  "tests/ticket-art-direction.browser.test.mjs",
  "tests/ticket-placement.browser.test.mjs",
  "tests/travel-strip.browser.test.mjs",
  "tests/trip-context.test.mjs",
  "tests/trip-improvements.browser.test.mjs",
  "tests/window-seat-hero.browser.test.mjs"
]
export const continuationPaths = [
  'src/app/layout.tsx', 'src/app/privacy-policy/page.tsx', 'tests/browser-fixture.mjs',
]
export const securityPaths = ['package.json', 'package-lock.json']
// Authored from git-show 3d4af2c and checked against the independently saved
// 273-file published manifest, NOT copied from current feature source.
export const publishedHashes = {
  ".env.local.example": "81f0d028994ffd48f1dfccc930bbae63bc01f302985e3a140959bdffd95a1c26",
  ".gitignore": "d25e8917264d2d956c0d0b1a5fd84201b2ee00eb76366fac58c3e610f87c1976",
  ".npmrc": "a093bb2fed59d699b7f9a62a5203cc196054c624e9c39c6d908c9e7db5dd2464",
  "AGENTS.md": "063098f6cb31bb44c6f8fbea25b3876de7ee1e5f7d00a50dbab506f6415eb7f0",
  "CONTENT_GUIDE.md": "a26e7be95cd434041da22702662ee0f08797b53c0218f96a158e3b109e8b152c",
  "CONTENT_PIPELINE.md": "ece1e4272e9242b56c374d79473379ecdf402c5bc69bcce3a21c013151ab1864",
  "CONTENT_PLAYBOOK.md": "2ba2b1c90ae9f940204cf07803bac745f0b98fec0b86af703aba0454d88c0016",
  "NEXT.md": "591890a72fc8cece05c58a68236e549d3058722be924eaf48ef617886b92ad61",
  "QA_CHECKLIST.md": "ec97a1e8bb9f3221a887fb8630182744546bba29b8d7d00b07adb9cad8d3df94",
  "QA_REPORT_TEMPLATE.md": "5a5be5b222c2bd9e82697254288c0a16d38511ddefc93b468931b600ce1d434b",
  "REVIEW_QUEUE.md": "486ada4a42d94ed2980b7367a20718a0c7318ba2914d7a75dc8c0b613a6b53d7",
  "SPEC.md": "f63b7ab13ae823d3ea532346857ef3f3a14b6d482bb83295037fac7c88dd85d4",
  "TECHNICAL_PLAYBOOK.md": "300f5440585eb1ad1dfb92fbe9b65058d9d364028be718eecd9a7c63d3dcb5ed",
  "WEEKLY_AUDIT_CHECKLIST.md": "bc6bbac7023589f59d6a4ca8fe5cc2c52484dcb405fcb3047edcfabe11f8c5b9",
  "audit-reports/week-2026-04-07-report.md": "d337ad2e160a17579bdfeaef2133df644466bf26163d6dd68df0896ccb4e314b",
  "content-calendar-month2.md": "ba1adf236f8747d71f35011f850f6801445e89ecd875addfa56300525d86ae00",
  "destinations/NEXT.md": "591890a72fc8cece05c58a68236e549d3058722be924eaf48ef617886b92ad61",
  "docs/AFFILIATE_PARTNERSHIPS.md": "3808890a999ac6de84771d186ab92719066839b5354831d1cfa7d6bbf68bfa12",
  "docs/AFFILIATE_STATUS.txt": "f117cf9255a83278b40d97354f76e9169d236223ff8b0c49129d92b377aaca06",
  "docs/AFFILIATE_STATUS_WEEK3_UPDATE.txt": "fb75224102327b088d1e738768b6c85bcb2411584502fcacedabd03731b36ded",
  "docs/CINEMATIC-BRAND.md": "384cbec1284f32c9f6fc57759b268692b28a64ebdeb817f19ca99488689db089",
  "docs/CINEMATIC-GUIDES.md": "09618ff522f40938b1ebd18678c8a8accccd73101318b3b6e9acb8400e132fd5",
  "docs/CINEMATIC-HOMEPAGE.md": "f218e205cf1abbc288462c7de5e9b010b2604a940d6cb551e5d78fa7e843b646",
  "docs/CINEMATIC-ROUTES.md": "174be282417096d3852963c5805dbe8be9579fc657634a6ec17f8f2a40cb5839",
  "docs/DESTINATION-PHOTOS.md": "8c5ad92ae4c821118d0073dd2d080f62e9c290605e7cd731ed9dff6e64de890e",
  "docs/GOLF-ZONE.md": "6dc73c74986f3ddff6d027f1300ee94875396891d223bdddfc7f454ad4703c91",
  "docs/GUIDE-ACCURACY.md": "2b93ae56e83936e6750520a487411558c4b30b081a8abfc79e9d94a7b49b3890",
  "docs/GUIDE-PERFORMANCE.md": "3513d3ac51911f6c9758084d6ae9728bd4c39944bcf89f0675125fec4df62e17",
  "docs/PERFORMANCE.md": "59daf7806ecbcd0a2a3dfebdd077455f4fd5fb2cbd0af52bf4fe07df2aac2f74",
  "docs/SEASONAL-REASONS.md": "15775d95e7aed47b3153cd47798c2cf2ead84930c4c79733ff846f83c1373949",
  "docs/SEASONAL-SHORTLIST.md": "858a7b0bbe4a1224fbb94dd68558c8b9cf451d8a9a5065653a77dbe2542850ad",
  "docs/SEO.md": "dd8cff61f356c20efa69ebef757bae826b198a92bb19ce92084b056af0a2940b",
  "docs/content-strategy-and-editorial-guidelines.md": "289769d4e403d449a64807f1e58b856a77de4f27842b90dc8c99d31f049be358",
  "docs/course-specific-golf-guides.md": "20a90083b624fc56449e02ba0f777d861e879536c9c88b0cb0aa5405cc41cfc4",
  "docs/golf-course-media.md": "2d495e7265f7f2e22cc4898b575a56f50bc14585fafec05207c26db0774b73ad",
  "docs/golf-guide-details-evidence.md": "c0a8f3a89b84b981d252b2379114ae4cbaeb599fdbd19af2ce9826f1831ee1c5",
  "docs/outreach-emails.md": "b924b9f1ff6d03b1a67250683a7daa947590ee2df5ca9b19f8be1d76ace35d02",
  "docs/plans/cinematic-brand-mark.md": "e7fee4e6f1b80ccc7d0b7e261715b15d128ac5322f18e5109591722d21155d31",
  "docs/plans/cinematic-guides.md": "03fa4a33d768ff8a80eb13466eeb71fda09d700c701572cd133f67742b905d57",
  "docs/plans/core-journey-accessibility.md": "54bc2af21fc564b8bd7f701559f398abd6508b7c7a9112a7ece61f6b4ce18bf9",
  "docs/plans/destination-photo-accuracy.md": "19a52afbe6382739ef7f553e9640eb80b754360afb4e97b329a243cf5155d38f",
  "docs/plans/golf-goldilocks-zone.md": "7ab5d877bea2cdeb6750252ab7380de646f021f21c2f3ea99c45d7db53b80e67",
  "docs/plans/guide-card-performance.md": "abc8663d59bcd36cfc176fe0b45427e0520d31fd13db17db54597eec2f8190e1",
  "docs/plans/guide-copy-antalya-photo.md": "9c6b8e9ba5c7de66e56f9ba4687bc0fc00f68f01280b6bcca1207f83b47908d2",
  "docs/plans/mobile-performance.md": "5a6a4055b3de546bf85acd2177611b4ae1cd9af458155bae494ca6010ed54b29",
  "docs/plans/seasonal-reasons.md": "0919b7d4bc0c0d3cc938ae6f3acb82d302c5d90f15756d054b7248c533b1c2a5",
  "docs/plans/seasonal-shortlist-accuracy.md": "93d5659d28e01ce7edbd4a65f30737eb52da60185500864bcc79c454c381bb1d",
  "next-env.d.ts": "7b550dda9686c16f36a17bf9051d5dbf31e98555b30d114ac49fc49a1e712651",
  "next.config.js": "77ccf261fbe99e1fdba503cb8566b5cb0ba8f2cb364c6b7751af70448852ce26",
  "package-lock.json": "ece1bd3b14b9540eaabca03cb05ad6b15504e5716273be91e4375ff3bf4a54e1",
  "package.json": "ee21a2bc7e72b9a33f2b9fc8df33cbd6d15de7a736711232eef4402d1af98678",
  "playwright.affiliate.config.mjs": "68dd4e805c755cf02708e1b4f94fe1a98fdf94bd5fabe1d12a7e61e40711bda6",
  "playwright.config.mjs": "0b78bafc7c29156ca535bb3a27aeff03f2bc83410207cc7ffe5fca1807f465c6",
  "postcss.config.js": "137e618876acb0d2d008c7d52c3030e23084cfbf0b27cb3e330b8c1fbc456ea4",
  "public/brand/apple-touch-icon.png": "b79605bb8807c1f729f61d7cc33ff69789e2cdb83ea1560be1c192a31208f959",
  "public/brand/favicon-32.png": "4c5dd5ce60c59e148d2fb964c51555d5c03d44670c6ae3050b38d0391f09ac6a",
  "public/brand/goldilocks-mark.svg": "544f2034baba5a41a4efc0baa63311a466a4a1782409c264220c8d155476f8eb",
  "public/brand/golf-guide-social.png": "70562af9df7702338a79026b6dc3d521b8f47fd6efc1d68a1c32eb0742c9d67f",
  "public/golf-media/al-maaden-golf-01.webp": "59346beba6444000bcb66f26ba988bae7cf4a904e4675669b9db22f918ed22c5",
  "public/golf-media/al-maaden-golf-02.webp": "02eb25cf06eccbae2fa538f020720e3d1da658d2160d5d5f266d01768c9c5183",
  "public/golf-media/bethpage-black-01.webp": "a004b76691a263c403ae5048a2209a86e6033ac2b4d233e7cb368887ab391c8d",
  "public/golf-media/capilano-golf-and-country-club-01.webp": "96ed7e11472982f57bc3aabfc61ba39f13ff53c265fc87172b6424e7c8d86a97",
  "public/golf-media/chambers-bay-01.webp": "3a51c2f098e73d0d87e0aed1b5c02e3e129fb501e2a80d893215e586407eb653",
  "public/golf-media/chambers-bay-03.webp": "842f1ec19335892d3e77706e414e0a2daa894599e427c2fd3abc16214ce5b642",
  "public/golf-media/chambers-bay-04.webp": "708088567caa69b47661ae4b4ac9d9de30fec14f14d76aeaea69a1facb6decd5",
  "public/golf-media/chambers-bay-routing.svg": "848bb5500607aa82880de73be30547abbb5be2a6a8a066d8fb2cf77d991b2f34",
  "public/golf-media/crans-sur-sierre-golf-club-ballesteros-01.webp": "ac3abe5b771c91bf9e1cc155991dfcd0aff67eda9e5a4c42253d1681a1a6d847",
  "public/golf-media/crans-sur-sierre-golf-club-ballesteros-02.webp": "0e6c000898eb88a4d6dacbcf94991023b25563820398a9cd37a952e62281426e",
  "public/golf-media/crans-sur-sierre-golf-club-ballesteros-03.webp": "f927d2e1ff762549d135d8e7546f8a39336bc5d0087a934f4ecd1ed74aadf34b",
  "public/golf-media/crans-sur-sierre-golf-club-ballesteros-04.webp": "4f530ee01c938874043a44ea28a9cd2d78199548e30b5bf9db422aa5599ae208",
  "public/golf-media/emirates-golf-club-majlis-course-02.webp": "922e2c68a6c5ad9bf5b220aae824084385c11123079eb014b7ccb9e225680901",
  "public/golf-media/fontana-golf-club-01.webp": "680b317424e964db98fdf68de0ac98e0be1bdbff2df4aca0cb4595ac69499ed7",
  "public/golf-media/glen-abbey-golf-club-01.webp": "1044f8c99f80f9c61b899c7f03fb23d34c856b455f83165b8517b07932b6a6d0",
  "public/golf-media/glen-abbey-golf-club-02.webp": "15526c720ab7f8ab64bc4fd40cb86801bb4965835406601504ba873f0c6ead3f",
  "public/golf-media/glen-abbey-golf-club-03.webp": "641b18d361476677ce6f5e3b411343782ffc6b6ba6b5c829d0ddf7a76eb33505",
  "public/golf-media/glen-abbey-golf-club-04.webp": "d085e3a7cf970424e7b75b5694708b15f2e4bb2c52a68c1e369522eaa343d53e",
  "public/golf-media/glen-abbey-golf-club-routing.svg": "14135cabde27c0b541c8f696f7ac53b6ff86e20bc47444db4a2dab0152eb42e9",
  "public/golf-media/keilir-golf-club-01.webp": "e638d16ba5bfdad83793834dfbf0986fe56cc922aae83c260283aafbf2b1b3d3",
  "public/golf-media/kennemer-golf-country-club-01.webp": "164840e689815f2b2d10948c04740fe48ea4232cecc09e78dbfa9089601d203e",
  "public/golf-media/kennemer-golf-country-club-02.webp": "a0c3995668e9a3229404fe4f113fb9b1549b82b216b633d9f77c25e2b74740cf",
  "public/golf-media/kennemer-golf-country-club-03.webp": "fe5b82b1d530d0746695678f3e96a8e9a992014d74b6dd05288a3b9145bd14e3",
  "public/golf-media/kennemer-golf-country-club-04.webp": "477317680579410b61771e70e368e4f843ef1532d02ce6806aaa2c1005eb539a",
  "public/golf-media/marco-simone-golf-country-club-01.webp": "08c6ae75eb4c89c410b0ce4ca389b5bba886f56292307b59a5f4ac9fe6095f7b",
  "public/golf-media/millbrook-resort-03.webp": "d1d097f752b4736017cb2748265f29594c01ef628bb251e1975f50dfb7d59b07",
  "public/golf-media/muirfield-01.webp": "5db11e8759b6a4703b642fdd6572c144d0448a7b7f7ce656b8b05c586da582a9",
  "public/golf-media/muirfield-02.webp": "c51308d211492ebc7f41da0283ac53a02a602d37148a1aa42bc79b2e6f3820f9",
  "public/golf-media/muirfield-03.webp": "fb89f3fad94fc3c49a1ff8613d684c2ff2396c8f5f1c89cc500ba1a20f020c54",
  "public/golf-media/muirfield-04.webp": "46dbc040f470c70f673c8d9e76a656dfa94bc814eededaf45b77666ae34302f1",
  "public/golf-media/new-south-wales-golf-club-01.webp": "b012b1a863d04a0ec4dd878c53de705127ef3678a412bdeada88d59c9d79bb5e",
  "public/golf-media/oitavos-dunes-01.webp": "07da6cff5861b0abcd0ca5ca8723462f06bc212a8a7d2d958c834f340562f343",
  "public/golf-media/portmarnock-golf-club-02.webp": "08a66fc91718ddd9176202e5e5084c7c9c63e05e9175c2157218526584cfb10e",
  "public/golf-media/portmarnock-golf-club-03.webp": "930438c693f3226b8775ee38150f1641d078d68ce39a9d855a92100202d8b12d",
  "public/golf-media/praia-d-el-rey-01.webp": "ab648f008cf18eb62f9da76cf36757804a7c2ac84a9a7809d28d0f6f5673ae1d",
  "public/golf-media/praia-d-el-rey-02.webp": "859a38dc2fa6ec6a4f6982eaa019d11f7cf2fec9dbff615a4cf57314877724dc",
  "public/golf-media/praia-d-el-rey-03.webp": "ee70ec5528cebf96cd980a83394468dfd2e04be4a395ea7d25987c1a75da5a38",
  "public/golf-media/real-club-de-golf-el-prat-01.webp": "563650453f8075f5ddd1054c7ce83ac638df1bf42986562acc10105e79c5c7ef",
  "public/golf-media/real-club-de-golf-el-prat-03.webp": "b9b9280ee13c6919790b2150fd35b8575ce849b7080fbafc72c293a5ddb2c861",
  "public/golf-media/steenberg-golf-club-routing.svg": "1b08b38365b7f353f77017081254b7eacf27e443aadecdf706becd21495375d6",
  "public/golf-media/the-royal-melbourne-golf-club-west-01.webp": "56af4752d6c0b9361eb16e4280174ca96e632c60c1f258c63fdc3a339153adbe",
  "public/golf-media/torrey-pines-golf-course-south-course-01.webp": "cbae6aace96d64fccf4fd4fe6f2ed0c9d36b218acf9cd00f0d779bec8cc2e833",
  "public/golf-media/torrey-pines-golf-course-south-course-02.webp": "2866f383bae6d3fc821159969508a8847e6b8726b7a12851f2878af9dc80c92e",
  "public/golf-media/tpc-scottsdale-stadium-course-01.webp": "4e7ebb4ff9e71a5379a2de400803ebee59485e7abb5b1d84f69ba1c8f107b484",
  "public/golf-media/wentworth-club-west-01.webp": "44f477816f91107662a3aaf34d4458cdad41b6ad0eecad5d34505d02fb7d1fe2",
  "public/logos/agoda.png": "e7b7dc4337dc12c14fdc83d1aa12a5c89a50a0667b048cf45c133a6788c55b0b",
  "public/logos/booking.png": "aa16ecf4c6a8214bbc294aafa388b0e65b24400a6f7b5f32aaa4e57b68fd08c3",
  "public/logos/expedia.png": "255e010e4975190efaa776518730e9ed9d492a9d7fcce6d16440462a3efba9a5",
  "public/logos/getyourguide.png": "4a6a54efa60f03a2e346b8900f8b4d7ed2f87024447661260f2b95fc93771108",
  "public/logos/google.svg": "4e01f98a634e6b304f7e1e111b1fb805f58ecc7ffe075b6609dcd515474bc43c",
  "public/logos/hotelscom.png": "43400faf8d16704e12f7a2e5bbcdc289051a7ba1cf4bec7b03eb881522fa82cf",
  "public/logos/kayak.png": "4a8790f15e4fd2d2501d90f7b2dc68e82027a36c797d95d1aad05a1fdf3ac9f3",
  "public/logos/stay22.svg": "7cb9d582ad05445eaf97f2a99705bc7dc281c5601aec91fac33cd05887d60d3d",
  "public/logos/tripadvisor.png": "092aba66bb1b0c7cd19ac289687733ace6ee298d69d548506d5a3626950b1dc1",
  "public/logos/vrbo.png": "028ab05895d2a9ecde6ce2ff4255d87656b548b20736eeb8b2ce54fcc2e20e29",
  "scripts/next.mjs": "e2107806ef079db825da230ad002b318af3227cb4b1a25f14aeb6ecaf16ff92f",
  "scripts/render-brand-icons.cjs": "dc9f333247d34bb86f5d1159b821f8f91e758066f69991932ed86c405584dab4",
  "src/GoldilockZone.tsx": "b20f17b3e947205f8fcdf8e1e231002ac755b5e8fd304aa41cc437bfe8062647",
  "src/app/affiliate-disclosure/page.tsx": "812811755df29542feb647fe815cd9257282d9bf42e5792bde965dd44817e8bd",
  "src/app/api/newsletter/route.ts": "8ae7e2a7aff95c80806d4d41c375d72722ee24a81db81c5e7e11ce645aad18c2",
  "src/app/explore/page.tsx": "c48741bd4c030ffaaec0e34de94edc7b224acd90bc5092b08ac5710a22ba5c01",
  "src/app/globals.css": "04584f659dec56bbf3059c7dbe54655c7fbffc9c2f5ccd155adbf169cc4850ed",
  "src/app/go/[encoded]/route.ts": "bc637a1ac30644cb9811be0160003383cd59abbb9be7735c0f89e248c9075439",
  "src/app/golf/[slug]/page.tsx": "63da3640c7411dbf50254227aa005af0f518e0c91d2e2c5e3d5d3e61d1f69878",
  "src/app/golf/page.tsx": "cc35c32cc7f8b849f2547610bb4e08ae87262d9c26d8698aceaa5ce87f71fdb7",
  "src/app/guides/GuideIndex.module.css": "057559e324efa60c2ade60892883d096efa60c5c646af0dcfeb870e9b3ecda11",
  "src/app/guides/[slug]/GuideArticle.module.css": "270d13fc15224b48ea43be6e3c443ac29187d7849243ea37f39c47e7575a9dd5",
  "src/app/guides/[slug]/page.tsx": "8dd4137fe603933e92eead92044b4bb196c537967a2984d13cde6935be71c58e",
  "src/app/guides/page.tsx": "55633f8b49ce4c4d1c63763f61aa56fe965da38da873f2c0c2ac253e08bb2a0a",
  "src/app/layout.tsx": "7bfce7696effaffe96cba84889d723ae5ce65cad28a6b8e718f705403444da3f",
  "src/app/page.tsx": "1ead789725dc2a9a91dd8aaf6823c18989c3cd78de6a8066c308380c1112ac54",
  "src/app/plan/PlanIntro.module.css": "ee147b899b4b324da51c35459cc1d6ec6052e0c7e6d5e2150d11af6298d70272",
  "src/app/plan/page.tsx": "c09393d60b8c2f3f96f26b1548a009c05c7ad23e261f1b49543841b2a0b9100e",
  "src/app/privacy-policy/page.tsx": "85ae3ecd377036ef3f0cb8bdcc2b3f9e62903b13e3003535099ab70e369d34e2",
  "src/app/robots.ts": "7cabbdfaac2143ab827088c078ef4a64ee961fc4090bb9f1a178a97ddfc6523b",
  "src/app/sitemap.ts": "e01e3ee48c043974d177886434f71432c0429a81c9080c04a99948651f1e6cfb",
  "src/app/terms-of-service/page.tsx": "deec8714ecd813f330894aeef6501c10f7d3aff77c0091898fafecaff61bb5eb",
  "src/components/AffiliateDisclosure.tsx": "13531de875f0bc37edd05372495d5c7567abf903fdb101cb9378ca775035329f",
  "src/components/BrandLogo.module.css": "19139568d5d91fdbc15b399b264d4e5cdac0181c38a94d2d4e147af421c73c9d",
  "src/components/BrandLogo.tsx": "82b2f06e7023b16a19c4ea21a735f195dd06911d167bf7183d6803e261465f6b",
  "src/components/ComparePricesSection.module.css": "fe5eb1698c942e524e02750abf43b8417a898de48c930ae32aabf207cbd039f4",
  "src/components/ComparePricesSection.tsx": "e97f36407f84289bb989f3070f9ad15a6b331fcccf83a204e6e83c9270947a4b",
  "src/components/CurrencyProvider.tsx": "5225bad31e4c5ffd5caa4a3b172e8f70514d3aec0e845f632891ed944478fbf3",
  "src/components/DestinationGuideCard.tsx": "75637f985275697cb8952906377dcf66350228f3bfddae57f9ff212b8629338d",
  "src/components/DestinationGuidesSection.tsx": "b447674f821c7d0b270c606004753b0fc4ff6931d53ae9ccd4119af82c74900a",
  "src/components/FeaturedArticle.tsx": "a12b626635bf4c9f713f7ca21271651e3b2ce2af10181f9ca512794af6c23ccf",
  "src/components/FlightSearch.tsx": "80faa0133b3f0ba27dfea5a990d20a5e1787a32ddc3c5693089713e9241352e5",
  "src/components/GoldilockZone.tsx": "065c8fe2732c4c55f7ddb1daff7349e51fb030c844edcfbb439049831345f07f",
  "src/components/GoldilocksHome.module.css": "a227db1b5d9b6ca834094a25596313e54919ce2766ea1961012b171d1f549d92",
  "src/components/GoldilocksHome.tsx": "1944126787991fee80b83452bc20af690314832343f567df0caa935c2ebb7a46",
  "src/components/GolfCourseMedia.module.css": "5571a9cc1f23951244eb4a9df2a0918e4c39aa29ff5c24411ebb2fd66d49738e",
  "src/components/GolfCourseMedia.tsx": "2d7bdb52343c53957cbf5ada9ed4c4ffade2f67072e69967fdb308b111e6a7fc",
  "src/components/GolfGuide.module.css": "230ba19f2863330c3fbc43ea7ac07d36c7d835a1cba9245251b3f0ff38fad1ac",
  "src/components/GolfReason.module.css": "eca29666c2ed38374834b97d184b6f8687ab7ef50b231fb20e9de41662c031d3",
  "src/components/GolfReason.tsx": "febb36b46b0b1ef11ed3c84941a454323257a9866a894e1f7724fe57e80b1b3a",
  "src/components/GolfVisualsFragment.tsx": "0259d9957748ba65a93dd70c69e6da88843e1b504254eeb3dc2b8345c5781f81",
  "src/components/GolfZone.module.css": "333cf5851f3a170e2ec992ed291b8ac29dc099eca28a9a29a458f5a4eebc2bc8",
  "src/components/GolfZone.tsx": "76635df076cb1c7e274fcc71a757fb91bac8c2e79dc4477327dd692c7a2f9c43",
  "src/components/Navbar.tsx": "f49c426bc65fa148685ea96ba6fcacf10f077683311ad0e27de28199a416a27f",
  "src/components/NewsletterSignup.tsx": "f11f4842e5f4a4d9f04717151254ca763a42ca84b19e21034a4e82d84e25d105",
  "src/components/PriceComparison.module.css": "a4c13e991ca5dd4d2a9d4b28b819742a45b039528ca8a5c45db34fe1c0e3e770",
  "src/components/PriceComparison.tsx": "426fd2309b7f1b0f5a04b40ec46f2e0875ac7c777901c3a94d357febc8cff838",
  "src/components/ProductList.tsx": "3853a429183486e503ff50ba2b2f72f4ae311e909efab149b8496bb6e3beef6d",
  "src/components/SeasonalReason.module.css": "c54fe8fb7210b589e2c86f2f882835471572b5ce1198adec3cfb65668c3b63c7",
  "src/components/SeasonalReason.tsx": "1730f188a0b3ae8efe29e7b17e679879fee3009d3851f071980eca22d49a729e",
  "src/components/SuppliersSection.tsx": "5aa238d7b6716161d69411815876a5fdc5d9533af6fe5d2defa13140e0ca2c91",
  "src/components/ThemeProvider.tsx": "17c90a648aef39438f06f1844ebcf3a3a9a10b8f1a4c160d57c37bde0695df8c",
  "src/components/UmamiAnalytics.tsx": "8c8b6e041aa254f6c00b388fbeb739bff48fad021047c7e2eca629753b9c3e2e",
  "src/components/guides/GuideShell.tsx": "67795d67a9722172ae11de11b13b08914d793b4ab07e30fc0b4df3f593887ddf",
  "src/components/guides/GuideTheme.module.css": "d536c44a91d444597790e2f130b7a20a829eafe50726996928b4c2f71ef19863",
  "src/content/articles/airline-carry-on-size-limits-2026.md": "8a14e0ba321948ae715983b696d81cfa560f4f7867441444a083b330fca39640",
  "src/content/articles/away-vs-monos-carry-on.md": "7a55a4a69dc54b8f85749a87434f36f2f6ff4abe34bfc8d4d03d5690fefaa395",
  "src/content/articles/best-carry-on-bags-under-150.md": "a3eafbd59b0b94402620bc2d3d52de2bc25b9b27961ad59d94586197b20e9a36",
  "src/content/articles/best-laptop-bags-under-seat.md": "c531f7f1171a881656786475359bcd922a7920a61383825b33db0d3c295bdb3c",
  "src/content/articles/best-packing-cubes-2026.md": "c18908daba9170499af56d40c4f2fd77ef5f6cf51ae9c81fd35d472c4edd7942",
  "src/content/articles/best-personal-item-bags.md": "21ca8accb4a61e8e5dc687e1f0f938503313cefe22ca484bb1e05e4737f7cbc1",
  "src/content/articles/how-to-pack-for-week-conference-carry-on.md": "2cff0e4d6155d134bd8d981bd6cd5dc24c55b551ff2163c7ce5f294eb8bd3717",
  "src/content/articles/roam-luggage-carry-on-review.md": "089b882cd1ef581f8eff884260ee645e4164c5eb462d4148c3605e6f36adbe13",
  "src/content/articles/transatlantic-flight-carry-on-essentials.md": "b6ceadb0bc04ca831d36e0e72a1290816a829e7b117dd6290c605871a14fe921",
  "src/content/articles/tsa-precheck-vs-clear.md": "066f4f2f7cba8081143c9d50f9eb9f5b9d6fecc8e35a1ab11d911f344cf7ef27",
  "src/data/destinationGuides.ts": "be97c31c88f6809cb94aad175089c0c40fef85ba0d7de1baeeafa0d605f1e471",
  "src/data/destinationPhotoEvidence.json": "29f345c2b007768c51cb3ca7bc838fe6ea5ca4c77ddb45784f74e9f6140511c6",
  "src/data/golfCourseCharacter.json": "8a33396c1b6316fae560ffe2fdfb599ee20d2fd304fed173e4964713ff5e051e",
  "src/data/golfCourseMedia.json": "0816027e4d27a8d1333ebce1236c8dd1500410b4573714956e5961a2dcd0bf24",
  "src/data/golfCourseNotes.json": "336eae1adbfa3ddceaaf9c1636f02892309748eccbeaedc5844fed7d5dba0ba8",
  "src/data/golfCourseReview.json": "98fc026dfe401651b123ab3533ec7b33040843369c02d8392a0c8efec5864d21",
  "src/data/golfCourses.ts": "a8e3b46072ad51e7abb7505a680bb14aaaa696ac60a03306cfac215bf9fea9de",
  "src/data/golfGuideDetails.json": "0c095aea083de7f624f64053614478158b669f3a5658e2d9600c2b49213388a5",
  "src/data/golfOperationalNotices.ts": "e4eab341e22a2190fc14d030bbc7f88476f867c8e91112a6645e2ea201d0745b",
  "src/data/golfSources.json": "d2ceb11834f0e098c56045bc9c6f9436c6033743429f9c736053babe35b579e6",
  "src/data/seasonalReasons.json": "63a037b2908e282e9bd7da9f242686fc1d19848e972b77306f9dd6749aedb1e0",
  "src/data/seasonalShortlistReview.json": "0842145532fe754729bf68434e55f3d2f44491f1ca21482650490975b761ad3e",
  "src/lib/affiliate.ts": "55f1622bfcd87d477757822e5a07dd6ffcf1daca8df4b6efa987dcefb0e3615f",
  "src/lib/bookingDates.ts": "f0178040d1aeba4e97f17a248d42d68eda007a8caf6b22e530a7e122dc3824fb",
  "src/lib/goldilocksDiscovery.ts": "9bbc212de5e37c8ae8a4e4c9177d5b410468fbba408bc84874d7c36a872cd63b",
  "src/lib/golfDiscovery.ts": "c52307b6f7aaa48f60c4a68911f44056621fb46179d2acc0981b6f827cbb7364",
  "src/lib/golfFinderMedia.ts": "d7afba1e0c023ed06314a033994b5efb618aaac9ca9aa906c2de315d0f532d4e",
  "src/lib/golfGuides.ts": "7d7e83acff26078225cfe1be18e4b37d4bc152586cd856e7a87806565470d371",
  "src/lib/golfMedia.ts": "0fe502b316b6fbdd6b382cbe43ab7e599b3392b0e2955625dcc44952b72a84b0",
  "src/lib/golfPreviewCopy.ts": "626b6f0202550f2799b6a6b82a5f51fbb1235e7bc0b641508b675c96e1ea5886",
  "src/lib/newsletter.ts": "3c740d3fb5ed75af28d6c84d657d3a716e8022c313dca2d0432ee86f03ba8441",
  "src/lib/seasonalHelpers.ts": "9bc4bfef4e82adc4036b5079365b2033a6a7c32b7f4786e3e2da5407ac79be90",
  "src/lib/seasonalReasons.ts": "82e23edd7c3bc3bcb7625cfe660eb3d0f2058b25f2c9c38006a34829807bc267",
  "src/lib/site.ts": "022eb01c2b82ec6b65e16d9340fd1c69d7a156947a91c1e844b184fb112a2c0e",
  "src/page.tsx": "2bbe74bd71552e7bc8eaf28a117bea8fc8df1701bf6197681a57d5248021c231",
  "src/scripts/generate-article.mjs": "968a29715ebaa07db132c47d3a1e538929fa6998ee5c177b4de9704b5c616132",
  "src/scripts/generate-article.sh": "5c993412bd63bcae0bd942e0cba2d68bd970c95b18f67941c4b5e305a8b04464",
  "src/seasonalHelpers.ts": "f330f56e3dcfbd4b6e9161120f3e55ab55e8f37b62f0d291b3ac7c8cf3c8be07",
  "src/types/react-simple-maps.d.ts": "a065dbce609c950ca4f2ad3ebaf20c3e7a5070f6c0d04ba02f9dc6f5174ef81e",
  "tailwind.config.js.bak": "7a4d81fe7ed1bb35c40d54fe7598bc33f137ba2fc2db247a81f61b36359b6b1d",
  "tailwind.config.ts": "1732c12106630d2c34af69e61e6c8e562e7d5bf54c8e7fe5b4eb3c51448a8996",
  "tests/README.md": "f62b379c0010e1be667925b686531bf33ab54c9097db602c07390591904fa2b3",
  "tests/accessibility-guide.browser.test.mjs": "6f7741a35e00b2e01a2f21b55d6fc5f150a226c0390f0b90e69c0ad6e272dd33",
  "tests/accessibility-plan.browser.test.mjs": "7ee077ebdb40ab1816537208a3e26f6344ebf4b4d8469f5de03d61d88d64f722",
  "tests/accessibility-surfaces.browser.test.mjs": "63c1318beac70e628ff82d1dd8d5f65ece3046f48419f86cbc903f6df66a60b1",
  "tests/assets-map.browser.test.mjs": "99d45bf0d76c9694ebb779b30dd8dbd9124aebf9debd673eaa68aef92d2ad177",
  "tests/booking.browser.test.mjs": "8c55035c047c28b620dd39a2e24aa74572de97707575e3d614833cd965d7c2b7",
  "tests/bookingDates.test.mjs": "d28671c4a7c3e66e721946128680506cd520f86b16f89df26071531c36f2c23f",
  "tests/brand.browser.test.mjs": "3c42f13e882d7fa934bdd2ca712393f27426a23eec886fbc413b270eb4c9960a",
  "tests/browser-fixture.mjs": "9987af6dd0c61c70a856391bd7e4130fc7cadbde4d1b0a180b3f32a0b818734a",
  "tests/destination-photos.browser.test.mjs": "7775c6766efd76d2a63beba000992e6c4474ff8114e7ef5998430b7990479c67",
  "tests/destination-photos.test.mjs": "943aeacec60de498005a6ece43a7259b3e68bd870e709baa09def849d7fd5c2d",
  "tests/fixtures/accessibility-approved-changes.json": "9aa3e49ce61b2a423c4a7d5a55b958331156ce31db22bf39d5f1e8082a8ad98b",
  "tests/fixtures/golf-approved-changes.json": "75b0a06680a72e8357351ff12c6a35d16abd444561efdbc3aa88dbaf13225af6",
  "tests/fixtures/golf-finder-media-approved-changes.json": "bdced3ee15ca539e19cc66e4e69761e8963fde74f21e7848451ea2717eb8e93b",
  "tests/fixtures/golf-guide-header-baseline.json": "d146e2d3ee2a0bb80bdcd256fcbd1a2d5bde0c3775ad6ab08278c9a24b7b806a",
  "tests/fixtures/golf-guide-imagery-approved-changes.json": "fa12304d268dde9fe6b4e2d7cee91e2ab2559c1139a4d2e81de7f49f62cd4929",
  "tests/fixtures/golf-guides-approved-changes.json": "4ef605794938e3c2e26c65af05d9462d85f90f6683b0046dee9e12857cb342e7",
  "tests/fixtures/golf-imagery-approved-changes.json": "891c02028a191ae17989fd0f2ec1060111253ee232dc91e6bbc19d4791fb865e",
  "tests/fixtures/golf-media-approved-changes.json": "a2d17803123b92514148788cad4c23564e8f862660af30030d4e98fcf3cfe8a8",
  "tests/fixtures/golf-navigation-photo-release-approved-changes.json": "711ac4b16639420ae65045ab65513cd208166ee44ceedf9b296606e7e9079aeb",
  "tests/fixtures/guide-performance-baseline.json": "65a2692a2b7235011c15f3001da95bed9577c9731167fc77ca1e437567a9fbb3",
  "tests/goldilocks-core.test.mjs": "4ff706c9922b45823dee1e96dfd38741bdaf725b3d975242682214a28c8b1d5e",
  "tests/goldilocks.browser.test.mjs": "07e6d6d945432d50027183a0c0de4629eb293a24749bd4c0332e7279942f90a6",
  "tests/golf-core.test.mjs": "fa20f4e58f34b3ccadc2e86ba6539925af1620b8388d20b3ea380d572c91df14",
  "tests/golf-editorial.test.mjs": "ad447cf767c12eb930166578dbc3b82d5fab3ee945a2b068f32ccff88bd26a47",
  "tests/golf-finder-media.browser.test.mjs": "9bf7f50cb691ce7ddf3e4d9bd9196567d9cfbe91dd658a9864751765abf386f8",
  "tests/golf-finder-media.test.mjs": "56f306413a32f984fac594dd1cfc787fe21c2ec833bdd0d9e555f9350e9c86ab",
  "tests/golf-guide-headers.test.mjs": "3c13c10a7fc08361b9b4b3d735f09f4d24770c95d259c45d7d9b9362232764c9",
  "tests/golf-guide-provenance.browser.test.mjs": "e19e5fd56036dcf22b8d598f88e1ad09c0e369ad0039b151f13c68776cbf7d00",
  "tests/golf-guide-provenance.test.mjs": "cd9d0b5603b646d49c4e38e4c3238f0ab7d84a73a779c445202194bbf1a5a043",
  "tests/golf-guides.browser.test.mjs": "4403a8ec536da9c0851127e0ab81ac9569f9c72c18e5e8d7298848c01bca3ecc",
  "tests/golf-guides.test.mjs": "9d9b4310a1131ec0e97e89a8d79052f92075a020e734b424ed7270a7f49a31f6",
  "tests/golf-image-relevance.test.mjs": "9fb50977538484728de638340c12e5b253da70055b6514527468ab8f1301fb92",
  "tests/golf-media.browser.test.mjs": "56c51282b06b1e399b06790dc2c08ba81997e359b1a094b06eb51cc2a91c962f",
  "tests/golf-media.test.mjs": "bf1de1271c9dfd7afbaf240fee0f98978044a88086ce3f3a4aa22e7d7b8345c6",
  "tests/golf-navigation-alignment.browser.test.mjs": "24971a6fb40f760c7363d1bcc9c5ea2f904923a6496ce8c7a532d576321163cc",
  "tests/golf-photo-attribution.browser.test.mjs": "09b08a34ce8f370597c4608dde9951fb6990e53a0e0a302bd8774f4d16ef0c86",
  "tests/golf-photo-attribution.test.mjs": "1020f54f64d10f1a9494f736b3af97aa6d3d7411b774465ca4e0610d20a8edee",
  "tests/golf-visuals-fragment.browser.test.mjs": "01e706e9beb194a8c8e35f71a433e1fd6bf23296fedd7c91e8728af6860d79a7",
  "tests/golf-visuals-fragment.test.mjs": "a9f3b91545581086ad09db34326c4e38e796fa84bd164b66aa30e1a638bff6ec",
  "tests/golf-zone.browser.test.mjs": "c73eeb806f0ede84d4011542e3642cd6d844003c19490f135d504ba115ba2084",
  "tests/guide-accuracy.browser.test.mjs": "08348623f72e5f751375ceb20f385ae4dacfcc31c7d87136e1516cb378f79a03",
  "tests/guide-copy.test.mjs": "501baaab23f137b0f5bfc138eb3621d1d9f3cf52e869c618a4962e5fbbd558ef",
  "tests/guide-performance.browser.test.mjs": "22d3cd3a95472e3f238ff3754b54505a6ee1f642f148a692addd6fb47c632505",
  "tests/guide-performance.test.mjs": "59e25bba6f98d4af16d64e3822f3dccb6d555cef568188ad4e26797ec1e1bb82",
  "tests/guides-theme.browser.test.mjs": "d7b626d0f4121a728810d300178db5877605bb1c4141e4ca4c5eeab321520934",
  "tests/helpers/golf-guide-approved-headers.mjs": "653cf2b32df00fd1ed12eebd665a84cc78518cc0ea843763f7e3d52fe61673cc",
  "tests/helpers/golf-guide-render.mjs": "c36cf6c2f9c3c65a89fa494590513b120e2dd0c0d11bbc3fbd6ff879978cce5e",
  "tests/hero-layout.browser.test.mjs": "700a1fa4aedacf2a2f0595c7875a23adc0d6a96e2c28f5a0ae96b4b924a3b771",
  "tests/navbar.browser.test.mjs": "dc2f219d0d8ea3fb0ec4989535cf9be7cb677908069cac2c70e4de8ec49ea2cd",
  "tests/newsletter.unconfigured.test.mjs": "f77e60264d20ffe6818a6cd38e45f27d83f76fa5cb2bab87f952d55a662d7cb7",
  "tests/next-launcher.test.mjs": "69ea558960f1a1fdb11e8c746260982701a53266f95c2afdb9f6b0c267dc52cf",
  "tests/nova.browser.test.mjs": "90525f1d67b3302cdd42cb3df4fba8d26765c502bdb8bc7480d8eeb1fba76d71",
  "tests/performance.browser.test.mjs": "886cdaaae42e20bce2117a195a076103c9fb9690c3d18bd44edbb1fc04cc2fc9",
  "tests/performance.test.mjs": "0490143832dbdc4b66c0975230762dfe36b41d70cc602360e9479d5d22ebf952",
  "tests/seasonal-reasons.browser.test.mjs": "0cf0b21d32837556a6cb8188eda53bc898cb8192298fe067ef418152ceaa049a",
  "tests/seasonal-reasons.test.mjs": "f42fcbb3cb5eaf2358de57651115b3ebe92d19d086df23dfce3de270f1f79b11",
  "tests/seasonal-shortlist.browser.test.mjs": "86220c15471d3d7f9754e7b9ab922c104c794453e125da42fa400be44943c449",
  "tests/seasonal-shortlist.test.mjs": "592fe99ead415ae6a866fb8123b485123e3131ed73eb5a8368d3d1cd326e5d0c",
  "tests/seo.integration.test.mjs": "b744a63fa3d78b54f6365089c8a395a85e963c547cfa54ef1fd54b1d0eba0bb6",
  "tests/stay22.live.test.mjs": "faa5fabb9480af52e416db0ff054f2a018b1e33aa14479cbeb31eb55d687772b",
  "tests/umami.test.mjs": "ab2bbd0fda34d49ddea5d285c6165b357c211a6ffd7e8893d9abbec305424995",
  "tsconfig.json": "fb8dab2900d0cd8a3c57fd085763410220de9dc8c514d5e86d04abfe16d5cacd",
  "tsconfig.tsbuildinfo": "dcbcc2b7b12004e585c404b0b8c5bd2cded48fa35e57347a2e3d05e99bdaa848"
}
const publishedManifestDigest = "69b57636e733509b666e0045610cb7c7abcdee9b87cd86a79c3e607b1f08c1a0"
const analyticsLegacyHashes = {
  'src/app/layout.tsx': '5874e9ca0ddd300a5dc691045cdeb333f5d056c65d4fc141dd1ec1b2d73c1683',
  'src/app/privacy-policy/page.tsx': 'ad14f5ed8e20350867136c69fa73d3b1fb8c539a3d19b5e005b0aa65acaf00fc',
  'tests/browser-fixture.mjs': 'f244db841e875f0e847e7f54b747bd4ccb9cb38f82db654077efdea890cacad7',
}
export const selfHarnessPath = 'tests/guide-performance.test.mjs'
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
export const approval = JSON.parse(await readFile(new URL('../fixtures/trip-planning-approved-changes.json', import.meta.url), 'utf8'))

const inventory = (actual, expected, label) => assert.deepEqual(Object.keys(actual).sort(), [...expected].sort(), label)
export function validateApproval(doc = approval) {
  assert.equal(doc.schemaVersion, 1)
  assert.equal(doc.kind, 'trip-planning-exact-inverse-approved-change')
  assert.ok(['awaiting-independent-review', 'independently-reviewed'].includes(doc.status))
  assert.equal(doc.publishedBase, publishedBase)
  assert.equal(sha256(JSON.stringify(doc.independentPublishedManifest)), publishedManifestDigest, 'independent 273-file manifest is immutable')
  assert.equal(Object.keys(publishedHashes).length, 273)
  inventory(doc.independentPublishedManifest.files, Object.keys(publishedHashes), 'published complete inventory, not just diff paths')
  for (const [path, hash] of Object.entries(publishedHashes)) assert.equal(doc.independentPublishedManifest.files[path].sha256, hash, path)
  const oldFixtures = Object.keys(publishedHashes).filter(path => path.startsWith('tests/fixtures/'))
  assert.equal(oldFixtures.length, 10)
  inventory(doc.immutableFixtures, oldFixtures, 'all ten historical fixtures')
  for (const path of oldFixtures) assert.equal(doc.immutableFixtures[path], publishedHashes[path], path)
  inventory(doc.changes, changedPaths, 'feature changed-path inventory')
  inventory(doc.addedFiles, addedPaths, 'feature added-path inventory')
  inventory(doc.securityPrerequisite.changes, securityPaths, 'separate upstream security patch inventory')
  assert.equal(doc.securityPrerequisite.nextVersion, '16.4.6')
  for (const path of securityPaths) assert.equal(doc.securityPrerequisite.changes[path].beforeHash, publishedHashes[path], path)
  for (const path of changedPaths) assert.equal(doc.changes[path].beforeHash, publishedHashes[path], path)
  inventory(doc.publishedAnalyticsContinuation.changes, continuationPaths, 'published analytics continuation inventory')
  assert.equal(doc.publishedAnalyticsContinuation.commit, publishedBase)
  for (const path of continuationPaths) {
    assert.equal(doc.publishedAnalyticsContinuation.changes[path].afterHash, publishedHashes[path], path)
    assert.equal(doc.publishedAnalyticsContinuation.changes[path].beforeHash, analyticsLegacyHashes[path], path)
  }
  assert.equal(doc.selfHarness.path, selfHarnessPath)
  assert.equal(doc.selfHarness.beforeHash, '59e25bba6f98d4af16d64e3822f3dccb6d555cef568188ad4e26797ec1e1bb82')
  assert.ok(!Object.hasOwn(doc.selfHarness, 'afterHash'), 'no unsatisfiable self pin')
  for (const entry of [...Object.values(doc.changes), ...Object.values(doc.addedFiles), ...Object.values(doc.publishedAnalyticsContinuation.changes), ...Object.values(doc.securityPrerequisite.changes)]) {
    assert.match(entry.afterHash, /^[a-f0-9]{64}$/)
    assert.ok(entry.reason?.trim())
    if (entry.beforeHash !== null) {
      assert.match(entry.beforeHash, /^[a-f0-9]{64}$/)
      assert.notEqual(entry.afterHash, entry.beforeHash)
      assert.ok(entry.edits.length > 0)
    }
  }
  for (const entry of Object.values(doc.addedFiles)) assert.equal(entry.beforeHash, null)
  assert.ok(!changedPaths.includes(selfHarnessPath))
  assert.ok(![...changedPaths, ...addedPaths].includes('tests/fixtures/trip-planning-approved-changes.json'))
  assert.equal(new Set([...changedPaths, ...addedPaths, ...securityPaths, selfHarnessPath]).size, changedPaths.length + addedPaths.length + securityPaths.length + 1, 'disjoint explicit claim inventories')
}

function splice(bytes, offset, old, replacement, label) {
  assert.ok(Number.isSafeInteger(offset) && offset >= 0 && offset + old.length <= bytes.length, `${label}: byte offset`)
  assert.ok(bytes.subarray(offset, offset + old.length).equals(old), `${label}: exact fragment at byte offset ${offset}`)
  return Buffer.concat([bytes.subarray(0, offset), replacement, bytes.subarray(offset + old.length)])
}
// Both directions are proved. Offsets are byte offsets, not JS UTF-16 indices.
function inverse(entry, input, label, self = false) {
  const bytes = Buffer.from(input)
  if (!self) assert.equal(sha256(bytes), entry.afterHash, `${label}: only final pinned afterHash is accepted`)
  let restored = bytes
  let last = bytes.length + 1
  for (const edit of [...entry.edits].reverse()) {
    const after = Buffer.from(edit.after, 'base64')
    const before = Buffer.from(edit.before, 'base64')
    assert.equal(after.toString('base64'), edit.after, `${label}: canonical after fragment`)
    assert.equal(before.toString('base64'), edit.before, `${label}: canonical before fragment`)
    assert.ok(edit.afterOffset + after.length <= last, `${label}: ordered non-overlapping edits`)
    restored = splice(restored, edit.afterOffset, after, before, label)
    last = edit.afterOffset
  }
  assert.equal(sha256(restored), entry.beforeHash, `${label}: exact independent baseline reconstruction`)
  let replayed = restored
  for (const edit of [...entry.edits].reverse()) {
    replayed = splice(replayed, edit.beforeOffset, Buffer.from(edit.before, 'base64'), Buffer.from(edit.after, 'base64'), label)
  }
  assert.ok(replayed.equals(bytes), `${label}: reversible forward replay`)
  return restored
}
validateApproval()

// Fail closed on an unknown path. Callers that retain a legacy freeze use
// legacyBytes below; unknown paths there receive NO exception to that freeze.
export function normalizeApproved(path, input) {
  assert.ok(changedPaths.includes(path) || addedPaths.includes(path) || securityPaths.includes(path), `${path}: not an approved feature/prerequisite path`)
  if (securityPaths.includes(path)) return inverse(approval.securityPrerequisite.changes[path], input, `security prerequisite/${path}`)
  if (addedPaths.includes(path)) {
    assert.equal(sha256(input), approval.addedFiles[path].afterHash, `${path}: exact new file`)
    return null
  }
  return inverse(approval.changes[path], input, path)
}
export function publishedBytes(path, input) {
  if (path === selfHarnessPath) return inverse(approval.selfHarness, input, path, true)
  if (changedPaths.includes(path)) return normalizeApproved(path, input)
  if (securityPaths.includes(path)) return normalizeApproved(path, input)
  if (addedPaths.includes(path)) { normalizeApproved(path, input); return Buffer.from(input) }
  return Buffer.from(input)
}
export function legacyBytes(path, input) {
  const published = publishedBytes(path, input)
  if (continuationPaths.includes(path)) return inverse(approval.publishedAnalyticsContinuation.changes[path], published, `published PR25/${path}`)
  return published
}
export function acceptsApproved(path, input) {
  try { normalizeApproved(path, input); return true } catch { return false }
}

export const candidateFixturePath = 'tests/fixtures/trip-planning-approved-changes.json'
export function assertScopeInventory(paths) {
  assert.deepEqual([...paths].sort(), [...Object.keys(publishedHashes), ...addedPaths, candidateFixturePath].sort(), 'unknown, missing and duplicate repository paths are refused; no env/keys/research default permits')
}
export async function verifyPublishedInventory(root = new URL('../../', import.meta.url)) {
  // Runtime/install trees and the worktree git pointer are not shipping inputs.
  // No tracked/generated file exception: next-env and tsbuildinfo remain frozen.
  const excludedRuntimeRoots = new Set(['.git', '.next', 'node_modules'])
  const paths = []
  async function walk(prefix = '') {
    for (const entry of await readdir(new URL(prefix || './', root), { withFileTypes: true })) {
      if (!prefix && excludedRuntimeRoots.has(entry.name)) continue
      const path = `${prefix}${entry.name}`
      assert.ok(!entry.isSymbolicLink(), `${path}: unreviewed symlink`)
      if (entry.isDirectory()) await walk(`${path}/`)
      else { assert.ok(entry.isFile(), `${path}: ordinary reviewed input only`); paths.push(path) }
    }
  }
  await walk()
  assertScopeInventory(paths)
  for (const [path, hash] of Object.entries(publishedHashes)) {
    const bytes = await readFile(new URL(path, root))
    const restored = publishedBytes(path, bytes)
    assert.equal(sha256(restored), hash, `${path}: independent published file freeze`)
    assert.equal(restored.length, approval.independentPublishedManifest.files[path].bytes, `${path}: independent published byte count`)
  }
  for (const path of addedPaths) normalizeApproved(path, await readFile(new URL(path, root)))
  return { published: Object.keys(publishedHashes).length, added: addedPaths.length, immutableFixtures: Object.keys(approval.immutableFixtures).length }
}
