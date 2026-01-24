<p align="center">
  <img height="75" src="https://github.com/user-attachments/assets/d09ccf61-003a-40e0-8d32-b57843133ad6">
</p>

---

Web osu!mania is an unofficial web port of osu!'s piano-style gamemode, osu!mania. Play beatmaps directly in your browser, without the need to download the desktop application.

Game mechanics attempt to match (if not come close to) the official osu!mania's V2 scoring system.

**Features**

- Search & filter beatmaps just like on the osu! site
- Gameplay mods + custom song speed
- Local high scores
- Save beatmaps
- Supports SV beatmaps and beatmap hitsounds
- Supports keyboard, gamepad, and touch screen input

**Supported Settings**

- Scroll speed
- Bar/circle/arrow/diamond skins
- Upscroll
- Enable/disable 300g judgement, error bar, FPS counter
- ...and more!

[Visit the site](https://webosumania.com/)

Site blocked on your network? Try these mirrors:

- [Mirror 1](https://webosumania.hectickiwi.workers.dev)
- [Mirror 2](https://hectickiwi.github.io/Web-Osu-Mania)
- [Mirror 3](https://wom.slingexe.com)

## Demo

https://github.com/user-attachments/assets/c449893b-ea35-41b7-88c2-63e77d7b0a44

## Credits

- NeriNyan for providing their [beatmap mirror API](https://nerinyan.stoplight.io/docs/nerinyan-api)
- SayoBot for providing their [beatmap mirror API](https://osu.sayobot.cn/home)
- Mino for providing their [beatmap mirror API](https://dev.catboy.best/docs)
- Peppy and the rest of the osu! team for creating [osu!](https://osu.ppy.sh/)

## Development

- Add a `.env` to the project's root:

```
NEXT_PUBLIC_BASE_URL=https://webosumania.com
IS_CF_WORKER=false # Set to true if deploying as a Cloudflare Worker

# Get these values by following these instructions: https://osu.ppy.sh/docs/index.html#registering-an-oauth-application
OSU_API_CLIENT_ID=
OSU_API_CLIENT_SECRET=

# Ratelimit
TRUST_CF_CONNECTING_IP=true # Set to false if not behind Cloudflare
```

- Install NPM packages with `npm install`
- Run with `npm run dev`
- Open in browser at [http://localhost:3000](http://localhost:3000)

## Disclaimer

This project is not affiliated with or endorsed by osu! or its creators. All assets, including images, sounds, and any other copyrighted materials, are the property of their respective owners. The use of these assets in this project is intended for non-commercial, educational, or personal use only.

By using the site, you agree to comply with the terms and conditions set forth by the original content creators.
