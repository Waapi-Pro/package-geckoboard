import { GeckoboardInstanceAsync } from "./Geckoboard";
import TransformCallback from "./TransformCallback";

export default async function GetGeckoboardInstance(API_KEY_GECKOBOARD: string, logger?: (error: string) => Promise<void> | void): Promise<GeckoboardInstanceAsync | null> {
    const gb = TransformCallback(require("src/Geckoboard")(API_KEY_GECKOBOARD));
    return (await gb.ping()).success ? gb : null;
}
