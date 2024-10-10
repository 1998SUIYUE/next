interface DailyCounter {
    date: string;
    count: number;
  }
  
  class OrderCounter {
    private counter: DailyCounter;
  
    constructor() {
      this.counter = { date: this.getCurrentDate(), count: 1 };
    }
  
    private getCurrentDate(): string {
      return new Date().toISOString().split('T')[0];
    }
  
    private resetIfNewDay() {
      const currentDate = this.getCurrentDate();
      if (this.counter.date !== currentDate) {
        this.counter = { date: currentDate, count: 1 };
      }
    }
  
    getCount(): number {
      this.resetIfNewDay();
      return this.counter.count;
    }
  
    incrementCount(): number {
      this.resetIfNewDay();
      this.counter.count += 1;
      return this.counter.count;
    }
  }
  
  const orderCounter = new OrderCounter();
  
  export default orderCounter;