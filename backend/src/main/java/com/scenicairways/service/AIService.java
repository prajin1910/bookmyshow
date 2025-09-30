package com.scenicairways.service;

import com.scenicairways.model.Flight;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AIService {

    private final Map<String, String[]> scenicDescriptions = new HashMap<>();
    private final Random random = new Random();

    public AIService() {
        initializeScenicDescriptions();
    }

    private void initializeScenicDescriptions() {
        scenicDescriptions.put("mumbai-goa", new String[]{
            "Experience breathtaking views of the Western Ghats mountain range as you soar above the lush green valleys and cascading waterfalls. The Arabian Sea coastline unfolds beneath you with pristine beaches and turquoise waters stretching to the horizon.",
            "Marvel at the dramatic landscape transition from Mumbai's urban sprawl to Goa's tropical paradise. Witness the Sahyadri mountains giving way to coastal plains, dotted with ancient forts and Portuguese colonial architecture.",
            "Enjoy spectacular aerial views of the Konkan coast with its pristine beaches, coconut groves, and traditional fishing villages. The morning sun creates a golden pathway across the Arabian Sea."
        });

        scenicDescriptions.put("delhi-leh", new String[]{
            "Witness the majestic Himalayan peaks rising from the Indo-Gangetic plains, with snow-capped summits of K2, Nanga Parbat, and the Karakoram range creating a breathtaking panorama. The landscape transforms from green valleys to stark, beautiful high-altitude desert.",
            "Experience the dramatic transition from the fertile plains of Punjab to the rugged terrain of Ladakh. See ancient monasteries perched on clifftops, pristine alpine lakes, and the confluence of the Indus and Zanskar rivers.",
            "Marvel at the world's youngest mountain range as you fly over some of Earth's highest peaks. The barren beauty of Ladakh unfolds below with its unique Buddhist culture and stunning high-altitude landscapes."
        });

        scenicDescriptions.put("chennai-portblair", new String[]{
            "Soar over the pristine waters of the Bay of Bengal, witnessing the stunning Andaman archipelago emerge from the deep blue ocean. Coral reefs create intricate patterns beneath crystal-clear waters, while tropical islands showcase untouched beaches and dense rainforests.",
            "Experience the breathtaking transition from mainland India to the remote Andaman Islands. See the vast expanse of the Bay of Bengal dotted with emerald islands, each surrounded by coral reefs and pristine beaches.",
            "Enjoy spectacular aerial views of one of India's most remote and beautiful destinations. The Andaman Sea reveals its secrets from above - coral atolls, mangrove forests, and some of the world's most pristine marine ecosystems."
        });

        scenicDescriptions.put("bangalore-mysore", new String[]{
            "Fly over the rolling hills of Karnataka's Western Ghats, witnessing coffee plantations, spice gardens, and ancient temples nestled in lush valleys. The Cauvery river winds through the landscape like a silver ribbon.",
            "Experience the beauty of South India's cultural heartland from above. See the magnificent Mysore Palace, Chamundi Hills, and the verdant countryside dotted with traditional villages and ancient temples.",
            "Marvel at the transition from Bangalore's modern cityscape to Mysore's royal heritage. The landscape below showcases India's rich biodiversity with dense forests, wildlife sanctuaries, and historic monuments."
        });
    }

    public String generateScenicDescription(Flight flight) {
        String route = (flight.getDeparture() + "-" + flight.getArrival()).toLowerCase();
        
        // Check for specific route descriptions
        if (scenicDescriptions.containsKey(route)) {
            String[] descriptions = scenicDescriptions.get(route);
            return descriptions[random.nextInt(descriptions.length)];
        }

        // Generate generic description based on sun position and scenic side
        return generateGenericDescription(flight);
    }

    private String generateGenericDescription(Flight flight) {
        StringBuilder description = new StringBuilder();
        
        // Add sun position context
        switch (flight.getSunPosition()) {
            case SUNRISE:
                description.append("Experience the magical golden hour as the sun rises, painting the landscape in warm hues of orange and pink. ");
                break;
            case SUNSET:
                description.append("Witness a spectacular sunset from 30,000 feet, as the sky transforms into a canvas of vibrant colors. ");
                break;
            case DAYLIGHT:
                description.append("Enjoy crystal-clear daylight views of the stunning landscape below. ");
                break;
        }

        // Add scenic side information
        switch (flight.getScenicSide()) {
            case LEFT:
                description.append("The best views are on the left side of the aircraft, offering unobstructed panoramas of ");
                break;
            case RIGHT:
                description.append("The right side of the aircraft provides the most spectacular views of ");
                break;
            case BOTH:
                description.append("Both sides of the aircraft offer incredible views of ");
                break;
        }

        // Add generic scenic elements
        description.append("mountains, valleys, rivers, and diverse landscapes that showcase the natural beauty of India. ");
        description.append("This scenic flight offers a unique perspective on the geographical diversity and cultural richness of the region.");

        return description.toString();
    }

    public String generateRouteAnalysis(String departure, String arrival) {
        // This would typically call an external AI service
        // For now, return a structured analysis
        return String.format(
            "Route Analysis for %s to %s:\n" +
            "• Optimal viewing altitude: 25,000-35,000 feet\n" +
            "• Best scenic viewing time: Throughout the flight\n" +
            "• Weather considerations: Clear skies recommended\n" +
            "• Photographic opportunities: Excellent for landscape photography\n" +
            "• Unique features: Diverse topographical transitions",
            departure, arrival
        );
    }
}