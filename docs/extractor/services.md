# Services at a glance

YouTube has [its own page](./youtube-service). The other six services are smaller, but each has a quirk worth knowing before you open its code. All implement the same `StreamingService` contract; what differs is how they fetch and what they support.

## SoundCloud (id 1)

Audio and comments. Talks to the `api-v2.soundcloud.com` REST API. The catch: there is no fixed API key, the `client_id` is scraped at runtime from SoundCloud's own frontend JavaScript (a `,client_id:"..."` match in an `sndcdn.com` script) and appended to every call. Charts are a kiosk; it also has suggestions and subscription import. No video.

## BiliBili (id 5)

Video, comments, bullet comments, and SponsorBlock, the most involved service. Stream URLs come from `api.bilibili.com` JSON, but most calls must be **WBI-signed**: it pulls a rotating permutation table from `/x/web-interface/nav`, builds a mixin key, and stamps requests with `w_rid` + `wts`. It also fabricates a cookie/ticket set (`buvid3/4`, `b_lsid`, `bili_ticket`, ...). Bullet comments (danmaku) arrive two ways: a zlib-compressed binary dump for VOD, and a WebSocket `DANMU_MSG` stream for live. Premium content uses a separate PGC endpoint. Adaptive (DASH) streams carry per-stream byte ranges (init + index), parsed from the `SegmentBase` `Initialization` / `indexRange` onto the audio and video tracks, so each plays as its own DASH representation. Expect the signing and table bits to need maintenance.

## NicoNico (id 6)

Video and bullet comments (ordinary comments are disabled). Hybrid: it scrapes the watch page for a `script#embedded-data` JSON blob, then calls `nvapi.nicovideo.jp` with `X-Frontend-Id` headers. Playback is a negotiation: POST to `.../access-rights/hls` with the resolutions and audio you want, get back an encrypted HLS URL (gzip responses). Several content classes are login-gated.

## PeerTube (id 3)

Video and comments, and the only federated one. There is no single backend: the service is bound to an **instance** (default `framatube.org`, user-configurable), and the instance URL *is* the API base (`/api/v1/...`). Plain JSON, no signing. Trending / Most-liked / Recent / Local are kiosks; channels expose `CHANNELS` and `PLAYLISTS` tabs.

## Bandcamp (id 4)

Audio and comments. Mostly HTML scraping: album and track data come from a `data-tralbum` JSON attribute on the page. Two kiosks: Featured, and the weekly Radio show, the latter via a dedicated `bcweekly` API and its own radio stream extractor (selected by URL).

## media.ccc.de (id 2)

Audio and video, no comments. A clean public JSON API (`api.media.ccc.de/public/events/{id}`). Content is organised around **conferences**: a conference is a channel, and the kiosks are conferences / recent / live. Two-stage fetch: event metadata first, then the parent conference via a URL in the event.

## Quick reference

| Service | id | Media | Fetch | Watch out for |
|---|---|---|---|---|
| SoundCloud | 1 | audio, comments | api-v2 REST | dynamic `client_id` from JS |
| media.ccc.de | 2 | audio, video | public JSON API | conference-centric, no comments |
| PeerTube | 3 | video, comments | per-instance JSON | federated, instance = API base |
| Bandcamp | 4 | audio, comments | HTML scrape + JSON | `data-tralbum` blob, Radio show |
| BiliBili | 5 | video, comments, danmaku, SponsorBlock | api.bilibili.com JSON | WBI signing + cookie/ticket |
| NicoNico | 6 | video, danmaku | HTML + nvapi | login gate, HLS access-rights POST |
