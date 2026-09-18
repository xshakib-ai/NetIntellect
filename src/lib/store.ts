import { useState, useEffect } from 'react';
import { evidenceFiles as initialEvidence, entities as initialEntities, graphNodes as initialNodes, graphEdges as initialEdges } from './mockData';

const STORAGE_KEY = 'netintellect_investigations_v1';

export interface Investigation {
    id: string;
    name: string;
    evidence: any[];
    entities: any[];
    nodes: any[];
    edges: any[];
}

const getInitialState = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Local storage decode failed", e)
        }
    }

    const demoCase: Investigation = {
        id: "CASE-DEMO",
        name: "Demo Investigation",
        evidence: initialEvidence,
        entities: initialEntities,
        nodes: initialNodes,
        edges: initialEdges,
    };

    return {
        activeCaseId: "CASE-DEMO",
        cases: {
            "CASE-DEMO": demoCase,
        }
    };
};

let rawState = getInitialState();
const listeners = new Set<(state: any) => void>();

const getDerivedState = () => {
    const activeCase = rawState.cases[rawState.activeCaseId] || { id: "UNKNOWN", name: "Empty", evidence: [], entities: [], nodes: [], edges: [] };
    return {
        ...rawState,
        evidence: activeCase.evidence,
        entities: activeCase.entities,
        nodes: activeCase.nodes,
        edges: activeCase.edges,
    };
};

export const updateGlobalState = (updates: any) => {
    if (updates.evidence || updates.entities || updates.nodes || updates.edges) {
        const activeCase = rawState.cases[rawState.activeCaseId];
        rawState.cases[rawState.activeCaseId] = {
            ...activeCase,
            evidence: updates.evidence || activeCase.evidence,
            entities: updates.entities || activeCase.entities,
            nodes: updates.nodes || activeCase.nodes,
            edges: updates.edges || activeCase.edges,
        };
    }

    if (updates.activeCaseId) rawState.activeCaseId = updates.activeCaseId;
    if (updates.cases) rawState.cases = updates.cases;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(rawState));
    const derived = getDerivedState();
    listeners.forEach(l => l(derived));
};

export const createNewCase = (id: string, name: string) => {
    const newCase: Investigation = { id, name, evidence: [], entities: [], nodes: [], edges: [] };
    rawState.cases[id] = newCase;
    rawState.activeCaseId = id;
    updateGlobalState({});
}

export const switchCase = (id: string) => {
    if (rawState.cases[id]) {
        updateGlobalState({ activeCaseId: id });
    }
}

export const getGlobalState = () => getDerivedState();

export function useGlobalState() {
    const [state, setState] = useState(getDerivedState());
    useEffect(() => {
        const derived = getDerivedState();
        setState(derived);
        listeners.add(setState);
        return () => { listeners.delete(setState); };
    }, []);
    return state;
}
