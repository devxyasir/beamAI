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

export interface DiffData {
    file: string;
    diff: string;
    hunks: DiffHunk[];
}

export interface DiffHunk {
    oldStart: number;
    oldLines: number;
    newStart: number;
    newLines: number;
    lines: string[];
}

export interface BeamApiResponse {
    status: 'planning' | 'executing' | 'verifying' | 'completed' | 'failed';
    plan?: ExecutionPlan;
    progress?: {
        currentTask: number;
        totalTasks: number;
        message: string;
    };
    changes?: FileChange[];
    narrative?: string;
    recommendations?: string[];
    confidence?: number;
    changeId?: string;
    error?: string;
}

export interface ContextInfo {
    currentFile?: string;
    selectedCode?: string;
    cursorPosition?: {
        line: number;
        column: number;
    };
    workspacePath?: string;
}

export interface BeamConfig {
    apiUrl: string;
    autoApplyChanges: boolean;
    showConfidence: boolean;
    maxMessageHistory: number;
    streamingEnabled: boolean;
}
