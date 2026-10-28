import {
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    fetchRandomJoke,
    Joke,
} from '../../api/jokes';
import {
    trackJokeLoadFailed,
    trackJokeLoaded,
    trackJokeRefreshed,
} from '../../analytics';

const AUTO_REFRESH_MS = 30_000;

export type JokeStatus = 'loading' | 'ready' | 'error';

export const useJoke = () => {
    const [joke, setJoke] = useState<Joke | null>(null);
    const [status, setStatus] = useState<JokeStatus>('loading');
    const refreshCount = useRef(0);
    const requestId = useRef(0);
    const mounted = useRef(true);
    
    const loadJoke = async () => {
        ++requestId.current;
        
        const id = requestId.current;
        const isStale = () => !mounted.current || id !== requestId.current;
        
        try {
            const next = await fetchRandomJoke();
            
            if (isStale())
                return;
            
            setJoke(next);
            setStatus('ready');
            trackJokeLoaded({
                joke_id: next.id,
                refresh_count: refreshCount.current,
            });
        } catch {
            if (isStale())
                return;
            
            setStatus('error');
            trackJokeLoadFailed({
                refresh_count: refreshCount.current,
            });
        }
    };
    
    useEffect(() => {
        mounted.current = true;
        loadJoke();
        
        const timer = setInterval(() => {
            loadJoke();
        }, AUTO_REFRESH_MS);
        
        return () => {
            mounted.current = false;
            clearInterval(timer);
        };
    }, []);
    
    const refresh = () => {
        ++refreshCount.current;
        loadJoke();
        trackJokeRefreshed();
    };
    
    return {
        joke,
        status,
        refresh,
    };
};
