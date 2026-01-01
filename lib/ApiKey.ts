import crypto from "crypto";

const SECRET = process.env.API_SECRET || "EL6prehgjXyt9MnGHg3icEaIgTMKAJFL";

export interface ApiKeyData {
    tin: string;
    bhfId: string;
    clientId: string;
    iat: number; 
}

export class ApiKey {
    static generate(tin: string, bhfId: string, clientId: string): string {
        const payload: ApiKeyData = {
            tin,
            bhfId,
            clientId,
            iat: Math.floor(Date.now() / 1000)
        };

        const json = JSON.stringify(payload);

        // AES-256-GCM encryption
        const iv = crypto.randomBytes(12); // GCM recommended IV size
        const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(SECRET), iv);

        let encrypted = cipher.update(json, "utf8", "base64url");
        encrypted += cipher.final("base64url");

        const authTag = cipher.getAuthTag().toString("base64url");

        return `${iv.toString("base64url")}.${encrypted}.${authTag}`;
    }

    static decrypt(apiKey: string): ApiKeyData {
        const parts = apiKey.split(".");
        if (parts.length !== 3) throw new Error("Invalid API Key format");

        const [ivBase, encrypted, tagBase] = parts;

        const iv = Buffer.from(ivBase, "base64url");
        const authTag = Buffer.from(tagBase, "base64url");

        const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(SECRET), iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, "base64url", "utf8");
        decrypted += decipher.final("utf8");

        return JSON.parse(decrypted);
    }
}



// const key = ApiKey.generate("999000240", "00", "CLIENT123");
// console.log("API_KEY:", key);