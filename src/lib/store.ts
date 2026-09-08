import { useState, useEffect } from 'react';
import { evidenceFiles as initialEvidence, entities as initialEntities, graphNodes as initialNodes, graphEdges as initialEdges } from './mockData';

const STORAGE_KEY = 'netintellect_global_data';

const getInitialState = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Local storage decode failed", e)
        }
    }
    return {
        evidence: initialEvidence,
        entities: initialEntities,
        nodes: initialNodes,
        edges: initialEdges,
    };
};

let globalState = getInitialState();
const listeners = new Set<(state: any) => void>();

export const updateGlobalState = (updates: any) => {
    globalState = { ...globalState, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    listeners.forEach(l => l(globalState));
};

export const getGlobalState = () => globalState;

export function useGlobalState() {
    const [state, setState] = useState(globalState);
    useEffect(() => {
        listeners.add(setState);
        return () => { listeners.delete(setState); };
    }, []);
    return state;
}
