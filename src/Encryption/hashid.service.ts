import Sqids from "sqids";
import { configService } from "~/config/config.service";

const sqids = new Sqids({
  alphabet: configService.squidsAlphabet,
  minLength: 6,
});

export const hashidService = {
  decodeOrNull: (id: string): number | null => {
    try {
      return sqids.decode(id)[0];
    } catch {
      return null;
    }
  },

  decode: (id: string): number => {
    return sqids.decode(id)[0];
  },

  encode: (id: number): string => {
    return sqids.encode([id]);
  },
};
