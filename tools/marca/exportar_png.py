import asyncio,sys,re
from playwright.async_api import async_playwright
jobs=sys.argv[1:]  # svg:out:width
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for j in jobs:
            src,out,w=j.split(':'); w=int(w)
            s=open(src).read(); vw,vh=map(float,re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"',s).group(1,2)); h=round(w*vh/vw)
            pg=await b.new_page(viewport={'width':w,'height':h})
            await pg.set_content(f'<html><body style="margin:0;background:transparent">{s.replace("<svg ","<svg style=\'display:block;width:%dpx;height:%dpx\' "%(w,h),1)}</body></html>')
            await pg.screenshot(path=out,omit_background=True); await pg.close()
        await b.close()
asyncio.run(main())
