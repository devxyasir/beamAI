export interface BeamMessage {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: string;
    thinking?: {
        status: string;
        progress: number;
    };
    plan?: ExecutionPlan;
    changes?: FileChange[];
    narrative?: string;
    recommendations?: string[];
    confidence?: number;
    changeId?: string;
    status?: 'thinking' | 'planning' | 'executing' | 'verifying' | 'completed' | 'failed';
    appliedAt?: string;
}

export interface ExecutionPlan {
    subtasks: SubTask[];
    riskLevel: number;
    estimatedImpact: string;
}

export interface SubTask {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface FileChange {
    file: string;
    linesAdded: number;
    linesRemoved: number;
    isNewFile: boolean;
    summary: string;
}
