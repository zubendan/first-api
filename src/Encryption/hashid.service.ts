import Sqids from "sqids";
import { configService } from "~/src/config/config.service";

const sqids = new Sqids({
	alphabet: configService.squidsAlphabet,
	minLength: 6,
});

class HashidService {
	constructor(private readonly sqids: Sqids) {
		this.sqids = sqids;
	}

	public decodeOrNull(id: string): number | null {
		try {
			return this.sqids.decode(id)[0];
		} catch {
			return null;
		}
	}

	public decode(id: string): number {
		return this.sqids.decode(id)[0];
	}

	public encode(id: number): string {
		return this.sqids.encode([id]);
	}
}

export const hashidService = new HashidService(sqids);
