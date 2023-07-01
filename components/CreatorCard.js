import React from "react";
import { Box, Heading, Text, Avatar, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { formatLargeNumber } from "@/utils/formatLargeNumber";

const CreatorCard = ({ creator }) => {
  const getMedalEmoji = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  if (!creator) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        w="100%"
        boxShadow="base"
        p={4}
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text>No creator data available.</Text>
      </Box>
    );
  } else {
    const rank = creator.rank;
    const medalEmoji = getMedalEmoji(rank);

    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        w="100%"
        boxShadow="base"
        p={4}
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box textAlign="center">
          <Avatar
            src={`https://github.com/${creator.creator}.png`}
            size="2xl"
            mb={3}
          />
          <Heading as="h2" size="md" isTruncated mb={2}>
            {creator.creator} {medalEmoji}
          </Heading>
          <Text fontSize="sm" color="gray.500">
            Total Runs:{" "}
            {formatLargeNumber(creator.total_runs ? creator.total_runs : 0)}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Rank: {creator.rank}
          </Text>
        </Box>
        <Flex justifyContent="center" mt={3}>
          <Link
            href={`/creators/${creator.platform}/${creator.creator}`}
            passHref
          >
            <Button size="sm" colorScheme="blue">
              View profile
            </Button>
          </Link>
        </Flex>
      </Box>
    );
  }
};

export default CreatorCard;
