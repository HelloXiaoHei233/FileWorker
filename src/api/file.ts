import axios from 'axios';

function buildValidatedUrl(baseUrl: string, filename: string): string {
    try {
        // Minimal path validation
        if (baseUrl.includes('/../') || /\/%2e%2e\//i.test(baseUrl)) {
            throw new Error('Invalid path');
        }
        
        const url = new URL(baseUrl, 'http://localhost');
        
        // Validate filename parameter
        if (!/^[A-Za-z0-9_.-]+$/.test(filename)) {
            throw new Error('Invalid parameter');
        }
        
        // Rebuild pathname from fixed literals + validated segments
        url.pathname = `/${filename}`;
        
        return url.pathname;
    } catch {
        throw new Error('Invalid URL');
    }
}

const PutFile = async (filename: string, file: File | string, visibility: string, type: string = "file") => {
    const url = buildValidatedUrl('/', filename);
    const headers = {
        'x-store-visibility': visibility,
        'x-store-type': type,
    };
    const response = await axios.put(url, file, { headers });
    return response.data;
}

const PatchFile = async (filename: string, visibility?: string) => {
    const url = buildValidatedUrl('/', filename);
    const headers: { [key: string]: any } = {};
    if (visibility) {
        headers['x-store-visibility'] = visibility;
    }
    const response = await axios.patch(url, {}, { headers });
    return response.data;
}

const DeleteFile = async (filename: string) => {
    const url = buildValidatedUrl('/', filename);
    const response = await axios.delete(url);
    return response.data;
}

export { PutFile, PatchFile, DeleteFile }