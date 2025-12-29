export const isEthAddressStrict = (s) => /^0x[a-fA-F0-9]{40}$/.test(s);

export const extractEthAddress = (s) => {
  if (!s || typeof s !== "string") return null;
  const m = s.match(/0x[a-fA-F0-9]{40}/i);
  return m ? m[0] : null;
};
