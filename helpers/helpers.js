if (window.__helpers === undefined) {
    window.__helpers = {
        isValidURL: function(url) {
            try {
                const parsed = new URL(url);
                return ['http:', 'https:'].includes(parsed.protocol);
            } catch (e) {
                return false;
            }
        },
        defaultToHTTPS: function(url) {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                return `https://${url}`;
            }
            return url;
        },
        isValidGolinkName: function(name) {
            return name.trim().replace(/[^a-zA-Z0-9/]/g, '').length > 0;
        },
        sanitizeGolinkName: function(name) {
            return name.trim().replace(/[^a-zA-Z0-9/]/g, '');
        },
    };
}