import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';

interface StoryData {
  title: string;
  category: string;
  description: string;
  coverImagePath: string;
  pages: Array<{
    pageNumber: number;
    textContent: string;
    imagePath?: string;
  }>;
}

const BatchStoryUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadedStories, setUploadedStories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'Computer Science' | 'Environmental Education' | 'Critical Thinking'>('Environmental Education');

  const environmentalEducationStories: StoryData[] = [
    {
      title: "Trash Trackers: The Great Sorting Showdown",
      category: "Environmental Education",
      description: "Join Captain Cora the Crow and the Trash Trackers team as they teach Tidyville how to sort waste properly! Learn about recycling, composting, and reducing waste through fun adventures with colorful bins.",
      coverImagePath: "parsed-documents://20251007-144757-531665/♻️_Trash_Trackers_The_Great_Sorting_Showdown.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "In the once-sparkly streets of Tidyville, a mysterious mess was on the move. Pizza crusts in flower beds. Crumpled flyers stuck to park swings. A juice box on the mayor's hat! 'What in the world?' squawked Captain Cora the Crow, diving from her lookout post atop the recycling tower. 'Someone call the Trash Trackers!' Meet the Trash Trackers! Fixit the Fox – Fast paws, faster thinking. Loves organizing messes. Milo the Mini Elephant – Small trunk, big memory. Knows every bin by heart. Hazel the Hedgehog – Quiet, clever, and compost-crazy.", imagePath: "parsed-documents://20251007-144757-531665/♻️_Trash_Trackers_The_Great_Sorting_Showdown.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "The trio screeched to a halt in front of three colorful bins: Blue for paper, Green for nature stuff, Yellow for the shiny recyclables. Tidyville's citizens stood around, confused. 'Where does this go?' one kid asked. Fixit twitched his whiskers. 'Time for the Sorting Showdown!' Milo raised his trunk: 'Blue is for paper! Green is for nature stuff like apple peels and leaves. Yellow is for plastic bottles, glass jars, metal tins!' As the citizens started sorting, a girl raised her hand. 'But... why bother?' Captain Cora swooped down. 'When you recycle right, you give trash a second life. Less waste, cleaner air, happier animals!'", imagePath: "parsed-documents://20251007-144757-531665/♻️_Trash_Trackers_The_Great_Sorting_Showdown.docx/images/page_3.jpg" },
        { pageNumber: 3, textContent: "By sunset, the park was spotless. The bins were full—but the landfill was not. Mayor Marmot rolled up in his scooter. 'Bravo, Trash Trackers! You've made sorting fun—and saved Tidyville!' Now it's your turn! Can you name one thing for each bin? Blue bin – Something made of paper? Green bin – Something compostable? Yellow bin – Something plastic, metal, or glass? Answers: Blue: Newspaper, Green: Carrot peels, Yellow: Plastic juice bottle. Remember, you don't need a badge to be a hero. Just sort smart, toss kind!", imagePath: "parsed-documents://20251007-144757-531665/♻️_Trash_Trackers_The_Great_Sorting_Showdown.docx/images/page_5.jpg" }
      ]
    },
    {
      title: "Air Buddies: The Breath We All Share",
      category: "Environmental Education",
      description: "Float through the sky with Poppy the Petal as you discover how air keeps us alive! Learn about trees, pollution, clean energy, and simple ways to keep our atmosphere fresh and healthy.",
      coverImagePath: "parsed-documents://20251007-144817-944835/Air_Buddies_The_Breath_We_All_Share.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "Hello there, Air Buddies! Grab your wind hats and take a big, deep breath—it's time to discover how to keep our skies fresh and clean! Our journey begins in Windy Whistle, where Poppy the Petal, a dancing daisy, floats on the breeze. 'Let's find out how air helps us live!' First stop: Leafy Lane, where mighty trees sway. 'These trees are like nature's breathers,' said Poppy. 'They drink carbon dioxide and breathe out oxygen!' Buzz the Bumblefly zipped by: 'When I flutter from flower to flower, I help plants grow stronger. More plants mean more oxygen!'", imagePath: "parsed-documents://20251007-144817-944835/Air_Buddies_The_Breath_We_All_Share.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "The group floated toward Skyline City, where the air wasn't as clear. Zeke the ZipKid appeared on a solar-powered skateboard. 'See these smog clouds? They're from too much smoke and exhaust. But clean tech like solar power and bikes can help!' The explorers learned how little changes—like using clean energy or walking—can help solve the puzzle. Poppy led them to The Rooftop Garden. 'Even in cities, plants help scrub the air clean. They're like nature's vacuum cleaners!' As breezes played, Poppy asked, 'What can YOU do to help the air stay fresh?'", imagePath: "parsed-documents://20251007-144817-944835/Air_Buddies_The_Breath_We_All_Share.docx/images/page_3.jpg" },
        { pageNumber: 3, textContent: "Under twinkling stars, Poppy floated down. 'Ready for the answer, Air Buddies?' Answer: You can help keep our air clean by walking or biking, saving electricity, using less plastic, and planting more greenery! 'Each small act of kindness for the air helps everyone—from bees and trees to you and me!' said Poppy with a warm smile. Your job as an Air Buddy is just beginning! Take a deep breath, and remember: the air belongs to all of us—and you have the power to protect it!", imagePath: "parsed-documents://20251007-144817-944835/Air_Buddies_The_Breath_We_All_Share.docx/images/page_4.jpg" }
      ]
    },
    {
      title: "Eco Rangers: The Great Earth Quest",
      category: "Environmental Education",
      description: "Join Poppy, Scout, and Dash on a mission to protect the planet! Meet Sir Cedar the tree, Splash the water spirit, and Sol the Sunbeam as you learn how to become an official Eco Ranger and care for Earth.",
      coverImagePath: "parsed-documents://20251007-144837-761545/Eco_Rangers_The_Great_Earth_Quest.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "In Meadowville lived Poppy the parrot, Scout the snail, and Dash the duckling. One sunny morning, a shimmering leaf floated down: 'Eco Rangers Wanted! Join the quest to save our planet!' They journeyed to Whispering Woods where Sir Cedar, a towering tree, swayed in the breeze. 'Trees are nature's air-fixers,' he rumbled. 'We drink carbon dioxide and give out fresh oxygen!' 'Like leafy superheroes!' squeaked Scout. Sir Cedar gave them a sapling to plant, which they named 'Whiffy.'", imagePath: "parsed-documents://20251007-144837-761545/Eco_Rangers_The_Great_Earth_Quest.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "Next stop: Twinkle Creek, where Splash the water spirit greeted them with a twirl. 'Water is precious! Don't let a drop go to waste!' She showed them tricks like turning off taps and using rain buckets. At Shiny Sun Hill, Sol the Sunbeam bounced over. 'Did you know I can power your homes with my solar strength? In just one hour, I give more energy than the whole world uses in a year!' The Eco Rangers imagined their town shining with solar panels, keeping Earth clean and cool.", imagePath: "parsed-documents://20251007-144837-761545/Eco_Rangers_The_Great_Earth_Quest.docx/images/page_3.jpg" },
        { pageNumber: 3, textContent: "Back in Meadowville, they couldn't wait to share their knowledge! Now it's your turn! Question: What do trees breathe in, and what do they breathe out? Answer: Trees breathe in carbon dioxide and breathe out oxygen—just like nature's breathing buddies! Your quest isn't over—it's just beginning! Keep planting, saving, exploring, and sharing. The Earth is lucky to have a hero like you. Happy questing, Eco Ranger!", imagePath: "parsed-documents://20251007-144837-761545/Eco_Rangers_The_Great_Earth_Quest.docx/images/page_4.jpg" }
      ]
    },
    {
      title: "Garden Goldmakers: The Trash-to-Treasure Team!",
      category: "Environmental Education",
      description: "Discover the magic of composting with Penny, Freddie, and Bella! Learn how to turn kitchen scraps and yard waste into 'garden gold' that helps plants grow strong and keeps trash out of landfills.",
      coverImagePath: "parsed-documents://20251007-144858-685722/Garden_Goldmakers_The_Trash-to-Treasure_Team!.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "In Sproutville, Penny, Freddie, and Bella spotted a problem. 'Look at all this food and leaf litter getting tossed!' Doctor Mossbottom, a gentle old snail, slid into the scene. 'Composting is like nature's recycling trick. It turns scraps into rich soil that plants love!' The trio became the Trash-to-Treasure Team. 'Toss in veggie scraps, eggshells, and brown leaves into a bin. Mix it, and before you know it—garden gold!' They set up a compost bin named Wiggly Wanda, ready to transform waste into magic!", imagePath: "parsed-documents://20251007-144858-685722/Garden_Goldmakers_The_Trash-to-Treasure_Team!.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "Days turned to weeks, and scraps inside Wanda started changing. 'Look! It's turning into dark, earthy mush!' Doctor Mossbottom nodded. 'That's compost—like vitamins for soil. Plants grow stronger with this!' They sprinkled their compost treasure in the garden. The results were amazing—sunflowers as tall as trees, bursting strawberries, and a pumpkin so big Bella could nap on it! The answer: Penny, Freddie, and Bella collect fruit and veggie scraps, eggshells, and dry leaves to make compost!", imagePath: "parsed-documents://20251007-144858-685722/Garden_Goldmakers_The_Trash-to-Treasure_Team!.docx/images/page_3.jpg" },
        { pageNumber: 3, textContent: "The Trash-to-Treasure Team learned that composting wasn't just for plants—it was for the planet! By turning garbage into goodness, they were making Sproutville greener, cleaner, and happier. Your composting journey is just starting! Will you become a Garden Goldmaker too? The world needs more heroes like you. Grab a bin, save your scraps, and let the compost magic begin! Happy composting, little Earth champion!", imagePath: "parsed-documents://20251007-144858-685722/Garden_Goldmakers_The_Trash-to-Treasure_Team!.docx/images/page_4.jpg" }
      ]
    },
    {
      title: "Ice Team Alpha: Secrets Beneath the Snow",
      category: "Environmental Education",
      description: "Travel to Antarctica with Zara, Leo, and Pip! Explore glaciers, meet penguins, learn about climate change, and discover why protecting Earth's frozen landscapes matters for everyone on the planet.",
      coverImagePath: "parsed-documents://20251007-144922-154472/Ice_Team_Alpha_Secrets_Beneath_the_Snow.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "Bundle up, frosty adventurers! Join Ice Team Alpha—Zara, Leo, and Pip—with their guide Dr. Blizzard for a mission to Antarctica! At Penguin Parade Point, tuxedoed penguins wobble and belly-slide. 'Penguins are nature's comedians!' laughs Zara. 'There are Emperor Penguins and Chinstrap Penguins—each has its own way of surviving in the cold.' The PolarScopes transport them to Glacier Garden, where ice towers sparkle. Dr. Blizzard grows serious: 'These glaciers are melting faster because Earth is warming. That's climate change.'", imagePath: "parsed-documents://20251007-144922-154472/Ice_Team_Alpha_Secrets_Beneath_the_Snow.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "At the Climate Cabin, they learn that turning off unused lights or biking instead of driving helps Earth cool down. 'Even little penguins can make a big difference!' The Aurora Arcade shows them magical curtains of green, pink, and purple lights. At Ocean Overlook, Dr. Blizzard explains: 'Antarctica is like the planet's air conditioner. If ice melts too fast, seas rise, and animals lose homes.' In The Ice Core Cave, glowing tunnels hold frozen bubbles from thousands of years ago, teaching scientists about Earth's past climate.", imagePath: "parsed-documents://20251007-144922-154472/Ice_Team_Alpha_Secrets_Beneath_the_Snow.docx/images/page_3.jpg" },
        { pageNumber: 3, textContent: "Question: Why is Antarctica important for the whole planet? Answer: Antarctica helps keep Earth cool, like a giant air conditioner! Its ice and cold waters help control the world's temperature. By learning about Antarctica and making Earth-friendly choices, YOU are heroes of the future! Your adventure with Ice Team Alpha is complete, but your mission to protect the planet continues!", imagePath: "parsed-documents://20251007-144922-154472/Ice_Team_Alpha_Secrets_Beneath_the_Snow.docx/images/page_4.jpg" }
      ]
    },
    {
      title: "Ocean Heroes Unite: Restoring the Coral Kingdom",
      category: "Environmental Education",
      description: "Dive deep with Captain Marina and the Ocean Heroes crew! Meet Tiki the Twinklefish, Tomo the Turtle, and Queen Aquanora as you learn about coral reefs, ocean pollution, and how to protect underwater kingdoms.",
      coverImagePath: "parsed-documents://20251007-144938-358069/Ocean_Heroes_Unite_Restoring_the_Coral_Kingdom.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "Get ready to make a splash with the Ocean Heroes! Captain Marina leads the quest to protect coral kingdoms. They dive into the Sparkle Reef, where Tiki the Twinklefish dances. 'Coral reefs are like underwater cities—homes for creatures big and small!' In Crystal Caves, Tomo the Talking Turtle warns: 'Plastic pollution hurts our home. Every bag or bottle can be dangerous. Let's promise to reduce, reuse, and recycle!' At Seagrass Gardens, Lulu the Seahorse curls her tail. 'This green meadow is where baby fish grow up safe!'", imagePath: "parsed-documents://20251007-144938-358069/Ocean_Heroes_Unite_Restoring_the_Coral_Kingdom.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "Quiz time: Who taught us about seagrasses as nurseries for baby fish? At Sunken Treasure Ridge, Shadow the Shark circles calmly. 'Sharks help keep oceans balanced by keeping fish populations healthy. Don't believe scary stories—protecting sharks is protecting the whole reef!' At the Coral Crown Citadel, Queen Aquanora says: 'Our coral homes are in danger from warming waters and ocean acid. But together, we can restore them!' Answer: Lulu the Seahorse taught us about seagrasses!", imagePath: "parsed-documents://20251007-144938-358069/Ocean_Heroes_Unite_Restoring_the_Coral_Kingdom.docx/images/page_3.jpg" },
        { pageNumber: 3, textContent: "Captain Marina gathered her team: 'Well done, Ocean Heroes! Keep these lessons close: Keep plastics out of the sea, respect seagrasses and creatures, speak up for sharks, support coral conservation, and share the ocean's magic! With every splash you make and every story you share, you help the coral kingdom thrive. Dive on, brave ocean protector—the waves are waiting for you!", imagePath: "parsed-documents://20251007-144938-358069/Ocean_Heroes_Unite_Restoring_the_Coral_Kingdom.docx/images/page_4.jpg" }
      ]
    },
    {
      title: "Reef Rangers Unite: Guardians of the Coral Kingdom",
      category: "Environmental Education",
      description: "Board the submarine SeaSprout and become a Reef Ranger! Join Queen Bubbla, Zippy the Clownfish, and Inky the Octopus to learn how coral reefs work and discover actions you can take to save them—even from dry land!",
      coverImagePath: "parsed-documents://20251007-144959-085572/Reef_Rangers_Unite_Guardians_of_the_Coral_Kingdom.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "Ahoy, ocean adventurers! Join the Reef Rangers aboard submarine SeaSprout! Queen Bubbla, a glowing coral, greets them. 'We corals may be tiny, but together we build underwater cities! Learn to become Reef Rangers and protect our home.' Corals are living animals called polyps, building castles for fish, crabs, and seahorses. Zippy the Clownfish zipped by. 'I'll show you the reef's best hide-and-seek spots! We fish depend on coral for food, shelter, and safety—like living in a sea-treehouse!'", imagePath: "parsed-documents://20251007-144959-085572/Reef_Rangers_Unite_Guardians_of_the_Coral_Kingdom.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "Inky the Octopus drifted into view. 'I've seen troubling changes—warmer waters, pollution, plastic hurting our reef. Time to take action!' Inky shared ways to help: Use less plastic, recycle properly, save energy to slow ocean warming, and speak up about protecting oceans. Twirlina the Seahorse twirled between coral fans. 'We seahorses love coral! It gives us places to rest, hide, and raise babies. When the reef is healthy, all sea creatures thrive!' Queen Bubbla asked: 'What can YOU do from dry land to protect coral reefs?'", imagePath: "parsed-documents://20251007-144959-085572/Reef_Rangers_Unite_Guardians_of_the_Coral_Kingdom.docx/images/page_3.jpg" },
        { pageNumber: 3, textContent: "Answer: Even far from the ocean, you can help by saying no to plastic straws and bags, saving water and electricity, recycling and reducing waste, and teaching others about the ocean. Every action counts—the health of our oceans depends on heroes like YOU. Thanks for joining the Reef Rangers. Your next mission? Protect the planet, one ripple at a time!", imagePath: "parsed-documents://20251007-144959-085572/Reef_Rangers_Unite_Guardians_of_the_Coral_Kingdom.docx/images/page_5.jpg" }
      ]
    },
    {
      title: "The Balance Keepers: A Climate Quest in Wondermere",
      category: "Environmental Education",
      description: "Join Breezy Belle, Sunny Sol, and Ripple Ray on a magical quest to understand climate change! Discover how small actions can restore balance to our world.",
      coverImagePath: "parsed-documents://20251007-150046-144311/The_Balance_Keepers_A_Climate_Quest_in_Wondermere.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "In Wondermere lived the Balance Keepers. Breezy Belle noticed the breeze felt warmer. 'The flowers are drooping!' She found Sunny Sol and Ripple Ray. 'I've been feeling too strong lately,' said Sunny. 'And the coral in my reef is pale,' added Ripple. They traveled across Wondermere to uncover the mystery. Luna Lily's pond had shrunk. They visited Sage Willow who explained climate change: 'Too much pollution traps heat around the world like an invisible blanket.'", imagePath: "parsed-documents://20251007-150046-144311/The_Balance_Keepers_A_Climate_Quest_in_Wondermere.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "The Balance Keepers held a Grand Green Gathering, sharing tips: Plant trees, turn off lights, ride bikes, recycle and reuse. They started a Tree of Tomorrow grove. Soon Wondermere glowed with harmony. Mission: What can YOU do? Plant a flower, turn off lights, pick up litter, use less plastic? Every action helps keep our planet in balance!", imagePath: "parsed-documents://20251007-150046-144311/The_Balance_Keepers_A_Climate_Quest_in_Wondermere.docx/images/page_4.jpg" }
      ]
    },
    {
      title: "The Deep Blue Detectives: Secrets from Below",
      category: "Environmental Education",
      description: "Dive deep with Captain Bubbles and Dr. Waverly to explore ocean mysteries! Discover bioluminescence, hydrothermal vents, and why protecting ocean life matters.",
      coverImagePath: "parsed-documents://20251007-150107-131055/The_Deep_Blue_Detectives_Secrets_from_Below.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "'Welcome aboard Subbubble 9!' said Captain Bubbles. 'We're heading to the Shadow Shelf!' They discovered creatures with bioluminescence—glowing to stay safe and find food. An anglerfish used its light to trick dinner. At hydrothermal vents, they met giant red tube worms. 'These creatures get energy from chemicals, no sunlight needed!' They discovered Shiny the Spin-Snail, a brand-new species!", imagePath: "parsed-documents://20251007-150107-131055/The_Deep_Blue_Detectives_Secrets_from_Below.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "How do creatures survive with no light and heavy pressure? Glowing lights, giant eyes or no eyes, and special bacteria that turn chemicals into food! Captain Bubbles handed you your Deep Blue Badge. 'The ocean holds secrets worth protecting.' Challenge: What will YOU do? Skip plastic straws? Learn about coral? Share fun facts? The ocean needs curious minds like yours!", imagePath: "parsed-documents://20251007-150107-131055/The_Deep_Blue_Detectives_Secrets_from_Below.docx/images/page_4.jpg" }
      ]
    },
    {
      title: "The Eco-Fun Fair: A Carnival for Planet Earth",
      category: "Environmental Education",
      description: "Step right up to the Eco-Fun Fair with Captain Greenbeard! Ride the Trash-to-Treasure Twister, Solar Sky Spinner, and Compost Coaster while learning to save the planet!",
      coverImagePath: "parsed-documents://20251007-150128-246513/The_Eco-Fun_Fair_A_Carnival_for_Planet_Earth.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "Welcome to the Eco-Fun Fair! Captain Greenbeard is your guide. First stop: Trash-to-Treasure Twister with Remy the Recycling Fox! Learn Reduce, Reuse, Recycle while sorting trash on the ride. Next: Solar Sky Spinner with Solara the Sunny Cat! See how sunshine powers everything. Then the Splash 'n' Save Slide with Dewey the Droplet Dragon teaching water conservation!", imagePath: "parsed-documents://20251007-150128-246513/The_Eco-Fun_Fair_A_Carnival_for_Planet_Earth.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "Ride the Eco-Energy Carousel with Nia the Night-Light Narwhal! Learn to save energy. Last stop: Compost Coaster with Milo the Mulch Mole! Turn food scraps into garden gold. Captain Greenbeard's riddle: What's one more way to care for our world? Answer: Planting trees and gardens gives animals homes and helps clean the air. Every eco-action counts!", imagePath: "parsed-documents://20251007-150128-246513/The_Eco-Fun_Fair_A_Carnival_for_Planet_Earth.docx/images/page_3.jpg" }
      ]
    },
    {
      title: "The Green Thread Tales: Fashion That Loves the Earth",
      category: "Environmental Education",
      description: "Walk the green runway with Nova, Zane, and Raya! Discover sustainable fashion through organic fabrics, upcycling, and fair trade practices.",
      coverImagePath: "parsed-documents://20251007-150149-602583/The_Green_Thread_Tales_Fashion_That_Loves_the_Earth.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "In Threadtopia, Nova, Zane, and Raya noticed mountains of tossed-out clothes. 'Let's make fashion that loves Earth back!' They visited the EcoArmoire filled with organic cotton, bamboo, and recycled yarn. At Upcycle Alley, Raya showed how old jeans became pencil pouches and socks became puppets. Challenge: What could you upcycle?", imagePath: "parsed-documents://20251007-150149-602583/The_Green_Thread_Tales_Fashion_That_Loves_the_Earth.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "At Textile Terrace, they learned about fair fashion—fair pay and safe work. In the Seeds & Style Garden, plants like hemp and bamboo grew into future T-shirts! The Green Runway Show featured recycled water-bottle jackets, banana-fiber dresses, and upcycled newspaper pants. Question: How can your closet change the world? Answer: Choose secondhand, upcycle creatively, support fair fashion, and buy less but better quality!", imagePath: "parsed-documents://20251007-150149-602583/The_Green_Thread_Tales_Fashion_That_Loves_the_Earth.docx/images/page_4.jpg" }
      ]
    },
    {
      title: "The Power Pals and the Great Energy Quest",
      category: "Environmental Education",
      description: "Join Pippa, Rocky, and Nia on a quest to discover renewable energy! Learn about solar panels, wind turbines, and hydroelectric power in Sunbeam Village.",
      coverImagePath: "parsed-documents://20251007-150211-286823/The_Power_Pals_and_the_Great_Energy_Quest.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "In Sunbeam Village, the Power Pals got a glowing clue! At Sparkle Street, they found solar panels catching sunlight and turning it into electricity. At Breezy Bluffs, wind turbines spun like giant pinwheels. 'Wind makes these fans move, creating electricity!' At Ripple River, Tika the Turtle showed them hydroelectric power—water flows through dams to spin turbines!", imagePath: "parsed-documents://20251007-150211-286823/The_Power_Pals_and_the_Great_Energy_Quest.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "Back in Sunbeam Village, they created the Power Pledge: 'I promise to use energy wisely, choose clean power when I can, and be a hero for my planet!' Turn off lights, unplug unused devices, open curtains instead of using lamps. You're a Power Pal too—every time you flip a switch or catch a breeze!", imagePath: "parsed-documents://20251007-150211-286823/The_Power_Pals_and_the_Great_Energy_Quest.docx/images/page_4.jpg" }
      ]
    },
    {
      title: "The Smog Squad: Clearing the Sky One Step at a Time",
      category: "Environmental Education",
      description: "Fight air pollution with Breezy Bella, Wattson, and Reuse Rex! Launch the Clear the Sky Challenge and learn how to reduce your carbon footprint.",
      coverImagePath: "parsed-documents://20251007-150232-145588/The_Smog_Squad_Clearing_the_Sky_One_Step_at_a_Time.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "In Brightville, thick gray smog covered the sky. The Smog Squad investigated! Car exhaust and factory smoke were polluting the air. Even home energy use mattered. But there are solutions: Recycle plastic bottles, plant trees to clean the air, use energy-saving lights, and turn things off when not needed!", imagePath: "parsed-documents://20251007-150232-145588/The_Smog_Squad_Clearing_the_Sky_One_Step_at_a_Time.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "The Clear the Sky Challenge launched! Kids sorted trash, recycled, and turned off lights. One tree can absorb 48 pounds of carbon dioxide yearly! Brightville's skies turned from gray to blue. Question: How can you reduce your carbon footprint? Turn off lights, recycle, use less water, ride bikes, choose reusable containers. You're a real-life hero!", imagePath: "parsed-documents://20251007-150232-145588/The_Smog_Squad_Clearing_the_Sky_One_Step_at_a_Time.docx/images/page_3.jpg" }
      ]
    },
    {
      title: "The Thirsty Land Quest: Solving the Water Puzzle",
      category: "Environmental Education",
      description: "Journey through the Dusty Dunes with Dusty the Desert Fox! Learn water conservation, recycling gray water, and smart technologies for a thirsty world.",
      coverImagePath: "parsed-documents://20251007-150251-729498/The_Thirsty_Land_Quest_Solving_the_Water_Puzzle.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "In Dusty Dunes, water was scarce. At the Grove of Great Saving, Sprinkle the Sprite taught: 'Shorter showers, tighter taps—little things bring big change!' At the Water Wheel of Reuse, Ravi showed how gray water gets a second life in gardens. At the Fountain of Smart Choices, Willa said: 'Only take what you need. Turn off taps!' Underground, Aqua showed aquifers—water treasures we must protect!", imagePath: "parsed-documents://20251007-150251-729498/The_Thirsty_Land_Quest_Solving_the_Water_Puzzle.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "At the Circle of Helping Hands, neighbors built wells and planted trees together. Final Challenge: Name three ways to save water at home! Answers: Shorter showers, turn off taps while brushing, fix leaks, collect rainwater, water plants in the morning. Every drop counts—you're a water hero!", imagePath: "parsed-documents://20251007-150251-729498/The_Thirsty_Land_Quest_Solving_the_Water_Puzzle.docx/images/page_4.jpg" }
      ]
    },
    {
      title: "Tales from Green Hollow: The Biodiversity Bandits",
      category: "Environmental Education",
      description: "Protect nature's treasures with Zippy, Flora, and Grum! Explore ecosystems, discover why every creature matters, and make the Green Hollow Promise.",
      coverImagePath: "parsed-documents://20251007-150314-767400/🌱_Tales_from_Green_Hollow_The_Biodiversity_Bandits.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "In Green Hollow, the Biodiversity Bandits found a riddle about life vanishing. At Buzz Hollow, bees were pollinating. 'No bees, no berries!' At Ripple Pond, frogs croaked. 'We only live in clean water!' At Skybranch Tree, every creature coexisted. 'We all live here—every creature matters! Lose one, and the whole system wobbles!' Bandit Fact: Ecosystems are balanced!", imagePath: "parsed-documents://20251007-150314-767400/🌱_Tales_from_Green_Hollow_The_Biodiversity_Bandits.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "Challenge: What can YOU do to protect plants and animals? Plant flowers, use less plastic, learn about bugs! They created the Green Hollow Promise: 'We will love the land, protect every paw and wing, save water, plant seeds, and keep nature flourishing!' Answer: Plant native wildflowers, build a bug hotel, skip pesticides, keep water clean, and learn more about biodiversity!", imagePath: "parsed-documents://20251007-150314-767400/🌱_Tales_from_Green_Hollow_The_Biodiversity_Bandits.docx/images/page_4.jpg" }
      ]
    },
    {
      title: "Sprout Scouts: The Great Garden Quest",
      category: "Environmental Education",
      description: "Grow the greenest garden with Captain Carrot and the Sprout Scouts! Learn about photosynthesis, pollination, composting, and the magic of gardening together.",
      coverImagePath: "parsed-documents://20251007-150342-347792/🌱_Sprout_Scouts_The_Great_Garden_Quest.docx/images/img_p0_1.jpg",
      pages: [
        { pageNumber: 1, textContent: "Captain Carrot led the Sprout Scouts on a garden quest! Sunny the Light Sprite taught about photosynthesis—plants use sunlight to grow! Buzz and Bloom showed pollination—spreading golden dust to help plants make fruits. Grumble the Root Gnome taught proper spacing. Wiggly and Wiggles turned leftovers into rich soil through composting!", imagePath: "parsed-documents://20251007-150342-347792/🌱_Sprout_Scouts_The_Great_Garden_Quest.docx/images/page_2.jpg" },
        { pageNumber: 2, textContent: "Captain Carrot's final challenge: 'What else helps a garden grow?' The Scouts planted seeds. Days passed, shoots emerged, the garden bloomed. Answer: Love, teamwork, patience, and care! A garden isn't just soil and seeds—it's heart, hands, and hope working together. Now you're an official Sprout Scout!", imagePath: "parsed-documents://20251007-150342-347792/🌱_Sprout_Scouts_The_Great_Garden_Quest.docx/images/page_4.jpg" }
      ]
    }
  ];

  const computerScienceStories: StoryData[] = [
    {
      title: "Code Quest: The Song of SparkleTech",
      category: "Computer Science",
      description: "Join Zara, Finn, and Juno on an eco-adventure through e-waste recycling and coding! Discover how to transform old gadgets into tech treasures while learning about variables, loops, and functions in the magical world of Glitchsong Grove.",
      coverImagePath: "parsed-documents://20251007-084601-421138/Code_Quest_The_Song_of_SparkleTech.docx/images/img_p0_1.jpg",
      pages: [
        {
          pageNumber: 1,
          textContent: "In the bright, buzzing town of Bitville, three eco-curious friends—Zara, Finn, and Juno—spotted a glowing neon scroll tucked inside a scooter-bot's gear. '✨ Join the Reboot Rally! ✨' it beamed. With hearts full of tech-love and planet pride, they followed the trail. They arrived at the dazzling SparkleTech Spire, where a giggly guide-bot named Zippo zipped forward. 'Greetings, Green Guardians! Ready to rescue the world from digital junk?'",
          imagePath: "parsed-documents://20251007-084601-421138/Code_Quest_The_Song_of_SparkleTech.docx/images/page_1.jpg"
        },
        {
          pageNumber: 2,
          textContent: "Zippo popped open a floating info-globe. 'E-waste means electronics—like tablets and toys—that get tossed. But guess what? Inside, they're full of hidden gems: copper, gold, even magical metals!' Juno gasped. 'So my old game console could become part of a space station?!' 'Bingo!' said Zippo. 'Recycling gadgets helps Earth stay clean and sparkly!' The friends followed shimmering hallways where humming belts carried cracked screens and faded phones. Robotic arms gently plucked out parts and sorted them into rainbow bins.",
          imagePath: "parsed-documents://20251007-084601-421138/Code_Quest_The_Song_of_SparkleTech.docx/images/page_2.jpg"
        },
        {
          pageNumber: 3,
          textContent: "Zippo twirled. 'Step one: gather e-stuff. Step two: sort out goodies like metal, plastic, and glass. Step three: reuse them to make cool stuff—like wind turbines or robot arms!' The trio entered a studio of sparkle and steam. Zara built a sunlight-powered flashlight for cave camping. Finn wired up a dancing bot from recycled gizmos. Juno turned shiny old chips into funky fashion charms. 'Reduce, Reuse, Reboot!' they chanted, crafting with pride.",
          imagePath: "parsed-documents://20251007-084601-421138/Code_Quest_The_Song_of_SparkleTech.docx/images/page_3.jpg"
        },
        {
          pageNumber: 4,
          textContent: "Far beyond Bitville lies the radiant land of Glitchsong Grove, where digital creatures waltz to code and wires twinkle like starlight. Here lives Lyra the Code Maestro. 'Let's begin,' said Lyra. 'The Verse of Variables begins our song!' She tapped the air, and glowing jars named spellSpeed, bubbleColor, and jumpNote floated above. 'Variables are like jars that hold values, just like notes hold sound.' They ventured into the Loop Beat Grove, where trees echoed repeating tunes. 'Loops repeat commands,' Lyra explained.",
          imagePath: "parsed-documents://20251007-084601-421138/Code_Quest_The_Song_of_SparkleTech.docx/images/page_4.jpg"
        }
      ]
    },
    {
      title: "SkyQuest Sprockets: Droning into the Future",
      category: "Computer Science",
      description: "Soar through the clouds with Aria, Juno, and Theo as they discover the amazing world of drone technology! Learn about coding, autonomous flight, and how drones help people through this exciting aerial adventure.",
      coverImagePath: "parsed-documents://20251007-084623-517052/SkyQuest_Sprockets_Droning_into_the_Future.docx/images/img_p0_1.jpg",
      pages: [
        {
          pageNumber: 1,
          textContent: "In the lively village of Gearford, three young inventors—Aria, Juno, and Theo—stumbled upon a peculiar parcel buzzing in the bushes. Out of it zoomed a sleek, shiny drone, its wings spinning like enchanted fans. 'That's no bird!' Theo exclaimed. 'It's a SkyQuest Sprocket!' said a voice. A cloud-puff of a creature named Nimbus, part-cloud, part-circuit, floated down. 'And you three have been chosen for a flight into the world of drone tech!'",
          imagePath: "parsed-documents://20251007-084623-517052/SkyQuest_Sprockets_Droning_into_the_Future.docx/images/page_1.jpg"
        },
        {
          pageNumber: 2,
          textContent: "Nimbus led them to the Hovering Hall of Circuits, where glowing diagrams danced across the walls. 'Drones,' Nimbus began, 'are piloted by invisible instructions called code. It's like writing a recipe that tells the drone how to fly, snap pictures, or deliver messages.' Juno gasped, 'So it's like programming a flying robot?' 'Exactly!' Nimbus winked. They strapped on virtual goggles and entered Drone Flight School, where they practiced with joysticks and air gestures.",
          imagePath: "parsed-documents://20251007-084623-517052/SkyQuest_Sprockets_Droning_into_the_Future.docx/images/page_2.jpg"
        },
        {
          pageNumber: 3,
          textContent: "They zoomed their Sprockets through loops and led them to perch on tiny cloud platforms. Every click and turn was a line of code made real. Atop the Lookout Loft, the Sprockets extended lenses like curious eyes. 'Drones help us see places humans can't easily reach,' Nimbus said. 'Search-and-rescue teams, photographers, and scientists all use drones.' Theo directed a drone to scan the Gearford River, watching as it mapped data in glowing trails.",
          imagePath: "parsed-documents://20251007-084623-517052/SkyQuest_Sprockets_Droning_into_the_Future.docx/images/page_3.jpg"
        },
        {
          pageNumber: 4,
          textContent: "They reached the Cirrus Course, where drones had to fly solo! 'Now, you'll test autonomous flight,' Nimbus declared. 'That means your code must guide the drone without you.' At Firewall Fortress, they met Cryptix, a digital hawk in armor. 'Drones need strong cybersecurity to protect their commands,' Cryptix warned. Back at the launch field, Nimbus asked, 'What do you think is the coolest thing drones can do?' The sky isn't the limit anymore—it's the beginning.",
          imagePath: "parsed-documents://20251007-084623-517052/SkyQuest_Sprockets_Droning_into_the_Future.docx/images/page_4.jpg"
        }
      ]
    },
    {
      title: "The Chat Meadow Explorers",
      category: "Computer Science",
      description: "Explore the digital world of safe online communication with NovaByte, ZipZoom, and EchoPix! Learn about usernames, passwords, emojis, and how to chat kindly and safely in the magical Chat Meadows.",
      coverImagePath: "parsed-documents://20251007-084652-872316/The_Chat_Meadow_Explorers_Adventures_in_Safe_and_Fun_Conversations.docx/images/img_p0_1.jpg",
      pages: [
        {
          pageNumber: 1,
          textContent: "In the glowing digital world of Cyberspace City, where emojis floated like balloons and chat windows shimmered under the pixel sun, lived three adventurous chatbots—NovaByte, ZipZoom, and EchoPix. One morning, their circuits buzzed with excitement as they gathered by the Info Fountain in Central Cloud Park. Today was the day they would explore the legendary Chat Meadows, where people from all over the world talked, shared ideas, and made new friends!",
          imagePath: "parsed-documents://20251007-084652-872316/The_Chat_Meadow_Explorers_Adventures_in_Safe_and_Fun_Conversations.docx/images/page_1.jpg"
        },
        {
          pageNumber: 2,
          textContent: "Their guide, the wise old owl Professor Codefeather, greeted them with a click and a wink. 'Before you enter the meadows, you'll need your UserKey—a secret name that lets you safely chat online.' NovaByte became NovaFriend, ZipZoom became ZoomBug, and EchoPix chose PixChat. As they entered the chat meadow, they were welcomed by Emojina, the rainbow-winged butterfly. 'I help add feeling to your messages with emojis! A smiley 😄 can show joy, and a heart ❤️ can share love!'",
          imagePath: "parsed-documents://20251007-084652-872316/The_Chat_Meadow_Explorers_Adventures_in_Safe_and_Fun_Conversations.docx/images/page_2.jpg"
        },
        {
          pageNumber: 3,
          textContent: "The trio sprinkled emojis in their first chat. Next, they skipped into Giffer's Grove, where little GIFs danced in the air. The group paused beside the Chatstream River. 'This is how your words travel,' explained Ripple, a wise talking turtle. 'Your kind words can go far—so always think before you type.' They arrived at Password Peaks, where CyberGuard the Dragon stood watch. 'Protect your name and passcode. Never share it with strangers, even if they ask politely!'",
          imagePath: "parsed-documents://20251007-084652-872316/The_Chat_Meadow_Explorers_Adventures_in_Safe_and_Fun_Conversations.docx/images/page_3.jpg"
        },
        {
          pageNumber: 4,
          textContent: "In the Forest of Friendly Feeds, trees grew messages and ideas like leaves. 'Kindness makes conversations bloom,' said Professor Codefeather. 'No teasing, no shouting—just helpful, respectful sharing.' NovaFriend replied, 'Words can build bridges or break them. I choose to build!' As the pixel sun set, the friends gathered beside the glowing pond. 'Your Username is your digital key!' ZoomBug said. 'And kindness is your guide,' PixChat added. Safe and joyful chatrooms begin with respect, creativity, and a strong digital key.",
          imagePath: "parsed-documents://20251007-084652-872316/The_Chat_Meadow_Explorers_Adventures_in_Safe_and_Fun_Conversations.docx/images/page_4.jpg"
        }
      ]
    },
    {
      title: "The DataDreamers: Adventures with Thinking Machines",
      category: "Computer Science",
      description: "Join Lyra and Finn in Circuit City as they discover how computers think! Explore algorithms, binary code, programming languages, and artificial intelligence with their digital companion Zipp.",
      coverImagePath: "parsed-documents://20251007-084710-108033/The_Chatbot_Chronicles_Conversations_with_Artificial_Minds.docx/images/img_p0_1.jpg",
      pages: [
        {
          pageNumber: 1,
          textContent: "In the radiant metropolis of Circuit City, where neon birds chirped binary tunes and holograms painted rainbows in the air, lived two brilliant young inventors—Lyra the Logic Seeker and Finn the Pattern Finder. One bright morning, while fixing an old terminal at the edge of the TechnoPark, they discovered a glowing cube with blinking lights and a tiny talking face. 'Greetings! I'm Zipp, your digital conversation companion!' it chimed. 'You're a chatbot!' Lyra gasped.",
          imagePath: "parsed-documents://20251007-084710-108033/The_Chatbot_Chronicles_Conversations_with_Artificial_Minds.docx/images/page_1.jpg"
        },
        {
          pageNumber: 2,
          textContent: "Zipp whisked them to the Algorithm Arcade, where light-up steps guided them through puzzles. 'An algorithm is a set of instructions,' Zipp explained. 'Just like following a recipe or building with blocks.' The arcade's games asked them to sort shapes, navigate mazes, and find patterns—each one a puzzle powered by logic. 'Even video games use algorithms!' Finn grinned. 'It's like giving computers a brain!'",
          imagePath: "parsed-documents://20251007-084710-108033/The_Chatbot_Chronicles_Conversations_with_Artificial_Minds.docx/images/page_2.jpg"
        },
        {
          pageNumber: 3,
          textContent: "They arrived at Binary Grove, a tranquil place where trees had glowing leaves marked 0 and 1. 'Everything a computer does—every color, sound, and word—starts as these two digits,' Lyra whispered in awe. Zipp nodded. 'It's the smallest language, yet it builds entire worlds.' Then came the vibrant Code Meadow, where petals spelled out code in languages like Python, Java, and Scratch. 'These are how we talk to computers,' Zipp explained.",
          imagePath: "parsed-documents://20251007-084710-108033/The_Chatbot_Chronicles_Conversations_with_Artificial_Minds.docx/images/page_3.jpg"
        },
        {
          pageNumber: 4,
          textContent: "Zipp led them to a grand hall filled with cleaning bots, chatbots, translators, and drawing assistants. 'AI, or Artificial Intelligence,' said Zipp, 'is when machines learn from data and respond smartly. Like me!' They ended their tour in the glowing Gallery of Possibilities, walls shimmering with dreams of the future—robots helping doctors, computers tutoring students, and code cleaning oceans. 'Technology can't replace humans,' said Zipp. 'But it can work with us—to imagine, build, and solve.'",
          imagePath: "parsed-documents://20251007-084710-108033/The_Chatbot_Chronicles_Conversations_with_Artificial_Minds.docx/images/page_4.jpg"
        }
      ]
    },
    {
      title: "The Circuit Savers: Rebooting Our Planet",
      category: "Computer Science",
      description: "Nova, Leo, and Trixie embark on an eco-tech adventure to save the planet from e-waste! Learn about electronics recycling, upcycling, and how to turn old gadgets into new treasures while discovering coding fundamentals.",
      coverImagePath: "parsed-documents://20251007-084727-010764/The_Circuit_Savers_Rebooting_Our_Planet_One_Gadget_at_a_Time.docx/images/img_p0_1.jpg",
      pages: [
        {
          pageNumber: 1,
          textContent: "In the techno-bustling city of Circuiton, three eco-brilliant buddies—Nova, Leo, and Trixie—discovered a glowing green flyer stuck in a robot dog's tail. 'Join the E-Waste Quest!' it read. With their love of tech and nature, they just had to follow the trail. They arrived at the TechCycle Tower, where a sparkle-eyed guide bot, Sparky, greeted them. 'Welcome, Eco Cadets! Ready to rescue our world from electronic clutter?'",
          imagePath: "parsed-documents://20251007-084727-010764/The_Circuit_Savers_Rebooting_Our_Planet_One_Gadget_at_a_Time.docx/images/page_1.jpg"
        },
        {
          pageNumber: 2,
          textContent: "Sparky spun open a hologram globe. 'E-waste is old electronics—like phones and game consoles—that get tossed away. But buried inside them are valuable treasures: gold, copper, and rare earths!' Trixie's eyes widened. 'You mean my old tablet could become part of a new rocket?' 'Exactly!' said Sparky. 'Recycling tech keeps gadgets out of landfills and gives Earth a breather.'",
          imagePath: "parsed-documents://20251007-084727-010764/The_Circuit_Savers_Rebooting_Our_Planet_One_Gadget_at_a_Time.docx/images/page_2.jpg"
        },
        {
          pageNumber: 3,
          textContent: "In the glowing halls of TechCycle Tower, conveyor belts whirred with broken keyboards and blinking screens. Robo-hands sorted pieces into colorful bins. 'Step one: collect e-waste. Step two: sort materials like plastic, metal, and glass. Step three: repurpose them to build something new—like solar panels or new microchips!' Each friend picked a build project. Nova crafted a solar charger. Leo made a mini robot. Trixie designed jewelry from old motherboards. 'Reduce, reuse, reboot!' they chanted.",
          imagePath: "parsed-documents://20251007-084727-010764/The_Circuit_Savers_Rebooting_Our_Planet_One_Gadget_at_a_Time.docx/images/page_3.jpg"
        },
        {
          pageNumber: 4,
          textContent: "In the rhythmic world of Melody Circuit, the Harmony Coder orchestrated the digital world. 'First, we learn the Variable Verse—the song of change!' With a tap, jars labeled magicSpell, jumpSpeed, and colorNote floated. 'Variables store changing values, just like shifting tunes.' Next stop: Loop Rhythm Grove. 'Loops are the chorus of our code. Want a bunny to hop ten times? Just loop it!' Soon, echoing loops created swirling light and sound.",
          imagePath: "parsed-documents://20251007-084727-010764/The_Circuit_Savers_Rebooting_Our_Planet_One_Gadget_at_a_Time.docx/images/page_4.jpg"
        }
      ]
    },
    {
      title: "The Firewall Fortress: Protecting the Digital Kingdom",
      category: "Computer Science",
      description: "Join Chip and Pixel on a cybersecurity adventure through Binaryburg! Discover how firewalls, encryption, and authentication protect our digital world from trolls and viruses.",
      coverImagePath: "parsed-documents://20251007-084820-723171/The_Firewall_Fortress_Protecting_the_Digital_Kingdom.docx/images/img_p0_1.jpg",
      pages: [
        {
          pageNumber: 1,
          textContent: "In the bustling land of Binaryburg, where ones and zeros danced through the air, lived a curious little computer named Chip. Chip loved exploring the Digital Kingdom, but the most fascinating place of all was the Firewall Fortress. Unlike regular castles, this fortress was woven with glowing codes and sparkling algorithms. It stood tall, guarding the kingdom from sneaky trolls and tricky viruses that tried to slip in. 'The Firewall is like a giant invisible shield,' Chip explained to his friend Pixel.",
          imagePath: "parsed-documents://20251007-084820-723171/The_Firewall_Fortress_Protecting_the_Digital_Kingdom.docx/images/page_1.jpg"
        },
        {
          pageNumber: 2,
          textContent: "'It keeps the good messages in and the bad ones out.' Inside the Fortress, Chip discovered a glowing scroll labeled Encryption. With Pixel's help, he learned that encryption was a secret code only trusted friends could read. 'It's like sending a message in a puzzle box,' Pixel said. 'Only the right key can open it!' Chip and Pixel met the digital guards who worked with a system called Authentication. 'It's like a secret handshake,' said Guard.",
          imagePath: "parsed-documents://20251007-084820-723171/The_Firewall_Fortress_Protecting_the_Digital_Kingdom.docx/images/page_2.jpg"
        },
        {
          pageNumber: 3,
          textContent: "Then came the Intrusion Detection System, a magical radar that spotted danger. When it sensed trouble, sirens whooshed and guards leapt into action, zapping viruses and zipping trolls out of the kingdom. Chip watched as the Firewall's drawbridge opened for safe messages and closed for dangerous ones. He realized how vital the fortress was in keeping everything safe and sound. Can you think of your own secret code or handshake with friends to keep your digital kingdom safe?",
          imagePath: "parsed-documents://20251007-084820-723171/The_Firewall_Fortress_Protecting_the_Digital_Kingdom.docx/images/page_3.jpg"
        }
      ]
    },
    {
      title: "The Gadget Guardians: A Recycle Rescue Adventure",
      category: "Computer Science",
      description: "Skye, Rio, and Luna become Gadget Guardians in Digitropolis! Join them on an exciting mission to rescue old electronics from waste and transform them into amazing new creations through recycling and creativity.",
      coverImagePath: "parsed-documents://20251007-084839-539537/The_Gadget_Guardians_A_Recycle_Rescue_Adventure!.docx/images/img_p0_1.jpg",
      pages: [
        {
          pageNumber: 1,
          textContent: "In the super-zappy city of Digitropolis, three tech-smart pals—Skye, Rio, and Luna—spotted a glowing green sticker stuck to a hover-bot's paw. It read: '✨ Join the Gadget Guardians! Help rescue the planet—one device at a time!' With hearts full of curiosity and a passion for protecting nature, they zipped off toward the mystery. Their journey led them to the dazzling ReTech Tower, where a winking guide-bot named Blink greeted them. 'Hello, Guardians-in-training! Ready to reboot the world and fight e-waste?'",
          imagePath: "parsed-documents://20251007-084839-539537/The_Gadget_Guardians_A_Recycle_Rescue_Adventure!.docx/images/page_1.jpg"
        },
        {
          pageNumber: 2,
          textContent: "Blink tapped a floating hologram globe. 'E-waste means old electronics—phones, remotes, video games—that get tossed away. But inside? There are hidden treasures—copper, gold, even magical metals!' Luna gasped, 'So my old music player could help build a rocket?' 'Exactly!' chirped Blink. 'Recycling electronics gives them new life and helps our Earth breathe easier.' Inside, conveyor belts buzzed with blinking buttons, squeaky speakers, and cracked cables. Robo-arms gently sorted parts into rainbow bins.",
          imagePath: "parsed-documents://20251007-084839-539537/The_Gadget_Guardians_A_Recycle_Rescue_Adventure!.docx/images/page_2.jpg"
        },
        {
          pageNumber: 3,
          textContent: "Rio asked, 'How does it all become useful again?' 'Step 1: Gather e-waste. Step 2: Sort materials—plastic, glass, metal. Step 3: Turn them into something amazing—like wind turbines or space sensors!' Each friend picked a special upcycle mission. Skye built a solar-powered phone charger. Rio crafted a wiggly bot using old circuit boards. Luna turned shiny motherboards into sparkling robot-charm bracelets. 'Reduce, Reuse, REBOOT!' they chanted. 'You've become true Gadget Guardians! Share your wisdom. Host e-waste events. Invent upcycled wonders. Be the change!'",
          imagePath: "parsed-documents://20251007-084839-539537/The_Gadget_Guardians_A_Recycle_Rescue_Adventure!.docx/images/page_3.jpg"
        }
      ]
    }
  ];

  const copyFileToPublic = async (sourcePath: string, targetPath: string): Promise<string> => {
    try {
      const response = await fetch(`/__lovable/file-content?path=${encodeURIComponent(sourcePath)}`);
      if (!response.ok) throw new Error('Failed to fetch file');
      const blob = await response.blob();
      const file = new File([blob], targetPath.split('/').pop() || 'file', { type: blob.type });
      
      const { data, error } = await supabase.storage
        .from('story-books')
        .upload(targetPath, file, { upsert: true });

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('story-books')
        .getPublicUrl(targetPath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error copying file:', error);
      throw error;
    }
  };

  const uploadStory = async (story: StoryData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Upload cover image
    const coverUrl = await copyFileToPublic(
      story.coverImagePath,
      `covers/${Date.now()}-${story.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.jpg`
    );

    // Insert story book
    const { data: storyBook, error: storyError } = await supabase
      .from('story_books')
      .insert({
        title: story.title,
        description: story.description,
        category: story.category,
        cover_image_url: coverUrl,
        created_by: user.id
      })
      .select()
      .single();

    if (storyError) throw storyError;

    // Upload pages
    for (const page of story.pages) {
      let imageUrl = null;
      if (page.imagePath) {
        imageUrl = await copyFileToPublic(
          page.imagePath,
          `pages/${storyBook.id}/${page.pageNumber}.jpg`
        );
      }

      const { error: pageError } = await supabase
        .from('story_pages')
        .insert({
          story_book_id: storyBook.id,
          page_number: page.pageNumber,
          text_content: page.textContent,
          image_url: imageUrl
        });

      if (pageError) throw pageError;
    }

    return story.title;
  };

  const handleBatchUpload = async () => {
    setUploading(true);
    const uploaded: string[] = [];

    const storiesToUpload = selectedCategory === 'Environmental Education' 
      ? environmentalEducationStories 
      : computerScienceStories;

    for (const story of storiesToUpload) {
      try {
        const title = await uploadStory(story);
        uploaded.push(title);
        setUploadedStories([...uploaded]);
        toast({
          title: "Success!",
          description: `Uploaded: ${title}`,
        });
      } catch (error) {
        console.error(`Error uploading ${story.title}:`, error);
        toast({
          title: "Error",
          description: `Failed to upload: ${story.title}`,
          variant: "destructive",
        });
      }
    }

    setUploading(false);
    toast({
      title: "Batch Upload Complete!",
      description: `Successfully uploaded ${uploaded.length} stories.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/story-books')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Batch Story Upload
          </h1>
        </div>

        <Tabs 
          value={selectedCategory} 
          onValueChange={(value) => {
            setSelectedCategory(value as 'Computer Science' | 'Environmental Education' | 'Critical Thinking');
            setUploadedStories([]);
          }}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="Environmental Education">Environmental Education</TabsTrigger>
            <TabsTrigger value="Computer Science">Computer Science</TabsTrigger>
          </TabsList>

          <TabsContent value="Environmental Education">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Environmental Education Stories</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Ready to upload {environmentalEducationStories.length} stories to the "Environmental Education" category.
              </p>
              
              <div className="space-y-2 mb-6">
                {environmentalEducationStories.map((story, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="font-medium">{story.title}</span>
                    {uploadedStories.includes(story.title) && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={handleBatchUpload}
                disabled={uploading || uploadedStories.length === environmentalEducationStories.length}
                className="w-full gap-2"
                size="lg"
              >
                <Upload className="h-5 w-5" />
                {uploading
                  ? `Uploading... (${uploadedStories.length}/${environmentalEducationStories.length})`
                  : uploadedStories.length === environmentalEducationStories.length
                  ? "All Stories Uploaded!"
                  : "Start Batch Upload"}
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="Computer Science">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Computer Science Stories</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Ready to upload {computerScienceStories.length} stories to the "Computer Science" category.
              </p>
              
              <div className="space-y-2 mb-6">
                {computerScienceStories.map((story, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="font-medium">{story.title}</span>
                    {uploadedStories.includes(story.title) && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={handleBatchUpload}
                disabled={uploading || uploadedStories.length === computerScienceStories.length}
                className="w-full gap-2"
                size="lg"
              >
                <Upload className="h-5 w-5" />
                {uploading
                  ? `Uploading... (${uploadedStories.length}/${computerScienceStories.length})`
                  : uploadedStories.length === computerScienceStories.length
                  ? "All Stories Uploaded!"
                  : "Start Batch Upload"}
              </Button>
            </Card>
          </TabsContent>
        </Tabs>

        {uploadedStories.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Upload Progress</h3>
            <div className="space-y-2">
              {uploadedStories.map((title, idx) => (
                <div key={idx} className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{title}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BatchStoryUpload;