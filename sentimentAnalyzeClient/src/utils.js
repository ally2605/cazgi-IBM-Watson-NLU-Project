function isValidURL (string) {
    try {
        let url = new URL(string);
    }catch (_) {
        return false;
    }
    return true;
}

export default isValidURL;