interface DiscordError extends Error {
    MissingPermissionsError: any
}

// for some reason checking for errors doesn't actually work with d.js
export const APIErrors = {
    "UNKNOWN_ACCOUNT": "Unknown Account",
    "UNKNOWN_APPLICATION": "Unknown Application",
    "UNKNOWN_CHANNEL": "Unknown Channel",
    "UNKNOWN_GUILD": "Unknown Guild",
    "UNKNOWN_INTEGRATION": "Unknown Integration",
    "MISSING_PERMISSIONS": "Missing Permissions",
    "CANNOT_MESSAGE_USER": "Cannot Message User"
};