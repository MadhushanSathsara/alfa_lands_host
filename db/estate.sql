-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 04, 2025 at 01:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `estate`
--

-- --------------------------------------------------------

--
-- Table structure for table `agent`
--

CREATE TABLE `agent` (
  `agent_id` int(11) NOT NULL,
  `agent_name` varchar(100) NOT NULL,
  `agent_address` varchar(255) DEFAULT NULL,
  `agent_position` varchar(50) DEFAULT NULL,
  `agent_team` enum('Agent','Inspector','Marketing Team','Executive Team','Supervisor Team') DEFAULT NULL,
  `agent_email` varchar(100) DEFAULT NULL,
  `agent_username` varchar(100) NOT NULL,
  `agent_password` varchar(255) NOT NULL,
  `agent_social_link` varchar(255) DEFAULT NULL,
  `agent_telephone` varchar(15) DEFAULT NULL,
  `agent_social` varchar(255) DEFAULT NULL,
  `agent_image` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agent`
--

INSERT INTO `agent` (`agent_id`, `agent_name`, `agent_address`, `agent_position`, `agent_team`, `agent_email`, `agent_username`, `agent_password`, `agent_social_link`, `agent_telephone`, `agent_social`, `agent_image`) VALUES
(1, 'John Pereraa', 'New Street, Colombo', 'Senior', 'Marketing Team', 'john@example.com', 'johnperera', '1234', NULL, '0771234567', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '9.jpg'),
(2, 'Nadeesha Silva', 'High Street, Kandy', 'Junior', '', 'nadeesha@example.com', 'nadeeshasilva', '1234', NULL, '0772345678', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '2.jpg'),
(3, 'Amal Fernando', 'Main Street, Negombo', 'Senior', 'Agent', 'amal@example.com', 'amalfernando', '1234', NULL, '0773456789', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '14.jpg'),
(4, 'Dilani Madushika', 'Lake Road, Nuwara Eliya', 'Senior', 'Agent', 'dilani@example.com', 'dilanimadushika', '1234', NULL, '0774567890', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '3.jpg'),
(5, 'Chamara Dissanayake', 'Park Avenue, Colombo', 'Senior', 'Executive Team', 'chamara@example.com', 'chamaradissanayake', '1234', NULL, '0775678901', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '5.jpg'),
(6, 'Isuru Rathnayake', 'Hill Top, Kandy', 'Junior', 'Agent', 'isuru@example.com', '', '', NULL, '0776789012', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '6.jpg'),
(7, 'Samantha De Silva', 'Beach Road, Matara', 'Agent', 'Marketing Team', 'samantha@example.com', '', '', NULL, '0777890123', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '7.jpg'),
(8, 'Ruwanthi Gunasekara', 'Main Avenue, Colombo', 'Senior', 'Executive Team', 'ruwanthi@example.com', '', '', NULL, '0778901234', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '8.jpg'),
(9, 'Kasun Jayasuriya', 'Ella Valley, Ella', 'Agent', 'Marketing Team', 'kasun@example.com', '', '', NULL, '0779012345', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '9.jpg'),
(10, 'Tharindu Weerasinghe', 'Skyline Tower, Colombo', 'Senior', 'Agent', 'tharindu@example.com', '', '', NULL, '0770123456', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '10.jpg'),
(11, 'John Doe', 'No. 12, Marine Drive, Colombo 03', 'Junior', 'Agent', 'john.doe@example.com', '', '', NULL, '0771234567', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '11.jpg'),
(12, 'Jane Smith', '45 Palm Avenue, Galle', 'Junior', 'Agent', 'jane.smith@example.com', '', '', NULL, '0772345678', '{ \"linkedin\": \"https://linkedin.com/in/janesmith\", \"facebook\": \"https://facebook.com/janesmith\", \"twitter\": \"https://twitter.com/janesmith\", \"instagram\": \"https://instagram.com/janesmith\" }', '12.jpg'),
(13, 'Michael Brown', '88 Lake Road, Kandy', 'Junior', 'Agent', 'michael.brown@example.com', '', '', NULL, '0773456789', '{ \"linkedin\": \"https://linkedin.com/in/michaelbrown\", \"facebook\": \"https://facebook.com/michaelbrown\", \"twitter\": \"https://twitter.com/ichaelbrown\", \"instagram\": \"https://instagram.com/ichaelbrown\" }', '13.jpg'),
(14, 'Emily Johnson', '10 Park Street, Negombo', 'Junior', 'Agent', 'emily.johnson@example.com', '', '', NULL, '0774567890', '{ \"linkedin\": \"https://linkedin.com/in/emilyjohnson\", \"facebook\": \"https://facebook.com/emilyjohnson\", \"twitter\": \"https://twitter.com/emilyjohnson\", \"instagram\": \"https://instagram.com/emilyjohnson\" }', '14.jpg'),
(15, 'Daniel Lee', '7 Rose Lane, Matara', 'Junior', 'Agent', 'daniel.lee@example.com', '', '', NULL, '0775678901', '{ \"linkedin\": \"https://linkedin.com/in/daniellee\", \"facebook\": \"https://facebook.com/daniellee\", \"twitter\": \"https://twitter.com/daniellee\", \"instagram\": \"https://instagram.com/daniellee\" }', '15.jpg'),
(16, 'Sophia Wilson', '22 Ocean Blvd, Trincomalee', 'Junior', 'Agent', 'sophia.wilson@example.com', '', '', NULL, '0776789012', '{ \"linkedin\": \"https://linkedin.com/in/sophiawilson\", \"facebook\": \"https://facebook.com/sophiawilson\", \"twitter\": \"https://twitter.com/sophiawilson\", \"instagram\": \"https://instagram.com/sophiawilson\" }', '2358e21f40736cae6583e238b26dd5c5.jpg'),
(17, 'James Taylor', '90 Main Street, Kurunegala', 'Junior', 'Agent', 'james.taylor@example.com', '', '', NULL, '0777890123', '{ \"linkedin\": \"https://linkedin.com/in/jamestaylor\", \"facebook\": \"https://facebook.com/jamestaylor\", \"twitter\": \"https://twitter.com/jamestaylor\", \"instagram\": \"https://instagram.com/jamestaylor\" }', '17.jpg'),
(18, 'Olivia Martin', '18 Hill Road, Anuradhapura', 'Junior', 'Agent', 'olivia.martin@example.com', '', '', NULL, '0778901234', '{ \"linkedin\": \"https://linkedin.com/in/oliviamartin\", \"facebook\": \"https://facebook.com/oliviamartin\", \"twitter\": \"https://twitter.com/oliviamartin\", \"instagram\": \"https://instagram.com/oliviamartin\" }', '18.jpg'),
(19, 'William Clark', '34 River View, Polonnaruwa', 'Junior', 'Inspector', 'william.clark@example.com', '', '', NULL, '0779012345', '{ \"linkedin\": \"https://linkedin.com/in/williamclark\", \"facebook\": \"https://facebook.com/williamclark\", \"twitter\": \"https://twitter.com/williamclark\", \"instagram\": \"https://instagram.com/williamclark\" }', '19.jpg'),
(20, 'Ava Lewis', '56 Garden City, Badulla', 'Junior', 'Executive Team', 'ava.lewis@example.com', '', '', NULL, '0770123456', '{ \"linkedin\": \"https://linkedin.com/in/avalewis\", \"facebook\": \"https://facebook.com/avalewis\", \"twitter\": \"https://twitter.com/avalewis\", \"instagram\": \"https://instagram.com/avalewis\" }', '20.jpg'),
(21, 'Benjamin Walker', '23 Sunrise Avenue, Jaffna', 'Junior', 'Executive Team', 'benjamin.walker@example.com', '', '', NULL, '0771122334', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '21.jpg'),
(36, 'Madushan Sathsara', NULL, 'Senior', 'Agent', 'msathsara839@gmail.com', '', '', NULL, NULL, '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', 'IMG_20220531_095630_546.jpg'),
(40, 'janani', NULL, 'Senior', 'Inspector', 'janani@gmail.com', '', '', NULL, NULL, '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '2358e21f40736cae6583e238b26dd5c5.jpg'),
(52, 'sanjana', NULL, 'Junior', 'Inspector', 'sanajana839@gmail.com', 'madusha', '4567', NULL, NULL, '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', '22.jpg'),
(101, 'Admin admin', 'Admin Office, Colombo', 'Admin', '', 'admin1@example.com', 'admin', '1234', NULL, '0771111111', '{ \"linkedin\": \"https://linkedin.com/in/benjaminwalker\", \"facebook\": \"https://facebook.com/benjaminwalker\", \"twitter\": \"https://twitter.com/benjaminwalker\", \"instagram\": \"https://instagram.com/benjaminwalker\" }', 'admin.jpg'),
(102, 'Admin Two', 'Admin HQ, Kandy', 'Admin', '', 'admin2@example.com', 'admin2', '1234', NULL, '0772222222', 'facebook.com/admin2', 'admin2.jpg');

--
-- Triggers `agent`
--
DELIMITER $$
CREATE TRIGGER `sync_agent_to_user` AFTER INSERT ON `agent` FOR EACH ROW BEGIN
  IF NEW.agent_username IS NOT NULL AND NEW.agent_password IS NOT NULL THEN
    INSERT INTO users (username, password, role)
    VALUES (NEW.agent_username, NEW.agent_password, NEW.agent_team);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `agent_contacts`
--

CREATE TABLE `agent_contacts` (
  `contact_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `property_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `user_phone` varchar(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `contact_method` enum('message','call','email') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `agent_phone` varchar(15) DEFAULT NULL,
  `agent_email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agent_contacts`
--

INSERT INTO `agent_contacts` (`contact_id`, `agent_id`, `property_id`, `user_id`, `user_name`, `user_email`, `user_phone`, `message`, `contact_method`, `created_at`, `agent_phone`, `agent_email`) VALUES
(1, 1, 3, 5, 'John Doe', 'john@example.com', '+1234567890', 'I’m interested in the apartment at Hillview. Is it still available?', 'message', '2025-05-04 09:33:25', '0771234567', 'john@example.com'),
(2, 2, 1, NULL, 'Emma Silva', 'emma.silva@mail.com', '+94771234567', 'Can I schedule a visit for this weekend?', 'email', '2025-05-04 09:33:25', '0772345678', 'nadeesha@example.com'),
(3, 3, NULL, 6, 'Michael Fernando', 'michaelf@gmail.com', '+94774567890', 'Please call me regarding new listings in Colombo.', 'call', '2025-05-04 09:33:25', '0773456789', 'amal@example.com'),
(4, 1, 3, NULL, 'Samantha Jayasuriya', 'samantha@gmail.com', '+94779111222', 'What are the legal documents required for this property?', 'message', '2025-05-04 09:33:25', '0771234567', 'john@example.com'),
(5, 4, 2, 8, 'Nuwan Perera', 'nuwanp@mail.com', '+94770001122', 'Interested in this villa. Can I speak with you today?', 'call', '2025-05-04 09:33:25', '0774567890', 'dilani@example.com'),
(6, 2, 1, NULL, 'madushan', 'msathsara839@gmail.com', '0719810539', 'hello', 'call', '2025-05-04 10:30:57', '0772345678', 'nadeesha@example.com'),
(7, 5, 1, NULL, 'madushan', 'msathsara839@gmail.com', '0719810539', 'how i buy this?', 'message', '2025-05-04 10:31:29', '0775678901', 'chamara@example.com'),
(8, 2, 1, NULL, 'madushan', 'msathsara839@gmail.com', '0719810539', 'new message', 'call', '2025-05-04 10:38:26', '0772345678', 'nadeesha@example.com'),
(9, 2, 1, NULL, 'sathsara', 'janashashi5@gmail.com', '0719814025', 'wqrhgrt', 'message', '2025-05-04 10:55:58', NULL, NULL),
(10, 1, 2, NULL, 'Madushan', 'msathsara839@gmail.com', '0719810539', '11120', 'message', '2025-06-01 06:47:45', NULL, NULL),
(11, 1, 2, NULL, 'Madushan', 'msathsara839@gmail.com', '0719810539', '11120', 'message', '2025-06-01 06:47:45', NULL, NULL),
(12, 6, 2, NULL, 'Madushan', 'msathsara839@gmail.com', '0719810539', '52', 'message', '2025-06-01 07:56:00', NULL, NULL),
(13, 6, 2, NULL, 'Madushan', 'msathsara839@gmail.com', '0719810539', '00023', 'message', '2025-06-04 02:02:33', NULL, NULL),
(14, 6, 2, NULL, 'Madushan', 'msathsara839@gmail.com', '0719810539', '00023', 'message', '2025-06-04 02:02:33', NULL, NULL),
(15, 6, 2, NULL, 'Madushan', 'msathsara839@gmail.com', '0719810539', '00023', 'message', '2025-06-04 02:02:33', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `property`
--

CREATE TABLE `property` (
  `property_id` int(11) NOT NULL,
  `property_name` varchar(100) NOT NULL,
  `property_address` varchar(255) NOT NULL,
  `property_description` text DEFAULT NULL,
  `property_image` varchar(255) DEFAULT NULL,
  `property_state` enum('sold','non sold') DEFAULT 'non sold',
  `property_category` varchar(50) DEFAULT NULL,
  `property_price` decimal(15,2) DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `beds` int(11) DEFAULT NULL,
  `baths` int(11) DEFAULT NULL,
  `garage` int(11) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `nearby_town` varchar(100) DEFAULT NULL,
  `distance_to_town` varchar(50) DEFAULT NULL,
  `landmarks` text DEFAULT NULL,
  `accessibility` text DEFAULT NULL,
  `transport_links` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property`
--

INSERT INTO `property` (`property_id`, `property_name`, `property_address`, `property_description`, `property_image`, `property_state`, `property_category`, `property_price`, `agent_id`, `beds`, `baths`, `garage`, `district`, `nearby_town`, `distance_to_town`, `landmarks`, `accessibility`, `transport_links`) VALUES
(1, 'Modern Villa', 'New Street, Colombo', 'Modern Villa – New Street, Colombo\r\nExperience the elegance of modern living in the heart of Colombo. This stylish villa combines contemporary architecture with functional space, perfect for professionals and families seeking urban convenience. Located on New Street, it offers quick access to shopping, dining, and leading schools, while still maintaining a private and peaceful atmosphere. This is an ideal investment opportunity in one of the city’s most desirable areas.\r\n\r\n• Modern design with spacious living areas\r\n• Close to shopping, schools, and dining\r\n• Quiet and secure residential neighborhood\r\n• Ideal for families and professionals', 'property_1.jpg', 'non sold', 'Villa', 120000.00, 1, 5, 3, 1, 'Colombo', 'Colombo City Center', '0.5km', 'Near Viharamahadevi Park, Close to Colombo Municipal Council', 'Direct access to Galle Road, 5min to Colombo Fort railway station', 'Bus routes 138 & 100 pass nearby, Train station 800m away'),
(2, 'Classic House', 'High Street, Kandy', 'A timeless property in the cultural capital of Sri Lanka, this classic house sits proudly on High Street, just minutes from the iconic Temple of the Tooth. With traditional charm and a well-maintained interior, this home is ideal for those who value heritage and location. Surrounded by lush hills and rich history, this property is suited for both residential living and boutique business ventures.\n\n• Traditional architecture with modern comforts\n\n• Near the Temple of the Tooth and cultural sites\n\n• Surrounded by lush greenery and hills\n\n• Perfect for heritage lovers and investors', 'property_2.jpg', 'sold', 'House', 120000.00, 2, 4, 2, 1, 'Kandy', 'Kandy City', '1.2km', 'Near Temple of the Tooth, View of Kandy Lake', '10min to Kandy railway station, Easy access to A1 highway', 'Bus routes 1 & 5 pass nearby, Tuk-tuk stand 200m away'),
(3, 'Coastal Home', 'Galle Road, Galle', 'Live the coastal dream with this charming home just steps away from the ocean. Located on the vibrant Galle Road, this property is perfect for a holiday home, rental income, or a peaceful seaside lifestyle. Enjoy the sea breeze, proximity to Galle Fort, and easy access to cafes and the southern expressway. It’s the ultimate combination of leisure and value.\r\n\r\n• Close to beachfront and historic Galle Fort\r\n• Perfect for vacation home or Airbnb rental\r\n• Peaceful, ocean breeze environment\r\n• Great long-term investment opportunity', 'property_3.jpg', 'non sold', 'House', 130000.00, 1, 3, 2, 1, 'Galle', 'Galle Fort', '2km', 'Near Unawatuna Beach, View of Indian Ocean', 'Direct access to Galle-Matara Road, 15min to Galle railway station', 'Bus route 32 passes nearby, Beach access 300m'),
(4, 'Luxury Mansion', 'Main Street, Negombo', 'Indulge in grand living with this expansive luxury mansion in Negombo. Positioned on the main street, this opulent home features large living areas, refined interiors, and top-tier finishes. Ideal for high-end residential use or a luxury guesthouse venture. The location offers quick access to the airport, beaches, and Negombo Lagoon, making it a rare investment in prime real estate.\r\n\r\n• Located on main street, close to Negombo lagoon\r\n• Quick access to airport and beaches\r\n• Ideal for luxury residential or guesthouse\r\n• Secure and prestigious neighborhood', 'property_4.jpg', 'non sold', 'Mansion', 140000.00, 3, 6, 4, 2, 'Gampaha', 'Negombo Town', '1.8km', 'Near Negombo Lagoon, Close to St. Mary\'s Church', '5min to Negombo beach, 30min to Bandaranaike Airport', 'Bus routes 240 & 245 pass nearby, Boat service available'),
(5, 'Lake Cottage', 'Lake Road, Nuwara Eliya', 'This serene lakeside cottage offers cozy mountain charm and a cool climate in picturesque Nuwara Eliya. Nestled along Lake Road, it’s the perfect retreat for nature lovers, with panoramic views, fresh air, and a tranquil setting. Whether as a weekend getaway or a tourism-focused investment, this property captures the essence of upcountry living.\r\n\r\n• Lakeside location with stunning mountain views\r\n• Cool climate and fresh air year-round\r\n• Perfect as a weekend getaway or rental\r\n• Surrounded by scenic landscapes and tea plantations\r\n• Peaceful and private setting', 'property_5.jpg', 'sold', 'Cottage', 80000.00, 2, 2, 1, 1, 'Nuwara Eliya', 'Nuwara Eliya Town', '3km', 'Facing Gregory Lake, Near Golf Course', 'Scenic mountain roads, 10min to town center', 'Private parking available, Taxi service recommended'),
(6, 'Urban House', 'Park Avenue, Colombo', 'Modern convenience meets comfort in this well-designed urban house located on Park Avenue. Just minutes from the city’s commercial and residential hubs, this property is ideal for city dwellers who appreciate privacy and accessibility. The house offers open interiors, secure surroundings, and excellent access to schools, hospitals, and business centers.\r\n\r\n• Centrally located in Colombo city\r\n• Easy access to business and commercial hubs\r\n• Safe and quiet residential street\r\n• Contemporary design with functional space\r\n• Ideal for professionals and small families', 'property_6.jpg', 'non sold', 'House', 150000.00, 3, 4, 3, 1, 'Colombo', 'Bambalapitiya', '0.7km', 'Near Galle Face Green, Close to major hospitals', 'Direct access to Marine Drive, 5min to expressway entrance', 'Bus routes 101 & 155 pass nearby, Uber pickup available'),
(7, 'Hilltop Villa', 'Hill Top, Kandy', 'Perched on the hills of Kandy, this villa offers breathtaking panoramic views and cool mountain air. It’s a peaceful haven above the city, perfect for those seeking privacy, inspiration, or a wellness-focused lifestyle. With easy access to the Kandy town center, this property combines natural tranquility with urban proximity — a rare opportunity for long-term investors or homesteaders.\r\n\r\n• Elevated location with panoramic views\r\n• Cool mountain air and peaceful surroundings\r\n• Close to Kandy town center\r\n• Spacious villa with privacy and tranquility\r\n• Perfect for retreats or residential living', 'property_7.jpg', 'non sold', 'Villa', 160000.00, 1, 5, 3, 2, 'Kandy', 'Peradeniya', '2.5km', 'Panoramic views, Near Royal Botanical Gardens', 'Winding hill road, 15min to Kandy city', 'Private parking, Tuk-tuk service recommended'),
(8, 'Beachside Home', 'Beach Road, Matara', 'Just steps from the beach, this charming property in Matara brings oceanfront living to life. Wake up to the sound of waves and enjoy endless sunsets from your own slice of coastal paradise. Ideal for personal living or developing into a holiday rental, the location is convenient yet peaceful, close to key southern attractions and transportation routes.\r\n\r\n• Steps away from the beautiful Matara beach\r\n• Relaxing seaside lifestyle with ocean views\r\n• Close to town amenities and transport\r\n• Ideal for holiday home or rental investment\r\n• Quiet neighborhood with fresh sea breeze', 'property_8.jpg', 'sold', 'House', 100000.00, 2, 3, 2, 1, 'Matara', 'Matara Town', '1km', 'Direct beach access, Near Parey Dewa Temple', 'On main coastal road, 10min to Matara bus stand', 'Bus routes 2 & 5 pass nearby, Fishing harbor 500m'),
(9, 'Green Bungalow', 'Garden Lane, Kurunegala', 'Surrounded by greenery and tranquility, this beautiful bungalow offers a nature-filled lifestyle just minutes from Kurunegala town. The spacious layout and peaceful setting make it perfect for families, retirees, or those wanting to escape the city. Its strategic location offers future value and comfortable living in a growing residential zone.\r\n\r\n• Located in a green, leafy residential area\r\n• Spacious bungalow with garden space\r\n• Close to Kurunegala town center\r\n• Ideal for families seeking peaceful living\r\n• Good future growth potential', 'property_9.jpg', 'non sold', 'Bungalow', 95000.00, 1, 3, 2, 1, 'Kurunegala', 'Kurunegala Town', '2km', 'Surrounded by greenery, Near Ethagala Rock', 'Easy access to Dambulla Road, 5min to town center', 'Bus routes 15 & 20 pass nearby, Train station 1.5km away'),
(10, 'City Apartment', 'Main Avenue, Colombo', 'A prime urban property in central Colombo, this city apartment is perfect for those who thrive in the heart of activity. Located on Main Avenue, it offers convenient access to business hubs, public transport, and lifestyle amenities. A smart choice for young professionals, frequent travelers, or investors looking for rental-ready urban real estate.\r\n\r\n• Prime city-center location on Main Avenue\r\n• Easy access to offices, malls, and public transport\r\n• Modern apartment with security\r\n• Suitable for young professionals or investors\r\n• Convenient urban lifestyle', 'property_10.jpg', 'non sold', 'Apartment', 115000.00, 3, 2, 1, 1, 'Colombo', 'Colombo City Center', '0.3km', 'Near World Trade Center, Close to Beira Lake', 'Prime urban location, 2min to expressway entrance', 'All major bus routes available, Uber pickup available'),
(11, 'Mountain View Home', 'Ella Valley, Ella', 'Breathe in the beauty of the highlands with this peaceful mountain home in scenic Ella Valley. Surrounded by rolling hills and lush tea estates, this property offers a rejuvenating lifestyle. Perfect for eco-tourism, retreats, or retirement living, this location combines natural wonder with easy access to Ella’s tourist-friendly town center.\r\n\r\n• Stunning mountain and valley views\r\n• Surrounded by nature and tea estates\r\n• Peaceful, cool climate ideal for relaxation\r\n• Great for tourism rental or retirement home\r\n• Close to Ella town and hiking trails', 'property_11.png', 'sold', 'House', 98000.00, 2, 3, 2, 1, 'Badulla', 'Ella Town', '1.5km', 'Mountain views, Near Ella Rock', 'Scenic mountain roads, 5min to Ella town center', 'Tuk-tuk service recommended, Train station 800m away'),
(12, 'Modern Cottage', 'Tea Road, Hatton', 'This sleek and cozy modern cottage is set in Hatton’s iconic tea region, combining countryside charm with thoughtful design. Ideal for peaceful living or short-term rental, this home is surrounded by scenic plantations and cool breezes. The location offers investment potential in a high-tourism area with strong cultural appeal.\r\n\r\n• Set in the scenic tea plantation region\r\n• Modern design with cozy interiors\r\n• Cool climate and fresh air\r\n• Ideal for weekend getaways or rental income\r\n• Peaceful countryside environment', 'property_12.png', 'non sold', 'Cottage', 89000.00, 1, 2, 1, 1, 'Nuwara Eliya', 'Hatton Town', '1km', 'Tea estate views, Close to Devon Falls', 'Access via A7 highway, 5min to town center', 'Bus route 12 passes nearby, Train station 1.2km away'),
(13, 'Oceanfront Villa', 'Marine Drive, Colombo', 'A rare opportunity to own oceanfront property in the capital. This stylish villa on Marine Drive boasts direct sea views, modern interiors, and unmatched location advantages. Whether used as a luxury residence, boutique hotel, or investment property, it offers the best of Colombo’s coastal charm and city life.\r\n\r\n• Prime oceanfront location in Colombo\r\n• Modern luxury villa with sea views\r\n• Close to city amenities and beaches\r\n• Perfect for high-end residential or investment\r\n• Secure and prestigious neighborhood', 'property_13.png', 'non sold', 'Villa', 175000.00, 3, 5, 4, 2, 'Colombo', 'Colombo City Center', '0.4km', 'Oceanfront property, Near Galle Face Green', 'Direct beach access, 5min to Colombo Fort', 'All major bus routes available, Uber pickup available'),
(14, 'Family House', 'School Lane, Anuradhapura', 'Located in the historic city of Anuradhapura, this spacious family house on School Lane is ideal for long-term living. Surrounded by a peaceful neighborhood, it offers comfort, safety, and proximity to key schools and cultural landmarks. The property is perfect for large families or as a base for educational or hospitality ventures.\r\n\r\n• Spacious family home in peaceful neighborhood\r\n• Close to schools and cultural sites\r\n• Ideal for large families or shared living\r\n• Safe and community-oriented area\r\n• Good long-term residential investment', 'property_14.png', 'sold', 'House', 91000.00, 2, 4, 2, 1, 'Anuradhapura', 'Anuradhapura Town', '1km', 'Near Sacred Bodhi Tree, Close to Ruwanwelisaya', 'Access via A9 highway, 5min to town center', 'Bus routes 4 & 8 pass nearby, Train station 1km away'),
(15, 'Countryside Home', 'Paddy Field Rd, Polonnaruwa', 'Enjoy rustic living in this charming countryside home located near ancient Polonnaruwa. Surrounded by open paddy fields and village serenity, this property offers a peaceful life with strong cultural roots. Ideal for agriculture enthusiasts, retirees, or heritage-based tourism businesses.\r\n\r\n• Rural location surrounded by paddy fields\r\n• Peaceful and quiet environment\r\n• Close to historic Polonnaruwa ruins\r\n• Ideal for agriculture or country living\r\n• Great for retirees or nature lovers', 'property_15.png', 'non sold', 'House', 86000.00, 1, 3, 1, 1, 'Polonnaruwa', 'Polonnaruwa Town', '2km', 'Rice field views, Near Parakrama Samudra', 'Rural access roads, 10min to town center', 'Bus route 9 passes nearby, Bicycle recommended'),
(16, 'Luxury Apartment', 'Skyline Tower, Colombo', 'Live high above the city in this luxury apartment located in the prestigious Skyline Tower. Featuring elegant finishes, premium amenities, and spectacular views, this property offers urban sophistication in a secure environment. Ideal for professionals, expatriates, or those seeking a hassle-free investment in Colombo real estate.\r\n\r\n• High-rise luxury apartment with city views\r\n• Access to premium amenities and security\r\n• Located in Colombo’s upscale area\r\n• Ideal for professionals and expatriates\r\n• Convenient urban living with comfort', 'property_16.png', 'non sold', 'Apartment', 195000.00, 3, 3, 3, 2, 'Colombo', 'Colombo City Center', '0.2km', 'High-rise luxury, Near Beira Lake', 'Prime urban location, 1min to expressway entrance', 'All major bus routes available, Uber pickup available'),
(17, 'River House', 'Riverside, Ratnapura', 'This tranquil riverside property offers a unique lifestyle in Sri Lanka’s gem-rich Ratnapura district. Surrounded by lush greenery and flowing water, it’s perfect for nature enthusiasts, wellness retreats, or boutique hospitality. A peaceful haven with development potential in a scenic setting.\r\n\r\n• Scenic riverside property with lush surroundings\r\n• Tranquil environment near Ratnapura town\r\n• Ideal for nature lovers and wellness retreats\r\n• Good potential for boutique guesthouse\r\n• Peaceful and private location', 'property_17.png', 'sold', 'House', 92000.00, 2, 3, 2, 1, 'Ratnapura', 'Ratnapura Town', '1.5km', 'Riverside property, Near gem mines', 'Access via A4 highway, 5min to town center', 'Bus routes 7 & 11 pass nearby, Tuk-tuk stand 300m away'),
(18, 'Eco Bungalow', 'Forest Path, Sinharaja', 'Nestled on the edge of the Sinharaja Rainforest, this eco bungalow is a nature lover’s dream. With sustainable design and immersive surroundings, it’s ideal for eco-tourism, retreats, or off-grid living. Live in harmony with nature while investing in one of Sri Lanka’s UNESCO-protected regions.\r\n\r\n• Located near Sinharaja rainforest reserve\r\n• Eco-friendly design with natural materials\r\n• Perfect for eco-tourism and retreats\r\n• Surrounded by rich biodiversity\r\n• Unique opportunity in protected area', 'property18.jpg', 'non sold', 'Bungalow', 88000.00, 1, 2, 1, 1, 'Ratnapura', 'Sinharaja Entrance', '3km', 'Rainforest edge, Near biodiversity hotspot', 'Forest access road, 15min to main highway', 'Private vehicle recommended, Limited bus service'),
(19, 'Heritage Home', 'Old Town, Galle Fort', 'Step into colonial elegance with this heritage home in the iconic Galle Fort. Rich with character and history, this property is perfect for boutique lodging or refined personal use. Surrounded by cobbled streets, art galleries, and coastal charm, it represents timeless value and strong cultural appeal.\r\n\r\n• Colonial-era heritage home with character\r\n• Located inside historic Galle Fort\r\n• Close to shops, galleries, and the beach\r\n• Ideal for boutique hotel or personal use\r\n• Rich cultural and architectural value', 'property19.jpg', 'sold', 'House', 102000.00, 2, 4, 2, 1, 'Galle', 'Galle Fort', '0.5km', 'Colonial architecture, Near Galle Lighthouse', 'Within UNESCO heritage site, 5min to bus stand', 'Walking distance to all amenities, Tuk-tuk available'),
(21, 'new vila', 'kegalle', 'yrk7ulk6', '2025_05_13_11_37_IMG_6961.jpg', '', 'Villa', 50000.00, NULL, 2, 1, NULL, 'Kegalle', 'Kegalle Town', '2km', 'Near Pinnawala Elephant Orphanage, Scenic mountain views', 'Access via A1 highway, 10min to town center', 'Bus route 6 passes nearby, Train station 1.5km away');

-- --------------------------------------------------------

--
-- Table structure for table `property_agent`
--

CREATE TABLE `property_agent` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property_agent`
--

INSERT INTO `property_agent` (`id`, `property_id`, `agent_id`) VALUES
(1, 1, 2),
(2, 1, 5),
(4, 2, 6),
(6, 5, 8),
(7, 5, 2),
(8, 7, 5),
(9, 8, 3),
(10, 9, 4),
(11, 12, 7),
(12, 1, 8),
(22, 2, 8);

-- --------------------------------------------------------

--
-- Table structure for table `property_images`
--

CREATE TABLE `property_images` (
  `id` int(11) NOT NULL,
  `property_id` int(11) DEFAULT NULL,
  `image_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property_images`
--

INSERT INTO `property_images` (`id`, `property_id`, `image_name`) VALUES
(1, 1, 'property_1_1.jpg'),
(2, 1, 'property_1_1.jpg'),
(3, 2, 'property_2_1.jpg'),
(4, 2, 'property_2_2.jpg'),
(5, 3, 'property_3_1.jpg'),
(6, 3, 'property_3_2.jpg'),
(7, 4, 'property_4_1.jpg'),
(8, 4, 'property_4_2.jpg'),
(9, 5, 'property_5_1.jpg'),
(10, 5, 'property_5_2.jpg'),
(11, 6, 'property_6_1.jpg'),
(12, 6, 'property_6_2.jpg'),
(13, 7, 'property_7_1.jpg'),
(21, 1, '683f0670c60e5.jpg'),
(25, 3, '683f9e716dab5.jpg'),
(26, 3, '683f9e725679b.jpg'),
(28, 2, '683f9f2ba0040.jpg'),
(31, 5, '683fab2b6364c.jpg'),
(32, 5, '683fab2dccd02.jpg'),
(35, 1, '683fc68189b4a.png'),
(37, 1, '683fe13f9537c.png'),
(38, 1, '683fe13fa0678.png'),
(39, 1, '683fe144be144.png'),
(40, 1, '683fe17048670.png'),
(41, 1, '683fe170ca75e.png'),
(50, 2, '683fe1a713bd5.png');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `review_id` int(11) NOT NULL,
  `property_id` int(11) DEFAULT NULL,
  `user_name` varchar(100) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `comment` text DEFAULT NULL,
  `review_date` datetime DEFAULT current_timestamp(),
  `customer_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`review_id`, `property_id`, `user_name`, `rating`, `comment`, `review_date`, `customer_image`) VALUES
(1, 1, 'Kamal Fernando', 5, 'Beautiful villa with great facilities.', '2025-03-01 00:00:00', 'customer_1.jpg'),
(2, 2, 'Nimali Perera', 4, 'Nice house but a bit pricey.', '2025-03-02 00:00:00', 'customer_2.jpg'),
(3, 3, 'Asanka Silva', 5, 'Perfect coastal home for vacations.', '2025-03-03 00:00:00', 'customer_3.jpg'),
(4, 4, 'Dinesh Gunasekara', 3, 'Spacious but needs renovation.', '2025-03-04 00:00:00', 'customer_4.jpg'),
(5, 5, 'Thilini Jayasinghe', 4, 'Very peaceful and relaxing.', '2025-03-05 00:00:00', 'customer_5.jpg'),
(6, 6, 'Roshan Weerasinghe', 5, 'Great location and modern design.', '2025-03-06 00:00:00', 'customer_6.jpg'),
(7, 7, 'Anusha Madushani', 5, 'Stunning view from the villa.', '2025-03-07 00:00:00', 'customer_7.jpg'),
(8, 8, 'Kasun Wickramasinghe', 4, 'Close to the beach, loved it.', '2025-03-08 00:00:00', 'customer_8.jpg'),
(9, 9, 'Iresha Nadeeka', 3, 'Decent home but small rooms.', '2025-03-09 00:00:00', 'customer_9.jpg'),
(10, 10, 'Lahiru Perera', 5, 'Perfect for city life.', '2025-03-10 00:00:00', 'customer_10.jpg'),
(11, 11, 'Dinithi Rajapaksha', 4, 'Great view, little far from town.', '2025-03-11 00:00:00', 'customer_11.jpg'),
(12, 12, 'Charith Dias', 5, 'Very cozy and private.', '2025-03-12 00:00:00', 'customer_12.jpg'),
(13, 13, 'Janani Rathnayake', 5, 'Luxury feel and ocean breeze.', '2025-03-13 00:00:00', 'customer_13.jpg'),
(14, 14, 'Kavindu Silva', 4, 'Spacious house for big families.', '2025-03-14 00:00:00', 'customer_14.jpg'),
(15, 15, 'Imasha Gunaratne', 3, 'Quiet area but basic facilities.', '2025-03-15 00:00:00', 'customer_15.jpg'),
(16, 16, 'Nadun Dissanayake', 5, 'Top-class apartment.', '2025-03-16 00:00:00', 'customer_16.jpg'),
(17, 17, 'Nadeesha Siriwardena', 4, 'Loved the river view.', '2025-03-17 00:00:00', 'customer_17.jpg'),
(18, 18, 'Sajith Perera', 4, 'Nature all around. Great!', '2025-03-18 00:00:00', 'customer_18.jpg'),
(19, 19, 'Malsha Senanayake', 5, 'Felt like living in history.', '2025-03-19 00:00:00', 'customer_19.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','agent','marketing team','supervise team','inspector','executive team') DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `agent_id`) VALUES
(27, 'johnperera', '1234', 'marketing team', 1),
(28, 'nadeeshasilva', '1234', 'executive team', 2),
(29, 'amalfernando', '1234', 'agent', 3),
(30, 'dilanimadushika', '1234', 'agent', 4),
(31, 'chamaradissanayake', '1234', 'executive team', 5),
(32, 'isururathnayake', '1234', 'agent', 6),
(33, 'samanthadesilva', '1234', 'marketing team', 7),
(34, 'ruwanthigunasekara', '1234', 'executive team', 8),
(35, 'kasunjayasuriya', '1234', 'marketing team', 9),
(36, 'tharinduweerasinghe', '1234', 'agent', 10),
(37, 'johndoe', '1234', 'agent', 11),
(38, 'janesmith', '1234', 'agent', 12),
(39, 'michaelbrown', '1234', 'agent', 13),
(40, 'emilyjohnson', '1234', 'agent', 14),
(41, 'daniellee', '1234', 'agent', 15),
(42, 'sophiawilson', '1234', 'agent', 16),
(43, 'jamestaylor', '1234', 'agent', 17),
(44, 'oliviamartin', '1234', 'agent', 18),
(45, 'williamclark', '1234', 'inspector', 19),
(46, 'avalewis', '1234', 'executive team', 20),
(47, 'benjaminwalker', '1234', 'executive team', 21),
(48, 'madushansathsara', '1234', 'agent', 36),
(49, 'janani', '1234', 'inspector', 40),
(50, 'sanjana', '1234', 'inspector', 52),
(55, 'admin', '1234', 'admin', 101),
(56, 'admin2', '1234', '', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agent`
--
ALTER TABLE `agent`
  ADD PRIMARY KEY (`agent_id`),
  ADD UNIQUE KEY `agent_email` (`agent_email`);

--
-- Indexes for table `agent_contacts`
--
ALTER TABLE `agent_contacts`
  ADD PRIMARY KEY (`contact_id`),
  ADD KEY `agent_id` (`agent_id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `property`
--
ALTER TABLE `property`
  ADD PRIMARY KEY (`property_id`),
  ADD KEY `agent_id` (`agent_id`);

--
-- Indexes for table `property_agent`
--
ALTER TABLE `property_agent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `agent_id` (`agent_id`);

--
-- Indexes for table `property_images`
--
ALTER TABLE `property_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_id` (`property_id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `property_id` (`property_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `agent_id` (`agent_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agent`
--
ALTER TABLE `agent`
  MODIFY `agent_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `agent_contacts`
--
ALTER TABLE `agent_contacts`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `property`
--
ALTER TABLE `property`
  MODIFY `property_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `property_agent`
--
ALTER TABLE `property_agent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `agent_contacts`
--
ALTER TABLE `agent_contacts`
  ADD CONSTRAINT `agent_contacts_ibfk_1` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`agent_id`),
  ADD CONSTRAINT `agent_contacts_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `property` (`property_id`),
  ADD CONSTRAINT `agent_contacts_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `property`
--
ALTER TABLE `property`
  ADD CONSTRAINT `property_ibfk_1` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`agent_id`);

--
-- Constraints for table `property_agent`
--
ALTER TABLE `property_agent`
  ADD CONSTRAINT `property_agent_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `property` (`property_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_agent_ibfk_2` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`agent_id`) ON DELETE CASCADE;

--
-- Constraints for table `property_images`
--
ALTER TABLE `property_images`
  ADD CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `property` (`property_id`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `property` (`property_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`agent_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
