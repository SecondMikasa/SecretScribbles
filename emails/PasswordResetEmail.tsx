import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface PasswordResetEmailProps {
  username: string;
  otp: number;
}

export default function PasswordResetEmail({ username, otp }: PasswordResetEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Password Reset Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2 ',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Here&apos;s your password reset code: {otp.toString()}
      </Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            We received a request to reset your password. Please use the following one-time code
            to complete the password reset process:
          </Text>
        </Row>
        <Row>
          <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {otp}
          </Text>
        </Row>
        <Row>
          <Text>
            This code is valid for 1 hour and can only be used once.
          </Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
        <Row>
          <Text>
            Let us know if you need help resetting your password.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}