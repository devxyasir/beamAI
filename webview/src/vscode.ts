// VS Code API wrapper for webview

declare global {
  interface Window {
    acquireVsCodeApi: () => VSCodeApi;
  }
}

interface VSCodeApi {
  postMessage(message: any): void;
  setState(state: any): void;
  getState(): any;
}

class VSCodeAPIWrapper {
  private readonly api: VSCodeApi;

  constructor() {
    this.api = window.acquireVsCodeApi();
  }

  public postMessage(message: any): void {
    this.api.postMessage(message);
  }

  public setState(state: any): void {
    this.api.setState(state);
  }

  public getState(): any {
    return this.api.getState();
  }
}

export const vscode = new VSCodeAPIWrapper();
