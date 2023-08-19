export class Logger {
  constructor(private preffix: string) {}
  format(...input: any) {
    return `[${this.preffix}]`;
  }
  log(...input: any) {
    console.log(this.format(), ...input);
  }
  warn(...input: any) {
    console.warn(this.format(), ...input);
  }
  error(...input: any) {
    console.error(this.format(), ...input);
  }
}
