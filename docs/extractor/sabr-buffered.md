# Buffered ranges and seeking

Part of [SABR in the extractor](./sabr). The current PipePipeExtractor does not
own a playback buffer or a `YoutubeSabrStreamState`; those policies live in the
application layer that builds `YoutubeSabrRequest` objects.

## What the extractor provides

`YoutubeSabrRequest.Track` can carry two pieces of caller-owned state:

- a `YoutubeSabrFormatTimeline`, parsed from initialization data;
- `bufferedThrough`, the last contiguous sequence the caller wants to report.

When both are present and `bufferedThrough > 0`,
`YoutubeSabrRequestHelper` writes a `bufferedRange` starting at time zero and
ending at the timeline end of that sequence. The range uses segment indexes
starting at one and a timescale of `1000`. If no timeline is available, no
buffered range is emitted for that track.

This is intentionally conservative: a caller must not advertise a range past a
hole. Reporting a later sequence while an earlier segment is missing can make
the server skip the missing media and leave the reader stalled.

## Seeking

For a seek, the application should derive a sequence with
`YoutubeSabrFormatTimeline.getSequenceAt(timeMs)`, discard or retain its own
cached segments as appropriate, and build a new `YoutubeSabrRequest.playback`
with the target player time and honest contiguous ranges. SABR itself does not
provide a client cache API in the extractor.

The timeline lookup returns sequence `1` for non-positive times, the first entry
whose end is after the requested time, or one past the final indexed sequence if
the time is beyond the index. MP4 and WebM indexes are parsed from the format's
initialization bytes; callers should wait for a valid timeline before claiming
precise seek coverage.

Next: [The session driver](./sabr-session).
