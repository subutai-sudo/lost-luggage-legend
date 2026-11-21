import { test, expect } from './browser-fixture.mjs'
for (const width of [320,390,1024,1280,1440]) {
  test(`${width}px: compact angled ticket clears wording, action and full aircraft window`, async ({page}) => {
    await page.setViewportSize({width,height:1000})
    await page.goto('/?month=1',{waitUntil:'domcontentloaded'})
    await expect(page.locator('[data-goldilocks-home]')).toHaveAttribute('data-ready','true')
    await page.evaluate(()=>document.fonts.ready)
    const box = await page.evaluate(()=>{
      const ticket=document.querySelector('[data-travel-ticket]'), window=document.querySelector('[data-aircraft-window]')
      const matrix=new DOMMatrix(getComputedStyle(ticket).transform)
      const elements=[document.querySelector('[data-hero-scene] h1'),document.querySelector('[data-hero-scene] h1 + p'),document.querySelector('[data-hero-scene] a[href="#month-picker"]')]
      const clear=elements.every(e=>{const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(!n.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(n);for(const r of range.getClientRects()){const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);if(!e.contains(hit))return false}}return true})
      return {ticket:ticket.getBoundingClientRect().toJSON(),window:window.getBoundingClientRect().toJSON(),angle:Math.atan2(matrix.b,matrix.a)*180/Math.PI,clear,scroll:document.documentElement.scrollWidth}
    })
    expect(box.ticket.width).toBeLessThanOrEqual(450)
    expect(box.angle).toBeLessThanOrEqual(-5)
    expect(box.angle).toBeGreaterThanOrEqual(-12)
    expect(box.clear,'headline, copy and month action remain unobscured').toBe(true)
    expect(box.ticket.left).toBeGreaterThanOrEqual(0)
    expect(box.ticket.right).toBeLessThanOrEqual(width)
    expect(box.scroll).toBeLessThanOrEqual(width+1)
    const a=box.ticket,b=box.window
    expect(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top,'ticket never covers window or sill').toBe(false)
    if(width>=1200){expect(a.right).toBeLessThan(b.left);expect(a.left).toBeGreaterThan(width*.25);expect(a.top).toBeGreaterThan(380)}
  })
}
