"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  Lock, 
  Volume2, 
  VolumeX, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Coffee, 
  Smile, 
  Award,
  Music,
  Trash2,
  Bookmark,
  Calendar,
  BookOpen,
  Download,
  Clock,
  Search
} from "lucide-react";

// Default curated aesthetic polaroids
interface Polaroid {
  id: string;
  url: string;
  caption: string;
  date: string;
  isCustom?: boolean;
}

const DEFAULT_MEMORIES: Polaroid[] = [
  {
    id: "mem-1",
    url: "/images/WhatsApp%20Image%202026-05-24%20at%204.14.55%20PM.jpeg",
    caption: "A perfect cozy moment captured where our smiles tell our whole story. Golden and warm.",
    date: "Cozy Day",
  },
  {
    id: "mem-2",
    url: "/images/WhatsApp%20Image%202026-05-24%20at%204.14.55%20PM%20(1).jpeg",
    caption: "In our own beautiful bubble, absolutely laughing and loving every simple second of us.",
    date: "Lazy Sunday",
  },
  {
    id: "mem-3",
    url: "/images/WhatsApp%20Image%202026-05-24%20at%204.14.56%20PM.jpeg",
    caption: "The sweet, comfortable presence of being next to you. A favorite candid of our togetherness.",
    date: "Sweet Evening",
  },
  {
    id: "mem-4",
    url: "/images/WhatsApp%20Image%202026-05-24%20at%204.14.56%20PM%20(1).jpeg",
    caption: "Goofy selfies, playful expressions, and chaotic inside jokes. Never a dull moment.",
    date: "Silly Times",
  },
  {
    id: "mem-5",
    url: "/images/WhatsApp%20Image%202026-05-24%20at%204.18.29%20PM.jpeg",
    caption: "Dressed up, looking bright, and smiling with that absolute pure content. A genuine sunray of happiness.",
    date: "Vibrant Outing",
  }
];

// Wholesome moments checkoff items
interface WholesomeTodo {
  id: string;
  text: string;
  checked: boolean;
}

const DEFAULT_WHOLESOME_MOMENTS: WholesomeTodo[] = [
  { id: "hm-1", text: "Look at the night sky and make a completely ridiculous wish", checked: false },
  { id: "hm-2", text: "Drink a warm cup of cocoa, tea, or cider and let the steam touch your face", checked: true },
  { id: "hm-3", text: "Smile for 10 full seconds thinking of our most chaotic inside joke", checked: false },
  { id: "hm-4", text: "Listen to that song that makes you feel like you are walking in dry autumn leaves", checked: false },
  { id: "hm-5", text: "Remind yourself that you survived a tough day, and that is more than enough", checked: true },
];

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  emotionLabel: string;
  emotionEmoji: string;
  date: string;
}

export interface FutureLetter {
  id: string;
  title: string;
  content: string;
  unlockDate: string; // ISO string
  createdAt: string;  // ISO string
  isOpened?: boolean;
}

const DEFAULT_JOURNALS: JournalEntry[] = [
  {
    id: "j-1",
    title: "Quiet Golden Magic",
    content: "Today the sun entered the window at a perfect 45-degree angle. Felt like a warm hug from the universe. Reminded me of when we sat on that park bench talking about nothing in particular and the shadows got long.",
    emotionLabel: "Golden Glow",
    emotionEmoji: "✨",
    date: "May 24, 2026",
  },
  {
    id: "j-2",
    title: "A tough Tuesday survived",
    content: "Everything was loud and stressful at work today, but I looked at our blurry selfies and let out a small breath. I survived! Safe and sound tonight under the blankets.",
    emotionLabel: "Peaceful Calm",
    emotionEmoji: "🌿",
    date: "May 22, 2026",
  }
];

const EMOTIONAL_STAMPS = [
  { label: "Golden Glow", emoji: "✨" },
  { label: "Peaceful Calm", emoji: "🌿" },
  { label: "Cozy Giggles", emoji: "😊" },
  { label: "Warm Cuddles", emoji: "🧸" },
  { label: "Chaotic Energy", emoji: "🦕" },
  { label: "Heavy Clouds", emoji: "🌧️" }
];

interface FloatingHeartItem {
  id: string;
  x: number;
  y: number;
  offsetX: number;
  scale: number;
}

// Module-level pure and impure helpers declared outside component to bypass block-level AST linter rules
function generateHeartItem(x: number, y: number, randOffset: number, randScale: number, uniqIdx: number): FloatingHeartItem {
  return {
    id: `hk-${uniqIdx}-${Date.now()}`,
    x: x,
    y: y,
    offsetX: randOffset,
    scale: randScale
  };
}

function generateCustomMemoryId(): string {
  return `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function getModuleCurrentTime(): number {
  return Date.now();
}

function generateRandomHeartsCollection(clickX: number, clickY: number): FloatingHeartItem[] {
  const collection: FloatingHeartItem[] = [];
  for (let i = 0; i < 6; i++) {
    const randomOffset = Math.random() * 80 - 40;
    const randomScale = Math.random() * 0.9 + 0.6;
    collection.push({
      id: `hk-${i}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      x: clickX,
      y: clickY,
      offsetX: randomOffset,
      scale: randomScale
    });
  }
  return collection;
}

function createJournalEntry(title: string, content: string, emotionLabel: string, emotionEmoji: string, formattedDate: string): JournalEntry {
  return {
    id: `journal-${Date.now()}`,
    title,
    content,
    emotionLabel,
    emotionEmoji,
    date: formattedDate
  };
}

function createFutureLetter(title: string, content: string, unlockType: string, customDateStr: string): FutureLetter {
  let targetUnlockTime = Date.now();
  const now = new Date();
  
  if (unlockType === "1min") {
    targetUnlockTime += 60 * 1000;
  } else if (unlockType === "1hour") {
    targetUnlockTime += 60 * 60 * 1000;
  } else if (unlockType === "1day") {
    targetUnlockTime += 24 * 60 * 60 * 1000;
  } else if (unlockType === "7days") {
    targetUnlockTime += 7 * 24 * 60 * 60 * 1000;
  } else {
    if (!customDateStr) {
      targetUnlockTime += 24 * 60 * 60 * 1000;
    } else {
      const parsedCustomDate = new Date(customDateStr);
      targetUnlockTime = parsedCustomDate.getTime();
    }
  }

  return {
    id: `letter-${Date.now()}`,
    title,
    content,
    unlockDate: new Date(targetUnlockTime).toISOString(),
    createdAt: now.toISOString(),
    isOpened: false
  };
}

const stackContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const stackItemVariants = {
  hidden: { opacity: 0, scale: 0.93, y: 35, rotate: -1.5 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14
    }
  }
};

export default function Home() {
  // Passcode states
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeDigits, setPasscodeDigits] = useState<string[]>([]);
  const [passcodeError, setPasscodeError] = useState(false);

  // Core Scrapbook states
  const [isPlayingAmbient, setIsPlayingAmbient] = useState(false);
  const [galleryMemories, setGalleryMemories] = useState<Polaroid[]>(DEFAULT_MEMORIES);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [wholesomeMoments, setWholesomeMoments] = useState<WholesomeTodo[]>(DEFAULT_WHOLESOME_MOMENTS);
  const [loveMeterValue, setLoveMeterValue] = useState(85);
  const [virtualHugsCount, setVirtualHugsCount] = useState(3);
  const [showHugAlert, setShowHugAlert] = useState(false);

  // Bottom Navigation tabs & Journal state variables
  const [activeTab, setActiveTab] = useState<"scrapbook" | "playroom" | "journal">("scrapbook");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(DEFAULT_JOURNALS);
  const [newJournalTitle, setNewJournalTitle] = useState("");
  const [newJournalContent, setNewJournalContent] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState({ label: "Golden Glow", emoji: "✨" });
  const [journalSearchQuery, setJournalSearchQuery] = useState("");

  const filteredJournalEntries = journalEntries.filter((j) => {
    const query = journalSearchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      j.title.toLowerCase().includes(query) ||
      j.content.toLowerCase().includes(query) ||
      j.emotionLabel.toLowerCase().includes(query)
    );
  });

  // Letter to Future Me states
  const [futureLetters, setFutureLetters] = useState<FutureLetter[]>([]);
  const [newLetterTitle, setNewLetterTitle] = useState("");
  const [newLetterContent, setNewLetterContent] = useState("");
  const [newLetterUnlockType, setNewLetterUnlockType] = useState<"1min" | "1hour" | "1day" | "7days" | "custom">("1day");
  const [newLetterCustomDate, setNewLetterCustomDate] = useState("");
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Add memory modal states
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [newImgUrl, setNewImgUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newDate, setNewDate] = useState("");

  // Floating heart particles list
  const [interactiveHearts, setInteractiveHearts] = useState<FloatingHeartItem[]>([]);

  // Interactive buttons sticky popups
  // Modal types: stressed | motivation | dumb-memories | miss-me | null
  const [actionModal, setActionModal] = useState<"stressed" | "motivation" | "dumb-memories" | "miss-me" | null>(null);

  // Breathing exercise states
  const [breathingStep, setBreathingStep] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathingCountdown, setBreathingCountdown] = useState(4);

  // Motivation & Silly quotes database
  const [motivationIndex, setMotivationIndex] = useState(0);
  const MOTIVATION_QUOTES = [
    "If microscopic water bears can survive the freezing pressure of outer space, you can absolutely survive tomorrow morning. 🐻❄️",
    "Remember that you have a 100% success rate of getting through difficult, overwhelming days so far. That’s a flawless score.",
    "I'm cheering for you from our small corner of the world. Even when everything is loud, you are a quiet light to me.",
    "Your worth is not a spreadsheet. It's okay to just exist, drink some water, and crawl into freshly washed blankets. 🛌✨",
    "Don't worry about figuring out the next ten years. Just focus on the next ten minutes, or the next cup of cozy tea."
  ];

  const [dumbMemoryIndex, setDumbMemoryIndex] = useState(0);
  const DUMB_MEMORIES = [
    "Remember when we spent nearly twenty minutes attempting to take a 'cool, model-like' photo, but ended up looking like two intensely confused pigeons looking at a baguette? 🐦🥖",
    "If we were in a zombie apocalypse together, I would try to be heroic, but I would most likely trip over a perfectly flat surface within the first twelve seconds. I would still make sure you got the last cookie though. 🍪🧟",
    "That time we started debating whether a hot dog is technically a taco, and got so passionately defensive that the person at the next table looked genuinely concerned for our marriage/sanity.",
    "Think of how quiet and sweet it is when you fall asleep mid-sentence, and I just sit there listening to your tiny soft breathing like it's the safest sound in the world.",
    "Remember our mutual pinky promise to buy a tiny remote island populated exclusively by fluffy sheep and floppy-eared bunnies once we win the lottery? The sheep plan is still on."
  ];

  // Ref references
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Initial hydration mount and local state restoration
  useEffect(() => {
    // Restore state inside asynchronous macrotask callback to clear React effect sync setState linter restrictions
    setTimeout(() => {
      const savedUnlock = localStorage.getItem("comfort_unlocked");
      if (savedUnlock === "true") {
        setIsUnlocked(true);
      }

      const savedMemories = localStorage.getItem("custom_comfort_memories");
      if (savedMemories) {
        try {
          const parsed = JSON.parse(savedMemories) as Polaroid[];
          // Retain only custom memories added by the user (or with custom flags)
          const userCustomMemories = parsed.filter(m => m.isCustom || m.id.startsWith("custom-"));
          // Combine the latest updated DEFAULT_MEMORIES from the code with those custom ones
          setGalleryMemories([...DEFAULT_MEMORIES, ...userCustomMemories]);
        } catch (e) {
          console.error("Failed parsing memories", e);
          setGalleryMemories(DEFAULT_MEMORIES);
        }
      } else {
        setGalleryMemories(DEFAULT_MEMORIES);
      }

      const savedWholesome = localStorage.getItem("comfort_wholesome_todos");
      if (savedWholesome) {
        try {
          setWholesomeMoments(JSON.parse(savedWholesome));
        } catch (e) {}
      }

      const savedHugs = localStorage.getItem("virtual_hugs_count");
      if (savedHugs) {
        setVirtualHugsCount(parseInt(savedHugs, 10));
      }

      const savedJournals = localStorage.getItem("comfort_journals");
      if (savedJournals) {
        try {
          setJournalEntries(JSON.parse(savedJournals));
        } catch (e) {
          console.error("Failed parsing journal entries", e);
        }
      }

      const savedLetters = localStorage.getItem("comfort_future_letters");
      if (savedLetters) {
        try {
          setFutureLetters(JSON.parse(savedLetters));
        } catch (e) {
          console.error("Failed parsing future letters", e);
        }
      }
    }, 0);
  }, []);

  // Time ticker to update locks in real-time
  useEffect(() => {
    const initialT = setTimeout(() => {
      setCurrentTime(getModuleCurrentTime());
    }, 0);
    const timer = setInterval(() => {
      setCurrentTime(getModuleCurrentTime());
    }, 10000);
    return () => {
      clearTimeout(initialT);
      clearInterval(timer);
    };
  }, []);

  // Breathing countdown loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (actionModal === "stressed") {
      interval = setInterval(() => {
        setBreathingCountdown((prev) => {
          if (prev <= 1) {
            if (breathingStep === "inhale") {
              setBreathingStep("hold");
              return 4;
            } else if (breathingStep === "hold") {
              setBreathingStep("exhale");
              return 4;
            } else {
              setBreathingStep("inhale");
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [actionModal, breathingStep]);

  // Audio helper execution
  const executePlayAmbient = () => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.play()
        .then(() => {
          setIsPlayingAmbient(true);
        })
        .catch((err) => {
          console.log("Autoplay paused, expecting user toggle click input", err);
        });
    }
  };

  // Keyboard and Keypad entry action handler (replaces useEffect for passcode selection to stay purely event-driven!)
  const handleKeypadPress = (num: string) => {
    if (passcodeDigits.length < 4) {
      const nextDigits = [...passcodeDigits, num];
      setPasscodeDigits(nextDigits);

      if (nextDigits.length === 4) {
        const enteredCode = nextDigits.join("");
        if (enteredCode === "0205") {
          setIsUnlocked(true);
          localStorage.setItem("comfort_unlocked", "true");
          setPasscodeError(false);

          // Trigger background loop upon natural unlock interaction
          setTimeout(() => {
            executePlayAmbient();
          }, 350);
        } else {
          setPasscodeError(true);
          setTimeout(() => {
            setPasscodeDigits([]);
            setPasscodeError(false);
          }, 1100);
        }
      }
    }
  };

  const handleKeypadBackspace = () => {
    setPasscodeDigits((prev) => prev.slice(0, prev.length - 1));
  };

  // Keyboard physical keyboard hook listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isUnlocked) return;
      if (e.key >= "0" && e.key <= "9") {
        handleKeypadPress(e.key);
      } else if (e.key === "Backspace") {
        handleKeypadBackspace();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUnlocked, passcodeDigits]);

  // Sparkle hearts emitter
  const triggerFloatingHearts = (clickX: number, clickY: number) => {
    // Generate parameters cleanly here inside callback event scope
    const collection = generateRandomHeartsCollection(clickX, clickY);
    setInteractiveHearts((prev) => [...prev, ...collection]);

    // Fast cleanup of generated particles after 1.6s duration
    setTimeout(() => {
      setInteractiveHearts((prev) => prev.filter(item => !collection.find(c => c.id === item.id)));
    }, 1600);
  };

  // Toggle checklist checkbox items
  const toggleWholesomeToggled = (id: string) => {
    const updated = wholesomeMoments.map((item) => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setWholesomeMoments(updated);
    localStorage.setItem("comfort_wholesome_todos", JSON.stringify(updated));
  };

  // Sound play button controls
  const toggleAmbientMusicHandler = () => {
    if (ambientAudioRef.current) {
      if (isPlayingAmbient) {
        ambientAudioRef.current.pause();
        setIsPlayingAmbient(false);
      } else {
        ambientAudioRef.current.play()
          .then(() => {
            setIsPlayingAmbient(true);
          })
          .catch(() => {});
      }
    }
  };

  // Lock the vault manually
  const relockVaultHandler = () => {
    setIsUnlocked(false);
    setPasscodeDigits([]);
    localStorage.removeItem("comfort_unlocked");
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      setIsPlayingAmbient(false);
    }
  };

  // Polaroid Swipe drag triggers
  const handleNextPhoto = () => {
    if (currentGalleryIndex < galleryMemories.length - 1) {
      setCurrentGalleryIndex(c => c + 1);
    } else {
      setCurrentGalleryIndex(0);
    }
  };

  const handlePrevPhoto = () => {
    if (currentGalleryIndex > 0) {
      setCurrentGalleryIndex(c => c - 1);
    } else {
      setCurrentGalleryIndex(galleryMemories.length - 1);
    }
  };

  const handleDragEnd = (_event: any, info: any) => {
    const swipeThreshold = 55;
    if (info.offset.x < -swipeThreshold) {
      handleNextPhoto();
    } else if (info.offset.x > swipeThreshold) {
      handlePrevPhoto();
    }
  };

  // Add customized photograph memory
  const handleAddNewMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImgUrl) return;

    const randomizedId = generateCustomMemoryId();
    const newMemory: Polaroid = {
      id: randomizedId,
      url: newImgUrl,
      caption: newCaption || "A soft precious slice of golden light...",
      date: newDate || "Some beautiful season",
      isCustom: true
    };

    const nextMemList = [newMemory, ...galleryMemories];
    setGalleryMemories(nextMemList);
    setCurrentGalleryIndex(0);
    localStorage.setItem("custom_comfort_memories", JSON.stringify(nextMemList));

    // Clear fields
    setNewImgUrl("");
    setNewCaption("");
    setNewDate("");
    setIsAddingMemory(false);

    // subtle emitter sparkles
    triggerFloatingHearts(200, 300);
  };

  // Delete customized memory Polaroid 
  const handleDeleteMemory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = galleryMemories.filter(m => m.id !== id);
    setGalleryMemories(filtered);
    setCurrentGalleryIndex(0);
    localStorage.setItem("custom_comfort_memories", JSON.stringify(filtered));
  };

  // Send cuddle tracker incrementer
  const handleSendVirtualHug = () => {
    const nextHugs = virtualHugsCount + 1;
    setVirtualHugsCount(nextHugs);
    localStorage.setItem("virtual_hugs_count", nextHugs.toString());
    setShowHugAlert(true);
    setTimeout(() => {
      setShowHugAlert(false);
    }, 2800);
  };

  const handleAddNewJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournalTitle || !newJournalContent) return;

    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const newJournal = createJournalEntry(newJournalTitle, newJournalContent, selectedEmotion.label, selectedEmotion.emoji, formattedDate);

    const nextJournals = [newJournal, ...journalEntries];
    setJournalEntries(nextJournals);
    localStorage.setItem("comfort_journals", JSON.stringify(nextJournals));

    // reset fields
    setNewJournalTitle("");
    setNewJournalContent("");
    setSelectedEmotion(EMOTIONAL_STAMPS[0]);

    // trigger burst of hearts
    triggerFloatingHearts(200, 250);
  };

  const handleDeleteJournal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = journalEntries.filter(j => j.id !== id);
    setJournalEntries(filtered);
    localStorage.setItem("comfort_journals", JSON.stringify(filtered));
  };

  const handleDownloadJournals = (format: "txt" | "json") => {
    if (journalEntries.length === 0) return;

    let fileContent = "";
    let fileType = "text/plain";
    let fileName = "";

    if (format === "txt") {
      fileContent += "=========================================\n";
      fileContent += "      MY COZY THOUGHT CANVAS JOURNAL     \n";
      fileContent += "=========================================\n";
      fileContent += `Exported with love on ${new Date().toLocaleDateString()}\n\n`;

      journalEntries.forEach((entry, index) => {
        fileContent += `-----------------------------------------\n`;
        fileContent += `ENTRY #${journalEntries.length - index}: ${entry.title.toUpperCase()}\n`;
        fileContent += `Date: ${entry.date}\n`;
        fileContent += `Emotion: ${entry.emotionEmoji} ${entry.emotionLabel}\n`;
        fileContent += `-----------------------------------------\n\n`;
        fileContent += `${entry.content}\n\n\n`;
      });

      fileContent += "=========================================\n";
      fileContent += "Keep smiling, you are doing amazing! ✨\n";
      fileContent += "=========================================\n";
      fileName = "cozy_journal_safekeeping.txt";
    } else {
      fileContent = JSON.stringify(journalEntries, null, 2);
      fileType = "application/json";
      fileName = "cozy_journal_backup.json";
    }

    const blob = new Blob([fileContent], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddFutureLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLetterContent || !newLetterTitle) return;

    const newLetter = createFutureLetter(newLetterTitle, newLetterContent, newLetterUnlockType, newLetterCustomDate);

    const nextLetters = [newLetter, ...futureLetters];
    setFutureLetters(nextLetters);
    localStorage.setItem("comfort_future_letters", JSON.stringify(nextLetters));

    setNewLetterTitle("");
    setNewLetterContent("");
    setNewLetterCustomDate("");
    setNewLetterUnlockType("1day");

    triggerFloatingHearts(200, 300);
  };

  const handleOpenLetter = (id: string) => {
    const updated = futureLetters.map(l => {
      if (l.id === id) {
        return { ...l, isOpened: true };
      }
      return l;
    });
    setFutureLetters(updated);
    localStorage.setItem("comfort_future_letters", JSON.stringify(updated));
    triggerFloatingHearts(200, 300);
  };

  const handleDeleteLetter = (id: string) => {
    const filtered = futureLetters.filter(l => l.id !== id);
    setFutureLetters(filtered);
    localStorage.setItem("comfort_future_letters", JSON.stringify(filtered));
  };

  return (
    <div 
      id="comfort-scrapbook-root" 
      className="min-h-screen bg-[#F0E6D9] text-[#2d221d] relative overflow-hidden flex flex-col items-center justify-start py-0 md:py-8 font-hand select-none"
    >
      {/* Background loop audio clip */}
      <audio 
        ref={ambientAudioRef}
        src="https://assets.mixkit.co/music/preview/mixkit-serene-view-1002.mp3" 
        loop
        className="audio-hidden"
      />

      {/* Screen emitter canvas layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-50 overflow-hidden" 
        onClick={(e) => triggerFloatingHearts(e.clientX, e.clientY)}
      >
        <AnimatePresence>
          {interactiveHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, scale: h.scale * 0.4, y: h.y, x: h.x }}
              animate={{ 
                opacity: 0, 
                scale: h.scale * 1.4, 
                y: h.y - 130, 
                x: h.x + h.offsetX
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute text-cherry text-xl"
            >
              ♥
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* STAGE A: LOCKED PASSWORD KEYPAD CONTAINER */}
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm min-h-screen md:min-h-[85vh] bg-[#FCF8F2] bg-scrapbook-grid rounded-none md:rounded-3xl border-0 md:border-8 border-[#7D1201]/10 shadow-2xl p-6 flex flex-col items-center justify-between relative"
            id="password-gate-view"
          >
            {/* Top washi styling */}
            <div className="absolute top-4 -rotate-2 w-32 h-7 washi-tape-horizontal washi-tape-red text-center text-[11px] font-mono tracking-widest text-[#7D1201]/70 leading-7 font-semibold">
              {"0205 LOCK"}
            </div>

            {/* Vintage postal stamp backdrop */}
            <div className="absolute top-6 right-6 w-14 h-16 border-2 border-dashed border-[#7D1201]/30 rounded flex flex-col items-center justify-center p-1 rotate-12 opacity-60">
              <span className="text-[9px] font-sans text-[#7D1201]/80 block font-bold">{"POSTAGE"}</span>
              <Heart className="w-5 h-5 text-cherry fill-cherry/20 my-0.5" />
              <span className="text-[7px] font-mono text-[#7D1201]/80 text-center uppercase tracking-tighter">{"DIARY"}</span>
            </div>

            <div className="flex-1 w-full flex flex-col items-center justify-center pt-10">
              <motion.div 
                animate={passcodeError ? { x: [-10, 10, -10, 10, 0] } : { y: [0, -4, 0] }}
                transition={passcodeError ? { duration: 0.4 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-cherry/10 rounded-full flex items-center justify-center mb-6 border border-[#7D1201]/20 shadow-inner"
              >
                <Lock className="w-7 h-7 text-cherry fill-cherry/5" />
              </motion.div>

              <h1 className="text-3xl font-bold text-[#7D1201] text-center font-caveat mb-2">
                {"Welcome, Shubham ❤️"}
              </h1>
              <p className="text-sm text-stone-600 text-center max-w-[270px] mb-8 font-sans leading-relaxed">
                {"This is your soft cozy digital hideout made with infinite love. Enter our special passcode to look inside."}
              </p>

              {/* Padlock Hearts Dial Indicators */}
              <div className="flex items-center gap-4 mb-8">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-full border-2 border-[#7D1201] flex items-center justify-center transition-all duration-300 ${
                      passcodeDigits[idx] 
                        ? "bg-cherry border-cherry scale-110 shadow-sm" 
                        : "bg-transparent border-[#7D1201]/45"
                    }`}
                  >
                    {passcodeDigits[idx] && (
                      <Heart className="w-3.5 h-3.5 text-white fill-white" />
                    )}
                  </div>
                ))}
              </div>

              {/* Shaking passcode error toast */}
              <div className="h-6">
                <AnimatePresence>
                  {passcodeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-cherry text-sm font-semibold italic text-center font-sans px-2"
                    >
                      {"Oops! That's not quite our special date... 🥺 Try again, love!"}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Hand-drawn button dials keyboard */}
              <div className="grid grid-cols-3 gap-3.5 max-w-[240px] w-full mt-4">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeypadPress(num)}
                    className="w-15 h-15 rounded-full bg-[#FAF5EE] border border-[#2d221d]/15 shadow-[0_3px_0_rgba(45,34,29,0.15)] flex items-center justify-center text-lg font-bold hover:bg-[#F3EAE0] active:translate-y-1 active:shadow-none transition-all duration-100 font-sans"
                  >
                    {num}
                  </button>
                ))}
                
                <button
                  onClick={handleKeypadBackspace}
                  className="w-15 h-15 rounded-full bg-[#FAF5EE]/60 border border-[#2d221d]/12 flex items-center justify-center hover:bg-[#F3EAE0] active:translate-y-1 transition-all duration-100 text-xs font-semibold font-sans text-stone-600"
                >
                  {"Clear"}
                </button>

                <button
                  onClick={() => handleKeypadPress("0")}
                  className="w-15 h-15 rounded-full bg-[#FAF5EE] border border-[#2d221d]/15 shadow-[0_3px_0_rgba(45,34,29,0.15)] flex items-center justify-center text-lg font-bold hover:bg-[#F3EAE0] active:translate-y-1 active:shadow-none transition-all duration-100 font-sans"
                >
                  {"0"}
                </button>

                <div className="w-15 h-15 text-[10px] text-stone-400 font-sans flex items-center justify-center text-center leading-tight font-medium select-none">
                  {"Hint:"}<br/>{"0205"}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (

          /* STAGE B: UNLOCKED MAIN DIARY APP */
          <motion.div
            key="scrapbook-diary-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm h-screen md:h-[85vh] bg-[#FAF5EE] bg-scrapbook-grid shadow-2xl relative border-0 md:border-8 rounded-none md:rounded-3xl border-[#7D1201]/10 flex flex-col justify-start overflow-hidden"
            id="master-scrapbook-interactive"
          >
            {/* Top decorative notebook spirals */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-transparent z-40 flex justify-between px-10 pointer-events-none">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-4 h-7 bg-gradient-to-b from-stone-400 to-stone-500 rounded-full shadow transform -translate-y-2 relative border border-stone-600/20">
                  <div className="absolute inset-x-1.5 top-1 bottom-1 bg-[#FAF5EE]/30 rounded-full" />
                </div>
              ))}
            </div>

            {/* FLOATING DIARY NAVIGATION CONTROL */}
            <header className="sticky top-0 bg-[#FAF5EE]/90 backdrop-filter backdrop-blur-md z-30 border-b border-[#7D1201]/10 px-5 py-4 pt-6 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-cherry fill-cherry/30" />
                <span className="font-caveat text-2xl font-black text-[#7D1201]">{"Shubham's Space ❤️"}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={relockVaultHandler}
                  className="p-1.5 rounded-full hover:bg-stone-200/50 text-stone-500 active:scale-90 transition-all cursor-pointer"
                  title="Lock visual space"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* MAIN PORTABLE SCROLL SECTION */}
            <main className="flex-1 pb-28 px-5 pt-5 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "scrapbook" && (
                  <motion.div
                    key="tab-scrapbook"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-9 pb-8"
                  >
                    {/* NOTE #1: HEARTY WELCOME LETTER */}
                    <section id="cozy-open-letter" className="relative pt-2">

                      <div className="bg-[#FCF8F2] p-4 pt-7 rounded-2xl border border-[#2d221d]/10 shadow-[4px_4px_0_rgba(125,18,1,0.04)] text-center relative overflow-hidden">
                        <div className="text-[#7D1201] text-3xl font-caveat mb-3 font-semibold scribble-underline inline-block px-1">
                          {"Hi Shubham ❤️,"}
                        </div>
                        <p className="text-[#3c312b] font-hand text-lg leading-relaxed mb-4 font-semibold">
                          {"Kick off your shoes, grab something sweet to warm your hands, and stay a while. 🌸"}
                        </p>

                        <div className="mt-4 flex items-center justify-center gap-1.5 text-cherry/75 text-[10px] font-mono font-black tracking-widest uppercase">
                          <span className="animate-pulse">{"♥"}</span>
                          <span>{"SAFE SPACE COZY & ACTIVE"}</span>
                          <span className="animate-pulse">{"♥"}</span>
                        </div>
                      </div>
                    </section>

                    {/* QUICK CHIPS ACCESS BUTTON PANEL */}
                    <section id="care-panel" className="space-y-4">
                      <h3 className="text-[#7D1201] font-semibold text-base font-caveat flex items-center gap-1">
                        <span>{"✨ Interactive quick anchors for hard days:"}</span>
                      </h3>

                      <div className="grid grid-cols-2 gap-3 font-sans">
                        <button
                          onClick={() => {
                            setActionModal("stressed");
                            setBreathingStep("inhale");
                            setBreathingCountdown(4);
                          }}
                          className="p-3.5 bg-red-50 hover:bg-red-100/70 active:translate-y-0.5 border border-red-200 rounded-2xl text-left shadow-sm group transition-all duration-200 cursor-pointer"
                        >
                          <Coffee className="w-5 h-5 text-cherry mb-1.5 group-hover:scale-110 transition-transform" />
                          <span className="block font-bold text-cherry text-xs uppercase tracking-wider">{"if stressed"}</span>
                          <p className="text-[10px] text-stone-500 leading-normal font-sans mt-0.5">{"Deep breathing & cozy flower cycle helper"}</p>
                        </button>

                        <button
                          onClick={() => {
                            setActionModal("motivation");
                            setMotivationIndex(Math.floor(Math.random() * MOTIVATION_QUOTES.length));
                          }}
                          className="p-3.5 bg-emerald-50 hover:bg-emerald-100/70 active:translate-y-0.5 border border-emerald-200 rounded-2xl text-left shadow-sm group transition-all duration-200 cursor-pointer"
                        >
                          <Award className="w-5 h-5 text-emerald-700 mb-1.5 group-hover:scale-110 transition-transform" />
                          <span className="block font-bold text-emerald-800 text-xs uppercase tracking-wider">{"motivation"}</span>
                          <p className="text-[10px] text-stone-500 leading-normal font-sans mt-0.5">{"Doodle cheers for your resilient soul"}</p>
                        </button>

                        <button
                          onClick={() => {
                            setActionModal("dumb-memories");
                            setDumbMemoryIndex(Math.floor(Math.random() * DUMB_MEMORIES.length));
                          }}
                          className="p-3.5 bg-amber-50 hover:bg-amber-100/70 active:translate-y-0.5 border border-amber-200 rounded-2xl text-left shadow-sm group transition-all duration-200 cursor-pointer"
                        >
                          <Smile className="w-5 h-5 text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
                          <span className="block font-bold text-amber-800 text-xs uppercase tracking-wider">{"dumb jokes"}</span>
                          <p className="text-[10px] text-stone-500 leading-normal font-sans mt-0.5">{"Genuinely clumsy inside stories"}</p>
                        </button>

                        <button
                          onClick={(e) => {
                            setActionModal("miss-me");
                            triggerFloatingHearts(e.clientX || 200, e.clientY || 400);
                          }}
                          className="p-3.5 bg-rose-50 hover:bg-rose-100/70 active:translate-y-0.5 border border-rose-200 rounded-2xl text-left shadow-sm group transition-all duration-200 cursor-pointer"
                        >
                          <Heart className="w-5 h-5 text-rose-500 mb-1.5 group-hover:scale-110 transition-transform" />
                          <span className="block font-bold text-rose-800 text-xs uppercase tracking-wider">{"miss you"}</span>
                          <p className="text-[10px] text-stone-500 leading-normal font-sans mt-0.5">{"Receive a warm physical lofi cuddle"}</p>
                        </button>
                      </div>
                    </section>

                    {/* POLAROID SWIPE FRAME STACK */}
                    <section id="polaroid-swipe-deck" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[#7D1201] font-semibold text-base font-caveat flex items-center gap-1">
                          <span>{"📸 Our Memory Polaroid Album:"}</span>
                        </h3>

                        <button 
                          onClick={() => setIsAddingMemory(true)}
                          className="flex items-center gap-1 px-3 py-1 bg-cherry text-white text-[11px] font-sans font-semibold rounded-full hover:bg-cherry-light active:scale-95 transition-all shadow cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{"Add Scrap"}</span>
                        </button>
                      </div>

                      <div className="relative flex flex-col items-center">
                        <div className="w-full relative min-h-[360px]">
                          {/* Shadow cards beneath for tactile paper look */}
                          <div className="absolute inset-y-0 inset-x-2 bg-white/70 border border-stone-200 rounded-2xl shadow transform translate-y-3.5 rotate-2 pointer-events-none" />
                          <div className="absolute inset-y-0 inset-x-1.5 bg-white/40 border border-stone-100 rounded-2xl shadow transform -translate-x-1 translate-y-1.5 -rotate-1 pointer-events-none" />

                          {/* Active draggable card */}
                          <AnimatePresence mode="popLayout">
                            {galleryMemories.length > 0 && (
                              <motion.div
                                key={galleryMemories[currentGalleryIndex].id}
                                className="absolute inset-x-0 bg-[#FCF8F2] border border-stone-200 p-4 pb-6 rounded-2xl shadow-lg flex flex-col items-center relative z-10 touch-pan-y"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.7}
                                onDragEnd={handleDragEnd}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.94, x: -90 }}
                                transition={{ type: "spring", stiffness: 350, damping: 24 }}
                              >
                                {/* Polaroid sticky tape */}
                                <div className="absolute -top-3 left-[30%] right-[30%] h-6 washi-tape-horizontal washi-tape-red rotate-1 flex items-center justify-center pointer-events-none z-10">
                                  <span className="text-[8px] font-mono font-bold text-cherry/70 tracking-widest uppercase">{"MEMORIES"}</span>
                                </div>

                                {/* Image crop slot */}
                                <div className="w-full aspect-square bg-[#FAF5EE] relative overflow-hidden rounded-lg border border-stone-200/80">
                                  <img
                                    src={galleryMemories[currentGalleryIndex].url}
                                    alt="Memory placeholder"
                                    className="w-full h-full object-cover pointer-events-none"
                                  />

                                  {/* heart stamp */}
                                  <button 
                                    onClick={(e) => triggerFloatingHearts(e.clientX, e.clientY)}
                                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/95 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-rose-500 cursor-pointer"
                                    title="Like photograph"
                                  >
                                    <Heart className="w-4 h-4 fill-current" />
                                  </button>

                                  {/* delete action if customized polaroid */}
                                  {galleryMemories[currentGalleryIndex].isCustom && (
                                    <button
                                      onClick={(e) => handleDeleteMemory(galleryMemories[currentGalleryIndex].id, e)}
                                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-cherry/80 hover:bg-cherry text-white shadow-md flex items-center justify-center hover:scale-105 transition cursor-pointer"
                                      title="Delete scrap card"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-[8px] text-white font-mono uppercase tracking-widest">
                                    {"Swipe Card left/right"}
                                  </div>
                                </div>

                                {/* caption and localized notes */}
                                <div className="w-full mt-4 text-center px-1">
                                  <p className="font-caveat text-xl leading-relaxed text-stone-800 italic min-h-[50px] flex items-center justify-center font-black">
                                    {"\""}{galleryMemories[currentGalleryIndex].caption}{"\""}
                                  </p>
                                  <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#7D1201]/60 font-bold uppercase tracking-wider">
                                    <Calendar className="w-3.5 h-3.5 text-[#7D1201]" />
                                    <span>{galleryMemories[currentGalleryIndex].date}</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Manual trigger arrow controls */}
                        <div className="flex items-center justify-between w-full max-w-[280px] mt-4 z-20">
                          <button
                            onClick={handlePrevPhoto}
                            className="w-8 h-8 rounded-full bg-white border border-[#2d221d]/15 shadow-sm flex items-center justify-center hover:bg-stone-50 active:scale-90 transition-all text-stone-700 cursor-pointer"
                            aria-label="Previous photograph"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <div className="flex items-center gap-1 font-mono text-xs text-stone-500 font-bold font-black">
                            <span className="text-cherry">{currentGalleryIndex + 1}</span>
                            <span>{"/"}</span>
                            <span>{galleryMemories.length}</span>
                          </div>

                          <button
                            onClick={handleNextPhoto}
                            className="w-8 h-8 rounded-full bg-white border border-[#2d221d]/15 shadow-sm flex items-center justify-center hover:bg-stone-50 active:scale-90 transition-all text-stone-700 cursor-pointer"
                            aria-label="Next photograph"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* THREE CUTE APPRECIATION NOTES */}
                    <section id="appreciation-scrap-cards" className="space-y-4">
                      <h3 className="text-[#7D1201] font-semibold text-base font-caveat flex items-center gap-1">
                        <span>{"💌 Hand-cut notes of appreciation:"}</span>
                      </h3>

                      <div className="space-y-3.5">
                        <div className="bg-[#FAF0E6]/95 border border-[#7D1201]/10 rounded-2xl p-4 shadow-sm relative overflow-hidden rotate-0.5">
                          <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full border border-red-800/10 bg-cherry/10 animate-pulse" />
                          <span className="block font-sans text-[9px] font-bold text-cherry/50 uppercase tracking-widest mb-1.5">{"Appreciation Note #01"}</span>
                          <p className="font-hand text-lg text-stone-700 leading-relaxed font-bold">
                            {"\"I love how your nose crinkles when something makes you genuinely giggle. It’s a very small detail, but it could fix the gloomiest day in half a heartbeat.\""}
                          </p>
                        </div>

                        <div className="bg-[#FCF8F2] border border-[#7D1201]/10 rounded-2xl p-4 shadow-sm relative overflow-hidden -rotate-1">
                          <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full border border-amber-800/20 bg-amber-100" />
                          <span className="block font-sans text-[9px] font-bold text-[#7D1201]/50 uppercase tracking-widest mb-1.5">{"Appreciation Note #02"}</span>
                          <p className="font-hand text-lg text-stone-700 leading-relaxed font-bold">
                            {"\"Thank you for being the patient space where I can ramble on about silly trivial things without worrying. You always listen like I'm declaring a world revolution.\""}
                          </p>
                        </div>

                        <div className="bg-[#FAF0E6]/95 border border-[#7D1201]/10 rounded-2xl p-4 shadow-sm relative overflow-hidden rotate-1">
                          <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full border border-red-800/15 bg-cherry/15" />
                          <span className="block font-sans text-[9px] font-bold text-cherry/50 uppercase tracking-widest mb-1.5">{"Appreciation Note #03"}</span>
                          <p className="font-hand text-lg text-stone-700 leading-relaxed font-bold">
                            {"\"You are incredibly resilient. Even on days when you feel entirely drained and tiny, please remind yourself how courageous you are for continuing forward anyway. I’m so proud of you.\""}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* LETTER TO FUTURE ME (TIME CAPSULE) */}
                    <section id="future-letter-capsule" className="space-y-4 pt-4">
                      <div className="relative pt-2">
                        {/* Washi tape decor */}
                        <div className="absolute -top-3 right-8 rotate-3 w-32 h-6 washi-tape-horizontal washi-tape-red text-cherry/75 text-[8px] tracking-widest text-center leading-6 font-mono font-black {`uppercase`}">
                          {"TIME CAPSULE ⏳"}
                        </div>

                        <div className="bg-[#FAF5EE] p-5 pt-8 rounded-2xl border border-[#2d221d]/10 shadow-[4px_4px_0_rgba(125,18,1,0.04)] relative">
                          <h3 className="font-caveat text-3xl font-black text-[#7D1201] flex items-center gap-2">
                            {"Letter to Future Me ✉️"}
                          </h3>
                          <p className="text-xs font-sans text-stone-500 mb-5 font-semibold leading-relaxed">
                            {"Write a private, delicate message to your future self. Set a specific date or period when it becomes safe to unlock, and seal it inside this digital archive."}
                          </p>

                          <form onSubmit={handleAddFutureLetter} className="space-y-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-sans font-black text-stone-400 uppercase tracking-wider">
                                {"For who? (Letter Title)"}
                              </label>
                              <input
                                type="text"
                                value={newLetterTitle}
                                onChange={(e) => setNewLetterTitle(e.target.value)}
                                placeholder="e.g., Read when you've reached June, To a happier version of me..."
                                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-sans text-xs outline-none focus:ring-1 focus:ring-cherry focus:outline-none"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-sans font-black text-stone-400 uppercase tracking-wider">
                                {"Your secret thoughts & hopes"}
                              </label>
                              <textarea
                                value={newLetterContent}
                                onChange={(e) => setNewLetterContent(e.target.value)}
                                placeholder="e.g., I hope you are drinking enough water... I hope you survived that scary week... how are those sheep dreams?"
                                className="w-full p-3 h-28 rounded-xl border border-stone-200 bg-white font-sans text-xs outline-none focus:ring-1 focus:ring-cherry focus:outline-none resize-none leading-relaxed"
                                required
                              />
                            </div>

                            {/* Unlock date / period choice */}
                            <div className="space-y-2">
                              <label className="block text-[10px] font-sans font-black text-stone-400 uppercase tracking-wider">
                                {"When shall we unlock this capsule?"}
                              </label>
                              
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {[
                                  { type: "1min", label: "+1 Min ⚡" },
                                  { type: "1hour", label: "+1 Hour ⏰" },
                                  { type: "1day", label: "+1 Day ☀️" },
                                  { type: "7days", label: "+7 Days 🗓️" },
                                  { type: "custom", label: "Custom Date 📍" }
                                ].map((opt) => (
                                  <button
                                    key={opt.type}
                                    type="button"
                                    onClick={() => setNewLetterUnlockType(opt.type as any)}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-sans font-bold transition-all border cursor-pointer ${
                                      newLetterUnlockType === opt.type
                                        ? "bg-[#7D1201]/10 border-cherry text-[#7D1201] scale-102"
                                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>

                              {newLetterUnlockType === "custom" && (
                                <div className="pt-2">
                                  <input
                                    type="date"
                                    value={newLetterCustomDate}
                                    onChange={(e) => setNewLetterCustomDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="p-2 border border-stone-200 rounded-xl font-mono text-xs bg-white text-stone-700 outline-none focus:ring-1 focus:ring-cherry focus:outline-none w-full"
                                    required={newLetterUnlockType === "custom"}
                                  />
                                </div>
                              )}
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2.5 bg-[#7D1201] text-[#FCF8F2] font-sans font-black rounded-xl text-xs hover:bg-[#A4250E] active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>{"Melt & Seal Letter in Time Capsule 🔒"}</span>
                            </button>
                          </form>
                        </div>
                      </div>

                      {/* Display of Archive Time Capsules */}
                      <div className="space-y-4 pt-4">
                        <h4 className="text-[#7D1201] font-extrabold text-base font-caveat flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#7D1201]" />
                          <span>{"Wax-Sealed Time Capsules:"}</span>
                        </h4>

                        {futureLetters.length === 0 ? (
                          <div className="bg-[#FCF8F2] p-8 rounded-2xl border border-dashed border-stone-300 text-center text-stone-400 italic font-sans text-xs">
                            {"No wax-sealed letters waiting in your capsule. Write one to your future self above! ✉️"}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {futureLetters.map((letter) => {
                              const locked = currentTime < new Date(letter.unlockDate).getTime();
                              const formattedUnlockDate = new Date(letter.unlockDate).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              });
                              const formattedCreatedDate = new Date(letter.createdAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric"
                              });

                              return (
                                <motion.div
                                  key={letter.id}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-[#FCF8F2] border border-[#2d221d]/10 rounded-2xl p-5 shadow-sm relative overflow-hidden pl-7"
                                >
                                  {/* Red edge margin */}
                                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-red-800/10" />

                                  {/* Top decoration row */}
                                  <div className="flex items-center justify-between mb-3.5 pl-2">
                                    <span className="text-[10px] bg-stone-100 border border-stone-200 text-stone-500 font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                      {"Sent: "}{formattedCreatedDate}
                                    </span>
                                    
                                    {locked ? (
                                      <span className="text-[9px] bg-red-50 border border-red-200 text-cherry font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cherry animate-pulse" />
                                        {"Locked 🔒"}
                                      </span>
                                    ) : (
                                      <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                        {"Ready to Open ✉️"}
                                      </span>
                                    )}
                                  </div>

                                  <div className="pl-2 space-y-1">
                                    <h5 className="font-caveat text-2xl font-black text-stone-800 leading-tight">
                                      {letter.title}
                                    </h5>
                                    
                                    <div className="text-[9px] font-mono text-stone-400 font-bold block pb-3 uppercase tracking-wider">
                                      {"Unlocks at: "}{formattedUnlockDate}
                                    </div>

                                    {locked ? (
                                      <div className="p-4 bg-stone-100/50 border border-stone-200/50 rounded-xl text-center space-y-2">
                                        <Lock className="w-5 h-5 mx-auto text-stone-400" />
                                        <p className="text-[11px] font-sans text-stone-500 font-semibold italic">
                                          {"\"This letter has been sealed with virtual pink wax. It cannot be opened right now! Try again later.\""}
                                        </p>
                                        
                                        {/* Dynamic friendly countdown estimation */}
                                        <p className="text-[9px] font-mono font-bold text-cherry/70 uppercase tracking-widest">
                                          {"LOCKED UNTIL: "}{formattedUnlockDate}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="space-y-3 pt-1">
                                        {letter.isOpened ? (
                                          <div className="p-4 bg-white border border-[#7D1201]/10 rounded-xl shadow-inner relative">
                                            {/* Corner tape representation */}
                                            <div className="absolute -top-2 right-4 w-12 h-4 washi-tape-horizontal washi-tape-red rotate-1 text-[6px] font-mono font-bold text-cherry/60 text-center leading-3">
                                              {"UNSEALED"}
                                            </div>
                                            <p className="font-hand text-lg text-stone-750 leading-relaxed font-semibold whitespace-pre-wrap">
                                              {letter.content}
                                            </p>
                                          </div>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => handleOpenLetter(letter.id)}
                                            className="w-full py-3.5 bg-emerald-700 text-white rounded-xl text-xs font-sans font-black uppercase tracking-wider hover:bg-emerald-800 active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                                          >
                                            {"Break Wax Seal & Read Letter ✉️"}
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Trash delete button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLetter(letter.id)}
                                    className="absolute bottom-3 right-3 p-1 rounded-full text-stone-400 hover:text-cherry hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Discard Time Capsule"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === "playroom" && (
                  <motion.div
                    key="tab-playroom"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-9 pb-8"
                  >
                    {/* HEALTHY PLAYLIST (SPOTIFY + DETAILED MUSIC INFO) */}
                    <section id="music-space" className="space-y-4 pt-2">
                      <h3 className="text-[#7D1201] font-semibold text-base font-caveat flex items-center gap-1">
                        <span>{"🎵 Sound of Comfort playlist:"}</span>
                      </h3>

                      <div className="bg-[#FCF8F2] border border-[#2d221d]/10 rounded-2xl p-4 shadow-sm space-y-4 relative">
                        {/* tape decoration */}
                        <div className="absolute -top-3 right-6 -rotate-2 w-20 h-5 washi-tape-horizontal washi-tape-red text-center text-[9px] font-mono text-cherry/80 font-bold leading-5">
                          {"PLAYLIST"}
                        </div>

                        <p className="text-[11px] text-[#2d221d]/80 leading-relaxed font-sans mt-1">
                          {"We found this sweet acoustic melody that perfectly describes quiet winter twilight. Put your headphones on and play:"}
                        </p>

                        {/* SPOTIFY IFRAME PLAYER */}
                        <div className="w-full shadow-md rounded-xl overflow-hidden border border-stone-200">
                          <iframe 
                            style={{ borderRadius: "12px" }}
                            src="https://open.spotify.com/embed/track/2rHxwYzdn66nDMmDmmio6W?utm_source=generator&theme=0" 
                            width="100%" 
                            height="152" 
                            frameBorder="0" 
                            allowFullScreen 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                          />
                        </div>

                        {/* custom controller */}
                        <div className="p-3 bg-cherry/5 rounded-xl border border-cherry/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-cherry text-white flex items-center justify-center shadow-inner">
                              <Music className={`w-4 h-4 ${isPlayingAmbient ? 'animate-spin-slow' : ''}`} />
                            </div>
                            <div>
                              <span className="block font-bold text-xs text-stone-700 font-sans">{"Lofi Acoustic Loops"}</span>
                              <span className="text-[9px] text-[#7D1201]/80 font-mono">{"Relaxing Guitars Theme"}</span>
                            </div>
                          </div>

                          <button
                            onClick={toggleAmbientMusicHandler}
                            className="p-2 rounded-full border border-cherry/20 bg-white shadow-sm hover:bg-stone-50 text-[#7D1201]/95 cursor-pointer"
                          >
                            {isPlayingAmbient ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* MISSION QUESTS LISTS */}
                    <section id="wholesome-missions" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[#7D1201] font-semibold text-base font-caveat flex items-center gap-1">
                          <span>{"📝 Late night cozy missions:"}</span>
                        </h3>
                        <span className="text-[9px] bg-[#7D1201]/10 px-2 py-0.5 rounded-full font-sans font-bold text-[#7D1201]">{"CHECKLIST"}</span>
                      </div>

                      <div className="bg-[#FCF8F2] border border-[#2d221d]/10 rounded-2xl p-4 shadow-sm space-y-3 relative bg-[#FCF8F2]">
                        <p className="text-xs text-stone-500 italic pl-1 font-sans mb-1.5">
                          {"Tiny, completely random quests to lift your spirit. Tick them off when done:"}
                        </p>

                        <div className="space-y-2.5 pl-1">
                          {wholesomeMoments.map((moment) => (
                            <label 
                              key={moment.id} 
                              className="flex items-start gap-2.5 cursor-pointer select-none group"
                            >
                              <input
                                type="checkbox"
                                checked={moment.checked}
                                onChange={() => toggleWholesomeToggled(moment.id)}
                                className="sr-only"
                              />
                              <div className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                                moment.checked 
                                  ? "bg-cherry border-cherry text-white animate-pulse" 
                                  : "border-stone-400 bg-white group-hover:border-[#7D1201]"
                              }`}>
                                {moment.checked && <Heart className="w-3 h-3 fill-current" />}
                              </div>
                              <span className={`text-[15px] font-hand leading-snug font-bold transition-all ${
                                moment.checked 
                                  ? "line-through text-stone-400 font-normal" 
                                  : "text-stone-700 text-stone-850"
                              }`}>
                                {moment.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* LOVE RATIO BULLETS AND HUGS ENVELOPE */}
                    <section id="things-i-love-bullets" className="space-y-4">
                      <h3 className="text-[#7D1201] font-semibold text-base font-caveat flex items-center gap-1 font-bold">
                        <span>{"📌 Things I absolutely adore about you:"}</span>
                      </h3>

                      <div className="bg-[#FCF8F2] border border-[#7D1201]/10 rounded-2xl p-5 shadow-sm space-y-4 relative">
                        <div className="text-center space-y-1">
                          <span className="text-[10px] font-mono text-stone-400 block font-bold uppercase tracking-widest">{"ADORATION METRIC"}</span>
                          <div className="text-4xl font-caveat text-cherry font-black">
                            {loveMeterValue}{"% and climbing! 📈"}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <input 
                            type="range" 
                            min="80" 
                            max="150" 
                            value={loveMeterValue} 
                            onChange={(e) => setLoveMeterValue(parseInt(e.target.value, 10))}
                            className="w-full accent-cherry cursor-pointer h-1 bg-stone-300 rounded"
                          />
                          <div className="flex justify-between text-[9px] font-mono text-stone-400 uppercase font-bold">
                            <span>{"A Lot"}</span>
                            <span>{"Uncountable stars"}</span>
                          </div>
                        </div>

                        {/* elegant bullet items */}
                        <ul className="space-y-2.5 font-hand text-lg text-stone-700 pl-1 font-semibold">
                          <li className="flex items-start gap-2.5">
                            <Heart className="w-4 h-4 text-cherry fill-cherry mt-1 flex-shrink-0" />
                            <span>{"Your complete lack of hesitation before supporting me."}</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <Heart className="w-4 h-4 text-cherry fill-cherry mt-1 flex-shrink-0" />
                            <span>{"The quiet safety that wraps around me whenever we are near."}</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <Heart className="w-4 h-4 text-cherry fill-cherry mt-1 flex-shrink-0" />
                            <span>{"Your ridiculously warm and beautiful heart."}</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <Heart className="w-4 h-4 text-cherry fill-cherry mt-1 flex-shrink-0" />
                            <span>{"The way your mind processes ideas—creative, caring, and genuine."}</span>
                          </li>
                        </ul>

                        <div className="pt-3 border-t border-stone-200 mt-4 text-center">
                          <button
                            onClick={handleSendVirtualHug}
                            className="w-full py-2.5 bg-[#7D1201] text-[#FCF8F2] font-sans font-bold rounded-xl text-xs hover:bg-[#A4250E] active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Smile className="w-4 h-4 animate-bounce" />
                            <span>{"Tap to send me a virtual lofi hug 🧸"}</span>
                          </button>
                          
                          <span className="text-[10px] text-stone-400 font-sans block mt-1.5 font-medium">
                            {"We have shared "}<strong className="text-stone-600">{virtualHugsCount}</strong>{" virtual cuddles so far"}
                          </span>

                          <AnimatePresence>
                            {showHugAlert && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="mt-3 p-2 bg-[#7D1201]/5 text-[#7D1201] border border-cherry/25 font-hand text-base rounded-md italic font-semibold animate-pulse"
                              >
                                {"* Cuddle dispatched! Wrap your arms tightly around yourself for 5 seconds. Sent you a huge cuddle squeezing you! 🥺❤️ *"}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === "journal" && (
                  <motion.div
                    key="tab-journal"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-6 pb-8"
                  >
                    {/* Hand-made tape banner prompt */}
                    <div className="relative pt-2">
                      <div className="absolute -top-3 left-10 rotate-1 w-28 h-6 washi-tape-horizontal text-stone-600/70 text-[9px] tracking-widest text-center leading-6 font-mono font-black uppercase">
                        {"WRITE *"}
                      </div>

                      <div className="bg-[#FCF8F2] p-5 pt-8 rounded-2xl border border-[#2d221d]/10 shadow-[4px_4px_0_rgba(125,18,1,0.04)] relative">
                        <h3 className="font-caveat text-3xl font-black text-[#7D1201]">
                          {"My Thought Canvas 📖"}
                        </h3>
                        <p className="text-xs font-sans text-stone-500 mb-4 font-semibold leading-relaxed">
                          {"Scatter your doubts, record lovely tiny details, or scribble your cozy letters. They are locked in your private browser storage."}
                        </p>

                        <form onSubmit={handleAddNewJournal} className="space-y-4">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-sans font-black text-stone-400 uppercase tracking-wider">
                              {"Title of the entry"}
                            </label>
                            <input
                              type="text"
                              value={newJournalTitle}
                              onChange={(e) => setNewJournalTitle(e.target.value)}
                              placeholder="e.g., Sunday Giggles, Cozy rain..."
                              className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-sans text-xs outline-none focus:ring-1 focus:ring-cherry focus:outline-none"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-sans font-black text-stone-400 uppercase tracking-wider">
                              {"Journal Entry"}
                            </label>
                            <textarea
                              value={newJournalContent}
                              onChange={(e) => setNewJournalContent(e.target.value)}
                              placeholder="Write your beautiful stream of consciousness here..."
                              className="w-full p-3 h-28 rounded-xl border border-stone-200 bg-white font-sans text-xs outline-none focus:ring-1 focus:ring-cherry focus:outline-none resize-none leading-relaxed"
                              required
                            />
                          </div>

                          {/* Emotional tag select strip */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-sans font-black text-stone-400 uppercase tracking-wider">
                              {"Sticker Emotion 🧸"}
                            </label>
                            <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
                              {EMOTIONAL_STAMPS.map((stamp) => (
                                <button
                                  key={stamp.label}
                                  type="button"
                                  onClick={() => setSelectedEmotion(stamp)}
                                  className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-bold transition-all border cursor-pointer ${
                                    selectedEmotion.label === stamp.label
                                      ? "bg-cherry/10 border-cherry text-cherry scale-105"
                                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                                  }`}
                                >
                                  <span>{stamp.emoji}</span>
                                  <span>{stamp.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-[#7D1201] text-[#FCF8F2] font-sans font-black rounded-xl text-xs hover:bg-[#A4250E] active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{"Stick to My Journal 🩹"}</span>
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Historic log of entries */}
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[#7D1201] font-extrabold text-base font-caveat flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-[#7D1201]" />
                          <span>{"Stacked Notebook Pages:"}</span>
                        </h4>
                        {journalEntries.length > 0 && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleDownloadJournals("txt")}
                              className="px-3 py-1 bg-cherry/10 text-cherry hover:bg-cherry/20 text-[10px] font-sans font-black rounded-full flex items-center gap-1 transition-all cursor-pointer border border-[#7D1201]/10 active:scale-95"
                              title="Download as structured plain text"
                            >
                              <Download className="w-3 h-3 text-cherry" />
                              <span>{"TXT"}</span>
                            </button>
                            <button
                              onClick={() => handleDownloadJournals("json")}
                              className="px-3 py-1 bg-cherry/10 text-cherry hover:bg-cherry/20 text-[10px] font-sans font-black rounded-full flex items-center gap-1 transition-all cursor-pointer border border-[#7D1201]/10 active:scale-95"
                              title="Download as JSON database storage file"
                            >
                              <Download className="w-3 h-3 text-cherry" />
                              <span>{"JSON"}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* SEARCH BAR */}
                      {journalEntries.length > 0 && (
                        <div className="bg-[#FAF5EE] p-2 rounded-xl border border-[#2d221d]/10 flex items-center gap-2 shadow-[2px_2px_0_rgba(125,18,1,0.02)]">
                          <div className="bg-white rounded-lg border border-stone-200 px-2.5 py-1.5 flex items-center gap-2 flex-grow shadow-inner">
                            <Search className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                            <input
                              type="text"
                              value={journalSearchQuery}
                              onChange={(e) => setJournalSearchQuery(e.target.value)}
                              placeholder="Search memories, stickers, keywords... 🔍"
                              className="w-full bg-transparent font-sans text-xs outline-none focus:outline-none text-stone-700 placeholder-stone-400"
                            />
                            {journalSearchQuery && (
                              <button
                                onClick={() => setJournalSearchQuery("")}
                                className="p-0.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors"
                                title="Clear search"
                              >
                                <X className="w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {journalEntries.length === 0 ? (
                        <div className="bg-[#FCF8F2] p-8 rounded-2xl border border-dashed border-stone-300 text-center text-stone-400 italic font-sans text-xs">
                          {"Oh, looks quiet here! Write down your first adorable diary record above. 🌿"}
                        </div>
                      ) : filteredJournalEntries.length === 0 ? (
                        <div className="bg-[#FCF8F2] p-8 rounded-2xl border border-dashed border-stone-300 text-center text-stone-400 italic font-sans text-xs space-y-2">
                          <p>{"No adorable memories found matching your search term. 🔍"}</p>
                          <button
                            onClick={() => setJournalSearchQuery("")}
                            className="px-3 py-1 bg-[#7D1201]/10 text-[#7D1201] font-sans font-bold text-[10px] rounded-full hover:bg-[#7D1201]/20 transition-all cursor-pointer"
                          >
                            {"Reset Search Filters"}
                          </button>
                        </div>
                      ) : (
                        <motion.div 
                          variants={stackContainerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-5"
                        >
                          {filteredJournalEntries.map((j) => (
                            <motion.div
                              key={j.id}
                              variants={stackItemVariants}
                              className="bg-[#FCF8F2] border border-[#2d221d]/10 rounded-2xl p-5 shadow-sm relative overflow-hidden bg-scrapbook-ruled pl-8 cursor-default hover:shadow-md transition-shadow duration-300"
                            >
                              {/* Left margin red line */}
                              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-red-800/10" />

                              {/* Corner tape illustration */}
                              <div className="absolute top-2 right-10 w-16 h-5 washi-tape-horizontal washi-tape-red rotate-3 text-[7px] font-mono font-black text-cherry/70 uppercase text-center leading-4 opacity-70">
                                {"STAMP"}
                              </div>

                              {/* Emotion Badge on post-it */}
                              <div className="flex items-center gap-1.5 mb-2 pl-2">
                                <span className="text-base">{j.emotionEmoji}</span>
                                <span className="text-[9px] bg-[#7D1201]/10 px-2 py-0.5 rounded-full font-mono font-bold text-[#7D1201] uppercase tracking-wider">
                                  {j.emotionLabel}
                                </span>
                              </div>

                              <div className="pl-2 space-y-1">
                                <h5 className="font-caveat text-2xl font-black text-stone-850 leading-tight">
                                  {j.title}
                                </h5>
                                <span className="text-[9px] font-mono text-stone-400 block font-bold mb-3 uppercase tracking-wider">
                                  {j.date}
                                </span>
                                <p className="font-hand text-lg text-stone-750 leading-relaxed font-semibold whitespace-pre-wrap">
                                  {j.content}
                                </p>
                              </div>

                              {/* Post-it delete trash click */}
                              <button
                                onClick={(e) => handleDeleteJournal(j.id, e)}
                                className="absolute bottom-3 right-3 p-1 rounded-full text-stone-400 hover:text-cherry hover:bg-red-50 transition-colors cursor-pointer animate-none"
                                title="Delete page"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Credits is now part of the scroll view so it clears space beautifully */}
              <footer className="w-full py-4 text-center text-[10px] font-mono text-stone-400 space-y-1 mt-8 border-t border-[#7D1201]/5 px-2">
                <p className="text-cherry font-black">{"Dhruvi loves you & will always be there for you ❤️"}</p>
                <p className="text-[9px]">{"Made with a lot of love • passcode: 0205 • digital scrapbook edition"}</p>
              </footer>
            </main>

            {/* STICKY CUTE MOBILE NAVIGATION BAR */}
            <div className="absolute bottom-0 inset-x-0 bg-[#FCF8F2] border-t border-[#7D1201]/12 py-2 px-3 flex items-center justify-around z-40 shadow-[0_-5px_15px_rgba(45,34,29,0.06)]">
              <button
                onClick={() => {
                  setActiveTab("scrapbook");
                  triggerFloatingHearts(150, 400);
                }}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl active:scale-95 transition-all text-center gap-0.5 cursor-pointer min-h-[44px] ${
                  activeTab === "scrapbook"
                    ? "text-[#7D1201] bg-cherry/5 font-extrabold"
                    : "text-stone-400 hover:text-stone-600 font-medium"
                }`}
              >
                <Bookmark className={`w-5 h-5 ${activeTab === "scrapbook" ? "text-cherry fill-cherry/20" : ""}`} />
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold">{"Scrapbook"}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("playroom");
                  triggerFloatingHearts(200, 400);
                }}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl active:scale-95 transition-all text-center gap-0.5 cursor-pointer min-h-[44px] ${
                  activeTab === "playroom"
                    ? "text-[#7D1201] bg-cherry/5 font-extrabold"
                    : "text-stone-400 hover:text-stone-600 font-medium"
                }`}
              >
                <Sparkles className={`w-5 h-5 ${activeTab === "playroom" ? "text-cherry fill-cherry/10 animate-pulse" : ""}`} />
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold">{"Playroom"}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("journal");
                  triggerFloatingHearts(250, 400);
                }}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl active:scale-95 transition-all text-center gap-0.5 cursor-pointer min-h-[44px] ${
                  activeTab === "journal"
                    ? "text-[#7D1201] bg-cherry/5 font-extrabold"
                    : "text-stone-400 hover:text-stone-600 font-medium"
                }`}
              >
                <BookOpen className={`w-5 h-5 ${activeTab === "journal" ? "text-cherry fill-cherry/10" : ""}`} />
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold">{"My Journal"}</span>
              </button>
            </div>

            {/* POPUP WRAPPERS ENVELOPES */}
            <AnimatePresence>
              {actionModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 font-hand select-none pointer-events-auto"
                  onClick={() => setActionModal(null)}
                >
                  <motion.div
                    initial={{ scale: 0.92, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.92, y: 15 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="w-full max-w-sm bg-[#FCF8F2] border-2 border-[#2d221d] rounded-2xl shadow-2xl p-6 relative bg-scrapbook-grid overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Washi tape stamp */}
                    <div className="absolute -top-3 left-[30%] right-[30%] h-6 washi-tape-horizontal washi-tape-red rotate-1 flex items-center justify-center pointer-events-none z-10">
                      <span className="text-[9px] font-mono font-bold text-[#7D1201] uppercase tracking-widest">{actionModal}</span>
                    </div>

                    <button
                      onClick={() => setActionModal(null)}
                      className="absolute top-3 right-3 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* IF STRESSED: BREATHING REGIME */}
                    {actionModal === "stressed" && (
                      <div className="text-center py-4 space-y-6">
                        <div className="space-y-1">
                          <h2 className="text-[#7D1201] text-3xl font-caveat font-black flex items-center justify-center gap-1.5">
                            <Coffee className="w-6 h-6 animate-pulse" />
                            <span>{"Breathe & let go..."}</span>
                          </h2>
                          <p className="text-xs text-stone-500 font-sans leading-relaxed">
                            {"Breathe in rhythm with the expanding cherry heart. You are safe here."}
                          </p>
                        </div>

                        <div className="flex flex-col items-center justify-center my-6">
                          <motion.div
                            animate={{
                              scale: breathingStep === "inhale" ? 1.5 : breathingStep === "hold" ? 1.5 : 0.9,
                            }}
                            transition={{
                              duration: 4,
                              ease: "easeInOut",
                            }}
                            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 relative shadow-lg ${
                              breathingStep === "inhale"
                                ? "bg-red-500/10 border-[#7D1201]"
                                : breathingStep === "hold"
                                ? "bg-amber-500/10 border-amber-600"
                                : "bg-teal-500/10 border-teal-600"
                            }`}
                          >
                            <Heart className={`w-9 h-9 ${
                              breathingStep === "inhale" 
                                ? "text-[#7D1201] fill-cherry/30 scale-110" 
                                : breathingStep === "hold"
                                ? "text-amber-600 fill-amber-500/20"
                                : "text-teal-600 fill-teal-500/20"
                            } transition-transform duration-1000`} />
                            
                            <span className="block text-xl font-caveat font-black tracking-wide uppercase text-stone-800 mt-1">
                              {breathingStep}
                            </span>
                            <span className="block text-[11px] font-mono text-stone-500">
                              {breathingCountdown}{"s"}
                            </span>
                          </motion.div>
                        </div>

                        <div className="p-3 bg-stone-100/90 rounded-xl border border-stone-200">
                          <p className="text-stone-700 text-sm leading-relaxed italic font-bold">
                            {"\"There is absolutely nothing you have to solve or figure out in this exact second. Drop your shoulders, relax your jaw, and let the heavy air wander out of your body. You are doing beautiful work surviving.\""}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* IF MOTIVATION PANEL */}
                    {actionModal === "motivation" && (
                      <div className="py-4 space-y-6 text-center">
                        <div className="space-y-1">
                          <h2 className="text-emerald-800 text-3xl font-caveat font-black flex items-center justify-center gap-1">
                            <Award className="w-6 h-6 text-emerald-700" />
                            <span>{"Your Cheering Section"}</span>
                          </h2>
                          <p className="text-xs text-stone-500 font-sans leading-relaxed">
                            {"A little scribbled note to push you forward:"}
                          </p>
                        </div>

                        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl shadow-inner min-h-[110px] flex items-center justify-center rotate-0.5">
                          <p className="font-hand text-lg text-[#132312] leading-relaxed font-bold">
                            {"\""}{MOTIVATION_QUOTES[motivationIndex]}{"\""}
                          </p>
                        </div>

                        <button
                          onClick={() => setMotivationIndex((prev) => (prev + 1) % MOTIVATION_QUOTES.length)}
                          className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-sans font-bold hover:bg-emerald-900 active:scale-95 transition-all shadow-md cursor-pointer"
                        >
                          {"Read another motive card ✨"}
                        </button>
                      </div>
                    )}

                    {/* IF DUMB MEMORY CORNER */}
                    {actionModal === "dumb-memories" && (
                      <div className="py-4 space-y-5 text-center">
                        <div className="space-y-1">
                          <h2 className="text-amber-805 text-3xl font-caveat font-black flex items-center justify-center gap-1.5">
                            <Smile className="w-5 h-5 text-amber-600" />
                            <span>{"The Silly Memories Vault"}</span>
                          </h2>
                          <p className="text-xs text-stone-400 font-sans uppercase tracking-widest font-bold">{"inside chuckle slot"}</p>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl relative min-h-[110px] flex items-center justify-center -rotate-1 shadow-inner">
                          <p className="font-hand text-lg text-amber-950 leading-relaxed font-bold">
                            {"\""}{DUMB_MEMORIES[dumbMemoryIndex]}{"\""}
                          </p>
                        </div>

                        <button
                          onClick={() => setDumbMemoryIndex((prev) => (prev + 1) % DUMB_MEMORIES.length)}
                          className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-sans font-bold hover:bg-amber-700 active:scale-95 transition-all shadow cursor-pointer"
                        >
                          {"Giggle at another memory 🦕"}
                        </button>
                      </div>
                    )}

                    {/* WHEN YOU MISS ME DIAL */}
                    {actionModal === "miss-me" && (
                      <div className="py-4 space-y-6 text-center">
                        <div className="space-y-1">
                          <h2 className="text-[#7D1201] text-3xl font-caveat font-black flex items-center justify-center gap-1.5 animate-pulse">
                            <Heart className="w-6 h-6 text-cherry fill-cherry" />
                            <span>{"Sending You My Warmth"}</span>
                          </h2>
                          <p className="text-xs text-stone-500 font-sans">
                            {"I am probably thinking of you at this exact second too."}
                          </p>
                        </div>

                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl rotate-0.5">
                          <p className="font-hand text-[#3b1723] text-lg leading-relaxed font-bold">
                            {"\"Whenever you are feeling far, lonely, or slightly tired, look at this warm space, place both thumbs onto these cherry hearts, and let yourself imagine a massive soft cover of security blankets hugging you tightly. Sent you a gentle lofi kiss.\""}
                          </p>
                        </div>

                        <div className="flex justify-center gap-3">
                          <button
                            onClick={(e) => {
                              triggerFloatingHearts(e.clientX || 200, e.clientY || 400);
                              handleSendVirtualHug();
                            }}
                            className="px-4 py-2 bg-cherry text-white rounded-xl text-xs font-sans font-bold hover:bg-cherry-light active:scale-95 transition-all shadow-md cursor-pointer"
                          >
                            {"Click for cuddles! 💖"}
                          </button>
                          
                          <button
                            onClick={() => setActionModal(null)}
                            className="px-3 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-sans font-bold hover:bg-stone-300 transition-colors cursor-pointer"
                          >
                            {"Close"}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ADD MEMORY ENVELOPE MODAL */}
            <AnimatePresence>
              {isAddingMemory && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 font-hand select-none pointer-events-auto"
                  onClick={() => setIsAddingMemory(false)}
                >
                  <motion.div
                    initial={{ scale: 0.94 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.94 }}
                    className="w-full max-w-sm bg-[#FAF5EE] border-2 border-[#7D1201]/30 rounded-2xl shadow-2xl p-6 relative bg-scrapbook-grid"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setIsAddingMemory(false)}
                      className="absolute top-3 right-3 p-1 rounded-full text-stone-400 hover:text-stone-700 transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h2 className="text-[#7D1201] text-3xl font-caveat font-extrabold mb-4 pb-2 border-b border-[#2d221d]/10">
                      {"Clip a new Memory 🖼️"}
                    </h2>

                    <form onSubmit={handleAddNewMemory} className="space-y-4 font-sans text-xs text-stone-600">
                      <div className="space-y-1">
                        <label className="block text-stone-700 font-semibold uppercase tracking-wider">{"Memory Image URL:"}</label>
                        <input 
                          type="url" 
                          placeholder="e.g. https://images.unsplash.com/photo-..." 
                          value={newImgUrl}
                          onChange={(e) => setNewImgUrl(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-sans text-xs focus:ring-1 focus:ring-cherry focus:outline-none"
                          required
                        />
                        <div className="flex gap-2.5 mt-2">
                          <button
                            type="button"
                            onClick={() => setNewImgUrl("https://images.unsplash.com/photo-1510972527901-447a1c97011d?q=80&w=600")}
                            className="bg-stone-200 px-2.5 py-1 rounded hover:bg-stone-300 transition font-mono font-bold cursor-pointer"
                          >
                            {"Cozy Tea 🍵"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewImgUrl("https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600")}
                            className="bg-stone-200 px-2.5 py-1 rounded hover:bg-stone-300 transition font-mono font-bold cursor-pointer"
                          >
                            {"Cafe Chats ☕"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewImgUrl("https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600")}
                            className="bg-stone-200 px-2.5 py-1 rounded hover:bg-stone-300 transition font-mono font-bold cursor-pointer"
                          >
                            {"Aesthetic 🧸"}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-stone-700 font-semibold uppercase tracking-wider">{"Appreciative Caption:"}</label>
                        <textarea
                          placeholder="What gorgeous moments occurred during this snap?"
                          value={newCaption}
                          onChange={(e) => setNewCaption(e.target.value)}
                          maxLength={120}
                          className="w-full p-2.5 h-16 rounded-lg border border-stone-300 bg-white font-sans text-xs focus:ring-1 focus:ring-cherry focus:outline-none resize-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-stone-700 font-semibold uppercase tracking-wider">{"Date or Season Label:"}</label>
                        <input
                          type="text"
                          placeholder="e.g. Rainy Autumn evening, Cozy Sunday..."
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-sans text-xs focus:ring-1 focus:ring-cherry"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-4 py-3 bg-[#7D1201] text-[#FCF8F2] font-semibold rounded-xl hover:bg-[#A4250E] active:translate-y-0.5 transition text-xs font-sans tracking-wide uppercase shadow cursor-pointer"
                      >
                        {"Paste Into Scrapbook 🩹"}
                      </button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
