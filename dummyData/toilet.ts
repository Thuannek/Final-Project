import {
  Toilet,
  Review,
  ToiletType,
  GenderType,
  Feature,
} from "../models/toilet";

export const toiletsData: Toilet[] = [
  {
    id: 1,
    name: "Han Market Public Restroom",
    address: "119 Trần Phú, Hải Châu 1, Hải Châu",
    coordinates: {
      latitude: 16.0678,
      longitude: 108.2243,
    },
    type: ToiletType.PUBLIC,
    gender: GenderType.GENDER_SEPARATED,
    features: [Feature.ACCESSIBLE],
    hasFee: true,
    waterLaser: false,
    rating: 3.2,
    reviewCount: 24,
    distance: 0.3,
    operatingHours: {
      weekdays: "7:00 AM - 9:00 PM",
      weekends: "7:00 AM - 10:00 PM",
    },
    reviews: [
      {
        id: 101,
        userName: "Linh N.",
        rating: 3,
        comment: "Clean enough but very basic facilities.",
      },
      {
        id: 102,
        userName: "Thomas W.",
        rating: 4,
        comment:
          "Better than expected for a market toilet. Small fee required.",
      },
    ],
  },
  {
    id: 2,
    name: "Da Nang International Airport",
    address: "Hải Châu District, Terminal 1",
    coordinates: {
      latitude: 16.0556,
      longitude: 108.1992,
    },
    type: ToiletType.PUBLIC,
    gender: GenderType.GENDER_SEPARATED,
    features: [Feature.ACCESSIBLE, Feature.WATER_LASER],
    hasFee: false,
    waterLaser: true,
    rating: 4.7,
    reviewCount: 118,
    distance: 5.2,
    operatingHours: {
      weekdays: "24 hours",
      weekends: "24 hours",
    },
    reviews: [
      {
        id: 201,
        userName: "Mai T.",
        rating: 5,
        comment:
          "Very clean and modern facilities in the international terminal!",
      },
      {
        id: 202,
        userName: "John S.",
        rating: 4,
        comment: "Good airport bathrooms with all necessary amenities.",
      },
    ],
  },
  {
    id: 3,
    name: "Vincom Plaza Da Nang",
    address: "910-910A Ngô Quyền, An Hải Bắc, Sơn Trà",
    coordinates: {
      latitude: 16.0612,
      longitude: 108.2345,
    },
    type: ToiletType.PRIVATE,
    gender: GenderType.GENDER_SEPARATED,
    features: [Feature.ACCESSIBLE, Feature.WATER_LASER],
    hasFee: false,
    waterLaser: true,
    rating: 4.5,
    reviewCount: 87,
    distance: 1.8,
    operatingHours: {
      weekdays: "9:00 AM - 10:00 PM",
      weekends: "9:00 AM - 11:00 PM",
    },
    reviews: [
      {
        id: 301,
        userName: "Huy D.",
        rating: 5,
        comment: "High-end mall with excellent restroom facilities.",
      },
      {
        id: 302,
        userName: "Sarah L.",
        rating: 4,
        comment: "Clean and well maintained. Located on each floor.",
      },
    ],
  },
  {
    id: 4,
    name: "My Khe Beach Public Facilities",
    address: "Hoàng Sa, Phước Mỹ, Sơn Trà",
    coordinates: {
      latitude: 16.0633,
      longitude: 108.2486,
    },
    type: ToiletType.PUBLIC,
    gender: GenderType.UNISEX,
    features: [Feature.ACCESSIBLE],
    hasFee: true,
    waterLaser: false,
    rating: 3.0,
    reviewCount: 42,
    distance: 2.7,
    operatingHours: {
      weekdays: "6:00 AM - 8:00 PM",
      weekends: "6:00 AM - 9:00 PM",
    },
    reviews: [
      {
        id: 401,
        userName: "Tuan A.",
        rating: 3,
        comment:
          "Basic beach facilities, but they charge a small fee. Bring your own paper.",
      },
      {
        id: 402,
        userName: "Emma J.",
        rating: 2,
        comment:
          "Acceptable for a quick stop, but not very clean during busy times.",
      },
    ],
  },
  {
    id: 5,
    name: "Lotte Mart Da Nang",
    address: "6 Nại Nam, Hải Châu",
    coordinates: {
      latitude: 16.0306,
      longitude: 108.2229,
    },
    type: ToiletType.PRIVATE,
    gender: GenderType.GENDER_SEPARATED,
    features: [Feature.ACCESSIBLE, Feature.WATER_LASER],
    hasFee: false,
    waterLaser: true,
    rating: 4.4,
    reviewCount: 63,
    distance: 3.1,
    operatingHours: {
      weekdays: "8:00 AM - 10:00 PM",
      weekends: "8:00 AM - 10:30 PM",
    },
    reviews: [
      {
        id: 501,
        userName: "Hanh T.",
        rating: 4,
        comment: "Clean facilities with good amenities. Located on 3rd floor.",
      },
      {
        id: 502,
        userName: "Derek M.",
        rating: 5,
        comment:
          "Modern and well-maintained. Highly recommended if shopping nearby.",
      },
    ],
  },
  {
    id: 6,
    name: "Dragon Bridge Public Restroom",
    address: "Trần Hưng Đạo, An Hải Tây, Sơn Trà",
    coordinates: {
      latitude: 16.0614,
      longitude: 108.2276,
    },
    type: ToiletType.PUBLIC,
    gender: GenderType.GENDER_SEPARATED,
    features: [Feature.ACCESSIBLE],
    hasFee: true,
    waterLaser: false,
    rating: 3.6,
    reviewCount: 51,
    distance: 0.9,
    operatingHours: {
      weekdays: "6:00 AM - 11:00 PM",
      weekends: "6:00 AM - 12:00 AM",
    },
    reviews: [
      {
        id: 601,
        userName: "Minh N.",
        rating: 4,
        comment:
          "Convenient location near the famous Dragon Bridge. Small fee but worth it.",
      },
      {
        id: 602,
        userName: "Kelly R.",
        rating: 3,
        comment:
          "Acceptable cleanliness. Gets busy during bridge fire shows on weekends.",
      },
    ],
  },
  {
    id: 7,
    name: "Sun World Ba Na Hills",
    address: "Hoà Ninh, Hoà Vang",
    coordinates: {
      latitude: 15.9977,
      longitude: 107.9896,
    },
    type: ToiletType.PRIVATE,
    gender: GenderType.GENDER_SEPARATED,
    features: [Feature.ACCESSIBLE, Feature.WATER_LASER],
    hasFee: false,
    waterLaser: true,
    rating: 4.8,
    reviewCount: 94,
    distance: 19.6,
    operatingHours: {
      weekdays: "7:00 AM - 9:00 PM",
      weekends: "7:00 AM - 10:00 PM",
    },
    reviews: [
      {
        id: 701,
        userName: "Lan P.",
        rating: 5,
        comment:
          "Excellent resort-quality restrooms throughout the park. Very clean!",
      },
      {
        id: 702,
        userName: "Michael T.",
        rating: 5,
        comment:
          "Premium facilities with attendants. Best public restrooms in Da Nang area.",
      },
    ],
  },
  {
    id: 8,
    name: "Central Bus Station Toilet",
    address: "99 Tôn Đức Thắng, Hoà Minh, Liên Chiểu",
    coordinates: {
      latitude: 16.0702,
      longitude: 108.1695,
    },
    type: ToiletType.PUBLIC,
    gender: GenderType.GENDER_SEPARATED,
    features: [Feature.ACCESSIBLE],
    hasFee: true,
    waterLaser: false,
    rating: 2.9,
    reviewCount: 37,
    distance: 7.5,
    operatingHours: {
      weekdays: "5:00 AM - 10:00 PM",
      weekends: "5:00 AM - 10:00 PM",
    },
    reviews: [
      {
        id: 801,
        userName: "Hung V.",
        rating: 3,
        comment: "Basic bus station facilities. Pay small fee at entrance.",
      },
      {
        id: 802,
        userName: "Christine L.",
        rating: 2,
        comment:
          "Not very clean but useful in emergencies. Bring your own tissue.",
      },
    ],
  },
  {
    id: 9,
    name: "Danang Cathedral",
    address: "156 Trần Phú, Hải Châu 1, Hải Châu",
    coordinates: {
      latitude: 16.0668,
      longitude: 108.2231,
    },
    type: ToiletType.PRIVATE,
    gender: GenderType.GENDER_SEPARATED,
    features: [Feature.ACCESSIBLE],
    hasFee: false,
    waterLaser: false,
    rating: 3.9,
    reviewCount: 23,
    distance: 0.5,
    operatingHours: {
      weekdays: "8:00 AM - 6:00 PM",
      weekends: "7:30 AM - 7:00 PM",
    },
    reviews: [
      {
        id: 901,
        userName: "Thu H.",
        rating: 4,
        comment:
          "Clean and well-maintained. Located behind the main cathedral.",
      },
      {
        id: 902,
        userName: "Robert C.",
        rating: 4,
        comment:
          "Small but tidy. Respectful atmosphere as expected at religious site.",
      },
    ],
  },
  {
    id: 10,
    name: "Asia Park Da Nang",
    address: "1 Phan Đăng Lưu, Hoà Cường Bắc, Hải Châu",
    coordinates: {
      latitude: 16.0345,
      longitude: 108.2266,
    },
    type: ToiletType.PRIVATE,
    gender: GenderType.UNISEX,
    features: [Feature.ACCESSIBLE, Feature.WATER_LASER],
    hasFee: false,
    waterLaser: true,
    rating: 4.3,
    reviewCount: 76,
    distance: 3.8,
    operatingHours: {
      weekdays: "3:00 PM - 11:00 PM",
      weekends: "10:00 AM - 12:00 AM",
    },
    reviews: [
      {
        id: 1001,
        userName: "Thanh N.",
        rating: 5,
        comment:
          "Clean and modern facilities throughout the park. Family-friendly.",
      },
      {
        id: 1002,
        userName: "Jessica K.",
        rating: 4,
        comment:
          "Good restrooms with modern amenities. Located near major attractions.",
      },
    ],
  },
];
