# Android playback and integration

## MediaCodec and video-surface failures

If PipePipe's error report mentions `MediaCodec`, the Android decoder may be the
failing layer rather than YouTube extraction. In **Settings → Advanced →
ExoPlayer settings**, try one relevant workaround at a time:

- **Disable MediaCodec asynchronous queueing** for compatibility problems that
  may be caused by asynchronous queueing. This can reduce performance.
- **Always use ExoPlayer's video output surface setting workaround** when the
  failure occurs while Android changes the video output surface.

Restart playback after each change and keep the report if it does not help.

These switches trade compatibility for performance or use a different output
path; they are not general quality/connection fixes. Record the original state,
the one switch changed, a single tested URL/format, and the result. Reset the
workaround if it did not help so later reports describe the normal state.

If audio continues but video is black, flickers, or periodically stutters, give
the selected codec/format and resolution. Advanced codecs or high resolution can
expose decoder limitations that an ordinary lower-resolution stream does not.

## Device-specific problems

For an issue limited to one phone, ROM, tablet layout, TV mode, or Android
version, include device model, Android/ROM version, display orientation, and
whether it also occurs on another device. A device-specific report still needs
the PipePipe version and reproducible steps; “works on my other phone” is a
useful comparison, not the reproduction itself.

## Android Auto

Android Auto can hide applications installed outside Google Play. Enable Android
Auto developer settings, allow unknown sources there, and reconnect the device.
This affects app visibility in Android Auto; it does not grant network access or
change YouTube playback behaviour.

For Android Auto, say whether PipePipe is absent from the launcher, appears but
will not open, or opens but cannot play. Include the Android Auto version, phone
Android version, vehicle/head-unit context if relevant, and installation source.
