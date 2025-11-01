import axios, { AxiosInstance } from 'axios';
import * as vscode from 'vscode';
import { BeamApiResponse, ContextInfo, DiffData } from '../types/beam';

export class BeamApiClient {
    private client: AxiosInstance;
    private apiUrl: string;

    constructor() {
        this.apiUrl = this.getApiUrl();
        this.client = axios.create({
            baseURL: this.apiUrl,
            timeout: 300000, // 5 minutes
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    private getApiUrl(): string {
        const config = vscode.workspace.getConfiguration('beam');
        return config.get<string>('apiUrl') || 'http://localhost:8000';
    }

    async executeTask(
        instruction: string,
        context: ContextInfo,
        onProgress?: (data: BeamApiResponse) => void
    ): Promise<BeamApiResponse> {
        try {
            const response = await this.client.post<BeamApiResponse>('/api/task', {
                instruction,
                project_path: context.workspacePath,
                context: {
                    current_file: context.currentFile,
                    selected_code: context.selectedCode,
                    cursor_position: context.cursorPosition
                }
            });

            return response.data;
        } catch (error) {
            console.error('API error:', error);
            throw new Error(this.getErrorMessage(error));
        }
    }

    async applyChanges(changeId: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await this.client.post('/api/changes/apply', {
                change_id: changeId
            });
            return response.data;
        } catch (error) {
            throw new Error(this.getErrorMessage(error));
        }
    }

    async getDiff(changeId: string, file: string): Promise<DiffData> {
        try {
            const response = await this.client.get<DiffData>(
                `/api/changes/${changeId}/diff`,
                {
                    params: { file }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(this.getErrorMessage(error));
        }
    }

    async explainCode(file: string, code: string, lines?: [number, number]): Promise<string> {
        try {
            const response = await this.client.post<{ explanation: string }>('/api/explain', {
                file,
                code,
                lines
            });
            return response.data.explanation;
        } catch (error) {
            throw new Error(this.getErrorMessage(error));
        }
    }

    async fixError(
        file: string,
        error: string,
        line: number,
        code?: string
    ): Promise<BeamApiResponse> {
        try {
            const response = await this.client.post<BeamApiResponse>('/api/fix', {
                file,
                error,
                line,
                code
            });
            return response.data;
        } catch (error) {
            throw new Error(this.getErrorMessage(error));
        }
    }

    private getErrorMessage(error: any): string {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED') {
                return 'Cannot connect to Beam API. Make sure the server is running.';
            }
            if (error.response) {
                return error.response.data?.error || error.response.statusText;
            }
            return error.message;
        }
        return 'An unexpected error occurred';
    }

    async checkHealth(): Promise<boolean> {
        try {
            await this.client.get('/health');
            return true;
        } catch {
            return false;
        }
    }
}
