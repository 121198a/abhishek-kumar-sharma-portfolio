/** In-memory daily request cap. A second line of defence next to the provider-side spending cap. */
export class DailyCap {
  private day = "";
  private count = 0;
  constructor(
    private limit: number,
    private now: () => Date = () => new Date(),
  ) {}

  /** Returns true if the request may proceed, and counts it. */
  take(): boolean {
    const d = this.now().toISOString().slice(0, 10);
    if (d !== this.day) {
      this.day = d;
      this.count = 0;
    }
    if (this.count >= this.limit) return false;
    this.count++;
    return true;
  }
}
