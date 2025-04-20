const getSocialPlatformName = (url) => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("linkedin.com")) {
        return "LinkedIn";
    } else if (lowerUrl.includes("instagram.com")) {
        return "Instagram";
    } else if (lowerUrl.includes("facebook.com")) {
        return "Facebook";
    } else if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
        return "Twitter"; // or "X" if you prefer
    } else if (lowerUrl.includes("tiktok.com")) {
        return "TikTok";
    } else if (lowerUrl.includes("youtube.com")) {
        return "YouTube";
    } else if (lowerUrl.includes("pinterest.com")) {
        return "Pinterest";
    } else if (lowerUrl.includes("threads.net")) {
        return "Threads";
    } else if (lowerUrl.includes("bsky.app")) {
        return "Bluesky";
    } else if (lowerUrl.includes("soulup.in")) {
        return "Soulup";
    }
    return "Social Profile"; // Default if platform not recognized
};


export default getSocialPlatformName