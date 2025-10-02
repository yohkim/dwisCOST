class SimpleZIndexManager {
  constructor({ base = 1070, step = 10, max = 2000 } = {}) {
    this.base = base;
    this.step = step;
    this.current = base;
    this.max = max;
    this.activeCount = 0
  }
  next() {
    if (this.current >= this.max) {
      console.warn(`z-index reached max limit (${this.max}). Resetting to base.`);
      this.reset();
    }
    const zIndex = this.current;
    this.current += this.step;
    this.activeCount++;
    return zIndex;
  }

  release() {
    this.activeCount = Math.max(0, this.activeCount - 1);
    console.log(`[ZIndexManager] Active modals: ${this.activeCount}`);
    if (this.activeCount === 0) {
      console.log(`[ZIndexManager] All modals closed. Resetting.`);
      this.reset();
    }
  }

  reset() {
    this.current = this.base;
  }
}
  
export default new SimpleZIndexManager({ base: 1070, step: 10, max: 2000 });