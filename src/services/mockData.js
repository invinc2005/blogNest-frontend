
export const mockPostsPage = {
  content: [
    {
      id: 1,
      title: "First Mock Post",
      content: "This is the full content of the first mock post. It's loaded locally from a dummy file.",
      imageUrl: "https://via.placeholder.com/300",
      likeCount: 15,
      authorUsername: "mockuser1",
      createdAt: "2025-08-06 05:00",
    },
    {
      id: 2,
      title: "Exploring React with MUI",
      content: "Material-UI provides a robust set of components for building beautiful UIs.",
      imageUrl: "https://via.placeholder.com/300",
      likeCount: 22,
      authorUsername: "mockuser2",
      createdAt: "2025-08-05 18:30",
    },
    {
      id: 3,
      title: "A Guide to Backend Development",
      content: "We've built a powerful backend with Spring Boot, complete with authentication and more.",
      imageUrl: "https://via.placeholder.com/300",
      likeCount: 8,
      authorUsername: "mockuser1",
      createdAt: "2025-08-04 11:00",
    },
  ],
  totalPages: 1,
  totalElements: 3,
};

export const mockComments = [
  {
    id: 101,
    content: "This is the first comment. Great insights!",
    createdAt: "2025-08-06 05:10",
    authorUsername: "commenter_jane",
  },
  {
    id: 102,
    content: "I completely agree. Thanks for sharing.",
    createdAt: "2025-08-06 05:15",
    authorUsername: "reader_bob",
  },
];