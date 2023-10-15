const DEBUG_LOG = true;

// valid types/levels are 'error', 'info' and 'debug'
//                         = 0      = 1        = 2
export const log = (type, message) => {
    if (type === "debug" && DEBUG_LOG === true) {
        console.log(`DEBUG INFO: ${message}`)
    }
    else {
        let now = new Date();
        // generate datetime string
        let datetimeStr =
            now.getFullYear()
            + '-'
            + (now.getMonth() + 1)
            + '-'
            + now.getDate()
            + ' '
            + now.getHours()
            + ":"
            + now.getMinutes()
            + ":"
            + now.getSeconds();

        if (typeof (message) !== "string")
            message = JSON.stringify(message)

        if (type === "info")
            console.log(`[INFO] ${datetimeStr}: ${message}`);
        if (type === "error")
            console.error(`[ERROR] ${datetimeStr}: ${message}`);
    }
}

export const generateRandomString = (length) => {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    }
    return result.join('');
}