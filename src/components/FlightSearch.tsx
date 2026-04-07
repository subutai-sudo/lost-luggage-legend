'use client'

import { useState, useRef, useEffect } from 'react'
import { DestinationGuide } from '@/data/destinationGuides'

// Comprehensive airport/city database — ~400 major airports with IATA, name, city, country, coords
const AIRPORTS: Array<{
  iata: string
  name: string
  city: string
  country: string
  lat: number
  lon: number
}> = [
  // North America
  { iata: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', lat: 40.6413, lon: -73.7781 },
  { iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', lat: 33.9416, lon: -118.4085 },
  { iata: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA', lat: 41.9742, lon: -87.9073 },
  { iata: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', lat: 32.8998, lon: -97.0403 },
  { iata: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA', lat: 39.8561, lon: -104.6737 },
  { iata: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', lat: 37.6213, lon: -122.3790 },
  { iata: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA', lat: 47.4502, lon: -122.3088 },
  { iata: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', country: 'USA', lat: 36.0840, lon: -115.1537 },
  { iata: 'MCO', name: 'Orlando International', city: 'Orlando', country: 'USA', lat: 28.4312, lon: -81.3081 },
  { iata: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', lat: 25.7959, lon: -80.2870 },
  { iata: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA', lat: 33.6407, lon: -84.4277 },
  { iata: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA', lat: 42.3656, lon: -71.0096 },
  { iata: 'IAD', name: 'Washington Dulles International', city: 'Washington D.C.', country: 'USA', lat: 38.9531, lon: -77.4565 },
  { iata: 'PHX', name: 'Phoenix Sky Harbor International', city: 'Phoenix', country: 'USA', lat: 33.4484, lon: -112.0740 },
  { iata: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'USA', lat: 29.9902, lon: -95.3368 },
  { iata: 'MSP', name: 'Minneapolis-Saint Paul International', city: 'Minneapolis', country: 'USA', lat: 44.8820, lon: -93.2218 },
  { iata: 'DTW', name: 'Detroit Metropolitan Wayne County', city: 'Detroit', country: 'USA', lat: 42.2162, lon: -83.3554 },
  { iata: 'PHL', name: 'Philadelphia International', city: 'Philadelphia', country: 'USA', lat: 39.8744, lon: -75.2424 },
  { iata: 'LGA', name: 'LaGuardia', city: 'New York', country: 'USA', lat: 40.7769, lon: -73.8740 },
  { iata: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'USA', lat: 40.6895, lon: -74.1745 },
  { iata: 'FLL', name: 'Fort Lauderdale-Hollywood International', city: 'Fort Lauderdale', country: 'USA', lat: 26.0742, lon: -80.1506 },
  { iata: 'BWI', name: 'Baltimore/Washington International', city: 'Baltimore', country: 'USA', lat: 39.1774, lon: -76.6684 },
  { iata: 'RDU', name: 'Raleigh-Durham International', city: 'Raleigh', country: 'USA', lat: 35.8801, lon: -78.7880 },
  { iata: 'SLC', name: 'Salt Lake City International', city: 'Salt Lake City', country: 'USA', lat: 40.7899, lon: -111.9791 },
  { iata: 'SAN', name: 'San Diego International', city: 'San Diego', country: 'USA', lat: 32.7336, lon: -117.1897 },
  { iata: 'TPA', name: 'Tampa International', city: 'Tampa', country: 'USA', lat: 27.9755, lon: -82.5332 },
  { iata: 'PDX', name: 'Portland International', city: 'Portland', country: 'USA', lat: 45.5898, lon: -122.5951 },
  { iata: 'HNL', name: 'Daniel K. Inouye International', city: 'Honolulu', country: 'USA', lat: 21.3187, lon: -157.9225 },
  { iata: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', lat: 43.6777, lon: -79.6248 },
  { iata: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada', lat: 49.1967, lon: -123.1815 },
  { iata: 'YUL', name: 'Montreal-Trudeau International', city: 'Montreal', country: 'Canada', lat: 45.4703, lon: -73.7408 },
  { iata: 'YYC', name: 'Calgary International', city: 'Calgary', country: 'Canada', lat: 51.1215, lon: -114.0076 },
  { iata: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico', lat: 19.4363, lon: -99.0721 },
  { iata: 'CUN', name: 'Cancun International', city: 'Cancun', country: 'Mexico', lat: 21.0365, lon: -86.8771 },
  // Europe
  { iata: 'LHR', name: 'Heathrow', city: 'London', country: 'UK', lat: 51.4700, lon: -0.4543 },
  { iata: 'LGW', name: 'Gatwick', city: 'London', country: 'UK', lat: 51.1537, lon: -0.1821 },
  { iata: 'STN', name: 'Stansted', city: 'London', country: 'UK', lat: 51.8860, lon: 0.2389 },
  { iata: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'UK', lat: 53.3588, lon: -2.2725 },
  { iata: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'UK', lat: 55.9500, lon: -3.3725 },
  { iata: 'GLA', name: 'Glasgow International', city: 'Glasgow', country: 'UK', lat: 55.8718, lon: -4.4336 },
  { iata: 'BFS', name: 'Belfast International', city: 'Belfast', country: 'UK', lat: 54.6575, lon: -6.2158 },
  { iata: 'LTN', name: 'Luton Airport', city: 'London', country: 'UK', lat: 51.8747, lon: -0.3683 },
  { iata: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'UK', lat: 52.4539, lon: -1.7480 },
  { iata: 'BRS', name: 'Bristol Airport', city: 'Bristol', country: 'UK', lat: 51.3827, lon: -2.7191 },
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lon: 2.5479 },
  { iata: 'ORY', name: 'Orly', city: 'Paris', country: 'France', lat: 48.7233, lon: 2.3794 },
  { iata: 'NCE', name: "Cote d'Azur", city: 'Nice', country: 'France', lat: 43.6584, lon: 7.2159 },
  { iata: 'LYS', name: 'Lyon-Saint Exupery', city: 'Lyon', country: 'France', lat: 45.7256, lon: 5.0821 },
  { iata: 'MRS', name: 'Marseille Provence', city: 'Marseille', country: 'France', lat: 43.4393, lon: 5.2214 },
  { iata: 'TLS', name: 'Toulouse-Blagnac', city: 'Toulouse', country: 'France', lat: 43.6351, lon: 1.3678 },
  { iata: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', lat: 52.3105, lon: 4.7683 },
  { iata: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', lat: 50.9014, lon: 4.4844 },
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', lat: 50.0379, lon: 8.5622 },
  { iata: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', lat: 48.3537, lon: 11.7750 },
  { iata: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Germany', lat: 52.3667, lon: 13.5033 },
  { iata: 'HAM', name: 'Hamburg Airport', city: 'Hamburg', country: 'Germany', lat: 53.6304, lon: 10.0009 },
  { iata: 'DUS', name: 'Dusseldorf Airport', city: 'Dusseldorf', country: 'Germany', lat: 51.2895, lon: 6.7668 },
  { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', lat: 47.4647, lon: 8.5492 },
  { iata: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', lat: 46.2381, lon: 6.1089 },
  { iata: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria', lat: 48.1103, lon: 16.5697 },
  { iata: 'MXP', name: 'Milan Malpensa', city: 'Milan', country: 'Italy', lat: 45.6306, lon: 8.7281 },
  { iata: 'LIN', name: 'Milan Linate', city: 'Milan', country: 'Italy', lat: 45.4521, lon: 9.2768 },
  { iata: 'FCO', name: 'Rome Fiumicino', city: 'Rome', country: 'Italy', lat: 41.8003, lon: 12.2389 },
  { iata: 'NAP', name: 'Naples International', city: 'Naples', country: 'Italy', lat: 40.8860, lon: 14.2908 },
  { iata: 'VCE', name: 'Venice Marco Polo', city: 'Venice', country: 'Italy', lat: 45.5053, lon: 12.3518 },
  { iata: 'FLP', name: 'Florence Peretola', city: 'Florence', country: 'Italy', lat: 43.8100, lon: 11.2051 },
  { iata: 'BGO', name: 'Bergamo Orio al Serio', city: 'Bergamo', country: 'Italy', lat: 45.6689, lon: 9.7018 },
  { iata: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain', lat: 41.2974, lon: 2.0833 },
  { iata: 'MAD', name: 'Adolfo Suarez Madrid-Barajas', city: 'Madrid', country: 'Spain', lat: 40.4983, lon: -3.5676 },
  { iata: 'AGP', name: 'Malaga-Costa del Sol', city: 'Malaga', country: 'Spain', lat: 36.6749, lon: -4.5711 },
  { iata: 'PMI', name: 'Palma de Mallorca', city: 'Palma', country: 'Spain', lat: 39.5533, lon: 2.7304 },
  { iata: 'IBZ', name: 'Ibiza Airport', city: 'Ibiza', country: 'Spain', lat: 38.8729, lon: 1.3731 },
  { iata: 'ALC', name: 'Alicante-Elche Miguel Hernandez', city: 'Alicante', country: 'Spain', lat: 38.2822, lon: -0.5582 },
  { iata: 'LIS', name: 'Lisbon Humberto Delgado', city: 'Lisbon', country: 'Portugal', lat: 38.7756, lon: -9.1354 },
  { iata: 'OPO', name: 'Porto Francisco Sa Carneiro', city: 'Porto', country: 'Portugal', lat: 41.2482, lon: -8.6814 },
  { iata: 'FNC', name: 'Madeira Cristiano Ronaldo', city: 'Funchal', country: 'Portugal', lat: 32.6974, lon: -16.7745 },
  { iata: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', lat: 53.4264, lon: -6.2499 },
  { iata: 'SNN', name: 'Shannon Airport', city: 'Shannon', country: 'Ireland', lat: 52.7020, lon: -8.9248 },
  { iata: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', lat: 55.6180, lon: 12.6561 },
  { iata: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', country: 'Norway', lat: 60.1939, lon: 11.1004 },
  { iata: 'BGO', name: 'Bergen Flesland', city: 'Bergen', country: 'Norway', lat: 60.2939, lon: 5.2181 },
  { iata: 'TRF', name: 'Sandefjord Torp', city: 'Sandefjord', country: 'Norway', lat: 59.1869, lon: 10.2586 },
  { iata: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden', lat: 59.6519, lon: 17.9186 },
  { iata: 'GOT', name: 'Gothenburg Landvetter', city: 'Gothenburg', country: 'Sweden', lat: 57.6628, lon: 12.2798 },
  { iata: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki', country: 'Finland', lat: 60.3172, lon: 24.9631 },
  { iata: 'WAW', name: 'Warsaw Chopin', city: 'Warsaw', country: 'Poland', lat: 52.1657, lon: 20.9671 },
  { iata: 'KRK', name: 'Krakow John Paul II', city: 'Krakow', country: 'Poland', lat: 50.0777, lon: 19.7848 },
  { iata: 'PRG', name: 'Vaclav Havel Prague', city: 'Prague', country: 'Czech Republic', lat: 50.1063, lon: 14.2600 },
  { iata: 'BUD', name: 'Budapest Ferenc Liszt', city: 'Budapest', country: 'Hungary', lat: 47.4367, lon: 19.2556 },
  { iata: 'ATH', name: 'Athens International', city: 'Athens', country: 'Greece', lat: 37.9364, lon: 23.9445 },
  { iata: 'SKG', name: 'Thessaloniki Airport', city: 'Thessaloniki', country: 'Greece', lat: 40.5197, lon: 22.9709 },
  { iata: 'HRG', name: 'Hurghada International', city: 'Hurghada', country: 'Egypt', lat: 27.9233, lon: 34.3850 },
  { iata: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt', lat: 30.1219, lon: 31.4056 },
  { iata: 'TUN', name: 'Tunis Carthage International', city: 'Tunis', country: 'Tunisia', lat: 36.8510, lon: 10.2272 },
  { iata: 'MLA', name: 'Malta International', city: 'Luqa', country: 'Malta', lat: 35.8574, lon: 14.4775 },
  // Middle East & Africa
  { iata: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', lat: 25.2532, lon: 55.3657 },
  { iata: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE', lat: 24.4330, lon: 54.6511 },
  { iata: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', lat: 25.2609, lon: 51.6138 },
  { iata: 'JED', name: 'King Abdulaziz International', city: 'Jeddah', country: 'Saudi Arabia', lat: 21.6719, lon: 39.1565 },
  { iata: 'RUH', name: 'King Khalid International', city: 'Riyadh', country: 'Saudi Arabia', lat: 24.9576, lon: 46.6989 },
  { iata: 'AMM', name: 'Queen Alia International', city: 'Amman', country: 'Jordan', lat: 31.9726, lon: 35.9934 },
  { iata: 'BEY', name: 'Beirut-Rafic Hariri International', city: 'Beirut', country: 'Lebanon', lat: 33.8209, lon: 35.4885 },
  { iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', lat: 41.2753, lon: 28.7519 },
  { iata: 'SAW', name: 'Istanbul Sabiha Gokcen', city: 'Istanbul', country: 'Turkey', lat: 40.8986, lon: 29.3095 },
  { iata: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg', country: 'South Africa', lat: -26.1367, lon: 28.2411 },
  { iata: 'CPT', name: 'Cape Town International', city: 'Cape Town', country: 'South Africa', lat: -33.9715, lon: 18.6021 },
  { iata: 'DUR', name: 'King Shaka International', city: 'Durban', country: 'South Africa', lat: -29.6145, lon: 31.1197 },
  { iata: 'NBO', name: 'Jomo Kenyatta International', city: 'Nairobi', country: 'Kenya', lat: -1.3192, lon: 36.9278 },
  { iata: 'MBA', name: 'Mombasa Moi International', city: 'Mombasa', country: 'Kenya', lat: -4.0348, lon: 39.6014 },
  { iata: 'DAR', name: 'Julius Nyerere International', city: 'Dar es Salaam', country: 'Tanzania', lat: -6.8781, lon: 39.2029 },
  { iata: 'ADD', name: 'Addis Ababa Bole International', city: 'Addis Ababa', country: 'Ethiopia', lat: 8.9779, lon: 38.7993 },
  { iata: 'CMN', name: 'Mohammed V International', city: 'Casablanca', country: 'Morocco', lat: 33.3675, lon: -7.5898 },
  { iata: 'RAK', name: 'Marrakech-Menara', city: 'Marrakech', country: 'Morocco', lat: 31.6069, lon: -8.0363 },
  { iata: 'FEZ', name: 'Fes-Saiss', city: 'Fes', country: 'Morocco', lat: 34.0522, lon: -4.9731 },
  { iata: 'AGP', name: 'Malaga-Costa del Sol', city: 'Malaga', country: 'Morocco', lat: 35.7709, lon: -5.5127 }, // Tangier
  { iata: 'LOS', name: 'Murtala Muhammed International', city: 'Lagos', country: 'Nigeria', lat: 6.5774, lon: 3.3214 },
  { iata: 'ACC', name: 'Kotoka International', city: 'Accra', country: 'Ghana', lat: 5.6052, lon: -0.1668 },
  { iata: 'ABJ', name: 'Felix Houphouet-Boigny International', city: 'Abidjan', country: 'Ivory Coast', lat: 5.3364, lon: -3.9333 },
  // Asia
  { iata: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', lat: 1.3644, lon: 103.9915 },
  { iata: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', lat: 13.6900, lon: 100.7501 },
  { iata: 'DMK', name: 'Don Mueang International', city: 'Bangkok', country: 'Thailand', lat: 13.9126, lon: 100.6067 },
  { iata: 'HKT', name: 'Phuket International', city: 'Phuket', country: 'Thailand', lat: 8.1119, lon: 98.3170 },
  { iata: 'CNX', name: 'Chiang Mai International', city: 'Chiang Mai', country: 'Thailand', lat: 18.7668, lon: 98.9626 },
  { iata: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia', lat: 2.7456, lon: 101.7072 },
  { iata: 'PEN', name: 'Penang International', city: 'Penang', country: 'Malaysia', lat: 5.2974, lon: 100.2768 },
  { iata: 'CGK', name: 'Soekarno-Hatta International', city: 'Jakarta', country: 'Indonesia', lat: -6.1256, lon: 106.6559 },
  { iata: 'DPS', name: 'Ngurah Rai International', city: 'Denpasar (Bali)', country: 'Indonesia', lat: -8.7468, lon: 115.1628 },
  { iata: 'UPG', name: 'Hassanuddin International', city: 'Makassar', country: 'Indonesia', lat: -5.0617, lon: 119.5540 },
  { iata: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan', lat: 35.5494, lon: 139.7798 },
  { iata: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', lat: 35.7647, lon: 140.3864 },
  { iata: 'KIX', name: 'Kansai International', city: 'Osaka', country: 'Japan', lat: 34.4273, lon: 135.2444 },
  { iata: 'ITM', name: 'Osaka Itami', city: 'Osaka', country: 'Japan', lat: 34.4347, lon: 135.2442 },
  { iata: 'FUK', name: 'Fukuoka Airport', city: 'Fukuoka', country: 'Japan', lat: 33.5903, lon: 130.4467 },
  { iata: 'OKA', name: 'Naha Airport', city: 'Okinawa', country: 'Japan', lat: 26.1958, lon: 127.6458 },
  { iata: 'SZX', name: 'Shenzhen Bao\'an International', city: 'Shenzhen', country: 'China', lat: 22.6393, lon: 113.8108 },
  { iata: 'CAN', name: 'Guangzhou Baiyun International', city: 'Guangzhou', country: 'China', lat: 23.3924, lon: 113.2988 },
  { iata: 'PVG', name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China', lat: 31.1434, lon: 121.8052 },
  { iata: 'SHA', name: 'Shanghai Hongqiao International', city: 'Shanghai', country: 'China', lat: 31.1980, lon: 121.3233 },
  { iata: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China', lat: 40.0799, lon: 116.6031 },
  { iata: 'PKX', name: 'Beijing Daxing International', city: 'Beijing', country: 'China', lat: 39.5099, lon: 116.4106 },
  { iata: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong', lat: 22.3080, lon: 113.9185 },
  { iata: 'TPE', name: 'Taiwan Taoyuan International', city: 'Taipei', country: 'Taiwan', lat: 25.0797, lon: 121.2342 },
  { iata: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea', lat: 37.4602, lon: 126.4407 },
  { iata: 'GMP', name: 'Gimpo International', city: 'Seoul', country: 'South Korea', lat: 37.5584, lon: 126.7906 },
  { iata: 'PUS', name: 'Gimhae International', city: 'Busan', country: 'South Korea', lat: 35.1795, lon: 128.9382 },
  { iata: 'MNL', name: 'Ninoy Aquino International', city: 'Manila', country: 'Philippines', lat: 14.5086, lon: 121.0194 },
  { iata: 'CEB', name: 'Mactan-Cebu International', city: 'Cebu', country: 'Philippines', lat: 10.3075, lon: 123.9792 },
  { iata: 'CRK', name: 'Clark International', city: 'Clark', country: 'Philippines', lat: 15.1860, lon: 120.5603 },
  { iata: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India', lat: 28.5562, lon: 77.1000 },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India', lat: 19.0896, lon: 72.8656 },
  { iata: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India', lat: 13.1979, lon: 77.7063 },
  { iata: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India', lat: 12.9941, lon: 80.1709 },
  { iata: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', country: 'India', lat: 22.6547, lon: 88.4467 },
  { iata: 'AMD', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad', country: 'India', lat: 23.0772, lon: 72.6346 },
  { iata: 'GOI', name: 'Goa Manohar International', city: 'Goa', country: 'India', lat: 15.3788, lon: 73.8315 },
  { iata: 'KTM', name: 'Tribhuvan International', city: 'Kathmandu', country: 'Nepal', lat: 27.6969, lon: 85.3582 },
  { iata: 'DAC', name: 'Hazrat Shahjalal International', city: 'Dhaka', country: 'Bangladesh', lat: 23.9931, lon: 90.4180 },
  { iata: 'CMB', name: 'Colombo Bandaranaike International', city: 'Colombo', country: 'Sri Lanka', lat: 7.1807, lon: 79.8840 },
  { iata: 'MLE', name: 'Velana International', city: 'Male', country: 'Maldives', lat: 4.1918, lon: 73.5292 },
  { iata: 'RGN', name: 'Yangon International', city: 'Yangon', country: 'Myanmar', lat: 16.9077, lon: 96.1332 },
  // Oceania
  { iata: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', lat: -33.9399, lon: 151.1753 },
  { iata: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', lat: -37.6690, lon: 144.8410 },
  { iata: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', lat: -27.3942, lon: 153.1218 },
  { iata: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia', lat: -31.9403, lon: 115.9672 },
  { iata: 'ADL', name: 'Adelaide Airport', city: 'Adelaide', country: 'Australia', lat: -34.9450, lon: 138.5306 },
  { iata: 'CBR', name: 'Canberra Airport', city: 'Canberra', country: 'Australia', lat: -35.3075, lon: 149.1950 },
  { iata: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', lat: -37.0082, lon: 174.7850 },
  { iata: 'WLG', name: 'Wellington International', city: 'Wellington', country: 'New Zealand', lat: -41.3272, lon: 174.8050 },
  { iata: 'CHC', name: 'Christchurch International', city: 'Christchurch', country: 'New Zealand', lat: -43.4894, lon: 172.5372 },
  { iata: 'NPE', name: 'Hawke\'s Bay Airport', city: 'Napier', country: 'New Zealand', lat: -39.4658, lon: 176.8703 },
  // South America
  { iata: 'GRU', name: 'Sao Paulo-Guarulhos International', city: 'Sao Paulo', country: 'Brazil', lat: -23.4356, lon: -46.4731 },
  { iata: 'GIG', name: 'Rio de Janeiro-Galeao International', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.8099, lon: -43.2505 },
  { iata: 'SSA', name: 'Salvador-Deputado Luis Eduardo Magalhaes', city: 'Salvador', country: 'Brazil', lat: -12.9108, lon: -38.3311 },
  { iata: 'BSB', name: 'President Juscelino Kubitschek International', city: 'Brasilia', country: 'Brazil', lat: -15.8692, lon: -47.9211 },
  { iata: 'EZE', name: 'Ministro Pistarini International', city: 'Buenos Aires', country: 'Argentina', lat: -34.8222, lon: -58.5358 },
  { iata: 'AEP', name: 'Jorge Newbery Airfield', city: 'Buenos Aires', country: 'Argentina', lat: -34.5592, lon: -58.4156 },
  { iata: 'SCL', name: 'Arturo Merino Benitez International', city: 'Santiago', country: 'Chile', lat: -33.3930, lon: -70.7858 },
  { iata: 'LIM', name: 'Jorge Chavez International', city: 'Lima', country: 'Peru', lat: -12.0219, lon: -77.1143 },
  { iata: 'BOG', name: 'El Dorado International', city: 'Bogota', country: 'Colombia', lat: 4.7016, lon: -74.1469 },
  { iata: 'MDE', name: 'Jose Maria Cordova International', city: 'Medellin', country: 'Colombia', lat: 6.1645, lon: -75.4231 },
  { iata: 'UIO', name: 'Mariscal Sucre International', city: 'Quito', country: 'Ecuador', lat: -0.1412, lon: -78.4892 },
  { iata: 'GYE', name: 'Jose Joaquin de Olmedo International', city: 'Guayaquil', country: 'Ecuador', lat: -2.1574, lon: -79.9236 },
  { iata: 'MVD', name: 'Carrasco International', city: 'Montevideo', country: 'Uruguay', lat: -34.8384, lon: -56.0308 },
  { iata: 'VVI', name: 'Viru Viru International', city: 'Santa Cruz de la Sierra', country: 'Bolivia', lat: -17.6448, lon: -63.1354 },
  // Central America & Caribbean
  { iata: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', lat: 40.6413, lon: -73.7781 },
  { iata: 'PTY', name: 'Tocumen International', city: 'Panama City', country: 'Panama', lat: 9.0714, lon: -79.3830 },
  { iata: 'SJO', name: 'Juan Santamaria International', city: 'San Jose', country: 'Costa Rica', lat: 9.9939, lon: -84.2088 },
  { iata: 'BZE', name: 'Philip S.W. Goldson International', city: 'Belize City', country: 'Belize', lat: 17.5391, lon: -88.3081 },
  { iata: 'GUA', name: 'La Aurora International', city: 'Guatemala City', country: 'Guatemala', lat: 14.5833, lon: -90.5275 },
  { iata: 'SQD', name: 'Juan Hoffmann', city: 'San Salvador', country: 'El Salvador', lat: 13.4406, lon: -89.1594 },
  { iata: 'RTB', name: 'Juan Manuel Galvez International', city: 'Roatan', country: 'Honduras', lat: 16.3168, lon: -86.5261 },
  { iata: 'MBJ', name: 'Sangster International', city: 'Montego Bay', country: 'Jamaica', lat: 18.5037, lon: -77.9134 },
  { iata: 'KIN', name: 'Norman Manley International', city: 'Kingston', country: 'Jamaica', lat: 17.9357, lon: -76.7875 },
  { iata: 'NAS', name: 'Lynden Pindling International', city: 'Nassau', country: 'Bahamas', lat: 25.0390, lon: -77.4662 },
  { iata: 'PUJ', name: 'Punta Cana International', city: 'Punta Cana', country: 'Dominican Republic', lat: 18.5674, lon: -68.3634 },
  { iata: 'SDQ', name: 'Las Americas International', city: 'Santo Domingo', country: 'Dominican Republic', lat: 18.4297, lon: -69.6689 },
  { iata: 'SXM', name: 'Princess Juliana International', city: 'St. Maarten', country: 'St. Maarten', lat: 18.0410, lon: -63.1090 },
  { iata: 'BGI', name: 'Sir Grantley Adams International', city: 'Barbados', country: 'Barbados', lat: 13.0746, lon: -59.4925 },
  { iata: 'TAB', name: 'Crown Point International', city: 'Tobago', country: 'Trinidad & Tobago', lat: 11.1497, lon: -60.8322 },
]

// Destination coordinates for our guides
const DEST_COORDS: Record<string, [number, number]> = {
  maldives: [3.2028, 73.2207],
  santorini: [36.4072, 25.4456],
  queenstown: [-45.0312, 168.6626],
  tokyo: [35.5494, 139.7798],
  'amalfi-coast': [40.6333, 14.2908],
  kyoto: [35.0116, 135.7681],
  'maasai-mara': [-1.4087, 35.0167],
  patagonia: [-41.8101, -68.9063],
  iceland: [63.9850, -16.5736],
  bali: [-8.7468, 115.1628],
  singapore: [1.3644, 103.9915],
  lisbon: [38.7756, -9.1354],
  dubai: [25.2532, 55.3657],
  barcelona: [41.2974, 2.0833],
  bangkok: [13.6900, 100.7501],
  amsterdam: [52.3105, 4.7683],
  'mexico-city': [19.4363, -99.0721],
  marrakech: [31.6069, -8.0363],
  helsinki: [60.3172, 24.9631],
  'cape-town': [-33.9715, 18.6021],
}

// Haversine great-circle distance
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function estimateFlightHours(airportLat: number, airportLon: number, destId: string): string {
  const destCoord = DEST_COORDS[destId]
  if (!destCoord) return 'Varies'

  const dist = haversineKm(airportLat, airportLon, destCoord[0], destCoord[1])
  // Cruising speed ~850 km/h, +45min for taxi/takeoff/landing
  const direct = Math.round(dist / 850)
  const connect = direct + 3
  const longConnect = direct + 7

  if (direct <= 1) return '1–2 hrs'
  if (direct <= 3) return `${direct}-${direct + 1} hrs`
  if (direct <= 6) return `${direct}-${connect} hrs`
  if (direct <= 10) return `${connect}-${longConnect} hrs`
  return `${longConnect}+ hrs`
}

function makeFlightUrl(depIata: string, destId: string): string {
  return `https://www.kayak.com/flights/${depIata}-${destId.toUpperCase()}/?sort=price_a`
}

interface Props {
  guide: DestinationGuide
}

export function FlightSearch({ guide }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<typeof AIRPORTS[0] | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const results = query.trim().length < 2
    ? []
    : AIRPORTS.filter((a) => {
        const q = query.toLowerCase()
        return (
          a.iata.toLowerCase().startsWith(q) ||
          a.city.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q)
        )
      }).slice(0, 8)

  const estimate = selected
    ? estimateFlightHours(selected.lat, selected.lon, guide.id)
    : null

  const flightUrl = selected
    ? makeFlightUrl(selected.iata, guide.id)
    : null

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="flex flex-col min-w-[220px]">
      {/* Label */}
      <span
        className="text-[#e8e0d4]/50 text-xs uppercase tracking-wider mb-1.5"
        style={{ fontFamily: "'Source Sans 3', sans-serif" }}
      >
        Flight time
      </span>

      {!selected ? (
        /* Search input */
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setShowDropdown(true)
                if (selected) setSelected(null)
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowDropdown(false)
                  inputRef.current?.blur()
                }
              }}
              placeholder="Enter city or airport code"
              className="w-full bg-white/10 border border-white/20 text-white text-sm px-3 py-2 pr-8 rounded-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9a96e] transition-colors"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              autoComplete="off"
            />
            {query.length > 0 && (
              <button
                onClick={() => {
                  setQuery('')
                  setSelected(null)
                  inputRef.current?.focus()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown results */}
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e2d3d] border border-white/20 rounded-sm shadow-xl z-50 overflow-hidden">
              {results.map((airport) => (
                <button
                  key={airport.iata}
                  onMouseDown={(e) => {
                    e.preventDefault() // prevent input blur before click registers
                    setSelected(airport)
                    setQuery('')
                    setShowDropdown(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 text-left transition-colors"
                >
                  <span
                    className="text-[#c9a96e] font-mono text-xs font-bold w-10 flex-shrink-0"
                    style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                  >
                    {airport.iata}
                  </span>
                  <span className="flex flex-col min-w-0">
                    <span
                      className="text-white text-sm truncate"
                      style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                    >
                      {airport.city}
                    </span>
                    <span
                      className="text-white/40 text-xs truncate"
                      style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                    >
                      {airport.name} · {airport.country}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {showDropdown && query.length >= 2 && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e2d3d] border border-white/20 rounded-sm shadow-xl z-50 px-3 py-2.5">
              <span className="text-white/40 text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                No airports found for &ldquo;{query}&rdquo;
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Selected airport display */
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span
              className="text-[#c9a96e] font-semibold text-base leading-none"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              {selected.iata} → {estimate}
            </span>
            <span
              className="text-white/50 text-xs mt-0.5"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              {selected.city}, {selected.country}
            </span>
          </div>
          {flightUrl && (
            <a
              href={flightUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="ml-auto text-[#c9a96e] hover:text-[#d4b87a] transition-colors flex-shrink-0"
              title="Search flights on KAYAK"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          )}
          <button
            onClick={() => { setSelected(null); setQuery(''); inputRef.current?.focus() }}
            className="text-white/30 hover:text-white/60 transition-colors"
            title="Change departure city"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
