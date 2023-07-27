export async function hasSession() {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        if (cookie.includes("session=")) {
            var isAuthorized = await hasCookie(cookie.replace("session=", ""));
            if (isAuthorized) {
                return true;
            }
        }
    }
    return false;
}

const hasCookie = async (cookieId) => {
    try {
        const url = `http://localhost:8080/get-cookie?cookieId=${cookieId}`;
        const response = await fetch(url);
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};
