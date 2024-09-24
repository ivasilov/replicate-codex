// components/dashboard/DashboardLayout.js

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Flex,
  useMediaQuery,
  VStack,
  HStack,
  Text,
  useToast,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FaSearch,
  FaUser,
  FaNewspaper,
  FaFolder,
  FaFire,
} from "react-icons/fa";
import NavItem from "./NavItem";
import FolderSidebar from "./Sidebar/FolderSidebar";
import FolderModal from "../Modals/FolderModal";
import supabase from "@/pages/api/utils/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import TrendingTopics from "../../TrendingTopics";
import TopViewedPapers from "../../TopViewedPapers";
import TopSearchQueries from "../../TopSearchQueries";
import { FoldersProvider } from "@/context/FoldersContext";

const DashboardLayout = ({ children }) => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");
  const router = useRouter();
  const { user } = useAuth();
  const [folders, setFolders] = useState([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFolderListModalOpen, setIsFolderListModalOpen] = useState(false); // New state for folder list modal
  const toast = useToast();

  // Function to fetch folders
  const fetchFolders = useCallback(async () => {
    if (!user) return;

    try {
      const { data: folderData, error: folderError } = await supabase
        .from("folders")
        .select("id, name, color, position")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (folderError) throw folderError;

      const foldersWithCounts = await Promise.all(
        folderData.map(async (folder) => {
          const { count, error: countError } = await supabase
            .from("bookmarks")
            .select("id", { count: "exact", head: true })
            .eq("folder_id", folder.id)
            .eq("user_id", user.id);

          if (countError) throw countError;

          return {
            ...folder,
            bookmarkCount: count || 0,
          };
        })
      );

      setFolders(foldersWithCounts);
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast({
        title: "Error fetching folders",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [user, toast]);

  // Function to update folder count
  const updateFolderCount = useCallback((folderId, increment) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              bookmarkCount: folder.bookmarkCount + (increment ? 1 : -1),
            }
          : folder
      )
    );
  }, []);

  // Fetch folders on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchFolders();
    }
  }, [user, fetchFolders]);

  const handleFolderModalOpen = () => {
    setIsFolderModalOpen(true);
  };

  const handleFolderModalClose = () => {
    setIsFolderModalOpen(false);
    fetchFolders();
  };

  // Handlers for Folder List Modal
  const handleFolderListModalOpen = () => {
    setIsFolderListModalOpen(true);
  };

  const handleFolderListModalClose = () => {
    setIsFolderListModalOpen(false);
  };

  const navItemsBeforeFolders = [
    { icon: <FaSearch />, label: "Discover", href: "/dashboard/discover" },
    {
      icon: <FaFire />,
      label: "Trending",
      href: "/dashboard/trending",
    },
    {
      icon: <FaNewspaper />,
      label: "Weekly Digest",
      href: "/dashboard/weekly-paper-summary",
    },
  ];
  const navItemsAfterFolders = [
    { icon: <FaUser />, label: "Profile", href: "/account" },
  ];

  return (
    <FoldersProvider
      fetchFolders={fetchFolders}
      updateFolderCount={updateFolderCount}
      folders={folders}
    >
      <Flex direction={{ base: "column", md: "row" }} minHeight="100vh">
        {/* Sidebar for larger screens */}
        {isLargerThan768 && (
          <Box
            width="200px"
            bg="white"
            py={8}
            overflowY="auto"
            borderRight="1px solid #e2e8f0"
          >
            <VStack spacing={2} align="stretch">
              {navItemsBeforeFolders.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={router.pathname === item.href}
                />
              ))}
              <Box px={4} py={2}>
                <Text fontSize="lg" fontWeight="bold">
                  My Folders
                </Text>
              </Box>
              <FolderSidebar onFolderModalOpen={handleFolderModalOpen} />
              {navItemsAfterFolders.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={router.pathname === item.href}
                />
              ))}
            </VStack>
          </Box>
        )}

        {/* Main Content */}
        <Box flex={1} overflowY="auto">
          {children}
        </Box>

        {/* Right Sidebar for larger screens */}
        {isLargerThan1024 && (
          <Box width="250px" bg="white" py={8} borderLeft="1px solid #e2e8f0">
            <TrendingTopics />
            <TopViewedPapers />
            <TopSearchQueries />
          </Box>
        )}

        {/* Mobile Footer Navigation */}
        {!isLargerThan768 && (
          <Box
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg="white"
            boxShadow="0 -2px 10px rgba(0, 0, 0, 0.05)"
          >
            <HStack justify="space-around" py={2}>
              {navItemsBeforeFolders.map((item) => (
                <NavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={router.pathname === item.href}
                />
              ))}

              {/* Folder Icon in Footer as IconButton */}
              <IconButton
                aria-label="Folders"
                icon={<FaFolder />}
                variant="ghost"
                size="lg"
                onClick={handleFolderListModalOpen} // Open Folder List Modal
                _hover={{ bg: "gray.100" }}
                color={isFolderListModalOpen ? "blue.500" : "gray.500"} // Match color
              />

              {navItemsAfterFolders.map((item) => (
                <NavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={router.pathname === item.href}
                />
              ))}
            </HStack>
          </Box>
        )}

        {/* Folder Modal for Create/Edit */}
        <FolderModal
          isOpen={isFolderModalOpen}
          onClose={handleFolderModalClose}
          fetchFolders={fetchFolders}
        />

        {/* Folder List Modal for Mobile */}
        <Modal
          isOpen={isFolderListModalOpen}
          onClose={handleFolderListModalClose}
          isCentered
          size="md"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>My Folders</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {folders.length > 0 ? (
                <List spacing={3}>
                  {folders.map((folder) => (
                    <ListItem key={folder.id}>
                      <Button
                        variant="ghost"
                        width="100%"
                        justifyContent="flex-start"
                        onClick={() => {
                          router.push(
                            `/dashboard/library?folderId=${folder.id}`
                          ); // Corrected URL
                          handleFolderListModalClose();
                        }}
                        leftIcon={
                          <FaFolder color={folder.color || "gray.500"} />
                        }
                        _hover={{ bg: "gray.100" }}
                      >
                        {folder.name} ({folder.bookmarkCount})
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text>No folders available. Create one!</Text>
              )}
              <Button
                mt={4}
                colorScheme="blue"
                width="100%"
                onClick={() => {
                  handleFolderListModalClose();
                  handleFolderModalOpen(); // Open Create Folder Modal
                }}
              >
                Create New Folder
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </FoldersProvider>
  );
};

export default DashboardLayout;