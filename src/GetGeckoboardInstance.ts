import { GeckoboardInstanceAsync } from "./GeckoboardInstance";
import TransformCallback from "./TransformCallback";

export default async function GetGeckoboardInstance(API_KEY_GECKOBOARD: string, logger?: (error: string) => Promise<void> | void): Promise<GeckoboardInstanceAsync | null> {
    const gb = TransformCallback(require("geckoboard")(API_KEY_GECKOBOARD), logger);
    return (await gb.ping()).success ? gb : null;
}
