// Import assets

import logo from './logo.png';
import header_img from './header_img.png';
import search_icon from './search_icon.png';

import basket_icon from './basket_icon.png'

import property_1 from './property_1.png';
import property_2 from './property_2.png';
import property_3 from './property_3.png';
import property_4 from './property_4.png';
import property_5 from './property_5.png';
import property_6 from './property_6.png';
import property_7 from './property_7.png';
import property_8 from './property_8.png';
import property_9 from './property_9.png';
import property_10 from './property_10.png';
import property_11 from './property_11.png';
import property_12 from './property_12.png';
import property_13 from './property_13.png';
import property_14 from './property_14.png';
import property_15 from './property_15.png';
import property_16 from './property_16.png';
import property_17 from './property_17.png';

// Asset Bundle
export const assets = {
    logo, // Adjust the path based on where your image is located
    search_icon,
    basket_icon
  };
  
// export const assets = {
//     logo,
//     basket_icon,
//     header_img,
//     search_icon,
//     // Uncomment and add more icons if needed in the future
// };

// Property List
export const property_list = [
    {
        id: "1",
        name: "Luxury Villa",
        image: property_1,
        price: "1,200,000 USD",
        location: "Beverly Hills, California",
        size: "4,500 sq ft",
        bedrooms: 6,
        bathrooms: 5,
        description: "A luxurious villa with spacious interiors and a private pool, offering stunning views of the city.",
        category: "Villa"
    },
    {
        id: "2",
        name: "Modern Apartment",
        image: property_2,
        price: "850,000 USD",
        location: "Manhattan, New York",
        size: "2,500 sq ft",
        bedrooms: 3,
        bathrooms: 2,
        description: "A sleek apartment with modern amenities in the heart of New York, offering incredible views.",
        category: "Apartment"
    },
    {
        id: "3",
        name: "Beachfront Cottage",
        image: property_3,
        price: "950,000 USD",
        location: "Miami, Florida",
        size: "3,000 sq ft",
        bedrooms: 4,
        bathrooms: 3,
        description: "A charming beachfront cottage with direct ocean access and stunning views.",
        category: "Cottage"
    },
    {
        id: "4",
        name: "Suburban House",
        image: property_4,
        price: "650,000 USD",
        location: "Austin, Texas",
        size: "3,200 sq ft",
        bedrooms: 5,
        bathrooms: 4,
        description: "A modern suburban home in a family-friendly neighborhood with a spacious backyard.",
        category: "House"
    },
    {
        id: "5",
        name: "Penthouse Suite",
        image: property_5,
        price: "2,500,000 USD",
        location: "Los Angeles, California",
        size: "5,000 sq ft",
        bedrooms: 5,
        bathrooms: 4,
        description: "A top-floor penthouse suite with breathtaking views of Los Angeles and luxurious amenities.",
        category: "Penthouse"
    },
    {
        id: "6",
        name: "Country Estate",
        image: property_6,
        price: "3,200,000 USD",
        location: "Nashville, Tennessee",
        size: "8,000 sq ft",
        bedrooms: 7,
        bathrooms: 6,
        description: "A grand country estate with rolling hills, private lake, and guest house.",
        category: "Estate"
    },
    {
        id: "7",
        name: "Cozy Cabin",
        image: property_7,
        price: "450,000 USD",
        location: "Aspen, Colorado",
        size: "1,800 sq ft",
        bedrooms: 2,
        bathrooms: 2,
        description: "A mountain cabin nestled in the woods, perfect for winter retreats.",
        category: "Cabin"
    },
    {
        id: "8",
        name: "Historic Mansion",
        image: property_8,
        price: "4,500,000 USD",
        location: "Charleston, South Carolina",
        size: "10,000 sq ft",
        bedrooms: 8,
        bathrooms: 7,
        description: "A beautifully restored historic mansion with lush gardens and modern comforts.",
        category: "Mansion"
    },
    {
        id: "9",
        name: "City Loft",
        image: property_9,
        price: "600,000 USD",
        location: "Chicago, Illinois",
        size: "2,000 sq ft",
        bedrooms: 2,
        bathrooms: 1,
        description: "A sleek city loft with an industrial design in downtown Chicago.",
        category: "Loft"
    },
    {
        id: "10",
        name: "Lake House Retreat",
        image: property_10,
        price: "1,100,000 USD",
        location: "Lake Tahoe, California",
        size: "3,500 sq ft",
        bedrooms: 5,
        bathrooms: 4,
        description: "A serene lake house retreat with private dock and stunning views of Lake Tahoe.",
        category: "Lake House"
    },
    {
        id: "11",
        name: "Urban Townhouse",
        image: property_11,
        price: "700,000 USD",
        location: "Seattle, Washington",
        size: "2,200 sq ft",
        bedrooms: 3,
        bathrooms: 2,
        description: "A stylish townhouse located in a vibrant urban neighborhood in Seattle.",
        category: "Townhouse"
    },
    {
        id: "12",
        name: "Ranch-Style Home",
        image: property_12,
        price: "950,000 USD",
        location: "Dallas, Texas",
        size: "4,000 sq ft",
        bedrooms: 4,
        bathrooms: 3,
        description: "A sprawling ranch-style home with expansive grounds and outdoor living space.",
        category: "Ranch"
    },
    {
        id: "13",
        name: "Luxury Condo",
        image: property_13,
        price: "900,000 USD",
        location: "San Francisco, California",
        size: "2,400 sq ft",
        bedrooms: 3,
        bathrooms: 2,
        description: "A luxury condo in the heart of San Francisco with stunning city views.",
        category: "Condo"
    },
    {
        id: "14",
        name: "Mountain Chalet",
        image: property_14,
        price: "1,300,000 USD",
        location: "Jackson Hole, Wyoming",
        size: "3,800 sq ft",
        bedrooms: 4,
        bathrooms: 4,
        description: "A mountain chalet with ski-in/ski-out access and breathtaking mountain views.",
        category: "Chalet"
    },
    {
        id: "15",
        name: "Oceanfront Estate",
        image: property_15,
        price: "5,000,000 USD",
        location: "Malibu, California",
        size: "6,000 sq ft",
        bedrooms: 6,
        bathrooms: 5,
        description: "An exclusive oceanfront estate with private beach access and infinity pool.",
        category: "Estate"
    },
    {
        id: "16",
        name: "Golf Course Villa",
        image: property_16,
        price: "2,000,000 USD",
        location: "Palm Springs, California",
        size: "4,500 sq ft",
        bedrooms: 5,
        bathrooms: 4,
        description: "A villa located on a world-class golf course with luxury interiors and outdoor space.",
        category: "Villa"
    },
    {
        id: "17",
        name: "Downtown Studio",
        image: property_17,
        price: "400,000 USD",
        location: "Boston, Massachusetts",
        size: "1,200 sq ft",
        bedrooms: 1,
        bathrooms: 1,
        description: "A charming studio located in the heart of downtown Boston, perfect for city living.",
        category: "Studio"
    }
];
