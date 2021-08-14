/* eslint-disable @typescript-eslint/no-explicit-any */
export enum CommandOptionType {
  SubCommand = "SUB_COMMAND",
  SubCommandGroup = "SUB_COMMAND_GROUP",
  String = "STRING",
  Integer = 4,
  Boolean = 5,
  User = 6,
  Channel = 7,
  Role = 8,
}

export interface InteractionOption {
  name: string;
  type: CommandOptionType;
  value: any;
}

export class InteractionOptions {
  subCommandName?: string;
  map: Map<string, InteractionOption | InteractionOptions>;
  constructor(options: any[]) {
    if (options == undefined) {
      this.map = new Map();
      return;
    }
    this.map = new Map(
      options.map(option => {
        if (
          [CommandOptionType.SubCommand, CommandOptionType.SubCommandGroup].includes(option.type)
        ) {
          this.subCommandName = option.name;
          return [option.name, new InteractionOptions(option.options)];
        }
        return [option.name, option];
      })
    );
  }
  has(key: string): boolean {
    return this.map.has(key);
  }
  get(key: string): InteractionOptions | any {
    const option = this.map.get(key);
    if (option instanceof InteractionOptions) {
      return option;
    } else {
      return (option as InteractionOption).value;
    }
  }
}
