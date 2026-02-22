import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

export interface iProfile {
  _: boolean;
  dealerType: string;
  dealerCode: string;
  dealerName: string;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  role: string;
  roleAttributes: { categories: string[] };
}

const cookie: any = getCookie("__dp_dealers_aT");

const useJWT = () => {
  const [profile, setProfile] = useState<iProfile>();

  useEffect(() => {
    const token = cookie?.split(".")[1];
    const payload = token ? Buffer.from(token, "base64").toString() : "";
    payload && setProfile(JSON.parse(payload));
  }, []);

  return { profile };
};

export default useJWT;
