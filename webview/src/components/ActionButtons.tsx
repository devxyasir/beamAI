import { vscode } from '../vscode';

interface ActionButtonsProps {
    changeId: string;
}

export default function ActionButtons({ changeId }: ActionButtonsProps) {
    const handleApplyAll = () => {
        if (confirm('Apply all changes to your codebase?')) {
            vscode.postMessage({ type: 'applyChanges', changeId });
        }
    };

    const handleReview = () => {
        // Open review mode - could show detailed diff view
        vscode.postMessage({ type: 'reviewChanges', changeId });
    };

    const handleReject = () => {
        if (confirm('Reject these changes?')) {
            vscode.postMessage({ type: 'rejectChanges', changeId });
        }
    };

    return (
        <div className="action-buttons">
            <button className="primary-button" onClick={handleApplyAll}>
                <span className="codicon codicon-check"></span>
                Apply All
            </button>
            <button className="secondary-button" onClick={handleReview}>
                <span className="codicon codicon-eye"></span>
                Review
            </button>
            <button className="secondary-button" onClick={handleReject}>
                <span className="codicon codicon-close"></span>
                Reject
            </button>
        </div>
    );
}
