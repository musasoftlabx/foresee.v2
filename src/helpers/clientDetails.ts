// * Next
import type { NextApiRequest } from "next";

// * NPM
import requestIp from "request-ip";
import DeviceDetector from "node-device-detector";
import ClientHints from "node-device-detector/client-hints";

export default function clientDetails(req: NextApiRequest) {
  const clientIp = requestIp.getClientIp(req);

  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });
  const clientHints = new ClientHints();
  const userAgent = <string>req.headers["user-agent"];
  const clientHintData = clientHints.parse(<any>req.headers);
  const clientInfo = detector.detect(userAgent, clientHintData);

  const InfoDevice = require("node-device-detector/parser/device/info-device");
  const infoDevice = new InfoDevice();
  infoDevice.setSizeConvertObject(true);
  infoDevice.setResolutionConvertObject(true);
  const deviceSpecs = infoDevice.info(
    clientInfo.device.brand,
    clientInfo.device.model
  );

  return { clientIp, clientInfo, deviceSpecs };
}
