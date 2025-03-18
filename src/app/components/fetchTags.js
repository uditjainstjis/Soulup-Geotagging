import { useState, useEffect } from 'react';

export const useFetchTags = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTagsData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/tags');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTags(data.tags);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
                console.error("Failed to fetch tags:", e);
            }
        };

        fetchTagsData();
    }, []);

    return { tags, loading, error };
};