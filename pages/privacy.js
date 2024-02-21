import React from "react";
import { Container, Heading, Text, Box } from "@chakra-ui/react";

const PrivacyPolicy = () => {
  return (
    <Container maxW="4xl" py={5}>
      <Heading as="h1" size="xl" mb={4}>
        Privacy Policy
      </Heading>
      <Box mb={5}>
        <Text mb={2}>
          Your privacy is important to us. It is our policy to respect your
          privacy regarding any information we may collect from you across our
          website, http://aimodels.fyi, and other sites we own and operate.
        </Text>
        <Text mb={2}>
          We only ask for personal information when we truly need it to provide
          a service to you. We collect it by fair and lawful means, with your
          knowledge and consent. We also let you know why we are collecting it
          and how it will be used.
        </Text>
        <Text mb={2}>
          We only retain collected information for as long as necessary to
          provide you with your requested service. What data we store, we will
          protect within commercially acceptable means to prevent loss and
          theft, as well as unauthorized access, disclosure, copying, use, or
          modification.
        </Text>
        <Text mb={2}>
          We do not share any personally identifying information publicly or
          with third-parties, except when required to by law.
        </Text>
        <Text mb={2}>
          Our website may link to external sites that are not operated by us.
          Please be aware that we have no control over the content and practices
          of these sites, and cannot accept responsibility or liability for
          their respective privacy policies.
        </Text>
        <Text mb={2}>
          You are free to refuse our request for your personal information, with
          the understanding that we may be unable to provide you with some of
          your desired services.
        </Text>
        <Text mb={2}>
          Your continued use of our website will be regarded as acceptance of
          our practices around privacy and personal information. If you have any
          questions about how we handle user data and personal information, feel
          free to contact us.
        </Text>
        <Text>This policy is effective as of 1 January 2023.</Text>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
