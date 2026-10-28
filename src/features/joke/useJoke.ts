import {useEffect, useState} from 'react';
import {
    fetchRandomJoke,
    Joke,
} from '../../api/jokes';
import {
    trackJokeLoaded,
    trackJokeRefreshed,
} from '../../analytics';

const AUTO_REFRESH_MS = 30_000;

export const useJoke = () => {
    const [joke, setJoke] = useState<Joke | null>(null);
    const [refreshCount, setRefreshCount] = useState(0);
    
    const loadJoke = async () => {
        const next = await fetchRandomJoke();
        setJoke(next);
        trackJokeLoaded({
            joke_id: next.id,
            refresh_count: refreshCount,
        });
    };
    
    useEffect(() => {
        loadJoke();
        
        const timer = setInterval(() => {
            loadJoke();
        }, AUTO_REFRESH_MS);
        
        return () => clearInterval(timer);
    }, []);
    
    const refresh = () => {
        setRefreshCount((c) => c + 1);
        loadJoke();
        trackJokeRefreshed();
    };
    
    return {
        joke,
        refresh,
    };
};
