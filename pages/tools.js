// pages/tools.js
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Tag,
  Card,
  CardBody,
  Image,
  Stack,
  Grid,
  GridItem,
  Center,
} from "@chakra-ui/react";
import data from "../data/data.json";
import MetaTags from "@/components/MetaTags";

const Tools = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = [
    { name: "All", emoji: "🏷️" },
    { name: "Video", emoji: "📹" },
    { name: "Service", emoji: "🛎️" },
    { name: "Tool", emoji: "🔧" },
    { name: "Coding", emoji: "💻" },
    { name: "Design", emoji: "🎨" },
    { name: "Audio", emoji: "🎧" },
    { name: "Productivity", emoji: "📈" },
    { name: "Writing", emoji: "✍️" },
    { name: "Image", emoji: "🖼️" },
  ];

  const filteredTools = data.filter(
    (tool) => selectedCategory === "All" || tool.category === selectedCategory
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://substackcdn.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    const customScript = document.createElement("script");
    customScript.innerHTML = `
      window.CustomSubstackWidget = {
        substackUrl: "aimodels.substack.com",
        placeholder: "example@gmail.com",
        buttonText: "Try it for free!",
        theme: "custom",
        colors: {
          primary: "#319795",
          input: "white",
          email: "#1A202C",
          text: "white",
        },
        redirect: "/thank-you?source=tools"
      };
    `;
    document.body.appendChild(customScript);

    const widgetScript = document.createElement("script");
    widgetScript.src = "https://substackapi.com/widget.js";
    widgetScript.async = true;
    document.body.appendChild(widgetScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(customScript);
      document.body.removeChild(widgetScript);
    };
  }, []);

  return (
    <>
      <MetaTags
        title="AI Tools | AIModels.fyi"
        description="Discover the top AI tools and products."
        socialPreviewImage="https://cdn.dribbble.com/users/63554/screenshots/10844959/media/d6e4f9ccef4cce39198a4b958d0cb47f.jpg?resize=800x600&vertical=center"
        socialPreviewTitle="AI Tools Directory"
        socialPreviewSubtitle="Find and explore the top AI tools!"
      />
      <Box>
        <Box bg="gray.100" py={20}>
          <Box maxW="container.lg" mx="auto" textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              Discover AI tools to solve your problem
            </Heading>
            <Text fontSize="xl" mb={8}>
              Join 65,000 users from top tech companies including Amazon, Apple,
              Google, and Microsoft who use our site. Subscribe to the
              newsletter!
            </Text>
            <Center>
              <div id="custom-substack-embed"></div>
            </Center>
          </Box>
        </Box>
        <Box maxW="container.lg" mx="auto" my={8}>
          <Flex wrap="wrap" justifyContent="center" mb={8}>
            {categories.map((category) => (
              <Tag
                key={category.name}
                size="lg"
                variant={
                  selectedCategory === category.name ? "solid" : "outline"
                }
                colorScheme="blue"
                cursor="pointer"
                onClick={() => setSelectedCategory(category.name)}
                mr={2}
                mb={2}
              >
                {category.emoji} {category.name}
              </Tag>
            ))}
          </Flex>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
            ]}
            gap={6}
          >
            {filteredTools.map((tool) => (
              <GridItem key={tool.id}>
                <Card h="100%" position="relative">
                  <CardBody pb="4rem">
                    <Image src={tool.image} alt={tool.name} borderRadius="lg" />
                    <Stack mt={6} spacing={3}>
                      <Heading size="md">{tool.name}</Heading>
                      {tool.isFeatured && <Text>⭐ Featured</Text>}
                      <Text>{tool.description}</Text>
                    </Stack>
                  </CardBody>
                  <Button
                    as="a"
                    href={tool.url}
                    target="_blank"
                    colorScheme="blue"
                    size="sm"
                    position="absolute"
                    bottom="1rem"
                    left="1rem"
                    right="1rem"
                  >
                    Learn More
                  </Button>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Tools;
