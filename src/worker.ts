import "js-interpreter/interpreter.js";
import * as acorn from "acorn"
globalThis.acorn = acorn;

const code = `function getFirstName(input) {
  return input.split(" ").slice(0, -1).join(" ");
}
setOutput(JSON.stringify(getFirstName(JSON.parse(getInput()))));`;

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    let output;
    const inp = new globalThis.Interpreter(
      code,
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      (interpreter: any, globalObject: any) => {
        interpreter.setProperty(
          globalObject,
          "getInput",
          interpreter.createNativeFunction((): string => {
            return JSON.stringify("Yori Yano")
          })
        )

        interpreter.setProperty(
          globalObject,
          "setOutput",
          interpreter.createNativeFunction((jsonOut: string) => {
            output = JSON.parse(jsonOut);
          })
        )
      }
    );
    inp.run();
		return new Response(output);
	},
};
