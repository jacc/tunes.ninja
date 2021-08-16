import metrics from "datadog-metrics";
import signale from "signale";
import { isDev } from "../../constants";
metrics.init({ apiKey: process.env.DD_API_KEY });

export class DataDog {
  public async inc(key: string) {
    isDev
      ? signale.log(`Metric sinkholed ${key}`)
      : await metrics.increment(key);
  }
  public async send(key: string, value: number) {
    isDev
      ? signale.log(`Metric sinkholed ${key}:${value}`)
      : await metrics.gauge(key, value);
  }
}
