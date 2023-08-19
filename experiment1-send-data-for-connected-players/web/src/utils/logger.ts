export class Logger {
  constructor(private preffix: string) {}
  log(...input: any) {
    console.log(this.preffix, input);
  }
  warn(...input: any) {
    console.warn(this.preffix, input);
  }
  error(...input: any) {
    console.error(this.preffix, input);
  }
}
