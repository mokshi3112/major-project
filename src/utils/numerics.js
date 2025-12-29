/* eslint-disable no-undef */
// Hardened helpers to safely convert blockchain numeric types
// - supports ethers.BigNumber-like objects (duck-typed by _hex or toHexString)
// - supports native bigint
// - supports numeric strings
// - always avoids implicit BigInt/Number mixing

const looksLikeBigNumber = (v) =>
    v &&
    typeof v === "object" &&
    (("_hex" in v && v._hex) || typeof v.toHexString === "function");

export const toStringSafe = (v) => {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v;
    if (typeof v === "bigint") return v.toString();
    if (looksLikeBigNumber(v)) return v.toString();
    // numbers or other objects
    try {
        return String(v);
    } catch (e) {
        return "";
    }
};

// Convert to JS Number safely (for UI calculations that need decimals).
// WARNING: may lose precision for integers > 2^53-1. Use toBigIntSafe if exact integer math needed.
export const toNumberSafe = (v) => {
    if (v === null || v === undefined || v === "") return 0;
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    if (typeof v === "bigint") {
        // convert bigint to Number (may lose precision)
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    }
    if (looksLikeBigNumber(v)) {
        const s = v.toString();
        const n = Number(s);
        return Number.isFinite(n) ? n : 0;
    }
    if (typeof v === "string") {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    }
    // fallback
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

// Convert to BigInt safely for integer-only arithmetic (IDs, timestamps).
// Drops fractional part for strings containing decimals.
export const toBigIntSafe = (v) => {
    if (v === null || v === undefined || v === "") return 0n;
    if (typeof v === "bigint") return v;
    if (typeof v === "number") return BigInt(Math.trunc(v));
    if (looksLikeBigNumber(v)) {
        try {
            return BigInt(v.toString());
        } catch (e) {
            return 0n;
        }
    }
    if (typeof v === "string") {
        try {
            if (v.includes(".")) {
                const intPart = v.split(".")[0] || "0";
                return BigInt(intPart);
            }
            return BigInt(v);
        } catch (e) {
            return 0n;
        }
    }
    try {
        return BigInt(String(v));
    } catch (e) {
        return 0n;
    }
};
