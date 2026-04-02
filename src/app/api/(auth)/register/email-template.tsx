import { Html, Text } from "@react-email/components";

export default function EmailTemplate({ firstName }: { firstName: string }) {
  return (
    <Html lang="en">
      <Text>Hello {firstName}, just testing</Text>
    </Html>
  );
}
