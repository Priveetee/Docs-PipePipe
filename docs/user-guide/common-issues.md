# Common Issues

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
