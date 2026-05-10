import { DEFAULT_NETWORK_PREFIX } from "@/constants/wearable-connect/constants";

export const isNumericString = (value: string) => {
  return /^\d+$/.test(value.trim());
};

export const isValidOctet = (
  value: string,
  options: { min?: number; max?: number } = {},
) => {
  if (!isNumericString(value)) {
    return false;
  }

  const { min = 0, max = 255 } = options;
  const numericValue = Number(value);

  return (
    Number.isInteger(numericValue) &&
    numericValue >= min &&
    numericValue <= max
  );
};

export const isValidThirdOctet = (value: string) => {
  return isValidOctet(value, { min: 0, max: 255 });
};

export const isValidHostOctet = (value: string) => {
  return isValidOctet(value, { min: 1, max: 254 });
};

export const isValidPort = (value: string) => {
  const trimmedValue = value.trim();

  if (!isNumericString(trimmedValue)) {
    return false;
  }

  const numericValue = Number(trimmedValue);

  return (
    Number.isInteger(numericValue) &&
    numericValue >= 1 &&
    numericValue <= 65535
  );
};

export const normalizeOctet = (value: string) => {
  return String(Number(value));
};

export const normalizePrivateHost = (host: string) => {
  const parts = host.trim().split('.');

  if (parts.length !== 4 || parts[0] !== '192' || parts[1] !== '168') {
    return null;
  }

  const [, , thirdOctet, hostOctet] = parts;

  if (!isValidThirdOctet(thirdOctet) || !isValidHostOctet(hostOctet)) {
    return null;
  }

  return `${DEFAULT_NETWORK_PREFIX}.${normalizeOctet(thirdOctet)}.${normalizeOctet(
    hostOctet,
  )}`;
};

export const parseStreamAddress = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const matchedAddress = /^(?:http:\/\/)?(192\.168\.\d{1,3}\.\d{1,3}):(\d{1,5})(?:\/.*)?$/i.exec(
    trimmedValue,
  );

  if (!matchedAddress) {
    return null;
  }

  const [, rawHost, rawPort] = matchedAddress;
  const host = normalizePrivateHost(rawHost);

  if (!host || !isValidPort(rawPort)) {
    return null;
  }

  return {
    host,
    port: Number(rawPort),
  };
};
