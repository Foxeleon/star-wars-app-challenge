"use client";

import { useRef, useState, useEffect } from "react";
import { Music, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AmbientMusicToggle() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // This function will be our single point of truth for playing or pausing.
    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Audio play failed:", error);
                setIsPlaying(false);
            });
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    // This effect handles the "smart" autoplay on the first user interaction.
    useEffect(() => {
        const handleFirstInteraction = () => {
            // We only try to play if the audio is currently paused.
            if (audioRef.current && audioRef.current.paused) {
                togglePlay();
            }
        };

        // This listener waits for the first click ANYWHERE on the page.
        window.addEventListener('click', handleFirstInteraction, { once: true });

        // Cleanup function.
        return () => {
            window.removeEventListener('click', handleFirstInteraction);
        };
    }, []); // Empty array ensures this runs only once.

    return (
        <>
            <audio ref={audioRef} loop preload="auto">
                <source src="/sounds/star-wars-theme.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                }}
                className="fixed top-4 right-4 z-50"
                aria-label={isPlaying ? "Pause ambient music" : "Play ambient music"}
            >
                {isPlaying ? <VolumeX className="h-5 w-5" /> : <Music className="h-5 w-5" />}
            </Button>
        </>
    );
}
