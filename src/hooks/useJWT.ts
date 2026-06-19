import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

export type Profile = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  roles: string[];
};

const cookie: any = getCookie("_foresee_aT");

const useJWT = () => {
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    const token = cookie?.split(".")[1];
    const payload = token ? Buffer.from(token, "base64").toString() : "";
    payload && setProfile(JSON.parse(payload));
  }, []);

  return { profile };
};

export default useJWT;
