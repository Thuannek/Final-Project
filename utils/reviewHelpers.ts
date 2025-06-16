import { Review } from "@/models/toilet";

// Generate more realistic dummy reviews
export const generateRealisticReviews = (toiletId: number): Review[] => {
  const reviewTemplates = [
    {
      ratings: [4, 5],
      comments: [
        "Very clean and well-maintained facilities!",
        "Great location and always spotless.",
        "Modern amenities, highly recommend.",
        "Excellent hygiene standards.",
      ],
    },
    {
      ratings: [3, 4],
      comments: [
        "Decent facilities, could be cleaner.",
        "Acceptable for quick visits.",
        "Basic but functional.",
        "Average cleanliness, gets the job done.",
      ],
    },
    {
      ratings: [2, 3],
      comments: [
        "Needs better maintenance.",
        "Could use more frequent cleaning.",
        "Not the cleanest, but usable.",
        "Below average condition.",
      ],
    },
  ];

  const vietnameseNames = [
    "Minh N.",
    "Linh T.",
    "Huy D.",
    "Mai P.",
    "Thanh V.",
    "Lan H.",
    "Duc M.",
    "Nga L.",
    "Tuan A.",
    "Thu H.",
    "Quang N.",
    "Phuong T.",
  ];

  const foreignNames = [
    "Sarah K.",
    "John M.",
    "Emma L.",
    "David R.",
    "Lisa W.",
    "Mike T.",
    "Anna S.",
    "Tom B.",
    "Kate J.",
    "Alex C.",
    "Sophie G.",
    "Ryan H.",
  ];

  const allNames = [...vietnameseNames, ...foreignNames];

  // Generate 2-4 realistic reviews per toilet
  const numReviews = Math.floor(Math.random() * 3) + 2;
  const reviews: Review[] = [];

  for (let i = 0; i < numReviews; i++) {
    const templateIndex = Math.floor(Math.random() * reviewTemplates.length);
    const template = reviewTemplates[templateIndex];

    const rating =
      template.ratings[Math.floor(Math.random() * template.ratings.length)];
    const comment =
      template.comments[Math.floor(Math.random() * template.comments.length)];
    const userName = allNames[Math.floor(Math.random() * allNames.length)];

    // Generate timestamp within last 3 months
    const daysAgo = Math.floor(Math.random() * 90);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);

    reviews.push({
      id: toiletId * 1000 + i + 1, // Unique ID based on toilet
      userName,
      rating,
      comment,
      timestamp: timestamp.toISOString(),
      userId: undefined, // Dummy reviews don't have userId
    });
  }

  return reviews;
};

// Calculate realistic rating based on reviews
export const calculateRealisticRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 3.5;

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = totalRating / reviews.length;

  // Round to nearest 0.1
  return Math.round(average * 10) / 10;
};
