# Common Issues

## Network and YouTube Restrictions

### AntiBotException: "Sign in to confirm you’re not a bot"
This is a server-side block from YouTube. It happens when your IP address is flagged for "abnormal behavior" (too many requests in a short time, often caused by NAT or importing many subscriptions).

**Solutions:**
1.  **Change your IP:** Switch from Wi-Fi to mobile data, or restart your router to get a new dynamic IP.
2.  **Use a VPN:** We recommend using a high-quality service like [Proton VPN](https://protonvpn.com/).
    *   *Note: We are not affiliated with this service; this recommendation is based on community tests showing its reliability.*
3.  **Switch Region:** If you are using a VPN and still get the error, simply change the server to another country. This provides a new IP that is likely not flagged by YouTube.
4.  **Orbot (Tor):** Using [Orbot](https://orbot.app/) allows you to rotate through different exit nodes across the world until the block is bypassed.
5.  **Login:** Logging into your YouTube account within PipePipe remains a stable way to avoid this exception if you don't want to use a VPN.

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
