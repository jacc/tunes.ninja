import metrics from "datadog-metrics";
metrics.init({ apiKey: process.env.DD_API_KEY });

// TODO: unsync these API calls
export class DataDog {
  public async inc(key: string) {
    // await metrics.increment(key);
  }
  public async send(key: string, value: number) {
    // await metrics.gauge(key, value);
  }
}
