# Common Issues

## Network and YouTube Restrictions

### YouTube Blocking or Failing to Load Streams
This covers two related errors that both stem from YouTube restricting or failing to serve stream data to anonymous clients:

- `AntiBotException: Sign in to confirm you're not a bot`
- `ExtractionException: Error occurs when fetching the page. Try increase the loading timeout in Settings.`

While the error messages differ, they share common root causes: your IP being flagged by YouTube, rate-limiting of anonymous requests, network timeouts, or transient server-side failures on YouTube's end.

**Solutions:**

1.  **Retry the video:** The `ExtractionException` is often transient. Simply tapping retry or reopening the video resolves it.
2.  **Increase the loading timeout:** Go to `Settings > Advanced > Video loading timeout` and increase the value. This gives PipePipe more time to fetch stream metadata before giving up.
3.  **Change your IP:** Switch from Wi-Fi to mobile data, or restart your router to get a new dynamic IP. A flagged IP is the most common cause of the `AntiBotException`.
4.  **Use a VPN:** We recommend a high-quality service like [Proton VPN](https://protonvpn.com/).
    *   *Note: We are not affiliated with this service; this recommendation is based on community tests showing its reliability.*
5.  **Switch VPN region:** If you are already on a VPN and still get the error, change server to another country for a fresh, unflagged IP.
6.  **Orbot (Tor):** Using [Orbot](https://orbot.app/) lets you rotate through different exit nodes worldwide until the block is bypassed.
7.  **Login:** Logging into your YouTube account within PipePipe remains a stable way to avoid both exceptions if you prefer not to use a VPN. See [YouTube Login Issues](#youtube-login-issues) for more information.

::: tip Anonymous vs. logged-in
YouTube throttles and blocks anonymous (unauthenticated) clients far more aggressively than logged-in ones. If you keep hitting either of these errors, logging in is the most reliable long-term fix. See [YouTube Login Issues](#youtube-login-issues) for more information.
:::

## YouTube Login Issues

### Why login may be unavailable

YouTube frequently implements new encryption mechanisms in its API to prevent unauthorized access. In late 2025, YouTube introduced **complex encryption in its logged-in state extractor**, making it impossible for PipePipe to extract video streams when users were logged in.

**Background:** PipePipe does not use YouTube's official API (which doesn't exist for third-party apps). Instead, it extracts data from YouTube's InnerTube API by reverse-engineering YouTube's web and mobile interfaces. This approach requires analyzing the requests and responses that YouTube sends to legitimate clients.

**The Problem:** This is not a gradual issue. When it happens, it is a breaking change that affects all logged-in users simultaneously, making video playback fail for everyone trying to use the login feature.

**Why the temporary disable?** The developers had two options:
1. Keep login enabled and let users face broken video playback (poor user experience)
2. Temporarily disable login while finding a workaround

They chose option 2 to prevent a cascade of crash reports and user frustration.

**If you are reading this, login is likely currently disabled.** This is part of a recurring cycle: a workaround has been found before and login has been re-enabled in the past. It will be re-enabled again once a new workaround is found.

**Bottom line:** This isn't a feature being phased out, it's a cat and mouse game between YouTube's security team (trying to block unauthorized access) and open source developers (trying to maintain compatibility). When YouTube changes its encryption, PipePipe temporarily breaks until a new workaround is found. This cycle repeats as YouTube continuously evolves its protections.

### If login is unavailable

::: warning ⚠️ Login Temporarily Unavailable
If you cannot log in, use the alternative methods from the [Network and YouTube Restrictions](#network-and-youtube-restrictions) section above.
:::

## Video Playback: "The page needs to be reloaded"

This is currently the most reported issue. Users see a popup or an error log stating: `org.schabi.newpipe.extractor.exceptions.ContentNotAvailableException: The page needs to be reloaded.`

### Why is this happening?
YouTube frequently performs "A/B testing" on its player logic. This means they change how video data is sent to the client. Since PipePipe is a "wrapper" that extracts this data, any change on YouTube's side can break the extraction process.

### The Fix (Version 4.7.8+)
The developer has already released a fix in **version 4.7.8**. However, many users are still experiencing the bug because of how they update the app.

### Step-by-Step Resolution

1. **Verify your current version**
   Go to `Settings > About` in PipePipe. If you see version **4.7.7** or lower, you are affected by this bug.

2. **The F-Droid Delay**
   If you installed PipePipe via F-Droid, you might notice that 4.7.8 is not available yet. F-Droid takes about **7 days** to review and publish new versions.
   
   ::: tip Solution
   Consult our [Installation Guide](/user-guide/installation) to learn how to install updates immediately using Obtainium or GitHub.
   :::

3. **Updating immediately**
   To fix the error right now, do not wait for F-Droid. Download the APK directly from the [Official GitHub Releases](https://github.com/InfinityLoop1308/PipePipe/releases).

### How to prevent this in the future
To avoid being blocked for a week every time YouTube makes a change, the community recommends using **Obtainium**. This tool tracks the GitHub repository directly and provides updates the minute the developer hits "Publish," bypassing the F-Droid delay entirely.

### Application fails to install
Make sure your device meets the [System Requirements](/user-guide/installation#system-requirements).

## Android Auto

### PipePipe does not appear in Android Auto
Since PipePipe is not available on the Google Play Store, Android Auto hides it by default for security reasons.

**Solution:**
1.  Open **Android Auto** settings on your phone.
2.  Scroll to the bottom and tap the **Version** section 10 times until a popup says "Developer mode enabled".
3.  Tap the three dots (menu) in the top right corner and select **Developer settings**.
4.  Scroll down and check the box for **Unknown sources**.
5.  Restart Android Auto (or disconnect and reconnect your phone to your car).

## Interface and Player

### Minimized player bar or "Enqueue" option is missing
Sometimes, when starting a video directly in background or popup mode, the player bar at the bottom doesn't appear, making it impossible to manage your queue.

**Solution:**
*   This was a major bug fixed in **version 4.7.2**. 
*   If you are still seeing this, it confirms you are on an outdated version. Please update to at least **4.7.8** using the methods described in the [Installation Guide](/user-guide/installation).

### Video buffering followed by a crash
If your video suddenly starts buffering and the app eventually crashes (common on Xiaomi/MIUI devices), it is likely a hardware synchronization issue.

**Solution:**
1.  Go to **Settings > Advanced > ExoPlayer Settings**.
2.  Enable the option **Always use ExoPlayer video output surface setting workaround**.
3.  Restart the application.
4.  If it still happens, a full device reboot is recommended.

### Crash when playing downloaded videos
If PipePipe crashes when you try to open a downloaded file, it is usually a permission conflict with your external video player.

**Solution:**
*   **Permissions:** Ensure your video player app has "Files and Media" permissions granted in Android Settings.
*   **Recommended Player:** Use a robust player like **VLC** or **Just (Video) Player**. They handle Android's Scoped Storage better than many stock gallery apps.
*   **Alternative:** Instead of playing from PipePipe, try opening the video directly from your phone's File Manager.
