// * Next
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import type { NextRequest } from "next/server";

// * NPM
import ip from "@webpod/ip";
import DeviceDetector from "node-device-detector";
import ClientHints, {
  type JSONObject,
} from "node-device-detector/client-hints";

export default function clientDetails(request: NextRequest) {
  const clientIp = ip.address() as string;

  const clientHints = new ClientHints();
  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });

  const userAgent = <Required<string>>request.headers.get("user-agent");
  const clientHintData = clientHints.parse(
    request.headers as unknown as JSONObject,
    {},
  );
  const client = detector.detect(userAgent, clientHintData);
  const InfoDevice = require("node-device-detector/parser/device/info-device");
  const infoDevice = new InfoDevice();
  infoDevice.setSizeConvertObject(true);
  infoDevice.setResolutionConvertObject(true);
  const device = infoDevice.info(client.device.brand, client.device.model);

  return { ip: clientIp, client, device };
}
