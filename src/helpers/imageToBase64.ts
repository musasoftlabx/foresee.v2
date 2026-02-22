// * Node
import path from "path";

// * NPM
import Image2Base64 from "image-to-base64";

export default async function ImageToBase64(report?: string) {
  const logo = `data:image/png;base64,${await Image2Base64(
    path.join(process.cwd(), "public/images/logos/safaricom_logo_base.png")
  )}`;

  const forYouLogo = `data:image/png;base64,${await Image2Base64(
    path.join(
      process.cwd(),
      "public/images/logos/safaricom_for_you_logo_green.png"
    )
  )}`;

  const forYouLogoPlusBaseLogo = `data:image/png;base64,${await Image2Base64(
    path.join(
      process.cwd(),
      "public/images/logos/safaricom_for_you_plus_base_logo_green.png"
    )
  )}`;

  const reportIcon = `data:image/jpg;base64,${await Image2Base64(
    path.join(process.cwd(), "public/images/logos/logo-styled.jpg")
  )}`;

  const gradient = `data:image/png;base64,${await Image2Base64(
    path.join(process.cwd(), "public/images/backdrops/report_gradient.png")
  )}`;

  const vector = report
    ? `data:image/jpg;base64,${await Image2Base64(
        path.join(process.cwd(), `public/images/illustrations/${report}.jpg`)
      )}`
    : null;

  const kraLogo = `data:image/png;base64,${await Image2Base64(
    path.join(process.cwd(), "public/images/logos/kra_logo.png")
  )}`;

  const iTaxLogo = `data:image/png;base64,${await Image2Base64(
    path.join(process.cwd(), "public/images/logos/itax_logo.png")
  )}`;

  return {
    logo,
    reportIcon,
    gradient,
    vector,
    kraLogo,
    iTaxLogo,
    forYouLogo,
    forYouLogoPlusBaseLogo,
  };
}
