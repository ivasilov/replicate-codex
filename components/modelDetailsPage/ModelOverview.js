import parse, { domToReact } from "html-react-parser";
import {
  Box,
  Heading,
  Text,
  Link,
  Tag,
  VStack,
  List,
  ListItem,
  Code,
  chakra,
} from "@chakra-ui/react";
import PreviewImage from "../PreviewImage";

const ModelOverview = ({ model }) => {
  return (
    <Box>
      <VStack alignItems="left" spacing={2}>
        <Heading as="h1" size="2xl">
          {model?.modelName}
        </Heading>
        <Text>
          <Link
            href={`/creators/${model?.platform}/${model?.creator}`}
            color="blue.500"
          >
            {model?.creator}
          </Link>
        </Text>
        <PreviewImage src={model?.example} />
        <Box> {model?.description}</Box>
        <Box>
          <Tag colorScheme="teal">{model?.tags}</Tag>
        </Box>
      </VStack>
    </Box>
  );
};

export default ModelOverview;
