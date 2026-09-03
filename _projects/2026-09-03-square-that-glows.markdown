---
layout: post
title:  "SquareThatGlows: an 8x8 square that now listens to Spotify"
date:   2026-09-03 21.14.00 +0530
categories: site update
sidebar_sections:
  - label: "What even is this thing"
    url: "#what-even-is-this-thing"
  - label: "The stack, such as it is"
    url: "#the-stack-such-as-it-is"
  - label: "The part I'm actually proud of"
    url: "#the-part-im-actually-proud-of"
  - label: "Things that broke on the way"
    url: "#things-that-broke-on-the-way"
  - label: "What's next"
    url: "#whats-next"
---

So there's an 8x8 grid of WS2812B LEDs sitting on my desk, being driven by an ESP32 over Bluetooth, and as of this week it also knows what song I'm playing. This is Project SquareThatGlows, and this update is basically me talking through what I bolted onto it and why.

![My room with the SquareThatGlows glowing purple](/assets/images/Cool_room.jpeg)

## What even is this thing

At its core, SquareThatGlows is a 64-LED matrix controller. ESP32 on the firmware side running FastLED, a tiny custom BLE protocol on top of it, and a web dashboard that talks to the board straight from the browser using the Web Bluetooth API. No app, no cloud, no account - you open a page, you hit connect, and you're pushing colour straight to the thing.

![Front side of the SquareThatGlows](/assets/images/STG_front.jpeg)

Although the protocol is currently only supported by chrome, its not a big deal (irrespective of what I might say in [Takes](/takes/)) in the future. :l

The dashboard itself has two moods. There's a **Sequences** tab, which is just full pre-built animations - Tron Vibe, Sunset Chill, Aurora, Storm, that kind of thing, one tap and the whole board commits to a personality. And there's a **Colour** tab, where you actually pick a hue off a saturation/value canvas and then choose how that colour *behaves*: static, breathing, drifting, pulsing against its complementary colour, sparkling, cycling through a triad. Same colour, seven different moods.

Everything from the browser gets packed into one compact command and written over BLE - either a brightness byte or a full effect descriptor with both colours, a speed, and a param. The firmware parses it, validates it, and only commits it if it's well-formed, so a bad write from the browser can't corrupt whatever's currently running on the board.

## The stack, such as it is

- **Hardware:** ESP32 + WS2812B 64LED Matrix on a perfboard with an on/off button
- **Firmware:** ESP32 + FastLED, BLE GATT server, a hand-rolled wire protocol (`B<0-255>` for brightness, `E<id>,<r1,g1,b1>,<r2,g2,b2>,<speed>,<param>` for everything else)
- **Dashboard:** plain HTML/CSS/JS, no framework, talking directly to the board through `navigator.bluetooth`
- **New this round:** a Spotify integration, PKCE auth and all, that reads whatever's currently playing and pushes the album art's dominant colour onto the matrix. Now, I haven't been able to make sure if other people can use the code just as I can because maybe my API works only for me, and not other users of this app (since it requires spotify login)

## The part I'm actually proud of

The Spotify sync was the actual point of this update. The flow is: dashboard authenticates against Spotify using PKCE (so no client secret sitting in browser JS, which matters when your redirect URI is a GitHub Pages URL for the world to see), polls the currently-playing endpoint every couple of seconds, and the moment the track changes, it grabs the album art.

Then it does something I like: it doesn't just average the album cover into a muddy grey. It draws the artwork down to a 10x10 canvas, walks every pixel, converts to HSV, and keeps whichever pixel has the highest saturation above a brightness floor. That's the colour that gets sent to the board. It's a cheap trick, but it means a moody black-and-white album cover with one red splash of colour actually sends red, instead of the average-everything grey you'd get from a naive mean.

Whatever colour comes out gets sent as a **Breathe** effect rather than a flat static fill - slow speed, moderate depth - so the whole thing feels like the square is breathing in time with whatever's playing, not just snapping to a colour and sitting there. And it's deduped against the last hex sent, so switching between two songs with near-identical cover art doesn't spam the BLE link with redundant writes.

## Things that broke on the way

- Getting `crossOrigin = "Anonymous"` right on the album art `Image` object so I could actually read pixel data off the canvas without the browser silently tainting it
- Remembering that sending a static colour command after the breathe command would just steamroll the breathing effect - the UI update after a Spotify sync had to be display-only, not a full re-send
- The usual PKCE dance: code verifier in localStorage, code challenge derived via SHA-256, and making sure the redirect URI registered with Spotify matched the GitHub Pages URL down to the trailing slash

## What's next

Firmware-side, brightness and effect state aren't readable back yet - there's a reserved `S` command in the protocol for state readback that's still a stub, so right now the dashboard just assumes the board is in whatever state it last told it to be in. That's the next real piece of work: closing the loop so a fresh page load can ask the board "what are you actually doing right now" instead of guessing.

Firmware and dashboard code live in the usual place if you want to poke at it. As always, if something looks broken, it probably is - this is a permanently-incomplete project by design.
